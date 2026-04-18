import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Filter, Search, Loader2, AlertCircle, 
    Ticket, Activity, ShieldCheck, Zap, TrendingUp,
    MoreHorizontal, ArrowRight, Bell, CheckCircle, XCircle
} from 'lucide-react';
import axios from 'axios';
import TicketCard from './TicketCard';
import { getUser, isAdmin as checkIsAdmin } from '../utils/auth';

const TicketApprovalHub = ({ isEmbedded = false }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    
    const user = getUser();
    const isAdmin = checkIsAdmin();

    useEffect(() => {
        fetchTickets();
    }, [filterStatus]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            let url = 'http://localhost:8082/api/tickets';
            if (filterStatus !== 'ALL') {
                url = `http://localhost:8082/api/tickets/status/${filterStatus}`;
            }
            
            const response = await axios.get(url);
            // Sort by creation date (newest first)
            const sortedTickets = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTickets(sortedTickets);
            setError(null);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError(`Failed to load management feed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => 
            t.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.createdBy?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tickets, searchQuery]);

    const stats = useMemo(() => {
        const total = tickets.length;
        const pending = tickets.filter(t => t.status === 'OPEN').length;
        const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
        const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
        
        return {
            total,
            pending,
            inProgress,
            health: total === 0 ? 100 : Math.round((resolved / total) * 100)
        };
    }, [tickets]);

    return (
        <div className={isEmbedded ? "w-full overflow-x-hidden" : "min-h-screen bg-[#F8F9FA] pt-24 pb-12 px-6 lg:px-12 font-sans overflow-x-hidden"}>
            <div className={isEmbedded ? "w-full" : "max-w-[1600px] mx-auto"}>
                {/* Admin Header Section */}
                {!isEmbedded && (
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-black text-[#FACC15] rounded-lg text-[10px] font-black uppercase tracking-widest">
                                Admin Command Center
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Monitoring Active
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
                            Ticket Approval
                        </h1>
                        <p className="text-gray-500 font-bold max-w-md leading-relaxed">
                            Review, assign, and manage campus infrastructure incidents in real-time.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-4 w-full lg:w-auto"
                    >
                        <div className="relative flex-grow lg:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search by issue, location, or reporter..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 shadow-sm transition-all font-bold text-gray-700"
                            />
                        </div>
                    </motion.div>
                </div>
                )}

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Management List Section (70%) */}
                    <div className="flex-grow lg:w-[70%]">
                        {/* Status Filters */}
                        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                            <div className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 shadow-sm mr-2">
                                <Filter size={18} />
                            </div>
                            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                                        filterStatus === status 
                                            ? 'bg-black text-[#FACC15] shadow-lg shadow-black/20 ring-4 ring-black/5' 
                                            : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                                    }`}
                                >
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>

                        {/* Tickets List */}
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-50">
                                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-6" />
                                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Accessing Encrypted Feed...</p>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 border border-red-100 p-12 rounded-[3rem] flex flex-col items-center text-center">
                                    <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                                    <h3 className="text-2xl font-black text-red-900 mb-2 tracking-tighter">Sync Interrupted</h3>
                                    <p className="text-red-700 font-bold mb-8 max-w-sm">{error}</p>
                                    <button 
                                        onClick={fetchTickets}
                                        className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-500/20"
                                    >
                                        Re-authorize Feed
                                    </button>
                                </div>
                            ) : filteredTickets.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white border-2 border-dashed border-gray-100 p-24 rounded-[3.5rem] flex flex-col items-center text-center group"
                                >
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-yellow-50 transition-colors duration-500">
                                        <ShieldCheck className="w-10 h-10 text-gray-200 group-hover:text-emerald-500 transition-colors duration-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">Clear Registry</h3>
                                    <p className="text-gray-400 font-bold max-w-xs leading-relaxed text-sm">
                                        {searchQuery 
                                            ? `No data matches for "${searchQuery}".`
                                            : "No tickets pending review. System health is optimal."}
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                                    {filteredTickets.map((ticket) => (
                                        <TicketCard 
                                            key={ticket.id} 
                                            ticket={ticket} 
                                            isAdmin={isAdmin}
                                            onUpdate={fetchTickets}
                                            user={user}
                                        />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Admin Insights Sidebar (30%) */}
                    <div className="lg:w-[30%] space-y-8">
                        {/* Admin Stats Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#262626] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <Zap size={180} />
                            </div>
                            
                            <div className="flex justify-between items-center mb-8 relative">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Queue Metrics</h3>
                                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                                    <Activity size={12} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Pending</p>
                                    <p className="text-3xl font-black text-[#FACC15]">{stats.pending}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">In Progress</p>
                                    <p className="text-3xl font-black text-blue-400">{stats.inProgress}</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center mb-1 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Resolution Health</span>
                                    <span className="text-white">{stats.health}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stats.health}%` }}
                                        className="h-full bg-[#FACC15] rounded-full"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Audit Feed */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Recent Audit</h3>
                                <Bell size={18} className="text-gray-400" />
                            </div>

                            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-50 before:rounded-full">
                                {tickets.slice(0, 5).map((t, idx) => (
                                    <div key={t.id || idx} className="flex gap-4 relative">
                                        <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm flex-shrink-0 z-10 ${
                                            t.status === 'REJECTED' ? 'bg-red-400' :
                                            t.status === 'RESOLVED' ? 'bg-emerald-400' : 
                                            t.status === 'IN_PROGRESS' ? 'bg-amber-400' : 'bg-blue-400'
                                        }`} />
                                        <div className="min-w-0">
                                            <p className="text-[12px] font-bold text-gray-900 leading-tight">
                                                {t.assignedTo ? (
                                                    <><span className="text-gray-400">{t.assignedTo}</span> transitioned <span className="text-yellow-600">#{t.id?.slice(-4)}</span></>
                                                ) : (
                                                    <><span className="text-gray-400">{t.createdBy}</span> initiated new incident</>
                                                )}
                                            </p>
                                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1 block">
                                                {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketApprovalHub;
