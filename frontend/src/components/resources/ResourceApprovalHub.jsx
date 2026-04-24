import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  Search,
  Loader2,
  AlertCircle,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Info,
  MessageSquare,
  FileText
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
  const [rejectionModal, setRejectionModal] = useState({
    show: false,
    booking: null,
    reason: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const response = await ResourceService.getAllBookings();
      console.log('ResourceApprovalHub: Fetched bookings:', response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      // Sort newest first with null safety
      const sortedBookings = [...data].sort((a, b) => {
        const dateA = a.bookingDate
          ? new Date(a.bookingDate)
          : new Date(0);

        const dateB = b.bookingDate
          ? new Date(b.bookingDate)
          : new Date(0);

        return dateB - dateA;
      });

      setBookings(sortedBookings);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);

      if (err.response?.status === 403) {
        setError('ACCESS_DENIED');
      } else {
        setError('Failed to load booking requests.');
      }
    } finally {
      setLoading(false);
    }
  };

  // MASTER PDF EXPORT REPORT
  const handleExportReport = () => {
    if (bookings.length === 0) {
      showToast('No data available to export.', 'error');
      return;
    }

    try {
      const doc = new jsPDF();
      const reportDate = new Date().toLocaleString();

      // Header
      doc.setFillColor(38, 38, 38);
      doc.rect(0, 0, 210, 45, 'F');

      doc.setFontSize(28);
      doc.setTextColor(250, 204, 21);
      doc.setFont('helvetica', 'bold');
      doc.text('SmartSync', 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'CATEGORIZED MASTER BOOKING REPORT',
        20,
        35
      );

      doc.text(
        `Generated: ${reportDate}`,
        190,
        35,
        { align: 'right' }
      );

      // Summary
      doc.setFontSize(12);
      doc.setTextColor(38, 38, 38);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORT SUMMARY', 20, 58);

      autoTable(doc, {
        startY: 62,
        head: [['TOTAL', 'PENDING', 'APPROVED', 'REJECTED']],
        body: [[
          stats.total,
          stats.pending,
          stats.approved,
          stats.rejected
        ]],
        theme: 'grid',
        styles: {
          halign: 'center',
          fontSize: 14,
          fontStyle: 'bold',
          cellPadding: 5
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [38, 38, 38],
          fontSize: 8
        }
      });

      const renderCategoryTable = (title, data, color) => {
        if (data.length === 0) return;

        doc.setFontSize(14);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont('helvetica', 'bold');

        doc.text(
          title,
          20,
          doc.lastAutoTable
            ? doc.lastAutoTable.finalY + 15
            : 85
        );

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
          head: [[
            '#',
            'RESOURCE',
            'USER (ID)',
            'PERIOD',
            'TIME',
            'PURPOSE'
          ]],
          body: tableRows,
          headStyles: {
            fillColor: color,
            textColor: [255, 255, 255],
            fontSize: 9
          },
          styles: {
            fontSize: 8,
            cellPadding: 3,
            overflow: 'linebreak'
          },
          columnStyles: {
            0: { cellWidth: 10 },
            5: { cellWidth: 'auto' }
          }
        });
      };

      const approvedBookings = bookings.filter(
        (b) => b.status === 'APPROVED'
      );

      const pendingBookings = bookings.filter(
        (b) => b.status === 'PENDING'
      );

      const rejectedBookings = bookings.filter(
        (b) => b.status === 'REJECTED'
      );

      renderCategoryTable(
        'APPROVED BOOKINGS',
        approvedBookings,
        [16, 185, 129]
      );

      renderCategoryTable(
        'PENDING REQUESTS',
        pendingBookings,
        [234, 179, 8]
      );

      renderCategoryTable(
        'REJECTED BOOKINGS',
        rejectedBookings,
        [244, 63, 94]
      );

      const pageCount =
        doc.internal.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        if (i === pageCount) {
          const finalY =
            doc.lastAutoTable.finalY + 30;

          if (finalY < 260) {
            doc.setDrawColor(200, 200, 200);
            doc.line(130, finalY, 190, finalY);

            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);

            doc.text(
              'Signature of Administrator',
              160,
              finalY + 5,
              { align: 'center' }
            );
          }
        }

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

      doc.save(
        `Categorized_Master_Report_${
          new Date().toISOString().split('T')[0]
        }.pdf`
      );

      showToast(
        'Categorized report exported successfully!',
        'success'
      );
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast(
        'Failed to generate report.',
        'error'
      );
    }
  };

  const handleUpdateStatus = async (
    id,
    status,
    resourceName,
    reason = ''
  ) => {
    try {
      await ResourceService.updateBookingStatus(
        id,
        status,
        reason
      );

      showToast(
        `Booking for ${resourceName} ${
          status === 'APPROVED'
            ? 'approved'
            : 'rejected'
        } successfully!`,
        'success'
      );

      if (status === 'APPROVED') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FACC15', '#262626', '#ffffff']
        });
      }

      setRejectionModal({
        show: false,
        booking: null,
        reason: ''
      });

      fetchBookings();
    } catch (err) {
      console.error(
        'Error updating status:',
        err
      );

      showToast(
        'Failed to update booking status.',
        'error'
      );
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus =
        filterStatus === 'ALL' ||
        b.status === filterStatus;

      const matchesSearch =
        (b.resourceName || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (b.username || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (b.userId &&
          b.userId
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ));

      return matchesStatus && matchesSearch;
    });
  }, [bookings, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(
        (b) => b.status === 'PENDING'
      ).length,
      approved: bookings.filter(
        (b) => b.status === 'APPROVED'
      ).length,
      rejected: bookings.filter(
        (b) => b.status === 'REJECTED'
      ).length
    };
  }, [bookings]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Export Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Booking <span className="text-yellow-500">Requests</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            Manage and sync campus facility utilization
          </p>
        </div>
        
        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-6 py-3 bg-[#262626] text-[#FACC15] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
        >
          <FileText size={16} />
          Export Master Report
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', value: stats.total, color: 'text-slate-900', bg: 'bg-white', icon: BookOpen },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50/50', icon: Clock },
          { label: 'Approved', value: stats.approved, color: 'text-emerald-600', bg: 'bg-emerald-50/50', icon: CheckCircle },
          { label: 'Rejected', value: stats.rejected, color: 'text-rose-600', bg: 'bg-rose-50/50', icon: XCircle }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`${stat.bg} p-6 rounded-[2rem] border border-white shadow-sm flex items-center justify-between group hover:shadow-md transition-all`}
          >
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bg.replace('/50', '')} border border-white shadow-inner group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} className={stat.color} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto w-full lg:w-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-[#262626] text-[#FACC15] shadow-lg'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-yellow-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by resource or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-400/5 focus:border-yellow-400/50 shadow-sm transition-all font-bold text-slate-700 text-sm"
          />
        </div>
      </div>

      {/* Main List */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem]"
            >
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
              <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Matrix...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-50 border border-rose-100 p-12 rounded-[3rem] flex flex-col items-center text-center"
            >
              <AlertCircle className="w-16 h-16 text-rose-500 mb-6" />
              <h3 className="text-2xl font-black text-rose-900 mb-2 tracking-tight">Access Interrupted</h3>
              <p className="text-rose-700 font-medium mb-8 max-w-sm">
                {error === 'ACCESS_DENIED'
                  ? 'Your current administrative session has expired or lacks sufficient clearance.'
                  : error}
              </p>
              <button
                onClick={fetchBookings}
                className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 transition-all shadow-xl shadow-rose-500/20 active:scale-95"
              >
                Re-Authorize Sync
              </button>
            </motion.div>
          ) : filteredBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border-2 border-dashed border-slate-100 p-20 rounded-[3rem] flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Registry Empty</h3>
              <p className="text-slate-400 font-medium max-w-xs text-sm">
                No active booking requests match your current filters or search criteria.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-yellow-400/30 transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Subtle status indicator */}
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 ${
                    booking.status === 'APPROVED' ? 'bg-emerald-500' :
                    booking.status === 'REJECTED' ? 'bg-rose-500' : 'bg-yellow-500'
                  }`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-[#FACC15] shadow-lg">
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-lg leading-tight group-hover:text-yellow-600 transition-colors">
                            {booking.resourceName}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <User size={12} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
                              {booking.username || 'System User'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${
                        booking.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        booking.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-yellow-50 text-yellow-600 border-yellow-100 animate-pulse'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <Calendar size={16} className="text-yellow-500" />
                        <div className="text-[11px] font-bold text-slate-600">
                          {booking.startDate} — {booking.endDate}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <Clock size={16} className="text-yellow-500" />
                        <div className="text-[11px] font-bold text-slate-600">
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 group-hover:bg-white transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare size={14} className="text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                          "{booking.purpose || 'No purpose specified'}"
                        </p>
                      </div>
                    </div>

                    {booking.status === 'PENDING' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'APPROVED', booking.resourceName)}
                          className="flex-1 py-3.5 bg-slate-900 text-[#FACC15] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectionModal({ show: true, booking, reason: '' })}
                          className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all active:scale-95"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}

                    {booking.status === 'REJECTED' && booking.rejectionReason && (
                      <div className="mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em] block mb-1">Rejection Reason</span>
                        <p className="text-[11px] text-rose-700 font-medium italic leading-relaxed">
                          "{booking.rejectionReason}"
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Rejection Modal */}
      <AnimatePresence>
        {rejectionModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectionModal({ show: false, booking: null, reason: '' })}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Decline Request</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                    Provide justification for the rejection
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-1">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectionModal.reason}
                  onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 outline-none transition-all min-h-[150px]"
                  placeholder="Example: The resource is undergoing scheduled maintenance during this time slot."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setRejectionModal({ show: false, booking: null, reason: '' })}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                >
                  Back
                </button>
                <button
                  onClick={() => handleUpdateStatus(
                    rejectionModal.booking.id,
                    'REJECTED',
                    rejectionModal.booking.resourceName,
                    rejectionModal.reason
                  )}
                  disabled={!rejectionModal.reason.trim()}
                  className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourceApprovalHub;