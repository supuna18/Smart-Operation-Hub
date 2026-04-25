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

    // --- 1. CREATE BOOKING WITH STRICT CONFLICT CHECK ---
    public ResourceBooking createBooking(ResourceBooking booking) {
        // Validation: New booking-ku conflict check pannuvom
        validateTimeSlot(booking, null); 

        booking.setStatus("PENDING");
        booking.setBookingDate(LocalDateTime.now().toString());
        return repository.save(booking);
    }

    // --- 2. UPDATE BOOKING WITH CONFLICT CHECK (EXCLUDING SELF) ---
    public ResourceBooking updateBookingDetails(String id, ResourceBooking updated) {
        // Update pannum bodhu, conflict check pannanum (aana adhe ID-ah filter pannanum)
        validateTimeSlot(updated, id);

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

    // --- CORE LOGIC: CONFLICT CHECKER METHOD ---
    private void validateTimeSlot(ResourceBooking newBooking, String currentBookingId) {
        // Fetch only active bookings for this resource
        List<ResourceBooking> existingBookings = repository.findByResourceIdAndStatusIn(
            newBooking.getResourceId(), List.of("PENDING", "APPROVED")
        );

        boolean hasOverlap = existingBookings.stream()
            // Editing-na current record-ah ignore pannanum, illana 'Self-Conflict' varum
            .filter(ex -> currentBookingId == null || !ex.getId().equals(currentBookingId))
            .anyMatch(ex -> {
                // 1. DATE OVERLAP CHECK: (StartA <= EndB) AND (EndA >= StartB)
                boolean dateOverlap = (newBooking.getStartDate().compareTo(ex.getEndDate()) <= 0) &&
                                     (newBooking.getEndDate().compareTo(ex.getStartDate()) >= 0);

                if (dateOverlap) {
                    // 2. TIME OVERLAP CHECK: (StartA < EndB) AND (EndA > StartB)
                    // Indha logic dhaan exact-ah partial overlap-ah (e.g. 4-6 vs 1-5) kandupidiikum
                    return newBooking.getStartTime().compareTo(ex.getEndTime()) < 0 && 
                           newBooking.getEndTime().compareTo(ex.getStartTime()) > 0;
                }
                return false;
            });

        if (hasOverlap) {
            // Indha message dhaan Frontend-la Toast alert-ah varum
            throw new RuntimeException("TIME_SLOT_CONFLICT");
        }
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