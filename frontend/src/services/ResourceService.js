import axios from 'axios';

const API_URL = 'http://localhost:8082/api/resources';

const getAllResources = () => {
    return axios.get(API_URL);
};

const getResourceById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const createResource = (resource) => {
    return axios.post(API_URL, resource);
};

const updateResource = (id, resource) => {
    return axios.put(`${API_URL}/${id}`, resource);
};

const deleteResource = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

const searchResources = (params) => {
    return axios.get(`${API_URL}/search`, { params });
};

const ResourceService = {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
    searchResources
};

export default ResourceService;
