package smart_op_hub.CampusHub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import smart_op_hub.CampusHub.model.SafetyReport;
import java.util.List;

public interface SafetyReportRepository extends MongoRepository<SafetyReport, String> {
    List<SafetyReport> findByUserId(String userId);
    List<SafetyReport> findByStatus(String status);
}
