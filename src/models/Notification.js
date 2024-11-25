const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    component: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
    lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab' },
    details: { type: String, required: true },
    readByInCharge: { type: Boolean, required: true, default: false },
    readByStudent: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
