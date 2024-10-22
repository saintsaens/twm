import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Items from './components/Items';
import Signup from './components/Signup';
import Signin from './components/Signin';

function App() {
  return (
    <div>
      <Router>
        <h1>Buy stuff from The Witcher</h1>
        <Navigation />
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </Router>
    </div>
  );
}

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Items</Link>
        </li>
        <li>
          <Link to="/signup">Sign up</Link>
        </li>
        <li>
          <Link to="/signin">Sign in</Link>
        </li>
      </ul>
    </nav>
  );
}

export default App;
