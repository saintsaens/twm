import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUser, loginUser } from '../store/features/authSlice';
import { fetchUser } from '../store/features/userSlice';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { error, successMessage } = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createUser({ username, password })).unwrap();
      
      await dispatch(loginUser({ username, password })).unwrap();
      dispatch(fetchUser());

      setUsername('');
      setPassword('');
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
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
                    <h1>Sign Up</h1>
                    <div>
                      <form onSubmit={handleSubmit}>
                        <fieldset className="fr-fieldset" aria-labelledby="signup-fieldset-legend signup-fieldset-messages">
                          <div className="fr-fieldset__element">
                            <div className="fr-input-group">
                              <label className="fr-label" htmlFor="username">
                                Username
                              </label>
                              <input
                                className="fr-input"
                                autoComplete="username"
                                aria-required="true"
                                name="username"
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                                autoComplete="new-password"
                                aria-required="true"
                                name="password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                >
                                  Create Account
                                </button>
                              </li>
                            </ul>
                          </div>
                        </fieldset>
                      </form>
                    </div>
                    <hr />
                    <Link className="fr-link" to="/signin">
                      Sign in here →
                    </Link>
                    {error && <p>{error}</p>}
                    {successMessage && <p>{successMessage}</p>}
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

export default Signup;
