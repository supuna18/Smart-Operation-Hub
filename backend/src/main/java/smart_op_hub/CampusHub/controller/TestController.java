package smart_op_hub.CampusHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:5174") // aluth. React. Port. ekata, permission. deema.
@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private smart_op_hub.CampusHub.repository.AdminRepository adminRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping("/add-user")
    public String addUser() {
        User user = new User();
        user.setUsername("Supuna_Admin");
        user.setEmail("supuna@campus.com");
        user.setRole("ADMIN");
        userRepository.save(user);
        return "User Saved Successfully to MongoDB!";
    }

    @GetMapping("/reset-admin")
    public String resetAdmin() {
        String email = "admin@gmail.com";
        String password = "admin1234";
        
        java.util.Optional<smart_op_hub.CampusHub.model.Admin> adminOpt = adminRepository.findByEmail(email);
        smart_op_hub.CampusHub.model.Admin admin;
        
        if (adminOpt.isPresent()) {
            admin = adminOpt.get();
        } else {
            admin = new smart_op_hub.CampusHub.model.Admin();
            admin.setEmail(email);
            admin.setRole("Admin");
        }
        
        admin.setPassword(passwordEncoder.encode(password));
        adminRepository.save(admin);
        
        return "Admin password for " + email + " reset to '" + password + "' successfully!";
    }
}
