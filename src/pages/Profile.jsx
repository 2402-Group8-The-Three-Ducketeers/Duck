import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import FriendCard from '../components/FriendCard';
import ProfileUserData from '../components/ProfileUserData';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

const Profile = () => {
  const user = useSelector(state => state.user.user)
  const [friends, setFriends] = useState([]);

  const getFriendIds = (userObject) => {
    const friendPair1s = userObject.friend1Pairs
    const friendPair2s = userObject.friend2Pairs
    const friendIds = []
    //get the friend ids from friendships where we are friend 1
    friendPair1s.forEach((friendPair) => {
      friendIds.push(friendPair.friend2Id)
    })
    //get the friend ids from friendships where we are friend 2
    friendPair2s.forEach((friendPair) => {
      friendIds.push(friendPair.friend1Id)
    })
    return friendIds
  }

  const getFriendData = async (friendIds) => {
    const foundFriends = []
    for(let i = 0;i < friendIds.length;i++){
      try {
        const response = await fetch(`/api/getuser/${friendIds[i]}`, {});
        const json = await response.json();
        foundFriends.push(json)
      }catch (err) {
        throw err;
      }
    }
    setFriends(foundFriends)
  }

  useEffect(() => {
    if(user !== null && friends.length === 0){
      getFriendData(getFriendIds(user))
    }
  }, [user]);
  
  return (
    <>
      {user &&
        <>
          <Header/>
          <ProfileUserData user={user} />?     
          <Container>
            <Col style={{color: "orange"}}>Friends</Col>
            {friends?.map((friend) => {
              return <FriendCard friend={friend} />
            })}
          </Container>
        </>
      }
    </>    
        
      
  )
}

export default Profile