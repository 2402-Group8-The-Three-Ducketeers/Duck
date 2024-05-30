import { Row, Col } from 'react-bootstrap';
import defaultAvatar from './images/duckDefaultAvatar.jpg'
import RemoveFriend from './RemoveFriend';

const FriendCard = ({ friend, friends, setFriends }) => {

  return (
      <Row className='friendCard mx-auto'>
        <Col>
          <img
            width= {75}
            height= {75}
            alt= {friend.user.username}
            src= {friend.user.imageUrl? friend.user.imageUrl : defaultAvatar}
          />
        </Col>
        <Col className='mx-auto'>
            {friend.user.nickname && <Row> {friend.user.nickname} </Row>}
            <Row>{friend.user.username}</Row>
        </Col>
        <Col><button>Message</button></Col>
        <RemoveFriend friend={friend} friends={friends} setFriends={setFriends}/>
      </Row>
  );
}

export default FriendCard