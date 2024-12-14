const express = require('express');
const router= express.Router()
const BoxSliderController = require('../Controller/BoxUnderSliderController.js');
router.get('/', BoxSliderController.getboxslider);

router.post('/add', BoxSliderController.addBoxSlider);
router.put('/update/:id', BoxSliderController.updateboxslider);
router.delete('/delete/:id', BoxSliderController.deleteboxslider);
router.get('/boxbyid/:id', BoxSliderController.getBoxById);

module.exports=router