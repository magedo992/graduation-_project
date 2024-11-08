const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const fertilizerModel = require('../Model/fertilizerModel');
const asyncHandler = require('express-async-handler');
const {ErrorHandler} = require('../Utils/ErrorHandler'); 

exports.create = asyncHandler(async (req, res, next) => {
    // Function to upload a file buffer to Cloudinary
    const uploadFromBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
            if (!fileBuffer) {
                return reject(new Error('Invalid file buffer'));
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'Fertilizer' },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            );

            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });
    };

   
    if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("No files uploaded", 400));
    }

    
    const uploadPromises = req.files.map(file => uploadFromBuffer(file.buffer));
    const results = await Promise.all(uploadPromises);

   
    const fertilizer = new fertilizerModel({
        ...req.body,
        images: results.map(result => ({ url: result.secure_url })) 
    });

    await fertilizer.save();
    res.status(201).send(fertilizer);
});
