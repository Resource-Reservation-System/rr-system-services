const User = require('../models/User'); // Import the User model
const bcrypt = require('bcrypt');

// Add a new user
exports.addUser = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Update user details
exports.updateUser = async (req, res) => {
    const { userId } = req.params; // Get userId from request parameters
    const updates = req.body; // Get updates from request body

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId }, // Find user by userId
            updates,
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const { userId } = req.params; // Get userId from request parameters

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};