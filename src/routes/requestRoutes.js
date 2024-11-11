const express = require('express');
const requestController = require('../controllers/requestController');
const { protect, custodianOnly, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Student can create a request
router.post('/', protect, requestController.createRequest);

// Student can view their own requests
router.get('/user', protect, requestController.getUserRequests);

// Custodian or Admin can view all requests
router.get('/all', protect, custodianOnly, requestController.getAllRequests);

// Custodian or Admin can approve/reject requests
router.patch('/:requestId', protect, custodianOnly, requestController.manageRequest);

// Student can cancel their own request
router.delete('/:requestId', protect, requestController.deleteRequest);

module.exports = router;
