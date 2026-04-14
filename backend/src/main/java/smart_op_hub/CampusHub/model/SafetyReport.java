package smart_op_hub.CampusHub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.Date;

@Data
@Document(collection = "safety_reports")
public class SafetyReport {
    @Id
    private String id;
    private String userId; // Link to student/user
    private String reporterName; // For quick display
    private String description;
    private String location;
    private String status; // Pending, Approved, Rejected
    private Date createdAt;
}
