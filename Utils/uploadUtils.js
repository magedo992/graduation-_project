
const streamifier = require('streamifier');
const { cloudinary } = require('../Middelware/uploadImage'); 

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @param {string} folder - The folder in Cloudinary where the file will be stored.
 * @returns {Promise<Object>} - The Cloudinary upload result (contains URL, public_id, etc.).
 */
const uploadFromBuffer = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder }, // Dynamic folder name
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

module.exports = { uploadFromBuffer };