import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { isAdmin, isLoggedIn } from './utils/auth';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute';
import Footer from './components/Footer';
import TicketDashboard from './components/TicketDashboard';
import TicketApprovalHub from './components/TicketApprovalHub';
import ResourceManagement from './components/resources/ResourceManagement';
import MyBookings from './components/resources/MyBookings';
import ForgotPassword from './components/ForgotPassword';
import { ToastProvider } from './context/ToastContext';

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
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* User Ticket Dashboard */}
          <Route path="/tickets" element={!isLoggedIn() ? <Navigate to="/login" replace /> : isAdmin() ? <Navigate to="/AdminDashboard" replace /> : <TicketDashboard />} />

          {/* Resource Management & Bookings */}
          <Route 
            path="/resources" 
            element={
              <ProtectedRoute>
                <ResourceManagement />
              </ProtectedRoute>
            } 
          />
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

      {/* Footer (hidden on Admin Dashboard & Resources) */}
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;