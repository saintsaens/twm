import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/features/userSlice';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include',
        });
        if (response.ok) {
          dispatch(clearUser());
          navigate('/signin');
        }
      } catch (error) {
        console.error('Logout failed', error);
      };
    };

    handleLogout();
  }, [navigate, dispatch]);

  return <div>Logging out...</div>;
};

export default Logout;
