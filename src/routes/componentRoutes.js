const express = require('express');
const componentController = require('../controllers/componentController');
const { protect, custodianOnly, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new component (custodian only)
router.post('/', componentController.addComponent);

// Get all components (available to all)
router.get('/', componentController.getAllComponents);

// Get a specific component by ID
router.get('/:componentId', componentController.getComponentDetails);

// Get a specific component by ID
router.get('/quantity/:componentId', componentController.getComponentQuantity);

// Update a component (custodian only)
router.put('/:componentId', componentController.updateComponentDetails);

// Remove a component (custodian only)
router.delete('/:componentId', componentController.removeComponent);

module.exports = router;
