const asyncHandler = require("../Middleware/asyncHandler.js");
const db = require("../config.js");

const addBoxSlider = asyncHandler(async (req, res) => {
  const { title, descr } = req.body;
  const sqlInsert = "INSERT INTO boxslider (title , descr) VALUES (? , ?)";
  db.query(sqlInsert, [title, descr], (err, result) => {
    if (err) {
        console.error('Error inserting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res
      .status(201)
      .json({ message: "boxslider added successfully" });  });
});
const getboxslider = asyncHandler(async (req, res) => {
    const sqlSelect = "SELECT * FROM boxslider";
    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.error('Error selecting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json(result);
    });
})
const updateboxslider = asyncHandler(async (req, res) => {
    const id=req.params.id;
    const {title, descr } = req.body;
    const sqlUpdate = "UPDATE boxslider SET title =?, descr =? WHERE id =?";
    db.query(sqlUpdate, [title, descr, id], (err, result) => {
      if (err) {
        console.error('Error updating data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json({ message: "boxslider updated successfully" });
    });
})
const deleteboxslider=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const sqlDelete = "DELETE FROM boxslider WHERE id =?";
    db.query(sqlDelete, [id], (err, result) => {
      if (err) {
        console.error('Error deleting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json({ message: "boxslider deleted successfully" });
    });  });

    const getBoxById = asyncHandler(async (req, res) => {
        const { id } = req.params;
            const sqlSelect = "SELECT * FROM boxslider WHERE id=?";
            db.query(sqlSelect,[id], (err, result) => {
              if (err) {
                console.error('Error selecting data: ' + err.message);
                return res.json({ message: "Error" });
              }
              res.status(201).json(result);
            });
        })
module.exports={addBoxSlider,getboxslider,updateboxslider,deleteboxslider,getBoxById}