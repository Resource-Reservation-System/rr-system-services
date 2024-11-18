const express = require('express');
const requestController = require('../controllers/requestController');
const { protect, custodianOnly, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();


// Student can create a request
router.post('/', requestController.createRequest);

//Staff or Admin can view all requests corresponding to them
router.get('/', requestController.getUserRequestsByLabId);

// Student can view their own requests
router.get('/user', requestController.getUserRequestsByUserId);

// Custodian or Admin can view all requests
router.get('/all', custodianOnly, requestController.getAllRequests);

// Custodian or Admin can approve/reject requests
router.patch('/:requestId', custodianOnly, requestController.manageRequest);

// Student can cancel their own request
router.delete('/:requestId', requestController.deleteRequest);

module.exports = router;
