package smart_op_hub.CampusHub.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.UserRepository;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        List<GrantedAuthority> authorities = List
                .of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()));

        return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                .password(user.getPassword() == null ? "" : user.getPassword())
                .authorities(authorities)
                .build();
    }
}
