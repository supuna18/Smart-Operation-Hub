package smart_op_hub.CampusHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.Facility;
import smart_op_hub.CampusHub.model.ResourceItem;
import smart_op_hub.CampusHub.model.SafetyReport;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.FacilityRepository;
import smart_op_hub.CampusHub.repository.ResourceRepository;
import smart_op_hub.CampusHub.repository.SafetyReportRepository;
import smart_op_hub.CampusHub.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private SafetyReportRepository safetyReportRepository;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User request) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(request.getUsername() != null ? request.getUsername() : user.getUsername());
            user.setEmail(request.getEmail() != null ? request.getEmail() : user.getEmail());
            if (request.getRole() != null) {
                user.setRole(request.getRole());
            }
            userRepository.save(user);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/facilities")
    public List<Facility> getFacilities() {
        return facilityRepository.findAll();
    }

    @PostMapping("/facilities")
    public Facility createFacility(@RequestBody Facility facility) {
        return facilityRepository.save(facility);
    }

    @PutMapping("/facilities/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable String id, @RequestBody Facility request) {
        return facilityRepository.findById(id).map(facility -> {
            facility.setName(request.getName() != null ? request.getName() : facility.getName());
            facility.setDescription(
                    request.getDescription() != null ? request.getDescription() : facility.getDescription());
            facility.setLocation(request.getLocation() != null ? request.getLocation() : facility.getLocation());
            facility.setCapacity(request.getCapacity() != null ? request.getCapacity() : facility.getCapacity());
            return ResponseEntity.ok(facilityRepository.save(facility));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/facilities/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        if (!facilityRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        facilityRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/resources")
    public List<ResourceItem> getResources() {
        return resourceRepository.findAll();
    }

    @PostMapping("/resources")
    public ResourceItem createResource(@RequestBody ResourceItem resourceItem) {
        return resourceRepository.save(resourceItem);
    }

    @PutMapping("/resources/{id}")
    public ResponseEntity<ResourceItem> updateResource(@PathVariable String id, @RequestBody ResourceItem request) {
        return resourceRepository.findById(id).map(resource -> {
            resource.setName(request.getName() != null ? request.getName() : resource.getName());
            resource.setType(request.getType() != null ? request.getType() : resource.getType());
            resource.setQuantity(request.getQuantity() != null ? request.getQuantity() : resource.getQuantity());
            resource.setStatus(request.getStatus() != null ? request.getStatus() : resource.getStatus());
            return ResponseEntity.ok(resourceRepository.save(resource));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        if (!resourceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        resourceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- Safety Endpoints ---

    @GetMapping("/safety/reports")
    public List<SafetyReport> getAllSafetyReports() {
        return safetyReportRepository.findAll();
    }

    @PutMapping("/safety/reports/{id}/status")
    public ResponseEntity<SafetyReport> updateSafetyReportStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        return safetyReportRepository.findById(id).map(report -> {
            report.setStatus(request.get("status"));
            return ResponseEntity.ok(safetyReportRepository.save(report));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- Analytics Endpoints ---

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("userCount", userRepository.count());
        stats.put("facilityCount", facilityRepository.count());
        stats.put("resourceCount", resourceRepository.count());
        stats.put("safetyReportCount", safetyReportRepository.count());
        
        // Mock health metrics for simplicity
        Map<String, String> health = new HashMap<>();
        health.put("status", "Healthy");
        health.put("database", "Connected");
        health.put("uptime", "99.98%");
        stats.put("systemHealth", health);
        
        return ResponseEntity.ok(stats);
    }
}
