const express=require('express');
const router=express.Router();
const fertilizerController=require('../Controller/fertilizerController');
const { upload, resizeImages } = require('../Middelware/resizeImage');

router.post('/createFertilizer',upload.array("Images",10),resizeImages({ width: 600, height: 600, quality: 90 }),fertilizerController.create);


module.exports=router;