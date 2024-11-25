const Notification = require('../models/Notification');

// Get all notifications for the logged-in user
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};


// Mark a notification as read
exports.markAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const { readFlag } = req.params;
        const { userRole } = req.params;
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if(userRole === 'staff')
            notification.readByInCharge = readFlag;
        else if (userRole === 'student')
            notification.readByStudent = readFlag;
        await notification.save();
        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        next(error);
    }
};

// Delete a notification
exports.deleteNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findByIdAndDelete(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get notifications by lab ID
exports.getNotificationsByLabId = async (req, res, next) => {
    try {
        const { labId } = req.params;
        const notifications = await Notification.find({ lab: labId }).sort({ createdAt: -1 })
                            .populate({
                                path: 'component', 
                                select: 'name'
                            });
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for the lab' });
        }
        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};

// Get notifications by user ID
exports.getNotificationsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 })
                            .populate({
                                path: 'component', 
                                select: 'name'
                            });
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for the user' });
        }
        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};

// Create a new notification
exports.createNotification = async (req, res, next) => {
    const { user, component, lab, details, isRead } = req.body;

    // Validate required fields
    if (!user || !details) {
        return res.status(400).json({ error: 'User and details are required' });
    }

    try {
        const newNotification = new Notification({
            user,
            component,
            lab,
            details,
            isRead: isRead || false, // Default to false if not provided
        });

        const savedNotification = await newNotification.save();
        res.status(201).json({ message: 'Notification created successfully' });
    } catch (error) {
        next(error);
    }
};
