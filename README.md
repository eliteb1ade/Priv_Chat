# 💬 Quick Chat App

A simple, temporary chat application with real-time messaging and emoji support. Chat rooms auto-delete after 5 minutes of inactivity.

## Features

- 🚀 **Instant Room Creation** - Generate unique chat rooms with shareable links
- 💬 **Real-time Messaging** - Powered by Socket.IO for instant communication
- 😀 **Emoji Support** - Choose from 15 different emojis for your messages
- ⏰ **Auto-cleanup** - Rooms automatically delete after 5 minutes of inactivity
- 📱 **Mobile Responsive** - Works great on all devices
- 🔗 **Shareable Links** - Copy room links to invite others
- 👥 **Live User Count** - See how many people are in the room

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm run dev:full
   ```

   This will start both the backend server (port 3001) and frontend (port 5173).

3. **Open your browser:**
   - Go to `http://localhost:5173`
   - Enter your name and create a new room
   - Share the room link with others to chat together!

## Manual Setup

If you prefer to run the frontend and backend separately:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## How It Works

1. **Create a Room**: Enter your name and click "Create Room" to generate a unique 8-character room ID
2. **Share the Link**: Copy the room link and share it with friends
3. **Start Chatting**: Send messages with your favorite emojis
4. **Auto-cleanup**: Rooms automatically delete after 5 minutes with no active users

## Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Node.js + Express + Socket.IO
- **Real-time**: WebSocket connections via Socket.IO
- **Styling**: Custom CSS with gradient themes

## Room Management

- Rooms are identified by unique 8-character IDs
- Maximum 100 messages per room (older messages are automatically removed)
- Rooms auto-delete after 5 minutes of inactivity
- Real-time user count and join/leave notifications

## Development

The app uses:
- Socket.IO for real-time bidirectional communication
- Express.js for the REST API endpoints
- React hooks for state management
- CSS Grid and Flexbox for responsive layouts

Perfect for quick team discussions, temporary support chats, or casual conversations without the need for accounts or permanent storage!

## 🚀 Free Deployment Options

### Option 1: Firebase (Google - Completely Free)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Create project at [Firebase Console](https://console.firebase.google.com)
4. Run: `firebase init` (select Functions + Hosting)
5. Deploy: `firebase deploy`
6. **See [FIREBASE_DEPLOY.md](FIREBASE_DEPLOY.md) for detailed guide**

### Option 2: Render (Recommended - Easiest)
1. Fork this repo to your GitHub
2. Go to [render.com](https://render.com) and sign up (free)
3. Click "New Web Service" and connect your GitHub repo
4. Render will auto-detect the `render.yaml` config
5. Deploy! Your app will be live at `https://your-app-name.onrender.com`

### Option 2: Railway
1. Fork this repo to your GitHub
2. Go to [railway.app](https://railway.app) and sign up (free)
3. Click "Deploy from GitHub repo" and select your fork
4. Railway will auto-detect the `railway.json` config
5. Deploy! Your app will be live at `https://your-app-name.up.railway.app`

### Option 3: Heroku (if you have access)
1. Fork this repo to your GitHub
2. Create a new Heroku app
3. Connect your GitHub repo
4. The `Procfile` will handle the deployment
5. Deploy from the Heroku dashboard

### Local Development
For local development, the app runs on separate ports:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

But when deployed, everything runs on a single port with the backend serving the frontend files.

## Environment Variables
- `NODE_ENV`: Set to `production` for deployment (auto-handled by hosting platforms)
- `PORT`: Auto-provided by hosting platforms
- `VITE_SERVER_URL`: Leave empty for production (uses same origin)