const express=require('express');
const router=express.Router();
const { upload, resizeImages } = require('../Middelware/resizeImage');
const {createAnimalForm}=require('../Controller/animalCaseController');
const {verifay}=require('../Middelware/verifyToken');


router.post('/Veterinary',verifay,createAnimalForm);


module.exports=router;