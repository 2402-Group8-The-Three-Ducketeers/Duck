import { Col, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const RemoveFriend = ({ friend, friends, setFriends }) => {
  const token = useSelector(state => state.authorization.token)
  const currentFriends = friends.slice()

  // modal for user to confirm deletion
  const [promptShow, setPromptShow] = useState(false)
  const closePromptModal = () => setPromptShow(false)
  const ShowPromptModal = () => setPromptShow(true)

  // modal for message of successful or failed deletion
  const [deleteMessage, setDeleteMessage] = useState('')
  const [messageShow, setMessageShow] = useState(false)
  const closeMessageModal = () => setMessageShow(false)
  const openMessageModal = () => setMessageShow(true)

  const deleteFriendPair = async () => {
    const friendPairId = friend.friendPair.id
    try{
      const response = await fetch(`/api/friendpairs/delete/${friendPairId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        method: 'DELETE'
      })
      const JSONresponse = await response.json()
      const deletedFriendId = JSONresponse.friendDeleted.id
      updateFriendsArray(deletedFriendId)
      if(JSONresponse.success){
        setDeleteMessage(`You are no longer friends with ${friend.user.username}`)
      }else{
        setDeleteMessage('Failed to remove friend')
      }
    }catch (error){
      console.log(error)
      throw error
    }
  }

  const updateFriendsArray = (deletedFriendPairId) => {
    let deletedIndex = -1
    for(let i=0; i < currentFriends.length; i++){
      const currentFriendPairId = currentFriends[i].friendPair.id
      if(currentFriendPairId === deletedFriendPairId){
        deletedIndex = currentFriends.indexOf(currentFriends[i])
        currentFriends.splice(deletedIndex, 1)
      }
      if(deletedIndex>-1){
        setFriends(currentFriends)
      }
    }
  }

  return (
    <Col>
      <Button variant="primary" onClick={ShowPromptModal}>
        Remove Friend &#128546;
      </Button>

      <Modal show={promptShow} onHide={closePromptModal}  animation={true}>
        <Modal.Header>
          Removing Friend
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove {`${friend.user.username}`} from your friends list?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePromptModal}>
            No, cancel
          </Button>
          <Button variant="primary" onClick={() => {
            deleteFriendPair()
            closePromptModal()
            openMessageModal()
          }}>
            Yes, remove friend
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={messageShow} onHide={closeMessageModal} animation={true}>
          <Modal.Body>
            {deleteMessage}
          </Modal.Body>
          <Button variant="primary" onClick={closeMessageModal}>
            Close
          </Button>
      </Modal>
    </Col>
  )
}

export default RemoveFriend