import React, { useState } from "react";

const EditShowModal = ({ show, onClose, refresh }) => {
  const [date, setDate] = useState(
    show.date ? new Date(show.date).toISOString().split("T")[0] : ""
  );
  const [location, setLocation] = useState(show.location);
  const [screen, setScreen] = useState(show.screen);
  const [adultPrice, setAdultPrice] = useState(show.adult_price);
  const [kidPrice, setKidPrice] = useState(show.kid_price);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/api/shows/${show.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: show.name, // ✅ REQUIRED BY DATABASE
            date,
            location,
            screen,
            adult_price: Number(adultPrice),
            kid_price: Number(kidPrice)
          })
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      refresh();
      onClose();
    } catch (err) {
      console.error("Edit show error:", err);
      alert("Failed to update show");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Show</h2>

        <form onSubmit={handleSubmit}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} required />
          <input type="text" value={screen} onChange={e => setScreen(e.target.value)} required />
          <input type="number" value={adultPrice} onChange={e => setAdultPrice(e.target.value)} required />
          <input type="number" value={kidPrice} onChange={e => setKidPrice(e.target.value)} required />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShowModal;
