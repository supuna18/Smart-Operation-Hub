package smart_op_hub.CampusHub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.Ticket;
import smart_op_hub.CampusHub.model.TicketStatus;
import smart_op_hub.CampusHub.repository.TicketRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket createTicket(Ticket ticket) {
        if (ticket.getStatus() == null) {
            ticket.setStatus(TicketStatus.OPEN);
        }
        return ticketRepository.save(ticket);
    }

    public Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id);
    }

    public Ticket assignTicket(String id, String technicianId) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setAssignedTo(technicianId);
            return ticketRepository.save(ticket);
        }
        throw new RuntimeException("Ticket not found with id: " + id);
    }

    public Ticket updateTicketStatus(String id, TicketStatus status, String resolutionNotes) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setStatus(status);
            if (resolutionNotes != null) {
                ticket.setResolutionNotes(resolutionNotes);
            }
            return ticketRepository.save(ticket);
        }
        throw new RuntimeException("Ticket not found with id: " + id);
    }

    public List<Ticket> getTicketsByCreator(String userId) {
        return ticketRepository.findByCreatedBy(userId);
    }

    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}
