    const asyncHandler = require("../Middleware/asyncHandler.js");
    const db = require("../config.js");

    const addBasmaTraining = asyncHandler(async (req, res) => {
    const { title, descr } = req.body;
    const sqlInsert = "INSERT INTO basmatraining (title , descr) VALUES (?, ?)";
    db.query(sqlInsert, [title, descr], (err, result) => {
        if (err) {
            console.error('Error inserting data: ' + err.message);
            return res.json({ message: "Error" });
        }
        res
        .status(201)
        .json({ message: "BasmaTraining added successfully" });  });
    });
    const getBasmaTraining = asyncHandler(async (req, res) => {
        const sqlSelect = "SELECT * FROM basmatraining";
        db.query(sqlSelect, (err, result) => {
        if (err) {
            console.error('Error selecting data: ' + err.message);
            return res.json({ message: "Error" });
        }
        res.status(201).json(result);
        });
    })
    const updateBasmaTraining = asyncHandler(async (req, res) => {
        const id=req.params.id;
        const {title, descr } = req.body;
        const sqlUpdate = "UPDATE basmatraining SET title =?, descr= ? WHERE id =?";
        db.query(sqlUpdate, [title, descr, id], (err, result) => {
        if (err) {
            console.error('Error updating data: ' + err.message);
            return res.json({ message: "Error" });
        }
        res.status(201).json({ message: "BasmaTraining updated successfully" });
        });
    })
    const getBasmaTrainingById = asyncHandler(async (req, res) => {
        const { id } = req.params;
            const sqlSelect = "SELECT * FROM basmatraining WHERE id=?";
            db.query(sqlSelect,[id], (err, result) => {
            if (err) {
                console.error('Error selecting data: ' + err.message);
                return res.json({ message: "Error" });
            }
            res.status(201).json(result);
            });
        })

    module.exports={addBasmaTraining,getBasmaTraining,updateBasmaTraining,getBasmaTrainingById}