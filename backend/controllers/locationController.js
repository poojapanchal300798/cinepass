const db = require('../config/database');

exports.getAllLocations = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM locations ORDER BY city_name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
};

exports.getDatesForLocation = async (req, res) => {
    try {
        const { location } = req.params;
        
        const query = `
            SELECT DISTINCT show_date 
            FROM showtimes s
            JOIN locations l ON s.location_id = l.location_id
            WHERE l.city_name = $1
            ORDER BY 
                CASE 
                    WHEN show_date = 'Today' THEN 1
                    WHEN show_date = 'Tomorrow' THEN 2
                    ELSE 3
                END,
                show_date
        `;
        
        const result = await db.query(query, [location]);
        res.json(result.rows.map(row => row.show_date));
    } catch (error) {
        console.error('Error fetching dates:', error);
        res.status(500).json({ error: 'Failed to fetch dates' });
    }
};

exports.getTimesForDate = async (req, res) => {
    try {
        const { location, date } = req.params;
        
        const query = `
            SELECT s.show_time 
            FROM showtimes s
            JOIN locations l ON s.location_id = l.location_id
            WHERE l.city_name = $1 
            AND s.show_date = $2
            ORDER BY s.show_time
        `;
        
        const result = await db.query(query, [location, date]);
        res.json(result.rows.map(row => row.show_time));
    } catch (error) {
        console.error('Error fetching times:', error);
        res.status(500).json({ error: 'Failed to fetch times' });
    }
};