import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import { FiX, FiCheck, FiInfo, FiLayers, FiUsers, FiMapPin } from 'react-icons/fi';

const ResourceForm = ({ resource, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Lecture Hall',
        capacity: 0,
        location: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        if (resource) {
            setFormData(resource);
        }
    }, [resource]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (resource?.id) {
                await ResourceService.updateResource(resource.id, formData);
            } else {
                await ResourceService.createResource(formData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving resource:', error);
            alert('Failed to save resource. Please check the backend connection.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {resource ? 'Edit Resource' : 'Add New Resource'}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                                <FiInfo size={14} /> Resource Name
                            </label>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                placeholder="E.g. Main Hall"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                                    <FiLayers size={14} /> Category
                                </label>
                                <select 
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                >
                                    <option value="Lecture Hall" className="bg-slate-800">Lecture Hall</option>
                                    <option value="Lab" className="bg-slate-800">Lab</option>
                                    <option value="Auditorium" className="bg-slate-800">Auditorium</option>
                                    <option value="Equipment" className="bg-slate-800">Equipment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                                    <FiUsers size={14} /> Capacity
                                </label>
                                <input 
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Number of seats"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                                <FiMapPin size={14} /> Location
                            </label>
                            <input 
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                placeholder="Building & Room Number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Availability Status</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${formData.status === 'ACTIVE' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="ACTIVE" 
                                        checked={formData.status === 'ACTIVE'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    ACTIVE
                                </label>
                                <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${formData.status === 'OUT_OF_SERVICE' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="OUT_OF_SERVICE" 
                                        checked={formData.status === 'OUT_OF_SERVICE'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    MAINTENANCE
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors font-medium border border-white/10"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-bold"
                        >
                            <FiCheck /> {resource ? 'Update' : 'Save'} Resource
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResourceForm;
