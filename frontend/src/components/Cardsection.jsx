import React from 'react'
import { saveAs } from 'file-saver'
import DownloadIcon from '@mui/icons-material/Download';

const Cardsection = ({ item }) => {
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

  return (
    <div className='h-80 bg-gray-300 overflow-hidden rounded-md p-2'>
      <img className='h-64 w-full object-cover' src={item.img} alt="" />
      <div className='flex items-end justify-between'>
        <div>
          <h1 className='font-outfit text-lg '>{item.name}</h1>
          <h2 className='font-outfit font-medium text-gray-700'>{item.prompt}</h2>
        </div>
        <div onClick={handleDownload} className='cursor-pointer'>
          <DownloadIcon />
        </div>
      </div>
    </div>
  )
}

export default Cardsection