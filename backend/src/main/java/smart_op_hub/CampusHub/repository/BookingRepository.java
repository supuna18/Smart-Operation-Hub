package smart_op_hub.CampusHub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import smart_op_hub.CampusHub.model.Booking;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    // Conflict check panna facility name and status approved-ah nu paaka idhu uthavum
    List<Booking> findByFacilityNameAndStatus(String facilityName, String status);
}