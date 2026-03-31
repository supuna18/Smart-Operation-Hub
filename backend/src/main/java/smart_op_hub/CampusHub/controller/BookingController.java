package smart_op_hub.CampusHub.controller;

import smart_op_hub.CampusHub.model.Booking;
import smart_op_hub.CampusHub.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*") 
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // POST: Create a booking request
    @PostMapping("/create")
    public String create(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    // GET: Admin can see all bookings
    @GetMapping("/all")
    public List<Booking> getAll() {
        return bookingService.getAllBookings();
    }

    // GET: Specific user can see their bookings
    @GetMapping("/user/{userId}")
    public List<Booking> getMyBookings(@PathVariable String userId) {
        return bookingService.getUserBookings(userId);
    }

    // PUT: Update booking status (Approve/Reject/Cancel)
    @PutMapping("/{id}/status")
    public Booking updateStatus(
            @PathVariable String id, 
            @RequestParam String status, 
            @RequestParam(required = false) String reason) {
        return bookingService.updateStatus(id, status, reason);
    }
}