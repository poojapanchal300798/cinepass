require('dotenv').config();
const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movies');
const showRoutes = require('./routes/shows');
const bookingRoutes = require('./routes/bookings');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
