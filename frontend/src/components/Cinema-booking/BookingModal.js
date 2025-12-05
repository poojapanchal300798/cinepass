import React, { useState } from "react";
import "../../style/BookingModal.css";

// ---------------- CINEMA DATA (Professor Requirements) ---------------- //
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

// ---------------- SEAT GENERATION FUNCTION ---------------- //
const generateSeats = (totalSeats) => {
  const seatsPerRow = 10;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  let seatList = [];

  for (let r = 0; r < rows; r++) {
    let rowLetter = String.fromCharCode(65 + r); // A, B, C...
    for (let c = 1; c <= seatsPerRow; c++) {
      const seatNumber = r * seatsPerRow + c;
      if (seatNumber > totalSeats) break;
      seatList.push(`${rowLetter}${c}`);
    }
  }

  return seatList;
};

function BookingModal({ movieList = [], onClose }) {
  const [step, setStep] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [location, setLocation] = useState("");
  const [auditorium, setAuditorium] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState({ adult: 0, child: 0 });

  const goNext = () => setStep(step + 1);
  const goBack = () => setStep(step - 1);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const seatsForAuditorium =
    auditorium ? generateSeats(auditorium.seats) : [];

  return (
    <div className="booking-overlay">
      <div className="booking-modal">

        {/* Close Button */}
        <div className="close-btn" onClick={onClose}>✕</div>

        {/* Header appears only after movie selected */}
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

        {/* Step Progress */}
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

        {/* ---------------- STEP 1: SELECT MOVIE ---------------- */}
        {step === 1 && (
          <div className="step-content">
            <h3 className="step-title">Select Movie</h3>

            <div className="movie-grid-modal">
              {movieList.map((m) => (
                <div
                  key={m.id}
                  className={`movie-select-card ${
                    selectedMovie?.id === m.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedMovie(m);
                    goNext(); // auto next when movie clicked
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

        {/* ---------------- STEP 2: SELECT LOCATION ---------------- */}
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
                    goNext();
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={goBack}>Back</button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 3: SELECT AUDITORIUM ---------------- */}
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
                    goNext();
                  }}
                >
                  Auditorium {a.id}
                  <br />
                  <small>{a.seats} seats</small>
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={goBack}>Back</button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 4: SELECT SEATS ---------------- */}
        {step === 4 && (
          <div className="step-content">
            <h3 className="step-title">Choose Your Seats</h3>

            <div className="seat-grid">
              {seatsForAuditorium.map((seat) => (
                <div
                  key={seat}
                  className={`seat ${
                    selectedSeats.includes(seat) ? "selected" : ""
                  }`}
                  onClick={() => toggleSeat(seat)}
                >
                  {seat}
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={goBack}>Back</button>
              <button
                className="next-btn"
                disabled={selectedSeats.length === 0}
                onClick={goNext}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 5: SELECT TICKETS ---------------- */}
        {step === 5 && (
          <div className="step-content">
            <h3 className="step-title">Select Tickets</h3>

            <div className="ticket-row">
              <div>Adult (€12)</div>
              <div className="ticket-controls">
                <button onClick={() =>
                  setTickets({ ...tickets, adult: Math.max(0, tickets.adult - 1) })
                }>-</button>

                <span>{tickets.adult}</span>

                <button onClick={() =>
                  setTickets({ ...tickets, adult: tickets.adult + 1 })
                }>+</button>
              </div>
            </div>

            <div className="ticket-row">
              <div>Child (€8)</div>
              <div className="ticket-controls">
                <button onClick={() =>
                  setTickets({ ...tickets, child: Math.max(0, tickets.child - 1) })
                }>-</button>

                <span>{tickets.child}</span>

                <button onClick={() =>
                  setTickets({ ...tickets, child: tickets.child + 1 })
                }>+</button>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="back-btn" onClick={goBack}>Back</button>
              <button className="next-btn" onClick={goNext}>Continue</button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 6: PAYMENT ---------------- */}
        {step === 6 && (
          <div className="step-content">
            <h3 className="step-title">Payment</h3>
            <p>Payment UI coming soon...</p>

            <div className="modal-buttons">
              <button className="back-btn" onClick={goBack}>Back</button>
              <button className="next-btn" onClick={onClose}>Finish</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BookingModal;
