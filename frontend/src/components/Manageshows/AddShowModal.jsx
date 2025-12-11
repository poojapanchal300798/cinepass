import React, { useState } from "react";
import "../../style/manageShows.css";

const AddShowModal = ({ onClose, refresh }) => {
  const [form, setForm] = useState({
    movieId: "",
    location: "",
    date: "",
    time: "",
    screen: "",
    adultPrice: "",
    childPrice: "",
  });

  const movies = [
    { id: 1, title: "Spider-Man: Beyond the Web" },
    { id: 2, title: "xXx: Return of Xander Cage" },
    { id: 3, title: "Doraemon: Nobita and the Sky Kingdom" },
    { id: 4, title: "The Last Journey" },
    { id: 5, title: "Black Panther: Shadow Kingdom" },
    { id: 6, title: "Guardians of the Galaxy: Infinite Stars" },
    { id: 7, title: "Captain America: Shield of Liberty" },
    { id: 8, title: "The Hangover Returns" },
  ];

  const locations = ["Cinema Nova Oulu", "Elokuvateatteri Helsinki Central", "Kino Baltic Turku"];
  const screens = ["Screen 1 - IMAX", "Screen 2", "Screen 3 - Dolby Atmos", "Screen 4"];

  // Handle form input
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Submit new show
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        refresh();
        onClose();
      }
    } catch (err) {
      console.error("Error creating show:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Add New Show</h2>

        <div className="modal-grid">

          {/* Movie */}
          <div className="modal-field">
            <label>Movie</label>
            <select
              className="modal-input"
              value={form.movieId}
              onChange={(e) => updateField("movieId", e.target.value)}
            >
              <option value="">Select Movie</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="modal-field">
            <label>Location</label>
            <select
              className="modal-input"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="modal-field">
            <label>Date</label>
            <input
              type="date"
              className="modal-input"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
            />
          </div>

          {/* Time */}
          <div className="modal-field">
            <label>Time</label>
            <input
              type="time"
              className="modal-input"
              value={form.time}
              onChange={(e) => updateField("time", e.target.value)}
            />
          </div>

          {/* Screen */}
          <div className="modal-field">
            <label>Screen</label>
            <select
              className="modal-input"
              value={form.screen}
              onChange={(e) => updateField("screen", e.target.value)}
            >
              <option value="">Select Screen</option>
              {screens.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Prices */}
          <div className="modal-field">
            <label>Adult Price (€)</label>
            <input
              type="number"
              className="modal-input"
              value={form.adultPrice}
              onChange={(e) => updateField("adultPrice", e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label>Child Price (€)</label>
            <input
              type="number"
              className="modal-input"
              value={form.childPrice}
              onChange={(e) => updateField("childPrice", e.target.value)}
            />
          </div>

        </div>

        <div className="modal-buttons">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-save" onClick={handleSave}>Save</button>
        </div>

      </div>
    </div>
  );
};

export default AddShowModal;
