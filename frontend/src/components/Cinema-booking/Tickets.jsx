import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../style/CinemaBooking.css";

function Tickets() {
  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);
  const [total, setTotal] = useState(0);

  // ✅ prices from DB
  const [adultPrice, setAdultPrice] = useState(0);
  const [childPrice, setChildPrice] = useState(0);

  const navigate = useNavigate();

  // ✅ FETCH SHOW PRICES
  useEffect(() => {
    fetch("http://localhost:5000/api/shows")
      .then(res => res.json())
      .then(data => {
        const movieId = localStorage.getItem("movieId");

        const show = data.find(s => String(s.movie_id) === movieId);

        if (show) {
          setAdultPrice(show.adult_price);
          setChildPrice(show.kid_price);
        }
      })
      .catch(err => console.error("Fetch shows error:", err));
  }, []);

  // ✅ recalc total when anything changes
  useEffect(() => {
    setTotal(adultTickets * adultPrice + childTickets * childPrice);
  }, [adultTickets, childTickets, adultPrice, childPrice]);

  const handleTicketChange = (type, action) => {
    if (type === 'adult') {
      if (action === 'increment') setAdultTickets(a => a + 1);
      if (action === 'decrement') setAdultTickets(a => Math.max(0, a - 1));
    } else {
      if (action === 'increment') setChildTickets(c => c + 1);
      if (action === 'decrement') setChildTickets(c => Math.max(0, c - 1));
    }
  };

  const handleProceedToPayment = () => {
    if (adultTickets === 0 && childTickets === 0) {
      alert('Please select at least one ticket.');
      return;
    }
    navigate(`/book/${localStorage.getItem("movieId")}/payment`);
  };

  return (
    <div className="tickets-container">
      <h2>Select Ticket Types</h2>

      <div className="ticket-type">
        <div className="ticket-info">
          <h3>Adult</h3>
          <p>€{adultPrice}.00 per ticket</p>
          <div className="ticket-controls">
            <button onClick={() => handleTicketChange('adult', 'decrement')}>-</button>
            <span>{adultTickets}</span>
            <button onClick={() => handleTicketChange('adult', 'increment')}>+</button>
          </div>
        </div>

        <div className="ticket-info">
          <h3>Child (under 12)</h3>
          <p>€{childPrice}.00 per ticket</p>
          <div className="ticket-controls">
            <button onClick={() => handleTicketChange('child', 'decrement')}>-</button>
            <span>{childTickets}</span>
            <button onClick={() => handleTicketChange('child', 'increment')}>+</button>
          </div>
        </div>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <p><strong>Total Seats:</strong> {adultTickets + childTickets}</p>
        <p><strong>Total:</strong> €{total.toFixed(2)}</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate(`/book/${localStorage.getItem("movieId")}/seats`)}>
          Back
        </button>
        <button onClick={handleProceedToPayment} className="continue-btn">
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

export default Tickets;
