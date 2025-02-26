// server/models/user.js
const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false
    },
    fileURL: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const collection = mongoose.model("collection", newSchema)

module.exports = collection
