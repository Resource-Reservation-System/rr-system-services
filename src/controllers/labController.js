const Lab = require('../models/Lab'); // Import the Lab model
const User = require('../models/User'); // Import the User model

// Get all available labs
exports.getAllLabs = async (req, res) => {
    try {
        const labs = await Lab.find(); // Fetch all labs from the database
        res.status(200).json(labs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching labs', error });
    }
};

// Add a new lab
exports.addLab = async (req, res) => {
    const { name } = req.body; // Get the lab name from request body

    if (!name) {
        return res.status(400).json({ message: 'Lab name is required' });
    }

    try {
        const newLab = new Lab({ name });
        await newLab.save(); // Save the new lab to the database
        res.status(201).json({ message: 'Lab added successfully', lab: newLab });
    } catch (error) {
        res.status(500).json({ message: 'Error adding lab', error });
    }
};

// Update user's labInCharge
exports.updateUserLabInCharge = async (req, res) => {
    const { labInCharge } = req.body; // Get labInCharge from request body

    try {
        const user = await User.findOneAndUpdate(
            { userId: req.params.userId }, // Assuming you use userId to identify users
            { labInCharge },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Lab assigned successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating lab in charge', error });
    }
};

// Remove a lab
exports.removeLab = async (req, res) => {
    try {
        const deletedLab = await Lab.findByIdAndDelete(req.params.labId);
        
        if (!deletedLab) {
            return res.status(404).json({ message: 'Lab not found' });
        }

        res.status(200).json({ message: 'Lab removed successfully', deletedLab });
    } catch (error) {
        res.status(500).json({ message: 'Error removing lab', error });
    }
};