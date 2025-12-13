import React, { useState } from "react";
import "../style/login.css";
import logo from "../assets/north-star-logo.jpg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server error — please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-background">
      <div className="login-card">

        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-glow">
            <img src={logo} alt="North Star Logo" className="logo-img" />
          </div>
          <div className="logo-texts">
            <h1 className="northstar-title">NORTH STAR</h1>
            <p className="booking-text">BOOKING</p>
          </div>
        </div>

        {/* Lock Icon */}
        <div className="lock-box">
          <div className="lock-circle">
            <span className="lock-symbol">🔒</span>
          </div>
        </div>

        <h2 className="main-title">Admin Portal</h2>
        <p className="subtitle">
          Secure access to North Star Booking management
        </p>

        {/* Username */}
        <div className="input-group">
          <label>Email / Username</label>
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <label>Password</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="eye-icon">👁️</span>
          </div>
        </div>

        <div className="forgot-text">Forgot password?</div>

        {/* Login Button */}
        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login to Dashboard"}
        </button>

        {/* Demo Credentials */}
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
