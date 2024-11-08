import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/features/userSlice';
import { logoutUser } from "../store/features/authSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await dispatch(logoutUser()).unwrap();
        dispatch(clearUser());
        navigate('/signin');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    performLogout();
  }, [navigate, dispatch]);

  return <div>Logging out...</div>;
};

export default Logout;
