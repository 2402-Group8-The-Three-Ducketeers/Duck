import React, { useState, useEffect } from 'react';

const AdminBody = () => {
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
      <h1 className="highscores">All Users</h1>
      <section className="scores">
        {users.map((user) => (
            <div className="individual" key={user.id}>
              <img src={user.imageUrl} alt={user.username} className="imageURL" />
              <h2>{user.username}</h2>
              <p>{user.highscore}</p>
            </div>
          ))}
      </section>
    </>
  );
};

export default AdminBody;