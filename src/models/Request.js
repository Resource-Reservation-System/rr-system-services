const mongoose = require('mongoose');
const { updateSearchIndex } = require('./User');

const requestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    component: { type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: true },
    labInCharge: { type: String, ref: 'Lab', required: true },
    labIdInCharge: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'returned'], default: 'pending' },
    purpose: { type: String },
    notes: { type: String },
    inHold: { type: Boolean, default: false },
    fromDate: { type: Date },
    toDate: { type: Date },
    returnDate: { type: Date },
    penalizedAmount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

requestSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Request', requestSchema);
