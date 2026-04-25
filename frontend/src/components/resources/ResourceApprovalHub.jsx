import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Loader2, AlertCircle, 
    BookOpen, CheckCircle, XCircle, Clock,
    User, Calendar, MessageSquare
} from 'lucide-react';
import BookingService from '../../services/BookingService';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

const ResourceApprovalHub = () => {
    const { showToast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [rejectionModal, setRejectionModal] = useState({ 
        show: false, 
        booking: null, 
        reason: '' 
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await BookingService.getAllBookings();
            const data = Array.isArray(response.data) ? response.data : [];
            const sorted = [...data].sort((a, b) => new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0));
            setBookings(sorted);
            setError(null);
        } catch (err) {
            setError('Sync Error: Failed to fetch requests.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status, resourceName, reason = '') => {
        try {
            await BookingService.updateBookingStatus(id, status, reason);
            showToast(`${resourceName} is now ${status}!`, 'success');
            
            if (status === 'APPROVED') {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
            
            setRejectionModal({ show: false, booking: null, reason: '' });
            fetchBookings(); 
        } catch (err) {
            showToast('Action failed. Try again.', 'error');
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
            const searchLower = searchQuery.toLowerCase();
            return matchesStatus && (
                (b.resourceName || '').toLowerCase().includes(searchLower) ||
                (b.username || '').toLowerCase().includes(searchLower)
            );
        });
    }, [bookings, filterStatus, searchQuery]);

    const stats = useMemo(() => ({
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'PENDING').length,
        approved: bookings.filter(b => b.status === 'APPROVED').length,
        rejected: bookings.filter(b => b.status === 'REJECTED').length
    }), [bookings]);

    return (
        <div className="space-y-8 pb-20 relative animate-in fade-in duration-500">
            {/* Header Section - PDF Button Removed */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Booking <span className="text-yellow-500">Approvals</span>
                    </h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                        Manage student reservation queue
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Requests', value: stats.total, color: 'text-slate-900', bg: 'bg-white', icon: BookOpen },
                    { label: 'Pending', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50/40', icon: Clock },
                    { label: 'Approved', value: stats.approved, color: 'text-emerald-600', bg: 'bg-emerald-50/40', icon: CheckCircle },
                    { label: 'Rejected', value: stats.rejected, color: 'text-rose-600', bg: 'bg-rose-50/40', icon: XCircle }
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group`}>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                        <div className="p-3 bg-white rounded-2xl shadow-inner border border-slate-50 group-hover:scale-110 transition-transform">
                            <s.icon size={20} className={s.color} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-[#262626] text-[#FACC15] shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>{s}</button>
                    ))}
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text" placeholder="Search resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-yellow-400/5 transition-all outline-none" />
                </div>
            </div>

            {/* Main Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin mx-auto text-yellow-500 mb-2" /> <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refreshing Matrix...</p></div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <motion.div
                                key={booking.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded w-fit uppercase mb-2 border ${
                                            booking.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                            booking.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                            'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {booking.status}
                                        </span>
                                        <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none group-hover:text-yellow-600 transition-colors">{booking.resourceName}</h4>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 transition-all group-hover:bg-yellow-400 group-hover:text-black">
                                        <BookOpen size={22} />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 text-[11px] font-bold text-slate-500">
                                    <div className="flex items-center gap-3"><User size={14} className="text-yellow-500" /> Requested by <span className="text-slate-900">{booking.username}</span></div>
                                    <div className="flex items-center gap-3"><Calendar size={14} className="text-yellow-500" /> Period: <span className="text-slate-900">{booking.startDate} — {booking.endDate}</span></div>
                                    <div className="flex items-center gap-3"><Clock size={14} className="text-yellow-500" /> Time: <span className="text-slate-900">{booking.startTime} - {booking.endTime}</span></div>
                                    
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mt-2">
                                        <span className="text-[9px] font-black text-slate-300 uppercase block mb-1">Purpose</span>
                                        <p className="italic text-slate-700">"{booking.purpose || 'N/A'}"</p>
                                    </div>
                                </div>

                                {/* ACTION AREA: Banners show after action */}
                                {booking.status === 'PENDING' ? (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleUpdateStatus(booking.id, 'APPROVED', booking.resourceName)}
                                            className="flex-[2] py-4 bg-[#1e2330] text-yellow-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                                        > <CheckCircle size={14} /> APPROVE </button>
                                        <button 
                                            onClick={() => setRejectionModal({ show: true, booking, reason: '' })}
                                            className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                                        > REJECT </button>
                                    </div>
                                ) : booking.status === 'APPROVED' ? (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2">
                                        <CheckCircle size={20} className="text-emerald-600" />
                                        <span className="text-[14px] font-black text-emerald-600 uppercase tracking-[0.3em]">APPROVED</span>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                        <div className="py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center gap-2 text-rose-600">
                                            <XCircle size={20} />
                                            <span className="text-[14px] font-black uppercase tracking-[0.3em]">REJECTED</span>
                                        </div>
                                        {booking.rejectionReason && (
                                            <div className="px-4 py-3 bg-rose-50 rounded-xl border border-rose-100 text-[10px] text-rose-700 italic text-center">
                                                Reason: {booking.rejectionReason}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* REJECTION MODAL */}
            <AnimatePresence>
                {rejectionModal.show && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRejectionModal({ show: false, booking: null, reason: '' })} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative z-[10001] border border-slate-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm"><AlertCircle size={28}/></div>
                                <div><h3 className="text-2xl font-black text-slate-900 tracking-tight">Reject Request</h3><p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Provide justification</p></div>
                            </div>
                            <textarea value={rejectionModal.reason} onChange={(e) => setRejectionModal({...rejectionModal, reason: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-rose-500/5 transition-all text-sm font-medium min-h-[150px] resize-none" placeholder="Explain why you're rejecting this request..." />
                            <div className="flex gap-4 mt-10">
                                <button onClick={() => setRejectionModal({show: false, booking: null, reason: ''})} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-100 transition-all">CANCEL</button>
                                <button disabled={!rejectionModal.reason.trim()} onClick={() => handleUpdateStatus(rejectionModal.booking.id, 'REJECTED', rejectionModal.booking.resourceName, rejectionModal.reason)} className="flex-[2] py-4 bg-[#f17a91] hover:bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20 disabled:opacity-50 transition-all"> CONFIRM REJECT </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResourceApprovalHub;