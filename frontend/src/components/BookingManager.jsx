import React, { useState, useEffect } from 'react';
import { createBooking, getMyBookings } from '../services/bookingService';

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [formData, setFormData] = useState({
        resourceId: '', bookingDate: '', startTime: '', endTime: '', purpose: '', attendees: 1
    });
    const userId = "user123";

    useEffect(() => { loadBookings(); }, []);

    const loadBookings = async () => {
        try {
            const res = await getMyBookings(userId);
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const res = await createBooking({ ...formData, userId });
            alert(res.data);
            loadBookings();
        } catch (err) { alert("Error connecting to server!"); }
    };

    return (
        <div className="booking-container">
            <h2 style={{ color: '#5d4037', marginBottom: '20px', textAlign: 'center' }}>Campus Resource Booking</h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center' }}>
                {/* Form Section */}
                <form onSubmit={handleBooking} style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
                    <input type="text" placeholder="Resource ID (e.g. LAB-01)" required onChange={e => setFormData({...formData, resourceId: e.target.value})} />
                    <input type="date" required onChange={e => setFormData({...formData, bookingDate: e.target.value})} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="time" required title="Start Time" onChange={e => setFormData({...formData, startTime: e.target.value})} />
                        <input type="time" required title="End Time" onChange={e => setFormData({...formData, endTime: e.target.value})} />
                    </div>
                    <textarea placeholder="Purpose of booking" rows="3" onChange={e => setFormData({...formData, purpose: e.target.value})}></textarea>
                    <button type="submit">Submit Request</button>
                </form>

                {/* Table Section */}
                <div style={{ flex: '2', minWidth: '400px' }}>
                    <h3 style={{ color: '#8d6e63', marginBottom: '10px' }}>My Bookings History</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr><th>Resource</th><th>Date</th><th>Time</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? bookings.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.resourceId}</td><td>{b.bookingDate}</td>
                                        <td>{b.startTime} - {b.endTime}</td>
                                        <td style={{ fontWeight: '600', color: b.status === 'APPROVED' ? '#2e7d32' : '#ef6c00' }}>{b.status}</td>
                                    </tr>
                                )) : <tr><td colSpan="4" style={{ textAlign: 'center' }}>No bookings found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingManager;