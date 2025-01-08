const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const fertilizerModel = require('../Model/fertilizerModel');
const asyncHandler = require('express-async-handler');
const {ErrorHandler} = require('../Utils/ErrorHandler'); 

exports.create = asyncHandler(async (req, res, next) => {
   
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
        images: results.map(result => ({ url: result.secure_url })),
        imagesPublicIds:results.map(result=>({url:result.public_id })) 
    });


    await fertilizer.save();
    res.status(201).send(fertilizer);
});


exports.delete= asyncHandler(async (req,res,next)=>{
    const id=req.params.Fertilizer_id;
    const fertilizer=await fertilizerModel.findByIdAndDelete(id);

    if(!fertilizer)
    {
        return res.status(404).json({"message":"fertilizer not found"});
    }  
    const deleteImagePromises = fertilizer.imagesPublicIds.map(image =>
        cloudinary.api.delete_resources(image.url),
  );
    
        await Promise.all(deleteImagePromises);

       
        res.status(200).json({ message: "Fertilizer deleted successfully" });
})

exports.showAll=asyncHandler(async (req,res,next)=>{
   const fertilizer=await fertilizerModel.find({},{"__v":false,"imagesPublicIds":false,"images._id":false});
   res.status(200).json({"data":fertilizer});
})
