import { useState, useEffect } from "react";
import { Row, Col, Form, Modal, Button, Container } from "react-bootstrap"
import { useSelector } from "react-redux";

const FriendSearch = ({friends, setFriends, user}) => {
  const token = useSelector(state => state.authorization.token)
  // const [currentFriends, setCurrentFriends] = useState(...friends)
  const currentFriends = friends.slice()
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  // search form modal
  const [searchModalShow, setSearchModalShow] = useState(false);
  const closeSearchModal = () => setSearchModalShow(false);
  const openSearchModal = () => setSearchModalShow(true);

  // confirmation if a friend was added modal
  const [addedModalShow, setAddedModalShow] = useState(false)
  const closeAddedModal = () => setAddedModalShow(false)
  const openAddedModal = () => setAddedModalShow(true)
  const [successMessage, setSuccessMessage] = useState('')

  const getAllUsers = async () => {
    try {
      const response = await fetch('/api/allusers');
      const json = await response.json();
      setUsers(json);
    } catch (err) {
      throw err;
    }
  };

  const filterUsers = () => {
    let currentFoundUsers = users
    currentFoundUsers = currentFoundUsers.filter((currentUser) => {
      // if the user we are checking isnt the logged in user or already on their friends list...
      if(currentUser.username !== user.username && !friends.includes(currentUser.username)){
        // see if their name includes our current filter
        return currentUser.username.toLowerCase().includes(filter.toLowerCase())
      }
    })
    setFilteredUsers(currentFoundUsers)
  }

  const createFriendPair = async (friendToBe) => {
    const newFriendPair = await fetch('/api/friendpairs/create', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      method: 'POST',
      body: JSON.stringify( {
        friend1: user.id*1,
        friend2: friendToBe.id*1
      })
    })
    const JSONnewFriendPair = await newFriendPair.json()
    console
    const newFriendData = JSONnewFriendPair
    newFriendData.user = friendToBe
    if(JSONnewFriendPair.message === 'Friendpair successfully created'){
      currentFriends.push(newFriendData)
    }
    setSuccessMessage(JSONnewFriendPair.message)
    //seems to be async
    setFriends(currentFriends)
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    filterUsers()
  }, [filter]);

  return (
    <Row>
      <Button variant="secondary" onClick={openSearchModal}>
        Add new Friend
      </Button>
      <Modal show={searchModalShow} onHide={closeSearchModal}>
        <Modal.Header style={{color: "black"}} closeButton>
          Search For new Friends
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="friendSearch">
              <Form.Label style={{color: "black"}}>
                Searching through all users:
              </Form.Label>
              <Form.Control
                type="input"
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Type friend's username"
                value={filter}
              />
            </Form.Group>
          </Form>
          <Container>
            {filteredUsers.map((user) => {
              return (
                <Row>
                  <Col>{user.username}</Col>
                  <Col>
                    <Button variant="secondary" onClick={() => {
                      createFriendPair(user)
                      closeSearchModal()
                      openAddedModal()
                    }}>
                      Add Friend
                    </Button>
                  </Col>
                </Row>
              ) 
            })}
          </Container>
        </Modal.Body>
      </Modal>
      <Modal show={addedModalShow} onHide={closeAddedModal}>
        <Modal.Body style={{color: "black"}}>
          {successMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeAddedModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  )
}

export default FriendSearch