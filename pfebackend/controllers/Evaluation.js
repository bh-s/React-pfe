const Evaluation = require("../models/Evaluation");

exports.getEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find();
        res.status(200).json(evaluations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.createEvaluation = async (req, res) => {
    try {
        const newEvaluation = new Evaluation(req.body);
        await newEvaluation.save();
        res.status(201).json(newEvaluation);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid Data", details: error.message });
    }
};

exports.updateEvaluation = async (req, res) => {
    try {
        const updatedEvaluation = await Evaluation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedEvaluation) {
            return res.status(404).json({ error: "Evaluation Not Found" });
        }

        res.status(200).json(updatedEvaluation);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Update Failed", details: error.message });
    }
};

exports.deleteEvaluation = async (req, res) => {
    try {
        const deletedEvaluation = await Evaluation.findByIdAndDelete(req.params.id);

        if (!deletedEvaluation) {
            return res.status(404).json({ error: "Evaluation Not Found" });
        }

        res.status(200).json({ message: "Evaluation Deleted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Delete Failed", details: error.message });
    }
};
