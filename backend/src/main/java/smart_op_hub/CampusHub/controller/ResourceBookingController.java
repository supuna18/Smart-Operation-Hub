package smart_op_hub.CampusHub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.ResourceBooking;
import smart_op_hub.CampusHub.service.ResourceBookingService;
import java.util.List;

@RestController
@RequestMapping("/api/resources/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResourceBookingController {
    private final ResourceBookingService service;

    // 1. Create New Booking
    @PostMapping
    public ResponseEntity<ResourceBooking> createBooking(@RequestBody ResourceBooking booking) {
        return ResponseEntity.ok(service.createBooking(booking));
    }

    // 2. Get My Bookings (supports emails in path)
    @GetMapping("/my/{userId:.+}")
    public ResponseEntity<List<ResourceBooking>> getMyBookings(@PathVariable String userId) {
        return ResponseEntity.ok(service.getMyBookings(userId));
    }

    // 3. Get by Resource ID (For Availability guidance)
    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<ResourceBooking>> getBookingsByResourceId(@PathVariable String resourceId) {
        return ResponseEntity.ok(service.getBookingsByResourceId(resourceId));
    }

    // 4. Get All Bookings (Admin Report)
    @GetMapping("/all")
    public ResponseEntity<List<ResourceBooking>> getAllBookings() {
        return ResponseEntity.ok(service.getAllBookings());
    }

    // 5. Update Status (Approve/Reject)
    @PutMapping("/{id}/status")
    public ResponseEntity<ResourceBooking> updateBookingStatus(
            @PathVariable String id, 
            @RequestParam String status, 
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(service.updateBookingStatus(id, status, reason));
    }

    // 6. Update Booking Details (Edit Functionality)
    @PutMapping("/{id}/update")
    public ResponseEntity<ResourceBooking> updateBookingDetails(
            @PathVariable String id, 
            @RequestBody ResourceBooking booking) {
        return ResponseEntity.ok(service.updateBookingDetails(id, booking));
    }

    // 7. Delete Booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        service.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}