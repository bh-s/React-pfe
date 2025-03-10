const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    finance: { type: String, required: true },
    duration: { type: String, required: true },
    guarantees: { type: String, required: true },
});


module.exports = mongoose.model("Evaluation", OfferSchema);
