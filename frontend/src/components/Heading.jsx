import React from 'react'
import Slider from '@mui/material/Slider'

const Heading = () => {
  return (
    <div>
        <div className='flex items-center justify-center flex-col p-5'>
            <h1 className='text-3xl font-medium font-outfit text-gray-900'>Explore Popular Post From The Community!</h1>
           <div className='flex flex-row gap-2 mt-2.5'>
             <h2 className='text-4xl font-medium text-gray-700 font-outfit ml-1.5'>Generated With</h2><span className='text-5xl font-medium font-bitcount'>AI</span>
           </div>
        </div>
    </div>
  )
}

export default Heading
