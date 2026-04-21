import React, { useState } from 'react';
import { X, Calendar, Clock, Check, AlertCircle, Users, MessageSquare } from 'lucide-react';
import api from '../utils/api';
import { getUser } from '../utils/auth';

const BookingForm = ({ facility, onClose }) => {
  const user = getUser();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    startDate: today,
    endDate: today,
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
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
      attendees: formData.attendees,
      resourceId: facility.id,      // <--- 'id' ah anupunga
      resourceName: facility.name, // <--- 'name' ah anupunga
      userId: user?.id || user?.email,
      username: user?.username,
      status: "PENDING"

    };

    try {
      // Sariyaana API path: Member 1 controller-la irukka path
      await api.post('/resources/bookings', payload); 
      alert("Success! Booking saved in resource_bookings table.");
      onClose();
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || "Error saving booking.");
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="fixed inset-0 bg-[#262626]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header - Matching Theme */}
        <div className="bg-[#262626] p-7 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #FACC15 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-[#FACC15] rounded-2xl flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
              <Calendar size={22} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight leading-tight">Reserve Resource</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{facility.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Date Range Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-yellow-600 ml-1">Start Date</label>
              <input required type="date" min={today} value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#FACC15] outline-none font-medium transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-yellow-600 ml-1">End Date</label>
              <input required type="date" min={formData.startDate} value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#FACC15] outline-none font-medium transition-all" />
            </div>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-yellow-600 ml-1">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input required type="time" onChange={(e) => setFormData({...formData, startTime: e.target.value})} 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-yellow-600 ml-1">End Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input required type="time" onChange={(e) => setFormData({...formData, endTime: e.target.value})} 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium" />
              </div>
            </div>
          </div>

          {/* Purpose & Attendees */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-yellow-600 ml-1">Purpose of use</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
              <textarea required rows="2" placeholder="Describe your activity..." onChange={(e) => setFormData({...formData, purpose: e.target.value})} 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#FACC15] outline-none font-medium resize-none transition-all" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
            <button disabled={loading} type="submit" className="flex-[2] py-4 bg-[#FACC15] text-[#262626] rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-yellow-200 transition-all active:scale-95 disabled:opacity-50">
              {loading ? "Checking Slots..." : <><Check size={20} strokeWidth={3} /> Reserve Now</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;