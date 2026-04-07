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
        "Projector Issues",
        "Computer/IT Problems",
        "AC/Electrical Issues",
        "Furniture/Facilities",
        "Canteen/Sports Equipment",
        "Other"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:8082/api/tickets', formData);
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
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Report an Issue</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">What is the issue?</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        list="issue-types"
                                        required
                                        value={formData.issueTitle}
                                        onChange={(e) => setFormData({...formData, issueTitle: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-yellow-400 transition-all font-medium"
                                        placeholder="e.g. Projector not working"
                                    />
                                    <datalist id="issue-types">
                                        {issueTypes.map(type => <option key={type} value={type} />)}
                                    </datalist>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-yellow-400 transition-all font-medium"
                                        placeholder="e.g. Lecture Hall 01"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Detailed Description</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                                    <textarea 
                                        required
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-yellow-400 transition-all font-medium resize-none"
                                        placeholder="Please describe the issue in detail..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Image URL (Optional)</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-yellow-400 transition-all font-medium"
                                        placeholder="Paste a link to an image..."
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#262626] text-[#FACC15] py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        Submit Ticket <Send size={20} />
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
