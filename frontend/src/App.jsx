import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute';
import Footer from './components/Footer';

import ResourceManagement from './components/resources/ResourceManagement';
import MyBookings from './components/resources/MyBookings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-poppins selection:bg-yellow-100 flex flex-col">
        {/* Navbar is persistent across pages */}
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/AdminDashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <AuthRoute>
                  <ResourceManagement />
                </AuthRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <AuthRoute>
                  <MyBookings />
                </AuthRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer is persistent across pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;