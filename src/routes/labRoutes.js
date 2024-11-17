const express = require('express');
const {
    getAllLabs,
    addLab,
    updateUserLabInCharge,
    removeLab
} = require('../controllers/labController'); // Import controller functions

const router = express.Router();

// Get all available labs
router.get('/', getAllLabs);

// Add a new lab
router.post('/', addLab);

// Update user's labInCharge
router.put('/:userId', updateUserLabInCharge);

// Remove a lab
router.delete('/:labId', removeLab);

module.exports = router;