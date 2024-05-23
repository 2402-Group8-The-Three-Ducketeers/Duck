import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
const Profile = () => {
  const token = useSelector(state => state.authorization.token);

  console.log("token: ", token)
  return (
    <>
      <h1>Profile Page Test</h1>
    </>
  )
}

export default Profile