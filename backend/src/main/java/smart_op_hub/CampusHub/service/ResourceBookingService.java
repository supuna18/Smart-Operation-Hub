package smart_op_hub.CampusHub.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.ResourceBooking;
import smart_op_hub.CampusHub.repository.ResourceBookingRepository;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceBookingService {
    private final ResourceBookingRepository repository;

    // --- 1. CREATE BOOKING (Unga exact logic patti) ---
    public ResourceBooking createBooking(ResourceBooking booking) {
        
        // Conflict Prevention: PENDING or APPROVED bookings-ah fetch pannuvom
        List<ResourceBooking> conflictingBookings = repository.findByResourceIdAndStatusIn(
                booking.getResourceId(), List.of("PENDING", "APPROVED"));

        // Logic check: Date serthu check panna dhaan different days-la same time book panna mudiyum
        boolean hasOverlap = conflictingBookings.stream()
                .anyMatch(existing -> {
                    // Date overlap check
                    boolean dateOverlap = (booking.getStartDate().compareTo(existing.getEndDate()) <= 0) &&
                                         (booking.getEndDate().compareTo(existing.getStartDate()) >= 0);
                    
                    // Time overlap check (Unga exact formula)
                    return dateOverlap && 
                           booking.getStartTime().compareTo(existing.getEndTime()) < 0 &&
                           booking.getEndTime().compareTo(existing.getStartTime()) > 0;
                });

        if (hasOverlap) {
            throw new RuntimeException(
                    "Scheduling Conflict: The resource is already booked for the selected time range.");
        }

        // --- Booking save pannuvom ---
        booking.setStatus("PENDING");
        booking.setBookingDate(LocalDateTime.now().toString());

        return repository.save(booking);
    }

    // --- 2. UPDATE BOOKING DETAILS ---
    public ResourceBooking updateBookingDetails(String id, ResourceBooking updated) {
        return repository.findById(id).map(existing -> {
            existing.setStartDate(updated.getStartDate());
            existing.setEndDate(updated.getEndDate());
            existing.setStartTime(updated.getStartTime());
            existing.setEndTime(updated.getEndTime());
            existing.setPurpose(updated.getPurpose());
            existing.setAttendees(updated.getAttendees());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // --- 3. HELPER METHODS ---
    public List<ResourceBooking> getBookingsByResourceId(String resourceId) {
        return repository.findByResourceId(resourceId);
    }

    public List<ResourceBooking> getMyBookings(String userId) { 
        return repository.findByUserId(userId); 
    }

    public List<ResourceBooking> getAllBookings() { 
        return repository.findAll(); 
    }

    public void deleteBooking(String id) { 
        repository.deleteById(id); 
    }

    public ResourceBooking updateBookingStatus(String id, String status, String reason) {
        return repository.findById(id).map(b -> {
            b.setStatus(status);
            if (reason != null) b.setRejectionReason(reason);
            return repository.save(b);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}