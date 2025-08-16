import { useState, useEffect, useRef } from 'react'

const EMOJI_OPTIONS = ['💬', '😀', '😂', '❤️', '👍', '🎉', '🔥', '💯', '🚀', '⭐', '🌟', '💡', '🎯', '🎨', '🎵']

const ChatRoom = ({ socket, roomId, username, onLeaveRoom }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('💬')
  const [userCount, setUserCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!socket) return

    socket.emit('join-room', { roomId, username })

    socket.on('room-joined', (data) => {
      setIsConnected(true)
      setUserCount(data.userCount)
    })

    socket.on('previous-messages', (msgs) => {
      setMessages(msgs)
    })

    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, message])
    })

    socket.on('user-joined', (data) => {
      setUserCount(data.userCount)
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        message: `${data.username} joined the chat`,
        timestamp: new Date().toISOString()
      }])
    })

    socket.on('user-left', (data) => {
      setUserCount(data.userCount)
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        message: `${data.username} left the chat`,
        timestamp: new Date().toISOString()
      }])
    })

    socket.on('error', (error) => {
      alert(error)
      onLeaveRoom()
    })

    return () => {
      socket.off('room-joined')
      socket.off('previous-messages')
      socket.off('new-message')
      socket.off('user-joined')
      socket.off('user-left')
      socket.off('error')
    }
  }, [socket, roomId, username, onLeaveRoom])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    socket.emit('send-message', {
      message: newMessage.trim(),
      emoji: selectedEmoji
    })

    setNewMessage('')
  }

  const copyRoomLink = () => {
    const link = `${window.location.origin}?room=${roomId}`
    navigator.clipboard.writeText(link)
    alert('Room link copied to clipboard!')
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!isConnected) {
    return (
      <div className="chat-room loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Connecting to room...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div className="room-info">
          <h2>💬 Room: {roomId}</h2>
          <span className="user-count">👥 {userCount} online</span>
        </div>
        <div className="header-actions">
          <button onClick={copyRoomLink} className="copy-btn">
            🔗 Copy Link
          </button>
          <button onClick={onLeaveRoom} className="leave-btn">
            🚪 Leave
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.type === 'system' ? 'system-message' : ''} ${msg.username === username ? 'own-message' : ''}`}
          >
            {msg.type === 'system' ? (
              <div className="system-text">
                ℹ️ {msg.message}
              </div>
            ) : (
              <>
                <div className="message-header">
                  <span className="message-emoji">{msg.emoji}</span>
                  <span className="message-username">{msg.username}</span>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-content">{msg.message}</div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <div className="emoji-selector">
          <select 
            value={selectedEmoji} 
            onChange={(e) => setSelectedEmoji(e.target.value)}
            className="emoji-select"
          >
            {EMOJI_OPTIONS.map(emoji => (
              <option key={emoji} value={emoji}>{emoji}</option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          maxLength={500}
          className="message-input"
        />
        <button type="submit" disabled={!newMessage.trim()} className="send-btn">
          🚀 Send
        </button>
      </form>
    </div>
  )
}

export default ChatRoom