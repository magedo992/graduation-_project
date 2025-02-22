const express = require('express');
const { getAddAnimalForm, addAnimal, viewAnimals } = require('../Controller/animalController');
const { upload } = require('../Middelware/resizeImage');

const router = express.Router();

router.get('/add', getAddAnimalForm);
router.post('/add', upload.single('image'), addAnimal);
router.get('/', viewAnimals);

module.exports = router;
