import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiFilter } from 'react-icons/fi';

const ResourceList = ({ onEdit, onAdd }) => {
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, [search, filterType, filterStatus]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.name = search;
            if (filterType) params.type = filterType;
            if (filterStatus) params.status = filterStatus;

            const response = await ResourceService.searchResources(params);
            setResources(response.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
            // Fallback to all resources if search fails or initially
            const response = await ResourceService.getAllResources();
            setResources(response.data);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await ResourceService.deleteResource(id);
                fetchResources();
            } catch (error) {
                console.error('Error deleting resource:', error);
            }
        }
    };

    return (
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Facilities & Assets</h2>
                <button 
                    onClick={onAdd}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/30"
                >
                    <FiPlus /> Add Resource
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search resources..." 
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="" className="bg-slate-800 text-white">All Types</option>
                        <option value="Lecture Hall" className="bg-slate-800 text-white">Lecture Hall</option>
                        <option value="Lab" className="bg-slate-800 text-white">Lab</option>
                        <option value="Auditorium" className="bg-slate-800 text-white">Auditorium</option>
                        <option value="Equipment" className="bg-slate-800 text-white">Equipment</option>
                    </select>
                </div>
                <div className="relative">
                    <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="" className="bg-slate-800 text-white">All Status</option>
                        <option value="ACTIVE" className="bg-slate-800 text-white">Active</option>
                        <option value="OUT_OF_SERVICE" className="bg-slate-800 text-white">Out of Service</option>
                    </select>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                        <div key={resource.id} className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border-l-4 border-l-indigo-500 shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">{resource.name}</h3>
                                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30 uppercase tracking-wider">{resource.type}</span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onEdit(resource)}
                                        className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(resource.id)}
                                        className="p-2 bg-rose-500/20 text-rose-300 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-3 text-gray-300 text-sm">
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                    <span>Capacity:</span>
                                    <span className="text-white font-medium">{resource.capacity} seats</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                    <span>Location:</span>
                                    <span className="text-white font-medium">{resource.location}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Status:</span>
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${resource.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                                        {resource.status === 'ACTIVE' ? 'AVAILABLE' : 'MAINTENANCE'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && resources.length === 0 && (
                <div className="text-center py-20 text-gray-400 italic bg-white/5 rounded-2xl border border-dashed border-white/10 mt-6">
                    No resources found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default ResourceList;
