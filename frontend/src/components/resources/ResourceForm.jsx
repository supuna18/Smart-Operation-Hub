import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import { useToast } from '../../context/ToastContext';
import { FiX, FiCheck, FiInfo, FiLayers, FiUsers, FiMapPin, FiEdit2, FiPlus, FiImage, FiCalendar } from 'react-icons/fi';

const ResourceForm = ({ resource, onClose, onSave }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Lecture Hall',
        capacity: 0,
        location: '',
        status: 'ACTIVE',
        availabilityWindows: '',
        imageUrl: ''
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
        if (Number(formData.capacity) < 0) {
            showToast('Capacity cannot be negative.', 'error');
            return;
        }
        try {
            if (resource?.id) {
                await ResourceService.updateResource(resource.id, formData);
                showToast('Resource updated successfully!', 'success');
            } else {
                await ResourceService.createResource(formData);
                showToast('Resource added successfully!', 'success');
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving resource:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save resource.';
            showToast(errorMessage, 'error');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showToast('Image size should be less than 2MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#262626] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FACC15 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 relative z-10">
                        <span className="w-8 h-8 rounded-lg bg-[#FACC15] flex items-center justify-center text-[#262626] shadow-lg shadow-yellow-500/20">
                            {resource ? <FiEdit2 size={16} strokeWidth={2.5} /> : <FiPlus size={16} strokeWidth={2.5} />}
                        </span>
                        {resource ? 'Edit Resource' : 'Register New Asset'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all relative z-10"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                                <FiInfo size={14} className="text-yellow-500" /> Resource Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none shadow-sm"
                                placeholder="E.g. Main Hall"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <FiLayers size={14} className="text-yellow-500" /> Category
                                </label>
                                <div className="relative">
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 appearance-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none shadow-sm cursor-pointer"
                                    >
                                        <option value="Lecture Hall">Lecture Hall</option>
                                        <option value="Lab">Lab</option>
                                        <option value="Auditorium">Auditorium</option>
                                        <option value="Equipment">Equipment</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <FiLayers size={14} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <FiUsers size={14} className="text-yellow-500" /> Capacity
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none shadow-sm"
                                    placeholder="Seats"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                                <FiMapPin size={14} className="text-yellow-500" /> Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none shadow-sm"
                                placeholder="Building & Room Number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Availability Status</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold ${formData.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200 hover:bg-slate-50'}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="ACTIVE"
                                        checked={formData.status === 'ACTIVE'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className={`w-2 h-2 rounded-full ${formData.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                    Active
                                </label>
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold ${formData.status === 'OUT_OF_SERVICE' ? 'bg-yellow-50 border-yellow-500 text-yellow-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-yellow-200 hover:bg-slate-50'}`}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="OUT_OF_SERVICE"
                                        checked={formData.status === 'OUT_OF_SERVICE'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className={`w-2 h-2 rounded-full ${formData.status === 'OUT_OF_SERVICE' ? 'bg-yellow-500' : 'bg-slate-300'}`} />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                                <FiCalendar size={14} className="text-yellow-500" /> Availability Windows
                            </label>
                            <input
                                type="text"
                                name="availabilityWindows"
                                value={formData.availabilityWindows}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none shadow-sm"
                                placeholder="E.g. 08:00 AM - 05:00 PM (Mon-Fri)"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                                <FiImage size={14} className="text-yellow-500" /> Resource Image (Link or Upload)
                            </label>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none shadow-sm text-sm"
                                    placeholder="https://images.unsplash.com/..."
                                />
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer transition-all text-sm font-bold">
                                        <FiPlus /> Pick from Computer
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    </label>
                                    
                                    {formData.imageUrl && (
                                        <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 relative group">
                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                                className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer., */}
                    <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors font-semibold text-sm shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FACC15] hover:bg-yellow-400 text-slate-900 border border-yellow-500 rounded-lg transition-colors shadow-sm font-bold text-sm"
                        >
                            <FiCheck className="stroke-[3px]" /> {resource ? 'Update' : 'Save'} Resource
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResourceForm;
