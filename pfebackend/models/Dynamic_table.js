const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    point_duree_execution: { type: String, default: "" },
    point_duree_garantie: { type: String, default: "" },
    point_offre_financiere: { type: String, default: "" },
    ordre: { type: String, default: "" },
    duree_execution: { type: String, default: "" },
    duree_garantie: { type: String, default: "" }
}, { _id: false });

const ProductSupplierSchema = new mongoose.Schema({
    unitPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    titre_ration: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    suppliers: [ProductSupplierSchema]
});

const ProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true, unique: true },
    products: [ProductSchema],
    suppliers: [SupplierSchema]
}, { timestamps: true });

module.exports = mongoose.model("DynamicTable", ProjectSchema);
