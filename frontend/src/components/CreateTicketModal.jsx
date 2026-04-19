import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, Type, FileText, ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getUser } from '../utils/auth';

const CreateTicketModal = ({ isOpen, onClose, onCreated }) => {
    const user = getUser();
    const [formData, setFormData] = useState({
        issueTitle: '',
        location: '',
        description: '',
        imageUrl: '',
        createdBy: user?.username || 'Anonymous'
    });
    const [loading, setLoading] = useState(false);

    const issueTypes = [
        "Projector Issues (Lecture Hall)",
        "Computer/IT Problems (Lab)",
        "AC/Electrical Issues (Classroom)",
        "Sports Ground Equipment",
        "Canteen Deficiency",
        "Furniture/Facilities",
        "Other"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Ensure status is OPEN on creation
            const ticketToCreate = {
                ...formData,
                status: 'OPEN',
                createdAt: new Date().toISOString()
            };
            await axios.post('http://localhost:8082/api/tickets', ticketToCreate);
            onCreated();
        } catch (err) {
            console.error('Error creating ticket:', err);
            alert('Failed to create ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white/95 backdrop-blur-2xl w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-white/40 max-h-[90vh] flex flex-col"
                >
                    <div className="p-10 overflow-y-auto scrollbar-hide">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-1">Report an Issue</h2>
                                <p className="text-gray-600 font-bold text-sm tracking-tight">Help us keep the campus in top shape</p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-3 bg-gray-100/50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl transition-all active:scale-90"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-extrabold uppercase tracking-widest text-gray-800 block mb-3 px-1">Issue Category</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                                            <Type className="text-gray-500 w-5 h-5 group-focus-within:text-yellow-600 transition-colors" />
                                        </div>
                                        <input 
                                            list="issue-types"
                                            required
                                            value={formData.issueTitle}
                                            onChange={(e) => setFormData({...formData, issueTitle: e.target.value})}
                                            className="w-full bg-gray-100 border border-gray-200 rounded-[1.5rem] py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-bold text-gray-900 placeholder:text-gray-500 placeholder:font-semibold"
                                            placeholder="Select or type..."
                                        />
                                        <datalist id="issue-types">
                                            {issueTypes.map(type => <option key={type} value={type} />)}
                                        </datalist>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-extrabold uppercase tracking-widest text-gray-800 block mb-3 px-1">Location</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                                            <MapPin className="text-gray-500 w-5 h-5 group-focus-within:text-yellow-600 transition-colors" />
                                        </div>
                                        <input 
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            className="w-full bg-gray-100 border border-gray-200 rounded-[1.5rem] py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-bold text-gray-900 placeholder:text-gray-500 placeholder:font-semibold"
                                            placeholder="e.g. Lab 03, Block B"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-extrabold uppercase tracking-widest text-gray-800 block mb-3 px-1">Detailed Description</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-5 pointer-events-none">
                                        <FileText className="text-gray-500 w-5 h-5 group-focus-within:text-yellow-600 transition-colors" />
                                    </div>
                                    <textarea 
                                        required
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-gray-100 border border-gray-200 rounded-[1.5rem] py-5 pl-12 pr-5 outline-none focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-bold text-gray-900 placeholder:text-gray-500 placeholder:font-semibold resize-none min-h-[120px]"
                                        placeholder="Describe the problem, e.g., 'The lamp is flickering then went black'..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-extrabold uppercase tracking-widest text-gray-800 block mb-3 px-1">Attachment</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                                    {/* Upload Area */}
                                    <div className="relative group/upload h-[120px]">
                                        <input 
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData({ ...formData, imageUrl: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 group-hover/upload:border-yellow-400 group-hover/upload:bg-yellow-50/20 transition-all">
                                            <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover/upload:scale-110 group-hover/upload:rotate-3 transition-all duration-300">
                                                <ImageIcon className="text-gray-500 group-hover/upload:text-yellow-600 w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-gray-600 group-hover/upload:text-yellow-600 transition-colors">Click to Upload</span>
                                        </div>
                                    </div>

                                    {/* URL / Preview Area */}
                                    <div className="h-[120px]">
                                        {formData.imageUrl ? (
                                            <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-gray-100 group">
                                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button 
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                                        className="p-2 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                                                    >
                                                        <X size={14} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 border border-gray-200 rounded-[1.5rem] flex items-center justify-center px-4 hover:border-gray-300 transition-colors group">
                                                <input 
                                                    type="url"
                                                    value={formData.imageUrl}
                                                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                                    className="w-full bg-transparent outline-none text-center font-bold text-gray-700 placeholder:text-gray-500 text-xs transition-colors"
                                                    placeholder="...OR PASTE IMAGE URL"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#262626] text-[#FACC15] py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-yellow-400/20 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all disabled:opacity-70 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-7 h-7 animate-spin" />
                                ) : (
                                    <>
                                        Submit Ticket 
                                        <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateTicketModal;
