const db = require("../config.js");
const asyncHandler = require("../Middleware/asyncHandler.js");


const User = {};


User.create = async (name, email, password, role, img) => {
  const query = 'INSERT INTO users (name, email, password, role, img) VALUES (?, ?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.execute(query, [name || null, email || null, password || null, role || null, img || null], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

User.findByEmail = (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  return new Promise((resolve, reject) => {
    db.execute(query, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
}
User.getDeviceInfo = async (userId) => {
  const query = 'SELECT device_id FROM users WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]?.device_id ? JSON.parse(results[0].device_id) : null);
    });
  });
};

User.updateDeviceInfo = async (userId, deviceInfo) => {
  const query = 'UPDATE users SET device_id = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [JSON.stringify(deviceInfo), userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Increment device count
// User.incrementDeviceCount = (userId) => {
//   return new Promise((resolve, reject) => {
//     db.query('UPDATE users SET device_count = device_count + 1 WHERE id = ?', [userId], (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

// // Decrement device count
// User.decrementDeviceCount = (userId) => {
//   return new Promise((resolve, reject) => {
//     db.query('UPDATE users SET device_count = device_count - 1 WHERE id = ?', [userId], (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };



User.findById = (id, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.execute(query, [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result[0]);
  });
};




// Function to delete a student and related records

// delete****************************






// Define deleteStudent function
User.deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Delete related records in the `course_users` table
  const deleteCourseUsersSql = 'DELETE FROM course_users WHERE user_id = ?';
  db.query(deleteCourseUsersSql, [id], (deleteCourseUsersErr) => {
    if (deleteCourseUsersErr) {
      console.error('Error deleting related course_users: ' + deleteCourseUsersErr.message);
      return res.status(500).json({ message: "Error deleting related course_users" });
    }

  // Delete related records in the `teacher_students` table
  const deleteCourseUsersSql = 'DELETE FROM teacher_students WHERE student_id = ?';
  db.query(deleteCourseUsersSql, [id], (deleteCourseUsersErr) => {
    if (deleteCourseUsersErr) {
      console.error('Error deleting related teacher_students: ' + deleteCourseUsersErr.message);
      return res.status(500).json({ message: "Error deleting related teacher_students" });
    }


    // Delete related records in the `payments` table
    const deletePaymentsSql = 'DELETE FROM payments WHERE user_id = ?';
    db.query(deletePaymentsSql, [id], (deletePaymentsErr) => {
      if (deletePaymentsErr) {
        console.error('Error deleting related payments: ' + deletePaymentsErr.message);
        return res.status(500).json({ message: "Error deleting related payments" });
      }

      // Delete the student from the `users` table
      const deleteStudentSql = 'DELETE FROM users WHERE id = ? AND role = "student"';
      db.query(deleteStudentSql, [id], (deleteStudentErr, deleteStudentResult) => {
        if (deleteStudentErr) {
          console.error('Error deleting student: ' + deleteStudentErr.message);
          return res.status(500).json({ message: "Error deleting student" });
        }

        if (deleteStudentResult.affectedRows === 0) {
          return res.status(404).json({ message: "Student not found" });
        }

        return res.json({ message: "Student and related records deleted successfully" });
      });
    });
  });
});
});





// Define deleteAdmin function
User.deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Delete related records in the `course_users` table
  const deleteCourseUsersSql = 'DELETE FROM course_users WHERE user_id = ?';
  db.query(deleteCourseUsersSql, [id], (deleteCourseUsersErr) => {
    if (deleteCourseUsersErr) {
      console.error('Error deleting related course_users: ' + deleteCourseUsersErr.message);
      return res.status(500).json({ message: "Error deleting related course_users" });
    }

  // Delete related records in the `teacher_students` table
  const deleteCourseUsersSql = 'DELETE FROM teacher_students WHERE student_id = ?';
  db.query(deleteCourseUsersSql, [id], (deleteCourseUsersErr) => {
    if (deleteCourseUsersErr) {
      console.error('Error deleting related teacher_students: ' + deleteCourseUsersErr.message);
      return res.status(500).json({ message: "Error deleting related teacher_students" });
    }


    // Delete related records in the `payments` table
    const deletePaymentsSql = 'DELETE FROM payments WHERE user_id = ?';
    db.query(deletePaymentsSql, [id], (deletePaymentsErr) => {
      if (deletePaymentsErr) {
        console.error('Error deleting related payments: ' + deletePaymentsErr.message);
        return res.status(500).json({ message: "Error deleting related payments" });
      }

      // Delete the student from the `users` table
      const deleteStudentSql = 'DELETE FROM users WHERE id = ? AND role = "admin"';
      db.query(deleteStudentSql, [id], (deleteStudentErr, deleteStudentResult) => {
        if (deleteStudentErr) {
          console.error('Error deleting admin: ' + deleteStudentErr.message);
          return res.status(500).json({ message: "Error deleting admin" });
        }

        if (deleteStudentResult.affectedRows === 0) {
          return res.status(404).json({ message: "admin not found" });
        }

        return res.json({ message: "admin and related records deleted successfully" });
      });
    });
  });
});
});
User.saveResetToken = (userId, resetToken) => {
  if (!userId || !resetToken) {
    return Promise.reject(new Error('Invalid parameters'));
  }

  const query = 'UPDATE users SET reset_token = ?, reset_token_expiration = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [resetToken, userId], (err, result) => {
      if (err) {
        console.error('Error saving reset token:', err);
        return reject(err);
      }
      resolve(result);
    });
  });
};



// Update password and clear reset token
User.updatePassword = (userId, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(query, [hashedPassword, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Clear the reset token from the database
User.clearResetToken = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET reset_token = NULL, reset_token_expiration = NULL WHERE id = ?';
    db.query(query, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
User.getResetToken = (userId) => {
  const query = 'SELECT reset_token, reset_token_expiration FROM users WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]); // Assuming only one row per user
    });
  });
};



module.exports = User;