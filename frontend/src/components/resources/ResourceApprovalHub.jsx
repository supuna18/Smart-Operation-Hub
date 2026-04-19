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

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await ResourceService.getAllBookings();
            // Sort by booking date (newest first)
            const sortedBookings = response.data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
            setBookings(sortedBookings);
            setError(null);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load booking requests.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status, resourceName) => {
        try {
            await ResourceService.updateBookingStatus(id, status);
            showToast(`Booking for ${resourceName} ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully!`, 'success');
            
            if (status === 'APPROVED') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FACC15', '#262626', '#ffffff']
                });
            }
            
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
                b.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Requests', value: stats.total, icon: BookOpen, color: 'text-slate-900', bg: 'bg-slate-100' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' }
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 mr-1">
                        <Filter size={16} />
                    </div>
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                                filterStatus === status 
                                    ? 'bg-[#262626] text-white shadow-lg shadow-black/20' 
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-yellow-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search by resource or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 shadow-inner-sm transition-all font-bold text-xs text-slate-700 placeholder-slate-400"
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
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-rose-50 rounded-[2rem] border border-rose-100 text-center px-6">
                            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
                            <h3 className="text-xl font-bold text-rose-900 mb-2">Sync Error</h3>
                            <p className="text-rose-700 text-sm font-medium mb-6">{error}</p>
                            <button onClick={fetchBookings} className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all">Retry Sync</button>
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
                                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-yellow-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col"
                            >
                                <div className={`h-1.5 w-full ${
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
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                                            <BookOpen size={20} />
                                        </div>
                                    </div>

                                    <div className="space-y-3 py-4 border-y border-slate-50">
                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                <User size={14} />
                                            </div>
                                            <span>
                                                Requested by <strong className="text-slate-900">{booking.username}</strong>
                                                <span className="block text-[10px] text-slate-400 font-bold tracking-tight">{booking.userId}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Calendar size={14} />
                                            </div>
                                            <span>
                                                Date: <strong className="text-slate-900">{new Date(booking.bookingDate).toLocaleDateString()}</strong>
                                                <span className="block text-[10px] text-slate-400 font-bold tracking-tight">Time: {new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {booking.status === 'PENDING' ? (
                                    <div className="p-4 bg-slate-50 flex gap-2">
                                        <button 
                                            onClick={() => handleUpdateStatus(booking.id, 'APPROVED', booking.resourceName)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#262626] hover:bg-black text-[#FACC15] py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-black/10 active:scale-95"
                                        >
                                            <CheckCircle size={14} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(booking.id, 'REJECTED', booking.resourceName)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-rose-600 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
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
        </div>
    );
};

export default ResourceApprovalHub;
