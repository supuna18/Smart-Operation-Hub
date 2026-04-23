import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import Features from './Features';
import FacilityShowcase from './FacilityShowcase'; 

const Home = () => {
  const location = useLocation();
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    if (window.location.hash === '#services') {
      setCurrentView('services');
    } else {
      setCurrentView('home');
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      {currentView === 'home' ? (
        <div className="animate-in fade-in duration-1000">
          <Hero />
          <Features />
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-10 duration-700">
          {/* Direct call without props */}
          <FacilityShowcase isFullPage={true} />
        </div>
      )}
    </div>
  );
};

export default Home;