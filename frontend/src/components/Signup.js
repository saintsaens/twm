import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../styles/Signup.css';
import { useDispatch } from "react-redux";
import { loginUser } from '../store/features/authSlice';
import { fetchUser } from '../store/features/userSlice';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to create an account.');
        setSuccessMessage('');
        return;
      }

      await dispatch(loginUser({ username, password })).unwrap();
      dispatch(fetchUser());

      setSuccessMessage('Account created successfully! Please log in.');
      setError('');
      setUsername('');
      setPassword('');
      navigate('/');
    } catch (err) {
      setError('An error occurred while creating your account.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-button">Create Account</button>
      </form>
      <p className="signin-link">
        Already have an account? <Link to="/signin" className="nav-link">Sign in here →</Link>
      </p>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default Signup;
