import React, { useState, useEffect } from 'react';
import ResourceService from '../../services/ResourceService';
import { getUser, isAdmin } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiTrash2,
  FiMessageSquare,
  FiEdit2
} from 'react-icons/fi';
import api from '../../utils/api';
import BookingForm from './BookingForm';

const MyBookings = ({ isEmbedded = false }) => {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEmbedded && isAdmin()) {
      navigate('/AdminDashboard');
    }
  }, [navigate, isEmbedded]);

  const fetchMyBookings = async () => {
    if (!user || (!user.id && !user.email)) {
      setLoading(false);
      console.warn('Cannot fetch bookings: No user ID or email found');
      return;
    }

    setLoading(true);

    try {
      const response = await ResourceService.getMyBookings(
        user.id || user.email
      );

      // Sort newest first
      const sorted = response.data.sort(
        (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
      );

      setBookings(sorted);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast(
        'Unable to load your bookings. Please try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user?.id, user?.email]);

  const handleEdit = (booking) => {
    if (booking.status !== 'PENDING') {
      showToast(
        'You can only edit pending reservations.',
        'info'
      );
      return;
    }

    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedBooking(null);
    fetchMyBookings();
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to remove this booking from your history?'
      )
    ) {
      try {
        await api.delete(`/resources/bookings/${id}`);
        showToast(
          'Booking history removed successfully!',
          'success'
        );
        fetchMyBookings();
      } catch (error) {
        console.error('Delete booking error:', error);
        showToast(
          'Failed to delete booking history.',
          'error'
        );
      }
    }
  };

  const handleCancel = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to cancel your booking for ${name}?`
      )
    ) {
      try {
        await ResourceService.updateBookingStatus(
          id,
          'CANCELLED'
        );

        showToast(
          'Booking cancelled successfully',
          'success'
        );

        fetchMyBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        showToast(
          'Failed to cancel booking',
          'error'
        );
      }
    }
  };

  return (
    <div
      className={
        isEmbedded
          ? 'w-full space-y-8 animate-in fade-in duration-500'
          : 'min-h-screen bg-slate-50 font-poppins py-12 relative'
      }
    >
      {/* Edit Modal */}
      {isEditModalOpen && (
        <BookingForm
          facility={null}
          editBooking={selectedBooking}
          onClose={handleCloseModal}
        />
      )}

      <div
        className={
          isEmbedded
            ? ''
            : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'
        }
      >
        {!isEmbedded && (
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                My Booking <span className="text-yellow-500">Details</span>
              </h1>

              <p className="text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                Track and manage your campus resource reservation history.
              </p>

              {lastUpdated && (
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2">
                  Last synced: {lastUpdated}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  Approved
                </span>
                <span className="text-lg font-black text-emerald-600">
                  {
                    bookings.filter(
                      (b) => b.status === 'APPROVED'
                    ).length
                  }
                </span>
              </div>

              <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  Pending
                </span>
                <span className="text-lg font-black text-yellow-600">
                  {
                    bookings.filter(
                      (b) => b.status === 'PENDING'
                    ).length
                  }
                </span>
              </div>

              <button
                onClick={fetchMyBookings}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-yellow-500 animate-spin" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Updating Feed...
            </p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center p-6 gap-6 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-yellow-400 flex items-center justify-center shadow-sm">
                      <FiInfo size={20} />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">
                        {booking.resourceName}
                      </h3>

                      <div className="flex items-center gap-2 mt-0.5">
                        <FiMessageSquare
                          size={12}
                          className="text-slate-400"
                        />

                        <p className="text-[11px] text-slate-500 font-medium italic">
                          "{booking.purpose}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <FiCalendar className="text-yellow-500" />
                      <span>
                        Period: {booking.startDate} — {booking.endDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <FiClock className="text-yellow-500" />
                      <span>
                        Time: {booking.startTime} to {booking.endTime}
                      </span>
                    </div>
                  </div>

                  {booking.status === 'REJECTED' &&
                    booking.rejectionReason && (
                      <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-700 italic flex gap-2 items-start">
                        <FiXCircle className="mt-0.5 flex-shrink-0" />
                        <p>
                          <strong>Reason:</strong>{' '}
                          {booking.rejectionReason}
                        </p>
                      </div>
                    )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="flex flex-col items-end">
                    <span
                      className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${
                        booking.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : booking.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
                          : booking.status === 'CANCELLED'
                          ? 'bg-slate-50 text-slate-500 ring-slate-600/20'
                          : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                      }`}
                    >
                      {booking.status === 'APPROVED' ? (
                        <FiCheckCircle />
                      ) : booking.status === 'REJECTED' ||
                        booking.status === 'CANCELLED' ? (
                        <FiXCircle />
                      ) : (
                        <FiClock className="animate-pulse" />
                      )}

                      {booking.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {booking.status === 'PENDING' && (
                      <button
                        onClick={() => handleEdit(booking)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-90"
                        title="Edit Reservation"
                      >
                        <FiEdit2 size={18} />
                      </button>
                    )}

                    {(booking.status === 'PENDING' ||
                      booking.status === 'APPROVED') && (
                      <button
                        onClick={() =>
                          handleCancel(
                            booking.id,
                            booking.resourceName
                          )
                        }
                        className="p-3 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-500 hover:text-white transition-all shadow-md active:scale-90"
                        title="Cancel Booking"
                      >
                        <FiClock size={18} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-md active:scale-90"
                      title="Delete Booking History"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 rounded-3xl border-2 border-dashed border-slate-200 bg-white">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
              <FiCalendar
                className="text-slate-200"
                size={32}
              />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              No History Found
            </h2>

            <p className="text-slate-400 max-w-xs mx-auto mb-8 text-sm font-medium">
              You haven't made any campus reservations yet.
            </p>

            <button
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
              onClick={() => navigate('/resources')}
            >
              Explore Assets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;