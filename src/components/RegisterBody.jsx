import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const RegisterBody = () => {
  return (
    <>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Create your Username</Form.Label>
        <Form.Control type="username" placeholder="Enter email" />
        <Form.Text className="text-muted">
          Example: duck24
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
        <Form.Text className="text-muted">
          Include: 10 or more characters, numbers, signs, etc.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Create My Account
      </Button>
    </Form>
    </>
  )
}

export default RegisterBody