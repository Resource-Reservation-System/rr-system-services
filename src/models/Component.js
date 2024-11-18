const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    labInCharge: { type: String }, // Optional field for lab assignment
    labIdInCharge: { type: String }, // Optional field for lab ID
    quantity: { type: Number, required: true },
    category: { type: String, enum: ['microcontrollers', 'gpus', 'drones', 'sensors', 'others'], required: true },
    datasheetLink: { type: String },
    tags: [{ type: String }],
    imageUrl: { type: String, default: 'https://via.placeholder.com/50' }, // Default image URL
}, { timestamps: true });

module.exports = mongoose.model('Component', componentSchema);