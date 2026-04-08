import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, Loader2, AlertCircle, Ticket } from 'lucide-react';
import axios from 'axios';
import TicketCard from './TicketCard';
import CreateTicketModal from './CreateTicketModal';

const TicketDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');
    
    const userRole = localStorage.getItem('userRole'); // Admin, Student, Lecturer
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchTickets();
    }, [filterStatus]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            let url = 'http://localhost:8082/api/tickets';
            if (filterStatus !== 'ALL') {
                url = `http://localhost:8082/api/tickets/status/${filterStatus}`;
            } else if (userRole === 'Admin') {
                url = 'http://localhost:8082/api/tickets';
            } else if (userId) {
                url = `http://localhost:8082/api/tickets/user/${userId}`;
            } else {
                // For guests or unknown roles, maybe just show nothing or a specific message
                setTickets([]);
                setLoading(false);
                return;
            }
            
            const response = await axios.get(url);
            setTickets(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError(`Failed to load tickets: ${err.message}. Please try again later.`);
        } finally {
            setLoading(false);
        }
    };

    const handleTicketCreated = () => {
        fetchTickets();
        setIsModalOpen(false);
    };

    const handleStatusUpdate = () => {
        fetchTickets();
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Incident Tracking</h1>
                        <p className="text-gray-500 font-medium">
                            {userRole === 'Admin' 
                                ? 'Manage and resolve campus maintenance issues' 
                                : 'Report and track your maintenance requests'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative flex-grow md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Search tickets..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                            />
                        </div>
                        
                        {(userRole === 'Student' || userRole === 'Lecturer') && (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#FACC15] text-[#262626] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-500/20 transition-all active:scale-95"
                            >
                                <Plus size={20} />
                                New Ticket
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <Filter size={18} className="text-gray-400 mr-2 shrink-0" />
                    {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                filterStatus === status 
                                    ? 'bg-[#262626] text-white shadow-md' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                            }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium italic">Loading tickets...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 p-8 rounded-2xl flex flex-col items-center text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                        <h3 className="text-xl font-bold text-red-900 mb-2">Error</h3>
                        <p className="text-red-700 font-medium mb-6">{error}</p>
                        <button 
                            onClick={fetchTickets}
                            className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="bg-white border border-gray-100 p-20 rounded-3xl flex flex-col items-center text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Ticket className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No tickets found</h3>
                        <p className="text-gray-500 max-w-sm mb-8">
                            {filterStatus === 'ALL' 
                                ? "There are no tickets to display yet. " + (userRole !== 'Admin' ? "Create one to get started!" : "")
                                : `No tickets with status "${filterStatus}" were found.`}
                        </p>
                        {(userRole === 'Student' || userRole === 'Lecturer') && filterStatus === 'ALL' && (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#FACC15] text-[#262626] px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
                            >
                                Create First Ticket
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket) => (
                            <TicketCard 
                                key={ticket.id} 
                                ticket={ticket} 
                                isAdmin={userRole === 'Admin'}
                                onUpdate={handleStatusUpdate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {isModalOpen && (
                <CreateTicketModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onCreated={handleTicketCreated}
                />
            )}
        </div>
    );
};

//end o

export default TicketDashboard;
