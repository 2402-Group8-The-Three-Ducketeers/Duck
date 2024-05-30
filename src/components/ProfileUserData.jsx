import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import EditProfile from './EditProfile';

const ProfileUserData = ({ user }) => {

  return (
    <Container className='userProfileData my-auto'>
      {user.nickname && <Row my-auto>{`Nickname: ${user.nickname}`}</Row>}
      <Row my-auto>{`Username: ${user.username}`}</Row>
      <Row my-auto>Highscore: {user.highscore? `${user.highscore}` : 
      'None Set Yet'}</Row>
      <EditProfile />
    </Container>
  )
}

export default ProfileUserData