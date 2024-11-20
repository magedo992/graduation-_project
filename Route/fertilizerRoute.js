const express = require('express');
const router = express.Router();
const fertilizerController = require('../controllers/fertilizerController');

router.get('/', fertilizerController.getAllFertilizers);
router.get('/:id', fertilizerController.getFertilizerById);
router.post('/', fertilizerController.addFertilizer);
router.put('/:id', fertilizerController.updateFertilizer);
router.delete('/:id', fertilizerController.deleteFertilizer);

module.exports = router;