package smart_op_hub.CampusHub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import smart_op_hub.CampusHub.model.Facility;

public interface FacilityRepository extends MongoRepository<Facility, String> {
}
