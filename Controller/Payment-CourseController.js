const db = require("../config.js");
const asyncHandler = require("../Middleware/asyncHandler.js");


const validateCouponCode = async (req, res) => {
  const { coupon_code, course_id } = req.body;

  if (!coupon_code) {
    return res.status(400).json({ error: 'Coupon code is required' });
  }

  if (!course_id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    const currentDateTime = new Date();
    const checkCouponSql = `
      SELECT id, coupon_type, used, expiration_date, course_id
      FROM coupons
      WHERE coupon_code = ? AND expiration_date > ?`;
      
    const [results] = await db.promise().query(checkCouponSql, [coupon_code, currentDateTime]);

    if (results.length === 0) {
      return res.status(400).json({ error: "رمز الكوبون غير صالح" }); // Coupon code is invalid
    }

    const coupon = results[0];

    if (coupon.used) {
      return res.status(400).json({ error: "رمز الكوبون تم استخدامه بالفعل" }); // Coupon code has already been used
    }

    // Validate course_id if coupon is specific to a course
    if (coupon.coupon_type === 'course' && coupon.course_id !== course_id) {
      return res.status(400).json({ error: "رمز الكوبون غير صالح لهذه الدورة" }); // Coupon code is not valid for this course
    }

    // Coupon is valid
    res.status(200).json({ message: "Coupon code is valid", couponId: coupon.id, couponType: coupon.coupon_type });
  } catch (error) {
    console.error("Error validating coupon code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const buyCourse = (req, res) => {
  const { student_name, email, address, phone, course_id, coupon_code, user_id } = req.body;

  // Check if all required fields are provided
  if (!student_name || !email || !address || !phone || !course_id || !user_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const currentDateTime = new Date();

  // Step 1: Check if the coupon code is valid and not expired
  const checkCouponSql = `
    SELECT id, coupon_type, used, expiration_date, course_id 
    FROM coupons 
    WHERE coupon_code = ? AND (expiration_date IS NULL OR expiration_date > ?)`;

  db.query(checkCouponSql, [coupon_code, currentDateTime], (err, results) => {
    if (err) {
      console.error("Error checking coupon:", err);
      return res.status(500).json({ error: "Database error while checking coupon" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid or expired coupon code" });
    }

    const coupon = results[0];

    // Check if coupon has already been used
    if (coupon.used) {
      return res.status(400).json({ error: "Coupon code has already been used" });
    }

    // Step 2: Ensure the coupon is valid for the specific course
    if (coupon.coupon_type === 'course' && coupon.course_id !== course_id) {
      return res.status(400).json({ error: "Coupon is not valid for this course" });
    }

    // Step 3: Insert the payment record
    const insertPaymentSql = `
      INSERT INTO payments (student_name, email, address, phone, course_id, coupon_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(insertPaymentSql, [student_name, email, address, phone, course_id, coupon.id, user_id], (err, result) => {
      if (err) {
        console.error("Error inserting payment:", err);
        return res.status(500).json({ error: "Database error while inserting payment" });
      }

      const payment_id = result.insertId;

      // Step 4: Ensure the course exists
      const fetchCoursesSql = 'SELECT id FROM courses WHERE id = ?';
      db.query(fetchCoursesSql, [course_id], (err, courses) => {
        if (err) {
          console.error("Error fetching course:", err);
          return res.status(500).json({ error: "Database error while fetching course" });
        }

        if (courses.length === 0) {
          return res.status(400).json({ error: "Course not found" });
        }

        // Step 5: Mark the coupon as used
        const markCouponUsedSql = 'UPDATE coupons SET used = TRUE WHERE id = ?';
        db.query(markCouponUsedSql, [coupon.id], (err) => {
          if (err) {
            console.error("Error marking coupon as used:", err);
            return res.status(500).json({ error: "Database error while updating coupon" });
          }

          // Step 6: Insert record into course_users table
          const insertCourseUsersSql = `
            INSERT INTO course_users (user_id, course_id, payment_id)
            VALUES (?, ?, ?)`;

          db.query(insertCourseUsersSql, [user_id, course_id, payment_id], (err) => {
            if (err) {
              console.error("Error inserting course_users record:", err);
              return res.status(500).json({ error: "Database error while adding user to course" });
            }

            res.json({ message: "Course purchased successfully" });
          });
        });
      });
    });
  });
};












const getApprovedCoursesForUser = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const sqlSelect = `
    SELECT course_users.*, 
           department.title AS department_name,
           department.id AS department_id,
           courses.subject_name AS subject_name,
           courses.id AS course_id,
           courses.created_at AS course_created_at,
           courses.img AS img,
           teacher.teacher_name AS teacher_name
    FROM course_users
    LEFT JOIN payments ON course_users.payment_id = payments.id
    LEFT JOIN department ON payments.department_id = department.id
    LEFT JOIN courses ON course_users.course_id = courses.id
    LEFT JOIN teacher ON courses.teacher_id = teacher.id
    LEFT JOIN coupons ON payments.coupon_id = coupons.id
    WHERE course_users.payment_status = 'approved' 
      AND course_users.user_id = ?
      AND (coupons.expiration_date >= CURDATE() OR coupons.expiration_date IS NULL)  -- Filter out courses associated with expired coupons
  `;

  db.query(sqlSelect, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching approved courses:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});




module.exports = { buyCourse ,validateCouponCode ,getApprovedCoursesForUser};