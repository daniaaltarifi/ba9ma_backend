const db = require("../config.js");
const asyncHandler = require("../Middleware/asyncHandler.js");
const addpurchasesteps = asyncHandler(async (req, res) => {
    const { title, descr } = req.body;
    const img = req.files["img"][0].filename;

    const sqlInsert = "INSERT INTO purchasesteps (title , descr, img) VALUES (?, ?, ?)";
    db.query(sqlInsert, [title, descr, img], (err, result) => {
        if (err) {
            console.error('Error inserting data: ' + err.message);
            return res.json({ message: "Error" });
        }
        res
        .status(201)
        .json({ message: "purchasesteps added successfully" });  });
    });

const getpurchasesteps=asyncHandler(async(req,res)=>{
    const sqlSelect = `SELECT * FROM purchasesteps`
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send("Server Error");
        }
        res.json(result);
    });
    
})
const updatepurchasesteps = asyncHandler(async(req, res)=>{
    const {id}=req.params;
    const {title, descr}=req.body;
    let img;
    if (req.files && req.files["img"] && req.files["img"][0]) {
      img = req.files["img"][0].filename; // New image provided
    } else {
      // Fetch the current image from the database
      const fetchImgSql = "SELECT img FROM purchasesteps WHERE id = ?";
      const [rows] = await db.promise().query(fetchImgSql, [id]);
      if (rows.length === 0) {
        return res.status(404).send({
          error: "purchasesteps not found",
          message: "No purchasesteps found with the provided ID",
        });
      }
      img = rows[0].img; // Use existing image if no new image is provided
    }
    // const img = req.files['img'][0].filename;
    // if (!title || !img || !descr) {
    //     return res.status(400).json({ message: "All fields (title, descr, img) are required." });
    // }
    const sqlUpdate = `UPDATE purchasesteps SET title=?, descr=?, img=? WHERE id=?`
    db.query(sqlUpdate, [title, descr, img, id], (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send("Server Error");
        }
        res.json({message: "purchasesteps Updated Successfully"});
    });
    
 
})
const getpurchasestepsById = asyncHandler(async (req, res) => {
    const { id } = req.params;
        const sqlSelect = "SELECT * FROM purchasesteps WHERE id=?";
        db.query(sqlSelect,[id], (err, result) => {
        if (err) {
            console.error('Error selecting data: ' + err.message);
            return res.json({ message: "Error" });
        }
        res.status(201).json(result);
        });
    })
    const deletePurchasesteps=asyncHandler(async(req,res)=>{
        const id=req.params.id;
        const sqlDelete = "DELETE FROM purchasesteps WHERE id =?";
        db.query(sqlDelete, [id], (err, result) => {
          if (err) {
            console.error('Error deleting data: ' + err.message);
            return res.json({ message: "Error" });
          }
          res.status(201).json({ message: "purchasesteps deleted successfully" });
        });  });
module.exports = {getpurchasesteps,updatepurchasesteps,getpurchasestepsById,deletePurchasesteps,addpurchasesteps}