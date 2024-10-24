import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Items from './Items';
import Signup from './Signup';
import Signin from './Signin';
import Logout from './Logout';

const routes = [
  { path: "/", element: <Items /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  { path: "/logout", element: <Logout /> },
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
