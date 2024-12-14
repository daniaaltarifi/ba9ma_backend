const asyncHandler = require("../Middleware/asyncHandler.js");
const db = require("../config.js");

const addFaq = asyncHandler(async (req, res) => {
  const { ques, ans } = req.body;
  const sqlInsert = "INSERT INTO faq (ques , ans) VALUES (? , ?)";
  db.query(sqlInsert, [ques, ans], (err, result) => {
    if (err) {
        console.error('Error inserting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res
      .status(201)
      .json({ message: "faq added successfully" });  });
});
const getFaq = asyncHandler(async (req, res) => {
    const sqlSelect = "SELECT * FROM faq";
    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.error('Error selecting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json(result);
    });
})




const getFaqById = asyncHandler(async (req, res) => {
  // Extract the FAQ ID from the request parameters
  const { id } = req.params;

  // Prepare the SQL query to select the FAQ entry with the given ID
  const sqlSelect = "SELECT * FROM faq WHERE id = ?";

  // Execute the query
  db.query(sqlSelect, [id], (err, result) => {
      if (err) {
          // Log the error and return a response with an error message
          console.error('Error selecting data: ' + err.message);
          return res.status(500).json({ message: "Error retrieving FAQ entry" });
      }

      // Check if any result was found
      if (result.length === 0) {
          // Return a 404 response if the FAQ entry was not found
          return res.status(404).json({ message: "FAQ entry not found" });
      }

      // Return the result (FAQ entry) in the response
      res.status(200).json(result[0]);
  });
});

const updateFaq = asyncHandler(async (req, res) => {
    const id=req.params.id;
    const {ques, ans } = req.body;
    const sqlUpdate = "UPDATE faq SET ques =?, ans =? WHERE id =?";
    db.query(sqlUpdate, [ques, ans, id], (err, result) => {
      if (err) {
        console.error('Error updating data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json({ message: "faq updated successfully" });
    });
})
const deleteFaq=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const sqlDelete = "DELETE FROM faq WHERE id =?";
    db.query(sqlDelete, [id], (err, result) => {
      if (err) {
        console.error('Error deleting data: ' + err.message);
        return res.json({ message: "Error" });
      }
      res.status(201).json({ message: "faq deleted successfully" });
    });  });

module.exports={addFaq,getFaq,updateFaq,deleteFaq , getFaqById}