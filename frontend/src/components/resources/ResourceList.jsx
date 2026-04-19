import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiFilter, FiUsers, FiMapPin, FiCalendar, FiBox, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { isAdmin, getUser } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { ResourceCardSkeleton } from '../common/Skeleton';
import confetti from 'canvas-confetti';
import ResourceCalendarModal from './ResourceCalendarModal';

// Categories and local asset defaults
import lectureHallImg from '../../assets/reso1.jpeg';
import labImg from '../../assets/labR.jpeg';
import equipmentImg from '../../assets/equipmentR.jpeg';
import studyAreaImg from '../../assets/studyareaR.jpeg';
import loungeImg from '../../assets/loungeR.jpeg';
import sportsImg from '../../assets/sportfacilityR.jpeg';
import otherImg from '../../assets/otherR.jpeg';

const ResourceList = ({ onEdit, onAdd }) => {
    const { showToast } = useToast();
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterMinCapacity, setFilterMinCapacity] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [userBookings, setUserBookings] = useState([]);
    const [calendarResource, setCalendarResource] = useState(null);
    const admin = isAdmin();
    const user = React.useMemo(() => getUser(), []);

    useEffect(() => {
        fetchResources();
        if (!admin && user) {
            fetchUserBookings();
        }
    }, [search, filterType, filterStatus, filterMinCapacity, filterLocation, admin]);

    const fetchUserBookings = async () => {
        try {
            const userId = user.id || user.email;
            if (userId) {
                const response = await ResourceService.getMyBookings(userId);
                setUserBookings(response.data);
            }
        } catch (error) {
            console.error('Error fetching user bookings:', error);
        }
    };

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.name = search;
            if (filterType) params.type = filterType;
            if (filterStatus) params.status = filterStatus;
            if (filterMinCapacity) params.minCapacity = filterMinCapacity;
            if (filterLocation) params.location = filterLocation;

            const response = await ResourceService.searchResources(params);
            setResources(response.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
            // Fallback to all resou.rces if search fails or initially
            const response = await ResourceService.getAllResources();
            setResources(response.data);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (resource) => {
        try {
            const bookingData = {
                resourceId: resource.id,
                resourceName: resource.name,
                userId: user.id || user.email, // Using email as ID if ID is missing
                username: user.username,
            };
            await ResourceService.createBooking(bookingData);
            showToast(`Booking request for ${resource.name} submitted successfully!`, 'success');
            
            // Trigger celebration
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FACC15', '#262626', '#ffffff']
            });

            fetchUserBookings(); // Refresh bookings after submission
        } catch (error) {
            console.error('Error booking resource:', error);
            showToast('Failed to submit booking request.', 'error');
        }
    };

    const getBookingForResource = (resourceId) => {
        return userBookings.find(b => b.resourceId === resourceId);
    };

    const getTypeDefaultImage = (type) => {
        const defaults = {
            'Lecture Hall': lectureHallImg,
            'Lab': labImg,
            'Laboratory': labImg,
            'Auditorium': lectureHallImg, // Fallback to lecture hall if no auditorium img
            'Equipment': equipmentImg,
            'Study Area': studyAreaImg,
            'Lounge': loungeImg,
            'Sports Facility': sportsImg,
            'Other': otherImg
        };
        return defaults[type] || otherImg;
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this resource?')) {
            try {
                await ResourceService.deleteResource(id);
                showToast('Resource removed successfully!', 'success');
                fetchResources();
            } catch (error) {
                console.error('Error deleting resource:', error);
                showToast('Failed to delete resource.', 'error');
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 bg-[#262626] border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FACC15 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-yellow-400 rounded-full" />
                        <h2 className="text-2xl font-black text-white tracking-tight">Assets & <span className="text-yellow-400">Facilities</span></h2>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">Manage and optimize campus resources from a single, high-performance interface.</p>
                </div>
                {admin && (
                    <button 
                        onClick={onAdd}
                        className="relative z-10 w-full md:w-auto flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-yellow-400 text-slate-900 px-7 py-3 rounded-xl transition-all font-bold shadow-[0_4px_20px_-5px_rgba(250,204,21,0.5)] active:scale-95"
                    >
                        <FiPlus size={18} className="stroke-[3px]" /> New Resource
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search resources by name..." 
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select 
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 appearance-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none cursor-pointer text-sm font-medium"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Lecture Hall">Lecture Hall</option>
                            <option value="Lab">Lab</option>
                            <option value="Auditorium">Auditorium</option>
                            <option value="Equipment">Equipment</option>
                        </select>
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select 
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 appearance-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none cursor-pointer text-sm font-medium"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active & Available</option>
                            <option value="OUT_OF_SERVICE">Under Maintenance</option>
                        </select>
                    </div>
                    <div className="relative">
                        <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="number" 
                            placeholder="Min Capacity..." 
                            min="0"
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none text-sm"
                            value={filterMinCapacity}
                            onChange={(e) => setFilterMinCapacity(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Location..." 
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none text-sm"
                            value={filterLocation}
                            onChange={(e) => setFilterLocation(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="p-6 md:p-8">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => <ResourceCardSkeleton key={i} />)}
                        </div>
                    ) : (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {resources.map((resource, idx) => (
                                <motion.div 
                                    key={resource.id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    whileHover={{ y: -8 }}
                                    className="group bg-white border border-slate-100 rounded-3xl overflow-hidden transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] flex flex-col relative"
                                >
                                    {/* Action Toolstrip (Floating) */}
                                    {admin && (
                                        <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <button 
                                                onClick={() => onEdit(resource)}
                                                className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-yellow-600 transition-colors"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(resource.id)}
                                                className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-rose-600 transition-colors"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Status Badge (Corner) */}
                                    <div className="absolute top-4 left-4 z-30">
                                        <div className={`px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-sm font-black text-[9px] uppercase tracking-widest flex items-center gap-2 ${
                                            resource.status === 'ACTIVE' 
                                                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-700' 
                                                : 'bg-amber-50/90 border-amber-200 text-amber-700'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${resource.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                            {resource.status === 'ACTIVE' ? 'Available' : 'Maintenance'}
                                        </div>
                                    </div>

                                    {/* Image Section */}
                                    <div className="h-56 w-full relative overflow-hidden bg-slate-50">
                                        <img 
                                            src={resource.imageUrl || getTypeDefaultImage(resource.type)} 
                                            alt={resource.name} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    <div className="p-7 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{resource.type}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-[#262626] transition-colors">{resource.name}</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 my-4 py-4 border-y border-slate-50">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Capacity</p>
                                                <div className="flex items-center gap-2 text-slate-700 font-bold">
                                                    <FiUsers className="text-yellow-500" size={14} />
                                                    <span className="text-sm">{resource.capacity} Seats</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Location</p>
                                                <div className="flex items-center gap-2 text-slate-700 font-bold">
                                                    <FiMapPin className="text-yellow-500" size={14} />
                                                    <span className="text-sm truncate">{resource.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 flex gap-3">
                                            <button 
                                                onClick={() => setCalendarResource(resource)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-[#262626] hover:text-white text-slate-600 py-3.5 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest"
                                            >
                                                <FiCalendar size={14} /> Schedule
                                            </button>
                                            {!admin && !getBookingForResource(resource.id) && (
                                                <button 
                                                    onClick={() => handleBook(resource)}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest shadow-lg ${
                                                        resource.status === 'ACTIVE'
                                                            ? 'bg-[#FACC15] text-slate-900 shadow-yellow-500/10 hover:shadow-yellow-500/20'
                                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                                    }`}
                                                    disabled={resource.status !== 'ACTIVE'}
                                                >
                                                    <FiClock size={14} /> Request Access
                                                </button>
                                            )}
                                        </div>

                                        {!admin && getBookingForResource(resource.id) && (
                                            <div className="mt-4">
                                                <div className={`w-full flex flex-col items-center justify-center py-3 rounded-2xl border font-bold ${
                                                    getBookingForResource(resource.id).status === 'APPROVED' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                                    getBookingForResource(resource.id).status === 'REJECTED' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                                                    'bg-yellow-50 border-yellow-100 text-yellow-700 shadow-inner'
                                                }`}>
                                                    <p className="text-[9px] uppercase tracking-[0.2em] opacity-60 mb-1">Live Status</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            getBookingForResource(resource.id).status === 'APPROVED' ? 'bg-emerald-500' :
                                                            getBookingForResource(resource.id).status === 'REJECTED' ? 'bg-rose-500' :
                                                            'bg-yellow-500 animate-pulse'
                                                        }`} />
                                                        <span className="text-xs uppercase tracking-widest">{getBookingForResource(resource.id).status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {calendarResource && (
                    <ResourceCalendarModal 
                        resource={calendarResource} 
                        onClose={() => setCalendarResource(null)} 
                    />
                )}

                {!loading && resources.length === 0 && (
                    <div className="text-center py-24 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                        <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <FiSearch className="text-slate-400" size={20} />
                        </div>
                        <p className="text-slate-900 font-bold text-lg mb-1">No assets found</p>
                        <p className="text-slate-500 text-sm">We couldn't find any resources matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceList;
