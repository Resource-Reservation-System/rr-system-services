const Component = require('../models/Component'); // Import your Component model

// Add a new component
exports.addComponent = async (req, res) => {
    try {
        const newComponent = new Component({
            ...req.body,
            imageUrl: req.body.imageUrl || 'https://via.placeholder.com/50'
        });
        await newComponent.save(); // Save to database
        res.status(201).json({ message: 'Component added successfully', component: newComponent });
    } catch (error) {
        res.status(400).json({ message: 'Failed to add component', error: error.message });
    }
};

// Get all components
exports.getAllComponents = async (req, res) => {
    try {
        const components = await Component.find(); // Fetch all components from the database
        res.status(200).json(components);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve components', error: error.message });
    }
};

// Get a specific component by ID
exports.getComponentDetails = async (req, res) => {
    try {
        const component = await Component.findById(req.params.componentId); // Find component by ID
        if (!component) {
            return res.status(404).json({ message: 'Component not found' });
        }
        res.status(200).json(component);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve component', error: error.message });
    }
};

// Update a component
exports.updateComponentDetails = async (req, res) => {
    try {
        const updatedComponent = await Component.findByIdAndUpdate(req.params.componentId, req.body, { new: true }); // Update component
        if (!updatedComponent) {
            return res.status(404).json({ message: 'Component not found' });
        }
        res.status(200).json({ message: 'Component updated successfully', component: updatedComponent });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update component', error: error.message });
    }
};

// Remove a component
exports.removeComponent = async (req, res) => {
    try {
        const deletedComponent = await Component.findByIdAndDelete(req.params.componentId); // Delete component
        if (!deletedComponent) {
            return res.status(404).json({ message: 'Component not found' });
        }
        res.status(200).json({ message: 'Component removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove component', error: error.message });
    }
};