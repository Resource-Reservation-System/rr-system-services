const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Lab', labSchema);