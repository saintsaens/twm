import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../store/features/authSlice';
import '../styles/Signin.css';

function Signin() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const error = useSelector((state) => state.auth.error); // Get error from the Redux state
    const loading = useSelector((state) => state.auth.loading); // Get loading state

    useEffect(() => {
        dispatch(clearError()); // Clear error message when component mounts
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
            await dispatch(loginUser(formData)).unwrap(); // Dispatch loginUser and unwrap the promise
            navigate('/'); // Redirect to homepage on successful login
        } catch (error) {
            console.error('Login failed:', error);
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
                <button type="submit" className="signin-button" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
            <p className="signup-link">
                No account? <Link to="/signup">Sign up here</Link>.
            </p>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default Signin;
