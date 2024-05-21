import { useEffect, useState } from 'react'

const Profile = () => {
  
  const token = JSON.parse(localStorage.getItem('currentUser'))
  

  console.log("token: ", token)
  return (
    <>
      <h1>Profile Page Test</h1>
    </>
  )
}

export default Profile