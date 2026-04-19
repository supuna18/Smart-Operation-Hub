import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Auth utilities
import { isAdmin, isLoggedIn as checkAuth } from './utils/auth';

// Component Imports
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import TicketDashboard from './components/TicketDashboard';
import TicketApprovalHub from './components/TicketApprovalHub';
import About from './components/About';

// --- INTHA LINE-AH PUDHUSA ADD PANNI IRUKKEN ---
import FacilityShowcase from './components/FacilityShowcase'; 

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const hideFooter = location.pathname === '/AdminDashboard';

  return (
    <div className="min-h-screen bg-white font-poppins selection:bg-yellow-100 flex flex-col text-poppins">
      
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={isAdmin() ? <Navigate to="/AdminDashboard" replace /> : <Home isLoggedIn={isLoggedIn} />} 
          />
          <Route 
            path="/about" 
            element={isAdmin() ? <Navigate to="/AdminDashboard" replace /> : <About />} 
          />
          
          {/* --- INTHA ROUTE-AH IPPO ADD PANNI IRUKKEN --- */}
          <Route path="/facilities" element={<FacilityShowcase />} />

          <Route 
            path="/login" 
            element={<Login setIsLoggedIn={setIsLoggedIn} />} 
          />
          <Route 
            path="/signup" 
            element={<Signup />} 
          />

          {/* User Ticket Dashboard */}
          <Route 
            path="/tickets" 
            element={isAdmin() ? <Navigate to="/AdminDashboard" replace /> : <TicketDashboard />} 
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

          {/* Ticket Approval Hub */}
          <Route
            path="/approval-hub"
            element={
              <ProtectedRoute>
                <TicketApprovalHub />
              </ProtectedRoute>
            }
          />

          {/* Profile Section */}
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

      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(checkAuth());
  }, []);

  return (
    <Router>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

export default App;