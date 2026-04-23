import React, { useState } from 'react';
import { X, Calendar, Clock, Check, AlertCircle, MessageSquare, Users, Sparkles } from 'lucide-react';
import api from '../../utils/api';
import { getUser } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';

const BookingForm = ({ facility, onClose, editBooking = null }) => {
  const user = getUser();
  const { showToast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    startDate: editBooking ? editBooking.startDate : today,
    endDate: editBooking ? editBooking.endDate : today,
    startTime: editBooking ? editBooking.startTime : '',
    endTime: editBooking ? editBooking.endTime : '',
    purpose: editBooking ? editBooking.purpose : '',
    attendees: editBooking ? editBooking.attendees : 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose,
      attendees: parseInt(formData.attendees),
      resourceId: facility?.id || (editBooking ? editBooking.resourceId : null),
      resourceName: facility?.name || (editBooking ? editBooking.resourceName : null),
      userId: user?.id || user?.email,
      username: user?.username,
      status: "PENDING"
    };

    try {
      if (editBooking) {
        // Update existing booking
        await api.put(`/resources/bookings/${editBooking.id}`, payload);
        showToast("Success! Your reservation has been updated.", "success");
      } else {
        // Create new booking
        await api.post('/resources/bookings', payload);
        showToast("Success! Your reservation request has been submitted.", "success");
      }
      onClose();
      // Optional: Instead of reload, maybe trigger a refresh in parent if possible
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Conflict! Slot already taken or Server Error.";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate duration
  const getDuration = () => {
    if (!formData.startTime || !formData.endTime) return null;
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const diff = (end - start) / (1000 * 60 * 60);
    return diff > 0 ? diff.toFixed(1) : null;
  };

  const duration = getDuration();

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] flex items-start justify-center p-2 sm:p-4 md:pt-20 animate-in fade-in duration-500 overflow-hidden">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-5 duration-500 border border-slate-100 flex flex-col max-h-[85vh]">
        
        {/* Glassmorphic Header - Blends with Nav */}
        <div className="bg-white/80 backdrop-blur-xl py-6 px-8 relative overflow-hidden flex-shrink-0 border-b border-slate-100">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FACC15] via-yellow-400 to-[#FACC15]" />
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#262626] border border-slate-100 shadow-sm">
                <Sparkles size={24} className="text-[#FACC15]" strokeWidth={2.5} />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xl font-black tracking-tight leading-none text-[#262626]">
                  Reserve <span className="text-[#FACC15]">Section</span>
                </h2>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FACC15] rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                      {facility?.name || editBooking?.resourceName}
                    </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all border border-slate-100 active:scale-90"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto custom-scrollbar flex-1 bg-white">
          <form id="booking-form" onSubmit={handleSubmit} className="p-7 space-y-6">
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl flex items-center gap-4 text-rose-600 animate-in slide-in-from-top-2">
                <AlertCircle size={18} strokeWidth={3} className="shrink-0" />
                <div className="text-xs font-bold leading-tight">{error}</div>
              </div>
            )}

            {/* Timing Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={14} className="text-[#FACC15] font-black" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section 1: Schedule</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider ml-1">Arrival Date</label>
                  <input required type="date" min={today} value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-[#FACC15] outline-none font-bold text-slate-700 transition-all text-xs shadow-inner" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider ml-1">Departure Date</label>
                  <input required type="date" min={formData.startDate} value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-[#FACC15] outline-none font-bold text-slate-700 transition-all text-xs shadow-inner" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider ml-1">Start Time</label>
                  <input required type="time" onChange={(e) => setFormData({...formData, startTime: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-[#FACC15] outline-none font-bold text-slate-700 transition-all text-xs shadow-inner" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider ml-1">End Time</label>
                  <input required type="time" onChange={(e) => setFormData({...formData, endTime: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-[#FACC15] outline-none font-bold text-slate-700 transition-all text-xs shadow-inner" />
                </div>
              </div>

              {duration && (
                <div className="bg-[#262626] text-white p-2.5 rounded-xl flex items-center justify-center gap-2 transform skew-x-[-10deg]">
                    <Clock size={14} className="text-[#FACC15]" />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">Utilization Duration: {duration} Hours</span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Users size={14} className="text-[#FACC15]" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section 2: Activity Details</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider ml-1">Number of Attendees</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input required type="number" min="1" value={formData.attendees} onChange={(e) => setFormData({...formData, attendees: e.target.value})} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-[#FACC15] outline-none font-bold text-slate-700 transition-all text-xs shadow-inner" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider ml-1">Purpose of Utilization</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                    <textarea required rows="2" placeholder="e.g. Project meeting..." value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-[#FACC15] outline-none font-bold text-slate-700 resize-none transition-all text-xs shadow-inner min-h-[80px]" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex-shrink-0">
          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3.5 bg-white text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 border-slate-200 hover:bg-slate-50 active:scale-95"
            >
              Cancel
            </button>
            <button 
              form="booking-form"
              disabled={loading} 
              type="submit" 
              className="flex-[2] py-3.5 bg-[#FACC15] text-[#262626] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-yellow-400 shadow-xl shadow-yellow-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Confirming..." : <>{editBooking ? <Sparkles size={18} strokeWidth={3} /> : <Check size={18} strokeWidth={3} />} {editBooking ? 'Update Reservation' : 'Submit Reservation'}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;