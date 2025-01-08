const express=require('express');
const router=express.Router();
const fertilizerController=require('../Controller/fertilizerController');
const { upload, resizeImages } = require('../Middelware/resizeImage');
const path=require('path');
router.post('/createFertilizer',upload.array("Images",10),resizeImages({ width: 600, height: 600, quality: 90 }),fertilizerController.create);
router.delete('/:Fertilizer_id',fertilizerController.delete);
router.get('/Viewfertilizer', (req, res) => {
    res.render('fertilizer'); 
});
router.get('/showAll',fertilizerController.showAll);
module.exports=router;