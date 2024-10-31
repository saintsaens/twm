import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/App.css";

import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import AppRoutes from './components/AppRoutes';
import Title from "./components/Title";

function App() {
  return (
    <div className="app-container">
      <Router>
        <header>
          <Title />
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
