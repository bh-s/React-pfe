const Ouverture = require('../models/Ouverture');

// Fetch all rows for a project
const getRows = async (req, res) => {
    const { projectName } = req.params;
    try {
        const rows = await Ouverture.find({ projectName });
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rows', error });
    }
};

// Add a new row
const addRow = async (req, res) => {
    const { projectName } = req.params;
    const newRow = { projectName, ...req.body };
    try {
        const createdRow = await Ouverture.create(newRow);
        res.status(201).json(createdRow);
    } catch (error) {
        res.status(400).json({ message: 'Error adding row', error });
    }
};

// Delete a row
const deleteRow = async (req, res) => {
    const { id } = req.body;
    try {
        await Ouverture.findByIdAndDelete(id);
        res.status(200).json({ message: 'Row deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting row', error });
    }
};

// Update a row
const updateRow = async (req, res) => {
    const { id } = req.params;  // Extract the row ID from the URL
    const updatedData = req.body;  // Extract the updated data from the request body

    try {
        // Find the row by ID and update it with the new data
        const updatedRow = await Ouverture.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedRow) {
            return res.status(404).json({ message: 'Row not found' });
        }

        res.status(200).json(updatedRow);  // Send the updated row back in the response
    } catch (error) {
        res.status(500).json({ message: 'Error updating row', error });
    }
};

module.exports = { getRows, addRow, deleteRow, updateRow };

