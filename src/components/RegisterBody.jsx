import { useState } from 'react';
import { setToken } from "../redux/authSlice.js"
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const API = '/auth/register'

const RegisterBody = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async(e) => {
    console.log("handler")
    e.preventDefault();
    try {
      const response = await fetch(API,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });
      console.log(response)
      const data = await response.json();
      console.log(data)

      if (data.token){
        dispatch(setToken(data.token));

        localStorage.setItem("token", data.token);
        navigate('/game');
      }

    } catch(err) {
      throw err;
    }
  }

  return (
    <>
      <h1>Register</h1>
      <h2 className="h2">Make a new account</h2>
      <div className="forms">
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Create your Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <h3 className="h3">Example: duck24</h3>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <h3 className="h3">Include: 10 or more characters, numbers, signs, etc.</h3>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Agree with Terms" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Create My Account
          </Button>
        </Form>
      </div>
    </>
  )
}

export default RegisterBody