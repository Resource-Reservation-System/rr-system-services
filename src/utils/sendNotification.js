const Notification = require('../models/Notification');

exports.sendNotification = async (userId, message, type = 'general') => {
    try {
        const notification = new Notification({
            user: userId,
            message,
            type,
            createdAt: new Date()
        });
        const savedNotification = await notification.save();
        return savedNotification;
    } catch (error) {
        console.error('Error sending notification:', error);
        throw new Error('Failed to send notification');
    }
};
