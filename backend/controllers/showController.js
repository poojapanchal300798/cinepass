const pool = require('../db');

// Get all shows
const getAllShows = async (req, res) => {
  const { movieId, locationId, date } = req.query;
  try {
    const result = await pool.query(`
      SELECT * FROM showtimes WHERE movie_id = $1 AND location_id = $2 AND date = $3
    `, [movieId, locationId, date]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch shows' });
  }
};

// Add a new show
const addShow = async (req, res) => {
  const { movieId, locationId, date, time, screen, adultPrice, childPrice } = req.body;
  try {
    const query = `
      INSERT INTO showtimes (movie_id, location_id, date, time, screen, adult_price, child_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [movieId, locationId, date, time, screen, adultPrice, childPrice];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add show' });
  }
};

// Update a show
const updateShow = async (req, res) => {
  const { id } = req.params;
  const { movieId, locationId, date, time, screen, adultPrice, childPrice } = req.body;
  try {
    const query = `
      UPDATE showtimes
      SET movie_id = $1, location_id = $2, date = $3, time = $4, screen = $5, adult_price = $6, child_price = $7
      WHERE id = $8 RETURNING *;
    `;
    const values = [movieId, locationId, date, time, screen, adultPrice, childPrice, id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update show' });
  }
};

// Delete a show
const deleteShow = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM showtimes WHERE id = $1', [id]);
    res.json({ message: 'Show deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete show' });
  }
};

module.exports = { getAllShows, addShow, updateShow, deleteShow };
