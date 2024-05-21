import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LogIn from "./pages/LogIn"
import Register from "./pages/Register"
import GamePage from "./pages/GamePage"
import Test from './pages/Test'

import duckSpritePath from "./components/images/ducksprite.png"
import cloudSpritePath from "./components/images/cloudsprite.png"
import portalSpritePath from "./components/images/portal.png"
import pterodactylSpritePath from "./components/images/pterodactyl.png"
import grassSpritePath from "./components/images/grass.png"
import sandSpritePath from "./components/images/sand.png"
import eagleSpritePath from "./components/images/eagle.png"
import groundSpritePath from "./components/images/ground.png"
import lavaSpritePath from "./components/images/lava.png"

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/game" element={<GamePage/>}/>
        <Route path="/test" element={<Test/>}/>
      </Routes>
    </>
  )
}

export default App
