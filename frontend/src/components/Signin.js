import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signin.css'; // Import the CSS file

function Signin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        navigate('/');  // Redirect to homepage on successful login
      } else {
        const errorData = await response.json();
        setError(errorData.message);  // Show error message on failure
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="signin-container">
      <h2 className="signin-title">Sign In</h2>
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="signin-button">Sign In</button>
      </form>
      <p className="signup-link">
        No account? <Link to="/signup">Sign up here</Link>.
      </p>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Signin;
