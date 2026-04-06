package smart_op_hub.CampusHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.Ticket;
import smart_op_hub.CampusHub.model.TicketStatus;
import smart_op_hub.CampusHub.service.TicketService;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @PutMapping("/{id}/assign")
    public Ticket assignTicket(@PathVariable String id, @RequestParam String technicianId) {
        return ticketService.assignTicket(id, technicianId);
    }

    @PutMapping("/{id}/status")
    public Ticket updateTicketStatus(
            @PathVariable String id,
            @RequestParam TicketStatus status,
            @RequestParam(required = false) String notes) {
        return ticketService.updateTicketStatus(id, status, notes);
    }

    @GetMapping("/user/{userId}")
    public List<Ticket> getTicketsByCreator(@PathVariable String userId) {
        return ticketService.getTicketsByCreator(userId);
    }

    @GetMapping("/status/{status}")
    public List<Ticket> getTicketsByStatus(@PathVariable TicketStatus status) {
        return ticketService.getTicketsByStatus(status);
    }
}