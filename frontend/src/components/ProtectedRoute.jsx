import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin, isLoggedIn } from '../utils/auth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
