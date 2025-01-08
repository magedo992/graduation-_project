const chemicalModel = require('../Model/chemicalsModel');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


const uploadFromBuffer = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'Chemicals' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};


exports.viewAll = asyncHandler(async (req, res, next) => {
    const chemicals = await chemicalModel.find();
    console.log(chemicals);
    res.render('viewAll.ejs', { chemicals });
});


exports.viewOne = asyncHandler(async (req, res, next) => {
    const chemical = await chemicalModel.findById(req.params.id);
    if (!chemical) {
        return res.status(404).send("Chemical not found");
    }
    res.render('/viewOne', { chemical });
});


exports.create = asyncHandler(async (req, res, next) => {
    const uploadPromises = req.files.map(file => uploadFromBuffer(file.buffer));
    const results = await Promise.all(uploadPromises);

    const chemical = new chemicalModel({
        ...req.body,
        images: results.map(result => ({ url: result.secure_url })),
        imagesPublicIds:results.map(result=>({url:result.public_id })) 
    });

    await chemical.save();
    res.status(201).redirect('/chemical/viewChemicals');
});


exports.update = asyncHandler(async (req, res, next) => {
    const chemical = await chemicalModel.findById(req.params.id);
    if (!chemical) {
        return res.status(404).send("Chemical not found");
    }

    Object.assign(chemical, req.body);
    await chemical.save();
    res.status(200).send(chemical);
});


exports.delete = asyncHandler(async (req, res, next) => {
    
    const chemical = await chemicalModel.findByIdAndDelete(req.params.id);
    if (!chemical) {
        return res.status(404).send("Chemical not found");
    }

    const deleteImagePromises=chemical.imagesPublicIds.map(image=>
        cloudinary.api.delete_resources(image.url),
     
    );
    await Promise.all(deleteImagePromises)

    res.status(200).send("Chemical deleted successfully");
});

