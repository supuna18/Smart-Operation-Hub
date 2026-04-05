import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Footer from './components/Footer';

import ResourceManagement from './components/resources/ResourceManagement';

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
            <Route path="/resources" element={<ResourceManagement />} />
          </Routes>
        </main>

        {/* Footer is persistent across pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;