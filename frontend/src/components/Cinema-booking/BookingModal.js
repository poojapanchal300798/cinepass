import React, { useState } from "react";
import "../../style/BookingModal.css";
import CheckoutView from "./views/CheckoutView";

// ---------------- CINEMA DATA ---------------- //
const cinemaData = {
  Oulu: {
    name: "Cinema Nova Oulu",
    auditoriums: [
      { id: 1, seats: 145 },
      { id: 2, seats: 87 },
      { id: 3, seats: 163 }
    ]
  },
  Turku: {
    name: "Kino Baltic Turku",
    auditoriums: [
      { id: 1, seats: 192 },
      { id: 2, seats: 76 },
      { id: 3, seats: 134 },
      { id: 4, seats: 58 }
    ]
  },
  Helsinki: {
    name: "Elokuvateatteri Helsinki Central",
    auditoriums: [
      { id: 1, seats: 178 },
      { id: 2, seats: 121 }
    ]
  }
};

// ---------------- SEAT GENERATION ---------------- //
const generateSeats = (totalSeats) => {
  const seatsPerRow = 10;
  let seatList = [];
  let rows = Math.ceil(totalSeats / seatsPerRow);

  for (let r = 0; r < rows; r++) {
    let rowLetter = String.fromCharCode(65 + r);
    for (let c = 1; c <= seatsPerRow; c++) {
      let seatNumber = r * seatsPerRow + c;
      if (seatNumber > totalSeats) break;
      seatList.push(`${rowLetter}${c}`);
    }
  }
  return seatList;
};

