import React, { useState } from 'react';
import BookingForm from './BookingForm';
import { useNavigate } from 'react-router-dom';
// Leader-oda auth logic-ah direct-ah import pandrom (Idhu dhaan mukkiyam)
import { isLoggedIn } from '../utils/auth'; 

const FacilityShowcase = () => {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState('gallery');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Prop-ah nambaama, direct-ah auth check pandrom
  const authenticated = isLoggedIn();

  const facilities = [
    { 
      id: "1",
      title: "Central Library", 
      type: "Academic Hub", 
      cap: "500+ Students", 
      img: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=800",
      location: "East Wing, Level 3",
      desc: "Our Central Library provides a serene environment for study and research. Features 24/7 access and a vast digital archive.",
      amenities: ["Silent Zones", "Digital Archive", "Coffee Bar", "Private Cabins"]
    },
    { 
      id: "2",
      title: "Olympic Swimming Pool", 
      type: "Sports Facility", 
      cap: "Pro Grade", 
      img: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800",
      location: "Aquatic Center",
      desc: "A temperature-controlled Olympic-sized pool designed for professional training.",
      amenities: ["10 Lanes", "Shower Rooms", "Spectator Gallery", "Sauna"]
    },
    { 
      id: "3",
      title: "AI Research Lab", 
      type: "Research Complex", 
      cap: "40 Units", 
      img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800",
      location: "Tower A",
      desc: "Equipped with RTX GPUs for AI and Robotics research.",
      amenities: ["GPU Stations", "VR Setup", "Cloud Sync", "3D Printing"]
    }
  ];

  const handleCardClick = (f) => {
    if (authenticated) {
      setSelectedFacility(f);
      setViewState('details'); // Ippo click panna kandippa details page-ku kootitu pogum
      window.scrollTo(0, 0);
    } else {
      navigate('/login');
    }
  };

  if (viewState === 'gallery') {
    return (
      <section className="py-20 px-6 md:px-16 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl font-black text-[#262626]">Campus <span className="text-yellow-500">Facilities</span></h1>
            <p className="text-gray-400 mt-4 font-medium italic">"Experience world-class infrastructure designed for your growth."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {facilities.map((f, i) => (
              <div 
                key={i} 
                onClick={() => handleCardClick(f)}
                className={`group relative h-[420px] rounded-[3rem] overflow-hidden shadow-2xl bg-[#262626] transition-all duration-500 ${authenticated ? 'cursor-pointer hover:-translate-y-3' : 'cursor-not-allowed'}`}
              >
                {/* User login panna udane image bright aagi 'Private Asset' poyidum */}
                <img src={f.img} alt={f.title} className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${authenticated ? 'opacity-90' : 'opacity-30 grayscale'}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-10 left-10">
                  <span className="bg-yellow-500 text-black text-[9px] font-black px-3 py-1 rounded uppercase mb-2 inline-block tracking-widest">{f.type}</span>
                  <h3 className="text-3xl font-black text-white">{f.title}</h3>
                </div>

                {/* LOCK OVERLAY - Inga dhaan fix irukku */}
                {!authenticated && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest text-black shadow-xl">Login to Access</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Details Page View (Ulla ponathuku appuram katanum)
  if (viewState === 'details' && selectedFacility) {
    return (
      <section className="py-24 px-6 md:px-16 bg-white animate-in slide-in-from-right-10 duration-500">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => setViewState('gallery')} className="flex items-center gap-3 text-gray-400 font-bold mb-12 hover:text-black transition-all group">
             <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-all">←</div>
             Back to Catalogue
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="h-[550px] rounded-[4rem] overflow-hidden shadow-2xl">
              <img src={selectedFacility.img} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <span className="text-yellow-500 font-black text-sm uppercase tracking-widest mb-4 inline-block">{selectedFacility.type}</span>
              <h1 className="text-6xl font-black text-[#262626] mb-8 leading-tight">{selectedFacility.title}</h1>
              <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">{selectedFacility.desc}</p>
              
              <button 
                onClick={() => setShowForm(true)}
                className="w-full py-6 bg-[#262626] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-yellow-500 hover:text-black transition-all shadow-2xl"
              >
                Book This Facility
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <BookingForm facility={selectedFacility} onClose={() => setShowForm(false)} />
        )}
      </section>
    );
  }
};

export default FacilityShowcase;