const cloudinary = require("cloudinary").v2;
const functions = require('firebase-functions')

const config = functions.config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// cloud_name: config.cloud.name,
// api_key: config.cloud.api_key,
// api_secret: config.cloud.secret


module.exports = cloudinary