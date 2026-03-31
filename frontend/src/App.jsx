import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Calendar, Wrench, Bell } from 'lucide-react';

const App = () => {
  // Animations variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#3E2723] overflow-x-hidden">
      {/* --- Navbar --- */}
      <nav className="flex justify-between items-center px-10 py-6 sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tighter text-[#5D4037]"
        >
          Smart<span className="text-[#8D6E63]">Hub</span>
        </motion.div>
        <div className="hidden md:flex space-x-8 font-medium">
          {['Home', 'Services', 'Facilities', 'About'].map((item) => (
            <a key={item} href="#" className="hover:text-[#8D6E63] transition-colors">{item}</a>
          ))}
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#5D4037] text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-[#3E2723] transition-all"
        >
          Get Started
        </motion.button>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative h-[85vh] flex items-center px-10 overflow-hidden bg-[#EFEBE9]/30">
        <div className="max-w-3xl z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-bold leading-tight"
          >
            Efficiency Redefined for <br />
            <span className="text-[#8D6E63]">Modern Campus Life</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-6 text-xl text-[#5D4037]/80 leading-relaxed max-w-xl"
          >
            Manage resources, simplify bookings, and report incidents seamlessly with the ultimate campus operations platform.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex space-x-4"
          >
            <button className="bg-[#5D4037] text-white px-8 py-4 rounded-xl flex items-center font-bold shadow-xl hover:shadow-2xl transition-all group">
              Explore Services <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-[#5D4037] px-8 py-4 rounded-xl font-bold hover:bg-[#5D4037] hover:text-white transition-all">
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Hero Image / Shape Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute right-[-10%] hidden lg:block w-[600px] h-[600px] bg-[#D7CCC8] rounded-full filter blur-3xl opacity-40"
        />
      </section>

      {/* --- Features / Members Section --- */}
      <section className="py-24 px-10 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Our Ecosystem</h2>
          <div className="w-20 h-1.5 bg-[#8D6E63] mx-auto mt-4 rounded-full" />
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Card 1 */}
          <FeatureCard 
            icon={<Calendar className="w-8 h-8" />}
            title="Resource Management"
            desc="Cataloging campus assets and facilities efficiently."
            delay={0.1}
          />
          {/* Card 2 */}
          <FeatureCard 
            icon={<Shield className="w-8 h-8" />}
            title="Booking Workflow"
            desc="Streamlined booking and conflict checking for halls."
            delay={0.2}
          />
          {/* Card 3 */}
          <FeatureCard 
            icon={<Wrench className="w-8 h-8" />}
            title="Incident Tracking"
            desc="Quick reporting and managing equipment maintenance."
            delay={0.3}
          />
          {/* Card 4 */}
          <FeatureCard 
            icon={<Bell className="w-8 h-8" />}
            title="Secure Access"
            desc="Role-based security and smart notifications."
            delay={0.4}
          />
        </motion.div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#3E2723] text-[#D7CCC8] py-10 px-10 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="font-medium">© 2026 Smart-Operation-Hub. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Reusable Component for Feature Cards
const FeatureCard = ({ icon, title, desc }) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -10 }}
      className="p-8 rounded-3xl bg-[#F5F5F5] border border-[#D7CCC8]/30 hover:border-[#8D6E63] transition-all group"
    >
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md text-[#8D6E63] group-hover:bg-[#8D6E63] group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="mt-6 text-2xl font-bold">{title}</h3>
      <p className="mt-3 text-[#5D4037]/70 font-medium leading-snug">{desc}</p>
    </motion.div>
  );
};

export default App;