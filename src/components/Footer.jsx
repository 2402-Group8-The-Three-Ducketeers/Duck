import Nav from 'react-bootstrap/Nav';

const Footer = () => {
  return (
    <>
      <Nav className="justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="/home">More Games</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Community</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">About Us</Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}

export default Footer