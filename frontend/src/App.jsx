import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// USER PAGES
import HomePage from "./components/HomePage.jsx";

// ADMIN PAGES
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ManageShows from "./components/Manageshows/Manageshows.jsx";

// ADMIN ROUTE PROTECTION
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// USER BOOKING PAGES
import MovieDetails from "./components/Cinema-booking/MovieDetails.jsx";
import LocationSelection from "./components/Cinema-booking/LocationSelection.jsx";
import DateSelection from "./components/Cinema-booking/DateSelection.jsx";
import TimeSelection from "./components/Cinema-booking/TimeSelection.jsx";
import SeatSelection from "./components/Cinema-booking/SeatSelection.jsx";
import Tickets from "./components/Cinema-booking/Tickets.jsx";
import Payment from "./components/Cinema-booking/Payment.jsx";
import SuccessView from "./components/Cinema-booking/views/SuccessView.jsx";

// LAYOUT
import Footer from "./components/Footer.jsx";

/* =========================
   APP LAYOUT (Footer logic)
========================= */
function AppLayout() {
  const location = useLocation();

  // ✅ Hide footer ONLY on success page
  const hideFooter = location.pathname === "/success";

  return (
    <div className="app-wrapper">
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

        {/* MOVIE DETAILS */}
        <Route path="/movie-details/:movieId" element={<MovieDetails />} />

        {/* BOOKING FLOW */}
        <Route path="/book/location" element={<LocationSelection />} />
        <Route path="/book/date" element={<DateSelection />} />
        <Route path="/book/time" element={<TimeSelection />} />
        <Route path="/book/seats" element={<SeatSelection />} />
        <Route path="/book/tickets" element={<Tickets />} />
        <Route path="/book/payment" element={<Payment />} />

        {/* SUCCESS */}
        <Route path="/success" element={<SuccessView />} />
      </Routes>

      {/* ✅ Footer shown everywhere EXCEPT success page */}
      {!hideFooter && <Footer />}
    </div>
  );
}

/* =========================
   MAIN APP
========================= */
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
