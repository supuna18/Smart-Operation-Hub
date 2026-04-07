import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import { getUser, isAdmin } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAdmin()) {
            navigate('/AdminDashboard');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const response = await ResourceService.getMyBookings(user.id || user.email);
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyBookings();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-50 font-poppins py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Bookings</h1>
                    <p className="text-slate-500 font-medium">Track the status of your campus resource requests.</p>
                </div>

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
                                            <span>Requested on {new Date(booking.bookingDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <FiClock className="text-slate-400" />
                                            <span>At {new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">current status</span>
                                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${
                                            booking.status === 'APPROVED' 
                                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                                                : booking.status === 'REJECTED'
                                                ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
                                                : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                        }`}>
                                            {booking.status === 'APPROVED' ? <FiCheckCircle /> : booking.status === 'REJECTED' ? <FiXCircle /> : <FiClock />}
                                            {booking.status}
                                        </span>
                                    </div>
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
