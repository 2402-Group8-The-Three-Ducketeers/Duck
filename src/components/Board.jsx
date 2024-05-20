import { useState, useEffect } from "react";
// import { Link } from 'react-router-dom';

const Board = () => {
  const [users, setUsers] = useState([]);
  const getAllUsers = async() => {
    try {
      const response = await fetch('/api/allusers');
      const json = await response.json();
      setUsers(json);
    } catch(err) {
      throw err;
    }
  }

  useEffect(() => {getAllUsers();}, []);

  return (
    <>
    <h1 className="highscores">Top Best Players</h1>
    <section className="scores">
      {
        users.map((user) => {
            return(
              <div className="individual" key={user.id}>
              <h2>{user.username}</h2>
              <img src={user.imageURL} className="imageURL"/>
              <p>{user.highscore}</p>
            </div>
          )
        })
      }
      </section>
    </>
  )
}

export default Board