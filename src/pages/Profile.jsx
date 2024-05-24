import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import FriendCard from '../components/FriendCard';
import ProfileUserData from '../components/ProfileUserData';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Profile = () => {
  const token = useSelector(state => state.authorization.token);
  const [user, setUser] = useState(null)
  const [friends, setFriends] = useState([])

  const getUser = async () => {
    try {
      const response = await fetch('/api/getloggedinuser', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await response.json();
      setUser(json);
    } catch (err) {
      throw err;
    }
  };

  // const logStuff = () => {
  //   console.log("token: ", token)
  //   console.log("user: ", user)
  //   if(user){
  //     console.log("user friendpair1s: ", user.friend1Pairs)
  //     console.log("user friendpair2s: ", user.friend2Pairs)
  //     console.log("friends: ", friends)
  //   }
  // }

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
    if(user === null){
      getUser();
    }
    if(user !== null && friends.length == 0){
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