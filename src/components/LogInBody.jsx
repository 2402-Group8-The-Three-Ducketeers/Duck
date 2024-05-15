import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Link} from "react-router-dom"

const LogInBody = () => {
  return (
    <>
    <h1>LOG IN</h1>
    <div className='forms'>
    <Form>
    <Form.Text className="text-muted">
          You Need to Log In to Play the Game
        </Form.Text>
        <Form.Text className="text-muted">
          If you don't have an account go <Link to="/register">Here</Link>
        </Form.Text>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control type="username" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Activate achievements" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    </div>
    </>
  )
}

export default LogInBody