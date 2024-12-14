const asyncHandler=require('../Middleware/asyncHandler.js')
const db=require('../config.js');
const path = require('path');
const addLibrary = asyncHandler(async (req, res) => {
    const { book_name, author, page_num, department_id } = req.body;
        if (!book_name || !author || !page_num || !department_id || !req.file) {
        return res.status(400).json({ message: "All fields (book_name, author, page_num, department_id, file_book) are required." });
    }
    const file_book = req.file.filename;

    const sqlInsert = 'INSERT INTO library (book_name, author, page_num, file_book, department_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sqlInsert, [book_name, author, page_num, file_book, department_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ message: 'Library added successfully' });
    });
});

const getLibrary = asyncHandler(async(req,res)=>{
    const sqlSelect = `
       SELECT library.*, department.title AS department_name,
        DATE_FORMAT(library.created_at, '%Y-%m-%d') AS created_date 
        FROM library
        JOIN department ON library.department_id = department.id
    `;
    
    db.query(sqlSelect,(err,result)=>{
        if(err){
            res.download(`../images/${result.file_book}`)
            return res.json({message: err.message})
        }
        res.json(result)
    })
})
//get the file and download it
const getByFile = (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, '../images', fileName); 

    res.download(filePath, fileName, (err) => {
        if (err) {
            res.status(500).json({ message: 'File download failed' });
        } else {
            res.status(200).json({ message: 'File downloaded successfully' });
        }
    });
};
//get all library by department
const getByDepartment = (req, res) => {
    const department_id = req.params.id; // Access id from req.params
    const sqlSelect = `
        SELECT library.*, department.title AS department_name,
        DATE_FORMAT(library.created_at, '%Y-%m-%d') AS created_date
        FROM library
        JOIN department ON library.department_id = department.id
        WHERE library.department_id = ?
    `;
    
    db.query(sqlSelect, [department_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(result);
    });
};
const updateLibrary = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Log the received data to ensure all fields are present
    const { book_name, author, page_num, department_id } = req.body;
    let file_book;
    // Check if the 'file_book' file exists in the request
    if (req.files && req.files.file_book && req.files.file_book[0]) {
        file_book = req.files.file_book[0].filename; 
    }
    console.log('Received file_book:', file_book);

    // Fetch the current values of file_book
    const checkSql = 'SELECT file_book FROM library WHERE id = ?';
    db.query(checkSql, [id], (checkErr, checkResult) => {
        if (checkErr) {
            console.log(checkErr);
            return res.json({ error: 'Error checking data' });
        }
        if (checkResult.length === 0) {
            return res.json({ error: 'No data found for the specified ID' });
        }

        const currentFileBook = checkResult[0].file_book;

        // Determine which file to update
        const updatedFileBook = file_book ? file_book : currentFileBook; // Use the new file if uploaded, otherwise retain the current one

        // Update only the text fields and respective file
        const sqlUpdateText = 'UPDATE library SET book_name = ?, author = ?, page_num = ?, department_id = ?, file_book = ? WHERE id = ?';
        db.query(sqlUpdateText, [book_name, author, page_num, department_id, updatedFileBook, id], (updateErr, updateResult) => {
            if (updateErr) {
                console.log(updateErr);
                return res.json({ error: 'Error updating data' });
            }
            console.log(updateResult);
            // Now, file_book is defined and can be safely used here
            res.json({ id, book_name, author, page_num, department_id, file_book: updatedFileBook });
        });
    });
});
const deleteBook=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const sqlDelete = "DELETE FROM library WHERE id =?";
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            return res.json({ message: err.message });
        }
        res.status(200).json({ message: "Library deleted successfully" });
    });
})
const getLibraryById=asyncHandler(async(req,res)=>{
    const { id }=req.params;
    const sql="SELECT * FROM library WHERE id = ?";
    db.query(sql,[id],(err,result)=>{
      if(err){
        console.error('Error fetching library data: '+err.message);
        return res.status(500).json({message:"Error fetching library data"});
      }
      if(result.length===0){
        return res.status(404).json({message:"library not found"});
      }
      return res.json(result[0]);
    })
  })
module.exports={addLibrary,getLibrary,updateLibrary,deleteBook,getByFile,getByDepartment,getLibraryById}