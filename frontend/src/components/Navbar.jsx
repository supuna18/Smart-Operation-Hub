import { motion } from 'framer-motion';

const Navbar = () => (
  <nav className="flex justify-between items-center px-10 py-6 sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm font-poppins">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-[#5D4037]">
      Smart<span className="text-[#8D6E63]">Hub</span>
    </motion.div>
    <div className="hidden md:flex space-x-8 font-medium">
      {['Home', 'Services', 'About'].map((item) => (
        <a key={item} href="#" className="hover:text-[#8D6E63] transition-colors">{item}</a>
      ))}
    </div>
    <button className="bg-[#5D4037] text-white px-6 py-2 rounded-full font-semibold">Get Started</button>
  </nav>
);

export default Navbar;