import React, { useEffect, useState } from 'react';

function Welcome() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('/api/user/profile', {
        credentials: 'include' // Make sure cookies are sent with the request
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Not logged in');
      })
      .then((data) => {
        setUsername(data.username); // Set the username in state
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="welcome">
      {username ? <p>Welcome, {username}!</p> : <p>Please log in</p>}
    </div>
  );
}

export default Welcome;
