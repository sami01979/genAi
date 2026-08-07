import React from 'react'
import SearchIcon from '@mui/icons-material/Search';

const Searchbar = () => {
  return (
    <div>
      <div className='flex items-center justify-center'>
        <input type="text" placeholder='Search image' className='h-8 w-1/4 border-2 p-2' />
        <div className='px-2 py-[1.5px] border-2'><SearchIcon/></div>
      </div>
    </div>
  )
}

export default Searchbar
