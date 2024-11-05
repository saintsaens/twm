import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import AppRoutes from './components/AppRoutes';
import Title from "./components/Title";

function App() {
  return (
    <Router>
      <header>
        <nav>
          <img src="/logo.png" height="100" alt="Logo" />
          <Navigation />
        </nav>
        <Title />
        <Welcome />
      </header>
      <main>
        <AppRoutes />
      </main>
    </Router>
  );
}

export default App;
