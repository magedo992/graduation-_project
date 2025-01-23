const plantModel=require('../Model/plantModel');
const asyncHandler=require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const fertilizerModel = require('../Model/fertilizerModel');
const chemicalModel = require('../Model/chemicalsModel');





exports.createPlantView = asyncHandler(async (req, res, next) => {
    const fertilizers = await fertilizerModel.find(); 
    const chemicals = await chemicalModel.find(); 

    res.render('createPlant', { fertilizers, chemicals }); 
});
exports.create=asyncHandler(async (req,res,next)=>{
     const uploadFromBuffer = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                if (!fileBuffer) {
                    return reject(new Error('Invalid file buffer'));
                }
    
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'planet' },
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

    const planet=new plantModel({
        ...req.body,
        images: results.map(result => ({ url: result.secure_url })),
        imagesPublicIds:results.map(result=>({url:result.public_id })) 
    })
    await planet.save();
    res.status(201).json("created success");
});


exports.getAll=asyncHandler(async (req,res,next)=>{
const plants=await plantModel.find().populate({
    path:"Fertilizers",
    select:"name FertilizerType",
}).populate({path:"Chemicals",
    select:"name"},{"__id":false});

if(!plants)
{
    return res.status(404).json({message:"No plants found"});

}


res.status(200).json({
    success: true,
    count: plants.length,
    data: plants,
});
});
exports.deletepalnts=asyncHandler(async (req,res,next)=>{
    const plant=await plantModel.findOneAndDelete();

    if (!plant) {
        return res.status(404).send("plant not found");
    }

    const deleteImagePromises=plant.imagesPublicIds.map(image=>
        cloudinary.api.delete_resources(image.url),
     
    );
    await Promise.all(deleteImagePromises)

    res.status(200).send("plant deleted successfully");

})