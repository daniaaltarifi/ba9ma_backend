const express = require('express');
const router= express.Router()
const WhoweareController = require('../Controller/WhoweareController.js');
router.get('/', WhoweareController.getWhoweare);

router.post('/add', WhoweareController.addWhoweare);
router.put('/update/:id', WhoweareController.updateWhoweare);
router.get('/Whowearebyid/:id', WhoweareController.getWhoweareById);

module.exports=router