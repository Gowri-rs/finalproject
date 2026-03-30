import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isValid = token => {
  if (!token) return false;
  try { const p = JSON.parse(atob(token.split('.')[1])); return p.exp * 1000 > Date.now(); }
  catch { return false; }
};

const PrivateRoutes = () => {
  const token = localStorage.getItem('token');
  if (!isValid(token)) {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateRoutes;
