package smart_op_hub.CampusHub.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import smart_op_hub.CampusHub.model.Admin;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.AdminRepository;
import smart_op_hub.CampusHub.repository.UserRepository;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");
        String jwt = null;
        String username = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception ignored) {
                username = null;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            String role = null;

            // Try admin first
            Optional<Admin> optionalAdmin = adminRepository.findByEmail(username);
            if (optionalAdmin.isPresent() && jwtUtil.validateToken(jwt)) {
                role = optionalAdmin.get().getRole();
                if (role == null) role = "ADMIN";
            } else {
                // Then try general users
                Optional<User> optionalUser = userRepository.findByEmail(username);
                if (optionalUser.isPresent() && jwtUtil.validateToken(jwt)) {
                    role = optionalUser.get().getRole();
                }
            }

            if (role != null) {
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, List.of(authority));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
