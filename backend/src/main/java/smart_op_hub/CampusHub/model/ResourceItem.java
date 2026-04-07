package smart_op_hub.CampusHub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class ResourceItem {
    @Id
    private String id;
    private String name;
    private String type;
    private Integer quantity;
    private String status;
}
