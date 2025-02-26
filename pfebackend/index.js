const express = require("express");
const { connectDB } = require("./config/db");
const cloudinary = require("cloudinary").v2;
const userRoutes = require("./Routes/userRoutes");
require('dotenv').config();
const bodyParser = require('body-parser');

const cors = require("cors");
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

connectDB();
cloudinary.config({
    cloud_name: 'dbxkj0sjq',
    api_key: '361757677745139',
    api_secret: 'TQ-zzUKpyRmi57s-SdxsT5Efrs8'
});
app.use("/", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
