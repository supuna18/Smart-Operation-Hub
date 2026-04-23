import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Filter, Search, Loader2, AlertCircle, 
    BookOpen, CheckCircle, XCircle, Clock,
    User, Calendar, Info, MessageSquare, FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ResourceService from '../../services/ResourceService';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

const ResourceApprovalHub = () => {
    const { showToast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await ResourceService.getAllBookings();
            // Sort by the created date (newest first)
            const sortedBookings = response.data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
            setBookings(sortedBookings);
            setError(null);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load booking requests.');
        } finally {
            setLoading(false);
        }
    };

    // --- MODULE B: ADMIN MASTER REPORT DOWNLOAD LOGIC (CATEGORIZED PDF) ---
    const handleExportReport = () => {
        if (bookings.length === 0) {
            showToast("No data available to export.", "error");
            return;
        }

        try {
            const doc = new jsPDF();
            const reportDate = new Date().toLocaleString();
            
            // 1. Header
            doc.setFillColor(38, 38, 38);
            doc.rect(0, 0, 210, 45, 'F');
            doc.setFontSize(28);
            doc.setTextColor(250, 204, 21);
            doc.setFont("helvetica", "bold");
            doc.text("SmartSync", 20, 25);
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "normal");
            doc.text("CATEGORIZED MASTER BOOKING REPORT", 20, 35);
            doc.text(`Generated: ${reportDate}`, 190, 35, { align: 'right' });
            
            // 2. Summary Stats Section
            doc.setFontSize(12);
            doc.setTextColor(38, 38, 38);
            doc.setFont("helvetica", "bold");
            doc.text("REPORT SUMMARY", 20, 58);
            
            autoTable(doc, {
                startY: 62,
                head: [['TOTAL', 'PENDING', 'APPROVED', 'REJECTED']],
                body: [[stats.total, stats.pending, stats.approved, stats.rejected]],
                theme: 'grid',
                styles: { halign: 'center', fontSize: 14, fontStyle: 'bold', cellPadding: 5 },
                headStyles: { fillColor: [240, 240, 240], textColor: [38, 38, 38], fontSize: 8 }
            });

            // 3. Helper to render table by category
            const renderCategoryTable = (title, data, color) => {
                if (data.length === 0) return;

                doc.setFontSize(14);
                doc.setTextColor(color[0], color[1], color[2]);
                doc.setFont("helvetica", "bold");
                doc.text(title, 20, doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 85);

                const tableRows = data.map((b, index) => [
                    index + 1,
                    b.resourceName,
                    `${b.username} (${b.userId})`,
                    `${b.startDate} to ${b.endDate}`,
                    `${b.startTime} - ${b.endTime}`,
                    b.purpose
                ]);

                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 20,
                    head: [['#', 'RESOURCE', 'USER (ID)', 'PERIOD', 'TIME', 'PURPOSE']],
                    body: tableRows,
                    headStyles: { fillColor: color, textColor: [255, 255, 255], fontSize: 9 },
                    styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
                    columnStyles: { 0: { cellWidth: 10 }, 5: { cellWidth: 'auto' } }
                });
            };

            // Grouping
            const approvedBookings = bookings.filter(b => b.status === 'APPROVED');
            const pendingBookings = bookings.filter(b => b.status === 'PENDING');
            const rejectedBookings = bookings.filter(b => b.status === 'REJECTED');

            // Render Sections
            renderCategoryTable("APPROVED BOOKINGS", approvedBookings, [16, 185, 129]); // Emerald
            renderCategoryTable("PENDING REQUESTS", pendingBookings, [234, 179, 8]); // Yellow
            renderCategoryTable("REJECTED BOOKINGS", rejectedBookings, [244, 63, 94]); // Rose

            // 4. Enhanced Footer and Signature
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                
                // Signature area on the last page
                if (i === pageCount) {
                    const finalY = doc.lastAutoTable.finalY + 30;
                    if (finalY < 260) {
                        doc.setDrawColor(200, 200, 200);
                        doc.line(130, finalY, 190, finalY);
                        doc.setFontSize(9);
                        doc.setTextColor(100, 100, 100);
                        doc.text("Signature of Administrator", 160, finalY + 5, { align: 'center' });
                    }
                }

                // Footer line
                doc.setDrawColor(240, 240, 240);
                doc.line(20, 285, 190, 285);
                
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(
                    `Page ${i} of ${pageCount} | Generated by SmartSync Management System | ${reportDate}`, 
                    doc.internal.pageSize.width / 2, 
                    290, 
                    { align: 'center' }
                );
            }

            doc.save(`Categorized_Master_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            showToast("Categorized report exported successfully!", "success");
        } catch (err) {
            console.error('Error generating PDF:', err);
            showToast("Failed to generate report.", "error");
        }
    };

    const handleUpdateStatus = async (id, status, resourceName) => {
        try {
            await ResourceService.updateBookingStatus(id, status);
            showToast(`Booking for ${resourceName} ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully!`, 'success');
            
            if (status === 'APPROVED') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FACC15', '#262626', '#ffffff']
                });
            }
            
            fetchBookings(); // Refresh the feed
        } catch (err) {
            console.error('Error updating status:', err);
            showToast('Failed to update booking status.', 'error');
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
             const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
             const matchesSearch = 
                b.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.username.toLowerCase().includes(searchQuery.toLowerCase());
             return matchesStatus && matchesSearch;
        });
    }, [bookings, filterStatus, searchQuery]);

    const stats = useMemo(() => {
        return {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'PENDING').length,
            approved: bookings.filter(b => b.status === 'APPROVED').length,
            rejected: bookings.filter(b => b.status === 'REJECTED').length
        };
    }, [bookings]);

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            
            {/* Header with Export Button Integration */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Booking <span className="text-yellow-500">Approvals</span></h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Manage student reservation queue</p>
                </div>
                
                {/* MODULE B: THE MASTER EXPORT BUTTON */}
                <button 
                    onClick={handleExportReport}
                    className="flex items-center gap-2 bg-[#262626] text-[#FACC15] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95"
                >
                    <FileText size={16} strokeWidth={3} /> Export Master Report
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Requests', value: stats.total, icon: BookOpen, color: 'text-slate-900', bg: 'bg-slate-100' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' }
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 mr-1">
                        <Filter size={16} />
                    </div>
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                                filterStatus === status 
                                    ? 'bg-[#262626] text-white shadow-lg shadow-black/20' 
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-yellow-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search by resource or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-bold text-xs text-slate-700"
                    />
                </div>
            </div>

            {/* Bookings List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-slate-50">
                            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Updating Feed...</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-center">
                            <Info className="w-8 h-8 text-slate-200 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Queue Clear</h3>
                            <p className="text-slate-400 text-sm">No booking requests found.</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking, idx) => (
                            <motion.div
                                key={booking.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-yellow-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col"
                            >
                                <div className={`h-1.5 w-full ${
                                    booking.status === 'APPROVED' ? 'bg-emerald-500' :
                                    booking.status === 'REJECTED' ? 'bg-rose-500' : 'bg-yellow-400'
                                }`} />
                                
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                    booking.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                                                    booking.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                                                    'bg-yellow-50 text-yellow-700'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-black text-slate-900 truncate pr-4">{booking.resourceName}</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <BookOpen size={20} />
                                        </div>
                                    </div>

                                    <div className="space-y-3 py-4 border-y border-slate-50">
                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                <User size={14} />
                                            </div>
                                            <span>Requested by <strong className="text-slate-900">{booking.username}</strong></span>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Calendar size={14} />
                                            </div>
                                            <span>
                                                Period: <strong className="text-slate-900">{booking.startDate} - {booking.endDate}</strong>
                                                <span className="block text-[10px] text-slate-400 font-bold tracking-tight">Time: {booking.startTime} to {booking.endTime}</span>
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-3 text-xs font-medium text-slate-600">
                                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                                                <MessageSquare size={14} />
                                            </div>
                                            <p className="italic text-slate-500">"{booking.purpose}"</p>
                                        </div>
                                    </div>
                                </div>

                                {booking.status === 'PENDING' ? (
                                    <div className="p-4 bg-slate-50 flex gap-2 border-t border-slate-100">
                                        <button 
                                            onClick={() => handleUpdateStatus(booking.id, 'APPROVED', booking.resourceName)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#262626] hover:bg-black text-[#FACC15] py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95"
                                        >
                                            <CheckCircle size={14} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(booking.id, 'REJECTED', booking.resourceName)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-rose-600 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
                                        >
                                            <XCircle size={14} /> Reject
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-50 flex items-center justify-center border-t border-slate-100">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            Processed on {new Date().toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ResourceApprovalHub;