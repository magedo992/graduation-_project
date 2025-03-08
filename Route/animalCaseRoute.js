const express=require('express');
const router=express.Router();
const { upload, resizeImage } = require('../Middelware/resizeImage');
const {createAnimalForm}=require('../Controller/animalCaseController');


router.post('/Veterinary',upload.array('images',4),createAnimalForm);


module.exports=router;