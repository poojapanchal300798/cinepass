import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/north-star-logo.jpg";
import "../../style/adminlayout.css";

const AdminLayout = ({ active, children }) => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">

      {/* HEADER */}
      <header className="admin-header">
        <div className="header-left">
          <img src={logo} className="nav-logo" alt="Logo" />

          <div className="logo-text">
            <h2>NORTH STAR</h2>
            <span>ADMIN PORTAL</span>
          </div>
        </div>

        <button className="logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>
      </header>

      {/* NAVIGATION TABS */}
      <nav className="admin-tabs">
        <button
          className={`tab-btn ${active === "overview" ? "active" : ""}`}
          onClick={() => navigate("/admin/dashboard")}
        >
          Overview
        </button>

        <button
          className={`tab-btn ${active === "shows" ? "active" : ""}`}
          onClick={() => navigate("/admin/shows")}
        >
          Shows
        </button>

        <button className="tab-btn">Staff</button>
        <button className="tab-btn">Revenue</button>
      </nav>

      {/* PAGE CONTENT */}
      <div className="admin-content">{children}</div>
    </div>
  );
};

export default AdminLayout;
