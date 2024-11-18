const express = require('express');
const { 
    addUser,
    getAllUsers,
    updateUser,
    deleteUser 
} = require('../controllers/userController');

const router = express.Router();

// Route to add a new user
router.post('/', addUser);

// Route to get all users
router.get('/', getAllUsers);

// Route to update user details
router.put('/:userId', updateUser);

// Route to delete a user
router.delete('/:userId', deleteUser);

module.exports = router;