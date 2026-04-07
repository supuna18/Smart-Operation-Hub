import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

// Booking Module
import BookingManager from './components/BookingManager.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-poppins selection:bg-yellow-100 flex flex-col">
        
        {/* Navbar */}
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
          </Routes>

          {/* Booking Section (from HEAD) */}
          <section
            id="booking-section"
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
            }}
          >
            <BookingManager />
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;