const express = require('express');
const router = express.Router();

const { signUp, activateAccount, 
    SendactivationCode, login,
    SendForgetPasswordCode,
    CodeForgetPassowrd,ResetPassword,checkEmail
     } = require('../Controller/authController');
     const verifay=require('../Middelware/verifyToken');
    
const { upload, resizeImage } = require('../Middelware/resizeImage');


const {googleAuth}=require('../Controller/GoogleController');
const userModel=require('../Model/UserModel');
const { ErrorHandler } = require('../Utils/ErrorHandler');



router.post('/signup', upload.single('ProfileImage'), resizeImage({ width: 1024, height: 1024, quality: 90 })
, signUp);
router.post('/activateAccount', upload.none(), activateAccount);
router.post('/SendactivationCode', upload.none(), SendactivationCode);
router.post('/login', upload.none(), login);
router.post('/ActiveForgetPasswordCode',upload.none());
// router.post('/resetPassword',upload.none(),resetPassword)
router.post('/auth/sendforgetpasswordcode',upload.none(),SendForgetPasswordCode);
router.post('/auth/codeForgetPassword',upload.none(),CodeForgetPassowrd);
router.post('/auth/ResetPassword',upload.none(),ResetPassword)
router.post('/auth/googleoauth',upload.none(),googleAuth);
router.get('/Home',verifay.verifay,async(req,res)=>{

   const user=await userModel.findOne(req.user._id,{"__v":false,"password":false,"imagePublicIds":false,"isActive":false});
   if(!user)
   {
    return new ErrorHandler("the user not found",404);
   }

   return res.status(200).json({userData:user});


});
router.post('/checkEmail',upload.none(),checkEmail);


module.exports = router;
