const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Get all locations
router.get('/', locationController.getAllLocations);

// Get dates for a location
router.get('/:location/dates', locationController.getDatesForLocation);

// Get times for a location and date
router.get('/:location/dates/:date/times', locationController.getTimesForDate);

module.exports = router;