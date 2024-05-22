import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LogIn from "./pages/LogIn"
import Register from "./pages/Register"
import Game from "./pages/Game"
import Leaderboard from "./pages/Leaderboard"

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/game" element={<Game/>}/>
        <Route path="/board" element={<Leaderboard/>}/>
      </Routes>
  
    </>
  )
}

export default App
