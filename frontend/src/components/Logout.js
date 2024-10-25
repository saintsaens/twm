import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/features/userSlice';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        dispatch(clearUser());
        navigate('/signin');
      } else {
        console.error('Logout failed');
      }
    };

    handleLogout();
  }, [navigate, dispatch]);

  return <div>Logging out...</div>;
};

export default Logout;
