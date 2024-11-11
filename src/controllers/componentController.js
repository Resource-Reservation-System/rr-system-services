const Component = require('../models/Component');
const errorHandler = require('../utils/errorHandler');

exports.addComponent = async (req, res, next) => {
    try {
        const { name, description, custodian, imageUrl, datasheetLink, tags, quantity, category } = req.body;
        const component = new Component({
            name,
            description,
            custodian,
            imageUrl,
            datasheetLink,
            tags,
            quantity,
            category,
            createdAt: new Date(),
        });
        await component.save();
        res.status(201).json({ message: 'Component added successfully', component });
    } catch (error) {
        next(error);
    }
};

exports.getAllComponents = async (req, res, next) => {
    try {
        const components = await Component.find();
        res.status(200).json(components);
    } catch (error) {
        next(error);
    }
};

exports.getComponentDetails = async (req, res, next) => {
    try {
        const { componentId } = req.params;
        const component = await Component.findById(componentId);
        if (!component) {
            return res.status(404).json({ message: 'Component not found' });
        }
        res.status(200).json(component);
    } catch (error) {
        next(error);
    }
};

exports.updateComponentDetails = async (req, res, next) => {
    try {
        const { componentId } = req.params;
        const updatedData = req.body;
        updatedData.updatedAt = new Date();
        
        const updatedComponent = await Component.findByIdAndUpdate(componentId, updatedData, { new: true });
        if (!updatedComponent) {
            return res.status(404).json({ message: 'Component not found' });
        }
        res.status(200).json({ message: 'Component updated successfully', updatedComponent });
    } catch (error) {
        next(error);
    }
};

exports.removeComponent = async (req, res, next) => {
    try {
        const { componentId } = req.params;
        const component = await Component.findByIdAndDelete(componentId);
        if (!component) {
            return res.status(404).json({ message: 'Component not found' });
        }
        res.status(200).json({ message: 'Component removed successfully' });
    } catch (error) {
        next(error);
    }
};
