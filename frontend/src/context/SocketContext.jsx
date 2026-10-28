import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { GetUnreadCount } from '../api'

const SocketContext = createContext({ socket: null, unread: 0, refreshUnread: () => {} })

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const userId = user?.id
  const [socket, setSocket] = useState(null)
  const [unread, setUnread] = useState(0)

  const refreshUnread = useCallback(async () => {
    try {
      const res = await GetUnreadCount()
      setUnread(res.data.data.count)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!userId || !token) {
      setSocket(null)
      setUnread(0)
      return
    }

    const url = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '')
    const s = io(url, { auth: { token } })
    setSocket(s)
    refreshUnread()

    s.on('message:new', (m) => {
      if (m.receiver === userId) refreshUnread()
    })

    return () => {
      s.disconnect()
    }
  }, [userId, refreshUnread])

  return (
    <SocketContext.Provider value={{ socket, unread, refreshUnread }}>
      {children}
    </SocketContext.Provider>
  )
}