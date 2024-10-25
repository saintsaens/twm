import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/features/userSlice';

function Welcome() {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.username);
  const userStatus = useSelector((state) => state.user.status);

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUser());
    }
  }, [dispatch, userStatus]);

  return (
    <div className="welcome">
      {username ? <p>Welcome, {username}!</p> : <p>Not logged in</p>}
    </div>
  );
}

export default Welcome;
