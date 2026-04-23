package smart_op_hub.CampusHub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset OTP - Smart Operation Hub");
        message.setText("Your OTP for password reset is: " + otp + "\n\nThis OTP will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.");
        mailSender.send(message);
    }
}
