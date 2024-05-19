const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LostObjectSchema = new Schema({
    size: { type: String, required: true },
    color: { type: String, required: true },
    material: { type: String, required: true },
    brand: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LostObject', LostObjectSchema);
