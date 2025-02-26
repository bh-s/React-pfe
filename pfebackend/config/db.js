// server/config/config.js
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // serverSelectionTimeoutMS: 5000, // Augmentez ce timeout
            // socketTimeoutMS: 45000,
            ssl: true,
            tlsAllowInvalidCertificates: true // Temporaire pour le debug
        });
        console.log("MongoDB connecté avec succès");
    } catch (error) {
        console.error("Erreur de connexion à MongoDB :", error);
        process.exit(1);
    }
};

module.exports = { connectDB };