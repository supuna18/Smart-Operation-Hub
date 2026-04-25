import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

// Auth utilities
import { isAdmin, isLoggedIn as checkAuth } from './utils/auth';

// Component Imports
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute';
import TicketDashboard from './components/TicketDashboard';
import TicketApprovalHub from './components/TicketApprovalHub';
import ResourceManagement from './components/resources/ResourceManagement';
import MyBookings from './components/resources/MyBookings';
import FacilityShowcase from './components/FacilityShowcase';
import ForgotPassword from './components/ForgotPassword';

// Context
import { ToastProvider } from './context/ToastContext';

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();

  // Hide footer for dashboard-style pages
  const hideFooter = location.pathname === '/AdminDashboard';

  return (
    <div className="min-h-screen bg-white font-poppins selection:bg-yellow-100 flex flex-col text-poppins">

      {/* Navbar - passing isLoggedIn to update UI on login/logout */}
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="flex-grow">
        <Routes>

          {/* Public Routes */}
          <Route
            path="/"
            element={
              isAdmin()
                ? <Navigate to="/AdminDashboard" replace />
                : <Home isLoggedIn={isLoggedIn} />
            }
          />

          <Route
            path="/about"
            element={
              isAdmin()
                ? <Navigate to="/AdminDashboard" replace />
                : <About />
            }
          />

          <Route
            path="/facilities"
            element={<FacilityShowcase />}
          />

          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* User Ticket Dashboard */}
          <Route
            path="/tickets"
            element={
              !checkAuth()
                ? <Navigate to="/login" replace />
                : isAdmin()
                ? <Navigate to="/AdminDashboard" replace />
                : <TicketDashboard />
            }
          />

          {/* Resource Management */}
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <ResourceManagement />
              </ProtectedRoute>
            }
          />

          {/* User Booking History */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/AdminDashboard"
            element={
              <ProtectedRoute adminOnly={true}>
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

      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Sync state with utility on mount
    setIsLoggedIn(checkAuth());
  }, []);

  return (
    <ToastProvider>
      <Router>
        <AppContent
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      </Router>
    </ToastProvider>
  );
}

export default App;