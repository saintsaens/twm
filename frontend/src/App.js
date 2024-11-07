import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { fetchUser } from "./store/features/userSlice";
import '@gouvfr/dsfr/dist/dsfr.min.css';
import '@gouvfr/dsfr/dist/utility/utility.min.css';

import AppRoutes from './components/AppRoutes';
import Header from "./components/Header";
import { fetchCart } from "./store/features/cartSlice";

function App() {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  return (
    <Router>
      <Header />
      <main className="fr-container fr-mb-12w">
        <AppRoutes />
      </main>
    </Router>
  );
}

export default App;
