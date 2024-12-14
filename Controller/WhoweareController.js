const asyncHandler = require("../Middleware/asyncHandler.js");
const db = require("../config.js");

const addWhoweare = asyncHandler(async (req, res) => {
const { title } = req.body;
const sqlInsert = "INSERT INTO whoweare (title) VALUES (?)";
db.query(sqlInsert, [title], (err, result) => {
    if (err) {
        console.error('Error inserting data: ' + err.message);
        return res.json({ message: "Error" });
    }
    res
    .status(201)
    .json({ message: "Whoweare added successfully" });  });
});
const getWhoweare = asyncHandler(async (req, res) => {
    const sqlSelect = "SELECT * FROM whoweare";
    db.query(sqlSelect, (err, result) => {
    if (err) {
        console.error('Error selecting data: ' + err.message);
        return res.json({ message: "Error" });
    }
    res.status(201).json(result);
    });
})
const updateWhoweare = asyncHandler(async (req, res) => {
    const id=req.params.id;
    const {title } = req.body;
    const sqlUpdate = "UPDATE whoweare SET title = ? WHERE id =?";
    db.query(sqlUpdate, [title, id], (err, result) => {
    if (err) {
        console.error('Error updating data: ' + err.message);
        return res.json({ message: "Error" });
    }
    res.status(201).json({ message: "Whoweare updated successfully" });
    });
})
const getWhoweareById = asyncHandler(async (req, res) => {
    const { id } = req.params;
        const sqlSelect = "SELECT * FROM whoweare WHERE id=?";
        db.query(sqlSelect,[id], (err, result) => {
        if (err) {
            console.error('Error selecting data: ' + err.message);
            return res.json({ message: "Error" });
        }
        res.status(201).json(result);
        });
    })

module.exports={addWhoweare,getWhoweare,updateWhoweare,getWhoweareById}