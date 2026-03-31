package smart_op_hub.CampusHub.service;

import smart_op_hub.CampusHub.model.Booking;
import smart_op_hub.CampusHub.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create New Booking (Conflict Check logic included)
    public String createBooking(Booking booking) {
        // Find existing bookings for same resource and date
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndBookingDate(
                booking.getResourceId(), booking.getBookingDate());

        for (Booking existing : existingBookings) {
            // Status PENDING or APPROVED-ah irundha mattum conflict check panna podhum
            if ("APPROVED".equals(existing.getStatus()) || "PENDING".equals(existing.getStatus())) {
                // Logic: NewStartTime < ExistingEndTime AND NewEndTime > ExistingStartTime
                if (booking.getStartTime().isBefore(existing.getEndTime()) && 
                    booking.getEndTime().isAfter(existing.getStartTime())) {
                    return "CONFLICT: This time slot is already booked or requested!";
                }
            }
        }

        booking.setStatus("PENDING"); // Default status for new request
        bookingRepository.save(booking);
        return "SUCCESS: Booking requested successfully!";
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateStatus(String id, String status, String reason) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setStatus(status);
            if (reason != null) {
                booking.setRejectionReason(reason);
            }
            return bookingRepository.save(booking);
        }
        return null;
    }
}