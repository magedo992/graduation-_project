const express = require('express');
const router = express.Router();
const passport = require('passport');
const { signUp, activateAccount, 
    SendactivationCode, login,SendForgetPasswordCode } = require('../Controller/authController');
    const authcon=require('../Controller/authController');
const {googleAuthHandler}=require('../Middelware/passport');
const { upload, resizeImage } = require('../Middelware/resizeImage');
const userModel = require('../Model/UserModel');
require('../Middelware/passport');
const googleController=require('../Controller/GoogleController');

const authValidator=require('../Middelware/Validator/authValidator');

router.post('/signup', upload.single('ProfileImage'), resizeImage({ width: 600, height: 600, quality: 90 })
, signUp);
router.post('/activateAccount', upload.none(), activateAccount);
router.post('/SendactivationCode', upload.none(), SendactivationCode);
router.post('/login', upload.none(),authValidator.login, login);


router.post('/auth/google',googleController.googleAuth);
router.post('/auth/sendforgetpasswordcode',SendForgetPasswordCode);

module.exports = router;
