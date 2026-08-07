import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Createpost from './pages/Createpost'
import Navbar from './components/Navbar'


const App = () => {
  return (
    <div >
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/post' element={<Createpost/>} />
      </Routes>
    </div>
  )
}

export default App
