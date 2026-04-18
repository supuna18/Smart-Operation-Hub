package smart_op_hub.CampusHub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import smart_op_hub.CampusHub.model.Ticket;
import smart_op_hub.CampusHub.model.TicketStatus;
import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByCreatedBy(String createdBy);
    List<Ticket> findByStatus(TicketStatus status);
}