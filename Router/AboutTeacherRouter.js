const express = require('express');
const router= express.Router();
const AboutTeacherController = require('../Controller/AboutTeacherController.js');
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

router.get('/', AboutTeacherController.getAboutTeacher);
router.put('/update/:id',upload.fields([{ name: 'img', maxCount: 1 }]), AboutTeacherController.updateAboutTeacher);
router.get('/aboutteacherbyid/:id', AboutTeacherController.getAboutTeacherById);



module.exports =router