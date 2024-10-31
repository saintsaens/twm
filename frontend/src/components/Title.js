import React from "react";
import { Link } from "react-router-dom";
import "../styles/App.css";

function Title() {
  return (
    <h1 className="title">
      <Link to="/" className="header-link">
        <img src="/logo.png" alt="Logo" className="title-logo" />
        The Witcher Marketplace
      </Link>
    </h1>
  );
}

export default Title;
