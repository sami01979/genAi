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

      saveAs(blob, `${item.author || 'image'}.${ext}`)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

    return (
        <div className='w-full p-4 mt-5'>
            <div className='grid grid-cols-2 gap-4 p-0.5 lg:p-4 w-full lg:grid-cols-4'>
                <div className='h-80  bg-gray-300 overflow-hidden rounded-md p-2'>
                    <img className='h-64 w-full object-cover ' src={item.img} alt="" />
                    <div className='flex items-end justify-between'>
                        <div>
                            <h1>{item.author}</h1>
                            <h2>{item.prompt}</h2>
                        </div>
                        <div
                        onClick={handleDownload}
                        className='cursor-pointer'>
                            < DownloadIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cardsection
