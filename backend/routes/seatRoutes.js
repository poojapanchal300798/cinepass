const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// Get seats for a showtime
router.get('/showtime/:showtimeId', seatController.getSeatsForShowtime);

// Update seat status
router.put('/:seatId', seatController.updateSeatStatus);

// Check seat availability
router.post('/check-availability', seatController.checkSeatAvailability);

module.exports = router;