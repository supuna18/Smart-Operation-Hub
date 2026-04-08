import React, { useState } from 'react';

const BookingForm = ({ facility, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <h2 className="text-3xl font-black text-[#262626] mb-2">Book {facility.title}</h2>
        <p className="text-gray-400 text-sm mb-8 font-medium italic">Fill in the details to request your slot.</p>

        <div className="space-y-5">
          {/* Date Picker */}
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Reservation Date</label>
            <input type="date" name="date" onChange={handleChange} className="w-full mt-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Start Time</label>
              <input type="time" name="startTime" onChange={handleChange} className="w-full mt-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">End Time</label>
              <input type="time" name="endTime" onChange={handleChange} className="w-full mt-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Purpose of Booking</label>
            <textarea name="purpose" rows="2" onChange={handleChange} placeholder="e.g. Group Discussion, Presentation..." className="w-full mt-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium" />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Expected Attendees</label>
            <input type="number" name="attendees" min="1" onChange={handleChange} className="w-full mt-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none font-medium" />
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => onSubmit(formData)} className="flex-[2] py-4 bg-yellow-500 text-[#262626] rounded-2xl font-black shadow-lg shadow-yellow-500/20 hover:-translate-y-1 transition-all">
            Confirm Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;