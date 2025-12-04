const pool = require('../db');

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
};

// Add a new movie
const addMovie = async (req, res) => {
  const { title, genre, description, duration, rating, image } = req.body;
  try {
    const query = `
      INSERT INTO movies (title, genre, description, duration, rating, image)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [title, genre, description, duration, rating, image];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add movie' });
  }
};

// Update movie details
const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, genre, description, duration, rating, image } = req.body;
  try {
    const query = `
      UPDATE movies
      SET title = $1, genre = $2, description = $3, duration = $4, rating = $5, image = $6
      WHERE id = $7 RETURNING *;
    `;
    const values = [title, genre, description, duration, rating, image, id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update movie' });
  }
};

// Delete a movie
const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM movies WHERE id = $1', [id]);
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete movie' });
  }
};

module.exports = { getAllMovies, addMovie, updateMovie, deleteMovie };
