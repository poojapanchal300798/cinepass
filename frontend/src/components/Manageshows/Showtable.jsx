import React from "react";
import { FaEdit, FaTrash, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import "../../style/manageShows.css";

const Showtable = ({ shows, onEdit, onDelete }) => {
  return (
    <div className="show-table-wrapper">
      
      <table className="show-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Location</th>
            <th>Movie</th>
            <th>Show Time</th>
            <th>Adult (€)</th>
            <th>Kid (€)</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {shows.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-row">No shows available</td>
            </tr>
          ) : (
            shows.map((show) => (
              <tr key={show.id}>
                <td>{show.date}</td>
                <td><FaMapMarkerAlt /> {show.location}</td>
                <td>{show.movie_title}</td>
                <td>
                  <FaClock /> {show.time}
                </td>
                <td>€{show.adult_price}</td>
                <td>€{show.child_price}</td>

                <td className="actions">
                  <button className="edit-btn" onClick={() => onEdit(show)}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(show.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
};

export default Showtable;
