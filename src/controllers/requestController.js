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
