import React, { useState } from 'react';
import './CinemaBooking.css';  // Importing CSS for styling

function Payment() {
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const handlePayment = () => {
    // Logic to handle payment
    alert('Payment Successful!');
    // Redirect or handle further payment actions here
  };

  return (
    <div className="payment-container">
      <h2>Payment Information</h2>
      <form>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <small>We'll send your tickets to this email</small>
        </div>

        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Promo Code (Optional)</label>
          <input
            type="text"
            placeholder="Enter code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button type="button" className="apply-btn">Apply</button>
          <small>Try: MOVIE10, WELCOME20, STUDENT15</small>
        </div>

        <div className="action-buttons">
          <button type="button" onClick={() => window.history.back()}>Back</button>
          <button type="button" onClick={handlePayment} className="continue-btn">Proceed to Payment</button>
        </div>
      </form>
    </div>
  );
}

export default Payment;
