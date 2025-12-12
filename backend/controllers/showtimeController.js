const pool = require("../db");

// ============================================
// GET ALL SHOWTIMES
// ============================================
const getAllShowtimes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        movie_id,
        movie_title,
        location,
        auditorium,
        show_datetime
      FROM showtimes
      ORDER BY show_datetime ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching showtimes:", err);
    res.status(500).json({ message: "Failed to fetch showtimes" });
  }
};

// ============================================
// ADD SHOWTIME
// ============================================
const addShowtime = async (req, res) => {
  const { movieId, movieTitle, location, auditorium, showDatetime } = req.body;

  try {
    const conflict = await pool.query(
      `
        SELECT id FROM showtimes 
        WHERE location = $1
        AND auditorium = $2
        AND show_datetime = $3
      `,
      [location, auditorium, showDatetime]
    );

    if (conflict.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "A showtime already exists for this auditorium at that time.",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO showtimes 
        (movie_id, movie_title, location, auditorium, show_datetime)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [movieId, movieTitle, location, auditorium, showDatetime]
    );

    res.status(201).json({
      success: true,
      message: "Showtime added successfully",
      show: result.rows[0],
    });

  } catch (err) {
    console.error("Error adding showtime:", err);
    res.status(500).json({ message: "Failed to add showtime" });
  }
};

// ============================================
// UPDATE SHOWTIME
// ============================================
const updateShowtime = async (req, res) => {
  const { id } = req.params;
  const { movieId, movieTitle, location, auditorium, showDatetime } = req.body;

  try {
    const result = await pool.query(
      `
        UPDATE showtimes
        SET movie_id = $1,
            movie_title = $2,
            location = $3,
            auditorium = $4,
            show_datetime = $5
        WHERE id = $6
        RETURNING *
      `,
      [movieId, movieTitle, location, auditorium, showDatetime, id]
    );

    res.json({
      success: true,
      message: "Showtime updated",
      show: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating showtime:", err);
    res.status(500).json({ message: "Failed to update showtime" });
  }
};

// ============================================
// DELETE SHOWTIME
// ============================================
const deleteShowtime = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM showtimes WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Showtime deleted",
    });
  } catch (err) {
    console.error("Error deleting showtime:", err);
    res.status(500).json({ message: "Failed to delete showtime" });
  }
};

module.exports = {
  getAllShowtimes,
  addShowtime,
  updateShowtime,
  deleteShowtime
};
