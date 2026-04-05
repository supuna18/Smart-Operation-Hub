package smart_op_hub.CampusHub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// මෙන්න මේ import එක අලුතෙන් දාන්න
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// මෙතන (exclude = {SecurityAutoConfiguration.class}) කෑල්ල එකතු කරන්න
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class CampusHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampusHubApplication.class, args);
	}

}