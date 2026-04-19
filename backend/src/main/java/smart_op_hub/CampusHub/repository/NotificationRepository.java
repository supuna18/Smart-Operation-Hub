package smart_op_hub.CampusHub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import smart_op_hub.CampusHub.model.Notification;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    long countByUserIdAndReadFalse(String userId);
}
