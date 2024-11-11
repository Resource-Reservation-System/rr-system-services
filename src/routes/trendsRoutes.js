const express = require('express');
const trendsController = require('../controllers/trendsController');
const { protect, custodianOnly, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Get trending components (custodian/admin)
router.get('/components', protect, custodianOnly, trendsController.getTrendingComponents);

// Get trending users (admin only)
router.get('/users', protect, adminOnly, trendsController.getTrendingUsers);

// Get component usage stats (admin/custodian)
router.get('/components/:componentId/stats', protect, custodianOnly, trendsController.getComponentUsageStats);

module.exports = router;
