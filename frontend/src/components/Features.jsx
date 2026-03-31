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
    <section className="py-32 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-2xl">
            <h4 className="text-[#8D6E63] font-bold tracking-widest uppercase text-sm mb-4">Our Ecosystem</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3E2723]">Comprehensive solutions for campus challenges.</h2>
          </div>
          <p className="text-[#5D4037]/60 font-medium max-w-xs mt-6 md:mt-0">
            Four specialized modules working together to streamline your operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service, index) => (
            <FeatureCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;