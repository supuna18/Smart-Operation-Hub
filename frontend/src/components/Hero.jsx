import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';

const Hero = () => {
  return (
    <section className="relative overflow-hidden flex items-center pt-28 pb-32 px-6 md:px-16 bg-white min-h-screen">

      {/* Subtle grid overlay — matches About page */}
      <div
        className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(250,204,21,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient orbs */}
      <div className="absolute top-20 right-[8%] w-[500px] h-[500px] bg-yellow-100/40 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-[5%] w-[360px] h-[360px] bg-yellow-50/60 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Decorative corner ring */}
      <div className="absolute -bottom-24 -right-24 w-72 h-72 border-[24px] border-yellow-100 rounded-full z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center z-10 w-full">

        {/* ── Left copy ── */}
        <div className="max-w-2xl">

          {/* Eyebrow pill — same pattern as About */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/10 text-[#262626] text-xs font-bold uppercase tracking-[0.2em] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            Smart Campus Management V2.0
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.04] tracking-tight text-[#262626]"
          >
            Elevating{' '}
            <span className="relative inline-block">
              <span className="text-yellow-500">Campus</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 280 10" fill="none">
                <path d="M2 8C50 2 140 1 278 8" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              </svg>
            </span>{' '}
            Operations.<br />
            <span className="text-[#262626]">Through Smart Tech.</span>
          </motion.h1>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 text-lg md:text-xl text-gray-500 leading-relaxed max-w-xl font-medium"
          >
            A unified ecosystem designed for students, lecturers, and admins to manage resources, handle incidents, and stay connected.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-4"
          >
            <button className="group w-full sm:w-auto bg-[#262626] text-[#FACC15] px-10 py-4 rounded-full flex items-center justify-center font-black shadow-xl shadow-gray-200 hover:shadow-gray-300 hover:-translate-y-1 transition-all duration-300 gap-3">
              Explore Features
              <span className="w-7 h-7 rounded-full bg-[#FACC15]/20 flex items-center justify-center group-hover:bg-[#FACC15]/30 transition-colors">
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>

            <button className="group w-full sm:w-auto border-2 border-gray-200 px-10 py-4 rounded-full font-bold text-[#262626] hover:border-[#262626] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#FACC15] flex items-center justify-center transition-colors duration-300">
                <Play size={13} className="ml-0.5" />
              </span>
              Watch Demo
            </button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-14 flex items-center gap-6 flex-wrap"
          >
            {[
              { icon: 'fa-shield-halved', label: 'Secure & Trusted' },
              { icon: 'fa-bolt', label: '99.9% Uptime' },
              { icon: 'fa-users', label: '50K+ Users' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400">
                <i className={`fas ${item.icon} text-[#FACC15] text-sm`} />
                <span className="text-sm font-bold">{item.label}</span>
                {i < 2 && <span className="ml-4 w-px h-4 bg-gray-200 hidden sm:block" />}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right visual ── */}
        <div className="hidden lg:block relative">

          {/* Ambient glow behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-yellow-100/50 to-transparent rounded-full blur-3xl -z-10" />

          {/* Decorative offset border frame — same style as About image */}
          <div className="absolute -top-4 -right-4 w-full h-full rounded-[3rem] border-2 border-[#FACC15]/40 z-0" />

          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2 }}
            className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200 aspect-square"
          >
            <img
              src={heroBg}
              alt="Digital Campus Illustration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#262626]/30 to-transparent pointer-events-none" />

            {/* Floating stat card — bottom left */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="absolute bottom-6 left-6 right-6 p-5 bg-[#262626]/90 backdrop-blur-md rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FACC15] flex items-center justify-center text-[#262626] shrink-0">
                  <i className="fas fa-graduation-cap text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Powering 200+ Institutions</p>
                  <p className="text-gray-400 text-xs mt-0.5">One platform. Every campus role.</p>
                </div>
                <div className="flex -space-x-2">
                  {['bg-yellow-400', 'bg-gray-400', 'bg-white'].map((c, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-[#262626]`} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating mini badge — top right */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="absolute -top-4 -right-6 z-20 flex items-center gap-3 bg-white border border-gray-100 shadow-xl rounded-2xl px-4 py-3"
          >
            <span className="w-8 h-8 rounded-xl bg-[#FACC15] flex items-center justify-center text-[#262626]">
              <i className="fas fa-star text-xs" />
            </span>
            <div>
              <p className="text-xs font-black text-[#262626]">Rated 4.9 / 5</p>
              <p className="text-[10px] text-gray-400 font-medium">By campus admins</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 z-10"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#FACC15]/50" />
        <span className="text-[10px] tracking-widest uppercase font-bold">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;