import React, { useState, useEffect } from 'react';

const Board = () => {
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await fetch('/api/allusers');
      const json = await response.json();
      console.log(json)
      setUsers(json);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <h1 className="highscores">Top Best Players</h1>
      <section className="scores">
        {users
          .sort((a, b) => b.highscore - a.highscore)
          .slice(0, 10)
          .map((user) => (
            <div className="individual" key={user.id}>
              <h2>{user.username}</h2>
              <img src={user.imageUrl} alt={user.username} className="imageURL" />
              <p>{user.highscore}</p>
            </div>
          ))}
      </section>
    </>
  );
};

export default Board;