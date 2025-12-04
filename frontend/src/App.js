import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// MAIN PAGES
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

// MANAGE SHOWS (folder + file)
import ManageShows from "./components/Manageshows/Manageshows";

// MOVIE BOOKING PAGES
import MovieDetails from "./components/Cinema-booking/MovieDetails";  // Correct path
import LocationSelection from "./components/Cinema-booking/LocationSelection";  // Correct path
import DateSelection from "./components/Cinema-booking/DateSelection";  // Correct path
import TimeSelection from "./components/Cinema-booking/TimeSelection";  // Correct path
import SeatSelection from "./components/Cinema-booking/SeatSelection";  // Correct path
import Tickets from "./components/Cinema-booking/Tickets";  // New page for ticket selection
import Payment from "./components/Cinema-booking/Payment";  // Correct path

function App() {
  return (
    <Router>
      <Routes>
        {/* USER HOME PAGE */}
        <Route path="/" element={<HomePage />} />

        {/* ADMIN LOGIN PAGE */}
        <Route path="/admin/login" element={<Login />} />

        {/* ADMIN DASHBOARD */}
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* MANAGE SHOWS PAGE */}
        <Route path="/admin/shows" element={<ManageShows />} />

        {/* MOVIE BOOKING FLOW */}
        <Route path="/book/:movieId" element={<MovieDetails />} /> {/* Dynamic Route */}
        <Route path="/book/location" element={<LocationSelection />} />
        <Route path="/book/date" element={<DateSelection />} />
        <Route path="/book/time" element={<TimeSelection />} />
        <Route path="/book/seats" element={<SeatSelection />} />
        <Route path="/book/tickets" element={<Tickets />} />  {/* Tickets page */}
        <Route path="/book/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
