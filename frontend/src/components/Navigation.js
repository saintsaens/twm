import React from 'react';
import { Link } from "react-router-dom";

const navLinks = [
  { path: '/', label: 'Items' },
  { path: '/signup', label: 'Sign Up' },
  { path: '/signin', label: 'Sign In' },
  { path: '/logout', label: 'Log Out' },
];

function Navigation() {
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
