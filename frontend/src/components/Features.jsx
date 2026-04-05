import React from 'react';
import FeatureCard from './FeatureCard';
import { Database, Calendar, AlertCircle, Lock } from 'lucide-react';

const Features = () => {
  const services = [
    {
      icon: <Database />,
      title: "Catalogue Management",
      desc: "Manage facilities and campus resources with an organized catalog for admins.",
      delay: 0.1
    },
    {
      icon: <Calendar />,
      title: "Smart Booking",
      desc: "Automated booking workflow with instant conflict checking for halls and labs.",
      delay: 0.2
    },
    {
      icon: <AlertCircle />,
      title: "Incident Tracking",
      desc: "Report maintenance issues and track resolution status in real-time.",
      delay: 0.3
    },
    {
      icon: <Lock />,
      title: "Secure Access",
      desc: "Advanced role-based security and smart notifications for all campus users.",
      delay: 0.4
    }
  ];

  return (
    <section id="services" className="py-32 px-6 md:px-16 bg-white relative overflow-hidden">

      {/* Background decorations — matches About/Hero pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(250,204,21,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-yellow-50/60 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-64 h-64 border-[20px] border-yellow-100 rounded-full -ml-32 -mb-32 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section header ── */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">

            {/* Eyebrow — same pill pattern */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/10 text-[#262626] text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
              Our Ecosystem
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-[#262626] leading-tight">
              Comprehensive solutions{' '}
              <span className="relative inline-block">
                <span className="text-yellow-500">for campus</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 260 10" fill="none">
                  <path d="M2 8C50 2 130 1 258 8" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                </svg>
              </span>{' '}
              challenges.
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
            <p className="text-gray-400 font-medium max-w-xs text-sm leading-relaxed text-left md:text-right">
              Four specialized modules working together to streamline your operations.
            </p>
            {/* Module count badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#262626] rounded-2xl">
              <span className="text-2xl font-black text-[#FACC15]">4</span>
              <span className="text-white text-xs font-bold uppercase tracking-widest leading-tight">
                Core<br />Modules
              </span>
            </div>
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <FeatureCard key={index} {...service} />
          ))}
        </div>

        {/* ── Bottom CTA strip ── */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-[#262626] border border-white/5">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-[#FACC15] rounded-2xl flex items-center justify-center text-[#262626] shrink-0">
              <i className="fas fa-rocket text-lg" />
            </div>
            <div>
              <p className="text-white font-black text-lg leading-tight">Ready to explore all features?</p>
              <p className="text-gray-400 text-sm font-medium mt-0.5">Get a full walkthrough of the SmartHub platform.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button className="group px-8 py-3.5 bg-[#FACC15] text-[#262626] rounded-full font-black text-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 flex items-center gap-2">
              View All Features
              <span className="w-6 h-6 rounded-full bg-[#262626]/10 flex items-center justify-center group-hover:bg-[#262626]/20 transition-colors">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <button className="px-8 py-3.5 border border-white/20 text-white rounded-full font-bold text-sm hover:border-[#FACC15]/40 hover:text-[#FACC15] hover:-translate-y-1 transition-all duration-300">
              Book a Demo
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;