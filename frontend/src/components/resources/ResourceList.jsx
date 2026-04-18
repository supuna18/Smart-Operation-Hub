import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiFilter, FiUsers, FiMapPin, FiCalendar, FiBox } from 'react-icons/fi';
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
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <ResourceCardSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource) => (
                            <div key={resource.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-yellow-400 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col">
                                {/* Top Color Bar */}
                                <div className={`h-1.5 w-full ${resource.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                                
                                {/* Image Section */}
                                <div className="h-44 w-full relative overflow-hidden bg-slate-100 group-hover:after:opacity-20 flex items-center justify-center">
                                    <img 
                                        src={resource.imageUrl || getTypeDefaultImage(resource.type)} 
                                        alt={resource.name} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            if (e.target.src !== getTypeDefaultImage(resource.type)) {
                                                e.target.src = getTypeDefaultImage(resource.type);
                                            } else {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                e.target.parentNode.innerHTML = '<div class="text-slate-300 flex flex-col items-center gap-2"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="40" width="40" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>';
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors pointer-events-none" />
                                </div>

                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-md mb-2">
                                                {resource.type}
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight pr-4">{resource.name}</h3>
                                        </div>
                                        {admin && (
                                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => onEdit(resource)}
                                                    className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                                    title="Edit Resource"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                                    title="Delete Resource"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <FiUsers className="text-slate-400" size={14} />
                                            <span><strong className="text-slate-900">{resource.capacity}</strong> Seats Capacity</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <FiMapPin className="text-slate-400" size={14} />
                                            <span className="truncate">{resource.location}</span>
                                        </div>
                                        {resource.availabilityWindows && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <FiCalendar className="text-slate-400" size={14} />
                                                <span className="truncate font-medium text-slate-500 italic">{resource.availabilityWindows}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-500">Current Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                        resource.status === 'ACTIVE' 
                                            ? 'bg-emerald-100 text-emerald-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${resource.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                                        {resource.status === 'ACTIVE' ? 'Available' : 'Maintenance'}
                                    </span>
                                </div>
                                
                                <div className="px-5 py-4 flex gap-2 border-t border-slate-50">
                                    <button 
                                        onClick={() => setCalendarResource(resource)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-lg transition-all font-bold text-xs"
                                    >
                                        <FiCalendar size={14} /> Schedule
                                    </button>
                                    {!admin && !getBookingForResource(resource.id) && (
                                        <button 
                                            onClick={() => handleBook(resource)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg transition-all font-bold text-xs shadow-sm"
                                            disabled={resource.status !== 'ACTIVE'}
                                        >
                                            Book Now
                                        </button>
                                    )}
                                </div>

                                {!admin && getBookingForResource(resource.id) && (
                                    <div className="px-5 pb-4">
                                        <div className={`w-full flex flex-col items-center justify-center py-2 rounded-lg border bg-opacity-5 font-bold ${
                                            getBookingForResource(resource.id).status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                            getBookingForResource(resource.id).status === 'REJECTED' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                                            'bg-yellow-50 border-yellow-200 text-yellow-700'
                                        }`}>
                                            <span className="text-[10px] uppercase tracking-widest opacity-60 mb-0.5">Your Booking Status</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${
                                                    getBookingForResource(resource.id).status === 'APPROVED' ? 'bg-emerald-500' :
                                                    getBookingForResource(resource.id).status === 'REJECTED' ? 'bg-rose-500' :
                                                    'bg-yellow-500 animate-pulse'
                                                }`} />
                                                <span className="text-sm">{getBookingForResource(resource.id).status}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

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
