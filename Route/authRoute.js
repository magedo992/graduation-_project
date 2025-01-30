const express = require('express');
const router = express.Router();

const { signUp, activateAccount, 
    SendactivationCode, login,
    SendForgetPasswordCode,
    CodeForgetPassowrd,ResetPassword
     } = require('../Controller/authController');
    
const { upload, resizeImage } = require('../Middelware/resizeImage');


const {googleAuth}=require('../Controller/GoogleController');



router.post('/signup', upload.single('ProfileImage'), resizeImage({ width: 600, height: 600, quality: 90 })
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



module.exports = router;
