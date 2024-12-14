const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Controller/UserController');
const db = require("../config.js");
const transporter = require("../Malier.js");
const dotenv=require('dotenv')

dotenv.config();
exports.register = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  const img = req.file ? req.file.path : 'acc_icon.png'; // Default image path

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).send('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create(name, email, hashedPassword, role, img);
    const userId = result.insertId;

    res.status(201).json({ message: 'User registered', id: userId, img: img });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Server error');
  }
};


const SECRET_KEY = 'your_jwt_secret';
const MAX_DEVICES = 2;
exports.login = async (req, res) => {
  const { email, password, deviceInfo } = req.body;

  if (!deviceInfo) return res.status(400).send('Device information is required');

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid password');

    // Retrieve stored device info
    const storedDeviceInfo = await User.getDeviceInfo(user.id);

    if (!storedDeviceInfo) {
      // If no device info is stored
      if (user.role === 'student') {
        // For students, store the device info
        await User.updateDeviceInfo(user.id, deviceInfo);
        return res.status(200).json({
          message: 'تم حفظ معلومات جهازك. سوف تكون قادر على تسجيل الدخول فقط من هذا الجهاز',
          token: jwt.sign(
            { id: user.id, role: user.role, name: user.name, img: user.img },
            SECRET_KEY,
            { expiresIn: '1h' }
          ),
          name: user.name,
          role: user.role,
          id: user.id,
          img: user.img
        });
      } else {
        // For non-students, do not store device info
        return res.status(200).json({
          message: 'تم تسجيل الدخول بنجاح.',
          token: jwt.sign(
            { id: user.id, role: user.role, name: user.name, img: user.img },
            SECRET_KEY,
            { expiresIn: '1h' }
          ),
          name: user.name,
          role: user.role,
          id: user.id,
          img: user.img
        });
      }
    } else {
      // Compare stored device info with incoming device info
      if (JSON.stringify(storedDeviceInfo) !== JSON.stringify(deviceInfo)) {
        return res.status(403).json({
          message: 'Login not allowed from this device'
        });
      }

      // Generate JWT token for matching device info
      const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name, img: user.img },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        token,
        name: user.name,
        role: user.role,
        id: user.id,
        img: user.img
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// exports.login = async (req, res) => {
//   const { email, password, deviceInfo } = req.body;

//   if (!deviceInfo) return res.status(400).send('Device information is required');

//   try {
//     const user = await User.findByEmail(email);
//     if (!user) return res.status(400).send('User not found');

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).send('Invalid password');

//     // Retrieve stored device info
//     const storedDeviceInfo = await User.getDeviceInfo(user.id);
   

//     // Compare stored device info with incoming device info
//     // if (storedDeviceInfo && JSON.stringify(storedDeviceInfo) !== JSON.stringify(deviceInfo)) {
//     //   return res.status(403).json({ message: 'Login not allowed from this device' });
//     // }
//     if (!storedDeviceInfo) {
//       // If no device info is stored, inform user and update the device info
//       await User.updateDeviceInfo(user.id, deviceInfo);
//       return res.status(200).json({
//         message: ' تم حفظ معلومات جهازك سوف تكون قادر على تسجيل الدخول فقط من هذا الجهاز',
//         token: jwt.sign(
//           { id: user.id, role: user.role, name: user.name, img: user.img },
//           SECRET_KEY,
//           { expiresIn: '1h' }
//         ),
//         name: user.name,
//         role: user.role,
//         id: user.id,
//         img: user.img
//       });
//     } else {
//       // Compare stored device info with incoming device info
//       if (JSON.stringify(storedDeviceInfo) !== JSON.stringify(deviceInfo)) {
//         return res.status(403).json({
//           message: 'Login not allowed from this device'
//         });
//       }
    
//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, role: user.role, name: user.name, img: user.img },
//       SECRET_KEY,
//       { expiresIn: '1h' }
//     );

//     // If this is the first login or device info is not set, set/update the device info
//     // if (!storedDeviceInfo) {
//     //   await User.updateDeviceInfo(user.id, deviceInfo);
//     // }

//     res.status(200).json({
//       token,
//       name: user.name,
//       role: user.role,
//       id: user.id,
//       img: user.img
//     });
//   }
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

exports.logout = async (req, res) => {
  const { token } = req.body; // Extract token from request body
  if (!token) return res.status(400).send('Token is required');
  try {
    // Respond with a success message
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('JWT Error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).send('Token has expired');
    } else {
      return res.status(500).send('Server error');
    }
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      // Return a success message even if the email does not exist, without logging an error
      return res.json('The email does not exist. Please enter the correct email.');
    }

    const resetToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    await User.saveResetToken(user.id, resetToken);

    // Use an explicit base URL from environment variables
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const resetUrl = `https://ba9maonline.com/resetPassword/${resetToken}`;

    // Send this URL to the user's email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset. If you did not make this request, please ignore this email.</p>
        <p>Click the link below to reset your password. This link is valid for 1 hour:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
      `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
      res.status(200).json({ message: 'Password reset link sent to email' });
    });
  } catch (err) {
    console.error('Request password reset error:', err);
    res.status(500).send('Server error');
  }
};




exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  console.log('Password:', password); // Debugging
  console.log('Confirm Password:', confirmPassword); // Debugging

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updatePassword(userId, hashedPassword);
    await User.clearResetToken(userId);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).send('Reset token has expired');
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(400).send('Invalid reset token');
    }
    console.error('Reset password error:', err);
    res.status(500).send('Server error');
  }
};