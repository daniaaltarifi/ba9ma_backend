const express = require('express');
const router= express.Router();
const PurchaseStepsController = require('../Controller/PurchaseStepsController.js');
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

router.get('/', PurchaseStepsController.getpurchasesteps);
router.post('/add',upload.fields([{ name: 'img', maxCount: 1 }]), PurchaseStepsController.addpurchasesteps);
router.put('/update/:id',upload.fields([{ name: 'img', maxCount: 1 }]), PurchaseStepsController.updatepurchasesteps);
router.get('/PurchaseStepsbyid/:id', PurchaseStepsController.getpurchasestepsById);
router.delete('/delete/:id',PurchaseStepsController.deletePurchasesteps)



module.exports =router