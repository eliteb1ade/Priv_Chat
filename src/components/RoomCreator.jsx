import { useState } from 'react'

const RoomCreator = ({ onJoinRoom }) => {
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const createRoom = async () => {
    if (!username.trim()) return
    
    setIsCreating(true)
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
      const response = await fetch(`${serverUrl}/api/create-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      onJoinRoom(data.roomId, username.trim())
    } catch (error) {
      console.error('Error creating room:', error)
    }
    setIsCreating(false)
  }

  const joinExistingRoom = async () => {
    if (!username.trim() || !roomId.trim()) return
    
    setIsJoining(true)
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
      const response = await fetch(`${serverUrl}/api/room/${roomId.trim()}`)
      if (response.ok) {
        onJoinRoom(roomId.trim(), username.trim())
      } else {
        alert('Room not found!')
      }
    } catch (error) {
      console.error('Error joining room:', error)
      alert('Error joining room!')
    }
    setIsJoining(false)
  }

  return (
    <div className="room-creator">
      <div className="welcome-header">
        <h1>💬 Quick Chat</h1>
        <p>Create temporary chat rooms that auto-delete after 5 minutes of inactivity</p>
      </div>

      <div className="username-input">
        <input
          type="text"
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
        />
      </div>

      <div className="room-actions">
        <div className="create-section">
          <h3>🚀 Create New Room</h3>
          <button 
            onClick={createRoom}
            disabled={!username.trim() || isCreating}
            className="create-btn"
          >
            {isCreating ? '⏳ Creating...' : '✨ Create Room'}
          </button>
        </div>

        <div className="divider">OR</div>

        <div className="join-section">
          <h3>🔗 Join Existing Room</h3>
          <input
            type="text"
            placeholder="Enter room ID..."
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            maxLength={8}
          />
          <button 
            onClick={joinExistingRoom}
            disabled={!username.trim() || !roomId.trim() || isJoining}
            className="join-btn"
          >
            {isJoining ? '⏳ Joining...' : '🚪 Join Room'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomCreator