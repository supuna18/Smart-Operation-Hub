package smart_op_hub.CampusHub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.Booking;
import smart_op_hub.CampusHub.repository.BookingRepository;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * CORE LOGIC: Create Booking with Conflict Check
     * Requirement: "System must prevent scheduling conflicts for the same resource"
     */
    public ResponseEntity<?> createNewBooking(Booking newBooking) {
        // Step 1: Inga dhaan logic start aagudhu. Same facility and same date-la APPROVED bookings check panrom.
        List<Booking> existing = bookingRepository.findByFacilityNameAndStatus(newBooking.getFacilityName(), "APPROVED");
        
        for (Booking b : existing) {
            // Check if it's the same day
            if (newBooking.getDate().equals(b.getDate())) {
                
                /* 
                 * Overlap Logic: 
                 * (NewStart < ExistingEnd) AND (NewEnd > ExistingStart)
                 * String comparison compareTo works perfectly for "HH:mm" format.
                 */
                boolean isOverlapping = newBooking.getStartTime().compareTo(b.getEndTime()) < 0 && 
                                       newBooking.getEndTime().compareTo(b.getStartTime()) > 0;

                if (isOverlapping) {
                    return ResponseEntity.status(409).body("Conflict: This facility is already booked from " 
                            + b.getStartTime() + " to " + b.getEndTime());
                }
            }
        }
        
        // No conflict? Save as PENDING
        newBooking.setStatus("PENDING");
        return ResponseEntity.ok(bookingRepository.save(newBooking));
    }

    /**
     * Admin Workflow: Update Status (Approve/Reject)
     * Requirement: "Admin users can review, approve, or reject booking requests with a reason"
     */
    public Booking updateBookingStatus(String id, String status, String reason) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);
            
            // Rejection reason-ah purpose kooda append panroom or separate field-la store pannalaam
            if (reason != null && !reason.isEmpty()) {
                booking.setPurpose(booking.getPurpose() + " | Admin Note: " + reason);
            }
            
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with id: " + id);
    }

    // PDF Requirement: "Users can view their own bookings"
    public List<Booking> getByUserId(String uid) { 
        return bookingRepository.findByUserId(uid); 
    }

    // PDF Requirement: "Admin can view all bookings"
    public List<Booking> getAll() { 
        return bookingRepository.findAll(); 
    }

    // PDF Requirement: "Approved bookings can later be CANCELLED"
    public void cancel(String id) { 
        bookingRepository.deleteById(id); 
    }
}