const express = require('express');
const componentController = require('../controllers/componentController');
const { protect, custodianOnly, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new component (custodian only)
router.post('/', protect, custodianOnly, componentController.addComponent);

// Get all components (available to all)
router.get('/', protect, componentController.getAllComponents);

// Get a specific component by ID
router.get('/:componentId', protect, componentController.getComponentDetails);

// Update a component (custodian only)
router.put('/:componentId', protect, custodianOnly, componentController.updateComponentDetails);

// Remove a component (custodian only)
router.delete('/:componentId', protect, custodianOnly, componentController.removeComponent);

module.exports = router;
