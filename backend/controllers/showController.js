const pool = require("../db");

// ===============================
// GET ALL SHOWS (FIXED FOR YOUR DB STRUCTURE)
// ===============================
const getAllShows = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name AS movie_title,
        movie_id,
        location,
        date,
        time,
        screen,
        adult_price,
        child_price
      FROM showtimes
      ORDER BY date ASC, time ASC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching shows:", err);
    res.status(500).json({ message: "Failed to fetch shows" });
  }
};

// ===============================
// ADD NEW SHOW
// ===============================
const addShow = async (req, res) => {
  const { movieId, location, date, time, screen, adultPrice, childPrice } = req.body;

  try {
    const query = `
      INSERT INTO showtimes 
      (movie_id, name, location, date, time, screen, adult_price, child_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [movieId, "", location, date, time, screen, adultPrice, childPrice];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Show added successfully",
      show: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding show:", err);
    res.status(500).json({ message: "Failed to add show" });
  }
};

// ===============================
// UPDATE SHOW
// ===============================
const updateShow = async (req, res) => {
  const { id } = req.params;
  const { movieId, location, date, time, screen, adultPrice, childPrice } = req.body;

  try {
    const query = `
      UPDATE showtimes
      SET movie_id = $1,
          location = $2,
          date = $3,
          time = $4,
          screen = $5,
          adult_price = $6,
          child_price = $7
      WHERE id = $8
      RETURNING *;
    `;

    const values = [movieId, location, date, time, screen, adultPrice, childPrice, id];

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: "Show updated successfully",
      show: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating show:", err);
    res.status(500).json({ message: "Failed to update show" });
  }
};

// ===============================
// DELETE SHOW
// ===============================
const deleteShow = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM showtimes WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Show deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting show:", err);
    res.status(500).json({ message: "Failed to delete show" });
  }
};

module.exports = { getAllShows, addShow, updateShow, deleteShow };
