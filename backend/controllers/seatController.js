const db = require('../config/database');

exports.getSeatsForShowtime = async (req, res) => {
    try {
        const { showtimeId } = req.params;
        
        const query = `
            SELECT 
                seat_id,
                row_label,
                seat_number,
                status,
                CONCAT(row_label, seat_number) as seat_label
            FROM seats 
            WHERE showtime_id = $1
            ORDER BY row_label, seat_number
        `;
        
        const result = await db.query(query, [showtimeId]);
        
        // Group by row for frontend
        const seatsByRow = {};
        result.rows.forEach(seat => {
            if (!seatsByRow[seat.row_label]) {
                seatsByRow[seat.row_label] = [];
            }
            seatsByRow[seat.row_label].push({
                id: seat.seat_id,
                number: seat.seat_number,
                label: seat.seat_label,
                status: seat.status
            });
        });
        
        res.json({
            showtimeId,
            seatsByRow,
            totalSeats: result.rows.length,
            availableSeats: result.rows.filter(s => s.status === 'available').length
        });
    } catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).json({ error: 'Failed to fetch seats' });
    }
};

exports.updateSeatStatus = async (req, res) => {
    try {
        const { seatId } = req.params;
        const { status } = req.body;
        
        const query = 'UPDATE seats SET status = $1 WHERE seat_id = $2 RETURNING *';
        const result = await db.query(query, [status, seatId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Seat not found' });
        }
        
        res.json({
            message: 'Seat status updated',
            seat: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating seat:', error);
        res.status(500).json({ error: 'Failed to update seat status' });
    }
};

exports.checkSeatAvailability = async (req, res) => {
    try {
        const { showtimeId, seatIds } = req.body;
        
        const query = `
            SELECT 
                seat_id,
                CONCAT(row_label, seat_number) as seat_label,
                status
            FROM seats 
            WHERE showtime_id = $1 
            AND CONCAT(row_label, seat_number) = ANY($2::text[])
        `;
        
        const result = await db.query(query, [showtimeId, seatIds]);
        
        const unavailableSeats = result.rows
            .filter(seat => seat.status !== 'available')
            .map(seat => seat.seat_label);
        
        res.json({
            available: unavailableSeats.length === 0,
            unavailableSeats,
            totalSeatsRequested: seatIds.length,
            availableSeats: seatIds.length - unavailableSeats.length
        });
    } catch (error) {
        console.error('Error checking seat availability:', error);
        res.status(500).json({ error: 'Failed to check seat availability' });
    }
};