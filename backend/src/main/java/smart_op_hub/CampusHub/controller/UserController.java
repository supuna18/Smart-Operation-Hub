package smart_op_hub.CampusHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
/* Allow frontend origins for cross-origin requests */
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Get the profile of the currently logged-in user.
     * Member 4 Task: Authentication & Profile functionality.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            User u = user.get();
            u.setPassword(null); // Clear password for security
            return ResponseEntity.ok(u);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get a list of all registered users.
     * Restricted to: ADMIN only.
     * Member 4 Task: User Management.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        /* Protect user privacy by hiding passwords */
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    /**
     * Update the role of a specific user.
     * Restricted to: ADMIN only.
     * Member 4 Task: Role Management.
     */
    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> request) {
        if (!request.containsKey("role")) {
            return ResponseEntity.badRequest().build();
        }

        String newRole = request.get("role").toUpperCase();

        return userRepository.findById(id).map(user -> {
            user.setRole(newRole);
            userRepository.save(user);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Delete a user from the system.
     * Restricted to: ADMIN only.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}