const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// LOCK seats for 3 minutes
router.post("/lock", async (req, res) => {
  const { showId, seatLabels, userId } = req.body;

  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // auto release in 3 mins

  try {
    await Promise.all(
      seatLabels.map(label =>
        pool.query(
          `INSERT INTO seat_locks (show_id, seat_label, user_id, expires_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (show_id, seat_label)
           DO NOTHING`,
          [showId, label, userId, expiresAt]
        )
      )
    );

    res.json({ success: true, expiresAt });
  } catch (err) {
    console.error("Seat lock error:", err);
    res.status(500).json({ success: false });
  }
});

// RETURN locked seats (not expired)
router.get("/status/:showId", async (req, res) => {
  const { showId } = req.params;

  try {
    const result = await pool.query(
      `SELECT seat_label FROM seat_locks 
       WHERE show_id = $1 
       AND expires_at > NOW()`,
      [showId]
    );

    res.json(result.rows.map(s => s.seat_label));
  } catch (err) {
    console.error("Status error:", err);
    res.status(500).json([]);
  }
});

module.exports = router;
