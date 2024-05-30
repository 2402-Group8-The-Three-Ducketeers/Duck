import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import FriendCard from '../components/FriendCard';
import ProfileUserData from '../components/ProfileUserData';
import { Col, Row, Container, Form } from 'react-bootstrap';
import FriendSearch from '../components/FriendSearch';

const Profile = () => {
  const user = useSelector(state => state.user.user)
  const [friends, setFriends] = useState([]);
  const [displayFriends, setDisplayFriends] = useState([])

  // compare if the new given friends array is identical to the current one
  const compareFriendArrays = (newFoundFriends, currentFriends) => {
    if(newFoundFriends.length !== currentFriends.length){
      return false
    }
    for(let i = 0; i < newFoundFriends.length; i++){
      const newFriendPairAtI = newFoundFriends[i].friendPair.id
      const currentFriendPairAtI = currentFriends[i].friendPair.id
      if(newFriendPairAtI !== currentFriendPairAtI){
        return false
      }
    }
    return true
  }

  const getFriendIds = (userObject) => {
    const friendPair1s = userObject.friend1Pairs
    const friendPair2s = userObject.friend2Pairs
    const friendIds = []
    //get the friend ids from friendships where we are friend 1
    friendPair1s.forEach((friendPair) => {
      const newFriendPairObj = {friendPair: friendPair, userId: friendPair.friend2Id}
      friendIds.push(newFriendPairObj)
    })
    //get the friend ids from friendships where we are friend 2
    friendPair2s.forEach((friendPair) => {
      const newFriendPairObj = {friendPair: friendPair, userId: friendPair.friend1Id}
      friendIds.push(newFriendPairObj)
    })
    return friendIds 
  }

  const getFriendData = async (friendIds) => {
    const foundFriends = []
    for(let i = 0;i < friendIds.length;i++){
      try {
        const newFriendData = {}
        newFriendData.friendPair = friendIds[i].friendPair
        const newFriendId = friendIds[i].userId
        const response = await fetch(`/api/getuser/${newFriendId}`, {});
        const json = await response.json();
        newFriendData.user = json
        foundFriends.push(newFriendData)
      }catch (err) {
        throw err;
      }
    }
    setFriends(foundFriends)
    // console.log("friends after setFriends: ", friends) 
  }

  const updateOnAddFriend = () => {
    
  }

  //set friends initially
  useEffect(() => {
    if(user !== null && friends.length === 0){
      getFriendData(getFriendIds(user))
      
    }
  }, [user]);

  useEffect(() => {
    //need to handle friendless users?
    // if(user !== null && friends.length === 0 && !compareFriendArrays(friends, displayFriends)){
    // }
    setDisplayFriends(friends)
    // console.log("friends at special useEffect: ". friends)
    // console.log("displayFriends: ", displayFriends)
  }, [friends])

  return (
    <>
      {user &&
        <>
          <Header/>
          <ProfileUserData user={user} />
          <Container>
            <FriendSearch user={user} friends={friends} setFriends={setFriends} />
            <Col style={{color: "orange"}}>Your Friends</Col>
            {displayFriends.map((friend) => {
              return <FriendCard friend={friend} friends={friends} setFriends={setFriends} />
            })}
          </Container>
        </>
      }
    </>    
        
      
  )
}

export default Profile