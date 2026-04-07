import React from 'react';
import { Calendar, MapPin, User, Clock, CheckCircle, AlertCircle, PlayCircle, HelpCircle } from 'lucide-react';
import axios from 'axios';

const TicketCard = ({ ticket, isAdmin, onUpdate }) => {
    const statusColors = {
        OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        RESOLVED: 'bg-green-100 text-green-700 border-green-200',
        CLOSED: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    const statusIcons = {
        OPEN: <HelpCircle size={16} />,
        IN_PROGRESS: <PlayCircle size={16} />,
        RESOLVED: <CheckCircle size={16} />,
        CLOSED: <Clock size={16} />
    };

    const handleAssignToMe = async () => {
        const userName = localStorage.getItem('userName');
        try {
            await axios.put(`http://localhost:8082/api/tickets/${ticket.id}/assign?technicianId=${userName}`);
            onUpdate();
        } catch (err) {
            alert('Failed to assign ticket');
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await axios.put(`http://localhost:8082/api/tickets/${ticket.id}/status?status=${newStatus}`);
            onUpdate();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${statusColors[ticket.status]}`}>
                        {statusIcons[ticket.status]}
                        {ticket.status}
                    </span>
                    <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-yellow-600 transition-colors">
                    {ticket.issueTitle}
                </h3>
                
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="font-medium">{ticket.location}</span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {ticket.description}
                </p>

                {ticket.imageUrl && (
                    <div className="w-full h-32 rounded-xl bg-gray-50 mb-4 overflow-hidden border border-gray-100">
                        <img 
                            src={ticket.imageUrl} 
                            alt="Ticket Issue" 
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Reported By</span>
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <User size={12} className="text-gray-400" />
                        {ticket.createdBy || 'Unknown User'}
                    </span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Assigned To</span>
                    <span className="text-xs font-bold text-gray-700">
                        {ticket.assignedTo || (isAdmin ? 'Unassigned' : 'None')}
                    </span>
                </div>
            </div>

            {/* Admin Actions Overlay/Footer */}
            {isAdmin && (
                <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-2">
                    {!ticket.assignedTo && (
                        <button 
                            onClick={handleAssignToMe}
                            className="col-span-2 py-2 bg-[#262626] text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-all"
                        >
                            Assign to Me
                        </button>
                    )}
                    {ticket.status === 'OPEN' && (
                        <button 
                            onClick={() => handleStatusChange('IN_PROGRESS')}
                            className="py-2 border border-yellow-200 text-yellow-700 bg-yellow-50 rounded-lg text-xs font-bold hover:bg-yellow-100 transition-all"
                        >
                            Start Work
                        </button>
                    )}
                    {(ticket.status === 'IN_PROGRESS' || ticket.status === 'OPEN') && (
                        <button 
                            onClick={() => handleStatusChange('RESOLVED')}
                            className="py-2 border border-green-200 text-green-700 bg-green-50 rounded-lg text-xs font-bold hover:bg-green-100 transition-all"
                        >
                            Mark Resolved
                        </button>
                    )}
                    {ticket.status === 'RESOLVED' && (
                        <button 
                            onClick={() => handleStatusChange('CLOSED')}
                            className="col-span-2 py-2 border border-gray-200 text-gray-700 bg-gray-50 rounded-lg text-xs font-bold hover:bg-gray-100 transition-all"
                        >
                            Close Ticket
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TicketCard;
