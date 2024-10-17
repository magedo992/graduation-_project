const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require('dotenv').config();

cloudinary.config({
  cloud_name: 'duscvark1',
  api_key: process.env.api_key,
  api_secret: process.env.API_secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "UserProfile", 
    allowed_formats: ['jpg', 'png'], 
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };