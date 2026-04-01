package smart_op_hub.CampusHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:5174") // අලුත් React Port එකට අවසර දීම
@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/add-user")
    public String addUser() {
        User user = new User();
        user.setUsername("Supuna_Admin");
        user.setEmail("supuna@campus.com");
        user.setRole("ADMIN");
        userRepository.save(user);
        return "User Saved Successfully to MongoDB!";
    }
}




// Remove id completely if it is not a valid existing ID to avoid sending null to backend
