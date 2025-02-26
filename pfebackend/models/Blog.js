const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    porte: {
        type: Number,
        required: false,
    },
    titre: {
        type: String,
        required: false,
    },
    article: {
        type: Number,
        required: false,
    },
    declaration: {
        type: String,
        required: false,
    },
    licences_engagement: {
        type: Number,
        required: false,
    },
    credit_payment: {
        type: Number,
        required: false,
    },
    total_credit_payment: {
        type: Number,
    },
    total_licences_engagement: {
        type: Number,
    }
});

blogSchema.pre('save', function (next) {
    this.total_credit_payment = this.credit_payment;
    this.total_licences_engagement = this.licences_engagement;
    next();
});

const blog = mongoose.model("blog", blogSchema);

module.exports = blog;
