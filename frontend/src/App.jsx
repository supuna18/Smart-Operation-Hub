 HEAD
import React, { useState, useEffect } from 'react'; // useEffect sethuten
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { isAdmin } from './utils/auth';

 main
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
 HEAD
import Footer from './components/Footer';
import { isLoggedIn as checkAuth } from './utils/auth'; // Leader-oda auth helper

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
          <Route path="/" element={isAdmin() ? <Navigate to="/AdminDashboard" replace /> : <Home />} />
          <Route path="/about" element={isAdmin() ? <Navigate to="/AdminDashboard" replace /> : <About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Ticket Dashboard */}
          <Route path="/tickets" element={isAdmin() ? <Navigate to="/AdminDashboard" replace /> : <TicketDashboard />} />



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
 main

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- INTHA LOGIC-AH PUDHUSA SERTHUKONGA ---
  // Page refresh aanaalum, login status-ah storage-la irundhu check pannum
  useEffect(() => {
    setIsLoggedIn(checkAuth());
  }, []);
  // ----------------------------------------

  return (
    <Router>
 HEAD
      <div className="flex flex-col min-h-screen bg-white text-poppins">
        
        <Navbar isLoggedIn={isLoggedIn} />

        <main className="flex-grow">
          <Routes>
            {/* Home-ku isLoggedIn prop-ah pass pandrom */}
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        <Footer />
      </div>

      <AppContent />
 main
    </Router>
  );
}

export default App;