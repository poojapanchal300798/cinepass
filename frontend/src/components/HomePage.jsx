import React, { useState } from "react";
import "../style/homepage.css";
import { FaSearch, FaLock } from "react-icons/fa";
import { useNavigate,Link } from "react-router-dom";

import logo from "../assets/north-star-logo.jpg";

// MOVIES
import spider from "../assets/movies/spider.jpg";
import xxx from "../assets/movies/xxx.jpg";
import doraemon from "../assets/movies/doraemon.jpg";
import lastjourney from "../assets/movies/lastjourney.jpg";
import blackpanther from "../assets/movies/blackpanther.jpg";
import guardians from "../assets/movies/guardians.jpg";
import captain from "../assets/movies/captain.jpg";
import hangover from "../assets/movies/hangover.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const [showLocations, setShowLocations] = useState(false);

  const locations = ["Helsinki", "Oulu", "Tampere"];

  const movies = [
    { id: 1, title: "Spider-Man: Beyond the Web", poster: spider, showtime: "16:30", availability: "AVAILABLE" },
    { id: 2, title: "xXx: Return of Xander Cage", poster: xxx, showtime: "16:30", availability: "AVAILABLE" },
    { id: 3, title: "Doraemon: Nobita and the Sky Kingdom", poster: doraemon, showtime: "16:30", availability: "AVAILABLE" },
    { id: 4, title: "The Last Journey", poster: lastjourney, showtime: "16:30", availability: "AVAILABLE" },
    { id: 5, title: "Black Panther: Shadow Kingdom", poster: blackpanther, showtime: "16:30", availability: "AVAILABLE" },
    { id: 6, title: "Guardians of the Galaxy: Infinite Stars", poster: guardians, showtime: "16:30", availability: "AVAILABLE" },
    { id: 7, title: "Captain America: Shield of Liberty", poster: captain, showtime: "16:30", availability: "AVAILABLE" },
    { id: 8, title: "The Hangover Returns", poster: hangover, showtime: "16:30", availability: "AVAILABLE" },
  ];

  return (
    <div className="mobile-wrapper">
      <div className="mobile-container">

        {/* TOP HEADER */}
        <div className="header">
          <img src={logo} className="header-logo" alt="logo" />
          <span className="header-title">NORTH STAR</span>

          <div className="header-right">
            <FaSearch className="header-icon" />
            <FaLock className="header-icon" onClick={() => navigate("/admin/login")} />
          </div>
        </div>

        {/* WHITE NAV BAR */}
        <div className="top-nav-bar">
          <button className="top-nav-btn">Movies</button>

          {/* LOCATIONS DROPDOWN */}
          <div className="location-container">
            <button
              className="top-nav-btn"
              onClick={() => setShowLocations(!showLocations)}
            >
              Locations ▾
            </button>

            {showLocations && (
              <div className="location-dropdown">
                {locations.map((loc) => (
                  <div key={loc} className="location-item">{loc}</div>
                ))}
              </div>
            )}
          </div>

          {/* LANGUAGE SELECT */}
          <select className="top-nav-lang">
            <option>EN</option>
            <option>FI</option>
          </select>
        </div>

        {/* FEATURED MOVIE */}
        <div className="featured-card">
          <img src={spider} className="featured-img" alt="" />
          <div className="featured-content">
            <h3>Spider-Man: Beyond the Web</h3>
            <button className="buy-btn">Buy tickets</button>
          </div>
        </div>

        {/* MOVIE LIST */}
        <h3 className="section-title">Now in the cinema</h3>

        <div className="movie-grid">
          {movies.map((m) => (
            <div key={m.id} className="movie-card">
          <Link to={`/book/${m.id}`}>  {/* Add Link here to route to specific movie */}
            <img src={m.poster} className="movie-img" alt={m.title} />
            <h4 className="movie-name">{m.title}</h4>
            <p className="movie-info">{m.showtime} — {m.availability}</p>
          </Link>
        </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HomePage;
