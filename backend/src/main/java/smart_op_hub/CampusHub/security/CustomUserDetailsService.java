package smart_op_hub.CampusHub.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.Admin;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.AdminRepository;
import smart_op_hub.CampusHub.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String email;
        String password;
        String role;

        Optional<Admin> optionalAdmin = adminRepository.findByEmail(username);
        if (optionalAdmin.isPresent()) {
            Admin admin = optionalAdmin.get();
            email = admin.getEmail();
            password = admin.getPassword();
            role = admin.getRole();
            if (role == null) role = "ADMIN";
        } else {
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
            email = user.getEmail();
            password = user.getPassword();
            role = user.getRole();
        }

        List<GrantedAuthority> authorities = List
                .of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

        return org.springframework.security.core.userdetails.User.withUsername(email)
                .password(password == null ? "" : password)
                .authorities(authorities)
                .build();
    }
}
