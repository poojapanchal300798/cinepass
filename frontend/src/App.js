import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// USER PAGES
import HomePage from "./components/HomePage";

// ADMIN PAGES
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ManageShows from "./components/Manageshows/Manageshows";

// ADMIN ROUTE PROTECTION
import ProtectedRoute from "./components/ProtectedRoute";

// USER BOOKING PAGES
import MovieDetails from "./components/Cinema-booking/MovieDetails";
import LocationSelection from "./components/Cinema-booking/LocationSelection";
import DateSelection from "./components/Cinema-booking/DateSelection";
import TimeSelection from "./components/Cinema-booking/TimeSelection";
import SeatSelection from "./components/Cinema-booking/SeatSelection";
import Tickets from "./components/Cinema-booking/Tickets";
import Payment from "./components/Cinema-booking/Payment";

function App() {
  return (
    <Router>
      <Routes>

        {/* USER HOME */}
        <Route path="/" element={<HomePage />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<Login />} />

        {/* ADMIN DASHBOARD (Protected) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* MANAGE SHOWS (Protected) */}
        <Route
          path="/admin/shows"
          element={
            <ProtectedRoute>
              <ManageShows />
            </ProtectedRoute>
          }
        />
        <Route path="/movie-details/:movieId" element={<MovieDetails />} />

        {/* BOOKING FLOW */}
        <Route path="/book/location" element={<LocationSelection />} />
        <Route path="/book/date" element={<DateSelection />} />
        <Route path="/book/time" element={<TimeSelection />} />
        <Route path="/book/seats" element={<SeatSelection />} />
        <Route path="/book/tickets" element={<Tickets />} />
        <Route path="/book/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
