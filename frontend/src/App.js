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
        <Navigation />
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
