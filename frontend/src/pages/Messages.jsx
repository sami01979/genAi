import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GetConversations } from '../api'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

const avatarColors = [
  'bg-blue-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-emerald-600',
  'bg-orange-500',
  'bg-teal-600',
]

const colorFor = (name = '') => {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return avatarColors[sum % avatarColors.length]
}

const formatTime = (date) => {
  const d = new Date(date)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

const Messages = () => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await GetConversations()
      setChats(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) load()
    else setLoading(false)
  }, [user?.id])

  useEffect(() => {
    if (!socket) return
    socket.on('message:new', load)
    return () => socket.off('message:new', load)
  }, [socket])

  if (!user) {
    return (
      <p className='p-6 font-outfit'>
        <Link to='/login' className='underline'>Log in</Link> to see your messages.
      </p>
    )
  }
  if (loading) return <p className='p-6 font-outfit'>Loading...</p>

  return (
    <div className='max-w-2xl mx-auto p-4 font-outfit'>
      <h1 className='text-2xl font-semibold mb-4'>Messages</h1>

      {chats.length === 0 ? (
        <div className='bg-white border rounded-2xl p-8 text-center text-gray-600 shadow-sm'>
          <p className='text-lg font-medium mb-1'>No conversations yet</p>
          <p className='text-sm'>Open someone's profile and press Message to start one.</p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {chats.map((c) => (
            <Link
              key={c.userId}
              to={`/messages/${c.userId}`}
              className={`flex items-center gap-3 rounded-2xl border p-3 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 ${
                c.unread > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
            >
              <div
                className={`${colorFor(c.name)} w-12 h-12 shrink-0 rounded-full text-white flex items-center justify-center text-lg font-semibold uppercase`}
              >
                {c.name?.[0] || '?'}
              </div>

              <div className='min-w-0 flex-1'>
                <div className='flex items-center justify-between gap-2'>
                  <p className='font-semibold truncate'>{c.name}</p>
                  <span className='text-xs text-gray-500 shrink-0'>{formatTime(c.lastAt)}</span>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <p
                    className={`truncate text-sm ${
                      c.unread > 0 ? 'font-semibold text-black' : 'text-gray-600'
                    }`}
                  >
                    {c.mine ? 'You: ' : ''}{c.lastMessage}
                  </p>
                  {c.unread > 0 && (
                    <span className='bg-blue-600 text-white text-xs rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center shrink-0'>
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Messages