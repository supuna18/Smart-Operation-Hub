import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center px-6 md:px-16 bg-[#FDFBF9]">
      <div className="max-w-4xl z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold leading-[1.1] text-[#3E2723]"
        >
          Elevating <span className="text-[#8D6E63]">Campus Operations</span> Through Smart Technology.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 text-xl text-[#5D4037]/70 leading-relaxed max-w-2xl"
        >
          A unified ecosystem designed for students, lecturers, and admins to manage resources, handle incidents, and stay connected.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <button className="bg-[#5D4037] text-white px-10 py-4 rounded-2xl flex items-center justify-center font-bold shadow-xl hover:shadow-[#D7CCC8] transition-all group">
            Explore Features <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="border-2 border-[#D7CCC8] px-10 py-4 rounded-2xl font-bold text-[#5D4037] hover:bg-[#EFEBE9] transition-all">
            Watch Demo
          </button>
        </motion.div>
      </div>

      {/* Decorative background element */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute right-[-5%] top-[10%] hidden lg:block w-[500px] h-[500px] bg-[#D7CCC8]/30 rounded-full blur-3xl"
      />
    </section>
  );
};

export default Hero;