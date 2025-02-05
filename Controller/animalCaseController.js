const asyncHandler=require('express-async-handler');
const animalCaseModel=require('../Model/animalCaseModel');
const {ErrorHandler}=require('../Utils/ErrorHandler');
const streamifier = require('streamifier');
const {cloudinary}=require('../Middelware/uploadImage');



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
exports.createAnimalForm=asyncHandler(async (req,res)=>{
    const {
        animalType,
        originDetermination,
        diagnosticQuestions,
        contactInformation,
        images
    } = req.body;


    let result = null;
    if (req.file && req.file.base64) {
      try {
        result = await uploadFromBuffer(req.file.base64);
      } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
      }
    }

const animalCase = await animalCaseModel.create({
    animalType,
    originDetermination,
    diagnosticQuestions,
    contactInformation,
   image: result ? result.secure_url : "default.png",
      imagePublicIds: result ? result.public_id : null
});
res.status(201).json({
    success: true,
    message: "Animal case created successfully",
    data: animalCase
});
});
