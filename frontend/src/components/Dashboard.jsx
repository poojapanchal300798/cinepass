import React from "react";
import AdminLayout from "./AdminLayout/AdminLayout";
import "../style/dashboard.css";  


const Dashboard = () => {
  return (
    <AdminLayout active="overview">

      <h1 className="dashboard-title">Dashboard Overview</h1>

      {/* ====== MAIN CARDS ====== */}
      <div className="stats-row">

        <div className="stats-card">
          <div className="card-icon">$</div>
          <span className="tag-green">+12%</span>
          <h2 className="card-value">€6,080</h2>
          <p className="card-label">Total Revenue</p>
        </div>

        <div className="stats-card">
          <div className="card-icon">📈</div>
          <span className="tag-green">+8%</span>
          <h2 className="card-value">€3,820</h2>
          <p className="card-label">Today's Revenue</p>
        </div>

        <div className="stats-card">
          <div className="card-icon">👥</div>
          <span className="tag-green">+15%</span>
          <h2 className="card-value">550</h2>
          <p className="card-label">Total Bookings</p>
        </div>

        <div className="stats-card">
          <div className="card-icon">🎬</div>
          <h2 className="card-value">3</h2>
          <p className="card-label">Active Shows</p>
        </div>

      </div>

      {/* ====== BOTTOM SUMMARY ====== */}
      <div className="bottom-row">

        <div className="summary-card">
          <h3 className="summary-title">Staff Summary</h3>
          <p>Total Staff <span className="right-text">3</span></p>
          <p>Active <span className="right-text green">3</span></p>
          <p>Inactive <span className="right-text">0</span></p>
        </div>

        <div className="summary-card">
          <h3 className="summary-title">Location Performance</h3>
          <p>Helsinki Central <span className="right-text">€2,880</span></p>
          <p>Cinema Nova Oulu <span className="right-text">€2,160</span></p>
          <p>Kino Baltic Turku <span className="right-text">€1,040</span></p>
        </div>

      </div>

    </AdminLayout>
  );
};

export default Dashboard;
