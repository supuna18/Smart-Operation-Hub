package smart_op_hub.CampusHub.model;

import lombok.Data;

public class AuthRequest {

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private String role;
    }

    @Data
    public static class GoogleLoginRequest {
        private String token;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private User user;

        public AuthResponse(String token, User user) {
            this.token = token;
            this.user = user;
        }
    }
}
