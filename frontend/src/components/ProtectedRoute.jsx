import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  console.log('ProtectedRoute - checking authentication');
  const { isAuthenticated } = useAuth();
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
