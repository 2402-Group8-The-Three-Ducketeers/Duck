import { response } from 'express'
import { useEffect, useState } from 'react'

const Profile = () => {
  const [token, setToken] = useState('')
  //temporary token procedure until the login page sets tokens
  const getTokenFromSessionStorage = async () => {
    let headers = {}
    if (sessionStorage.token) {
        headers = { 'Authorization': `Bearer ${sessionStorage.token}` }
    }
    try{
      const response = await fetch("/getloggedinuser/", { headers: headers })
      const responseJSON = await response.json()
      if(responseJSON.token){
        setToken(responseJSON.token)
      }
    }catch (error){
      throw error
    }
  }
  getTokenFromSessionStorage()
  console.log("token: ", token)
  return (
    <>
      <h1>Profile Page Test</h1>
    </>
  )
}

export default Profile