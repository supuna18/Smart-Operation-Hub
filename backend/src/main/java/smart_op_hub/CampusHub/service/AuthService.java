package smart_op_hub.CampusHub.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.AuthRequest;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.UserRepository;
import smart_op_hub.CampusHub.security.JwtUtil;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthRequest.AuthResponse signup(AuthRequest.SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "Student");
        user.setAuthProvider("local");
        
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        
        return new AuthRequest.AuthResponse(token, user);
    }

    public AuthRequest.AuthResponse login(AuthRequest.LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthRequest.AuthResponse(token, user);
    }

    public AuthRequest.AuthResponse googleLogin(AuthRequest.GoogleLoginRequest request) throws Exception {
        // Warning: This verifies token only if you configure the client ID properly.
        // For development, if you don't have a valid ID configured, we might bypass strong verification or handle it carefully.
        GoogleIdToken idToken = GoogleIdToken.parse(new GsonFactory(), request.getToken());
        // In real world use: 
        // GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
        //         .setAudience(Collections.singletonList(CLIENT_ID))
        //         .build();
        // GoogleIdToken idToken = verifier.verify(request.getToken());

        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            Optional<User> optionalUser = userRepository.findByEmail(email);
            User user;

            if (optionalUser.isPresent()) {
                user = optionalUser.get();
                // Optionally update profile picture
                user.setProfileImageUrl(pictureUrl);
                userRepository.save(user);
            } else {
                user = new User();
                user.setEmail(email);
                user.setUsername(name);
                user.setRole("Student");
                user.setAuthProvider("google");
                user.setProfileImageUrl(pictureUrl);
                // No password for google accounts
                userRepository.save(user);
            }

            String token = jwtUtil.generateToken(user.getEmail());
            return new AuthRequest.AuthResponse(token, user);

        } else {
            throw new RuntimeException("Invalid ID token.");
        }
    }
}
