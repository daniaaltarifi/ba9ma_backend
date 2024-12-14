const asyncHandler = require("../Middleware/asyncHandler.js");
const db = require("../config.js");

const addDepartment = asyncHandler(async (req, res) => {
  const { title,price } = req.body;
  const sqlInsert = "INSERT INTO department (title, price) VALUES (?, ?)";
  db.query(sqlInsert, [title, price], (err, result) => {
    if (err) {
        console.error('Error inserting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res
      .status(201)
      .json({ message: "Department added successfully", id: result.insertId });  });
});
const getDepartment = asyncHandler(async (req, res) => {
    const sqlSelect = "SELECT * FROM department";
    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.error('Error selecting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json(result);
    });
})
const updateDepartment = asyncHandler(async (req, res) => {
    const id=req.params.id;
    const {title,price } = req.body;
    const sqlUpdate = "UPDATE department SET title =? , price=? WHERE id =?";
    db.query(sqlUpdate, [title,price, id], (err, result) => {
      if (err) {
        console.error('Error updating data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json({ message: "Department updated successfully" });
    });
})
// const deleteDepartment=asyncHandler(async(req,res)=>{
//     const id=req.params.id;
//     const sqlDeletecourseuser = "DELETE FROM courses WHERE department_id =?";
//     db.query(sqlDeletecourseuser, [id], (err, result) => {
//       if (err) {
//         console.error('Error deleting data: ' + err.message);
//         return res.json({ message: "Error" });
//       }
//       const sqlDeleteblog = "DELETE FROM blog WHERE department_id =?";
//     db.query(sqlDeleteblog, [id], (err, result) => {
//       if (err) {
//         console.error('Error deleting data: ' + err.message);
//         return res.json({ message: "Error" });
//       }
//     const sqlDelete = "DELETE FROM department WHERE id =?";
//     db.query(sqlDelete, [id], (err, result) => {
//       if (err) {
//         console.error('Error deleting data: ' + err.message);
//         return res.json({ message: "Error" });
//       }
//       res.status(201).json({ message: "Department deleted successfully" });
//     });  })})})
const deleteDepartment = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    // Step 1: Check if there are payments associated with the department
    const paymentsResult = await new Promise((resolve, reject) => {
      db.query('SELECT user_id FROM payments WHERE department_id = ?', [id], (err, results) => {
        if (err) {
          console.error('Error checking payments: ' + err.message);
          return reject(new Error("Error checking payments"));
        }
        resolve(Array.isArray(results) ? results : []);
      });
    });

    // Extract user IDs from the result
    const userIds = paymentsResult.map(row => row.user_id);
    if (req.query.confirm === 'true') {
      // Proceed with deletion if confirmation is provided
      await deleteRecords(id, userIds);
      return res.status(200).json({ message: "Department deleted successfully" });
    } else {
      // Return payment-related info if no confirmation is provided
      return res.status(200).json({
        message: userIds.length > 0 
          ? "يوجد عمليات شراء على هذا القسم يرجى تأكيد الحذف" 
          : "هل انت متأكد من حذف هذا القسم",
        userIds
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to delete records
const deleteRecords = async (id, userIds) => {
  // Delete user entries from course_users
  if (userIds.length > 0) {
    await new Promise((resolve, reject) => {
      db.query('DELETE FROM course_users WHERE user_id IN (?)', [userIds], (err, result) => {
        if (err) {
          console.error('Error deleting users from course_users: ' + err.message);
          return reject(new Error("Error deleting users from course_users"));
        }
        resolve(result);
      });
    });
  }

  // Delete payments
  await new Promise((resolve, reject) => {
    db.query('DELETE FROM payments WHERE department_id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error deleting payments: ' + err.message);
        return reject(new Error("Error deleting payments"));
      }
      resolve(result);
    });
  });

  // Delete associated records from other tables
  await new Promise((resolve, reject) => {
    db.query('DELETE FROM courses WHERE department_id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error deleting courses: ' + err.message);
        return reject(new Error("Error deleting courses"));
      }
      resolve(result);
    });
  });

  await new Promise((resolve, reject) => {
    db.query('DELETE FROM blog WHERE department_id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error deleting blog: ' + err.message);
        return reject(new Error("Error deleting blog"));
      }
      resolve(result);
    });
  });

  // Finally, delete the department
  await new Promise((resolve, reject) => {
    db.query('DELETE FROM department WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error deleting department: ' + err.message);
        return reject(new Error("Error deleting department"));
      }
      resolve(result);
    });
  });
};



// const deleteDepartment=asyncHandler(async(req,res)=>{
//   const id=req.params.id;
//   const sqlDeletecourseuser = "DELETE FROM courses WHERE department_id =?";
//   db.query(sqlDeletecourseuser, [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting data: ' + err.message);
//       return res.json({ message: "Error" });
//     }
//     const sqlDeleteblog = "DELETE FROM blog WHERE department_id =?";
//   db.query(sqlDeleteblog, [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting data: ' + err.message);
//       return res.json({ message: "Error" });
//     }
//   const sqlDelete = "DELETE FROM department WHERE id =?";
//   db.query(sqlDelete, [id], (err, result) => {
//     if (err) {
//       console.error('Error deleting data: ' + err.message);
//       return res.json({ message: "Error" });
//     }
//     res.status(201).json({ message: "Department deleted successfully" });
//   });  })})})

module.exports ={addDepartment,getDepartment,updateDepartment,deleteDepartment}