import React from 'react';
import { motion } from 'framer-motion';
import aboutHeroImg from '../assets/about-hero.png';

const About = () => {
  return (
    <div className="pt-20">
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#262626]">
        <div className="absolute inset-0 z-0">
          <img src={aboutHeroImg} alt="About Us" className="w-full h-full object-cover opacity-40 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#262626]/80 to-[#262626]" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Our <span className="text-[#FACC15]">Vision</span> & Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-xl text-gray-300 font-medium"
          >
            Redefining campus management through smart automation and unified digital ecosystems.
          </motion.p>
        </div>
        
        {/* Professional Shape Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. Mission & Philosophy Section */}
      <section className="py-32 px-6 md:px-16 bg-white relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FACC15]/20 rounded-full blur-3xl" />
            <h2 className="text-4xl font-bold text-[#262626] mb-8 relative">Empowering the Future of <span className="text-yellow-500">Education</span>.</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              SmartHub was born from a simple observation: educational institutions deserve better tools. We saw fragmented systems slowing down progress and created a unified platform that bridges the gap between administrators, lecturers, and students.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <i className="fas fa-bullseye text-3xl text-yellow-500 mb-4" />
                <h4 className="font-bold text-[#262626]">Our Mission</h4>
                <p className="text-sm text-gray-500 mt-2">To streamline complex campus tasks through intelligent automation.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <i className="fas fa-eye text-3xl text-yellow-500 mb-4" />
                <h4 className="font-bold text-[#262626]">Our Vision</h4>
                <p className="text-sm text-gray-500 mt-2">To become the global standard for smart campus infrastructure.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <img src={aboutHeroImg} alt="Team collaboration" className="w-full aspect-[4/5] object-cover" />
          </motion.div>
        </div>
      </section>

      {/* 3. Core Values with Professional Shapes */}
      <section className="py-32 px-6 md:px-16 bg-[#262626] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        
        <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
          <h4 className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-4">Values that drive us</h4>
          <h2 className="text-4xl md:text-5xl font-bold">Built on <span className="text-yellow-400">Excellence</span>.</h2>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 relative z-10">
          {[
            {
              icon: "fa-shield-halved",
              title: "Security & Trust",
              desc: "Ensuring the highest level of data integrity and protection for all campus users."
            },
            {
              icon: "fa-users-gear",
              title: "User Experience",
              desc: "Designing tools that are as powerful as they are intuitive for every academic role."
            },
            {
              icon: "fa-lightbulb",
              title: "Continuous Innovation",
              desc: "Constantly evolving our platform with the latest in smart-city and AI technology."
            }
          ].map((val, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-[#262626] text-2xl mb-8">
                <i className={`fas ${val.icon}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{val.title}</h3>
              <p className="text-gray-400 leading-relaxed font-medium">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Contact/CTA Section with Font Awesome Icons */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center space-x-6 mb-10">
             <i className="fab fa-linkedin text-3xl text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer" />
             <i className="fab fa-twitter text-3xl text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer" />
             <i className="fab fa-github text-3xl text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer" />
          </div>
          <h2 className="text-4xl font-bold text-[#262626] mb-8">Ready to transform your campus?</h2>
          <button className="bg-[#262626] text-yellow-400 px-12 py-5 rounded-full font-bold shadow-xl shadow-gray-200 hover:shadow-gray-300 hover:-translate-y-1 transition-all">
            Contact Our Team
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
