import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiFilter, FiUsers, FiMapPin, FiCalendar } from 'react-icons/fi';
import { isAdmin, getUser } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { ResourceCardSkeleton } from '../common/Skeleton';
import ResourceBookingModal from './ResourceBookingModal'; 

// Categories defaults
import lectureHallImg from '../../assets/reso1.jpeg';
import labImg from '../../assets/labR.jpeg';
import equipmentImg from '../../assets/equipmentR.jpeg';
import studyAreaImg from '../../assets/studyareaR.jpeg';
import loungeImg from '../../assets/loungeR.jpeg';
import sportsImg from '../../assets/sportfacilityR.jpeg';
import otherImg from '../../assets/otherR.jpeg';

const ResourceList = ({ onEdit, onAdd }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userBookings, setUserBookings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    
    const admin = isAdmin();
    const user = React.useMemo(() => getUser(), []);

    useEffect(() => {
        fetchResources();
        if (!admin && user) { fetchUserBookings(); }
    }, [admin]);

    const fetchUserBookings = async () => {
        try {
            const userId = user.id || user.email;
            if (userId) {
                const response = await ResourceService.getMyBookings(userId);
                setUserBookings(response.data);
            }
        } catch (error) { console.error(error); }
    };

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await ResourceService.getAllResources();
            setResources(response.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    // --- TRIGGER YOUR BOOKING MODAL ---
    const handleBook = (resource) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    const getBookingForResource = (resourceId) => {
        return userBookings.find(b => b.resourceId === resourceId);
    };

    const getTypeDefaultImage = (type) => {
        const defaults = {
            'Lecture Hall': lectureHallImg, 'Lab': labImg, 'Laboratory': labImg,
            'Equipment': equipmentImg, 'Study Area': studyAreaImg, 'Other': otherImg
        };
        return defaults[type] || otherImg;
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
            {/* Header Section - Cleaned Up */}
            <div className="p-8 bg-[#262626] border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #FACC15 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-white tracking-tight">Facility <span className="text-yellow-400">Registry</span></h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time asset management console</p>
                </div>
                {/* 'My Bookings' button removed from here as requested */}
            </div>

            {/* Resources Grid */}
            <div className="p-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <ResourceCardSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resources.map((resource) => {
                            const booking = getBookingForResource(resource.id);
                            return (
                                <div key={resource.id} className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col relative">
                                    {/* Image */}
                                    <div className="h-48 w-full relative overflow-hidden">
                                        <img src={resource.imageUrl || getTypeDefaultImage(resource.type)} alt={resource.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] font-black text-yellow-400 uppercase tracking-widest">
                                            {resource.type}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-6 flex-1">
                                        <h3 className="text-xl font-black text-slate-900 mb-4">{resource.name}</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                                                <FiUsers className="text-yellow-500" size={14} />
                                                <span className="text-[10px] font-bold text-slate-600">{resource.capacity} Seats</span>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                                                <FiMapPin className="text-yellow-500" size={14} />
                                                <span className="text-[10px] font-bold text-slate-600 truncate">{resource.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Button */}
                                    <div className="px-6 pb-6 pt-2 border-t border-slate-50 mt-auto">
                                        {!admin && (
                                            <button 
                                                onClick={() => handleBook(resource)}
                                                className="w-full flex items-center justify-center gap-2 bg-[#262626] hover:bg-black text-[#FACC15] py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 disabled:grayscale"
                                                disabled={resource.status !== 'ACTIVE'}
                                            >
                                                <FiCalendar size={14} />
                                                Book Now
                                            </button>
                                        )}

                                        {/* Status Badge Overlay */}
                                        {booking && (
                                            <div className={`mt-4 w-full py-2 rounded-xl text-center text-[9px] font-black uppercase tracking-widest border ${
                                                booking.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                booking.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                            }`}>
                                                LIVE STATUS: {booking.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* MODAL INTEGRATION */}
                {isModalOpen && (
                    <ResourceBookingModal 
                        resource={selectedResource} 
                        user={user} 
                        onClose={() => setIsModalOpen(false)} 
                        onSuccess={fetchUserBookings} 
                    />
                )}
            </div>
        </div>
    );
};

export default ResourceList;