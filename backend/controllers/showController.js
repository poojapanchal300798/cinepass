const pool = require("../db");

// ===============================
// GET ALL SHOWS
// ===============================
const getAllShows = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.movie_id,
        m.title AS movie_title,
        m.image_url AS movie_image,
        s.location_id,
        l.name AS location_name,
        s.date,
        s.time,
        s.screen,
        s.adult_price,
        s.child_price
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.id
      JOIN locations l ON s.location_id = l.id
      ORDER BY s.date ASC, s.time ASC;
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
  const { movieId, locationId, date, time, screen, adultPrice, childPrice } = req.body;

  try {
    const query = `
      INSERT INTO showtimes 
      (movie_id, location_id, date, time, screen, adult_price, child_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [movieId, locationId, date, time, screen, adultPrice, childPrice];
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
  const { movieId, locationId, date, time, screen, adultPrice, childPrice } = req.body;

  try {
    const query = `
      UPDATE showtimes
      SET movie_id = $1,
          location_id = $2,
          date = $3,
          time = $4,
          screen = $5,
          adult_price = $6,
          child_price = $7
      WHERE id = $8
      RETURNING *;
    `;

    const values = [
      movieId,
      locationId,
      date,
      time,
      screen,
      adultPrice,
      childPrice,
      id,
    ];

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
