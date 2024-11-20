const express = require('express');
const router = express.Router();
const chemicalController = require('../controllers/chemicalController');
const multer = require('multer');
const upload = multer();

router.get('/', chemicalController.getAllChemicals);
router.get('/:id', chemicalController.getChemicalById);
router.post('/', upload.array('images'), chemicalController.create);
router.put('/:id', chemicalController.updateChemical);
router.delete('/:id', chemicalController.deleteChemical);

module.exports = router;
