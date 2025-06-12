const express = require('express');
const { getAddAnimalForm, addAnimal, viewAnimals } = require('../Controller/animalController');
const { upload, resizeImages } = require('../Middelware/resizeImage');
const {verifay}=require('../Middelware/verifyToken');

const router = express.Router();

router.get('/add', getAddAnimalForm);
router.post('/add', upload.array("image", 5), resizeImages({ width: 600, height: 600, quality: 90 }), addAnimal);
router.get('/',verifay, viewAnimals);

module.exports = router;
