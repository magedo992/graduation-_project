const Chemical = require('../models/chemicalModel');
const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');


const uploadFromBuffer = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer) {
            return reject(new Error('Invalid file buffer'));
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'Chemicals' },
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


exports.create = asyncHandler(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new Error("No files uploaded", 400));
    }

    const uploadPromises = req.files.map(file => uploadFromBuffer(file.buffer));
    const results = await Promise.all(uploadPromises);

    const chemical = new Chemical({
        ...req.body,
        images: results.map(result => ({ url: result.secure_url }))
    });

    await chemical.save();
    res.status(201).send(chemical);
});


exports.getAllChemicals = asyncHandler(async (req, res) => {
    const chemicals = await Chemical.find();
    res.json(chemicals);
});


exports.getChemicalById = asyncHandler(async (req, res) => {
    const chemical = await Chemical.findById(req.params.id);
    if (!chemical) return res.status(404).json({ message: 'Chemical not found' });
    res.json(chemical);
});


exports.updateChemical = asyncHandler(async (req, res) => {
    const chemical = await Chemical.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chemical) return res.status(404).json({ message: 'Chemical not found' });
    res.json(chemical);
});


exports.deleteChemical = asyncHandler(async (req, res) => {
    const chemical = await Chemical.findByIdAndDelete(req.params.id);
    if (!chemical) return res.status(404).json({ message: 'Chemical not found' });
    res.json({ message: 'Chemical deleted' });
});
