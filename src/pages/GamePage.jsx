import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../redux/authSlice.js';
import { useDispatch } from 'react-redux';
import  VideoGame  from "../game.js"
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Container, Col, Row, Form, Button } from 'react-bootstrap';

const Game = () => {
  const token = useSelector(state => state.authorization.token);
  const navigate = useNavigate();
  const dispath = useDispatch();

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const socket = io()

  const addMessage = () => {
    const messagesSlice = messages.slice()
    messagesSlice.push(newMessage)
    socket.emit('new mesage sent', newMessage)
    setMessages(messagesSlice)
    setNewMessage('')
  }

  useEffect(() => {
    //run the game
    VideoGame()
  }, [])
  
  return (
    <Container>
      socket.on('new message relayed',  {((msg) => {
        return (
          <Row style={{color: "orange"}}>
            {msg}
          </Row>
        )
      })})
      <Row>
        <Form onSubmit={() => {socket.emit('new message sent', newMessage)}}>
          <Form.Group controlId="newLiveMessage">
            <Row>
              <Col>
                <Form.Control
                  as="textarea"
                  rows={1}
                  onChange={(event) => setNewMessage(event.target.value)}
                  placeholder="Type your message..."
                  value={newMessage}
                />
              </Col>
              <Col>
                <Button type="submit">Send</Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Row>
    </Container>
  )
}

export default Game