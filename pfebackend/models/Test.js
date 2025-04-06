const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    Montnt: { type: Number, required: true },
    quantity: { type: Number, required: true },
    num_ration: { type: Number, required: true },
    titre_ration: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;

