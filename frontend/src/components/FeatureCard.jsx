import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, desc, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -12 }}
      className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all group"
    >
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#262626] group-hover:bg-yellow-400 group-hover:text-[#262626] transition-all duration-500">
        {icon}
      </div>
      <h3 className="mt-8 text-2xl font-bold text-[#262626]">{title}</h3>
      <p className="mt-4 text-gray-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
};

export default FeatureCard;