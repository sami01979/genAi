import React from 'react'
import SearchIcon from '@mui/icons-material/Search';

const Searchbar = ({ search, setSearch }) => {
  return (
    <div className='flex items-center justify-center mb-3.5'>
      <div className=' border-2 px-4 py-2 rounded-lg w-[80%] lg:w-1/2 flex items-center gap-3'>
        <SearchIcon/>
        <input
          type="text"
          placeholder=' Search by prompt or author name'
          className='h-8 w-[80%] lg:w-[80%] outline-none'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        
      </div>
    </div>
  )
}

export default Searchbar