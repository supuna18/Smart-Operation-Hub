import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import {
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiPlus,
    FiFilter,
    FiUsers,
    FiMapPin,
    FiCalendar,
    FiBox,
    FiClock
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { isAdmin, getUser } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { ResourceCardSkeleton } from '../common/Skeleton';
import ResourceCalendarModal from './ResourceCalendarModal';
import BookingForm from './BookingForm';

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
    const navigate = useNavigate();

    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterMinCapacity, setFilterMinCapacity] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [userBookings, setUserBookings] = useState([]);
    const [calendarResource, setCalendarResource] = useState(null);
    const [bookingResource, setBookingResource] = useState(null);

    const admin = isAdmin();
    const user = React.useMemo(() => getUser(), []);

    useEffect(() => {
        fetchResources();

        if (!admin && user) {
            fetchUserBookings();
        }
    }, [
        search,
        filterType,
        filterStatus,
        filterMinCapacity,
        filterLocation,
        admin
    ]);

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
            try {
                const response = await ResourceService.getAllResources();
                setResources(response.data);
            } catch (fallbackError) {
                console.error('Error fetching resources:', fallbackError);
                showToast('Failed to load resources.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBook = (resource) => {
        setBookingResource(resource);
    };

    const getBookingForResource = (resourceId) => {
        return userBookings.find((b) => b.resourceId === resourceId);
    };

    const getTypeDefaultImage = (type) => {
        const defaults = {
            'Lecture Hall': lectureHallImg,
            'Lab': labImg,
            'Laboratory': labImg,
            'Auditorium': lectureHallImg,
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
                showToast('Failed to delete resource.', 'error');
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 bg-[#262626] border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, #FACC15 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-yellow-400 rounded-full" />
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            Assets & <span className="text-yellow-400">Facilities</span>
                        </h2>
                    </div>

                    <p className="text-sm text-slate-400 font-medium">
                        Manage campus resources from a single, high-performance interface.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 relative z-10 w-full md:w-auto">
                    {!admin && (
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                            <FiBox size={18} />
                            My Reservation Details
                        </button>
                    )}

                    {admin && (
                        <button
                            onClick={onAdd}
                            className="flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-yellow-400 text-slate-900 px-7 py-3 rounded-xl transition-all font-bold active:scale-95 shadow-lg"
                        >
                            <FiPlus size={18} className="stroke-[3px]" />
                            New Resource
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
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
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                    </div>

                    <div className="relative">
                        <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="number"
                            placeholder="Min Capacity"
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                            value={filterMinCapacity}
                            onChange={(e) => setFilterMinCapacity(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Location"
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                            value={filterLocation}
                            onChange={(e) => setFilterLocation(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <ResourceCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource) => (
                            <div
                                key={resource.id}
                                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-yellow-400 transition-all flex flex-col shadow-sm"
                            >
                                <div
                                    className={`h-1.5 w-full ${
                                        resource.status === 'ACTIVE'
                                            ? 'bg-emerald-500'
                                            : 'bg-yellow-500'
                                    }`}
                                />

                                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                                    <img
                                        src={
                                            resource.imageUrl ||
                                            getTypeDefaultImage(resource.type)
                                        }
                                        alt={resource.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                <div className="p-5 flex-1">
                                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase rounded-md mb-2">
                                        {resource.type}
                                    </span>

                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                        {resource.name}
                                    </h3>

                                    <div className="space-y-2 mt-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <FiUsers size={14} />
                                            <span>{resource.capacity} Seats</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <FiMapPin size={14} />
                                            <span>{resource.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-5 py-4 flex gap-2 border-t border-slate-50">
                                    <button
                                        onClick={() => setCalendarResource(resource)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-lg font-bold text-xs"
                                    >
                                        <FiCalendar size={14} />
                                        Schedule
                                    </button>

                                    {!admin && (
                                        <button
                                            onClick={() => handleBook(resource)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg font-bold text-xs shadow-sm"
                                            disabled={resource.status !== 'ACTIVE'}
                                        >
                                            <FiClock size={14} />
                                            Book Now
                                        </button>
                                    )}
                                </div>

                                {!admin && getBookingForResource(resource.id) && (
                                    <div className="px-5 pb-4">
                                        <div
                                            className={`w-full flex flex-col items-center justify-center py-2 rounded-lg border bg-opacity-5 font-bold ${
                                                getBookingForResource(resource.id).status ===
                                                'APPROVED'
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                    : getBookingForResource(resource.id).status ===
                                                      'REJECTED'
                                                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                                                    : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                            }`}
                                        >
                                            <span className="text-[10px] uppercase opacity-60">
                                                Latest status
                                            </span>
                                            <span className="text-sm">
                                                {getBookingForResource(resource.id).status}
                                            </span>
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

                {bookingResource && (
                    <BookingForm
                        facility={bookingResource}
                        onClose={() => {
                            setBookingResource(null);
                            fetchUserBookings();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ResourceList;