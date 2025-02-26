// models/Data.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    CODE: {
        type: Number,
        required: true,
    },
    LIBELLE: {
        type: String,
        required: true,
    },

});

const data = mongoose.model("data", productSchema);

module.exports = data;
