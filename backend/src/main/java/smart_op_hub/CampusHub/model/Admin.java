package smart_op_hub.CampusHub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "admin")
public class Admin {
    @Id
    private String id;
    private String email;
    private String password;
    private String role; // Always "Admin"
    private String resetOtp;
    private LocalDateTime resetOtpExpiry;
}
