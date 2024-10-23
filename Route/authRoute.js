const express = require('express');
const router = express.Router();
const passport = require('passport');
const { signUp, activateAccount, 
    SendactivationCode, login } = require('../Controller/authController');
    const authcon=require('../Controller/authController');

const { upload, resizeImage } = require('../Middelware/resizeImage');
const userModel = require('../Model/UserModel');
require('../Middelware/passport');

const authValidator=require('../Middelware/Validator/authValidator');

router.post('/signup', upload.single('ProfileImage'), resizeImage({ width: 600, height: 600, quality: 90 }),authValidator.signup, signUp);
router.post('/activateAccount', upload.none(),authValidator.activateAccount, activateAccount);
router.post('/SendactivationCode', upload.none(),authValidator.sendActivationCode, SendactivationCode);
router.post('/login', upload.none(),authValidator.login, login);


router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));


router.get('/auth/callback', passport.authenticate('google', { failureRedirect: '/Home' }), (req, res) => {
 res.status(200).json({token:req.user.token});
 
});

module.exports = router;
