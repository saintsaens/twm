import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import Welcome from "./Welcome";

function Navigation() {
  const { username } = useSelector((state) => state.user.username);

  const navLinks = [
    ...(username ? [] : [{ path: '/signin', label: 'Sign In' }]),
    ...(username ? [] : [{ path: '/signup', label: 'Sign Up' }]),
    ...(username ? [{ path: '/orders', label: 'Orders' }] : []),
    ...(username ? [{ path: '/logout', label: 'Log Out' }] : []),
  ];

  return (
    <nav>
      <Link to="/">
        <img src="/logo.png" height="100" alt="Logo" />
      </Link>
      <ul>
        <li>
          <Welcome />
        </li>
        {navLinks.map(link => (
          <li key={link.path}>
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
