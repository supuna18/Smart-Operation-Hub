import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-5 sticky top-0 bg-white/70 backdrop-blur-xl z-50 border-b border-gray-200/30 font-poppins transition-all">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold tracking-tight text-[#262626]">
        Smart<span className="text-[#FACC15]">Hub</span>
      </motion.div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-10 font-medium items-center">
        {['Home', 'Services', 'About'].map((item) => (
          <a key={item} href="#" className="text-[#262626]/80 hover:text-[#262626] transition-colors">{item}</a>
        ))}
        <div className="flex items-center space-x-4">
          <button className="text-[#262626] font-semibold hover:text-[#FACC15] transition-colors">
            Login
          </button>
          <button className="bg-[#FACC15] text-[#262626] px-7 py-2.5 rounded-full font-bold shadow-lg shadow-[#FACC15]/20 hover:shadow-[#FACC15]/40 hover:-translate-y-0.5 transition-all">
            Get Started
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-[#262626] hover:bg-gray-100 p-2 rounded-lg transition-colors">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl flex flex-col p-6 md:hidden space-y-4"
          >
            {['Home', 'Services', 'About'].map((item) => (
              <a key={item} href="#" className="font-medium text-[#262626] p-3 rounded-xl hover:bg-gray-50 transition-colors">
                {item}
              </a>
            ))}
            <div className="flex flex-col space-y-3 pt-2">
              <button className="text-[#262626] font-semibold p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Login
              </button>
              <button className="bg-[#FACC15] text-[#262626] px-6 py-3 rounded-xl font-bold shadow-md inline-flex justify-center w-full">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;