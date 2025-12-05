import React from 'react';
import "../../style/CinemaBooking.css";  // ✅ Correct CSS path
import { useNavigate } from 'react-router-dom';

function MovieDetails() {
  const navigate = useNavigate();

  const movie = {
    title: "Spider-Man: Beyond the Web",
    genre: "Action",
    description: "Spider-Man embarks on a new adventure beyond the web, facing new enemies and discovering new realms.",
    duration: "2h 10m", 
    rating: "PG-13",
    image: "https://via.placeholder.com/400x600.png?text=Movie+Poster"
  };

  const handleBookNow = () => {
    navigate('/book/location');
  };

  return (
    <div className="movie-details">
      <h1>{movie.title}</h1>
      <img src={movie.image} alt={movie.title} />
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Duration:</strong> {movie.duration}</p>
      <p><strong>Rating:</strong> {movie.rating}</p>
      <p><strong>Description:</strong> {movie.description}</p>

      <button onClick={handleBookNow}>Book Now</button>
    </div>
  );
}

export default MovieDetails;
