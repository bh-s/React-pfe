const Evaluation = require("../models/Evaluation");

// GET all Evaluations
exports.getEvaluations = async (req, res) => {
    try {
        const Evaluations = await Evaluation.find();
        res.status(200).json(Evaluations);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// POST a new Evaluation
exports.createEvaluation = async (req, res) => {
    try {
        const newEvaluation = new Evaluation(req.body);
        await newEvaluation.save();
        res.status(201).json(newEvaluation);
    } catch (error) {
        res.status(400).json({ error: "Invalid Data" });
    }
};

// UPDATE an Evaluation
exports.updateEvaluation = async (req, res) => {
    try {
        const updatedEvaluation = await Evaluation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedEvaluation);
    } catch (error) {
        res.status(400).json({ error: "Update Failed" });
    }
};

// DELETE an Evaluation
exports.deleteEvaluation = async (req, res) => {
    try {
        await Evaluation.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Evaluation Deleted" });
    } catch (error) {
        res.status(400).json({ error: "Delete Failed" });
    }
};
