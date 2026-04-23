import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceService from '../../services/ResourceService';
import { useToast } from '../../context/ToastContext';
import {
    FiX, FiCheck, FiInfo, FiLayers,
    FiUsers, FiMapPin, FiEdit2, FiPlus,
    FiImage, FiCalendar, FiActivity,
    FiSettings, FiBox
} from 'react-icons/fi';

const ResourceForm = ({ resource, onClose, onSave }) => {
    const { showToast } = useToast();
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const CATEGORIES = [
        { name: "Lecture Hall", icon: FiUsers },
        { name: "Laboratory", icon: FiActivity },
        { name: "Auditorium", icon: FiUsers },
        { name: "Equipment", icon: FiSettings },
        { name: "Study Area", icon: FiBox },
        { name: "Lounge", icon: FiImage },
        { name: "Sports Facility", icon: FiActivity },
        { name: "Other", icon: FiLayers }
    ];
    const [formData, setFormData] = useState({
        name: '',
        type: 'Lecture Hall',
        capacity: 0,
        location: '',
        status: 'ACTIVE',
        availabilityWindows: '',
        imageUrl: ''
    });

    const [availDays, setAvailDays] = useState('Weekdays');
    const [availStart, setAvailStart] = useState('08:00');
    const [availEnd, setAvailEnd] = useState('17:00');
    const [isCustomAvail, setIsCustomAvail] = useState(false);

    useEffect(() => {
        if (resource) {
            setFormData(resource);
            if (resource.availabilityWindows) {
                const match = resource.availabilityWindows.match(/(\d{2}:\d{2}\s[AP]M)\s-\s(\d{2}:\d{2}\s[AP]M)\s\((.*?)\)/);
                if (match) {
                    const parseTime = (t) => {
                        const [time, modifier] = t.split(' ');
                        let [hours, minutes] = time.split(':');
                        if (hours === '12') {
                            hours = modifier === 'AM' ? '00' : '12';
                        } else if (modifier === 'PM') {
                            hours = (parseInt(hours, 10) + 12).toString();
                        }
                        return `${hours.toString().padStart(2, '0')}:${minutes}`;
                    };
                    setAvailStart(parseTime(match[1]));
                    setAvailEnd(parseTime(match[2]));
                    setAvailDays(match[3]);
                    setIsCustomAvail(false);
                } else {
                    setIsCustomAvail(true);
                }
            } else {
                setIsCustomAvail(false);
            }
        } else {
            setAvailDays('Weekdays');
            setAvailStart('08:00');
            setAvailEnd('17:00');
            setIsCustomAvail(false);
        }
    }, [resource]);

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        const formattedH = h < 10 ? `0${h}` : h;
        return `${formattedH}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        if (!isCustomAvail) {
            setFormData(prev => ({
                ...prev,
                availabilityWindows: `${formatTime(availStart)} - ${formatTime(availEnd)} (${availDays})`
            }));
        }
    }, [availStart, availEnd, availDays, isCustomAvail]);

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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-md overflow-hidden">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200"
                >
                    {/* --- Sticky Header --- */}
                    <div className="flex-shrink-0 flex items-center justify-between p-6 bg-[#262626] relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FACC15 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-[#FACC15] flex items-center justify-center text-[#262626] shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                                {resource ? <FiEdit2 size={22} strokeWidth={2.5} /> : <FiPlus size={22} strokeWidth={2.5} />}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">
                                    {resource ? 'Update Resource' : 'Register Asset'}
                                </h3>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-yellow-500/80 font-bold">
                                    Campus Hub Asset Management
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all relative z-10"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* --- Scrollable Body --- */}
                    <form id="resourceForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        <div className="space-y-10">

                            {/* Section 1: Basic Identifiers */}
                            <section className="space-y-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-5 bg-yellow-400 rounded-full" />
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <FiBox className="text-yellow-500" /> Basic Identifiers
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">Resource Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm shadow-inner-sm"
                                            placeholder="e.g. SLIIT Main Auditorium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">Category</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                onFocus={() => setIsCategoryOpen(true)}
                                                onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)}
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm shadow-inner-sm pr-12"
                                                placeholder="Select or type category..."
                                                required
                                                autoComplete="off"
                                            />
                                            <FiLayers className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-500 transition-colors pointer-events-none" />
                                            
                                            <AnimatePresence>
                                                {isCategoryOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden py-2 custom-scrollbar max-h-48 overflow-y-auto"
                                                    >
                                                        {CATEGORIES.filter(c => c.name.toLowerCase().includes(formData.type.toLowerCase()) || !formData.type).map((cat, idx) => {
                                                            const Icon = cat.icon;
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFormData(prev => ({ ...prev, type: cat.name }));
                                                                        setIsCategoryOpen(false);
                                                                    }}
                                                                    className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                                                                >
                                                                    <Icon size={16} className="text-yellow-500" />
                                                                    {cat.name}
                                                                </button>
                                                            );
                                                        })}
                                                        {CATEGORIES.filter(c => c.name.toLowerCase().includes(formData.type.toLowerCase()) || !formData.type).length === 0 && (
                                                            <div className="px-5 py-3 text-sm font-medium text-slate-400">
                                                                Press Enter to use "{formData.type}"
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">Capacity</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                name="capacity"
                                                value={formData.capacity}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm shadow-inner-sm pr-12"
                                                placeholder="Seats"
                                            />
                                            <FiUsers className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-500 transition-colors pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Logistics & Status */}
                            <section className="space-y-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-5 bg-yellow-400 rounded-full" />
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <FiMapPin className="text-yellow-500" /> Logistics & Availability
                                    </h4>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-1 text-xs">Primary Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm shadow-inner-sm"
                                            placeholder="Building name, Floor, Room number"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2 px-1">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-xs">Availability Window</label>
                                            <button
                                                type="button"
                                                onClick={() => setIsCustomAvail(!isCustomAvail)}
                                                className="text-[10px] font-black text-yellow-500 hover:text-yellow-600 transition-colors uppercase tracking-wider bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200/50 shadow-sm"
                                            >
                                                {isCustomAvail ? 'Use Quick Selector' : 'Use Custom Text'}
                                            </button>
                                        </div>

                                        {isCustomAvail ? (
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    name="availabilityWindows"
                                                    value={formData.availabilityWindows}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm shadow-inner-sm pr-12"
                                                    placeholder="e.g. 08:00 AM - 05:00 PM (Weekdays)"
                                                />
                                                <FiCalendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-500 transition-colors pointer-events-none" />
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="relative group">
                                                    <select
                                                        value={availDays}
                                                        onChange={(e) => setAvailDays(e.target.value)}
                                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm shadow-inner-sm appearance-none cursor-pointer"
                                                    >
                                                        <option value="Weekdays">Weekdays</option>
                                                        <option value="Weekends">Weekends</option>
                                                        <option value="Everyday">Everyday</option>
                                                        <option value="Mon-Wed-Fri">Mon-Wed-Fri</option>
                                                        <option value="Tue-Thu">Tue-Thu</option>
                                                    </select>
                                                    <FiLayers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                </div>
                                                <div className="relative group">
                                                    <input
                                                        type="time"
                                                        value={availStart}
                                                        onChange={(e) => setAvailStart(e.target.value)}
                                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm shadow-inner-sm cursor-pointer"
                                                    />
                                                    <span className="absolute -top-2 left-3 bg-white px-1 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100">Opens</span>
                                                </div>
                                                <div className="relative group">
                                                    <input
                                                        type="time"
                                                        value={availEnd}
                                                        onChange={(e) => setAvailEnd(e.target.value)}
                                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm shadow-inner-sm cursor-pointer"
                                                    />
                                                    <span className="absolute -top-2 left-3 bg-white px-1 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100">Closes</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 px-1 text-xs">Operational Status</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200'}`}>
                                                <input type="radio" name="status" value="ACTIVE" checked={formData.status === 'ACTIVE'} onChange={handleChange} className="hidden" />
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${formData.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                    <span className={`text-xs font-black uppercase tracking-widest ${formData.status === 'ACTIVE' ? 'text-emerald-700' : 'text-slate-500'}`}>ACTIVE</span>
                                                </div>
                                                {formData.status === 'ACTIVE' && <FiCheck size={16} className="text-emerald-500" />}
                                            </label>

                                            <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.status === 'OUT_OF_SERVICE' ? 'bg-yellow-50 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'bg-white border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200'}`}>
                                                <input type="radio" name="status" value="OUT_OF_SERVICE" checked={formData.status === 'OUT_OF_SERVICE'} onChange={handleChange} className="hidden" />
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${formData.status === 'OUT_OF_SERVICE' ? 'bg-yellow-500' : 'bg-slate-300'}`} />
                                                    <span className={`text-xs font-black uppercase tracking-widest ${formData.status === 'OUT_OF_SERVICE' ? 'text-yellow-700' : 'text-slate-500'}`}>MAINTENANCE</span>
                                                </div>
                                                {formData.status === 'OUT_OF_SERVICE' && <FiCheck size={16} className="text-yellow-600" />}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Visual Assets */}
                            <section className="space-y-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-5 bg-yellow-400 rounded-full" />
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <FiImage className="text-yellow-500" /> Visual Representation
                                    </h4>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center gap-5">
                                    {formData.imageUrl ? (
                                        <div className="w-full aspect-video rounded-2xl overflow-hidden relative shadow-lg group">
                                            <img src={formData.imageUrl} alt="Asset Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(p => ({ ...p, imageUrl: '' }))}
                                                    className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all hover:scale-110"
                                                >
                                                    <FiX size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video rounded-2xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3 group hover:border-yellow-400/50 transition-colors">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-yellow-50 group-hover:text-yellow-500 transition-all">
                                                <FiImage size={24} />
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-wider">No Image Preview</p>
                                        </div>
                                    )}

                                    <div className="w-full flex flex-col md:flex-row gap-3">
                                        <div className="flex-1 relative group">
                                            <input
                                                type="text"
                                                name="imageUrl"
                                                value={formData.imageUrl}
                                                onChange={handleChange}
                                                className="w-full pl-5 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-400 transition-all outline-none"
                                                placeholder="Paste image URL here..."
                                            />
                                            <FiPlus className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-yellow-500" />
                                        </div>
                                        <label className="px-6 py-3 bg-[#262626] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-black transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-black/10">
                                            <FiPlus size={14} /> Upload Local
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </form>

                    {/* --- Sticky Footer --- */}
                    <div className="flex-shrink-0 flex gap-4 p-6 bg-slate-50 border-t border-slate-100 md:px-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-white border-2 border-slate-100 hover:bg-slate-100 hover:border-slate-200 text-slate-500 rounded-2xl transition-all font-black text-xs uppercase tracking-widest active:scale-[0.98]"
                        >
                            Discard
                        </button>
                        <button
                            form="resourceForm"
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#FACC15] hover:bg-yellow-400 text-slate-900 rounded-2xl transition-all shadow-lg shadow-yellow-500/20 font-black text-xs uppercase tracking-widest active:scale-[0.98]"
                        >
                            <FiCheck className="stroke-[3.5px]" size={16} />
                            {resource ? 'Sync Changes' : 'Initialize Asset'}
                        </button>
                    </div>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgba(0,0,0,0.05);
                            border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: rgba(0,0,0,0.1);
                        }
                        .shadow-inner-sm {
                            box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
                        }
                    `}} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ResourceForm;
