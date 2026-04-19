import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FiX, FiCalendar, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import ResourceService from '../../services/ResourceService';

const ResourceCalendarModal = ({ resource, onClose }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await ResourceService.getBookingsByResourceId(resource.id);
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching resource bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (resource?.id) {
            fetchBookings();
        }
    }, [resource]);

    // Check if a date has bookings
    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            const hasBooking = bookings.some(b => {
                const bookingDate = new Date(b.bookingDate);
                return bookingDate.getDate() === date.getDate() &&
                       bookingDate.getMonth() === date.getMonth() &&
                       bookingDate.getFullYear() === date.getFullYear();
            });
            return hasBooking ? 'bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200' : null;
        }
    };

    const selectedDateBookings = bookings.filter(b => {
        const bookingDate = new Date(b.bookingDate);
        return bookingDate.getDate() === selectedDate.getDate() &&
               bookingDate.getMonth() === selectedDate.getMonth() &&
               bookingDate.getFullYear() === selectedDate.getFullYear();
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[500px]">
                {/* Left Side: Calendar */}
                <div className="p-8 bg-slate-50 md:w-1/2 border-r border-slate-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-slate-900 flex items-center justify-center shadow-sm">
                            <FiCalendar size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight">Availability</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{resource.name}</p>
                        </div>
                    </div>

                    <div className="flex-1 custom-calendar-container">
                        <Calendar 
                            onChange={setSelectedDate} 
                            value={selectedDate}
                            tileClassName={getTileClassName}
                            className="w-full border-none bg-transparent"
                        />
                    </div>
                </div>

                {/* Right Side: Details */}
                <div className="p-8 md:w-1/2 flex flex-col bg-white">
                    <div className="flex justify-between items-start mb-6">
                        <h4 className="text-lg font-bold text-slate-800">
                            Schedule for {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </h4>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-2 py-10">
                                <div className="w-6 h-6 border-2 border-slate-200 border-t-yellow-500 rounded-full animate-spin" />
                                <p className="text-sm text-slate-400 font-medium">Loading schedule...</p>
                            </div>
                        ) : selectedDateBookings.length > 0 ? (
                            selectedDateBookings.map((b, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-rose-600">
                                            <FiClock size={14} />
                                            <span className="text-xs font-black uppercase tracking-widest">Reserved</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tighter ${
                                            b.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {b.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">{b.username || 'Student User'}</p>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-4 py-10 border-2 border-dashed border-slate-100 rounded-3xl">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                                    <FiCheckCircle size={24} />
                                </div>
                                <div className="text-center px-4">
                                    <p className="text-sm font-bold text-slate-800">Clear Availability</p>
                                    <p className="text-xs text-slate-400">No bookings scheduled for this date.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="mt-6 text-[10px] text-slate-400 italic font-medium">
                        * Note: Recurring bookings are not shown.
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-calendar-container .react-calendar {
                    border: none !important;
                    font-family: inherit !important;
                }
                .react-calendar__tile--now {
                    background: #fef9c3 !important;
                    color: #854d0e !important;
                    border-radius: 8px !important;
                }
                .react-calendar__tile--active {
                    background: #262626 !important;
                    color: #facc15 !important;
                    border-radius: 8px !important;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background-color: #f1f5f9;
                    border-radius: 8px;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background-color: #f1f5f9;
                    border-radius: 8px;
                }
            `}} />
        </div>
    );
};

export default ResourceCalendarModal;
