import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

function Navigation() {
  const { username } = useSelector((state) => state.user);
  const { totalItems } = useSelector((state) => state.cart);

  const navLinks = [];
  if (!username) {
    navLinks.push(
      { path: '/signin', label: 'Sign in', icon: "fr-btn fr-icon-lock-line" },
      { path: '/signup', label: 'Sign up', icon: "fr-btn fr-icon-account-line" }
    );
  } else {
    navLinks.push(
      { path: '/cart', label: `Cart (${totalItems})`, icon: "fr-btn fr-icon-shopping-cart-2-line" },
      { path: '/orders', label: 'Your orders', icon: "fr-btn fr-icon-money-euro-circle-line" },
      { path: '/logout', label: 'Log out', icon: "fr-btn fr-icon-logout-box-r-line" }
    );
  }

  return (
    <nav className="fr-header__tools-links">
      <ul className="fr-btns-group">
      {navLinks.map(link => (
          <li key={link.path}>
            <Link to={link.path} className={link.icon}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav >
  );
}

export default Navigation;
