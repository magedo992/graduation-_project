const express=require("express");
const router=express.Router();
const {create,createPlantView,
    getAll,deletepalnts}=require('../Controller/plantController');
const { upload, resizeImages } = require('../Middelware/resizeImage');

router.get('/createPlant', createPlantView);
router.post('/create',upload.array("Images", 10), resizeImages({ width: 600, height: 600, quality: 90 }),create);
router.get('/viewAll',getAll);
router.delete('/:id',deletepalnts)

module.exports=router;
