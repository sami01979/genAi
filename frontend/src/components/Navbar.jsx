import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeIcon from '@mui/icons-material/Home';
const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split("/");

  return (
    <div className='bg-gray-200 flex items-center justify-between p-4'>
         <h1 className='text-2xl font-bitcount'>GenAI</h1>
        {
            path[1] === "post" ? (
                <>
                <button className='bg-blue-600 rounded-2xl px-4 py-2 text-white text-lg font-outfit flex items-center justify-between gap-1.5'
                onClick={()=>navigate("/")}
                ><HomeIcon/> Home</button>
                </>
            ) : (
                <>
                   
                    <button
                        className='bg-blue-600 rounded-2xl px-4 py-2 text-white text-lg font-outfit flex items-center justify-between gap-1.5'
                        onClick={() => navigate("/post")}
                    >
                      <AddCircleIcon></AddCircleIcon> Create Post
                    </button>
                </>
            )
        }
    </div>
  )
}

export default Navbar