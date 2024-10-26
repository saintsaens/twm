import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

function Navigation() {
  const { username } = useSelector((state) => state.user.username);

  const navLinks = [
    { path: '/', label: 'Home' },
    ...(username ? [] : [{ path: '/signin', label: 'Sign In' }]),
    ...(username ? [] : [{ path: '/signup', label: 'Sign Up' }]),
    ...(username ? [{ path: '/orders', label: 'Orders' }] : []),
    ...(username ? [{ path: '/logout', label: 'Log Out' }] : []),
  ];

  return (
    <ul className="navigation">
      {navLinks.map(link => (
        <li key={link.path}>
          <Link to={link.path} className="nav-link">{link.label}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Navigation;
