import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';

const Header = () => {
  const { token, isAdmin } = useSelector(state => state.authorization);

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
    dispatch(setToken(""));
  }

  return(
    <>
    <Navbar bg="black" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">CODEFOWL</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#features">Account</Nav.Link>
            <Nav.Link href="/board">ScoreBoard</Nav.Link>
            <Nav.Link href="#pricing">Support</Nav.Link>
            {token && <Nav.Link href="/admin">Admin</Nav.Link>}
            {token && <Nav.Link onClick={()=>{logOut()}} href="/">Log Out</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default Header
