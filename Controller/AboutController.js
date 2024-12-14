const db = require("../config.js");
const asyncHandler = require("../Middleware/asyncHandler.js");

// Function to get all entries from the about table
const getAbout = asyncHandler(async (req, res) => {
    const sqlSelect = `SELECT * FROM about`;
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send("Server Error");
        }
        res.json(result);
    });
});

// Function to get a specific entry by ID from the about table
const getAboutById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sqlSelect = `SELECT * FROM about WHERE id = ?`;
    db.query(sqlSelect, [id], (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send("Server Error");
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "About entry not found" });
        }
        res.json(result[0]);
    });
});

// Function to update an entry in the about table
const updateAbout = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, descr } = req.body;
    let img;

    if (req.files && req.files['img']) {
        img = req.files['img'][0].filename;
    }

    // Fetch the current about entry
    const sqlSelect = `SELECT * FROM about WHERE id = ?`;
    db.query(sqlSelect, [id], (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err.message);
            return res.status(500).send("Server Error");
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "About entry not found" });
        }

        // Determine the updated values, using existing data if fields are not provided
        const currentData = result[0];
        const updatedTitle = title || currentData.title;
        const updatedDescr = descr || currentData.descr;
        const updatedImg = img || currentData.img;

        // Update the about entry
        const sqlUpdate = `UPDATE about SET title=?, descr=?, img=? WHERE id=?`;
        db.query(sqlUpdate, [updatedTitle, updatedDescr, updatedImg, id], (err, result) => {
            if (err) {
                console.error('Error executing query: ' + err.message);
                return res.status(500).send("Server Error");
            }
            res.json({ message: "About Updated Successfully" });
        });
    });
});

module.exports = { getAbout, getAboutById, updateAbout };