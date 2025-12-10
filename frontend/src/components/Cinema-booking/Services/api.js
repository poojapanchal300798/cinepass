// src/components/Cinema-booking/Services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Cinema API functions
export const cinemaApi = {
  // ========== LOCATION ENDPOINTS ==========
  getLocations: () => 
    fetch(`${API_BASE_URL}/locations`).then(res => res.json()),
  
  getDates: (location) => 
    fetch(`${API_BASE_URL}/locations/${location}/dates`).then(res => res.json()),
  
  getTimes: (location, date) => 
    fetch(`${API_BASE_URL}/locations/${location}/dates/${date}/times`).then(res => res.json()),
  
  // ========== SHOWTIME ENDPOINTS ==========
  getShowtimes: (location, date) => 
    fetch(`${API_BASE_URL}/bookings/showtimes/${location}/${date}`).then(res => res.json()),
  
  // ========== SEAT ENDPOINTS ==========
  getSeats: (showtimeId) => 
    fetch(`${API_BASE_URL}/seats/showtime/${showtimeId}`).then(res => res.json()),
  
  checkSeats: (showtimeId, seatIds) => 
    fetch(`${API_BASE_URL}/seats/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showtimeId, seatIds }),
    }).then(res => res.json()),
  
  // ========== BOOKING ENDPOINTS ==========
  createBooking: (bookingData) => 
    fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    }).then(res => res.json()),
  
  getBooking: (bookingId) => 
    fetch(`${API_BASE_URL}/bookings/${bookingId}`).then(res => res.json()),
  
  getAllBookings: () => 
    fetch(`${API_BASE_URL}/bookings`).then(res => res.json()),
  
  // ========== TEST CONNECTION ==========
  testConnection: () => 
    fetch(`${API_BASE_URL}/locations`)
      .then(res => ({ 
        ok: res.ok, 
        status: res.status,
        connected: res.ok
      }))
      .catch(() => ({ 
        ok: false, 
        status: 0,
        connected: false 
      })),
};