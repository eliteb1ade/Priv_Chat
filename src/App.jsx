import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import ChatRoom from './components/ChatRoom'
import RoomCreator from './components/RoomCreator'
import './App.css'

function App() {
  const [socket, setSocket] = useState(null)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || window.location.origin
    const newSocket = io(serverUrl)
    setSocket(newSocket)

    return () => newSocket.close()
  }, [])

  useEffect(() => {
    // Check if there's a room ID in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const roomId = urlParams.get('room')
    if (roomId) {
      setCurrentRoom(roomId)
    }
  }, [])

  const joinRoom = (roomId, user) => {
    setCurrentRoom(roomId)
    setUsername(user)
    // Update URL without page reload
    window.history.pushState({}, '', `?room=${roomId}`)
  }

  const leaveRoom = () => {
    setCurrentRoom(null)
    setUsername('')
    window.history.pushState({}, '', '/')
  }

  return (
    <div className="app">
      {!currentRoom ? (
        <RoomCreator onJoinRoom={joinRoom} />
      ) : (
        <ChatRoom
          socket={socket}
          roomId={currentRoom}
          username={username}
          onLeaveRoom={leaveRoom}
        />
      )}
    </div>
  )
}

export default App
