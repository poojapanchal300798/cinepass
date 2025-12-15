const pool = require('../db');

// GET all shows
exports.getAllShows = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        date,
        location,
        screen,
        adult_price,
        kid_price,
        seats,
        poster
      FROM shows
      ORDER BY date ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Fetch shows error:', err.message);
    res.status(500).json({ message: 'Failed to fetch shows' });
  }
};

// ADD show
exports.addShow = async (req, res) => {
  try {
    const {
      name,
      date,
      location,
      screen,
      adult_price,
      kid_price,
      seats
    } = req.body;

    await pool.query(
      `INSERT INTO shows
       (name, date, location, screen, adult_price, kid_price, seats)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [name, date, location, screen, adult_price, kid_price, seats || 150]
    );

    res.status(201).json({ message: 'Show added' });
  } catch (err) {
    console.error('Add show error:', err.message);
    res.status(500).json({ message: 'Failed to add show' });
  }
};

// ✅ UPDATE show (THIS WAS THE BUG)
exports.updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,          // ✅ REQUIRED
      date,
      location,
      screen,
      adult_price,
      kid_price
    } = req.body;

    await pool.query(
      `UPDATE shows
       SET
         name = $1,
         date = $2,
         location = $3,
         screen = $4,
         adult_price = $5,
         kid_price = $6
       WHERE id = $7`,
      [
        name,
        date,
        location,
        screen,
        adult_price,
        kid_price,
        id
      ]
    );

    res.json({ message: 'Show updated' });
  } catch (err) {
    console.error('Update show error:', err.message);
    res.status(500).json({ message: 'Failed to update show' });
  }
};

// DELETE show
exports.deleteShow = async (req, res) => {
  try {
    await pool.query('DELETE FROM shows WHERE id=$1', [req.params.id]);
    res.json({ message: 'Show deleted' });
  } catch (err) {
    console.error('Delete show error:', err.message);
    res.status(500).json({ message: 'Failed to delete show' });
  }
};
