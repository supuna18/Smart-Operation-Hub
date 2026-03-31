package smart_op_hub.CampusHub.repository;

import smart_op_hub.CampusHub.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // Particular user-oda bookings list edukka
    List<Booking> findByUserId(String userId);

    // Oru resource-ku andha date-la enna bookings irukku nu check panna (Conflict logic-ku thevai)
    List<Booking> findByResourceIdAndBookingDate(String resourceId, LocalDate date);
}