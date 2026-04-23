package smart_op_hub.CampusHub.model;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

public class AuthRequest {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private String role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoogleLoginRequest {
        private String token;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PasswordUpdateRequest {
        private String currentPassword;
        private String newPassword;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyOtpRequest {
        private String email;
        private String otp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResetPasswordRequest {
        private String email;
        private String otp;
        private String newPassword;
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
