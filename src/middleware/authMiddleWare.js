const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect route middleware (verifies user is logged in)
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Custodian-only route middleware
exports.custodianOnly = (req, res, next) => {
    if (req.user && req.user.role === 'staff') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied, custodian only' });
};

// Admin-only route middleware
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied, admin only' });
};
