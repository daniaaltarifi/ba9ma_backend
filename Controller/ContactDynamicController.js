const asyncHandler = require("../Middleware/asyncHandler.js");
const db = require("../config.js");

const addContact = asyncHandler(async (req, res) => {
  const { title, descr,phone,email,facebook,whatsup } = req.body;
  const sqlInsert = "INSERT INTO contactus (title , descr, phone, email, facebook, whatsup) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sqlInsert, [title, descr,phone,email,facebook,whatsup], (err, result) => {
    if (err) {
        console.error('Error inserting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res
      .status(201)
      .json({ message: "contactus added successfully" });  });
});
const getcontactus = asyncHandler(async (req, res) => {
    const sqlSelect = "SELECT * FROM contactus";
    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.error('Error selecting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json(result);
    });
})
const updatecontactus = asyncHandler(async (req, res) => {
    const id=req.params.id;
    const {title, descr,phone,email,facebook,whatsup } = req.body;
    const sqlUpdate = "UPDATE contactus SET title =?, descr= ?, phone =?, email =?, facebook =?, whatsup =? WHERE id =?";
    db.query(sqlUpdate, [title, descr,phone,email,facebook,whatsup, id], (err, result) => {
      if (err) {
        console.error('Error updating data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json({ message: "contactus updated successfully" });
    });
})
const getContactById = asyncHandler(async (req, res) => {
    const { id } = req.params;
        const sqlSelect = "SELECT * FROM contactus WHERE id=?";
        db.query(sqlSelect,[id], (err, result) => {
          if (err) {
            console.error('Error selecting data: ' + err.message);
            return res.json({ message: "Error" });
          }
          res.status(201).json(result);
        });
    })

module.exports={addContact,getcontactus,updatecontactus,getContactById}