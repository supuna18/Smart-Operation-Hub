import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white font-poppins selection:bg-[#D7CCC8]">
      {/* 1. Navbar Component */}
      <Navbar />

      {/* 2. Hero Section Component */}
      <Hero />

      {/* 3. Features Section Component */}
      <Features />

      {/* 4. Footer Component */}
      <Footer />
    </div>
  );
}

export default App;