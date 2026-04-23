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
            String role = jwtUtil.extractRole(jwt); // Extract role directly from token
            System.out.println("Extracted username from token: " + username);
            System.out.println("Extracted role from token: " + role);

            if (role != null && jwtUtil.validateToken(jwt)) {
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, List.of(authority));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Authentication set in security context for role: ROLE_" + role.toUpperCase());
            } else {
                System.out.println("Token validation failed or role is missing.");
            }
        }

        filterChain.doFilter(request, response);
    }
}
