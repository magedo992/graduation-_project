const express=require("express");
const router=express.Router();
const {create,createPlantView,
    getAll,deletepalnts,getOne}=require('../Controller/plantController');
const { upload, resizeImages } = require('../Middelware/resizeImage');
const {verifay}=require('../Middelware/verifyToken');


router.get('/createPlant', createPlantView);
router.post('/create',upload.array("images", 10), resizeImages({ width: 600, height: 600, quality: 90 }),create);
router.get('/viewAll',verifay,getAll);
router.get('/viewone/:Id',verifay,getOne)
router.delete('/:id',deletepalnts)

module.exports=router;
