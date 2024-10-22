import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Items from './components/Items';
import Signup from './components/Signup';
import Signin from './components/Signin';

function App() {
  return (
    <div className="app-container">
      <Router>
        <header>
          <h1>The Witcher Marketplace</h1>
          <Navigation />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Items />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

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
      </ul>
    </nav>
  );
}

export default App;
