import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MessageSquare, Check, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { getUser } from '../utils/auth';

const BookingForm = ({ facility, onClose }) => {
  const user = getUser();
  const today = new Date().toISOString().split('T')[0]; // Past dates-ah block panna

  const [formData, setFormData] = useState({
    date: today,
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
      ...formData,
      facilityName: facility.name || facility.title,
      userId: user?.id,
      username: user?.username,
      status: "PENDING"
    };

    try {
      await api.post('/api/bookings', payload);
      alert("Success! Your booking request is sent.");
      onClose();
    } catch (err) {
      // Backend-la irundhu conflict error vandha inga kaatum
      setError(err.response?.data || "Time slot conflict! Try another time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#262626]/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header - Matching Member 1 Style */}
        <div className="bg-[#262626] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FACC15] rounded-xl flex items-center justify-center text-black">
              <Calendar size={20} strokeWidth={3} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Reserve {facility.category}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Resource Name (ReadOnly) */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-yellow-600 ml-1">Asset Selected</label>
            <input readOnly value={facility.name} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-[#262626]" />
          </div>

          {/* Date Picker (Min = Today) */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-yellow-600 ml-1">Reservation Date</label>
            <div className="relative">
               <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
               <input required type="date" min={today} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#FACC15] outline-none font-medium" />
            </div>
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-yellow-600 ml-1">Start Time</label>
              <input required type="time" onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#FACC15] outline-none font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-yellow-600 ml-1">End Time</label>
              <input required type="time" onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#FACC15] outline-none font-medium" />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-yellow-600 ml-1">Purpose of use</label>
            <textarea required rows="2" placeholder="Explain the reason for booking..." onChange={(e) => setFormData({...formData, purpose: e.target.value})} className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#FACC15] outline-none font-medium resize-none" />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
            <button disabled={loading} type="submit" className="flex-[2] py-4 bg-[#FACC15] text-[#262626] rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-yellow-200 transition-all">
              {loading ? "Checking Slots..." : <><Check size={20} strokeWidth={3} /> Save Booking</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;