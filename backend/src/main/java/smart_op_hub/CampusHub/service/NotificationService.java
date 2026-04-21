package smart_op_hub.CampusHub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_op_hub.CampusHub.model.Notification;
import smart_op_hub.CampusHub.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Fetch all notifications for a specific user.
     */
    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
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
        Notification savedNotification = notificationRepository.save(notification);

        // Send real-time notification to the user
        messagingTemplate.convertAndSendToUser(
            userId, 
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
