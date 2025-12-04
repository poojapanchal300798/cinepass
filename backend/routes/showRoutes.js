const express = require("express");
const router = express.Router();

// Import controller functions for show management
const {
  
 getShows, addShow, updateShow, deleteShow
} = require("../controllers/showController");

// Route to get all shows
router.get("/", getShows);

// Route to get a show by its ID
//router.get("/:id", getShowById);

// Route to create a new show
router.post("/", addShow);

// Route to update a show by its ID
router.put("/:id", updateShow);

// Route to delete a show by its ID
router.delete("/:id", deleteShow);

module.exports = router;
