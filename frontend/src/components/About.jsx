import React from 'react';
import { motion } from 'framer-motion';
import aboutHeroImg from '../assets/about-hero.png';

const About = () => {
  return (
    <div className="">
      {/* 1. Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#262626] pt-32 pb-0">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src={aboutHeroImg} alt="About Us" className="w-full h-full object-cover opacity-20 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#262626]/60 via-[#262626]/80 to-[#262626]" />
        </div>

        {/* Decorative grid overlay */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(250,204,21,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating accent orbs */}
        <div className="absolute top-24 left-12 w-72 h-72 bg-[#FACC15]/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-[#FACC15]/8 rounded-full blur-[120px] z-0" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/10 text-[#FACC15] text-xs font-bold uppercase tracking-[0.2em] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
            Who We Are
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
          >
            Our Vision &{' '}
            <span className="relative inline-block">
              <span className="text-[#FACC15]">Our Story</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 9C50 3 150 1 298 9" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 font-medium leading-relaxed"
          >
            Redefining campus management through smart automation and unified digital ecosystems.
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-14 flex flex-col items-center gap-2 text-gray-500"
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#FACC15]/60" />
            <span className="text-xs tracking-widest uppercase">Scroll</span>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[70px] fill-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* 2. Mission & Philosophy Section */}
      <section className="py-32 px-6 md:px-16 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-50 rounded-full -mr-80 -mt-80 z-0" />
        <div className="absolute bottom-0 left-0 w-64 h-64 border-[20px] border-yellow-100 rounded-full -ml-32 -mb-32 z-0" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Section tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FACC15]/15 text-[#262626] text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-1 h-1 rounded-full bg-[#FACC15]" />
              Our Purpose
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-[#262626] mb-6 leading-tight">
              Empowering the Future of{' '}
              <span className="relative">
                <span className="text-yellow-500">Education</span>
                <span className="absolute bottom-1 left-0 w-full h-1 bg-yellow-400/30 rounded-full" />
              </span>
              .
            </h2>

            <p className="text-lg text-gray-500 leading-relaxed mb-10 font-medium">
              SmartHub was born from a simple observation: educational institutions deserve better tools. We saw fragmented systems slowing down progress and created a unified platform that bridges the gap between administrators, lecturers, and students.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: 'fa-bullseye',
                  title: 'Our Mission',
                  desc: 'To streamline complex campus tasks through intelligent automation.',
                },
                {
                  icon: 'fa-eye',
                  title: 'Our Vision',
                  desc: 'To become the global standard for smart campus infrastructure.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group p-7 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-yellow-200 hover:-translate-y-1 transition-all duration-300 cursor-default"
                >
                  <div className="w-12 h-12 bg-[#FACC15] rounded-2xl flex items-center justify-center text-[#262626] text-lg mb-5 group-hover:scale-110 transition-transform duration-300">
                    <i className={`fas ${item.icon}`} />
                  </div>
                  <h4 className="font-black text-[#262626] text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decorative border frame */}
            <div className="absolute -top-4 -right-4 w-full h-full rounded-[3rem] border-2 border-[#FACC15]/40 z-0" />
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
              <img src={aboutHeroImg} alt="Team collaboration" className="w-full aspect-[4/5] object-cover" />
              {/* Image overlay badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#262626]/90 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center text-[#262626] shrink-0">
                    <i className="fas fa-graduation-cap text-sm" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Trusted by Campus Leaders</p>
                    <p className="text-gray-400 text-xs mt-0.5">Powering smarter educational experiences</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-16 bg-[#FACC15] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #262626 0, #262626 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {[
            { value: '200+', label: 'Institutions' },
            { value: '50K+', label: 'Active Users' },
            { value: '99.9%', label: 'Uptime' },
            { value: '4.9★', label: 'Avg Rating' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-black text-[#262626]">{stat.value}</p>
              <p className="text-sm font-bold text-[#262626]/60 mt-1 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="py-32 px-6 md:px-16 bg-[#262626] text-white relative overflow-hidden">
        {/* Orb decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-400/5 rounded-full blur-[100px] -ml-48 -mb-48" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#FACC15]/30 bg-[#FACC15]/10 text-[#FACC15] text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              Values that drive us
            </div>
            <h2 className="text-4xl md:text-6xl font-black">
              Built on{' '}
              <span className="text-[#FACC15]">Excellence</span>
              .
            </h2>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'fa-shield-halved',
                title: 'Security & Trust',
                desc: 'Ensuring the highest level of data integrity and protection for all campus users.',
                number: '01',
              },
              {
                icon: 'fa-users-gear',
                title: 'User Experience',
                desc: 'Designing tools that are as powerful as they are intuitive for every academic role.',
                number: '02',
              },
              {
                icon: 'fa-lightbulb',
                title: 'Continuous Innovation',
                desc: 'Constantly evolving our platform with the latest in smart-city and AI technology.',
                number: '03',
              },
            ].map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -10 }}
                className="relative p-10 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md group hover:bg-white/[0.08] hover:border-[#FACC15]/30 transition-all duration-400 cursor-default overflow-hidden"
              >
                {/* Large number watermark */}
                <span className="absolute top-6 right-8 text-7xl font-black text-white/5 group-hover:text-[#FACC15]/10 transition-colors duration-400 select-none leading-none">
                  {val.number}
                </span>

                {/* Horizontal accent bar */}
                <div className="w-10 h-1 bg-[#FACC15] rounded-full mb-8 group-hover:w-16 transition-all duration-300" />

                <div className="w-14 h-14 bg-[#FACC15] rounded-2xl flex items-center justify-center text-[#262626] text-2xl mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-400/20">
                  <i className={`fas ${val.icon}`} />
                </div>

                <h3 className="text-2xl font-black mb-4 text-white">{val.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/culture strip */}
      <section className="py-20 bg-gray-50 px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FACC15]/20 text-[#262626] text-xs font-bold uppercase tracking-widest mb-5">
                <span className="w-1 h-1 rounded-full bg-[#FACC15]" />
                Our Culture
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#262626] mb-5 leading-tight">
                A team passionate about <span className="text-yellow-500">impact</span>.
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                We bring together engineers, educators, and designers who share one belief: technology should make learning more human, not less.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 shrink-0">
              {[
                { icon: 'fa-rocket', label: 'Startup Speed' },
                { icon: 'fa-handshake', label: 'Deep Trust' },
                { icon: 'fa-heart', label: 'Genuine Care' },
                { icon: 'fa-globe', label: 'Global Reach' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="w-9 h-9 bg-[#FACC15] rounded-xl flex items-center justify-center text-[#262626] text-sm shrink-0">
                    <i className={`fas ${item.icon}`} />
                  </span>
                  <span className="font-bold text-[#262626] text-sm">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Contact / CTA Section */}
      <section className="py-28 px-6 md:px-16 bg-white relative overflow-hidden">
        {/* Background shape */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full bg-yellow-50 blur-[80px] opacity-60" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Icon strip */}
          <div className="inline-flex items-center justify-center gap-5 mb-12">
            {['fab fa-linkedin', 'fab fa-twitter', 'fab fa-github'].map((ic, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#262626] hover:text-[#FACC15] hover:border-[#262626] hover:-translate-y-1 transition-all duration-300 cursor-pointer text-lg"
              >
                <i className={ic} />
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
            Get In Touch
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-[#262626] mb-6 leading-tight">
            Ready to transform<br />your campus?
          </h2>
          <p className="text-lg text-gray-400 font-medium mb-12 max-w-xl mx-auto">
            Join hundreds of institutions already running smarter with SmartHub.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-[#262626] text-[#FACC15] px-10 py-4 rounded-full font-black text-base shadow-xl shadow-gray-200 hover:shadow-gray-300 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
              Contact Our Team
              <span className="w-7 h-7 rounded-full bg-[#FACC15]/20 flex items-center justify-center group-hover:bg-[#FACC15]/30 transition-colors">
                <i className="fas fa-arrow-right text-xs" />
              </span>
            </button>
            <button className="px-10 py-4 rounded-full font-bold text-base border-2 border-gray-200 text-gray-500 hover:border-[#262626] hover:text-[#262626] hover:-translate-y-1 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;