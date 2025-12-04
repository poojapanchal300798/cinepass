const express = require("express");
const router = express.Router();

const {
  getAllShows,
  addShow,
  updateShow,
  deleteShow
} = require("../controllers/showController");

// Get all shows
router.get("/", getAllShows);

// Add a show
router.post("/", addShow);

// Update a show
router.put("/:id", updateShow);

// Delete a show
router.delete("/:id", deleteShow);

module.exports = router;
