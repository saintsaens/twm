import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../store/features/authSlice';
import { fetchUser } from "../store/features/userSlice";

function Signin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  const usernameRef = useRef(null); // Create a ref for the username input

  useEffect(() => {
    usernameRef.current.focus();
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      dispatch(fetchUser());
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <section>
        <form onSubmit={handleSubmit}>
          <header>
            <h2>Sign In</h2>
          </header>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            ref={usernameRef}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
      <section>
        <p className="signup-link">
          No account? <Link to="/signup">Sign up here →</Link>
        </p>
        {error && <p>{error}</p>}
      </section>
    </>
  );
}

export default Signin;
