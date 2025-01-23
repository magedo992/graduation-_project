const express = require('express');
const router = express.Router();
const chemicalController = require('../Controller/chemicalsController');
const { upload, resizeImages } = require('../Middelware/resizeImage');
const {verifay}=require('../Middelware/verifyToken');

router.get('/create',(req,res)=>{
    res.render('createChemical');
})
router.get('/viewChemicals', chemicalController.viewAll);
router.get('/:id', chemicalController.viewOne);
router.post('/createChemical', upload.array("Images", 10), resizeImages({ width: 600, height: 600, quality: 90 }), chemicalController.create);
router.put('/:id', chemicalController.update);
router.delete('/:id', chemicalController.delete);


module.exports = router;
