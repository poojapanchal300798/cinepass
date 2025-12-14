import React, { useState } from 'react';
import "../../style/CinemaBooking.css";
import { useNavigate } from 'react-router-dom';

function SeatSelection() {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const cols = Array.from({ length: 12 }, (_, i) => i + 1);
  const navigate = useNavigate();
  
  // Initial state - some seats are already taken
  const takenSeats = ['A5', 'A6', 'B7', 'B8', 'C3', 'D10', 'E5', 'E6', 'F2', 'G9', 'H4', 'I7', 'J11', 'J12'];
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Handle seat click
  const handleSeatClick = (seatId) => {
    if (takenSeats.includes(seatId)) {
      return;
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Handle booking
  const handleProceedToTickets = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    navigate('/book/tickets');
  };

  // Generate seat ID from row and col
  const getSeatId = (row, col) => {
    return `${row}${col}`;
  };

  // Get seat class based on status
  const getSeatClass = (seatId) => {
    if (takenSeats.includes(seatId)) {
      return 'seat-design occupied';
    }
    if (selectedSeats.includes(seatId)) {
      return 'seat-design selected';
    }
    return 'seat-design';
  };

  return (
    <div className="movie-seat-layout">
      <h2>Select Your Seats</h2>
      
      <div className="screen-label-design">SCREEN</div>
      
      <div className="seat-perspective-container">
        <div className="screen-design"></div>
      </div>
      
      {/* Seat legend (showcase) */}
      <ul className="showcase">
        <li>
          <div className="seat-design"></div>
          <small>Available</small>
        </li>
        <li>
          <div className="seat-design selected"></div>
          <small>Selected</small>
        </li>
        <li>
          <div className="seat-design occupied"></div>
          <small>Occupied</small>
        </li>
      </ul>
      
      {/* Column numbers at top */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        {cols.map(col => (
          <div key={`col-${col}`} className="seat-col-label">
            {col}
          </div>
        ))}
      </div>
      
      {/* Seats grid */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {rows.map(row => (
          <div key={row} className="seat-row-design">
            <div className="seat-row-label">{row}</div>
            {cols.map(col => {
              const seatId = getSeatId(row, col);
              return (
                <div
                  key={seatId}
                  className={getSeatClass(seatId)}
                  onClick={() => handleSeatClick(seatId)}
                  title={`Seat ${seatId}`}
                />
              );
            })}
            <div className="seat-row-label">{row}</div>
          </div>
        ))}
      </div>
      
      {/* Column numbers at bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        {cols.map(col => (
          <div key={`col-bottom-${col}`} className="seat-col-label">
            {col}
          </div>
        ))}
      </div>
      
      {/* Selected seats info */}
      <div className="seat-selection-info">
        <p className="text">
          You have selected <span>{selectedSeats.length}</span> seats for a price of $
          <span>{selectedSeats.length * 10}</span>
        </p>
        
        {selectedSeats.length > 0 && (
          <div className="selected-seats-box">
            <p><strong>Selected Seats:</strong></p>
            <p>{selectedSeats.sort().join(', ')}</p>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="movie-seat-actions">
        <button 
          className="movie-seat-button"
          onClick={() => navigate('/book/location')}
        >
          Back
        </button>
        <button 
          className="movie-seat-button clear"
          onClick={() => setSelectedSeats([])}
          disabled={selectedSeats.length === 0}
        >
          Clear Selection
        </button>
        <button 
          className="movie-seat-button continue"
          onClick={handleProceedToTickets}
          disabled={selectedSeats.length === 0}
        >
          Continue to Tickets ({selectedSeats.length})
        </button>
      </div>
    </div>
  );
}

export default SeatSelection;