package smart_op_hub.CampusHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.AuthRequest;
import smart_op_hub.CampusHub.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest.SignupRequest request) {
        try {
            return ResponseEntity.ok(authService.signup(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest.LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody AuthRequest.GoogleLoginRequest request) {
        try {
            return ResponseEntity.ok(authService.googleLogin(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            return ResponseEntity.ok(authService.getCurrentUser(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
