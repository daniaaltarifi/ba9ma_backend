const db = require("../config.js");
const asyncHandler = require("../Middleware/asyncHandler.js");
const getAboutTeacher=asyncHandler(async(req,res)=>{
    const sqlSelect = `SELECT * FROM aboutteacher`
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send("Server Error");
        }
        res.json(result);
    });
    
})
const updateAboutTeacher = asyncHandler(async(req, res)=>{
    const {id}=req.params;
    const {title, descr,para}=req.body;
    let img;
    if (req.files && req.files["img"] && req.files["img"][0]) {
      img = req.files["img"][0].filename; // New image provided
    } else {
      // Fetch the current image from the database
      const fetchImgSql = "SELECT img FROM aboutteacher WHERE id = ?";
      const [rows] = await db.promise().query(fetchImgSql, [id]);
      if (rows.length === 0) {
        return res.status(404).send({
          error: "aboutteacher not found",
          message: "No aboutteacher found with the provided ID",
        });
      }
      img = rows[0].img; // Use existing image if no new image is provided
    }
    // const img = req.files['img'][0].filename;
    // if (!title || !img || !descr) {
    //     return res.status(400).json({ message: "All fields (title, descr, img) are required." });
    // }
    const sqlUpdate = `UPDATE aboutteacher SET title=?, descr=?, img=?, para=? WHERE id=?`
    db.query(sqlUpdate, [title, descr, img, para, id], (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send("Server Error");
        }
        res.json({message: "About Updated Successfully"});
    });
    
 
})
const getAboutTeacherById = asyncHandler(async (req, res) => {
    const { id } = req.params;
        const sqlSelect = "SELECT * FROM aboutteacher WHERE id=?";
        db.query(sqlSelect,[id], (err, result) => {
        if (err) {
            console.error('Error selecting data: ' + err.message);
            return res.json({ message: "Error" });
        }
        res.status(201).json(result);
        });
    })
module.exports = {getAboutTeacher,updateAboutTeacher,getAboutTeacherById}