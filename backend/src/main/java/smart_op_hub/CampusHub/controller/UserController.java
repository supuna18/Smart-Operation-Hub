package smart_op_hub.CampusHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.AuthRequest;
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

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    /**
     * Update user password.
     * Member 4 Task: Account Security.
     */
    @PatchMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody AuthRequest.PasswordUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Incorrect current password"));
        }

        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

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
     * Create a new user manually.
     * Restricted to: ADMIN only.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody AuthRequest.SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole().toUpperCase() : "STUDENT");
        user.setAuthProvider("local");

        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(user);
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