function BookingModal({ parent = "homepage", movieList = [], onClose }) {
  const [step, setStep] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [location, setLocation] = useState("");
  const [auditorium, setAuditorium] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState({ adult: 0, child: 0 });

  const occupiedSeats = ["A1", "B2", "C4", "D7", "E1", "F5", "G2", "H4", "I7", "J1"];

  const seatsForAuditorium = auditorium ? generateSeats(auditorium.seats) : [];

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((x) => x !== seat) : [...prev, seat]
    );
  };

  return (
    <div className="booking-overlay">
      <div className="booking-modal">
        <div className="close-btn" onClick={onClose}>✕</div>

        {/* Header */}
        {selectedMovie && (
          <div className="movie-header">
            <img src={selectedMovie.image} alt="" />
            <div>
              <div className="movie-info-title">{selectedMovie.title}</div>
              <div className="movie-info-sub">
                Action • 148 min ⭐ {selectedMovie.rating}
              </div>
            </div>
          </div>
        )}

        {/* Step bar */}
        <div className="booking-steps">
          {["Movie", "Location", "Auditorium", "Seats", "Tickets", "Payment"].map(
            (label, i) => (
              <div key={i} className={`step ${step === i + 1 ? "active" : ""}`}>
                <div className="step-circle">{i + 1}</div>
                <div className="step-label">{label}</div>
              </div>
            )
          )}
        </div>

        {/* ---------------- STEP 1 MOVIE ---------------- */}
        {step === 1 && (
          <div className="step-content">
            <h3 className="step-title">Select Movie</h3>

            <div className="movie-grid-modal">
              {movieList.map((m) => (
                <div
                  key={m.id}
                  className={`movie-select-card ${selectedMovie?.id === m.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedMovie(m);
                    setStep(2);
                  }}
                >
                  <img src={m.image} className="movie-select-img" alt="" />
                  <div className="movie-select-info">
                    <p className="movie-title">{m.title}</p>
                    <p className="movie-rating">⭐ {m.rating}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 2 LOCATION ---------------- */}
        {step === 2 && (
          <div className="step-content">
            <h3 className="step-title">Select Location</h3>

            <div className="option-grid">
              {Object.keys(cinemaData).map((loc) => (
                <div
                  key={loc}
                  className={`option-card ${location === loc ? "selected" : ""}`}
                  onClick={() => {
                    setLocation(loc);
                    setAuditorium(null);
                    setStep(3);
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={() => setStep(1)}>Back</button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 3 AUDITORIUM ---------------- */}
        {step === 3 && (
          <div className="step-content">
            <h3 className="step-title">{cinemaData[location].name}</h3>

            <div className="option-grid">
              {cinemaData[location].auditoriums.map((a) => (
                <div
                  key={a.id}
                  className={`option-card ${auditorium?.id === a.id ? "selected" : ""}`}
                  onClick={() => {
                    setAuditorium(a);
                    setStep(4);
                  }}
                >
                  <strong>Auditorium {a.id}</strong>
                  <br />
                  <small>{a.seats} seats</small>
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={() => setStep(2)}>Back</button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 4 SEATS ---------------- */}
        {step === 4 && (
          <div className="step-content">
            <h3 className="step-title">Choose Your Seats</h3>

            <div className="seat-grid">
              {seatsForAuditorium.map((seat) => (
                <div
                  key={seat}
                  className={`seat ${
                    selectedSeats.includes(seat)
                      ? "selected"
                      : occupiedSeats.includes(seat)
                      ? "occupied"
                      : ""
                  }`}
                  onClick={() => !occupiedSeats.includes(seat) && toggleSeat(seat)}
                >
                  {seat}
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={() => setStep(3)}>Back</button>
              <button
                className="next-btn"
                disabled={selectedSeats.length === 0}
                onClick={() => setStep(5)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 5 TICKETS ---------------- */}
        {step === 5 && (
          <div className="step-content">
            <h3 className="step-title">Select Tickets</h3>

            {/* Adult */}
            <div className="ticket-row">
              <div>Adult (€12)</div>
              <div className="ticket-controls">
                <button
                  onClick={() =>
                    setTickets({ ...tickets, adult: Math.max(0, tickets.adult - 1) })
                  }
                >
                  -
                </button>
                <span>{tickets.adult}</span>
                <button
                  disabled={tickets.adult + tickets.child >= selectedSeats.length}
                  onClick={() =>
                    setTickets({ ...tickets, adult: tickets.adult + 1 })
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* Child */}
            <div className="ticket-row">
              <div>Child (€8)</div>
              <div className="ticket-controls">
                <button
                  onClick={() =>
                    setTickets({ ...tickets, child: Math.max(0, tickets.child - 1) })
                  }
                >
                  -
                </button>
                <span>{tickets.child}</span>
                <button
                  disabled={tickets.adult + tickets.child >= selectedSeats.length}
                  onClick={() =>
                    setTickets({ ...tickets, child: tickets.child + 1 })
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={() => setStep(4)}>Back</button>
              <button
                className="next-btn"
                disabled={tickets.adult + tickets.child === 0}
                onClick={() => setStep(6)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 6 PAYMENT ---------------- */}
        {step === 6 && (
          <div className="step-content">
            <h3 className="step-title">Payment</h3>

            <CheckoutView totalAmount={tickets.adult * 12 + tickets.child * 8} />

            <h3 className="step-title" style={{ marginTop: 20 }}>
              Booking Summary
            </h3>

            <div className="summary-box">
              <div className="summary-row">
                <span>Movie:</span>
                <strong>{selectedMovie?.title}</strong>
              </div>

              <div className="summary-row">
                <span>Location:</span>
                <strong>{cinemaData[location]?.name}</strong>
              </div>

              <div className="summary-row">
                <span>Auditorium:</span>
                <strong>{auditorium?.id}</strong>
              </div>

              <div className="summary-row">
                <span>Seats:</span>
                <strong>{selectedSeats.join(", ")}</strong>
              </div>

              <div className="summary-row total">
                <span>Total Amount</span>
                <strong>€{tickets.adult * 12 + tickets.child * 8}.00</strong>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={() => setStep(5)}>Back</button>
              <button className="next-btn" onClick={onClose}>Finish</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
