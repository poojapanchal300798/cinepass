import React from "react";
import "../style/login.css";
import logo from "../assets/north-star-logo.jpg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard"); // redirect admin
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server error — backend not responding");
    }
  };

  return (
    <div className="page-background">
      <div className="login-card">

        {/* Logo + Title */}
        <div className="logo-section">
          <div className="logo-glow">
            <img src={logo} alt="North Star Logo" className="logo-img" />
          </div>
          <div className="logo-texts">
            <h1 className="northstar-title">NORTH STAR</h1>
            <p className="booking-text">BOOKING</p>
          </div>
        </div>

        <div className="lock-box">
          <div className="lock-circle">
            <span className="lock-symbol">🔒</span>
          </div>
        </div>

        <h2 className="main-title">Admin Portal</h2>
        <p className="subtitle">Secure access to North Star Booking management</p>

        <div className="input-group">
          <label>Email / Username</label>
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input id="username" type="text" placeholder="Enter your email or username" />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input id="password" type="password" placeholder="Enter your password" />
            <span className="eye-icon">👁️</span>
          </div>
        </div>

        <div className="forgot-text">Forgot password?</div>

        <button className="login-btn" onClick={handleLogin}>
          Login to Dashboard
        </button>

        <div className="demo-box">
          <h4>Demo Credentials</h4>
          <p>Email: <strong>admin@northstar.com</strong></p>
          <p>Password: <strong>admin123</strong></p>
        </div>

        <footer className="footer">
          © 2024 North Star Booking. All rights reserved.
        </footer>

      </div>
    </div>
  );
};

export default Login;
