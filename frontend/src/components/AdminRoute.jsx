import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isValid = token => {
  if (!token) return false;
  try { const p = JSON.parse(atob(token.split('.')[1])); return p.exp * 1000 > Date.now(); }
  catch { return false; }
};

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || 'null');
  if (!isValid(token) || user?.role !== 'admin') {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
