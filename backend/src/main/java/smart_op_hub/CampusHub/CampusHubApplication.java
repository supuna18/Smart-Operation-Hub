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
            adminRepository.findByEmail("admin@gmail.com").ifPresent(existing -> {
                System.out.println("Removing existing admin record for clean seeding: " + existing.getEmail());
                adminRepository.delete(existing);
            });

            System.out.println("Seeding fresh admin record: admin@gmail.com / admin1234");
            Admin admin = new Admin();
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin1234"));
            admin.setRole("Admin");
            adminRepository.save(admin);
		};
	}
}
