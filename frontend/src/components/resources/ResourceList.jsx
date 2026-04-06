import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiFilter, FiUsers, FiMapPin } from 'react-icons/fi';

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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Assets & Facilities</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage and track all campus resources in one place.</p>
                </div>
                <button 
                    onClick={onAdd}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-yellow-400 text-slate-900 px-6 py-2.5 rounded-lg transition-colors font-semibold shadow-sm border border-yellow-400"
                >
                    <FiPlus size={18} className="stroke-[2.5px]" /> New Resource
                </button>
            </div>

            {/* Filters */}
            <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search resources by name..." 
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select 
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 appearance-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none cursor-pointer text-sm font-medium"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Lecture Hall">Lecture Hall</option>
                            <option value="Lab">Lab</option>
                            <option value="Auditorium">Auditorium</option>
                            <option value="Equipment">Equipment</option>
                        </select>
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select 
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 appearance-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none cursor-pointer text-sm font-medium"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active & Available</option>
                            <option value="OUT_OF_SERVICE">Under Maintenance</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="p-6 md:p-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-yellow-500 animate-spin" />
                        <p className="text-slate-500 font-medium text-sm">Loading assets...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource) => (
                            <div key={resource.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-yellow-400 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col">
                                {/* Top Color Bar */}
                                <div className={`h-1.5 w-full ${resource.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                                
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-md mb-2">
                                                {resource.type}
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight pr-4">{resource.name}</h3>
                                        </div>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => onEdit(resource)}
                                                className="p-1.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                                title="Edit Resource"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(resource.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                                title="Delete Resource"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <FiUsers className="text-slate-400" size={14} />
                                            <span><strong className="text-slate-900">{resource.capacity}</strong> Seats Capacity</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <FiMapPin className="text-slate-400" size={14} />
                                            <span className="truncate">{resource.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-500">Current Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                        resource.status === 'ACTIVE' 
                                            ? 'bg-emerald-100 text-emerald-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${resource.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                                        {resource.status === 'ACTIVE' ? 'Available' : 'Maintenance'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && resources.length === 0 && (
                    <div className="text-center py-24 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                        <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <FiSearch className="text-slate-400" size={20} />
                        </div>
                        <p className="text-slate-900 font-bold text-lg mb-1">No assets found</p>
                        <p className="text-slate-500 text-sm">We couldn't find any resources matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceList;
