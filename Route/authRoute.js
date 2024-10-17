const express=require('express');
const router=express.Router();
const {signUp}=require('../Controller/authController');
// const {upload}=require('../Middelware/uploadImage');
const { upload,resizeImage } = require('../Middelware/resizeImage'); 

router.post('/singup',upload.single('ProfileImage'),resizeImage({width:600,height:600,quality:90}),signUp);


module.exports=router;