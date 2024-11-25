const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all notifications for a user
router.get('/', notificationController.getNotifications);

// Create a new notification
router.post('/', notificationController.createNotification);

// Mark a notification as read
router.patch('/:notificationId/:userRole/read/:readFlag', notificationController.markAsRead);

// Delete a notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Get notifications by labId
router.get('/lab/:labId', notificationController.getNotificationsByLabId);

// Get notifications by userId
router.get('/user/:userId', notificationController.getNotificationsByUserId);

module.exports = router;
