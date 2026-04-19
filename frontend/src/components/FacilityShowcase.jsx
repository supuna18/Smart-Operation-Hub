import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Clock, ArrowRight, ShieldCheck, Lock, CheckCircle, Globe } from 'lucide-react';
import { isLoggedIn } from '../utils/auth';
import BookingForm from './BookingForm'; 

const FacilityShowcase = () => {
  const navigate = useNavigate();
  
  // Member 2 State Management
  const [viewState, setViewState] = useState('gallery'); // 'gallery' or 'details'
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showForm, setShowForm] = useState(false); // FIXED: State defined properly
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const authenticated = isLoggedIn();

  // 10+ SLIIT Malabe Campus Facilities Data
  const sliitFacilities = [
    {
      id: "1",
      name: "FOC Computing Lab - Level 4",
      category: "LABS",
      capacity: "60 Seats",
      location: "FOC Building",
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
      desc: "SLIIT Faculty of Computing primary research lab. High-end workstations with dual monitors.",
      details: "Available for final year projects and AI research. Equipped with high-speed 1Gbps internet."
    },
    {
      id: "2",
      name: "Main Student Canteen",
      category: "DINING",
      capacity: "400+ People",
      location: "Main Canteen Block",
      img: "https://images.unsplash.com/photo-1567529684892-09290a1b2d05?q=80&w=800",
      desc: "The heartbeat of SLIIT dining. Fresh meals and snacks for all students.",
      details: "Features automated ordering and a spacious outdoor student plaza seating."
    },
    {
      id: "3",
      name: "Olympic Size Swimming Pool",
      category: "SPORTS",
      capacity: "Pro Grade",
      location: "SLIIT Sports Complex",
      img: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=800",
      desc: "50-meter temperature-controlled pool for training and recreation.",
      details: "Locker room access and professional lifeguards available during all sessions."
    },
    {
      id: "4",
      name: "Engineering Lab (Curtin)",
      category: "LABS",
      capacity: "40 Seats",
      location: "Engineering Wing",
      img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800",
      desc: "Advanced hardware testing lab for Curtin Engineering programs.",
      details: "Equipped with oscilloscopes, PLC trainers, and robotics workstations."
    },
    {
      id: "5",
      name: "Main Library Study Zone",
      category: "ACADEMIC",
      capacity: "500+ Seats",
      location: "Admin Building L2",
      img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800",
      desc: "Quiet zones for intensive study and access to digital archives.",
      details: "Group discussion cubicles available for prior booking by students."
    },
    {
      id: "6",
      name: "SLIIT Main Gym",
      category: "SPORTS",
      capacity: "50 People",
      location: "Sports Complex L1",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
      desc: "Full-range cardio and weight-lifting equipment for student wellness.",
      details: "Certified trainers are present. Student ID is mandatory for access."
    },
    {
      id: "7",
      name: "Grand Auditorium",
      category: "EVENTS",
      capacity: "1200 Seats",
      location: "SLIIT Admin Block",
      img: "https://images.unsplash.com/photo-1505373630562-402923ad99b1?q=80&w=800",
      desc: "SLIIT-oda primary event space for convocations and cultural festivals.",
      details: "State-of-the-art 4K projection and Dolby Atmos sound system."
    },
    {
      id: "8",
      name: "Innovation Hub",
      category: "ACADEMIC",
      capacity: "30 People",
      location: "Business School",
      img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800",
      desc: "Collaborative workspace for student startups and brainstorming.",
      details: "High-speed Wi-Fi, writable walls, and coffee station provided."
    },
    {
      id: "9",
      name: "Outdoor Cricket Ground",
      category: "SPORTS",
      capacity: "Standard",
      location: "Main Entrance Area",
      img: "https://images.unsplash.com/photo-1531415074968-0036ba1b575da?q=80&w=800",
      desc: "Natural turf ground with night-time floodlight facilities.",
      details: "Available for tournament bookings and casual evening practice."
    },
    {
      id: "10",
      name: "FOC Seminar Room",
      category: "EVENTS",
      capacity: "100 Seats",
      location: "FOC Wing L5",
      img: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=800",
      desc: "Smart seminar hall with hybrid learning capabilities.",
      details: "Ideal for workshops, tech talks, and project presentations."
    }
  ];

  const filtered = sliitFacilities.filter(f => 
    (activeFilter === "ALL" || f.category === activeFilter) &&
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookNow = () => {
    if (authenticated) {
      setShowForm(true); // FIXED: Form will now open
    } else {
      navigate('/login');
    }
  };

  const openDetails = (f) => {
    setSelectedFacility(f);
    setViewState('details');
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-16 px-6 md:px-16 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Gallery View */}
        {viewState === 'gallery' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-left">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-yellow-400 w-12 h-1.5 rounded-full" />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Campus Ecosystem</span>
                </div>
                <h1 className="text-5xl font-black text-[#262626]">Campus <span className="text-yellow-500">Facilities</span></h1>
                <p className="text-gray-400 mt-2 font-medium italic italic">Discover world-class assets at SLIIT Malabe.</p>
              </div>
              <div className="bg-[#262626] p-6 rounded-[2.5rem] text-white border border-white/5 shadow-2xl hidden md:block">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 text-right">Operational Status</p>
                 <div className="flex items-center gap-3 text-2xl font-black">98.4% <ShieldCheck className="text-yellow-400 w-6 h-6"/></div>
              </div>
            </div>

            {/* Search & Tabs */}
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search facilities..." className="w-full pl-12 pr-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-yellow-500 outline-none font-medium" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {["ALL", "LABS", "SPORTS", "DINING", "ACADEMIC"].map(tag => (
                  <button key={tag} onClick={() => setActiveFilter(tag)} className={`px-7 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${activeFilter === tag ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-200' : 'bg-white text-gray-400 hover:bg-gray-100'}`}>{tag}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((f) => (
                <div key={f.id} onClick={() => openDetails(f)} className="group bg-white rounded-[3.5rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 cursor-pointer text-left">
                  <div className="relative h-64 rounded-[2.5rem] overflow-hidden">
                    <img src={f.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className="absolute top-6 left-6"><span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[9px] font-black text-gray-800 uppercase tracking-widest shadow-sm">{f.category}</span></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-[#262626] mb-3">{f.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">
                      <MapPin size={14} className="text-yellow-500" /> {f.location}
                    </div>
                    <button className="text-yellow-600 font-black text-xs uppercase flex items-center gap-1 group-hover:gap-3 transition-all">View details <ArrowRight size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details View */}
        {viewState === 'details' && selectedFacility && (
          <div className="animate-in slide-in-from-right-10 duration-500 text-left">
            <button onClick={() => setViewState('gallery')} className="mb-10 text-gray-400 font-black text-xs uppercase hover:text-black transition-all flex items-center gap-2">← Back to Catalogue</button>
            <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl border border-gray-50 flex flex-col lg:flex-row gap-20">
              <div className="lg:w-1/2 h-[550px] rounded-[3.5rem] overflow-hidden shadow-2xl">
                 <img src={selectedFacility.img} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="lg:w-1/2 flex flex-col justify-center">
                <span className="text-yellow-500 font-black text-sm uppercase tracking-[0.4em] mb-4">{selectedFacility.category}</span>
                <h2 className="text-6xl font-black text-[#262626] mb-8 leading-tight">{selectedFacility.name}</h2>
                <div className="flex items-center gap-8 mb-10">
                   <div className="flex items-center gap-2 text-sm font-bold text-gray-400"><MapPin size={22} className="text-yellow-500"/> {selectedFacility.location}</div>
                   <div className="flex items-center gap-2 text-sm font-bold text-gray-400"><Users size={22} className="text-yellow-500"/> {selectedFacility.capacity}</div>
                </div>
                <p className="text-gray-500 text-lg font-medium leading-relaxed mb-8">{selectedFacility.desc}</p>
                <div className="bg-gray-50 p-8 rounded-[2.5rem] mb-12 border border-gray-100">
                   <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest flex items-center gap-2"><Clock size={16} /> Facility Policy</p>
                   <p className="text-gray-600 font-medium leading-relaxed">{selectedFacility.details}</p>
                </div>
                <button 
                  onClick={handleBookNow}
                  className="w-full py-7 bg-[#262626] text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-yellow-500 hover:text-black transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  <Lock className="w-4 h-4" /> Book This Asset Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MEMBER 2 MODAL COMPONENT --- */}
        {showForm && (
          <BookingForm 
            facility={selectedFacility} 
            onClose={() => setShowForm(false)} 
          />
        )}

      </div>
    </div>
  );
};

export default FacilityShowcase;