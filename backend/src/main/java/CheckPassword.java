
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class CheckPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin1234";
        String encodedPassword = "$2a$10$l4s0oo7YFohziyB7kvoXsusmLDJRF3qe56CKSqZWp7Eza.uXIsJBG";
        
        System.out.println("Matches: " + encoder.matches(rawPassword, encodedPassword));
    }
}
