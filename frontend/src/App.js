import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import "./styles/App.css";

import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import AppRoutes from './components/AppRoutes';

function App() {
  return (
    <div className="app-container">
      <Router>
        <header>
          <h1>
            <Link to="/" className="header-link">The Witcher Marketplace</Link>
          </h1>
          <Welcome />
        </header>
        <nav>
          <Navigation />
        </nav>
        <main>
          <AppRoutes />
        </main>
      </Router>
    </div>
  );
}

export default App;
