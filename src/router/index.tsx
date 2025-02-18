import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Trade from '../pages/Trade';
import Portfolio from '../pages/Portfolio';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/trade',
        element: <Trade />
      },
      {
        path: '/portfolio',
        element: <Portfolio />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/settings',
        element: <Settings />
      }
    ]
  }
]);