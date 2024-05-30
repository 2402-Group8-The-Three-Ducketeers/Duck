import { Form, Modal, Row, Button } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"

const EditProfile = ({ user }) => {
  const token = useSelector(state => state.authorization.token)
  const [editFormShow, setEditFormShow] = useState(false)
  const closeEditForm = () => setEditFormShow(false)
  const ShowEditForm = () => setEditFormShow(true)

  // const putChanges = async () => {
  //   const profileChanges = await fetch(`/api/finduser/edit/${user.id}`, {
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`
  //     },
  //     method: 'PUT',
  //     body: JSON.stringify({
  //       newUsername: ,
  //       newNickname ,
  //       newImageUrl:
  //     }),
  //   })
  //   const JSONnewProfile = await profileChanges.json()
  // }

  return (
    <Row>
      <Button variant="secondary" onClick={ShowEditForm}>
        Edit Profile
      </Button>

      <Modal show={editFormShow}>
        <Modal.Header style={{color: "black"}}>
          Editing Profile
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label style={{color: "black"}}>
              New username:
            </Form.Label>
            <Form.Group controlId="editProfile">
              <Form.Control>
                
              </Form.Control>

            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditForm}>
            Close and Cancel Changes
          </Button>
          
          <Button variant="primary" onClick={()=>{
            putChanges()
            closeEditForm()
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  )
}

export default EditProfile