// src/components/Cinema-booking/MovieDetails.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaClock, FaStar, FaShareAlt, FaUser, FaCalendarAlt } from "react-icons/fa"; 
import "../../style/CinemaBooking.css"; // Ensure this CSS path is correct for detail styles
import BookingModal from "../Cinema-booking/BookingModal";
// MOVIE POSTERS
import spider from "../../assets/movies/spider.jpg";
import xxx from "../../assets/movies/xxx.jpg";
import doraemon from "../../assets/movies/doraemon.jpg";
import lastjourney from "../../assets/movies/lastjourney.jpg";
import blackpanther from "../../assets/movies/blackpanther.jpg";
import guardians from "../../assets/movies/guardians.jpg";
import captain from "../../assets/movies/captain.jpg";
import hangover from "../../assets/movies/hangover.jpg";
// Assuming you have Header and Footer components to complete the page layout
// import Header from "../Header"; 
// import Footer from "../Footer";


// NOTE: THE MOCK DATA WE'RE AIMING FOR (Backend API Response)
// The actual data will come from your backend via the Axios call
const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

const getEmbedUrl = (youtubeUrl) => {
    if (!youtubeUrl) return null;
    try {
        const url = new URL(youtubeUrl);
        const videoId = url.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
        return null;
    }
};

const movies = [
  { id: 1, title: "Spider-Man: Beyond the Web", imageUrl: spider, trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: 2, title: "xXx: Return of Xander Cage", imageUrl: xxx, trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: 3, title: "Doraemon: Nobita and the Sky Kingdom", imageUrl: doraemon, trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: 4, title: "The Last Journey", imageUrl: lastjourney, trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: 5, title: "Black Panther: Shadow Kingdom", imageUrl: blackpanther, trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: 6, title: "Guardians of the Galaxy: Infinite Stars", imageUrl: guardians, trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: 7, title: "Captain America: Shield of Liberty", imageUrl: captain, trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: 8, title: "The Hangover Returns", imageUrl: hangover, trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
];


function MovieDetails() {
    const navigate = useNavigate();
    const { movieId } = useParams(); // Hook to grab the ID from the URL (e.g., /book/1)

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- Data Fetching Logic (Replaces your hardcoded object) ---
    useEffect(() => {
        const fetchMovieData = async () => {
            if (!movieId) return;

            try {
                setLoading(true);
                // 1. AXIOS CALL to your backend
                const response = await axios.get(`/api/movies/${movieId}`); 
                setMovie(response.data);
                
                // You can temporarily use a local mock for testing if the API is down:
                // setMovie(YOUR_MOCK_DATA_OBJECT);

            } catch (err) {
                console.error("Error fetching movie details:", err);
                setError("Failed to load movie details. Check the API route /api/movies/:id.");
                const fallbackMovie = movies.find(element => element.id === Number(movieId));
                setMovie(fallbackMovie);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [movieId]);

    // --- Handlers ---
    const handleBookNow = () => {
        // Navigate to the next step in the booking flow
        setIsModalOpen(true);
    };
    
    const closeTrailerModal = () => {
          setIsModalOpen(false);
      };
      const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };
    // --- Loading, Error, and Not Found States ---
    if (loading) {
        return <div className="detail-container loading">Loading Movie Details...</div>;
    }

    if (error && !movie) {
        return <div className="detail-container error">Error: {error || `Movie ID ${movieId} not found.`}</div>;
    }
    
    // const embedUrl = getEmbedUrl(movie.trailerUrl);
    const embedUrl = movie.trailerUrl ? getEmbedUrl(movie.trailerUrl) : null;


    // --- Success Render (Your desired output) ---
    return (
        <div className="movie-details-page">
            
            <div className="detail-page-content">
                
                {/* BACK BUTTON AND TITLE 
                <div className="movie-details-header">
                    <button onClick={() => navigate(-1)} className="back-button">← Back</button>
                    <h2>{movie.title}</h2>
                </div>*/}


                {/* IMAGE & INFO BLOCK */}
                <div className="movie-hero">
                    <button onClick={() => navigate(-1)} className="back-button">← Back</button>
                    <img 
                        src={movie.imageUrl} 
                        alt={movie.title} 
                        className="detail-poster-img" 
                    />
                    <div className="poster-overlay-badge">In Cinemas</div>
                    
                    <div className="movie-info-block">
                        <div className="title-row">
                            <h1>{movie.title}</h1>
                            <div className="rating-share">
                                {/* Assuming you have a 'rating' field in your data */}
                                <span className="rating-badge"><FaStar /> {movie.rating || 'N/A'}/10</span>
                                <FaShareAlt className="share-icon" />
                            </div>
                        </div>

                        {/* METADATA ROW (Duration, Date, Genre, Rating) */}
                        <div className="metadata-row">
                            <p><FaClock /> {formatRuntime(movie.runtimeMinutes)}</p>
                            <span className="separator">•</span>
                            <p>{movie.genre}</p>
                            <span className="separator">•</span>
                            <p><FaCalendarAlt /> {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            <span className="separator">•</span>
                            <span className="mpaa-rating">{movie.mpaRating || 'PG'}</span>
                        </div>

                        {/* FORMATS CHIPS */}
                        <div className="formats-row">
                            {movie.formats && movie.formats.map(format => (
                                <span key={format} className="format-chip">{format}</span>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* BOOK TICKETS BUTTON */}
                <button 
                    className="book-tickets-btn" 
                    onClick={handleBookNow}
                >
                    Book tickets
                </button>

                {/* ABOUT THE MOVIE / PLOT SUMMARY */}
                <div className="section-container">
                    <h3>About the movie</h3>
                    <p>{movie.description}</p>
                </div>

                {/* TRAILER SECTION (Embedded from YouTube) */}
                {embedUrl && (
                    <div className="section-container trailer-section">
                        <h3>Official Trailer</h3>
                        <div className="trailer-embed-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                            <iframe 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                src={embedUrl} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                title={`${movie.title} Trailer`}
                            ></iframe>
                        </div>
                    </div>
                )}


                {/* DIRECTOR SECTION */}
                <div className="section-container">
                    <h3 className="section-subtitle"><FaUser /> Director</h3>
                    <p className="section-content-text">{movie.director || 'N/A'}</p>
                </div>

                {/* CAST SECTION */}
                {movie.cast && movie.cast.length > 0 && (
                    <div className="section-container">
                        <h3 className="section-subtitle">Cast</h3>
                        <ul className="cast-list">
                            {movie.cast.map((member, index) => (
                                <li key={index} className="cast-item">
                                    <p className="actor-name">{member.actor}</p>
                                    <p className="role-name">{member.role}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
            {/* You can re-add your Footer component here */}
            {/* Trailer Modal */}
            {isModalOpen && embedUrl && (
                <div className="trailer-modal">
                    <div className="trailer-modal-content">
                        <button className="close-modal" onClick={closeTrailerModal}>×</button>
                        <iframe 
                            src={embedUrl}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`${movie.title} Trailer`}
                        />
                    </div>
                </div>
            )}

            {isModalOpen && (
                <BookingModal
                    parent='movie-details'
                    movieList={[movie]} // Pass the selected movie to the modal
                    onClose={closeModal}
                />
            )}
        </div>
    );
}


export default MovieDetails;