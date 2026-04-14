package smart_op_hub.CampusHub;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import smart_op_hub.CampusHub.model.Admin;
import smart_op_hub.CampusHub.repository.AdminRepository;

@SpringBootApplication
public class CampusHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampusHubApplication.class, args);
	}

	@Bean
	public CommandLineRunner createAdmin(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
		return args -> {
            // Clean up any existing admin records for this email to avoid conflicts (plain text vs hashed)
            adminRepository.findByEmail("admin@gmail.com").ifPresent(existing -> {
                if (!existing.getPassword().startsWith("$2a$")) {
                    System.out.println("Converting plain text password for admin to hashed...");
                    adminRepository.delete(existing);
                }
            });
            
			if (adminRepository.findByEmail("admin@gmail.com").isEmpty()) {
                System.out.println("Seeding fresh hashed admin record...");
				Admin admin = new Admin();
				admin.setEmail("admin@gmail.com");
				admin.setPassword(passwordEncoder.encode("admin1234"));
				admin.setRole("Admin");
				adminRepository.save(admin);
			}
		};
	}
}
