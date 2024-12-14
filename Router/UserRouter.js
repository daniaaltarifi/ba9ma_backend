const express = require('express');
const asyncHandler=require("../Middleware/asyncHandler.js")
const db = require("../config.js");
const { register, login, logout, resetPassword ,requestPasswordReset } = require('../Middleware/verifyJWT.js');
const router = express.Router();
const User = require('../Controller/UserController.js'); 
const rateLimit = require('express-rate-limit');

// Create a rate limiter for password reset requests
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many password reset requests from this IP, please try again after 15 minutes.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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

router.post('/register',upload.single('img'), register);
router.post('/login', login);
router.post('/logout',logout);
router.delete('/delete/:id',User.deleteStudent);
router.delete('/deleteadmin/:id', User.deleteAdmin);

// Forgot/Reset Password routes
router.post('/forgot-password', passwordResetLimiter,requestPasswordReset);
router.post('/reset-password/:token',resetPassword);

router.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
      if (err) return res.status(500).send(err);
      if (!user) return res.status(404).send('User not found');
      res.status(200).json(user);
    });
  });

router.get('/getusers',asyncHandler(async (req, res) => {
   
        const sqlSelect = "SELECT * FROM users";
        db.query(sqlSelect, (err, result) => {
          if (err) {
            console.error('Error selecting data: ' + err.message);
            return res.json({ message: "Error" });
          }
          res.status(201).json(result);
        });
      })
)
module.exports = router;
