const asyncHandler=require('../Middleware/asyncHandler.js');
const db=require('../config.js')
const addSliders= asyncHandler(async(req,res)=>{
    const {title, descr, btn_name, page} = req.body
    const img = req.files && req.files["img"] ? req.files["img"][0].filename : null;
    const slider_img =req.files["slider_img"][0].filename;

    if (!page || !slider_img) {
        return res.status(400).send({
          error: "Please fill all required fields",
          message: "Title cannot be null or empty",
        });
      }
    const sqlInsert = "INSERT INTO slider (title, descr, btn_name, img, page, slider_img) VALUES (?,?,?,?,?,?)";
    db.query(sqlInsert, [title, descr, btn_name, img, page, slider_img], (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err.message);
            return res.json({ message: "Error" });
        }
        res.json({ message: "Slider added successfully", data: result});
    });
 });
 const getSliders=asyncHandler(async(req,res)=>{
    const sqlSelect = "SELECT * FROM slider";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.error('Error getting data: ', err.message);
            return res.json({ message: "Error" });
        }
        res.json(result);
    });
 })
 const getSliderByPage=asyncHandler(async(req,res)=>{
    const {page}=req.params
    const sqlSelect = "SELECT img,slider_img,title,descr,btn_name,page FROM slider WHERE page = ?";
    db.query(sqlSelect,[page], (err, result) => {
        if (err) {
            console.error('Error selecting data: ', err.message);
            return res.json({ message: "Error" });
        }
        res.json(result);
    });
 })
 const updateSlider = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, descr ,btn_name} = req.body;
  
    // Validate required fields
    if (!id) {
      return res.status(400).json({ message: "ID are required." });
    }
  
    // Fetch existing slider data
    const fetchSliderSql = "SELECT img, slider_img FROM slider WHERE id = ?";
    const [rows] = await db.promise().query(fetchSliderSql, [id]);
  
    if (rows.length === 0) {
      return res.status(404).send({
        error: "Slider not found",
        message: "No slider found with the provided ID",
      });
    }
  
    // Get existing images
    const existingSlider = rows[0];
    let img = existingSlider.img;
    let slider_img = existingSlider.slider_img;
  
    // Check if new images are provided and use them if available
    if (req.files) {
      if (req.files["img"] && req.files["img"][0]) {
        img = req.files["img"][0].filename; // New image provided
      }
  
      if (req.files["slider_img"] && req.files["slider_img"][0]) {
        slider_img = req.files["slider_img"][0].filename; // New image provided
      }
    }
  
    // Construct SQL query for update
    const sqlUpdate = `
      UPDATE slider
      SET title = ?, descr = ?, btn_name = ?, img = ?, slider_img = ?
      WHERE id = ?`;
  
    try {
      const [result] = await db.promise().query(sqlUpdate, [title, descr, btn_name, img, slider_img, id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Slider not found' });
      }
  
      res.status(200).json({ message: 'Slider updated successfully' });
    } catch (err) {
      console.error('Error updating data: ', err.message);
      res.status(500).json({ message: err.message });
    }
  });
  

const getSliderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
        const sqlSelect = "SELECT * FROM slider WHERE id=?";
        db.query(sqlSelect,[id], (err, result) => {
        if (err) {
            console.error('Error selecting data: ' + err.message);
            return res.json({ message: "Error" });
        }
        res.status(201).json(result);
        });
    })
const deleteSlide=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const sqlDelete = 'DELETE FROM slider WHERE id =?';
    db.query(sqlDelete,[id],(err,result)=>{
        if(err){
            return res.json({message:err.message})
        }
        res.status(200).json({message: 'Slider deleted successfully'})
    })
 
})
const fs = require('fs');
const path = require('path');
const deleteImgSlide=asyncHandler(async(req,res)=>{
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    // Fetch the image filename from the database
    const [rows] = await db.promise().query('SELECT img FROM slider WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'img not found' });
    }

    const imgName = rows[0].img;

    // Update the slider to remove the image reference
    await db.promise().query('UPDATE slider SET img = NULL WHERE id = ?', [id]);

    // Delete the image file if it exists
    if (imgName) {
      const filePath = path.join(__dirname, 'images', imgName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err.message);
    res.status(500).json({ message: err.message });
  }
})
module.exports={addSliders,getSliderByPage,updateSlider,getSliders,deleteSlide,getSliderById,deleteImgSlide}