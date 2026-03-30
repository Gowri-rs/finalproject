import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Home           from './components/Home'
import Login          from './components/Login'
import Register       from './components/Register'
import RoleSelect     from './components/RoleSelect'
import UserDashboard  from './components/Userdashboard'
import VolunteersPage from './components/VolunteersPage'
import TherapistPage  from './components/TherapistPage'
import BookingPage    from './components/BookingPage'
import Assessment     from './components/Assessment'
import Result         from './components/Result'
import Chatbot        from './components/Chatbot'
import AdminDashboard from './components/AdminDashboard'
import PrivateRoutes  from './components/PrivateRoutes'
import AdminRoute     from './components/AdminRoute'
import PaymentPage from './components/PaymentPage';

const GuestRoute = () => {
  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || 'null')
  if (!token) return <Outlet />
  return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<GuestRoute />}>
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/roleselect" element={<RoleSelect />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard"      element={<UserDashboard />} />
        <Route path="/volunteers"     element={<VolunteersPage />} />
        <Route path="/therapists"     element={<TherapistPage />} />
        <Route path="/book/:type/:id" element={<BookingPage />} />
        <Route path="/payment"         element={<PaymentPage />} />
        <Route path="/assessment"     element={<Assessment />} />
        <Route path="/result"         element={<Result />} />
        <Route path="/chatbot"        element={<Chatbot />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App