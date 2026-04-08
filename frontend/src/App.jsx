import React, { useState, useEffect } from 'react'; // useEffect sethuten
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import { isLoggedIn as checkAuth } from './utils/auth'; // Leader-oda auth helper

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
    </Router>
  );
}

export default App;