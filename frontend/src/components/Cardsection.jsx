import React, { useState } from 'react'
import { saveAs } from 'file-saver'
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DeletePost } from '../api'
import { useAuth } from '../context/AuthContext'

const Cardsection = ({ item, onDelete }) => {
  const [deleting, setDeleting] = useState(false)
  const { user } = useAuth()
  const isOwner = user && item.owner === user.id

  const handleDownload = async () => {
    try {
      const response = await fetch(item.img)

      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`)
      }

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
    <div className='h-80  bg-gray-300 overflow-hidden rounded-md p-2'>
      <img className='h-64 w-full object-cover' src={item.img} alt="" />
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0 '>
          <h1 className='font-outfit text-lg truncate'>{item.name}</h1>
          <h2 className='font-outfit font-medium text-gray-700 '>{item.prompt}</h2>
        </div>
        <div className='flex p-3 gap-4 shrink-0'>
          <div onClick={handleDownload} className='cursor-pointer border-2 px-1.5 py-0.5'>
            <DownloadIcon />
          </div>
          {isOwner && (
            <div
              onClick={deleting ? undefined : handleDelete}
              className={`cursor-pointer border-2 px-1.5 py-0.5 ${deleting ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <DeleteForeverIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cardsection