import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation

function CinemaBooking() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  
  const navigate = useNavigate();  // Initialize navigate hook

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Handle navigation to Seat Selection
  const handleContinueToSeatSelection = () => {
    if (!selectedLocation || !selectedDate || !selectedTime) {
      alert("Please select Location, Date, and Time.");
      return;  // Ensure all selections are made
    }
    // Navigate to Seat Selection page with the selected data
    navigate('/book/seats', {
      state: { location: selectedLocation, date: selectedDate, time: selectedTime },
    });
  };

  return (
    <div className="cinema-booking-container">
      <h2>Select Location</h2>
      <div className="selection-buttons">
        <button
          className={selectedLocation === "Helsinki" ? "selected" : ""}
          onClick={() => handleLocationSelect("Helsinki")}
        >
          Helsinki
        </button>
        <button
          className={selectedLocation === "Oulu" ? "selected" : ""}
          onClick={() => handleLocationSelect("Oulu")}
        >
          Oulu
        </button>
        <button
          className={selectedLocation === "Turku" ? "selected" : ""}
          onClick={() => handleLocationSelect("Turku")}
        >
          Turku
        </button>
      </div>

      <h2>Select Date</h2>
      <div className="selection-buttons">
        <button
          className={selectedDate === "Today" ? "selected" : ""}
          onClick={() => handleDateSelect("Today")}
        >
          Today
        </button>
        <button
          className={selectedDate === "Tomorrow" ? "selected" : ""}
          onClick={() => handleDateSelect("Tomorrow")}
        >
          Tomorrow
        </button>
        <button
          className={selectedDate === "Wed, Nov 27" ? "selected" : ""}
          onClick={() => handleDateSelect("Wed, Nov 27")}
        >
          Wed, Nov 27
        </button>
        <button
          className={selectedDate === "Thu, Nov 28" ? "selected" : ""}
          onClick={() => handleDateSelect("Thu, Nov 28")}
        >
          Thu, Nov 28
        </button>
      </div>

      <h2>Select Time</h2>
      <div className="selection-buttons">
        <button
          className={selectedTime === "14:00" ? "selected" : ""}
          onClick={() => handleTimeSelect("14:00")}
        >
          14:00
        </button>
        <button
          className={selectedTime === "16:30" ? "selected" : ""}
          onClick={() => handleTimeSelect("16:30")}
        >
          16:30
        </button>
        <button
          className={selectedTime === "19:00" ? "selected" : ""}
          onClick={() => handleTimeSelect("19:00")}
        >
          19:00
        </button>
        <button
          className={selectedTime === "21:30" ? "selected" : ""}
          onClick={() => handleTimeSelect("21:30")}
        >
          21:30
        </button>
      </div>

      <button className="continue-btn" onClick={handleContinueToSeatSelection}>
        Continue to Seat Selection
      </button>
    </div>
  );
}

export default CinemaBooking;
