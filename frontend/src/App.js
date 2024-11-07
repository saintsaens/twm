import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import '@gouvfr/dsfr/dist/dsfr.min.css';

import Navigation from './components/Navigation';
import AppRoutes from './components/AppRoutes';
import Title from "./components/Title";

function App() {
  return (
    <Router>
      <header>
        <Navigation />
        <Title />
      </header>
      <main>
        <AppRoutes />
      </main>
    </Router>
  );
}

export default App;
