import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, MapPin, Type, FileText, ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getUser } from '../utils/auth';

const CreateTicketModal = ({ isOpen, onClose, onCreated, editTicket = null }) => {
    const user = getUser();
    const [formData, setFormData] = useState({
        issueTitle: editTicket?.issueTitle || '',
        location: editTicket?.location || '',
        description: editTicket?.description || '',
        imageUrl: editTicket?.imageUrl || '',
        createdBy: editTicket?.createdBy || user?.username || 'Anonymous'
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
            if (editTicket) {
                // Update existing ticket
                await axios.put(`http://localhost:8082/api/tickets/${editTicket.id}`, formData);
            } else {
                // Create new ticket
                const ticketToCreate = {
                    ...formData,
                    status: 'OPEN',
                    createdAt: new Date().toISOString()
                };
                await axios.post('http://localhost:8082/api/tickets', ticketToCreate);
            }
            onCreated();
        } catch (err) {
            console.error('Error saving ticket:', err);
            alert('Failed to save ticket. Please try again.');
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
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-[480px] rounded-2xl md:rounded-[2rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-[#262626] px-6 py-5 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-yellow-400 rounded-md flex items-center justify-center text-gray-900">
                                <Plus size={16} strokeWidth={3} />
                            </div>
                            <h2 className="text-[17px] font-bold text-white tracking-wide">
                                {editTicket ? 'Update Ticket' : 'Report New Issue'}
                            </h2>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 md:px-8 overflow-y-auto scrollbar-hide flex-grow">
                        <form id="ticket-form" onSubmit={handleSubmit} className="space-y-5">
                            {/* Issue Category & Location side by side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                        <Type className="text-yellow-500 w-3.5 h-3.5" />
                                        Issue Category
                                    </label>
                                    <input 
                                        list="issue-types" //issue category validation
                                        required
                                        value={formData.issueTitle}
                                        onChange={(e) => setFormData({...formData, issueTitle: e.target.value})}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all text-[13px] font-medium text-gray-900 placeholder:text-gray-400"
                                        placeholder="E.g. Projector Issue"
                                    />
                                    <datalist id="issue-types">
                                        {issueTypes.map(type => <option key={type} value={type} />)}
                                    </datalist>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                        <MapPin className="text-yellow-500 w-3.5 h-3.5" />
                                        Location
                                    </label>
                                    <input 
                                        required // location validation
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all text-[13px] font-medium text-gray-900 placeholder:text-gray-400"
                                        placeholder="Building & Room Number"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                    <FileText className="text-yellow-500 w-3.5 h-3.5" />
                                    Detailed Description
                                </label>
                                <textarea 
                                    required //description validation
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all text-[13px] font-medium text-gray-900 placeholder:text-gray-400 resize-none min-h-[80px]"
                                    placeholder="Describe the issue..."
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                    <ImageIcon className="text-yellow-500 w-3.5 h-3.5" />
                                    Attachment (Link or Upload)
                                </label>
                                <div className="space-y-3">
                                    <input 
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all text-[13px] font-medium text-gray-900 placeholder:text-gray-400"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                    
                                    <div className="relative group/upload">
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
                                        <div className="w-full py-2.5 bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 hover:border-yellow-400 hover:bg-yellow-50/20 transition-all">
                                            <span className="text-[13px] font-bold text-gray-600">+ Pick from Computer</span>
                                        </div>
                                    </div>
                                    {/* Image Preview */}
                                    {formData.imageUrl && (
                                        <div className="relative w-full h-24 rounded-xl overflow-hidden border border-gray-100 group mt-2">
                                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                                    className="p-1.5 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform flex items-center gap-1 font-bold text-[10px] uppercase"
                                                >
                                                    <X size={12} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-6 md:px-8 py-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-4 shrink-0">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 text-[13px] hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            form="ticket-form"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-400 text-gray-900 py-3 px-4 rounded-xl font-black text-[13px] flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-70 group"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Check size={16} />
                                    {editTicket ? 'Update Ticket' : 'Save Ticket'} 
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateTicketModal;
