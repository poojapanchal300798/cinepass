const express = require('express');
const showController = require('../controllers/showController');

const router = express.Router();

router.get('/', showController.getAllShows);        // Get all shows
router.post('/', showController.addShow);           // Add a new show
router.put('/:id', showController.updateShow);      // Update a show by id
router.delete('/:id', showController.deleteShow);   // Delete a show by id

module.exports = router;
