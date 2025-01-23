const userModel=require('../Model/UserModel')
const {generateToken}=require('../Utils/generateToken');
const {cloudinary}=require('../Middelware/uploadImage');
const {uploadFromBase64}=require('../Utils/uploadImage');
const {sendActivationcode ,sendForgetPasswordCode}=require('../templates/activationEmail');
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
    const { email, password, phone, gender, city, state, username, birthDay } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        "message": "Email or password is required"
      });
    }
  
    const existUser = await userModel.findOne({ email: email });
    if (existUser) {
        
      return next(new ErrorHandler("User already exists", 409));
      
    }
    
      
  
    let result = null;
    if (req.file && req.file.base64) {
      try {
        result = await uploadFromBase64(req.file.base64);
      } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
      }
    }
  
    let activationCode = generateActivationCode();
    
    //console.log("before save");
    
    const user = await userModel.create({
      ...req.body,
      activationCode: await bcrypt.hash(activationCode.toString(),10),
      image: result ? result.secure_url : "default.png",
      imagePublicIds: result ? result.public_id : null
    });
   // console.log("after save");
    
  
    await user.save();
  activationCode=activationCode.toString();
  
  sendActivationcode (user.email,user.username.split(' ')[0],activationCode);
  
    res.status(201).json({
      status: "success",
      message: "Signup successful! Please check your email for the activation code.",
    });
  });

exports.activateAccount = asyncHandler (async (req, res) => {
    const { email, activationCode } = req.body;
  
   
      
      if (!email || !activationCode) {
        return res.status(400).json({ message: 'Email and activation code are required' });
      }
  
      
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid activation code or email' });
      }
  
      if (user.isActive) {
        return res.status(409).json({ message: 'Account is already activated' });
      }
      const isEqual=await bcrypt.compare(activationCode,user.activationCode);
      
        if (!isEqual) {
            return res.status(400).json({ message: 'Invalid activation code' });
          }  
    
      const token = await generateToken({ id: user._id });
      user.token = token;
      user.isActive = true;
      user.activationCode = undefined; 
      await user.save();
      
      res.status(200).json({ "token":user.token });
   
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

    let activationCode=generateActivationCode();
    user.activationCode=await bcrypt.hash(activationCode,10);
    await user.save();
     activationCode=activationCode.toString();
    sendActivationcode(user.email,user.username.split(' ')[0],activationCode);
    
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
        
        let activationCode=generateActivationCode();
        user.activationCode=await bcrypt.hash(activationCode,10);s
        await user.save();
        sendActivationcode(user.email,user.username.split(' ')[0],activationCode);

        
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

  
exports.SendForgetPasswordCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });
  console.log(user);
  if (!user) {
    console.log("error");
    return next(new ErrorHandler("User not exist", 404));
  }
  if (!user.isActive) {
    let activationCode = generateActivationCode();
    user.activationCode = await bcrypt.hash(activationCode.toString(), 10); // Convert to string
    await user.save();
    sendActivationcode(user.email, user.username.split(' ')[0], activationCode.toString());

    return res.status(200).json({ message: "Please check your email for the activation code." });
  }
  let code = generateActivationCode();
  user.resetPasswordToken = await bcrypt.hash(code.toString(), 10); // Convert to string
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  sendForgetPasswordCode(user.email, user.username.split(' ')[0], code.toString());

  res.status(200).json({ success: true, message: "Password reset code sent to email" });
});

exports.CodeForgetPassword = asyncHandler(async (req, res, next) => {
  const { email, ForgetPasswordcode } = req.body;

  
  const user = await userModel.findOne({
    email: email,
    resetPasswordExpires: { $gt: Date.now() } 
  });

  if (!user) {
    return res.status(400).json({
      message: "Password reset token is invalid or has expired."
    });
  }

  const isMatch = await bcrypt.compare(ForgetPasswordcode, user.resetPasswordToken);
  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid code"
    });
  }

  user.resetPasswordToken = undefined;
  await user.save(); 

  res.status(200).json({
    message: "Password reset token is valid. You can now reset your password."
  });
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
  
    
      return res.status(400).json({ message: 'Token and new password are required' });
  }

  const user = await userModel.findOne({
     
email:email,resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordExpires=undefined;
  const token=generateToken({email:user.email});
  res.status(200).json({token:token});

});