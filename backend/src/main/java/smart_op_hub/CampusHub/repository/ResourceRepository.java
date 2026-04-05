package smart_op_hub.CampusHub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import smart_op_hub.CampusHub.model.Resource;
import smart_op_hub.CampusHub.model.ResourceStatus;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByNameContainingIgnoreCase(String name);
    List<Resource> findByType(String type);
    List<Resource> findByStatus(ResourceStatus status);
}
