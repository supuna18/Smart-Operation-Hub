import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import TicketDashboard from './components/TicketDashboard';
import TicketApprovalHub from './components/TicketApprovalHub';

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === '/AdminDashboard';

  return (
    <div className="min-h-screen bg-white font-poppins selection:bg-yellow-100 flex flex-col">
      
      {/* Navbar */}
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Ticket Dashboard */}
          <Route path="/tickets" element={<TicketDashboard />} />

          {/* Admin Ticket Approval */}
          <Route
            path="/admin/tickets"
            element={
              <ProtectedRoute>
                <TicketApprovalHub />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/AdminDashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer (hidden on Admin Dashboard) */}
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;