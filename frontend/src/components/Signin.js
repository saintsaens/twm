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
      <main className="fr-pt-md-14v" role="main" id="content">
        <div className="fr-container fr-container--fluid fr-mb-md-14v">
          <div className="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
              <div className="fr-container fr-background-alt--grey fr-px-md-0 fr-py-10v fr-py-md-14v">
                <div className="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
                  <div className="fr-col-12 fr-col-md-9 fr-col-lg-8">
                    <h1>Sign in</h1>
                    <div>
                      <form id="login" onSubmit={handleSubmit}>
                        <fieldset className="fr-fieldset" id="login-fieldset" aria-labelledby="login-fieldset-legend login-fieldset-messages">
                          <div className="fr-fieldset__element">
                            <div className="fr-input-group">
                              <label className="fr-label" htmlFor="username">
                                Username
                              </label>
                              <input
                                className="fr-input"
                                autoComplete="username"
                                aria-required="true"
                                aria-describedby="username"
                                name="username"
                                type="text"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                ref={usernameRef}
                                required
                              />
                            </div>
                          </div>
                          <div className="fr-fieldset__element">
                            <div className="fr-password" id="password">
                              <label className="fr-label" htmlFor="password">
                                Password
                              </label>
                              <input
                                className="fr-password__input fr-input"
                                aria-describedby="password"
                                aria-required="true"
                                name="password"
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                              />
                            </div>
                          </div>
                          <div className="fr-fieldset__element">
                            <ul className="fr-btns-group">
                              <li>
                                <button
                                  className="fr-mt-2v fr-btn"
                                  type="submit"
                                  disabled={loading}
                                >
                                  {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                              </li>
                            </ul>
                          </div>
                        </fieldset>
                      </form>
                    </div>
                    {error && <p>{error}</p>}
                    <hr />
                    <Link className="fr-link" to="/signup">
                      Create an account →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Signin;
