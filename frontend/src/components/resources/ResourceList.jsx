import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import {
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiPlus,
    FiFilter,
    FiUsers,
    FiMapPin,
    FiCalendar,
    FiBox,
    FiClock,
    FiDownload
} from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';
import { isAdmin, getUser } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { ResourceCardSkeleton } from '../common/Skeleton';
import ResourceBookingModal from './ResourceBookingModal'; 

// Categories defaults
import lectureHallImg from '../../assets/reso1.jpeg';
import labImg from '../../assets/labR.jpeg';
import equipmentImg from '../../assets/equipmentR.jpeg';
import studyAreaImg from '../../assets/studyareaR.jpeg';
import loungeImg from '../../assets/loungeR.jpeg';
import sportsImg from '../../assets/sportfacilityR.jpeg';
import otherImg from '../../assets/otherR.jpeg';

const ResourceList = ({ onEdit, onAdd }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userBookings, setUserBookings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    
    const admin = isAdmin();
    const user = React.useMemo(() => getUser(), []);

    useEffect(() => {
        fetchResources();
        if (!admin && user) { fetchUserBookings(); }
    }, [admin]);

    const fetchUserBookings = async () => {
        try {
            const userId = user.id || user.email;
            if (userId) {
                const response = await ResourceService.getMyBookings(userId);
                setUserBookings(response.data);
            }
        } catch (error) { console.error(error); }
    };

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await ResourceService.getAllResources();
            setResources(response.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleBook = (resource) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    const getBookingForResource = (resourceId) => {
        return userBookings.find(b => b.resourceId === resourceId);
    };

    const getTypeDefaultImage = (type) => {
        const defaults = {
            'Lecture Hall': lectureHallImg, 'Lab': labImg, 'Laboratory': labImg,
            'Equipment': equipmentImg, 'Study Area': studyAreaImg, 'Other': otherImg
        };
        return defaults[type] || otherImg;
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this resource?')) {
            try {
                await ResourceService.deleteResource(id);
                showToast('Resource removed successfully!', 'success');
                fetchResources();
            } catch (error) {
                showToast('Failed to delete resource.', 'error');
            }
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text('SmartSync Campus Resource Registry', 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Total Assets: ${resources.length}`, 14, 35);
        
        doc.setDrawColor(250, 204, 21);
        doc.setLineWidth(1);
        doc.line(14, 40, 196, 40);

        const tableData = resources.map((r, index) => [
            index + 1, r.name, r.type, r.capacity, r.location, r.status, r.availabilityWindows || 'Not Specified'
        ]);

        autoTable(doc, {
            startY: 45,
            head: [['#', 'Resource Name', 'Category', 'Capacity', 'Location', 'Status', 'Availability']],
            body: tableData,
            headStyles: { fillColor: [38, 38, 38], textColor: [250, 204, 21], fontSize: 10, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            margin: { top: 45 },
            styles: { fontSize: 9, cellPadding: 3 },
        });

        doc.save(`SmartSync_Resource_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        showToast('Resource report generated successfully!', 'success');
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="p-8 bg-[#262626] border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #FACC15 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-yellow-400 rounded-full" />
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            Assets & <span className="text-yellow-400">Facilities</span>
                        </h2>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">Manage campus resources from a single interface.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 relative z-10 w-full md:w-auto">
                    {!admin && (
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                            <FiBox size={18} />
                            My Reservation Details
                        </button>
                    )}

                    {admin && (
                        <div className="flex gap-3">
                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl transition-all font-bold active:scale-95 shadow-lg backdrop-blur-md"
                            >
                                <FiDownload size={18} />
                                <span className="hidden sm:inline">Download Report</span>
                            </button>
                            <button
                                onClick={onAdd}
                                className="flex items-center justify-center gap-2 bg-[#FACC15] hover:bg-yellow-400 text-slate-900 px-7 py-3 rounded-xl transition-all font-bold active:scale-95 shadow-lg"
                            >
                                <FiPlus size={18} className="stroke-[3px]" />
                                New Resource
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Resources Grid */}
            <div className="p-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <ResourceCardSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resources.map((resource) => {
                            const booking = getBookingForResource(resource.id);
                            return (
                                <div key={resource.id} className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col relative">
                                    <div className="h-48 w-full relative overflow-hidden">
                                        <img src={resource.imageUrl || getTypeDefaultImage(resource.type)} alt={resource.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] font-black text-yellow-400 uppercase tracking-widest">
                                            {resource.type}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1">
                                        <h3 className="text-xl font-black text-slate-900 mb-4">{resource.name}</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                                                <FiUsers className="text-yellow-500" size={14} />
                                                <span className="text-[10px] font-bold text-slate-600">{resource.capacity} Seats</span>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                                                <FiMapPin className="text-yellow-500" size={14} />
                                                <span className="text-[10px] font-bold text-slate-600 truncate">{resource.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="px-6 pb-6 pt-2 border-t border-slate-50 mt-auto">
                                        <div className="flex gap-2">
                                            {admin ? (
                                                <>
                                                    <button
                                                        onClick={() => onEdit(resource)}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-600 py-3 rounded-xl font-bold text-xs transition-colors border border-yellow-400/20"
                                                    >
                                                        <FiEdit2 size={14} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(resource.id)}
                                                        className="bg-rose-50 hover:bg-rose-100 text-rose-500 p-3 rounded-xl transition-colors border border-rose-200/50"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => handleBook(resource)}
                                                    className="w-full flex items-center justify-center gap-2 bg-[#262626] hover:bg-black text-[#FACC15] py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 disabled:opacity-50"
                                                    disabled={resource.status !== 'ACTIVE'}
                                                >
                                                    <FiCalendar size={14} /> Book Now
                                                </button>
                                            )}
                                        </div>

                                        {booking && !admin && (
                                            <div className={`mt-4 w-full py-2 rounded-xl text-center text-[9px] font-black uppercase tracking-widest border ${
                                                booking.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                booking.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                            }`}>
                                                STATUS: {booking.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {isModalOpen && (
                    <ResourceBookingModal 
                        resource={selectedResource} 
                        user={user} 
                        onClose={() => setIsModalOpen(false)} 
                        onSuccess={fetchUserBookings} 
                    />
                )}
            </div>
        </div>
    );
};

export default ResourceList;