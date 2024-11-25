const Component = require('../models/Component');
const Request = require('../models/Request');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get trending header statistics
exports.getTrendingHeaderStatistics = async (req, res) => {
    try {
        // Calculate total counts for the specified metrics
        const totalApprovedReturned = await Request.countDocuments({
            status: { $in: ['approved', 'returned'] },
        });

        const totalCurrentlyReturned = await Request.countDocuments({
            status: 'returned',
        });

        const totalReturnedDamaged = await Request.countDocuments({
            status: 'returned',
            notes: /damaged/i, // Case-insensitive match for 'damaged'
        });

        const userMultipleRequests = await Request.aggregate([
            {
                $group: {
                    _id: '$userId', // Group by userId
                    requestCount: { $sum: 1 },
                },
            },
            {
                $match: {
                    requestCount: { $gt: 1 }, // Filter users with multiple requests
                },
            },
        ]);

        const penalizedReturned = await Request.countDocuments({
            status: 'returned',
            penalizedAmount: { $gt: 0 }, // Penalized requests
        });

        // Calculate percentages
        const returnPercentage =
            totalApprovedReturned > 0
                ? ((totalCurrentlyReturned / totalApprovedReturned) * 100).toFixed(2)
                : 0;

        const rejectedPercentage =
            totalApprovedReturned > 0
                ? ((1-(totalReturnedDamaged / totalCurrentlyReturned)) * 100).toFixed(2)
                : 0;

        const studentsReturnedCount =
            totalApprovedReturned > 0
                ? ((userMultipleRequests.length / totalApprovedReturned) * 100).toFixed(2)
                : 0;

        const penalizedPercentage =
            totalApprovedReturned > 0
                ? ((penalizedReturned / totalApprovedReturned) * 100).toFixed(2)
                : 0;

        // Send the response
        res.status(200).json({
            returnPercentage: parseFloat(returnPercentage),
            rejectedPercentage: parseFloat(rejectedPercentage),
            studentsReturnedCount: parseFloat(studentsReturnedCount),
            penalizedPercentage: parseFloat(penalizedPercentage),
        });
    } catch (error) {
        console.error('Error fetching trending header statistics:', error);
        res.status(500).json({ error: 'Failed to fetch trending statistics' });
    }
};

exports.getTrendingChartStatistics = async (req, res) => {
    try {
        const trends = await Request.aggregate([
            {
                $facet: {
                    // Component counts aggregation
                    componentStats: [
                        {
                            $group: {
                                _id: "$component", // Group by component ID
                                totalRequests: { $sum: 1 } // Count requests for each component
                            }
                        },
                        {
                            $lookup: {
                                from: "components", // Component collection
                                localField: "_id", // Component ID in Request collection
                                foreignField: "_id", // Component ID in Component collection
                                as: "componentDetails"
                            }
                        },
                        { $unwind: "$componentDetails" }, // Extract the first matching component
                        {
                            $project: {
                                component: "$componentDetails.name", // Use component name
                                count: "$totalRequests" // Count of requests
                            }
                        },
                        { $sort: { count: -1 } } // Sort components by request count
                    ],
                    // Status counts aggregation
                    statusStats: [
                        {
                            $group: {
                                _id: "$status", // Group by status
                                count: { $sum: 1 } // Count requests for each status
                            }
                        },
                        { $sort: { count: -1 } } // Sort by count
                    ]
                }
            }
        ]);

        const result = {
            components: trends[0].componentStats, // Component counts
            statusCounts: trends[0].statusStats.map(status => ({
                status: status._id, // Status name
                count: status.count // Count of requests with this status
            }))
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching trends data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
