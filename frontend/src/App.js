import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import useGetSocket from './hooks/useGetSocket'; // 1. Import your hook
import useGetUnreadCounts from './hooks/useGetUnreadCounts';

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
])

function App() {
  // 2. CRITICAL: Call the hook here to start the connection
  useGetSocket(); 
  useGetUnreadCounts(); 

  return (
    <div className="md:p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;