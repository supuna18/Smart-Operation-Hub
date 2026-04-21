package smart_op_hub.CampusHub.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import smart_op_hub.CampusHub.model.Admin;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.AdminRepository;
import smart_op_hub.CampusHub.repository.UserRepository;
import smart_op_hub.CampusHub.security.JwtUtil;

import java.util.List;
import java.util.Optional;

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authorizationHeader = accessor.getFirstNativeHeader("Authorization");

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwt = authorizationHeader.substring(7);
                String username = jwtUtil.extractUsername(jwt);

                if (username != null && jwtUtil.validateToken(jwt)) {
                    String role = null;

                    // Reuse logic from JwtRequestFilter to find user/admin and role
                    Optional<Admin> optionalAdmin = adminRepository.findByEmail(username);
                    if (optionalAdmin.isPresent()) {
                        role = optionalAdmin.get().getRole();
                        if (role == null) role = "ADMIN";
                    } else {
                        Optional<User> optionalUser = userRepository.findByEmail(username);
                        if (optionalUser.isPresent()) {
                            role = optionalUser.get().getRole();
                        }
                    }

                    if (role != null) {
                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                username, null, List.of(authority));
                        
                        // This is the key: set the user into the STOMP accessor
                        accessor.setUser(authToken);
                        // Also set in SecurityContext for the current thread
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        }
        return message;
    }
}
