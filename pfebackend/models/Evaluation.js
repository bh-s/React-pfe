const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    finance: { type: String, required: false },
    duration: { type: String, required: false },
    guarantees: { type: String, required: false },
});


module.exports = mongoose.model("Evaluation", OfferSchema);
