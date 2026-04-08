package smart_op_hub.CampusHub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String facilityName;
    private String userId;      // Yaaru book panna nu theriyanum
    private String username;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private int attendees;
    private String status = "PENDING"; // Default status
}