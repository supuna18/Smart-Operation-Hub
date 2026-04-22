package smart_op_hub.CampusHub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.Ticket;
import smart_op_hub.CampusHub.model.TicketStatus;
import smart_op_hub.CampusHub.repository.TicketRepository;

import java.util.List;
import java.util.Optional;

import smart_op_hub.CampusHub.service.NotificationService;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationService notificationService;

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
            Ticket savedTicket = ticketRepository.save(ticket);

            if (ticket.getCreatedBy() != null) {
                notificationService.createNotification(
                        ticket.getCreatedBy(),
                        "Your ticket '" + ticket.getIssueTitle() + "' has been accepted by " + technicianId + " and is under review.",
                        "TICKET_UPDATE"
                );
            }

            return savedTicket;
        }
        throw new RuntimeException("Ticket not found with id: " + id);
    }

    public Ticket updateTicketStatus(String id, TicketStatus status, String resolutionNotes) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            TicketStatus oldStatus = ticket.getStatus();
            ticket.setStatus(status);
            if (resolutionNotes != null) {
                ticket.setResolutionNotes(resolutionNotes);
            }
            Ticket savedTicket = ticketRepository.save(ticket);

            if (oldStatus != status && ticket.getCreatedBy() != null) {
                if (status == TicketStatus.RESOLVED) {
                    String resolveMessage = "Your ticket '" + ticket.getIssueTitle() + "' has been successfully resolved.";
                    if (resolutionNotes != null && !resolutionNotes.trim().isEmpty()) {
                        resolveMessage += " Notes: " + resolutionNotes;
                    }
                    notificationService.createNotification(ticket.getCreatedBy(), resolveMessage, "TICKET_RESOLVED");
                } else if (status == TicketStatus.REJECTED) {
                    String rejectMessage = "Your ticket '" + ticket.getIssueTitle() + "' has been rejected.";
                    if (resolutionNotes != null && !resolutionNotes.trim().isEmpty()) {
                        rejectMessage += " Reason: " + resolutionNotes;
                    }
                    notificationService.createNotification(ticket.getCreatedBy(), rejectMessage, "TICKET_REJECTED");
                }
            }

            return savedTicket;
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
