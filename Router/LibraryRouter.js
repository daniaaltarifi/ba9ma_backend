const express=require('express');
const router=express.Router();
const LibraryController = require('../Controller/LibraryController.js')
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

router.post('/add', upload.single('file_book'),LibraryController.addLibrary)
router.get('/',LibraryController.getLibrary)
router.get('/:filename', LibraryController.getByFile);
router.get('/getbydep/:id', LibraryController.getByDepartment); // Use :id in the route definition
router.put('/update/:id', upload.fields([{ name: 'file_book', maxCount: 1 }]),handleMulterErrors, LibraryController.updateLibrary);

router.delete('/delete/:id',LibraryController.deleteBook)
router.get('/getlibrarybyid/:id', LibraryController.getLibraryById);
module.exports =router