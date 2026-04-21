package smart_op_hub.CampusHub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.Notification;
import smart_op_hub.CampusHub.model.User;
import smart_op_hub.CampusHub.model.Admin;
import smart_op_hub.CampusHub.repository.NotificationRepository;
import smart_op_hub.CampusHub.repository.UserRepository;
import smart_op_hub.CampusHub.repository.AdminRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Fetch all notifications for a specific user (using email).
     */
    public List<Notification> getNotificationsByUserId(String email) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(email);
    }

    /**
     * Mark a notification as read.
     */
    public Optional<Notification> markAsRead(String id) {
        return notificationRepository.findById(id).map(notification -> {
            notification.setRead(true);
            return notificationRepository.save(notification);
        });
    }

    /**
     * Create a notification. This can be called by other services.
     */
    public Notification createNotification(String userId, String message, String type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        // Find user email to use as the primary identifier (userId in Notification model)
        String userEmail = userId; // Fallback
        
        Optional<User> userById = userRepository.findById(userId);
        if (userById.isPresent()) {
            userEmail = userById.get().getEmail();
        } else {
            Optional<User> userByUsername = userRepository.findByUsername(userId);
            if (userByUsername.isPresent()) {
                userEmail = userByUsername.get().getEmail();
            } else {
                Optional<Admin> admin = adminRepository.findById(userId);
                if (admin.isPresent()) {
                    userEmail = admin.get().getEmail();
                } else {
                     // Check if it's already an email
                     if (userId.contains("@")) {
                         userEmail = userId;
                     }
                }
            }
        }

        notification.setUserId(userEmail); 
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        Notification savedNotification = notificationRepository.save(notification);

        // Send real-time notification to the user's private queue (using email)
        messagingTemplate.convertAndSendToUser(
            userEmail, 
            "/queue/notifications", 
            savedNotification
        );

        return savedNotification;
    }

    /**
     * Count unread notifications for a user.
     */
    public long countUnread(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }
}
