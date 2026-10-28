import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { GetChat, SendMessage, MarkRead, ToggleBlock } from '../api'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

const Chat = () => {
  const { userId } = useParams()
  const { user } = useAuth()
  const { socket, refreshUnread } = useSocket()

  const [other, setOther] = useState(null)
  const [messages, setMessages] = useState([])
  const [blockedByMe, setBlockedByMe] = useState(false)
  const [blockedByThem, setBlockedByThem] = useState(false)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef(null)

  const addMessage = (m) =>
    setMessages((prev) => (prev.some((x) => x._id === m._id) ? prev : [...prev, m]))


  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await GetChat(userId)
        const d = res.data.data
        setOther(d.other)
        setMessages(d.messages)
        setBlockedByMe(d.blockedByMe)
        setBlockedByThem(d.blockedByThem)
        refreshUnread()
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this chat')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId, user?.id])


  useEffect(() => {
    if (!socket) return
    const onNew = (m) => {
      const mine = m.sender === user?.id
      const peer = mine ? m.receiver : m.sender
      if (peer !== userId) return
      addMessage(m)
      if (!mine) MarkRead(userId).then(refreshUnread).catch(() => {})
    }
    socket.on('message:new', onNew)
    return () => socket.off('message:new', onNew)
  }, [socket, userId, user?.id])


  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t || sending) return
    setSending(true)
    try {
      const res = await SendMessage(userId, t)
      addMessage(res.data.data)
      setText('')
    } catch (err) {
      alert(err.response?.data?.message || 'Could not send message')
    } finally {
      setSending(false)
    }
  }

  const handleBlock = async () => {
    const q = blockedByMe
      ? 'Unblock this user?'
      : 'Block this user? Neither of you will be able to message the other.'
    if (!window.confirm(q)) return
    try {
      const res = await ToggleBlock(userId)
      setBlockedByMe(res.data.data.blockedByMe)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update block')
    }
  }

  if (!user) {
    return (
      <p className='p-6 font-outfit'>
        <Link to='/login' className='underline'>Log in</Link> to send messages.
      </p>
    )
  }
  if (loading) return <p className='p-6 font-outfit'>Loading...</p>
  if (error) return <p className='p-6 font-outfit text-red-600'>{error}</p>

  const canSend = !blockedByMe && !blockedByThem

  return (
    <div className='max-w-2xl mx-auto h-[calc(100dvh-76px)] flex flex-col font-outfit'>
    
      <div className='flex items-center justify-between gap-2 px-4 py-3 border-b bg-white'>
        <div className='flex items-center gap-3 min-w-0'>
          <Link to='/messages' aria-label='Back'>
            <ArrowBackIcon />
          </Link>
          <Link to={`/user/${userId}`} className='font-semibold text-lg truncate hover:underline'>
            {other?.name}
          </Link>
        </div>
        <button
          onClick={handleBlock}
          className='text-sm text-red-600 border border-red-600 rounded px-2 py-1 cursor-pointer'
        >
          {blockedByMe ? 'Unblock' : 'Block'}
        </button>
      </div>

     
      <div ref={listRef} className='flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 bg-gray-100'>
        {messages.length === 0 && (
          <p className='text-center text-gray-500 mt-6'>Say hi to {other?.name} 👋</p>
        )}
        {messages.map((m) => {
          const mine = m.sender === user.id
          return (
            <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                  mine ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-black rounded-bl-sm'
                }`}
              >
                <p className='whitespace-pre-wrap wrap-break-word'>{m.text}</p>
                <p className={`text-[10px] mt-0.5 text-right ${mine ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>

    
      <div className='border-t bg-white p-3'>
        {canSend ? (
          <form onSubmit={handleSend} className='flex gap-2'>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={1000}
              placeholder='Type a message...'
              className='flex-1 border-2 rounded-full px-4 py-2 outline-none'
            />
            <button
              type='submit'
              disabled={sending || !text.trim()}
              className='bg-blue-600 text-white rounded-full w-11 h-11 flex items-center justify-center disabled:opacity-50 cursor-pointer'
              aria-label='Send'
            >
              <SendIcon fontSize='small' />
            </button>
          </form>
        ) : (
          <p className='text-center text-gray-600 text-sm'>
            {blockedByMe
              ? 'You blocked this user. Unblock to send messages.'
              : "You can't message this user."}
          </p>
        )}
      </div>
    </div>
  )
}

export default Chat