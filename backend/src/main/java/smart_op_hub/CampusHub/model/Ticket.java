package smart_op_hub.CampusHub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data; // Lombok පාවිච්චි කරන නිසා getters/setters ඕන නෑ
import java.time.LocalDateTime;

@Data
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String issueTitle;
    private String location;
    private String description;
    private String imageUrl;
    private TicketStatus status = TicketStatus.OPEN;
    private LocalDateTime createdAt = LocalDateTime.now();
    private String createdBy;
    private String assignedTo;
    private String resolutionNotes;
}