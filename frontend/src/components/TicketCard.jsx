import React, { useState } from 'react';
import { 
    Calendar, MapPin, User, Clock, CheckCircle, 
    AlertCircle, PlayCircle, HelpCircle, Trash2, 
    ChevronRight, MessageSquare, Shield, ExternalLink, XCircle, Loader2
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const TicketCard = ({ ticket, isAdmin, onUpdate, user }) => {
    const [isResolving, setIsResolving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [rejectionNotes, setRejectionNotes] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const statusConfig = {
        OPEN: { 
            color: 'text-blue-600 bg-blue-50 border-blue-100', 
            icon: <HelpCircle size={14} />,
            label: 'Open'
        },
        IN_PROGRESS: { 
            color: 'text-amber-600 bg-amber-50 border-amber-100', 
            icon: <PlayCircle size={14} />,
            label: 'In Progress'
        },
        RESOLVED: { 
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100', 
            icon: <CheckCircle size={14} />,
            label: 'Resolved'
        },
        CLOSED: { 
            color: 'text-gray-600 bg-gray-50 border-gray-100', 
            icon: <Clock size={14} />,
            label: 'Closed'
        },
        REJECTED: {
            color: 'text-red-600 bg-red-50 border-red-100',
            icon: <XCircle size={14} />,
            label: 'Rejected'
        }
    };

    const handleAssignToMe = async () => {
        const userName = user?.username || 'System Admin';
        try {
            await axios.put(`http://localhost:8082/api/tickets/${ticket.id}/assign?technicianId=${encodeURIComponent(userName)}`);
            onUpdate();
        } catch (err) {
            console.error('Failed to assign ticket', err);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (newStatus === 'RESOLVED' && !isResolving) {
            setIsResolving(true);
            return;
        }

        try {
            let url = `http://localhost:8082/api/tickets/${ticket.id}/status?status=${newStatus}`;
            const notes = newStatus === 'REJECTED' ? rejectionNotes : resolutionNotes;
            if (notes) {
                url += `&notes=${encodeURIComponent(notes)}`;
            }
            await axios.put(url);
            setIsResolving(false);
            onUpdate();
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:8082/api/tickets/${ticket.id}`);
            onUpdate();
        } catch (err) {
            console.error('Failed to delete ticket', err);
            setIsDeleting(false);
        }
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden"
        >
            {/* Top Info Bar */}
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border ${statusConfig[ticket.status].color}`}>
                        {statusConfig[ticket.status].icon}
                        {statusConfig[ticket.status].label}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 font-mono tracking-tighter">
                        #SYNC-{ticket.id?.slice(-4).toUpperCase() || 'NEW'}
                    </span>
                </div>
                <span className="text-gray-400 text-[11px] font-bold flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                    <Calendar size={12} />
                    {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* Content Section */}
            <div className="flex gap-5">
                {ticket.imageUrl && (
                    <div className="hidden sm:block w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shrink-0 self-start">
                        <img 
                            src={ticket.imageUrl} 
                            alt="" 
                            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                )}
                <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-black text-gray-900 mb-1 truncate leading-tight group-hover:text-yellow-600 transition-colors">
                        {ticket.issueTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 font-bold text-xs mb-3">
                        <MapPin size={12} className="text-yellow-500" />
                        <span className="truncate">{ticket.location}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 italic font-medium">
                        "{ticket.description}"
                    </p>
                </div>
            </div>

            {/* Resolution Display */}
            {ticket.resolutionNotes && (
                <div className={`mt-4 p-4 ${ticket.status === 'REJECTED' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'} rounded-2xl border relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        {ticket.status === 'REJECTED' ? <XCircle size={40} className="text-red-600" /> : <CheckCircle size={40} className="text-emerald-600" />}
                    </div>
                    <div className={`flex items-center gap-2 mb-1 ${ticket.status === 'REJECTED' ? 'text-red-700' : 'text-emerald-700'} font-black text-[10px] uppercase tracking-widest`}>
                        <MessageSquare size={12} />
                        {ticket.status === 'REJECTED' ? 'Rejection Notes' : 'Resolution Notes'}
                    </div>
                    <p className={`${ticket.status === 'REJECTED' ? 'text-red-800' : 'text-emerald-800'} text-xs font-bold leading-relaxed`}>
                        {ticket.resolutionNotes}
                    </p>
                </div>
            )}

            {/* Meta Footer */}
            <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-0.5">Reporter</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 text-[10px] font-black">
                                {ticket.createdBy?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-black text-gray-700">{ticket.createdBy}</span>
                        </div>
                    </div>
                    {ticket.assignedTo && (
                        <div className="flex flex-col border-l border-gray-100 pl-4">
                            <span className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-0.5">Technician</span>
                            <div className="flex items-center gap-1.5">
                                <Shield size={10} className="text-blue-500" />
                                <span className="text-xs font-black text-gray-700">{ticket.assignedTo}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {(isAdmin || ticket.createdBy === user?.username) && (
                        <button 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                        >
                            {isDeleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Admin Action Panel */}
            {isAdmin && !isResolving && !isRejecting && (
                <div className="mt-5 grid grid-cols-1 gap-2">
                    {(!ticket.assignedTo && ticket.status !== 'REJECTED') ? (
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={handleAssignToMe}
                                className="py-3 bg-[#262626] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                            >
                                Accept <CheckCircle size={14} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button 
                                onClick={() => setIsRejecting(true)}
                                className="py-3 bg-white text-red-500 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2 group"
                            >
                                Reject <XCircle size={14} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    ) : ticket.status !== 'REJECTED' && ticket.status !== 'CLOSED' && (
                        <div className="grid grid-cols-2 gap-2">
                            {ticket.status === 'OPEN' && (
                                <button 
                                    onClick={() => handleStatusChange('IN_PROGRESS')}
                                    className="py-2.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                                >
                                    Start Work
                                </button>
                            )}
                            {(ticket.status === 'IN_PROGRESS' || ticket.status === 'OPEN') && (
                                <button 
                                    onClick={() => setIsResolving(true)}
                                    className="py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                                >
                                    Resolve
                                </button>
                            )}
                            {ticket.status === 'RESOLVED' && (
                                <button 
                                    onClick={() => handleStatusChange('CLOSED')}
                                    className="col-span-2 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                >
                                    Archive Ticket
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Rejection Modal/Overlay inside Card */}
            <AnimatePresence>
                {isRejecting && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-black text-red-600 uppercase tracking-wider">Reject Ticket</h4>
                            <button onClick={() => setIsRejecting(false)} className="text-gray-400 hover:text-gray-900">
                                <XCircle size={16} />
                            </button>
                        </div>
                        <textarea 
                            autoFocus
                            placeholder="Reason for rejection..."
                            className="flex-grow w-full bg-red-50/30 border border-red-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-red-400 transition-all resize-none shadow-inner"
                            value={rejectionNotes}
                            onChange={(e) => setRejectionNotes(e.target.value)}
                        />
                        <button 
                            onClick={() => {
                                handleStatusChange('REJECTED');
                                setIsRejecting(false);
                            }}
                            disabled={!rejectionNotes.trim()}
                            className="mt-4 w-full py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-xs disabled:opacity-50 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/20"
                        >
                            Confirm Rejection
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Resolution Modal/Overlay inside Card */}
            <AnimatePresence>
                {isResolving && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Final Resolution</h4>
                            <button onClick={() => setIsResolving(false)} className="text-gray-400 hover:text-gray-900">
                                <XCircle size={16} />
                            </button>
                        </div>
                        <textarea 
                            autoFocus
                            placeholder="Describe how the issue was solved..."
                            className="flex-grow w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-emerald-400 transition-all resize-none shadow-inner"
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                        />
                        <button 
                            onClick={() => handleStatusChange('RESOLVED')}
                            disabled={!resolutionNotes.trim()}
                            className="mt-4 w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-xs disabled:opacity-50 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/20"
                        >
                            Complete Resolution
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TicketCard;

