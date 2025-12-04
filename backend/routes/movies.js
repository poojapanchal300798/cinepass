const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/', movieController.getAllMovies);      // Get all movies
router.post('/', movieController.addMovie);         // Add a new movie
router.put('/:id', movieController.updateMovie);    // Update a movie by id
router.delete('/:id', movieController.deleteMovie); // Delete a movie by id

module.exports = router;
