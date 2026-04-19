package smart_op_hub.CampusHub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "bookings") // Puthu table name - Member 2 work mattum dhaan inga irukum
public class Booking {
    @Id
    private String id;
    private String facilityName; // Name of the lab/hall
    private String userId;      
    private String username;
    private String date;         
    private String startTime;
    private String endTime;
    private String purpose;
    private int attendees;
    private String status = "PENDING"; // Workflow: PENDING -> APPROVED/REJECTED
    // Booking.java-la indha oru line mattum sethukonga
    private String rejectionReason;
}