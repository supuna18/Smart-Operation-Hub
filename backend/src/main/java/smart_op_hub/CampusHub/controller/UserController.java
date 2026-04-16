package smart_op_hub.CampusHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.UserRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> request) {
        if (!request.containsKey("role")) {
            return ResponseEntity.badRequest().build();
        }
        return userRepository.findById(id).map(user -> {
            user.setRole(request.get("role"));
            userRepository.save(user);
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
