const asyncHandler=require('../Middleware/asyncHandler.js');
const db=require('../config.js')

const nodemailer = require('nodemailer');


// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS // Your email password or app-specific password
    }
});

const addCommentCourse = asyncHandler(async (req, res) => {
    const { name, email, comment, rating, course_id } = req.body;
    const defaultAction = 'not approved';

    // Query to get the course name based on course_id
    const sqlGetCourseName = 'SELECT subject_name FROM courses WHERE id = ?';
    db.query(sqlGetCourseName, [course_id], (err, courseResult) => {
        if (err) {
            return res.json({ message: err.message });
        }

        const courseName = courseResult[0]?.subject_name || 'Unknown Course';

        // Insert comment into commentcourse table
        const sqlInsert = 'INSERT INTO commentcourse (name, email, comment, rating, course_id, action) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sqlInsert, [name, email, comment, rating, course_id, defaultAction], (err, result) => {
            if (err) {
                return res.json({ message: err.message });
            }

            // Send email notification to the admin
            const mailOptions = {
                from: process.env.EMAIL_USER, // Sender address
                to: 'malak3alfarwan@gmail.com', // Replace with admin's email address
                subject: 'تعليق جديد يتطلب الموافقة',
    html: `
        <p>تم تقديم تعليق جديد ويتطلب موافقتك.</p>
                    <p><strong>Course Name:</strong> ${courseName}</p>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Comment:</strong> ${comment}</p>
                    <p><strong>Rating:</strong> ${rating}</p>
                     <p><strong>Course Name:</strong> ${courseName}</p>
                  <p>يرجى تسجيل الدخول إلى لوحة التحكم للموافقة على هذا التعليق أو رفضه:</p>
        <p><a href="https://dashboard.kassel.icu/">https://dashboard.kassel.icu/</a></p>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email to admin:', error);
                    return res.status(500).json({ message: 'Error sending email notification to admin' });
                }
                res.status(200).json({ message: 'Course Comment added successfully, admin notified' });
            });
        });
    });
});


const getCommentcourse = asyncHandler(async (req, res) => {
    // SQL query with JOIN to fetch course names along with commentcourse data
    const sqlSelect = `
    SELECT commentcourse.*,courses.subject_name AS course_name,
    teacher.teacher_name AS teacher_name,
    department.title AS department_title,
     DATE_FORMAT(commentcourse.created_at, '%Y-%m-%d') AS created_date 
     FROM commentcourse
    LEFT JOIN courses ON commentcourse.course_id = courses.id
    LEFT JOIN teacher ON courses.teacher_id = teacher.id
    LEFT JOIN department ON courses.department_id = department.id
 `;
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.error("SQL Error:", err.message);
            return res.status(500).json({ message: err.message });
        }
               res.status(200).json(result);
    });
});

const updateActionCommentCourse =asyncHandler(async(req,res)=>{
    const { id } = req.params;
    const { action } = req.body;

    if (!action) {
        return res.status(400).send({ error: 'action is required' });
    }

    const updateBlogSql = 'UPDATE commentcourse SET action = ? WHERE id = ?';
    db.query(updateBlogSql, [action, id], (err, result) => {
        if (err) {
            console.error('Failed to update course status:', err);
            return res.status(500).send({ error: 'Failed to update course status' });
        }

        res.status(200).send({ message: 'course status updated successfully' });
    });
})

const deleteCommentcourse = asyncHandler(async (req, res) => {
    const {id}=req.params;
    const sqlDelete = 'DELETE FROM commentcourse WHERE id =?';
    db.query(sqlDelete,[id],(err,result)=>{
        if(err){
            return res.json({message:err.message})
        }
        res.status(200).json({message: 'course Comment deleted successfully'})
    })
})
module.exports = {addCommentCourse,getCommentcourse,deleteCommentcourse,updateActionCommentCourse}
