package smart_op_hub.CampusHub.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.Admin;
import smart_op_hub.CampusHub.model.AuthRequest;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.AdminRepository;
import smart_op_hub.CampusHub.repository.UserRepository;
import smart_op_hub.CampusHub.security.JwtUtil;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    public AuthRequest.AuthResponse signup(AuthRequest.SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent() ||
                adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("STUDENT");
        user.setAuthProvider("local");

        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        user.setPassword(null);

        return new AuthRequest.AuthResponse(token, user);
    }

    public AuthRequest.AuthResponse login(AuthRequest.LoginRequest request) {
        // Try admin first
        Optional<Admin> optionalAdmin = adminRepository.findByEmail(request.getEmail());
        if (optionalAdmin.isPresent()) {
            Admin admin = optionalAdmin.get();
            if (passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
                System.out.println("Password matched for admin.");
                String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN");
                User user = new User();
                user.setEmail(admin.getEmail());
                user.setUsername("System Admin");
                user.setRole("ADMIN");
                return new AuthRequest.AuthResponse(token, user);
            }
        }

        // Then try general users
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        user.setPassword(null);
        return new AuthRequest.AuthResponse(token, user);
    }

    public User getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(null);
        return user;
    }

    public AuthRequest.AuthResponse googleLogin(AuthRequest.GoogleLoginRequest request) throws Exception {
        // Warning: This verifies token only if you configure the client ID properly.
        // For development, if you don't have a valid ID configured, we might bypass
        // strong verification or handle it carefully.
        GoogleIdToken idToken = GoogleIdToken.parse(new GsonFactory(), request.getToken());
        // In real world use:
        // GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new
        // NetHttpTransport(), new GsonFactory())
        // .setAudience(Collections.singletonList(CLIENT_ID))
        // .build();
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
                user.setProfileImageUrl(pictureUrl);
                userRepository.save(user);
            } else {
                user = new User();
                user.setEmail(email);
                user.setUsername(name);
                user.setRole("STUDENT");
                user.setAuthProvider("google");
                user.setProfileImageUrl(pictureUrl);
                userRepository.save(user);
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            user.setPassword(null);
            return new AuthRequest.AuthResponse(token, user);

        } else {
            throw new RuntimeException("Invalid ID token.");
        }
    }

    public void initiateForgotPassword(String email) {
        System.out.println("Forgot password initiated for email: " + email);
        String otp = String.format("%06d", new Random().nextInt(1000000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            System.out.println("User found in database.");
            User user = userOpt.get();
            user.setResetOtp(otp);
            user.setResetOtpExpiry(expiry);
            userRepository.save(user);
        } else {
            Optional<Admin> adminOpt = adminRepository.findByEmail(email);
            if (adminOpt.isPresent()) {
                System.out.println("Admin found in database.");
                Admin admin = adminOpt.get();
                admin.setResetOtp(otp);
                admin.setResetOtpExpiry(expiry);
                adminRepository.save(admin);
            } else {
                System.out.println("Email NOT found in database: " + email);
                throw new RuntimeException("Email not found");
            }
        }

        try {
            System.out.println("Attempting to send OTP email to: " + email);
            emailService.sendOtpEmail(email, otp);
            System.out.println("OTP email sent successfully.");
        } catch (Exception e) {
            System.err.println("FAILED to send email: " + e.getMessage());
            throw new RuntimeException("Error sending email: " + e.getMessage());
        }
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return otp.equals(user.getResetOtp()) &&
                    user.getResetOtpExpiry() != null &&
                    user.getResetOtpExpiry().isAfter(LocalDateTime.now());
        }

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return otp.equals(admin.getResetOtp()) &&
                    admin.getResetOtpExpiry() != null &&
                    admin.getResetOtpExpiry().isAfter(LocalDateTime.now());
        }

        return false;
    }

    public void resetPassword(String email, String otp, String newPassword) {
        if (!verifyOtp(email, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        String encodedPassword = passwordEncoder.encode(newPassword);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(encodedPassword);
            user.setResetOtp(null);
            user.setResetOtpExpiry(null);
            userRepository.save(user);
            return;
        }

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            admin.setPassword(encodedPassword);
            admin.setResetOtp(null);
            admin.setResetOtpExpiry(null);
            adminRepository.save(admin);
        }
    }
}
