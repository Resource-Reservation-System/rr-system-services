const express = require('express');
const trendsController = require('../controllers/trendsController');

const router = express.Router();

// Get trending components
router.get('/headerInfo', trendsController.getTrendingHeaderStatistics);

// Get chart info
router.get('/chartInfo', trendsController.getTrendingChartStatistics);

module.exports = router;
