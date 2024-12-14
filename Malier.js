// mailer.js
const nodemailer = require('nodemailer');

// Configure the transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use any email service like Gmail, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Optionally verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error with mailer configuration:', error);
  } else {
    console.log('Mailer is configured and ready to send emails');
  }
});

module.exports = transporter;






// npm install nodemailer
// npm install express-rate-limit



// JWT_SECRET=your_jwt_secret
// EMAIL_USER=your_email@example.com
// EMAIL_PASS=your_email_password



// ALTER TABLE users
// ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL,
// ADD COLUMN reset_token_expiration DATETIME DEFAULT NULL;