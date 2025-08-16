const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Configure CORS for both development and production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow all origins in production
    : ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST"],
  credentials: true
};

const io = socketIo(server, {
  cors: corsOptions
});

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the React app build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Store active rooms and their cleanup timers
const activeRooms = new Map();
const roomTimers = new Map();

// Generate a new room
app.post('/api/create-room', (req, res) => {
  const roomId = uuidv4().substring(0, 8);
  activeRooms.set(roomId, {
    users: new Set(),
    messages: [],
    createdAt: new Date()
  });
  
  res.json({ roomId });
});

// Get room info
app.get('/api/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = activeRooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json({
    exists: true,
    userCount: room.users.size,
    messageCount: room.messages.length
  });
});

// Clean up empty room after 5 minutes
function scheduleRoomCleanup(roomId) {
  // Clear existing timer if any
  if (roomTimers.has(roomId)) {
    clearTimeout(roomTimers.get(roomId));
  }
  
  const timer = setTimeout(() => {
    const room = activeRooms.get(roomId);
    if (room && room.users.size === 0) {
      activeRooms.delete(roomId);
      roomTimers.delete(roomId);
      console.log(`Room ${roomId} cleaned up due to inactivity`);
    }
  }, 5 * 60 * 1000); // 5 minutes
  
  roomTimers.set(roomId, timer);
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, username }) => {
    const room = activeRooms.get(roomId);
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username;
    
    room.users.add(socket.id);
    
    // Clear cleanup timer since room is active
    if (roomTimers.has(roomId)) {
      clearTimeout(roomTimers.get(roomId));
      roomTimers.delete(roomId);
    }

    // Send existing messages to the new user
    socket.emit('previous-messages', room.messages);
    
    // Notify others about new user
    socket.to(roomId).emit('user-joined', {
      username,
      userCount: room.users.size
    });
    
    socket.emit('room-joined', {
      roomId,
      userCount: room.users.size
    });
  });

  socket.on('send-message', ({ message, emoji }) => {
    const { roomId, username } = socket;
    const room = activeRooms.get(roomId);
    
    if (!room) return;

    const messageData = {
      id: uuidv4(),
      username,
      message,
      emoji: emoji || '💬',
      timestamp: new Date().toISOString()
    };

    room.messages.push(messageData);
    
    // Keep only last 100 messages
    if (room.messages.length > 100) {
      room.messages = room.messages.slice(-100);
    }

    io.to(roomId).emit('new-message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.roomId) {
      const room = activeRooms.get(socket.roomId);
      if (room) {
        room.users.delete(socket.id);
        
        socket.to(socket.roomId).emit('user-left', {
          username: socket.username,
          userCount: room.users.size
        });
        
        // Schedule cleanup if room is empty
        if (room.users.size === 0) {
          scheduleRoomCleanup(socket.roomId);
        }
      }
    }
  });
});

// Serve React app for any non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});