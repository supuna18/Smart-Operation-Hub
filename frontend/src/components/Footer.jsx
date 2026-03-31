import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#3E2723] text-[#D7CCC8] py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-16">
        <div className="max-w-sm">
          <h2 className="text-3xl font-bold text-white mb-6">SmartHub</h2>
          <p className="text-[#D7CCC8]/60 leading-relaxed">
            The next generation of campus management. Built for efficiency, transparency, and seamless collaboration.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mt-12 md:mt-0">
          <div>
            <h5 className="text-white font-bold mb-4">Platform</h5>
            <ul className="space-y-2 opacity-70">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Connect</h5>
            <ul className="space-y-2 opacity-70">
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row justify-between items-center text-sm opacity-50">
        <p>© 2026 Smart-Operation-Hub. Proudly developed by Team Alpha.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;