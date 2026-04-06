package smart_op_hub.CampusHub;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import smart_op_hub.CampusHub.model.Admin;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.repository.AdminRepository;
import smart_op_hub.CampusHub.repository.UserRepository;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class CampusHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampusHubApplication.class, args);
	}

	@Bean
	public CommandLineRunner createAdmin(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			adminRepository.findByEmail("admin@gmail.com").orElseGet(() -> {
				Admin admin = new Admin();
				admin.setEmail("admin@gmail.com");
				admin.setPassword(passwordEncoder.encode("admin1234"));
				admin.setRole("Admin");
				return adminRepository.save(admin);
			});
		};
	}
}
