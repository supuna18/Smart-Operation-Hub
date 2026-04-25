package smart_op_hub.CampusHub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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

    // MODULE B: Multi-day & Time Support
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;
    private String purpose;
    private Integer attendees;

    // Status info
    private String status; // PENDING, APPROVED, REJECTED, CANCELLED
    private String bookingDate; // Created date
    private String rejectionReason;
}