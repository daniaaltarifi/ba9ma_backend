const express = require('express');
const router= express.Router()
const ContactDynamicController = require('../Controller/ContactDynamicController.js');
router.get('/', ContactDynamicController.getcontactus);

router.post('/add', ContactDynamicController.addContact);
router.put('/update/:id', ContactDynamicController.updatecontactus);
router.get('/contactbyid/:id', ContactDynamicController.getContactById);
module.exports=router