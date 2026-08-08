import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Createpost from './pages/Createpost'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/post' element={<Createpost/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </div>
  )
}

export default App