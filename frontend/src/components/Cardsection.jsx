import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveAs } from 'file-saver'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CommentIcon from '@mui/icons-material/Comment'
import { DeletePost, ToggleLike } from '../api'
import { useAuth } from '../context/AuthContext'

const Cardsection = ({ item, onDelete }) => {
  const [deleting, setDeleting] = useState(false)
  const [likes, setLikes] = useState(item.likes || [])
  const { user } = useAuth()
  const navigate = useNavigate()
  const isOwner = user && item.owner === user.id
  const liked = !!user && likes.includes(user.id)

  const handleLike = async () => {
    if (!user) return navigate('/login')
    try {
      const res = await ToggleLike(item._id)
      setLikes(res.data.data.likes)
    } catch (error) {
      console.error('Like failed:', error)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(item.img)
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`)

      const blob = await response.blob()
      const mimeToExt = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
      }
      const ext = mimeToExt[blob.type] || 'jpg'
      saveAs(blob, `${item.name || 'image'}.${ext}`)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this image?')) return
    setDeleting(true)
    try {
      await DeletePost(item._id)
      onDelete(item._id)
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className='h-80 bg-gray-300 overflow-hidden rounded-md p-2'>
      <div className='relative h-64 w-full'>
        <img
          className='h-full w-full object-cover cursor-pointer'
          src={item.img}
          alt=""
          onClick={() => navigate(`/post/${item._id}`)}
        />
        <div className='absolute bottom-2 left-2 flex items-center gap-3 bg-black/60 text-white rounded-full px-3 py-1 text-sm'>
          <button onClick={handleLike} className='flex items-center gap-1 cursor-pointer'>
            {liked
              ? <FavoriteIcon fontSize='small' className='text-red-500' />
              : <FavoriteBorderIcon fontSize='small' />}
            {likes.length}
          </button>
          <button
            onClick={() => navigate(`/post/${item._id}`)}
            className='flex items-center gap-1 cursor-pointer'
          >
            <CommentIcon fontSize='small' />
            {item.comments?.length || 0}
          </button>
        </div>
      </div>

      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0'>
          <h1 className='font-outfit text-lg truncate'>{item.name}</h1>
          <h2 className='font-outfit font-medium text-gray-700'>{item.prompt}</h2>
        </div>
        <div className='flex p-3 gap-4 shrink-0'>
          <div onClick={handleDownload} className='cursor-pointer border-2 px-1.5 py-0.5'>
            <DownloadIcon />
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Cardsection