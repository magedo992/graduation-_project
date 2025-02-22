const plantModel=require('../Model/plantModel');
const asyncHandler=require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const {ErrorHandler}=require('../Utils/ErrorHandler.js');





exports.createPlantView = asyncHandler(async (req, res, next) => {
 

    res.render('createPlant'); 
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
const plants=await plantModel.find({},{"__v":false});

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

});

exports.getOne=asyncHandler(async (req,res,next)=>{
    const plant=await plantModel.findById(req.params.Id);
    console.log(plant);
    
    if(!plant)
    {
        return res.status(404).json({"message":"plant not found"});

    }
    return res.status(200).json({data:plant});

})