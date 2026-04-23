import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Filter, Search, Loader2, AlertCircle, 
    BookOpen, CheckCircle, XCircle, Clock,
    User, MapPin, Calendar, Info
} from 'lucide-react';
import ResourceService from '../../services/ResourceService';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

const ResourceApprovalHub = () => {
    const { showToast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [rejectionModal, setRejectionModal] = useState({ show: false, booking: null, reason: '' });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await ResourceService.getAllBookings();
            console.log('ResourceApprovalHub: Fetched bookings:', response.data);
            
            // Ensure response.data is an array
            const data = Array.isArray(response.data) ? response.data : [];
            
            // Sort by booking date (newest first) - with null safety
            const sortedBookings = [...data].sort((a, b) => {
                const dateA = a.bookingDate ? new Date(a.bookingDate) : new Date(0);
                const dateB = b.bookingDate ? new Date(b.bookingDate) : new Date(0);
                return dateB - dateA;
            });
            setBookings(sortedBookings);
            setError(null);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            if (err.response?.status === 403) {
                setError('ACCESS_DENIED');
            } else {
                setError('Failed to load booking requests.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status, resourceName, reason = '') => {
        try {
            await ResourceService.updateBookingStatus(id, status, reason);
            showToast(`Booking for ${resourceName} ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully!`, 'success');
            
            if (status === 'APPROVED') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FACC15', '#262626', '#ffffff']
                });
            }
            
            setRejectionModal({ show: false, booking: null, reason: '' });
            fetchBookings(); // Refresh the list
        } catch (err) {
            console.error('Error updating status:', err);
            showToast('Failed to update booking status.', 'error');
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
             const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
             const matchesSearch = 
                (b.resourceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (b.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (b.userId && b.userId.toLowerCase().includes(searchQuery.toLowerCase()));
             return matchesStatus && matchesSearch;
        });
    }, [bookings, filterStatus, searchQuery]);

    const stats = useMemo(() => {
        return {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'PENDING').length,
            approved: bookings.filter(b => b.status === 'APPROVED').length,
            rejected: bookings.filter(b => b.status === 'REJECTED').length
        };
    }, [bookings]);

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Requests', value: stats.total, icon: BookOpen, color: 'text-slate-900', bg: 'bg-slate-50', border: 'border-slate-100' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' }
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className={`p-6 rounded-3xl border ${stat.bg} ${stat.border} shadow-sm transition-all duration-300 group hover:shadow-md`}
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-2xl bg-white shadow-sm ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Metric</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 opacity-70">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-[#262626] p-6 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide relative z-10">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-yellow-500/70 mr-2 shadow-inner">
                        <Filter size={18} />
                    </div>
                    <div className="flex p-1 bg-black/20 rounded-2xl border border-white/10 shadow-inner backdrop-blur-sm">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`relative px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap z-10 ${
                                    filterStatus === status 
                                        ? 'text-[#262626]' 
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {filterStatus === status && (
                                    <motion.div
                                        layoutId="statusPill"
                                        className="absolute inset-0 bg-yellow-400 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)] -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-yellow-400 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search by resource or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-black/20 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all font-bold text-xs text-white placeholder-slate-500 shadow-inner backdrop-blur-sm"
                    />
                </div>
            </div>

            {/* Bookings List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-slate-50">
                            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Updating Feed...</p>
                        </div>
                    ) : error ? (
                        <div className={`col-span-full py-20 flex flex-col items-center justify-center rounded-[2rem] border text-center px-6 ${
                            error === 'ACCESS_DENIED' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'
                        }`}>
                            <AlertCircle className={`w-12 h-12 mb-4 ${
                                error === 'ACCESS_DENIED' ? 'text-amber-500' : 'text-rose-500'
                            }`} />
                            <h3 className={`text-xl font-bold mb-2 ${
                                error === 'ACCESS_DENIED' ? 'text-amber-900' : 'text-rose-900'
                            }`}>
                                {error === 'ACCESS_DENIED' ? 'Access Denied' : 'Sync Error'}
                            </h3>
                            <p className={`${
                                error === 'ACCESS_DENIED' ? 'text-amber-700' : 'text-rose-700'
                            } text-sm font-medium mb-6`}>
                                {error === 'ACCESS_DENIED' 
                                    ? 'You do not have the necessary permissions to manage booking requests. Please contact your administrator if you believe this is an error.' 
                                    : error}
                            </p>
                            {error !== 'ACCESS_DENIED' && (
                                <button onClick={fetchBookings} className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all">Retry Sync</button>
                            )}
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Info className="w-8 h-8 text-slate-200" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Queue Clear</h3>
                            <p className="text-slate-400 text-sm">No booking requests match your current criteria.</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking, idx) => (
                            <motion.div
                                key={booking.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] flex flex-col relative"
                            >
                                <div className={`h-2 w-full ${
                                    booking.status === 'APPROVED' ? 'bg-emerald-500' :
                                    booking.status === 'REJECTED' ? 'bg-rose-500' : 'bg-yellow-400'
                                }`} />
                                
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-md">
                                                    RESOURCE
                                                </span>
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                    booking.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                                                    booking.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                                                    'bg-yellow-50 text-yellow-700'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-black text-slate-900 truncate pr-4">{booking.resourceName}</h3>
                                        </div>
                                        <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-yellow-400 group-hover:text-[#262626] transition-all duration-300 shadow-sm">
                                            <BookOpen size={20} />
                                        </div>
                                    </div>

                                    <div className="space-y-3 py-4 border-y border-slate-50">
                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                                                <User size={14} />
                                            </div>
                                            <span>
                                                Requested by <strong className="text-slate-900">{booking.username}</strong>
                                                <span className="block text-[10px] text-slate-400 font-bold tracking-tight">{booking.userId}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                                                <Calendar size={14} />
                                            </div>
                                            <span>
                                                Date: <strong className="text-slate-900">{new Date(booking.bookingDate).toLocaleDateString()}</strong>
                                                <span className="block text-[10px] text-slate-400 font-bold tracking-tight">Time: {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                                                <Info size={14} />
                                            </div>
                                            <span>
                                                Purpose: <strong className="text-slate-900">{booking.purpose || 'Not specified'}</strong>
                                                <span className="block text-[10px] text-slate-400 font-bold tracking-tight">Attendees: {booking.expectedAttendees || 'N/A'}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {booking.status === 'PENDING' ? (
                                    <div className="p-4 bg-slate-50 flex gap-2">
                                        <button 
                                            onClick={() => handleUpdateStatus(booking.id, 'APPROVED', booking.resourceName)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#262626] hover:bg-black text-[#FACC15] py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/20 active:scale-95 border border-white/5"
                                        >
                                            <CheckCircle size={14} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => setRejectionModal({ show: true, booking, reason: '' })}
                                            className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-rose-600 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
                                        >
                                            <XCircle size={14} /> Reject
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-50 flex items-center justify-center">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            Processed on {new Date().toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Rejection Modal */}
            <AnimatePresence>
                {rejectionModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl"
                        >
                            <h3 className="text-xl font-black text-slate-900 mb-2">Reject Request</h3>
                            <p className="text-sm text-slate-500 mb-6 font-medium">Please provide a reason for rejecting the booking for <strong>{rejectionModal.booking?.resourceName}</strong>.</p>
                            
                            <textarea 
                                value={rejectionModal.reason}
                                onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="Write the reason here..."
                                rows="4"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 transition-all font-bold text-sm text-slate-700 placeholder-slate-400 mb-6"
                            />

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setRejectionModal({ show: false, booking: null, reason: '' })}
                                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(rejectionModal.booking.id, 'REJECTED', rejectionModal.booking.resourceName, rejectionModal.reason)}
                                    disabled={!rejectionModal.reason.trim()}
                                    className="flex-[2] py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResourceApprovalHub;
