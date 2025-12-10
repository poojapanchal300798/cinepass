import React from "react";
import "../style/footer.css";
import logo from "../assets/north-star-logo.jpg";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">

        {/* Top Section */}
        <div className="footer-top">
          <img src={logo} alt="North Star" className="footer-logo" />

          <div className="footer-text">
            <h2 className="footer-brand">NORTH STAR</h2>
            <span className="footer-sub">BOOKING</span>
          </div>
        </div>

        <hr className="footer-divider" />

        <p className="footer-tagline">
          Premium cinema experience across Finland
        </p>

        {/* Columns */}
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <a href="/shows">Shows</a>
            <a href="/locations">Locations</a>
            <a href="/about">About Us</a>
          </div>

          <div className="footer-column">
            <h4>Information</h4>
            <a href="/terms">Terms & Conditions</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/faqs">FAQs</a>
            <a href="/help">Help Center</a>
          </div>

          <div className="footer-column">
            <h4>Contact Us</h4>
            <p>Email</p>
            <a href="mailto:info@northstarcinemas.fi">
              info@northstarcinemas.fi
            </a>

            <p>Phone</p>
            <a href="tel:+358800123456">+358 800 123 456</a>
          </div>
        </div>

        <hr className="footer-divider" />

        <p className="footer-copy">
          © 2025 North Star Booking. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
