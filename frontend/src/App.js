import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import useGetSocket from './hooks/useGetSocket';
import useGetUnreadCounts from './hooks/useGetUnreadCounts';
import { useSelector } from 'react-redux';

// Only accessible when logged in — else redirects to /login
const ProtectedRoute = ({ children }) => {
  const { authUser } = useSelector(store => store.user);
  return authUser ? children : <Navigate to="/login" replace />;
};

// Only accessible when NOT logged in — else redirects to /
const PublicRoute = ({ children }) => {
  const { authUser } = useSelector(store => store.user);
  return !authUser ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    )
  },
]);

function App() {
  useGetSocket();
  useGetUnreadCounts();

  return (
    <div className="md:p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;