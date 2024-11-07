import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { fetchUser } from "./store/features/userSlice";
import '@gouvfr/dsfr/dist/dsfr.min.css';

import Navigation from './components/Navigation';
import AppRoutes from './components/AppRoutes';
import Title from "./components/Title";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

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
