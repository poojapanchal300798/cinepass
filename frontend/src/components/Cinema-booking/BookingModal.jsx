import React, { useState, useEffect } from "react";
import "../../style/BookingModal.css";
import CheckoutView from "./views/CheckoutView";

/* -------------------------------------------------------
   STATIC CINEMA DATA (UNCHANGED)
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
   SEAT GENERATOR (UNCHANGED)
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

function BookingModal({ movieList = [], onClose }) {
  const [step, setStep] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [location, setLocation] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);
  const [auditorium, setAuditorium] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState({ adult: 0, child: 0 });

  /* PRICES (SAFE DEFAULTS) */
  const [adultPrice, setAdultPrice] = useState(12);
  const [childPrice, setChildPrice] = useState(8);

  /* SHOWS FROM DB */
  const [shows, setShows] = useState([]);

  /* -------------------------------------------------------
     FETCH SHOWS AFTER MOVIE SELECTION
  ------------------------------------------------------- */
  useEffect(() => {
    if (!selectedMovie) return;

    fetch("http://localhost:5000/api/shows")
      .then(res => res.json())
      .then(data => {
        const movieShows = data.filter(
          s => s.name === selectedMovie.title
        );
        setShows(movieShows);

        if (movieShows[0]) {
          setAdultPrice(movieShows[0].adult_price);
          setChildPrice(movieShows[0].kid_price);
        }
      });
  }, [selectedMovie]);

  const occupiedSeats = [
    "A1","A3","A5","B2","B6","C4","C8","D7",
    "D10","E1","E9","F3","F5","G2","H4","I7",
    "I10","J1","J8","J12",
  ];

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const toggleSeat = (seat) => {
    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

  const seatsForAuditorium = auditorium
    ? generateSeats(auditorium.seats)
    : [];

  const totalAmount =
    tickets.adult * adultPrice +
    tickets.child * childPrice;

  return (
    <div className="booking-overlay">
      <div className="booking-modal">

        <div className="close-btn" onClick={onClose}>✕</div>

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

        <div className="booking-steps">
          {["Movie","Location","Auditorium","Seats","Tickets","Payment"].map(
            (label, index) => (
              <div
                key={index}
                className={`step ${step === index + 1 ? "active" : ""}`}
              >
                <div className="step-circle">{index + 1}</div>
                <div className="step-label">{label}</div>
              </div>
            )
          )}
        </div>

        {/* STEP 1 — MOVIE */}
        {step === 1 && (
          <div className="step-content">
            <h3 className="step-title">Select Movie</h3>
            <div className="movie-grid-modal">
              {movieList.map(m => (
                <div
                  key={m.id}
                  className="movie-select-card"
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
          </div>
        )}

        {/* STEP 2 — LOCATION + DATE & TIME */}
        {step === 2 && (
          <div className="step-content">
            <h3 className="step-title">Select Location</h3>

            <div className="option-grid">
              {[...new Set(shows.map(s => s.location))].map(loc => (
                <div
                  key={loc}
                  className={`option-card ${location === loc ? "selected" : ""}`}
                  onClick={() => {
                    setLocation(loc);
                    setSelectedShow(null);
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>

            {location && (
              <>
                <h3 className="step-title" style={{ marginTop: 14 }}>
                  Select Date & Time
                </h3>

                <div className="option-grid">
                  {shows
                    .filter(s => s.location === location)
                    .map(show => (
                      <div
                        key={show.id}
                        className={`option-card ${
                          selectedShow?.id === show.id ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedShow(show);
                          next();
                        }}
                      >
                        {show.date}
                      </div>
                    ))}
                </div>
              </>
            )}

            <div className="modal-buttons">
              <button className="back-btn" onClick={back}>Back</button>
            </div>
          </div>
        )}

        {/* STEP 3 — AUDITORIUM */}
        {step === 3 && (
          <div className="step-content">
            <h3 className="step-title">{cinemaData[location].name}</h3>
            <div className="option-grid">
              {cinemaData[location].auditoriums.map(a => (
                <div
                  key={a.id}
                  className="option-card"
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
          </div>
        )}

        {/* STEP 4 — SEATS */}
        {step === 4 && (
          <div className="step-content">
            <h3 className="step-title">Choose Your Seats</h3>
            <div className="seat-grid">
              {seatsForAuditorium.map(seat => (
                <div
                  key={seat}
                  className={`seat ${selectedSeats.includes(seat) ? "selected" : ""}`}
                  onClick={() => toggleSeat(seat)}
                >
                  {seat}
                </div>
              ))}
            </div>
            <div className="modal-buttons">
              <button className="back-btn" onClick={back}>Back</button>
              <button className="next-btn" onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {/* STEP 5 — TICKETS */}
        {step === 5 && (
          <div className="step-content">
            <h3 className="step-title">Select Tickets</h3>

            {[
              { type: "adult", label: `Adult (€${adultPrice})` },
              { type: "child", label: `Child (€${childPrice})` },
            ].map(t => (
              <div className="ticket-row" key={t.type}>
                <div>{t.label}</div>
                <div className="ticket-controls">
                  <button onClick={() =>
                    setTickets(p => ({ ...p, [t.type]: Math.max(0, p[t.type] - 1) }))
                  }>-</button>
                  <span>{tickets[t.type]}</span>
                  <button onClick={() =>
                    setTickets(p => ({ ...p, [t.type]: p[t.type] + 1 }))
                  }>+</button>
                </div>
              </div>
            ))}

            <div className="modal-buttons">
              <button className="back-btn" onClick={back}>Back</button>
              <button className="next-btn" onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {/* STEP 6 — PAYMENT */}
        {step === 6 && (
          <div className="step-content">
            <h3 className="step-title">Payment</h3>
            <CheckoutView totalAmount={totalAmount} />
          </div>
        )}

      </div>
    </div>
  );
}

export default BookingModal;
