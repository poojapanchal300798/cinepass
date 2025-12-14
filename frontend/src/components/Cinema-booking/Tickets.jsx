import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../style/CinemaBooking.css";  // ✅ Correct CSS path

function Tickets() {
  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const adultPrice = 12;
  const childPrice = 8;

  const updateTotal = () => {
    setTotal(adultTickets * adultPrice + childTickets * childPrice);
  };

  const handleTicketChange = (type, action) => {
    if (type === 'adult') {
      if (action === 'increment') setAdultTickets(adultTickets + 1);
      if (action === 'decrement' && adultTickets > 0) setAdultTickets(adultTickets - 1);
    } else {
      if (action === 'increment') setChildTickets(childTickets + 1);
      if (action === 'decrement' && childTickets > 0) setChildTickets(childTickets - 1);
    }
    updateTotal();
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
          <p>€12.00 per ticket</p>
          <div className="ticket-controls">
            <button onClick={() => handleTicketChange('adult', 'decrement')}>-</button>
            <span>{adultTickets}</span>
            <button onClick={() => handleTicketChange('adult', 'increment')}>+</button>
          </div>
        </div>

        <div className="ticket-info">
          <h3>Child (under 12)</h3>
          <p>€8.00 per ticket</p>
          <div className="ticket-controls">
            <button onClick={() => handleTicketChange('child', 'decrement')}>-</button>
            <span>{childTickets}</span>
            <button onClick={() => handleTicketChange('child', 'increment')}>+</button>
          </div>
        </div>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary">
          <p><strong>Total Seats:</strong> {adultTickets + childTickets}</p>
          <p><strong>Total:</strong> €{total.toFixed(2)}</p>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate(`/book/${localStorage.getItem("movieId")}/seats`)}>Back</button>
        <button onClick={handleProceedToPayment} className="continue-btn">Continue to Payment</button>
      </div>
    </div>
  );
}

export default Tickets;
