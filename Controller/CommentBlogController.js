const asyncHandler=require('../Middleware/asyncHandler.js');
const db=require('../config.js')

const nodemailer = require('nodemailer');




// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:  process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS // Your email password or app-specific password
    }
});

const addCommentBlog = asyncHandler(async (req, res) => {
    const { name, email, comment, blog_id } = req.body;
    const defaultAction = 'not approved';

    // Query to get the blog name based on blog_id
    const sqlGetBlogName = 'SELECT title FROM blog WHERE id = ?';
    db.query(sqlGetBlogName, [blog_id], (err, blogResult) => {
        if (err) {
            return res.json({ message: err.message });
        }

        const blogName = blogResult[0]?.title || 'Unknown Blog';

        // Insert comment into commentblog table
        const sqlInsert = 'INSERT INTO commentblog (name, email, comment, blog_id, action) VALUES (?, ?, ?, ?, ?)';
        db.query(sqlInsert, [name, email, comment, blog_id, defaultAction], (err, result) => {
            if (err) {
                return res.json({ message: err.message });
            }

            // Send email notification to admin
            const mailOptions = {
                from: process.env.EMAIL_USER, // Replace with your email
                to: 'malak3alfarwan@gmail.com', // Replace with the admin's email
                subject: 'تعليق جديد يتطلب الموافقة',
                html: `
                     <p>تم تقديم تعليق جديد ويتطلب موافقتك </p>
                   
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Comment:</strong> ${comment}</p>
                     <p><strong>Blog Name:</strong> ${blogName}</p>
                  <p>يرجى تسجيل الدخول إلى لوحة التحكم للموافقة على هذا التعليق أو رفضه:</p>
        <p><a href="https://dashboard.kassel.icu/">https://dashboard.kassel.icu/</a></p>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Failed to send email notification' });
                }
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Blog Comment added successfully and email sent to admin' });
            });
        });
    });
});
const getCommentBlog = asyncHandler(async (req, res) => {
    // Fetch data from blog and department tables to return department name
    const sqlSelect = `
       SELECT commentblog.*,blog.title AS blog_name,
        DATE_FORMAT(commentblog.created_at, '%Y-%m-%d') AS created_date 
        FROM commentblog
        JOIN blog ON commentblog.blog_id = blog.id
    `;
    
    db.query(sqlSelect, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
     
        
        res.status(200).json(result);

    });
});
const updateActionCommentBlogs =asyncHandler(async(req,res)=>{
    const { id } = req.params;
    const { action } = req.body;

    if (!action) {
        return res.status(400).send({ error: 'action is required' });
    }

    const updateBlogSql = 'UPDATE commentblog SET action = ? WHERE id = ?';
    db.query(updateBlogSql, [action, id], (err, result) => {
        if (err) {
            console.error('Failed to update blog status:', err);
            return res.status(500).send({ error: 'Failed to update blog status' });
        }

        res.status(200).send({ message: 'Blog status updated successfully' });
    });
})
const deleteCommentBlog = asyncHandler(async (req, res) => {
    const {id}=req.params;
    const sqlDelete = 'DELETE FROM commentblog WHERE id =?';
    db.query(sqlDelete,[id],(err,result)=>{
        if(err){
            return res.json({message:err.message})
        }
        res.status(200).json({message: 'Blog Comment deleted successfully'})
    })
})
module.exports = {addCommentBlog,getCommentBlog,deleteCommentBlog,updateActionCommentBlogs}