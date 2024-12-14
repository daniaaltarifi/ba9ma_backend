const asyncHandler = require("../Middleware/asyncHandler.js");
const db = require("../config.js");

const addDynamicBlog = asyncHandler(async (req, res) => {
  const { title, descr } = req.body;
  const sqlInsert = "INSERT INTO dynamicblog (title , descr) VALUES (? , ?)";
  db.query(sqlInsert, [title, descr], (err, result) => {
    if (err) {
        console.error('Error inserting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res
      .status(201)
      .json({ message: "dynamicblog added successfully" });  });
});
const getdynamicblog = asyncHandler(async (req, res) => {
    const sqlSelect = "SELECT * FROM dynamicblog";
    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.error('Error selecting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json(result);
    });
})
const updatedynamicblog = asyncHandler(async (req, res) => {
    const id=req.params.id;
    const {title, descr } = req.body;
    const sqlUpdate = "UPDATE dynamicblog SET title =?, descr =? WHERE id =?";
    db.query(sqlUpdate, [title, descr, id], (err, result) => {
      if (err) {
        console.error('Error updating data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json({ message: "dynamicblog updated successfully" });
    });
})
const deletedynamicblog=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const sqlDelete = "DELETE FROM dynamicblog WHERE id =?";
    db.query(sqlDelete, [id], (err, result) => {
      if (err) {
        console.error('Error deleting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json({ message: "dynamicblog deleted successfully" });
    });  });

module.exports={addDynamicBlog,getdynamicblog,updatedynamicblog,deletedynamicblog}