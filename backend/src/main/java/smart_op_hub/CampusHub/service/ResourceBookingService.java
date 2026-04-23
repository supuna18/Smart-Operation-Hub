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

    public ResourceBooking createBooking(ResourceBooking newBooking) {
        // Resource ID vachi existing bookings fetch panrom
        List<ResourceBooking> existingBookings = repository.findByResourceId(newBooking.getResourceId());

        if (existingBookings != null) {
            for (ResourceBooking existing : existingBookings) {
                // Rejected bookings-ah ignore pannuvom
                if (existing.getStatus() != null && !existing.getStatus().equals("REJECTED")) {
                    
                    // SAFETY CHECK: Member 1 panna pazhaya data-la startDate/endDate irukkaadhu.
                    if (existing.getStartDate() == null || existing.getEndDate() == null || 
                        existing.getStartTime() == null || existing.getEndTime() == null) {
                        continue;
                    }

                    // 1. Date Range overlap check (Module B Requirement)
                    boolean dateOverlap = (newBooking.getStartDate().compareTo(existing.getEndDate()) <= 0) &&
                                         (newBooking.getEndDate().compareTo(existing.getStartDate()) >= 0);

                    if (dateOverlap) {
                        // 2. Time Slot overlap check
                        boolean timeOverlap = (newBooking.getStartTime().compareTo(existing.getEndTime()) < 0) &&
                                             (newBooking.getEndTime().compareTo(existing.getStartTime()) > 0);

                        if (timeOverlap) {
                            throw new RuntimeException("Time slot conflict! This period is already reserved.");
                        }
                    }
                }
            }
        }

        // Ella checks-um pass aana, save pannanum
        newBooking.setStatus("PENDING");
        
        // Updated: Using toString() for easier date handling as you requested
        newBooking.setBookingDate(LocalDateTime.now().toString());
        
        return repository.save(newBooking);
    }

    public List<ResourceBooking> getMyBookings(String userId) {
        return repository.findByUserId(userId);
    }

    public List<ResourceBooking> getAllBookings() {
        return repository.findAll();
    }

    public List<ResourceBooking> getBookingsByResourceId(String resourceId) {
        return repository.findByResourceId(resourceId);
    }

    public ResourceBooking updateBookingStatus(String id, String status) {
        return repository.findById(id).map(booking -> {
            booking.setStatus(status);
            return repository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // --- MODULE B: DELETE METHOD ADDED ---
    public void deleteBooking(String id) {
        repository.deleteById(id);
    }
}