// server/controllers/controllers.js
const jwtHelper = require("../helpers/jwt");
const collection = require("../models/User");
const Data = require("../models/Data");
const Item = require('../models/Project');
const Test = require('../models/Test');
const cloudinary = require("cloudinary").v2;
const Annonce = require('../models/Annonce');
//
exports.checkUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await collection.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwtHelper.generateToken({ email: email, role: user.role });
        return res.json({ token, user });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.signupUser = async (req, res) => {
    const { name, phoneNumber, email, password, fileBase64 } = req.body;
    try {
        const existingUser = await collection.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // const uploadResult = await cloudinary.uploader.upload(fileBase64, {
        //     resource_type: 'auto',
        //     folder: 'pdf_files'
        // });

        const newUser = new collection({
            name,
            phoneNumber,
            email,
            role: "pending",
            password,
            // fileURL: uploadResult.secure_url || '',
            fileURL: '',
        });
        await newUser.save();
        const token = jwtHelper.generateToken({ email: email, role: newUser.role });
        console.log("User created successfully:", newUser.createdAt);
        return res.status(201).json({
            message: "User created successfully",
            token: token,
            userData: newUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};
exports.createAnnonce = async (req, res) => {
    const { titre, type, date, fileBase64, fileBase64_2 } = req.body;
    try {
        const existingUser = await Annonce.findOne({ titre: titre });
        if (existingUser) {
            return res.status(409).json({ message: "annonce already exists" });
        }

        const uploadResult1 = await cloudinary.uploader.upload(fileBase64, {
            resource_type: 'auto',
            folder: 'pdf_files'
        });

        const uploadResult2 = await cloudinary.uploader.upload(fileBase64_2, {
            resource_type: 'auto',
            folder: 'pdf_files'
        });

        const newUser = new Annonce({
            titre,
            type,
            date,
            fileURL: uploadResult1.secure_url,
            fileURL2: uploadResult2.secure_url
        });
        await newUser.save();
        return res.status(201).json({
            message: "User created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.GetAnnonce = async (req, res) => {
    try {
        const annonces = await Annonce.find();
        res.json(annonces);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.deleteAnnonce = async (req, res) => {
    const { id } = req.params;
    try {
        await Annonce.findByIdAndDelete(id);
        return res.status(200).json({ message: "Annonce deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.getUsersByRole = async (req, res) => {
    try {
        const users = await collection.find({ role: "user" });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await collection.find({ role: "pending" });
        res.status(200).json(pendingUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.acceptUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        await collection.findByIdAndUpdate(userId, { role: "user" });
        res.status(200).json({ message: 'User accepted successfully' });
    } catch (error) {
        console.error('Error accepting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        await collection.findByIdAndUpdate(userId, { isDeleted: true });
        res.status(200).json({ message: 'User marked as deleted successfully' });
    } catch (error) {
        console.error('Error marking user as deleted:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getDeletedUsers = async (req, res) => {
    try {
        const deletedUsers = await collection.find({ isDeleted: true });
        res.status(200).json(deletedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.markUserAsDeleted = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await collection.findByIdAndUpdate(userId, { isDeleted: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User marked as deleted successfully' });
    } catch (error) {
        console.error('Error marking user as deleted:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markUserAsRmDeleted = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await collection.findByIdAndUpdate(userId, { isDeleted: false });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User marked as deleted successfully' });
    } catch (error) {
        console.error('Error marking user as deleted:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCodeLibelle = async (req, res) => {
    try {
        const products = await Data.find({}, 'CODE LIBELLE');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
exports.createItem = async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                item: newItem._id
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json({ items });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Failed to fetch items' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        await Item.findByIdAndDelete(itemId);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to delete item' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const { name, type } = req.body;
        const updatedItem = await Item.findByIdAndUpdate(itemId, { name, type }, { new: true });
        res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to update item' });
    }
};
;

exports.saveData = async (req, res) => {
    const { projectName, name, price, quantity, Montnt, num_ration, titre_ration } = req.body;
    try {
        const newProduct = new Test({ projectName, name, price, quantity, Montnt, num_ration, titre_ration });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error creating product:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.getData = async (req, res) => {
    try {
        const projectName = req.query.projectName;
        const products = await Test.find({ projectName });
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, price, quantity, Montnt, num_ration, titre_ration } = req.body;

    try {
        const updatedProduct = await Test.findByIdAndUpdate(productId, { name, price, quantity, Montnt, num_ration, titre_ration }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Failed to update product:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        await Test.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Failed to delete product:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

