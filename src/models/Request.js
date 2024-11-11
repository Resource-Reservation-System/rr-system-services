const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requestId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    component: { type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: true },
    custodian: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'returned'], default: 'pending' },
    notes: { type: String },
    inHold: { type: Boolean, default: false },
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
