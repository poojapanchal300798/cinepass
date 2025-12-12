const express = require("express");
const router = express.Router();
const pool = require("../db");   // ✅ FIXED — correct DB file path

// ===============================
// 1️⃣ LOCK SEATS (3-minute hold)
// ===============================
router.post("/lock", async (req, res) => {
  const { showId, seatLabels, userId } = req.body;

  if (!showId || !seatLabels || seatLabels.length === 0) {
    return res.status(400).json({ success: false, message: "Missing seat data" });
  }

  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

  try {
    for (let seat of seatLabels) {
      await pool.query(
        `INSERT INTO seat_locks (show_id, seat_label, user_id, expires_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (show_id, seat_label)
         DO UPDATE SET expires_at = EXCLUDED.expires_at`,
        [showId, seat, userId, expiresAt]
      );
    }

    res.json({ success: true, expiresAt });
  } catch (err) {
    console.error("❌ Seat lock error:", err);
    res.status(500).json({ success: false, message: "Seat locking failed" });
  }
});

// ==================================
// 2️⃣ GET CURRENT ACTIVE LOCKS
// ==================================
router.get("/status/:showId", async (req, res) => {
  const { showId } = req.params;

  try {
    const result = await pool.query(
      `SELECT seat_label 
       FROM seat_locks
       WHERE show_id = $1
       AND expires_at > NOW()`,
      [showId]
    );

    res.json(result.rows.map(s => s.seat_label));
  } catch (err) {
    console.error("❌ Fetch seat status error:", err);
    res.status(500).json([]);
  }
});

module.exports = router;
