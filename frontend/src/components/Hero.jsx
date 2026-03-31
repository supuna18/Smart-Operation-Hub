import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden flex items-center pt-20 pb-32 px-6 md:px-16 bg-[#FDFBF9]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#8D6E63]/10 border border-[#8D6E63]/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#8D6E63] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8D6E63]">Smart Campus Management V2.0</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight text-[#3E2723]"
          >
            Elevating <span className="text-[#8D6E63]">Campus Operations</span> Through Smart Tech.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 text-lg md:text-xl text-[#5D4037]/70 leading-relaxed max-w-2xl"
          >
            A unified ecosystem designed for students, lecturers, and admins to manage resources, handle incidents, and stay connected.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button className="w-full sm:w-auto bg-[#5D4037] text-white px-10 py-4 rounded-2xl flex items-center justify-center font-bold shadow-xl shadow-[#5D4037]/20 hover:shadow-[#5D4037]/40 hover:-translate-y-1 transition-all group">
              Explore Features <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto border-2 border-[#D7CCC8] px-10 py-4 rounded-2xl font-bold text-[#5D4037] hover:bg-[#EFEBE9] transition-all flex items-center justify-center space-x-2">
              <Play size={18} />
              <span>Watch Demo</span>
            </button>
          </motion.div>
        </div>

        {/* Hero Visual Part */}
        <div className="hidden lg:block relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-[#D7CCC8]/50"
          >
            <div className="aspect-square bg-gradient-to-br from-[#EFEBE9] to-[#D7CCC8]/30 flex items-center justify-center">
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-[#5D4037] rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-xl">
                  <span className="text-4xl font-bold">S</span>
                </div>
                <h3 className="text-2xl font-bold text-[#3E2723]">Digital Campus</h3>
                <p className="text-[#5D4037]/60 mt-2 font-medium">Streamlined, Automated, Secure.</p>
              </div>
            </div>
          </motion.div>
          {/* Static Background Blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-[#D7CCC8]/20 to-transparent rounded-full blur-3xl -z-10" />
        </div>
      </div>

      {/* Decorative background element - NO BOUNCE */}
      <div className="absolute right-[-10%] top-[-10%] w-[600px] h-[600px] bg-[#D7CCC8]/20 rounded-full blur-[120px] -z-10" />
    </section>
  );
};

export default Hero;