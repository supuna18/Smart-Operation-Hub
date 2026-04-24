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

        // Resource ID வைத்து existing bookings fetch pannrom
        List<ResourceBooking> existingBookings = repository.findByResourceId(newBooking.getResourceId());

        if (existingBookings != null) {
            for (ResourceBooking existing : existingBookings) {

                // REJECTED bookings ignore pannuvom
                if (existing.getStatus() != null &&
                        !existing.getStatus().equals("REJECTED")) {

                    // Safety check for old data (null values avoid panna)
                    if (existing.getStartDate() == null ||
                            existing.getEndDate() == null ||
                            existing.getStartTime() == null ||
                            existing.getEndTime() == null) {
                        continue;
                    }

                    // Date range overlap check
                    boolean dateOverlap = (newBooking.getStartDate().compareTo(existing.getEndDate()) <= 0) &&
                            (newBooking.getEndDate().compareTo(existing.getStartDate()) >= 0);

                    if (dateOverlap) {

                        // Time slot overlap check
                        boolean timeOverlap = (newBooking.getStartTime().compareTo(existing.getEndTime()) < 0) &&
                                (newBooking.getEndTime().compareTo(existing.getStartTime()) > 0);

                        if (timeOverlap) {
                            throw new RuntimeException(
                                    "Time slot conflict! This period is already reserved.");
                        }
                    }
                }
            }
        }

        // Save as PENDING if no conflict
        newBooking.setStatus("PENDING");

        // Booking date set pannrom
        newBooking.setBookingDate(LocalDateTime.now().toString());

        return repository.save(newBooking);
    }

    public List<ResourceBooking> getMyBookings(String userId) {
        return repository.findByUserId(userId);
    }

    public List<ResourceBooking> getAllBookings() {
        List<ResourceBooking> all = repository.findAll();
        System.out.println(
                "ResourceBookingService: Found " +
                        all.size() +
                        " total bookings in database.");
        return all;
    }

    public List<ResourceBooking> getBookingsByResourceId(String resourceId) {
        return repository.findByResourceId(resourceId);
    }

    public ResourceBooking updateBookingStatus(String id, String status, String reason) {
        return repository.findById(id).map(booking -> {
            booking.setStatus(status);

            if (reason != null && !reason.isEmpty()) {
                booking.setRejectionReason(reason);
            }

            return repository.save(booking);

        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // MODULE B: DELETE METHOD
    public void deleteBooking(String id) {
        repository.deleteById(id);
    }
}