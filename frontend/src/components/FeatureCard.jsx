import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, desc, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -10 }}
      className="relative p-10 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200 hover:border-yellow-200 transition-all duration-300 group overflow-hidden cursor-default"
    >
      {/* Subtle corner glow on hover */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FACC15]/0 group-hover:bg-[#FACC15]/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

      {/* Top accent bar */}
      <div className="w-8 h-1 bg-[#FACC15] rounded-full mb-8 group-hover:w-16 transition-all duration-300" />

      {/* Icon box */}
      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-[#262626] group-hover:bg-[#FACC15] group-hover:border-[#FACC15] group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-yellow-400/25 transition-all duration-300">
        {icon}
      </div>

      {/* Text */}
      <h3 className="mt-8 text-xl font-black text-[#262626]">{title}</h3>
      <p className="mt-3 text-gray-400 font-medium leading-relaxed text-sm">{desc}</p>

      {/* Divider */}
      <div className="mt-8 w-full h-px bg-gray-100 group-hover:bg-yellow-100 transition-colors duration-300" />

      {/* Bottom "Learn more" row */}
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-300 group-hover:text-[#262626] transition-colors duration-300">
          Learn more
        </span>
        <span className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-[#FACC15] flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2l3 3-3 3" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </motion.div>
  );
};

export default FeatureCard;