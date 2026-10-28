import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MailIcon from '@mui/icons-material/Mail';
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

const avatarColors = [
    'bg-blue-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-emerald-600',
    'bg-orange-500',
    'bg-teal-600',
]

const colorFor = (name = '') => {
    let sum = 0
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
    return avatarColors[sum % avatarColors.length]
}

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split("/");
    const { user, logout } = useAuth()
    const { unread } = useSocket()
    const [menuOpen, setMenuOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [compact, setCompact] = useState(false)
    const lastY = useRef(0)
    const menuRef = useRef(null)

    // hide on scroll down, show (compact) on scroll up
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY

            if (y <= 10) {
                setHidden(false)
                setCompact(false)
                lastY.current = y
                return
            }

            const diff = y - lastY.current
            if (Math.abs(diff) < 6) return

            if (diff > 0) {
                setHidden(true)
                setMenuOpen(false)
            } else {
                setHidden(false)
                setCompact(true)
            }
            lastY.current = y
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // close the menu on outside click or Esc
    useEffect(() => {
        if (!menuOpen) return

        const onClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        const onKey = (e) => {
            if (e.key === 'Escape') setMenuOpen(false)
        }

        document.addEventListener('mousedown', onClickOutside)
        document.addEventListener('touchstart', onClickOutside)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onClickOutside)
            document.removeEventListener('touchstart', onClickOutside)
            document.removeEventListener('keydown', onKey)
        }
    }, [menuOpen])

    const handleLogoClick = () => {
        setMenuOpen(false)
        if (location.pathname !== "/") {
            navigate("/")
            window.scrollTo(0, 0)
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const go = (to) => {
        setMenuOpen(false)
        navigate(to)
    }

    const handleLogout = () => {
        logout()
        setMenuOpen(false)
        navigate("/")
    }

    const btnClass = `bg-blue-600 rounded-2xl text-white font-outfit flex items-center justify-between gap-1.5 transition-all duration-300 ${
        compact ? 'px-3 py-1 text-base' : 'px-4 py-2 text-lg'
    }`

    const itemClass = 'w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-100 cursor-pointer'

    return (
        <>
            <div
                className={`fixed top-0 left-0 right-0 z-50 bg-gray-200 flex items-center justify-between px-4 transition-all duration-300 ${
                    compact ? 'h-[60px]' : 'h-[76px]'
                } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
            >
                <h1
                    className={`font-bitcount tracking-widest cursor-pointer transition-all duration-300 ${
                        compact ? 'text-xl' : 'text-2xl'
                    }`}
                    onClick={handleLogoClick}
                >
                    Chitro
                </h1>

                <div className='flex items-center gap-3'>
                    {
                        path[1] === "post" ? (
                            <button className={btnClass} onClick={() => navigate("/")}>
                                <HomeIcon /> Home
                            </button>
                        ) : (
                            <button className={btnClass} onClick={() => navigate("/post")}>
                                <AddCircleIcon /> Create Post
                            </button>
                        )
                    }

                    {user && (
                        <button
                            onClick={() => navigate("/messages")}
                            className='relative cursor-pointer flex items-center'
                            aria-label='Messages'
                        >
                            <MailIcon fontSize={compact ? 'medium' : 'large'} />
                            {unread > 0 && (
                                <span className='absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center'>
                                    {unread > 99 ? '99+' : unread}
                                </span>
                            )}
                        </button>
                    )}

                    <div className='relative' ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className='cursor-pointer flex items-center'
                            aria-label='Account menu'
                            aria-expanded={menuOpen}
                        >
                            {user ? (
                                <div
                                    className={`${colorFor(user.name)} text-white rounded-full flex items-center justify-center font-outfit font-semibold uppercase transition-all duration-300 ${
                                        compact ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg'
                                    }`}
                                >
                                    {user.name?.[0] || '?'}
                                </div>
                            ) : (
                                <AccountCircleIcon fontSize={compact ? 'medium' : 'large'} />
                            )}
                        </button>

                        <div
                            className={`absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border overflow-hidden origin-top-right transition duration-150 ${
                                menuOpen
                                    ? 'opacity-100 scale-100 pointer-events-auto'
                                    : 'opacity-0 scale-95 pointer-events-none'
                            }`}
                        >
                            {user ? (
                                <>
                                    <div className='px-4 py-3 border-b bg-gray-50'>
                                        <p className='text-xs text-gray-500'>Signed in as</p>
                                        <p className='font-outfit font-semibold truncate'>{user.name}</p>
                                    </div>
                                    <button onClick={() => go(`/user/${user.id}`)} className={itemClass}>
                                        <PersonIcon fontSize='small' /> My profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className={`${itemClass} text-red-600 border-t`}
                                    >
                                        <LogoutIcon fontSize='small' /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => go("/login")} className={itemClass}>
                                        <LoginIcon fontSize='small' /> Login
                                    </button>
                                    <button onClick={() => go("/register")} className={itemClass}>
                                        <PersonAddIcon fontSize='small' /> Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* spacer so page content doesn't sit under the fixed navbar */}
            <div className='h-[76px]' />
        </>
    )
}

export default Navbar