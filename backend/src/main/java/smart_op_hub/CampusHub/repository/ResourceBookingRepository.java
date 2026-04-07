package smart_op_hub.CampusHub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import smart_op_hub.CampusHub.model.ResourceBooking;

import java.util.List;

@Repository
public interface ResourceBookingRepository extends MongoRepository<ResourceBooking, String> {
    List<ResourceBooking> findByUserId(String userId);
    List<ResourceBooking> findByStatus(String status);
}
