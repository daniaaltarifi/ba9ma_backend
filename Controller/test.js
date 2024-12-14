const express = require('express');
const router= express.Router();
const TeacherController = require('../Controller/TeacherController.js');
const multer = require("multer");
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Retain original filename and extension
  }
});

const upload = multer({ storage: storage,
  limits: { fileSize: 1024 * 1024 * 1024 } // 1 GB

 });
 // Custom middleware to handle Multer errors
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: "File size exceeds the limit",
        message: "Please upload a file smaller than 1 GB.",
      });
    }
  }
  // Pass other errors to the default error handler
  next(err);
};
// Make sure the name specified here matches the field name in the form
router.post('/add', upload.fields([{ name: 'img', maxCount: 1 }]), TeacherController.addTeacherAndcourses);
router.post('/addcourseteacher',
  upload.fields([{ name: 'img', maxCount: 1 },
    { name: 'defaultvideo', maxCount: 1 },
    { name: 'url', maxCount: 30 },
    { name: 'file_book', maxCount: 10 }
  ]),handleMulterErrors, TeacherController.teacherAddCourse);


router.put('/updatecourseteacher/:courseId', upload.fields([{ name: 'img', maxCount: 1 },{ name: 'defaultvideo', maxCount: 1 },{ name: 'file_book', maxCount: 10 } ,  { name: 'videoFiles', maxCount: 20 }]), TeacherController.updateTeacherCourse);
router.delete('/deletecourseteacher/:id', TeacherController.deleteTeacherCourse);

router.get('/', TeacherController.getTeacher);
router.get('/student-counts/:id',TeacherController.getStudentCountForTeacher);
router.get('/:id', TeacherController.getTeacherById);
router.get('/teachercourse/:id', TeacherController.getTeacherCourseById);
router.get('/teacher-course/:id', TeacherController.getTeacheridandCourseById);

router.put('/update/:id',upload.fields([ { name: 'img', maxCount: 1 }]), TeacherController.updateTeacher);
router.delete('/delete/:id', TeacherController.deleteTeacher);

module.exports=router