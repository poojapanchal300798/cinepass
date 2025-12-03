const pool = require("../db"); // PostgreSQL connection

// Get all shows
const getShows = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shows');
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving shows:', err);
    res.status(500).send('Error retrieving shows');
  }
};

// Add a new show
const addShow = async (req, res) => {
  const { name, date_time, location, screen, adult_price, kid_price, seats } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO shows (name, date_time, location, screen, adult_price, kid_price, seats) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, date_time, location, screen, adult_price, kid_price, seats]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding new show:', err);
    res.status(500).send('Error adding new show');
  }
};

// Update an existing show
const updateShow = async (req, res) => {
  const { id } = req.params;
  const { name, date_time, location, screen, adult_price, kid_price, seats } = req.body;

  try {
    const result = await pool.query(
      'UPDATE shows SET name = $1, date_time = $2, location = $3, screen = $4, adult_price = $5, kid_price = $6, seats = $7 WHERE id = $8 RETURNING *',
      [name, date_time, location, screen, adult_price, kid_price, seats, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating show:', err);
    res.status(500).send('Error updating show');
  }
};

// Delete a show
const deleteShow = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM shows WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error deleting show:', err);
    res.status(500).send('Error deleting show');
  }
};

module.exports = { getShows, addShow, updateShow, deleteShow };
