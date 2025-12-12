const express = require("express");
const router = express.Router();

const {
  getAllShowtimes,
  addShowtime,
  updateShowtime,
  deleteShowtime
} = require("../controllers/showtimeController");

// GET all showtimes
router.get("/", getAllShowtimes);

// ADD new showtime
router.post("/", addShowtime);

// UPDATE showtime
router.put("/:id", updateShowtime);

// DELETE showtime
router.delete("/:id", deleteShowtime);

module.exports = router;
