const pool = require('../db');

// Book seats
const bookSeats = async (req, res) => {
  const { email, showtimeId, selectedSeats, totalPrice, totalSeats } = req.body;

  try {
    const query = `
      INSERT INTO bookings (user_email, showtime_id, selected_seats, total_price, total_seats)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [email, showtimeId, selectedSeats, totalPrice, totalSeats];
    const result = await pool.query(query, values);

    // Mark seats as booked
    for (const seat of selectedSeats) {
      await pool.query('UPDATE seats SET is_booked = TRUE WHERE showtime_id = $1 AND seat_name = $2', [showtimeId, seat]);
    }

    res.status(201).json({
      message: 'Booking successful!',
      bookingId: result.rows[0].id,
      email,
      showtimeId,
      selectedSeats,
      totalPrice
    });
  } catch (err) {
    console.error('Error booking seats:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get booking details by ID
const getBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { bookSeats, getBooking };
