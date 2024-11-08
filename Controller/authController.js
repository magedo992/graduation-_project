const userModel=require('../Model/UserModel')
const {generateToken}=require('../Utils/generateToken');
const {cloudinary}=require('../Middelware/uploadImage');

const asyncHandler=require('express-async-handler');
// const {ErrorHandler}=require('../Utils/ErrorHandler');
const {ErrorHandler} = require('../Utils/ErrorHandler');
const {sendEmail}=require('../Utils/EmailSender');
const bcrypt=require('bcrypt');
const generateActivationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); 
  };



const streamifier = require('streamifier');

exports.signUp = asyncHandler(async (req, res, next) => {
    const { email, password, phone, gender, city,state, username } = req.body;
    if(!email||!password)
    {
        return res.status(400).json({
            "message":"Email or password is required"
        })
    }
    const existUser = await userModel.findOne({ email: email });
    
    if (existUser) {
        return next(new ErrorHandler("User already exists", 404));
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
        activationCode:activationCode,
        googleId:null,
        city:city,
        state:state
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
         <p>Thank you, <br>نبتة</p>
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

exports.login=asyncHandler(async (req,res,next)=>{
    const {email,password}=req.body;
    const user=await userModel.findOne({email});
    if(!user)
    {
        return res.status(404).json({'message':"User not found!"});
    }
    if(!user.isActive)
    {
        
            const options={
                to:user.email,
                from:process.env.email,
                subject:'activation account',
                html:`<html> <!-- Paste the HTML content here, replacing variables with actual data -->
                 <p>Hi ${username},</p>
                 <p>Your activation code is:</p>
                 <div class="activation-code">${activationCode}</div>
                 <p>Please enter this code to activate your account.</p>
                 <p>Thank you, <br>The Nabta Team</p>
                 </html>`
            }
            sendEmail(options)
        
            return res.status(200).json({"message":"Please check your email for the activation code."});
    }
    const hasedPassword=await bcrypt.compare(password,user.password);
    console.log(hasedPassword);
    
    if(!hasedPassword)
    {
        return res.status(400).json({
            "message":"Invalid Email or Password"
        })
    }
    const token=await generateToken({id:user._id});
    user.token=token;
   await user.save();

   res.status(200).json({'message':"login success",token:token});

})

  
exports.SendForgetPasswordCode=asyncHandler(async (req,res,next)=>{
    const {email}=req.body;
    const user=await userModel.findOne(email);
    if(!user){
        return next(new ErrorHandler("User not exist",404));
    }
    user.resetPasswordToken=generateActivationCode();
    user.resetPasswordExpires=Date.now()+3600000 ;
    await user.save();
    const option={
        from:process.env.email,
        to :user.email,
        subject:"reset password",
        html:`<html>
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #333333;">Password Reset Request</h2>
                    <p style="font-size: 16px; color: #555555;">Hello ${user.userName},</p>
                    <p style="font-size: 16px; color: #555555;">
                        We received a request to reset your password. Use the code below to reset your password. This code will expire in 1 hour.
                    </p>
                    <div style="font-size: 24px; font-weight: bold; color: #333333; margin: 20px 0; text-align: center;">
                        ${user.resetPasswordToken}
                    </div>
                    <p style="font-size: 16px; color: #555555;">
                        If you did not request a password reset, please ignore this email or contact our support.
                    </p>
                    <p style="font-size: 16px; color: #555555;">
                        Thank you,<br>
                        The Support Team
                    </p>
                </div>
            </body>
        </html>`
    }
    await sendEmail(option);
    res.status(200).json({ success: true, message: "Password reset code sent to email" });
});

exports.CodeForgetPassowrd=asyncHandler(async (req,res,next)=>{
    const user = await userModel.findOne({
        resetPasswordToken: req.body.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if(!user)
    {
        return res.status(400).send('Password reset token is invalid or has expired.');
    }
    
    res.status(200).json({"message":""})

})