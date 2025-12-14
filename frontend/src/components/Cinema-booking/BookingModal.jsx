import React, { useState } from "react";
import "../../style/BookingModal.css";
import CheckoutView from "./views/CheckoutView";  

/* -------------------------------------------------------
   CINEMA DATA (Static – per project requirement)
------------------------------------------------------- */
const cinemaData = {
  Oulu: {
    name: "Cinema Nova Oulu",
    auditoriums: [
      { id: 1, seats: 145 },
      { id: 2, seats: 87 },
      { id: 3, seats: 163 },
    ],
  },
  Turku: {
    name: "Kino Baltic Turku",
    auditoriums: [
      { id: 1, seats: 192 },
      { id: 2, seats: 76 },
      { id: 3, seats: 134 },
      { id: 4, seats: 58 },
    ],
  },
  Helsinki: {
    name: "Elokuvateatteri Helsinki Central",
    auditoriums: [
      { id: 1, seats: 178 },
      { id: 2, seats: 121 },
    ],
  },
};

/* -------------------------------------------------------
   Generate Seat Labels (A1, A2 ... B1, B2 ...)
------------------------------------------------------- */
const generateSeats = (totalSeats) => {
  const seatsPerRow = 10;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  let seatList = [];
  for (let r = 0; r < rows; r++) {
    const rowLetter = String.fromCharCode(65 + r);
    for (let c = 1; c <= seatsPerRow; c++) {
      const seatNumber = r * seatsPerRow + c;
      if (seatNumber > totalSeats) break;
      seatList.push(`${rowLetter}${c}`);
    }
  }
  return seatList;
};

/* -------------------------------------------------------
   Booking Modal Main Component
------------------------------------------------------- */
function BookingModal({ parent = "homepage", movieList = [], onClose }) {
  const [step, setStep] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [location, setLocation] = useState("");
  const [auditorium, setAuditorium] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState({ adult: 0, child: 0 });

  // Static occupied seats
  const occupiedSeats = [
    "A1", "A3", "A5", "B2", "B6", "C4", "C8", "D7",
    "D10", "E1", "E9", "F3", "F5", "G2", "H4", "I7",
    "I10", "J1", "J8", "J12",
  ];

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const seatsForAuditorium = auditorium ? generateSeats(auditorium.seats) : [];
  const totalAmount = tickets.adult * 12 + tickets.child * 8;

  /* -------------------------------------------------------
     UI Rendering Section
  ------------------------------------------------------- */
  return (
    <div className="booking-overlay">
      <div className="booking-modal">

        {/* Close Button */}
        <div className="close-btn" onClick={onClose}>✕</div>

        {/* Movie Header (after movie selection) */}
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

        {/* Step Tracker */}
        <div className="booking-steps">
          {["Movie", "Location", "Auditorium", "Seats", "Tickets", "Payment"].map(
            (label, index) => {
              const number = index + 1;
              return (
                <div key={number} className={`step ${step === number ? "active" : ""}`}>
                  <div className="step-circle">{number}</div>
                  <div className="step-label">{label}</div>
                </div>
              );
            }
          )}
        </div>

        {/* ---------------------------------------------------
            STEP 1 — MOVIE SELECTION
        --------------------------------------------------- */}
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
                    next();
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

        {/* ---------------------------------------------------
            STEP 2 — LOCATION
        --------------------------------------------------- */}
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
                    next();
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={back}>Back</button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------
            STEP 3 — AUDITORIUM
        --------------------------------------------------- */}
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
                    next();
                  }}
                >
                  Auditorium {a.id}
                  <br />
                  <small>{a.seats} seats</small>
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={back}>Back</button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------
            STEP 4 — SEAT SELECTION
        --------------------------------------------------- */}
        {step === 4 && (
          <div className="step-content">
            <h3 className="step-title">Choose Your Seats</h3>

            <div className="seat-grid">
              {seatsForAuditorium.map((seat) => {
                const isSelected = selectedSeats.includes(seat);
                const isOccupied = occupiedSeats.includes(seat);

                return (
                  <div
                    key={seat}
                    className={`seat ${isSelected ? "selected" : isOccupied ? "occupied" : ""}`}
                    onClick={() => !isOccupied && toggleSeat(seat)}
                  >
                    {seat}
                  </div>
                );
              })}
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={back}>Back</button>
              <button
                className="next-btn"
                disabled={selectedSeats.length === 0}
                onClick={next}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------
            STEP 5 — TICKETS
        --------------------------------------------------- */}
        {step === 5 && (
          <div className="step-content">
            <h3 className="step-title">Select Tickets</h3>

            {[
              { type: "adult", label: "Adult (€12)" },
              { type: "child", label: "Child (€8)" },
            ].map((t) => (
              <div className="ticket-row" key={t.type}>
                <div>{t.label}</div>

                <div className="ticket-controls">
                  <button
                    onClick={() =>
                      setTickets((prev) => ({
                        ...prev,
                        [t.type]: Math.max(0, prev[t.type] - 1),
                      }))
                    }
                  >
                    -
                  </button>

                  <span>{tickets[t.type]}</span>

                  <button
                    disabled={tickets.adult + tickets.child >= selectedSeats.length}
                    onClick={() =>
                      setTickets((prev) => ({
                        ...prev,
                        [t.type]: prev[t.type] + 1,
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="modal-buttons">
              <button className="back-btn" onClick={back}>Back</button>
              <button
                className="next-btn"
                disabled={tickets.adult + tickets.child === 0}
                onClick={next}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------
            STEP 6 — PAYMENT (Stripe Checkout)
        --------------------------------------------------- */}
        {step === 6 && (
          <div className="step-content">
            <h3 className="step-title">Payment</h3>

            <CheckoutView totalAmount={totalAmount} />

            {/* SUMMARY */}
            <h3 className="step-title" style={{ marginTop: 20 }}>Booking Summary</h3>

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
                <span>Date & Time:</span>
                <strong>2025-11-26 at 16:30</strong>
              </div>

              <div className="summary-row">
                <span>Seats:</span>
                <strong>{selectedSeats.join(", ")}</strong>
              </div>

              <div className="summary-row total">
                <span>Total Amount</span>
                <strong>€{totalAmount}.00</strong>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={back}>Back</button>
              <button className="next-btn" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
