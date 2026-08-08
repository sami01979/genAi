import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split("/");
    const { user, logout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        setMenuOpen(false)
        navigate("/")
    }

    return (
        <div className='bg-gray-200 flex items-center justify-between p-4'>
            <h1 className='text-2xl font-bitcount cursor-pointer'
            onClick={()=>navigate("/")}
            >GenAI</h1>

            <div className='flex items-center gap-3'>
                {
                    path[1] === "post" ? (
                        <button className='bg-blue-600 rounded-2xl px-4 py-2 text-white text-lg font-outfit flex items-center justify-between gap-1.5'
                            onClick={() => navigate("/")}
                        ><HomeIcon /> Home</button>
                    ) : (
                        <button
                            className='bg-blue-600 rounded-2xl px-4 py-2 text-white text-lg font-outfit flex items-center justify-between gap-1.5'
                            onClick={() => navigate("/post")}
                        >
                            <AddCircleIcon /> Create Post
                        </button>
                    )
                }

                <div className='relative'>
                    <div
                        onClick={() => setMenuOpen(!menuOpen)}
                        className='cursor-pointer'
                    >
                        <AccountCircleIcon fontSize='large' />
                    </div>

                    {menuOpen && (
                        <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10'>
                            {user ? (
                                <>
                                    <button
                                        onClick={() => { setMenuOpen(false); navigate("/profile") }}
                                        className='w-full text-left px-4 py-2 text-sm border-b hover:bg-gray-100'
                                    >
                                        {user.name}'s Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => { setMenuOpen(false); navigate("/login") }}
                                        className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => { setMenuOpen(false); navigate("/register") }}
                                        className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar