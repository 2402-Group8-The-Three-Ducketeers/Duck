import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LogIn from "./pages/LogIn"
import Register from "./pages/Register"
import Game from "./pages/Game"
import Admin from "./pages/Admin"

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/game" element={<Game/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </>
  )
}

export default App
