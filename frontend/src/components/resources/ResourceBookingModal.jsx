import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiClock, FiAlertCircle, FiCheck, FiCalendar } from 'react-icons/fi';
import BookingService from '../../services/BookingService'; 
import { useToast } from '../../context/ToastContext';

const ResourceBookingModal = ({ resource, user, onClose, onSuccess, existingData = null }) => {
    const { showToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [occupiedSlots, setOccupiedSlots] = useState([]);
    const today = new Date().toISOString().split('T')[0];
    
    // Default form state
    const [formData, setFormData] = useState({
        startDate: existingData?.startDate || today,
        endDate: existingData?.endDate || today,
        startTime: existingData?.startTime || '',
        endTime: existingData?.endTime || '',
        purpose: existingData?.purpose || '',
        attendees: existingData?.attendees || 1
    });

    // Fetch Busy Schedule
    useEffect(() => {
        const fetchOccupiedSlots = async () => {
            try {
                const response = await BookingService.getBookingsByResourceId(resource.id);
                // Active bookings mattum kaatuvom (PENDING/APPROVED)
                const active = response.data.filter(b => 
                    (b.status === 'PENDING' || b.status === 'APPROVED') && b.id !== existingData?.id
                );
                setOccupiedSlots(active);
            } catch (error) {
                console.error("Error fetching availability:", error);
            }
        };

        if (resource?.id) {
            fetchOccupiedSlots();
        }
    }, [resource.id, existingData?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Client-side Validation: Dates
        if (formData.endDate < formData.startDate) {
            showToast("End date cannot be before start date", "error");
            return;
        }

        // 2. Client-side Validation: Times (Same day overlap check)
        if (formData.startDate === formData.endDate && formData.startTime >= formData.endTime) {
            showToast("End time must be later than start time", "error");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                resourceId: resource.id,
                resourceName: resource.name,
                userId: user.id || user.email,
                username: user.username || user.name || "User",
                status: existingData ? existingData.status : "PENDING"
            };

            if (existingData?.id) {
                await BookingService.updateBooking(existingData.id, payload);
                showToast('Reservation updated successfully!', 'success');
            } else {
                await BookingService.createBooking(payload);
                showToast(`Request for ${resource.name} submitted!`, 'success');
            }

            onSuccess(); 
            onClose();
        } catch (error) {
            // BACKEND CONFLICT CATCHING LOGIC
            const serverError = error.response?.data?.message;
            
            if (serverError === "TIME_SLOT_CONFLICT") {
                showToast("Conflict Detected! This time slot overlaps with an existing booking.", "error");
            } else {
                showToast(serverError || "Request failed. Check Busy Schedule list.", "error");
            }
            console.error("Booking Error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10"
            >
                
                {/* LEFT SIDE: BUSY SCHEDULE (User Guidance) */}
                <div className="md:w-5/12 bg-slate-50 p-8 border-r border-slate-100 overflow-y-auto max-h-[85vh] scrollbar-hide">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center text-yellow-700">
                            <FiAlertCircle size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-600">Busy Schedule</h3>
                            <p className="text-[10px] text-slate-400 font-bold">Avoid overlapping with these slots</p>
                        </div>
                    </div>

                    {occupiedSlots.length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">All Slots Available</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {occupiedSlots.map((slot, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-yellow-400 relative group"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] font-black bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded uppercase">{slot.status}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{slot.username?.split(' ')[0]}</span>
                                    </div>
                                    <div className="text-xs font-black text-slate-800">
                                        {slot.startDate} {slot.startDate !== slot.endDate && ` — ${slot.endDate}`}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-1">
                                        <FiClock size={11} className="text-yellow-500" /> {slot.startTime} to {slot.endTime}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: BOOKING FORM */}
                <div className="md:w-7/12 p-10 bg-white relative">
                    <button onClick={onClose} className="absolute top-8 right-8 p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all text-slate-400"><FiX size={20} /></button>
                    
                    <div className="mb-8">
                        <span className="px-3 py-1 rounded-full bg-slate-900 text-yellow-400 text-[9px] font-black uppercase tracking-widest mb-3 inline-block">
                            Module B: Resource Manager
                        </span>
                        <h2 className="text-3xl font-black text-slate-900">
                            Book <span className="text-yellow-500">{resource.name}</span>
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Start Date</label>
                                <input required type="date" min={today} value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">End Date</label>
                                <input required type="date" min={formData.startDate} value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Start Time</label>
                                <input required type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">End Time</label>
                                <input required type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Purpose of Booking</label>
                            <textarea required rows="3" placeholder="Describe why you need this resource..." value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm resize-none focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting} 
                            className="w-full py-5 bg-[#262626] hover:bg-black text-[#FACC15] rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {submitting ? 'Checking System...' : (
                                <><FiCheck size={18} /> {existingData ? 'Save Changes' : 'Confirm Reservation'}</>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ResourceBookingModal;