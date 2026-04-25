import api from '../utils/api';

const API_URL = '/resources/bookings'; 

// 1. New booking request create panna
const createBooking = (bookingData) => {
    return api.post(API_URL, bookingData);
};

// 2. User history fetch panna
const getMyBookings = (userId) => {
    return api.get(`${API_URL}/my/${userId}`);
};

// 3. Admin Dashboard - Ella bookings-um pakka
const getAllBookings = () => {
    return api.get(`${API_URL}/all`);
};

// 4. Availability check (User side guidance-kaga)
const getBookingsByResourceId = (resourceId) => {
    return api.get(`${API_URL}/resource/${resourceId}`);
};

// 5. Admin Approve/Reject logic (Reason-oda)
const updateBookingStatus = (id, status, reason = '') => {
    // API structure: /api/resources/bookings/{id}/status?status=APPROVED&reason=...
    let url = `${API_URL}/${id}/status?status=${status}`;
    if (reason) url += `&reason=${encodeURIComponent(reason)}`;
    return api.put(url);
};

// 6. Existing booking-ah edit panna
const updateBooking = (id, bookingData) => {
    return api.put(`${API_URL}/${id}/update`, bookingData);
};

// 7. Booking record-ah delete panna
const deleteBooking = (id) => {
    return api.delete(`${API_URL}/${id}`);
};

const BookingService = {
    createBooking,
    getMyBookings,
    getAllBookings,
    getBookingsByResourceId,
    updateBookingStatus,
    updateBooking,
    deleteBooking
};

export default BookingService;