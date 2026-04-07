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
        booking.setStatus("PENDING");
        booking.setBookingDate(LocalDateTime.now());
        return repository.save(booking);
    }

    public List<ResourceBooking> getMyBookings(String userId) {
        return repository.findByUserId(userId);
    }

    public List<ResourceBooking> getAllBookings() {
        return repository.findAll();
    }

    public ResourceBooking updateBookingStatus(String id, String status) {
        return repository.findById(id).map(booking -> {
            booking.setStatus(status);
            return repository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}
