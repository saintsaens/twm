import React from 'react';
import { Link } from "react-router-dom";

function Navigation() {
    return (
      <nav className="navigation">
        <ul>
          <li>
            <Link to="/" className="nav-link">Items</Link>
          </li>
          <li>
            <Link to="/signup" className="nav-link">Sign up</Link>
          </li>
          <li>
            <Link to="/signin" className="nav-link">Sign in</Link>
          </li>
          <li>
            <Link to="/logout" className="nav-link">Log out</Link>
          </li>
        </ul>
      </nav>
    );
  }

  export default Navigation;