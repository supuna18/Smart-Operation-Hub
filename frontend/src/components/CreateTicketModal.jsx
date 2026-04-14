import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, Type, FileText, ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';

const CreateTicketModal = ({ isOpen, onClose, onCreated }) => {
    const [formData, setFormData] = useState({
        issueTitle: '',
        location: '',
        description: '',
        imageUrl: '',
        createdBy: localStorage.getItem('userName') || 'Anonymous'
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
                    className="bg-white/90 backdrop-blur-xl w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-white/20"
                >
                    <div className="p-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Report an Issue</h2>
                                <p className="text-gray-500 font-medium">Help us keep the campus in top shape</p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-3 bg-gray-100/50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl transition-all active:scale-90"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Issue Category</label>
                                    <div className="relative group">
                                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
                                        <input 
                                            list="issue-types"
                                            required
                                            value={formData.issueTitle}
                                            onChange={(e) => setFormData({...formData, issueTitle: e.target.value})}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-bold text-gray-700"
                                            placeholder="Select or type..."
                                        />
                                        <datalist id="issue-types">
                                            {issueTypes.map(type => <option key={type} value={type} />)}
                                        </datalist>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
                                        <input 
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-bold text-gray-700"
                                            placeholder="e.g. Lab 03, Block B"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Detailed Description</label>
                                <div className="relative group">
                                    <FileText className="absolute left-4 top-5 text-gray-400 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
                                    <textarea 
                                        required
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-bold text-gray-700 resize-none"
                                        placeholder="Describe the problem, e.g., 'The lamp is flickering then went black'..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 items-end">
                                <div className="flex-grow w-full">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2 px-1">Attachment URL</label>
                                    <div className="relative group">
                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
                                        <input 
                                            type="url"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all font-bold text-gray-700"
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                    </div>
                                </div>
                                {formData.imageUrl && (
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-yellow-400/30 shrink-0">
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#262626] text-[#FACC15] py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-yellow-400/20 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all disabled:opacity-70 mt-6 group"
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
    );
};

export default CreateTicketModal;
