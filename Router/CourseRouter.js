const express = require('express');
const router = express.Router();
const CoursesController = require('../Controller/CoursesController.js');
const multer = require('multer');
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
 router.post(
  '/add',
  upload.fields([
      { name: 'img', maxCount: 1 },
      { name: 'defaultvideo', maxCount: 1 },
      { name: 'url', maxCount: 10 }, // Handle up to 10 URLs
      { name: 'file_book', maxCount: 1 } // Handle single file upload for 'file_book'
  ]),handleMulterErrors,
  CoursesController.addCourse
);router.get('/', CoursesController.getcourses);
router.get('/getbyvideo/:id', CoursesController.getVideoById);
router.get('/getbydep/:id', CoursesController.getByDepartment); // Use :id in the route definition
router.get('/users-counts/:id', CoursesController.getUserCountForCourse);
router.get('/course-counts/:id', CoursesController.getCourseCountByTeacher);
router.get('/lesson-counts/:id', CoursesController.getLessonCountForCourses);
router.get('/:id', CoursesController.getCourseById);
router.delete('/delete/:id', CoursesController.deleteCourse);
// router.get('/check/:id', CoursesController.checkcourseuser);
router.get('/videos/:id',CoursesController.getCourseVideos);
router.delete('/videos/:id',CoursesController.deleteVideoById);
router.get('/links/:id',CoursesController.getCourseLinks);
router.get('/filter/:department_id/:teacher_email', CoursesController.getByDepartmentAndTeacher);

router.put('/:id', 
  upload.fields([
    { name: 'img', maxCount: 10 },
    { name: 'defaultvideo', maxCount: 10 },
    { name: 'videoFiles', maxCount: 20 },
    { name: 'file_book', maxCount: 1 }
  ]),handleMulterErrors,
  CoursesController.updateCourse
);
module.exports = router;
