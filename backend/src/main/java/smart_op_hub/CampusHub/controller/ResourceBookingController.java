package smart_op_hub.CampusHub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PostMapping
    public ResponseEntity<ResourceBooking> createBooking(@RequestBody ResourceBooking booking) {
        return ResponseEntity.ok(service.createBooking(booking));
    }

    @GetMapping("/my/{userId}")
    public ResponseEntity<List<ResourceBooking>> getMyBookings(@PathVariable String userId) {
        return ResponseEntity.ok(service.getMyBookings(userId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<ResourceBooking>> getAllBookings() {
        return ResponseEntity.ok(service.getAllBookings());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<ResourceBooking> updateBookingStatus(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(service.updateBookingStatus(id, status));
    }
}
