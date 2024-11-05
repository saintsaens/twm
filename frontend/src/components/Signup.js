import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
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
    <>
      <section>
        <form className="signup-form" onSubmit={handleSubmit}>
          <header>
            <h2>Sign Up</h2>
          </header>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Create Account</button>
        </form>
      </section>
      <section>
        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign in here →</Link>
        </p>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </section>
    </>
  );
}

export default Signup;
