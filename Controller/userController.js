const userModel = require('../Model/UserModel');
const asyncHandler = require('express-async-handler');
const { ErrorHandler } = require('../Utils/ErrorHandler');
const { cloudinary } = require('../Middelware/uploadImage');
const { uploadFromBase64 } = require('../Utils/uploadImage');

exports.updateUserData = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const allowedUpdates = ['username', 'phone', 'gender', 'city', 'state', 'birthDay'];
    const updates = {};

   
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

   
    if (req.file && req.file.base64) {
        try {
           
            if (user.imagePublicIds && user.image !== 'default.png') {
                await cloudinary.uploader.destroy(user.imagePublicIds);
            }

            const result = await uploadFromBase64(req.file.base64);
            updates.image = result.secure_url;
            updates.imagePublicIds = result.public_id;
        } catch (error) {
            console.error("Image update failed:", error);
            return next(new ErrorHandler("Image upload failed", 500));
        }
    }

    const updatedUser = await userModel.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        message: "User updated successfully",
        userData: updatedUser,
    });
});

exports.deleteUser=asyncHandler(async(req,res,next)=>{
    
    
     const user = await userModel.findByIdAndDelete(req.user.id);
     if(!user)
     {
        return next(new ErrorHandler("user not found ...",404));
    
     }

    
     

     if (user.imagePublicIds && user.image !== 'default.png') {
        try {
            await cloudinary.uploader.destroy(user.imagePublicIds);
            
            
        } catch (error) {
            console.error("Cloudinary image deletion failed:", error);
            return next(new ErrorHandler("Failed to delete image from Cloudinary", 500));
        }
    }
            return res.status(200).json({
                "message":"deleted account success"
            })

})