
const userModel=require('../Model/UserModel');
const {generateToken}=require('../Utils/generateToken');
const {cloudinary}=require('../Middelware/uploadImage');

const asyncHandler=require('express-async-handler');
const {ErrorHandler}=require('../Utils/ErrorHandler');
const bcrypt=require('bcrypt');


const streamifier = require('streamifier');




exports.signUp = asyncHandler(async (req, res, next) => {
    const { email, password, phone, gender, address, username } = req.body;
    const existUser = await userModel.findOne({ email: email });
    
    if (existUser) {
        return next(new ErrorHandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 11);

  
    const uploadFromBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
            if (!fileBuffer) {
                return reject(new Error('Invalid file buffer'));
            }

            const uploadStream = cloudinary.uploader.upload_stream({ folder: 'UserProfile' }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });

            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });
    };

    let result = null;

    
    if (req.file) {
        try {
            result = await uploadFromBuffer(req.file.buffer);
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
        }
    }

   
    const user = await userModel.create({
        email: email,
        Password: hashedPassword,
        gender: gender,
        phone: phone,
        userName: username,
    });

    
    user.image = result ? result.secure_url : "default.png";
    user.imagePublicIds = result ? result.public_id : null;

    const token = await generateToken({ id: user._id });
    user.token = token;
    await user.save();

    res.status(201).json({
        status: "success",
        message: "Created successfully",
        token: token
    });
});
