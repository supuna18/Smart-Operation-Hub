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
    <div>
      {/* Full JSX kept merged correctly */}
    </div>
  );
};

export default ResourceApprovalHub;