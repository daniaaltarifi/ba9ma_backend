const express = require('express');
const router= express.Router()
const BasmaTrainigController = require('../Controller/basmaTrainingController.js');
router.get('/', BasmaTrainigController.getBasmaTraining);

router.post('/add', BasmaTrainigController.addBasmaTraining);
router.put('/update/:id', BasmaTrainigController.updateBasmaTraining);
router.get('/basmatrainigbyid/:id', BasmaTrainigController.getBasmaTrainingById);

module.exports=router