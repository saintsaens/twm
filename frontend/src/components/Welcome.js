import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/features/userSlice';
import { Link } from "react-router-dom";

function Welcome() {
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state.user.username);
  const userStatus = useSelector((state) => state.user.status);

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUser());
    }
  }, [dispatch, userStatus]);

  return (
    <section>
      {username ? <p>Welcome, {username}!</p> : <Link to="/signin">Not logged in</Link>}
    </section>
  );
}

export default Welcome;
