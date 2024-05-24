import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LogIn from "./pages/LogIn"
import Register from "./pages/Register"
import Leaderboard from "./pages/Leaderboard"
import GamePage from "./pages/GamePage"
import Admin from "./pages/Admin"
import Info from './pages/Info'
import { useSelector, useDispatch } from 'react-redux'

function App() {
  const token = useSelector(state => state.authorization.token);
  const dispatch = useDispatch()
  useEffect(() => {
    if(!token){
      dispatch(setToken(localStorage.getItem('token')))
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/board" element={<Leaderboard/>}/>
        <Route path="/game" element={<GamePage/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/info" element={<Info/>}/>
      </Routes>
    </>
  )
}

export default App