const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * GET ALL SHOWS
 */
router.get("/", async (req, res) => {
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
    console.error("❌ Fetch shows error:", err.message);
    res.status(500).json({ message: "Failed to fetch shows" });
  }
});

/**
 * CREATE SHOW
 */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      date,
      location,
      screen,
      adult_price,
      kid_price,
      seats,
      poster
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO shows
      (name, date, location, screen, adult_price, kid_price, seats, poster)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        name,
        date,
        location,
        screen,
        adult_price,
        kid_price,
        seats,
        poster || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Create show error:", err.message);
    res.status(500).json({ message: "Failed to create show" });
  }
});

/**
 * UPDATE SHOW
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      date,
      location,
      screen,
      adult_price,
      kid_price,
      seats,
      poster
    } = req.body;

    const result = await pool.query(
      `
      UPDATE shows SET
        name = $1,
        date = $2,
        location = $3,
        screen = $4,
        adult_price = $5,
        kid_price = $6,
        seats = $7,
        poster = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        name,
        date,
        location,
        screen,
        adult_price,
        kid_price,
        seats,
        poster || null,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Update show error:", err.message);
    res.status(500).json({ message: "Failed to update show" });
  }
});

/**
 * DELETE SHOW
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM shows WHERE id = $1", [id]);
    res.json({ message: "Show deleted" });
  } catch (err) {
    console.error("❌ Delete show error:", err.message);
    res.status(500).json({ message: "Failed to delete show" });
  }
});

module.exports = router;
