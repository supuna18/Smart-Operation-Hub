import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Filter, Search, Loader2, AlertCircle, 
    Ticket,Activity, ShieldCheck, Zap, TrendingUp,
    MoreHorizontal, ArrowRight, Bell
} from 'lucide-react';
import axios from 'axios';
import TicketCard from './TicketCard';
import CreateTicketModal from './CreateTicketModal';

import { getUser, isAdmin as checkIsAdmin } from '../utils/auth';

const TicketDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    
    const user = getUser();
    const userRole = user?.role;
    const userName = user?.username;
    
    // Defensive admin check
    const rawAuth = localStorage.getItem('authUser');
    let isAdmin = false;
    try {
        if (rawAuth) {
            const parsed = JSON.parse(rawAuth);
            isAdmin = (parsed.role || parsed.Role || '').toLowerCase().trim() === 'admin';
        }
    } catch (e) {}

    useEffect(() => {
        fetchTickets();
    }, [filterStatus]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            let url = 'http://localhost:8082/api/tickets';
            
            if (!isAdmin && userName) {
                // Normal users ALWAYS fetch only their own tickets
                url = `http://localhost:8082/api/tickets/user/${userName}`;
            } else if (isAdmin && filterStatus !== 'ALL') {
                // Admins can use the backend status filter
                url = `http://localhost:8082/api/tickets/status/${filterStatus}`;
            }
            
            const response = await axios.get(url);
            let resultData = response.data;

            // If a normal user is filtering by status, filter the data on the client side
            if (!isAdmin && filterStatus !== 'ALL') {
                resultData = resultData.filter(t => t.status === filterStatus);
            }

            // Sort by creation date (newest first)
            const sortedTickets = resultData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTickets(sortedTickets);
            setError(null);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError(`Failed to load tickets: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => 
            t.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tickets, searchQuery]);

    const stats = useMemo(() => {
        const total = tickets.length;
        const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
        const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
        const open = tickets.filter(t => t.status === 'OPEN').length;
        
        return {
            health: total === 0 ? 100 : Math.round((resolved / total) * 100),
            open,
            inProgress,
            resolved
        };
    }, [tickets]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-12 px-6 lg:px-12 font-sans overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto">
                {/* Upper Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-yellow-400 text-[#262626] rounded-lg text-[10px] font-black uppercase tracking-widest">
                                Live System
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Operational
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
                            Incident Hub
                        </h1>
                        <p className="text-gray-500 font-bold max-w-md leading-relaxed">
                            {isAdmin 
                                ? "Monitor and manage campus infrastructure health and maintenance reports." 
                                : "Report technical issues and track the status of your reported tickets."}
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-4 w-full lg:w-auto"
                    >
                        <div className="relative flex-grow lg:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search by issue or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 shadow-sm transition-all font-bold text-gray-700"
                            />
                        </div>
                        
                        {!isAdmin && (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#262626] text-[#FACC15] px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:shadow-2xl hover:shadow-yellow-400/20 active:scale-95 transition-all whitespace-nowrap"
                            >
                                <Plus size={20} />
                                New Ticket
                            </button>
                        )}
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Main Feed Section (70%) */}
                    <div className="flex-grow lg:w-[70%]">
                        {/* Status Filters */}
                        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                            <div className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 shadow-sm mr-2">
                                <Filter size={18} />
                            </div>
                            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                                        filterStatus === status 
                                            ? 'bg-yellow-400 text-[#262626] shadow-lg shadow-yellow-400/20 ring-4 ring-yellow-400/10' 
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
                                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Synchronizing Tickets...</p>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 border border-red-100 p-12 rounded-[3rem] flex flex-col items-center text-center">
                                    <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                                    <h3 className="text-2xl font-black text-red-900 mb-2 tracking-tighter">Sync Failed</h3>
                                    <p className="text-red-700 font-bold mb-8 max-w-sm">{error}</p>
                                    <button 
                                        onClick={fetchTickets}
                                        className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-500/20"
                                    >
                                        Reconnect to Hub
                                    </button>
                                </div>
                            ) : filteredTickets.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white border-2 border-dashed border-gray-100 p-24 rounded-[3.5rem] flex flex-col items-center text-center group"
                                >
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-yellow-50 transition-colors duration-500">
                                        <Ticket className="w-10 h-10 text-gray-200 group-hover:text-yellow-400 transition-colors duration-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">Quiet on the Hub</h3>
                                    <p className="text-gray-400 font-bold max-w-xs mb-10 leading-relaxed text-sm">
                                        {searchQuery 
                                            ? `No results found for "${searchQuery}". Try a different term.`
                                            : "Everything seems operational. No incidents to display at this moment."}
                                    </p>
                                    {!isAdmin && !searchQuery && (
                                        <button 
                                            onClick={() => setIsModalOpen(true)}
                                            className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-2xl font-black hover:shadow-2xl hover:shadow-yellow-400/30 transition-all"
                                        >
                                            Create New Ticket
                                        </button>
                                    )}
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

                    {/* Side Sidebar (30%) */}
                    <div className="lg:w-[30%] space-y-8">
                        {/* Global Health Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#262626] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <Zap size={180} />
                            </div>
                            
                            <div className="flex justify-between items-center mb-8 relative">
                                <h3 className="text-xl font-black uppercase tracking-widest text-gray-400">Global Health</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Real-time</span>
                                </div>
                            </div>

                            <div className="mb-10 relative">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-6xl font-black tracking-tighter">{stats.health}%</span>
                                    <span className="text-yellow-400 font-black flex items-center gap-1 text-sm bg-yellow-400/10 px-2 py-1 rounded-lg">
                                        <TrendingUp size={14} /> +2.4%
                                    </span>
                                </div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Incident Resolution Rate</p>
                            </div>

                            <div className="space-y-4 relative">
                                <HealthBar label="Lab Facilities" value={98.8} color="bg-emerald-400" />
                                <HealthBar label="Classroom Tech" value={94.2} color="bg-yellow-400" />
                                <HealthBar label="Campus Safety" value={stats.health} color="bg-blue-400" />
                            </div>
                        </motion.div>

                        {/* Recent Activity Feed */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Activity Feed</h3>
                                <Bell size={18} className="text-gray-400" />
                            </div>

                            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-50 before:rounded-full">
                                {tickets.slice(0, 4).map((t, idx) => (
                                    <div key={t.id || idx} className="flex gap-4 relative">
                                        <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm flex-shrink-0 z-10 ${
                                            t.status === 'RESOLVED' ? 'bg-emerald-400' : 
                                            t.status === 'IN_PROGRESS' ? 'bg-amber-400' : 'bg-blue-400'
                                        }`} />
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-bold text-gray-900 leading-snug">
                                                {t.assignedTo ? (
                                                    <><span className="text-gray-400">{t.assignedTo}</span> updated <span className="text-yellow-600">#{t.id?.slice(-4)}</span></>
                                                ) : (
                                                    <><span className="text-gray-400">{t.createdBy}</span> reported a new issue</>
                                                )}
                                            </p>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">
                                                {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-10 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-yellow-50 hover:text-yellow-700 transition-all flex items-center justify-center gap-2">
                                View Full Audit Log <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Ticket Modal */}
            {isModalOpen && (
                <CreateTicketModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onCreated={() => {
                        fetchTickets();
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

const HealthBar = ({ label, value, color }) => (
    <div className="group">
        <div className="flex justify-between items-center mb-1.5 px-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
            <span className="text-[11px] font-black text-gray-300">{value}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full rounded-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
            />
        </div>
    </div>
);

export default TicketDashboard;

