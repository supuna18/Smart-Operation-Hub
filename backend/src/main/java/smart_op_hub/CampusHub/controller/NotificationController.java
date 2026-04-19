package smart_op_hub.CampusHub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart_op_hub.CampusHub.model.Notification;
import smart_op_hub.CampusHub.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * GET /api/notifications/{userId}
     * Fetch notifications for the logged-in user.
     */
    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable String userId) {
        return notificationService.getNotificationsByUserId(userId);
    }

    /**
     * GET /api/notifications/unread-count/{userId}
     * Fetch the count of unread notifications.
     */
    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.countUnread(userId));
    }

    /**
     * PATCH /api/notifications/{id}/read
     * Mark a specific notification as read.
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        return notificationService.markAsRead(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
