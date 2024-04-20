import React, { useEffect, useState } from 'react';

function OnlineUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/users/online-status')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  return (
    <div>
      <h1>Online Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.UserId}>{user.IsOnline ? 'Online' : 'Offline'}</li>
        ))}
      </ul>
    </div>
  );
}

export default OnlineUsers;