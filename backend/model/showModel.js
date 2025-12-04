const pool = require("../db");  // Import pool to interact with the PostgreSQL database

// Function to fetch all shows
const getAllShows = async () => {
  const result = await pool.query("SELECT * FROM shows;");
  return result.rows;
};

// Function to fetch a show by ID
const getShowById = async (id) => {
  const result = await pool.query("SELECT * FROM shows WHERE id = $1;", [id]);
  return result.rows[0];
};

// Function to add a new show
const addShow = async (show) => {
  const { name, date, location, screen, adultPrice, kidPrice, seats } = show;
  const query = `
    INSERT INTO shows (name, date, location, screen, adult_price, kid_price, seats)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `;
  const result = await pool.query(query, [
    name,
    date,
    location,
    screen,
    adultPrice,
    kidPrice,
    seats,
  ]);
  return result.rows[0];
};

// Function to update a show by ID
const updateShow = async (id, show) => {
  const { name, date, location, screen, adultPrice, kidPrice, seats } = show;
  const query = `
    UPDATE shows
    SET name = $1, date = $2, location = $3, screen = $4, adult_price = $5, kid_price = $6, seats = $7
    WHERE id = $8 RETURNING *;
  `;
  const result = await pool.query(query, [
    name,
    date,
    location,
    screen,
    adultPrice,
    kidPrice,
    seats,
    id,
  ]);
  return result.rows[0];
};

// Function to delete a show by ID
const deleteShow = async (id) => {
  const result = await pool.query("DELETE FROM shows WHERE id = $1 RETURNING *;", [id]);
  return result.rows[0];
};

// Export the functions so they can be used in the controller
module.exports = {
  getAllShows,
  getShowById,
  addShow,
  updateShow,
  deleteShow,
};
