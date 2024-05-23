import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/authSlice';

const API = '/auth/login';

const LogInBody = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch(API, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await result.json();
      if (data.token) {
        // Dispatch the token and isAdmin (if available)
        dispatch(setToken({ token: data.token, isAdmin: data.isAdmin || false }));

        localStorage.setItem('token', data.token);
      }
      if (data.error === 'Invalid credentials') {
        alert('Incorrect username or password, please try again.');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>LOG IN</h1>
      <h2 className="h2">You Need to Log In to Play the Game</h2>
      <div className="forms">
        <Form onSubmit={submitHandler}>
          <h3 className="h3">
            If you don't have an account, go <Link to="/register">Here</Link>
          </h3>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
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
  );
};

export default LogInBody;