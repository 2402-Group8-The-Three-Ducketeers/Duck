import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LogIn from "./pages/LogIn"
import Register from "./pages/Register"
import Leaderboard from "./pages/Leaderboard"
import GamePage from "./pages/GamePage"

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/board" element={<Leaderboard/>}/>
        <Route path="/game" element={<GamePage/>}/>
      </Routes>
  
    </>
  )
}

export default App