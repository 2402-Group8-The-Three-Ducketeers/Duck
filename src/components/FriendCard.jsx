import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import defaultAvatar from './images/duckDefaultAvatar.jpg'

const FriendCard = ({ friend }) => {

  return (
      <Row className='friendCard mx-auto'>
        <Col>
          <img
            width= {75}
            height= {75}
            alt= {friend.username}
            src= {friend.imageUrl? friend.imageUrl : defaultAvatar}
          />
        </Col>
        <Col className='mx-auto'>
            {friend.nickname && <Row> {friend.nickname} </Row>}
            <Row>{friend.username}</Row>
        </Col>
        <Col><button>Message</button></Col>
        <Col><button>Remove Friend &#128546;</button></Col>
      </Row>
  );
}

export default FriendCard