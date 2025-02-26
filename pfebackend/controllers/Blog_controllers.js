const Blog = require('../models/Blog');

exports.saveBlog = async (req, res) => {
    const { titre, porte, article, declaration, licences_engagement, credit_payment } = req.body;
    try {
        const newBlog = new Blog({ titre, porte, article, declaration, licences_engagement, credit_payment });

        const validationError = newBlog.validateSync();
        if (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        console.error('Error creating', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getBlog = async (req, res) => {
    try {
        const setBlog = await Blog.find();
        res.json({ setBlog });
    } catch (error) {
        console.error('Error fetching Blog:', error);
        res.status(500).json({ message: 'Failed to fetch' });
    }
};
exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    const { credit_payment, licences_engagement, declaration, article, porte, titre } = req.body;
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, { credit_payment, licences_engagement, declaration, article, porte, titre }, { new: true });
        res.json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(deletedBlog);
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Internal server error' }); // En cas d'erreur, renvoyer une réponse d'erreur interne du serveur
    }
};
exports.getTotalPaymentByPorte = async (req, res) => {
    try {
        const totalPayments = await Blog.aggregate([
            {
                $group: {
                    _id: "$porte",
                    total_licences_engagement: { $sum: "$licences_engagement" },
                    total_credit_payment: { $sum: "$credit_payment" }
                }
            }
        ]);
        res.json(totalPayments);
    } catch (error) {
        console.error('Error calculating total payments by porte:', error);
        res.status(500).json({ message: 'Failed to calculate total payments by porte' });
    }
};
