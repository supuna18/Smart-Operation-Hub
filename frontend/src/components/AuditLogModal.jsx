import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity } from 'lucide-react';

const AuditLogModal = ({ isOpen, onClose, tickets }) => {
    // Sort all tickets by createdAt descending
    const sortedActivity = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <AnimatePresence>
            {isOpen && (
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
                        className="bg-white w-full max-w-[600px] rounded-2xl md:rounded-[2rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-[#262626] px-6 py-5 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-yellow-400 rounded-md flex items-center justify-center text-gray-900">
                                    <Activity size={16} strokeWidth={3} />
                                </div>
                                <h2 className="text-[17px] font-bold text-white tracking-wide">
                                    Full Audit Log
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
                            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 before:rounded-full">
                                {sortedActivity.length > 0 ? sortedActivity.map((t, idx) => (
                                    <div key={t.id || idx} className="flex gap-4 relative">
                                        <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm flex-shrink-0 z-10 ${
                                            t.status === 'RESOLVED' || t.status === 'CLOSED' ? 'bg-emerald-400' : 
                                            t.status === 'IN_PROGRESS' ? 'bg-amber-400' : 
                                            t.status === 'REJECTED' ? 'bg-red-400' : 'bg-blue-400'
                                        }`} />
                                        <div className="min-w-0 pb-2">
                                            <p className="text-[14px] font-bold text-gray-900 leading-snug">
                                                {t.assignedTo ? (
                                                    <><span className="text-gray-500">{t.assignedTo}</span> updated <span className="text-yellow-600">#{t.id?.slice(-4)}</span></>
                                                ) : (
                                                    <><span className="text-gray-500">{t.createdBy}</span> reported a new issue <span className="text-yellow-600">#{t.id?.slice(-4)}</span></>
                                                )}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1 mb-2 line-clamp-2">
                                                "{t.issueTitle}"
                                            </p>
                                            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest block">
                                                {new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-gray-400 font-bold py-10">
                                        No activity found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 md:px-8 py-4 bg-white border-t border-gray-100 shrink-0">
                            <button 
                                onClick={onClose}
                                className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-700 text-[13px] transition-colors"
                            >
                                Close Audit Log
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuditLogModal;
