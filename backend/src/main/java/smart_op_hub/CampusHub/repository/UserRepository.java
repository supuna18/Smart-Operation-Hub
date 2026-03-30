package smart_op_hub.CampusHub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import smart_op_hub.CampusHub.model.User;

public interface UserRepository extends MongoRepository<User, String> {
}