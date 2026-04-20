import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import { getUser, isAdmin } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

const MyBookings = ({ isEmbedded = false }) => {
    const { showToast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const user = getUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isEmbedded && isAdmin()) {
            navigate('/AdminDashboard');
        }
    }, [navigate, isEmbedded]);

    const fetchMyBookings = async () => {
        if (!user || (!user.id && !user.email)) {
            setLoading(false);
            console.warn('Cannot fetch bookings: No user ID or email found');
            return;
        }

        setLoading(true);
        try {
            const response = await ResourceService.getMyBookings(user.id || user.email);
            setBookings(response.data);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Error fetching bookings:', error);
            showToast('Unable to load your bookings. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyBookings();
        }
    }, [user?.id, user?.email]);

    const handleCancel = async (id, name) => {
        if (window.confirm(`Are you sure you want to cancel your booking for ${name}?`)) {
            try {
                await ResourceService.updateBookingStatus(id, 'CANCELLED');
                showToast('Booking cancelled successfully', 'success');
                fetchMyBookings();
            } catch (error) {
                console.error('Error cancelling booking:', error);
                showToast('Failed to cancel booking', 'error');
            }
        }
    };

    return (
        <div className={isEmbedded ? "w-full space-y-8 animate-in fade-in duration-500" : "min-h-screen bg-slate-50 font-poppins py-12"}>
            <div className={isEmbedded ? "" : "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"}>
                {!isEmbedded && (
                    <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Bookings</h1>
                            <p className="text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Track the status of your campus resource requests.</p>
                            {lastUpdated && (
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2">
                                    Last synced: {lastUpdated}
                                </p>
                            )}
                        </div>
                        <button 
                            onClick={fetchMyBookings}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm disabled:opacity-50"
                        >
                            <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh List
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-yellow-500 animate-spin" />
                        <p className="text-slate-500 font-medium text-sm">Loading your bookings...</p>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center p-6 gap-6 hover:border-yellow-400 transition-all duration-200">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center shadow-sm">
                                            <FiInfo size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{booking.resourceName}</h3>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Resource Request</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <FiCalendar className="text-slate-400" />
                                            <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <FiClock className="text-slate-400" />
                                            <span>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    {booking.status === 'REJECTED' && booking.rejectionReason && (
                                        <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-700 italic flex gap-2 items-start">
                                            <FiXCircle className="mt-0.5 flex-shrink-0" />
                                            <p><strong>Reason:</strong> {booking.rejectionReason}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">current status</span>
                                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${
                                            booking.status === 'APPROVED' 
                                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                                                : booking.status === 'REJECTED'
                                                ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
                                                : booking.status === 'CANCELLED'
                                                ? 'bg-slate-50 text-slate-500 ring-slate-600/20'
                                                : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                        }`}>
                                            {booking.status === 'APPROVED' ? <FiCheckCircle /> : booking.status === 'REJECTED' || booking.status === 'CANCELLED' ? <FiXCircle /> : <FiClock />}
                                            {booking.status}
                                        </span>
                                    </div>

                                    {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                        <button 
                                            onClick={() => handleCancel(booking.id, booking.resourceName)}
                                            className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors"
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 rounded-3xl border-2 border-dashed border-slate-200 bg-white">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                            <FiCalendar className="text-slate-300" size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No bookings yet</h2>
                        <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">You haven't requested any campus resources yet.</p>
                        <button 
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                            onClick={() => window.location.href = '/resources'}
                        >
                            Browse Resources
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
