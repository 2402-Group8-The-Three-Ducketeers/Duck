import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
  return(
    <>
    <Navbar bg="black" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">CODEFOWL</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#features">Account</Nav.Link>
            <Nav.Link href="#pricing">Support</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default Header