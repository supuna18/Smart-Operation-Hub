package smart_op_hub.CampusHub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;
    private String message;
    private String type; // e.g., "BOOKING", "TICKET", "SYSTEM"
    private boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
