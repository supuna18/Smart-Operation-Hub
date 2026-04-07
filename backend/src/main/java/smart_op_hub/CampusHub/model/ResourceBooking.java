package smart_op_hub.CampusHub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resource_bookings")
public class ResourceBooking {
    @Id
    private String id;
    private String resourceId;
    private String resourceName;
    private String userId;
    private String username;
    private String status; // PENDING, APPROVED, REJECTED
    private LocalDateTime bookingDate;
}
