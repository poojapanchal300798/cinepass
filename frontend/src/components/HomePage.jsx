import React, { useState } from "react";
import "../style/homepage.css";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

import BookingModal from "./Cinema-booking/BookingModal";

// LOGO
import logo from "../assets/north-star-logo.jpg";

// MOVIE IMAGES
import spider from "../assets/movies/spider.jpg";
import xxx from "../assets/movies/xxx.jpg";
import doraemon from "../assets/movies/doraemon.jpg";
import lastjourney from "../assets/movies/lastjourney.jpg";
import blackpanther from "../assets/movies/blackpanther.jpg";
import guardians from "../assets/movies/guardians.jpg";
import captain from "../assets/movies/captain.jpg";
import hangover from "../assets/movies/hangover.jpg";

const HomePage = () => {
  const [showLocations, setShowLocations] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const locations = ["Helsinki", "Oulu", "Tampere"];

  const movies = [
    { id: 1, title: "Spider-Man: Beyond the Web", image: spider },
    { id: 2, title: "xXx: Return of Xander Cage", image: xxx },
    { id: 3, title: "Doraemon: Nobita and the Sky Kingdom", image: doraemon },
    { id: 4, title: "The Last Journey", image: lastjourney },
    { id: 5, title: "Black Panther: Shadow Kingdom", image: blackpanther },
    { id: 6, title: "Guardians of the Galaxy: Infinite Stars", image: guardians },
    { id: 7, title: "Captain America: Shield of Liberty", image: captain },
    { id: 8, title: "The Hangover Returns", image: hangover },
  ];

  return (
    <div className="mobile-wrapper">
      <div className="mobile-container">

        {/* HEADER */}
        <div className="header">
          <img src={logo} className="header-logo" alt="North Star Logo" />
          <span className="header-title">NORTH STAR</span>
          <FaSearch className="header-icon" />
        </div>

        {/* NAVIGATION BAR */}
        <div className="top-nav-bar">
          <button className="top-nav-btn">Movies</button>

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
                  <div key={loc} className="location-item">
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>

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
            <button className="buy-btn" onClick={() => setShowModal(true)}>
              Buy tickets
            </button>
          </div>
        </div>

        {/* MOVIE GRID */}
        <h3 className="section-title">Now in the cinema</h3>

        <div className="movie-grid">
          {movies.map((m) => (
            <div key={m.id} className="movie-card">
              <img
                src={m.image}
                className="movie-img"
                alt={m.title}
                onClick={() => setShowModal(true)}
              />
              <Link to={`/movie-details/${m.id}`} className="movie-name">
                <h4>{m.title}</h4>
              </Link>
            </div>
          ))}
        </div>

      </div>

      {/* BOOKING MODAL */}
      {showModal && (
        <BookingModal
          parent="homepage"
          movieList={movies}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
