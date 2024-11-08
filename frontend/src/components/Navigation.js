import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import Welcome from "./Welcome";

function Navigation() {
  const { username } = useSelector((state) => state.user);
  const { totalItems } = useSelector((state) => state.cart);

  const navLinks = [
    ...(username ? [] : [{ path: '/signin', label: 'Sign in', icon: "fr-btn fr-icon-lock-line" }]),
    ...(username ? [] : [{ path: '/signup', label: 'Sign up', icon: "fr-btn fr-icon-account-line" }]),
    ...(username ? [{ path: '/cart', label: `Cart (${totalItems})`, icon: "fr-btn fr-icon-shopping-cart-2-line" }] : []),
    ...(username ? [{ path: '/orders', label: 'Your orders', icon: "fr-btn fr-icon-money-euro-circle-line" }] : []),
    ...(username ? [{ path: '/logout', label: 'Log out', icon: "fr-btn fr-icon-logout-box-r-line" }] : []),
  ];

  return (
    <nav className="fr-header__tools-links">
      <Welcome />
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
