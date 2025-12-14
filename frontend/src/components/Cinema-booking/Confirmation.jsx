import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CinemaBooking.css';

function Confirmation() {
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setBookingData(location.state);
    } else {
      // Try to get from localStorage as fallback
      const storedData = {
        bookingId: localStorage.getItem('bookingId'),
        location: localStorage.getItem('selectedLocation'),
        date: localStorage.getItem('selectedDate'),
        time: localStorage.getItem('selectedTime'),
        seats: JSON.parse(localStorage.getItem('selectedSeats') || '[]'),
        adultTickets: parseInt(localStorage.getItem('adultTickets') || '0'),
        childTickets: parseInt(localStorage.getItem('childTickets') || '0'),
        totalPrice: parseFloat(localStorage.getItem('totalPrice') || '0')
      };
      setBookingData(storedData);
    }
  }, [location.state]);

  const handleNewBooking = () => {
    // Clear all stored data
    localStorage.removeItem('selectedLocation');
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedTime');
    localStorage.removeItem('selectedSeats');
    localStorage.removeItem('adultTickets');
    localStorage.removeItem('childTickets');
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('bookingId');
    
    navigate('/book/location');
  };

  if (!bookingData) {
    return (
      <div className="confirmation-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p className="confirmation-subtitle">Your tickets have been booked successfully</p>
      </div>

      <div className="confirmation-details">
        <div className="detail-section">
          <h3>Booking Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Booking ID:</span>
              <span className="detail-value">{bookingData.bookingId || 'CIN-' + Date.now()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Movie:</span>
              <span className="detail-value">Spider-Man: Beyond the Web</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{bookingData.location}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{bookingData.date}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{bookingData.time}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Seat Information</h3>
          <div className="seats-display">
            {Array.isArray(bookingData.seats) ? bookingData.seats.join(', ') : bookingData.seats}
          </div>
          <div className="ticket-summary">
            <div className="ticket-row">
              <span>Adult Tickets ({bookingData.adultTickets} × €12.00)</span>
              <span>€{(bookingData.adultTickets * 12).toFixed(2)}</span>
            </div>
            <div className="ticket-row">
              <span>Child Tickets ({bookingData.childTickets} × €8.00)</span>
              <span>€{(bookingData.childTickets * 8).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="total-section">
          <div className="total-row">
            <span className="total-label">Total Amount</span>
            <span className="total-amount">
              €{bookingData.totalPrice ? bookingData.totalPrice.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button onClick={() => window.print()} className="print-btn">
          🖨️ Print Tickets
        </button>
        <button onClick={() => navigate('/')} className="home-btn">
          🏠 Back to Home
        </button>
        <button onClick={handleNewBooking} className="new-booking-btn">
          🎬 Book Another Movie
        </button>
      </div>

      <div className="confirmation-footer">
        <p>🎫 Your e-tickets have been sent to your email</p>
        <p className="note">Please arrive 15 minutes before the showtime with your booking ID</p>
      </div>
    </div>
  );
}

export default Confirmation;