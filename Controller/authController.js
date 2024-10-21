
const userModel=require('../Model/UserModel');
const {generateToken}=require('../Utils/generateToken');
const {cloudinary}=require('../Middelware/uploadImage');

const asyncHandler=require('express-async-handler');
const {ErrorHandler}=require('../Utils/ErrorHandler');
const {sendEmail}=require('../Utils/EmailSender');
const bcrypt=require('bcrypt');
const generateActivationCode = () => {
    return Math.floor(1000 + Math.random() * 9000); 
  };



const streamifier = require('streamifier');

exports.signUp = asyncHandler(async (req, res, next) => {
    const { email, password, phone, gender, address, username } = req.body;
    if(!email||!password)
    {
        return res.status(400).json({
            "message":"Email or password is required"
        })
    }
    const existUser = await userModel.findOne({ email: email });
    
    if (existUser) {
        return next(new ErrorHandler("User already exists", 400));
    }

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

   const activationCode=generateActivationCode();
    const user = await userModel.create({
        email: email,
        password: password,
        gender: gender,
        phone: phone,
        userName: username,
        activationCode:activationCode
    });

    
    user.image = result ? result.secure_url : "default.png";
    user.imagePublicIds = result ? result.public_id : null;

    
    await user.save();
    const options={
        to:user.email,
        from:process.env.email,
        subject:'activation account',
        html:`<html> <!-- Paste the HTML content here, replacing variables with actual data -->
         <p>Hi ${username},</p>
         <p>Your activation code is:</p>
         <div class="activation-code">${activationCode}</div>
         <p>Please enter this code to activate your account.</p>
         <p>Thank you, <br>The YourApp Team</p>
         </html>`
    }
    sendEmail(options)

    res.status(201).json({
        status: "success",
        message:"Signup successful! Please check your email for the activation code.",
        
    });
});


exports.activateAccount = asyncHandler (async (req, res) => {
    const { email, activationCode } = req.body;
  
   
      
      if (!email || !activationCode) {
        return res.status(400).json({ message: 'Email and activation code are required' });
      }
  
      
      const user = await userModel.findOne({ email, activationCode });
      if (!user) {
        return res.status(400).json({ message: 'Invalid activation code or email' });
      }
  
      if (user.isActive) {
        return res.status(400).json({ message: 'Account is already activated' });
      }
      const token = await generateToken({ id: user._id });
      user.token = token;
      user.isActive = true;
      user.activationCode = undefined; 
      await user.save();
  
      res.status(200).json({ message: 'Account activated successfully!',"token":user.token });
   
  });

  exports.SendactivationCode=asyncHandler(async (req,res,next)=>{
    const {email}=req.body;
    const user=await userModel.findOne({email:email});
    if(!user)
    {
        return res.status(404).json({
            'message':'Ivalid Email'
        });
    }

    if(user.isActive)
    {
        return res.status(400).json({ message: 'Account is already activated' });
    }

    const activationCode=generateActivationCode();
    user.activationCode=activationCode;
    await user.save();
    const options={
        to:user.email,
        from:process.env.email,
        subject:'activation account',
        html:`<html> <!-- Paste the HTML content here, replacing variables with actual data -->
         <p>Hi ${user.userName},</p>
         <p>Your activation code is:</p>
         <div class="activation-code">${activationCode}</div>
         <p>Please enter this code to activate your account.</p>
         <p>Thank you, <br>The YourApp Team</p>
         </html>`
    }
    sendEmail(options)
res.status(200).json({"message":"Please check your email for the activation code."});
})



  
