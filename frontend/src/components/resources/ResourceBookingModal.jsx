import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiClock, FiUsers, FiInfo, FiMessageSquare } from 'react-icons/fi';
import ResourceService from '../../services/ResourceService';
import { useToast } from '../../context/ToastContext';

const ResourceBookingModal = ({ resource, user, onClose, onSuccess }) => {
    const { showToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Validate time range
            const start = new Date(`${formData.bookingDate}T${formData.startTime}`);
            const end = new Date(`${formData.bookingDate}T${formData.endTime}`);

            if (end <= start) {
                showToast('End time must be after start time', 'error');
                setSubmitting(false);
                return;
            }

            const bookingData = {
                resourceId: resource.id,
                resourceName: resource.name,
                userId: user.id || user.email,
                username: user.username || user.email.split('@')[0],
                startTime: formData.startTime,
                endTime: formData.endTime,
                bookingDate: formData.bookingDate,
                purpose: formData.purpose,
                attendees: parseInt(formData.attendees)
            };

            await ResourceService.createBooking(bookingData);
            showToast(`Booking request for ${resource.name} submitted!`, 'success');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Booking error:', error);
            const message = error.response?.data || error.message || 'Failed to submit booking';
            showToast(message.includes('Conflict') ? message : 'Failed to submit booking request.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative"
            >
                {/* Header */}
                <div className="bg-[#262626] p-8 pb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-5 -translate-y-16 translate-x-16 rounded-full" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 text-[9px] font-black uppercase tracking-widest mb-4">
                                Resource Reservation
                            </span>
                            <h2 className="text-2xl font-black text-white">Book <span className="text-yellow-400">{resource.name}</span></h2>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/40">
                            <FiX size={20} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 -mt-6 bg-white rounded-t-[2.5rem] relative z-20 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-full">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <FiCalendar className="text-yellow-500" /> Date of Booking
                            </label>
                            <input 
                                required
                                type="date" 
                                name="bookingDate"
                                value={formData.bookingDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all font-bold text-sm text-slate-700 shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <FiClock className="text-yellow-500" /> Start Time
                            </label>
                            <input 
                                required
                                type="time" 
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all font-bold text-sm text-slate-700 shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <FiClock className="text-yellow-500" /> End Time
                            </label>
                            <input 
                                required
                                type="time" 
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all font-bold text-sm text-slate-700 shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <FiUsers className="text-yellow-500" /> Attendees
                            </label>
                            <input 
                                required
                                type="number" 
                                name="attendees"
                                min="1"
                                max={resource.capacity || 1000}
                                value={formData.attendees}
                                onChange={handleChange}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all font-bold text-sm text-slate-700 shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                            <FiMessageSquare className="text-yellow-500" /> Purpose of Booking
                        </label>
                        <textarea 
                            required
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            placeholder="e.g., Final Year Group Presentation"
                            rows="2"
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all font-bold text-sm text-slate-700 placeholder-slate-400 shadow-inner resize-none"
                        />
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl flex gap-3 items-start">
                        <FiInfo className="text-yellow-600 mt-1 flex-shrink-0" size={18} />
                        <p className="text-[11px] font-medium text-yellow-800 leading-relaxed">
                            Booking requests are subject to administrator approval. You will be notified via the notification hub once a decision is made.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-inner active:scale-95"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={submitting}
                            className="flex-[2] px-8 py-4 bg-[#262626] hover:bg-black text-[#FACC15] rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-[#FACC15] border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ResourceBookingModal;
