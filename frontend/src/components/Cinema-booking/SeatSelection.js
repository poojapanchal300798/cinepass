import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CinemaBooking.css';  // Importing CSS for styling

function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  const seatLayout = [
    ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12'],
    ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12'],
    ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12'],
    ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12'],
    ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12'],
    ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12'],
    ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12'],
    ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10', 'I11', 'I12'],
    ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10', 'J11', 'J12']
  ];

  // Handle seat selection/deselection
  const handleSeatClick = (seat) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seat)
        ? prevSeats.filter((s) => s !== seat)
        : [...prevSeats, seat]
    );
  };

  const handleProceedToTickets = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    // Store selected seats in localStorage or pass as state
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    // Navigate to tickets page
    navigate('/book/tickets');
  };

  return (
    <div className="seat-selection-container">
      <h2>Select Your Seats</h2>
      <div className="screen">SCREEN</div>
      <div className="seat-grid">
        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map((seat) => (
              <button
                key={seat}
                className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                onClick={() => handleSeatClick(seat)}
              >
                {seat}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="action-buttons">
        <button onClick={() => navigate('/book/location')}>Back</button>
        <button onClick={handleProceedToTickets} className="proceed-btn">Continue to Tickets</button>
      </div>
    </div>
  );
}

export default SeatSelection;
