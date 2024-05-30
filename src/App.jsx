import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LogIn from "./pages/LogIn"
import Register from "./pages/Register"
import Leaderboard from "./pages/Leaderboard"
import GamePage from "./pages/GamePage"
import Admin from "./pages/Admin"
import Info from './pages/Info'
import Profile from './pages/Profile'
import { useSelector, useDispatch } from 'react-redux'
import { setToken } from './redux/authSlice'
import { setUser } from './redux/userSlice'

function App() {
  const token = useSelector(state => state.authorization.token);
  const dispatch = useDispatch()

  useEffect(() => {
    if(!token){
      dispatch(setToken({token: localStorage.getItem('token')}))
    }
  }, [])
  
  useEffect(() => {
    const getUser = async () => {
      try{
      //also if we got a token, set the user for other pages
      const userResponse = await fetch('/api/getloggedinuser', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const userJson = await userResponse.json();
      dispatch(setUser(userJson));
      }catch (error){
        console.log(error)
      }
    }
    if(token){
      getUser()
    }
  }, [token])

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
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
  
    </>
  )
}

export default App