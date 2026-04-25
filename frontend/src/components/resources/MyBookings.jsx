import React, { useState, useEffect } from 'react';
import BookingService from '../../services/BookingService'; 
import { getUser, isAdmin } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiInfo, FiTrash2, FiEdit2 } from 'react-icons/fi';
import ResourceBookingModal from './ResourceBookingModal';

const MyBookings = ({ isEmbedded = false }) => {
    const { showToast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState({ show: false, booking: null });
    const user = getUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isEmbedded && isAdmin()) { navigate('/AdminDashboard'); }
        fetchMyBookings();
    }, [user?.id]);

    const fetchMyBookings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await BookingService.getMyBookings(user.id || user.email);
            // Sort newest first to see latest edits on top
            const sorted = response.data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
            setBookings(sorted);
        } catch (error) {
            showToast('Unable to load history.', 'error');
        } finally { setLoading(false); }
    };

    const handleCancelAndDelete = async (id) => {
        if (window.confirm("Do you want to permanently remove this record from history?")) {
            try {
                await BookingService.deleteBooking(id); 
                showToast("Record deleted successfully!", "success");
                fetchMyBookings();
            } catch (error) {
                showToast("Delete failed. Check permissions.", "error");
            }
        }
    };

    return (
        <div className={isEmbedded ? "w-full space-y-8" : "min-h-screen bg-slate-50 py-12"}>
            <div className={isEmbedded ? "" : "max-w-5xl mx-auto px-4"}>
                <h1 className="text-3xl font-black mb-10">My Reservation <span className="text-yellow-500">Details</span></h1>

                {loading ? (
                    <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px]">Updating Feed...</div>
                ) : bookings.length > 0 ? (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="group bg-white rounded-3xl border border-slate-200 shadow-sm p-7 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-xl transition-all duration-500">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-yellow-400 flex items-center justify-center shadow-lg"><FiInfo size={22} /></div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">{booking.resourceName}</h3>
                                            <p className="text-[10px] text-slate-400 font-bold">Ref ID: {booking.id.slice(-6)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-x-8 text-xs font-bold text-slate-600">
                                        <span className="flex items-center gap-1"><FiCalendar className="text-yellow-500" /> {booking.startDate} - {booking.endDate}</span>
                                        <span className="flex items-center gap-1"><FiClock className="text-yellow-500" /> {booking.startTime} - {booking.endTime}</span>
                                    </div>
                                    {booking.purpose && (
                                        <p className="text-[11px] text-slate-400 mt-2 italic leading-relaxed">"{booking.purpose}"</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase ${
                                        booking.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                                        booking.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                        'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                    }`}>{booking.status}</span>
                                    
                                    <div className="flex gap-2">
                                        {/* MODULE B EDIT BUTTON: Passes the whole 'booking' object to existingData */}
                                        {booking.status === 'PENDING' && (
                                            <button 
                                                onClick={() => setEditModal({ show: true, booking })} 
                                                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-yellow-400 hover:text-black transition-all shadow-sm active:scale-90"
                                                title="Modify Reservation"
                                            >
                                                <FiEdit2 size={18} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleCancelAndDelete(booking.id)} 
                                            className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90"
                                            title="Permanently Delete"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">No bookings found in your history.</div>
                )}
            </div>

            {/* MODULE B: INTEGRATED MODAL FOR EDITING EXISTING RECORDS */}
            {editModal.show && (
                <ResourceBookingModal 
                    resource={{ id: editModal.booking.resourceId, name: editModal.booking.resourceName }}
                    user={user}
                    existingData={editModal.booking} // <--- THIS PREVENTS DUPLICATION
                    onClose={() => setEditModal({ show: false, booking: null })}
                    onSuccess={fetchMyBookings}
                />
            )}
        </div>
    );
};

export default MyBookings;