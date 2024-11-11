const Request = require('../models/Request');
const errorHandler = require('../utils/errorHandler');
const { sendNotification } = require('../utils/sendNotification');

exports.createRequest = async (req, res, next) => {
    try {
        const { componentId, custodianId, notes, returnDate } = req.body;
        const request = new Request({
            user: req.user.id,
            component: componentId,
            custodian: custodianId,
            status: 'pending',
            notes,
            inHold: false,
            returnDate,
            createdAt: new Date(),
        });
        await request.save();
        await sendNotification(custodianId, `New request from ${req.user.fullName} for component ID: ${componentId}`);
        res.status(201).json({ message: 'Request created successfully', request });
    } catch (error) {
        next(error);
    }
};

exports.getUserRequests = async (req, res, next) => {
    try {
        const requests = await Request.find({ user: req.user.id }).populate('component');
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

exports.getAllRequests = async (req, res, next) => {
    try {
        const requests = await Request.find().populate('component user');
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

exports.manageRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        request.updatedAt = new Date();
        await request.save();

        await sendNotification(request.user, `Your request for component ID: ${request.component} has been ${status}`);
        res.status(200).json({ message: 'Request status updated', request });
    } catch (error) {
        next(error);
    }
};

exports.deleteRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to cancel this request' });
        }

        await Request.findByIdAndDelete(requestId);
        res.status(200).json({ message: 'Request cancelled successfully' });
    } catch (error) {
        next(error);
    }
};
