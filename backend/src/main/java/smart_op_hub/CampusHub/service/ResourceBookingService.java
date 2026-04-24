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

    public ResourceBooking createBooking(ResourceBooking booking) {
        // Conflict Prevention: Check for overlapping bookings
        // මෙහිදී දැනටමත් PENDING හෝ APPROVED තත්වයේ තියෙන bookings පමණක් පරීක්ෂා කරයි
        List<ResourceBooking> conflictingBookings = repository.findByResourceIdAndStatusIn(
                booking.getResourceId(), List.of("PENDING", "APPROVED"));

        // Logic check using compareTo because dates/times are Strings in the model
        // අලුත් booking එකේ වෙලාව පරණ ඒව සමඟ overlap වෙනවාදැයි පරීක්ෂා කිරීම
        boolean hasOverlap = conflictingBookings.stream()
                .anyMatch(existing -> booking.getStartTime().compareTo(existing.getEndTime()) < 0 &&
                        booking.getEndTime().compareTo(existing.getStartTime()) > 0);

        if (hasOverlap) {
            throw new RuntimeException(
                    "Scheduling Conflict: The resource is already booked for the selected time range.");
        }

        // --- Booking එක සුරැකීම ---
        booking.setStatus("PENDING");
        // වර්තමාන දිනය සහ වෙලාව String එකක් ලෙස සෙට් කිරීම
        booking.setBookingDate(LocalDateTime.now().toString());

        return repository.save(booking);
    }

    public List<ResourceBooking> getMyBookings(String userId) {
        return repository.findByUserId(userId);
    }

    public List<ResourceBooking> getAllBookings() {
        List<ResourceBooking> all = repository.findAll();
        System.out.println("ResourceBookingService: Found " + all.size() + " total bookings in database.");
        return all;
    }

    public List<ResourceBooking> getBookingsByResourceId(String resourceId) {
        return repository.findByResourceId(resourceId);
    }

    public ResourceBooking updateBookingStatus(String id, String status, String reason) {
        return repository.findById(id).map(b -> {
            b.setStatus(status);
            if (reason != null && !reason.isEmpty()) {
                b.setRejectionReason(reason);
            }
            return repository.save(b);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // Module B Delete Method
    public void deleteBooking(String id) {
        repository.deleteById(id);
    }
}