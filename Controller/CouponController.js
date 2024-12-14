const asyncHandler = require("../Middleware/asyncHandler.js");
const db = require("../config.js");






const addCoupon = asyncHandler(async (req, res) => {
  const { coupon_code, coupon_type, expiration_date, department_id, course_id } = req.body;
  const used = '0';

  // Validate coupon_type
  if (!['course', 'department'].includes(coupon_type)) {
    return res.status(400).json({ message: "Invalid coupon type" });
  }

  // Validate expiration_date
  if (!expiration_date) {
    return res.status(400).json({ message: "Expiration date is required" });
  }

  // Validate department_id if coupon_type is 'department'
  if (coupon_type === 'department') {
    if (!department_id) {
      return res.status(400).json({ message: "Department ID is required for department type" });
    }

    // Check if department_id exists in the department table
    const sqlCheckDepartment = 'SELECT id FROM department WHERE id = ?';
    db.query(sqlCheckDepartment, [department_id], (err, results) => {
      if (err) {
        console.error('Error querying department table: ' + err.message);
        return res.status(500).json({ message: "Error checking department" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid department ID" });
      }

      // Insert coupon if department_id is valid
      insertCoupon();
    });
  } else if (coupon_type === 'course') {
    if (!course_id) {
      return res.status(400).json({ message: "Course ID is required for course type" });
    }

    // Check if course_id exists in the courses table
    const sqlCheckCourse = 'SELECT id FROM courses WHERE id = ?';
    db.query(sqlCheckCourse, [course_id], (err, results) => {
      if (err) {
        console.error('Error querying courses table: ' + err.message);
        return res.status(500).json({ message: "Error checking course" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      // Insert coupon if course_id is valid
      insertCoupon();
    });
  } else {
    // Insert coupon without department_id or course_id if coupon_type is invalid
    insertCoupon();
  }

  function insertCoupon() {
    const sqlInsert = `
      INSERT INTO coupons (coupon_code, used, coupon_type, expiration_date, department_id, course_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sqlInsert, [coupon_code, used, coupon_type, expiration_date, department_id || null, course_id || null], (err, result) => {
      if (err) {
        console.error('Error inserting data: ' + err.message);
        return res.status(500).json({ message: "Error inserting coupon" });
      }
      res.status(201).json({ message: "Coupon added successfully", id: result.insertId });
    });
  }
});




const getCoupon = asyncHandler(async (req, res) => {
  const sqlSelect = "SELECT * FROM coupons";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error('Error selecting data: ' + err.message);
      return res.json({ message: "Error" });
    }
    res.status(201).json(result);
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { coupon_code, coupon_type, expiration_date, course_id, department_id } = req.body;

  const sqlUpdate = `
    UPDATE coupons 
    SET coupon_code = ?, coupon_type = ?, expiration_date = ?, 
    course_id = ?, department_id = ? 
    WHERE id = ?`;

  db.query(sqlUpdate, [coupon_code, coupon_type, expiration_date, course_id || null, department_id || null, id], (err, result) => {
    if (err) {
      console.error('Error updating data: ' + err.message);
      return res.status(500).json({ message: "Error updating coupon" });
    }
    res.status(200).json({ message: "Coupon updated successfully" });
  });
});



const getCouponById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const sqlSelect = "SELECT * FROM coupons WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
      if (err) {
          console.error('Error fetching data: ' + err.message);
          return res.status(500).json({ message: "Error fetching coupon" });
      }
      if (result.length === 0) {
          return res.status(404).json({ message: "Coupon not found" });
      }
      res.status(200).json(result[0]);
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Delete related records in the payments table
  const sqlDeletePayments = 'DELETE FROM payments WHERE coupon_id = ?';

  db.query(sqlDeletePayments, [id], (err) => { // Pass the coupon ID as a parameter
    if (err) {
      console.error('Error deleting payments: ' + err.message);
      return res.status(500).json({ message: "Error deleting related payments" });
    }

    // Now delete the coupon
    const sqlDelete = "DELETE FROM coupons WHERE id = ?";
    db.query(sqlDelete, [id], (err, result) => {
      if (err) {
        console.error('Error deleting data: ' + err.message);
        return res.status(500).json({ message: "Error deleting coupon" });
      }
      res.status(201).json({ message: "Coupon deleted successfully" });
    });
  });
});



    const getCouponByCode = asyncHandler(async (req, res) => {
      const { coupon_code } = req.params;
    
      // Validate coupon_code
      if (!coupon_code) {
        return res.status(400).json({ message: "Coupon code is required" });
      }
    
      // Query the coupons table
      const sql = 'SELECT * FROM coupons WHERE coupon_code = ?';
      db.query(sql, [coupon_code], (err, results) => {
        if (err) {
          console.error('Error querying coupons table: ' + err.message);
          return res.status(500).json({ message: "Error retrieving coupon" });
        }
    
        if (results.length === 0) {
          return res.status(404).json({ message: "Coupon not found" });
        }
    
        res.status(200).json(results[0]);
      });
    });
    

// Handler to delete all coupons
const deleteAllCoupons = asyncHandler(async (req, res) => {
  // Delete related records in the payments table
  const sqlDeletePayments = 'DELETE FROM payments WHERE coupon_id IS NOT NULL';
  
  db.query(sqlDeletePayments, (err) => {
    if (err) {
      console.error('Error deleting payments: ' + err.message);
      return res.status(500).json({ message: "Error deleting related payments" });
    }
    
    // Now delete all coupons
    const sqlDeleteCoupons = 'DELETE FROM coupons';

    db.query(sqlDeleteCoupons, (err, result) => {
      if (err) {
        console.error('Error deleting coupons: ' + err.message);
        return res.status(500).json({ message: "Error deleting coupons" });
      }
      res.status(200).json({ message: "All coupons deleted successfully" });
    });
  });
});



module.exports ={addCoupon,getCoupon,updateCoupon,deleteCoupon ,getCouponById ,getCouponByCode, deleteAllCoupons}