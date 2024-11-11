const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all notifications for a user
router.get('/', protect, notificationController.getNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', protect, notificationController.markAsRead);

// Delete a notification
router.delete('/:notificationId', protect, notificationController.deleteNotification);

module.exports = router;
