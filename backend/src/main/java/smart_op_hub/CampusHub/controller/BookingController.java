package smart_op_hub.CampusHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.Booking;
import smart_op_hub.CampusHub.service.BookingService;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping // 1. POST (Create)
    public ResponseEntity<?> create(@RequestBody Booking b) { return bookingService.createNewBooking(b); }

    @GetMapping("/user/{userId}") // 2. GET (View My)
    public List<Booking> getByUser(@PathVariable String userId) { return bookingService.getByUserId(userId); }

    @GetMapping // 3. GET (Admin View All)
    public List<Booking> getAll() { return bookingService.getAll(); }

    @DeleteMapping("/{id}") // 4. DELETE (Cancel)
    public void delete(@PathVariable String id) { bookingService.cancel(id); }
}