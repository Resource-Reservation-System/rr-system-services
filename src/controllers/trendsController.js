const Component = require('../models/Component');
const Request = require('../models/Request');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getTrendingComponents = async (req, res, next) => {
    try {
        const trends = await Request.aggregate([
            {
                $group: {
                    _id: '$component',
                    requestCount: { $sum: 1 },
                }
            },
            {
                $lookup: {
                    from: 'components',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'componentDetails'
                }
            },
            { $unwind: '$componentDetails' },
            { $sort: { requestCount: -1 } },
            { $limit: 5 } 
        ]);

        res.status(200).json({
            success: true,
            message: 'Top trending components retrieved successfully',
            data: trends
        });
    } catch (error) {
        next(error); 
    }
};


exports.getTrendingUsers = async (req, res, next) => {
    try {
        const trends = await Request.aggregate([
            {
                $group: {
                    _id: '$user',
                    requestCount: { $sum: 1 },
                }
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            { $sort: { requestCount: -1 } },
            { $limit: 5 } 
        ]);

        res.status(200).json({
            success: true,
            message: 'Top trending users retrieved successfully',
            data: trends
        });
    } catch (error) {
        next(error); 
    }
};


exports.getComponentUsageStats = async (req, res, next) => {
    try {
        const { componentId } = req.params;

        const stats = await Request.aggregate([
            { $match: { component: mongoose.Types.ObjectId(componentId) } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    requestCount: { $sum: 1 },
                }
            },
            { $sort: { '_id': 1 } } 
        ]);

        res.status(200).json({
            success: true,
            message: 'Component usage statistics retrieved successfully',
            data: stats
        });
    } catch (error) {
        next(error); 
    }
};
