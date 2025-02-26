const { MongoCryptKMSRequestNetworkTimeoutError } = require('mongodb');
const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    fileURL: {
        type: String,
    },
    fileURL2: {
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

const Annonce = mongoose.model('Annonce', annonceSchema);

module.exports = Annonce;
