import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Items from './Items';
import Signup from './Signup';
import Signin from './Signin';
import Logout from './Logout';
import Cart from "./Cart";
import Orders from "./Orders";

const routes = [
  { path: "/", element: <Items /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  { path: "/logout", element: <Logout /> },
  { path: "/cart", element: <Cart /> },
  { path: "/orders", element: <Orders /> },
];

const AppRoutes = () => {
  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
