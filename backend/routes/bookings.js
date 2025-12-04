const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.post('/', bookingController.bookSeats);  // Book seats for a show
router.get('/:id', bookingController.getBooking); // Get booking details by id

module.exports = router;
