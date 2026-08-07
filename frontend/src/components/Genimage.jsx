import React from 'react'

const Genimage = ({ src }) => {
  return (
    <div className='w-full flex items-center justify-center'>
      <div className='h-80 w-3/8 border-2 border-amber-300 mt-3.5 rounded-lg overflow-hidden outline-none'>
        {src && <img className='object-cover w-full h-full' src={src} alt="" />}
      </div>
    </div>
  )
}

export default Genimage
