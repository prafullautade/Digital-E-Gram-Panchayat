// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import StaffDashboard from './components/Dashboard/StaffDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './components/Home';
import MyRequests from './components/Dashboard/MyRequests';
import AdminRequests from './components/Dashboard/AdminRequests';
// import EditService from './components/Dashboard/EditService';


function App() {
  return (
    <Router>
      <Navbar />

      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          {/* <Route path="/admin/services/edit/:id" element={<EditService />} /> */}

          {/* Role-based Dashboards */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }/>

          <Route path="/staff/dashboard" element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }/>

          <Route path="/user/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }/>

          {/* Fallback route */}
          <Route path="*" element={<h2 className="text-center mt-5">404 - Page Not Found</h2>} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
