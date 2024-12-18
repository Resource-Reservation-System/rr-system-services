const Request = require('../models/Request');
const errorHandler = require('../utils/errorHandler');
const { sendNotification } = require('../utils/sendNotification');

exports.createRequest = async (req, res, next) => {
    try {
        const { componentId, userId, fromDate, toDate, purpose, labInCharge, labIdInCharge } = req.body;
        const request = new Request({
            userId,
            component: componentId,
            labInCharge,
            labIdInCharge,
            status: 'pending',
            inHold: false,
            fromDate,
            toDate,
            purpose,
            notes: '',
            createdAt: new Date(),
        });
        await request.save();
        // await sendNotification(`New request for component ID: ${componentId}`);
        res.status(201).json({ message: 'Request created successfully', request });
    } catch (error) {
        next(error);
    }
};

exports.getUserRequestsByLabId = async (req, res, next) => {
    const labId = req.query.labId;

    try {
        const requests = await Request.find({ labIdInCharge: labId })
            .populate({
                path: 'userId', 
                select: 'fullName email'
            })
            .populate({
                path: 'component',
                select: 'name quantity' 
            });

        if (!requests.length) {
            return res.status(404).json({ message: 'No requests found for this lab' });
        }

        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

exports.getUserRequestsByUserId = async (req, res, next) => {
    const userId = req.query.userId;

    try {
        const requests = await Request.find({ userId: userId })
            .populate({
                path: 'userId', 
                select: 'fullName'
            })
            .populate({
                path: 'component',
                select: 'name' 
            });

        if (!requests.length) {
            return res.status(404).json({ message: 'No requests found for this lab' });
        }

        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};


exports.updateRequestDetails = async (req, res) => {
    const { id } = req.params;
    const { status, purpose, fromDate, toDate, inHold, notes, penalizedAmount } = req.body;

    try {
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status, purpose, fromDate, toDate, inHold, notes, penalizedAmount }, 
            { new: true } 
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update request', error: error.message });
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

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await Request.findByIdAndDelete(requestId);
        res.status(200).json({ message: 'Request cancelled successfully' });
    } catch (error) {
        next(error);
    }
};
