import axios from 'axios';

const API_URL = "http://localhost:8080/api/bookings"; // Backend URL

export const createBooking = (bookingData) => {
    return axios.post(`${API_URL}/create`, bookingData);
};

export const getMyBookings = (userId) => {
    return axios.get(`${API_URL}/user/${userId}`);
};

export const getAllBookings = () => {
    return axios.get(`${API_URL}/all`);
};

export const updateBookingStatus = (id, status, reason) => {
    return axios.put(`${API_URL}/${id}/status`, null, {
        params: { status, reason }
    });
};