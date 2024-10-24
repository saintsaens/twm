import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Items from './components/Items';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Logout from './components/Logout';
import Navigation from './components/Navigation';
import Welcome from "./components/Welcome";

function App() {
  return (
    <div className="app-container">
      <Router>
        <header>
          <h1>The Witcher Marketplace</h1>
          <Welcome />
        </header>
        <nav>
          <Navigation />
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Items />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
