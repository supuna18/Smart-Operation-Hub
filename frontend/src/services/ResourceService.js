import api from '../utils/api';

const API_URL = '/resources';

const getAllResources = () => {
    return api.get(API_URL);
};

const getResourceById = (id) => {
    return api.get(`${API_URL}/${id}`);
};

const createResource = (resource) => {
    return api.post(API_URL, resource);
};

const updateResource = (id, resource) => {
    return api.put(`${API_URL}/${id}`, resource);
};

const deleteResource = (id) => {
    return api.delete(`${API_URL}/${id}`);
};

const searchResources = (params) => {
    return api.get(`${API_URL}/search`, { params });
};

const createBooking = (bookingData) => {
    return api.post(`${API_URL}/bookings`, bookingData);
};

const getMyBookings = (userId) => {
    return api.get(`${API_URL}/bookings/my/${userId}`);
};

const getAllBookings = () => {
    return api.get(`${API_URL}/bookings/all`);
};

const updateBookingStatus = (id, status, reason = '') => {
    let url = `${API_URL}/bookings/${id}/status?status=${status}`;
    if (reason) url += `&reason=${encodeURIComponent(reason)}`;
    return api.put(url);
};

const getBookingsByResourceId = (resourceId) => {
    return api.get(`${API_URL}/bookings/resource/${resourceId}`);
};


const ResourceService = {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
    searchResources,
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
    getBookingsByResourceId
};

export default ResourceService;
