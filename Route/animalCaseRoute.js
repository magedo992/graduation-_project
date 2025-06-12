const express=require('express');
const router=express.Router();
const { upload, resizeImages } = require('../Middelware/resizeImage');
const {createAnimalForm}=require('../Controller/animalCaseController');


router.post('/Veterinary',createAnimalForm);


module.exports=router;