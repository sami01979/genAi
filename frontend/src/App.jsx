import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Createpost from './pages/Createpost'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PostDetail from './pages/PostDetail'
import UserProfile from './pages/UserProfile'
import Messages from './pages/Messages'
import Chat from './pages/Chat'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/post' element={<Createpost/>} />
        <Route path='/post/:id' element={<PostDetail/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/user/:userId' element={<UserProfile/>} />
        <Route path='/messages' element={<Messages/>} />
        <Route path='/messages/:userId' element={<Chat/>} />
      </Routes>
    </div>
  )
}

export default App