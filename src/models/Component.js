const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    componentId: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    custodian: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    datasheetLink: { type: String },
    tags: { type: [String] },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

componentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Component', componentSchema);
