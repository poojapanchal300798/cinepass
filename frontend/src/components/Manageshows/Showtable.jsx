import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../style/manageShows.css";

const ShowTable = ({ shows, onEdit, onDelete }) => {
  if (!shows || shows.length === 0) {
    return <p style={{ color: "white" }}>No shows available</p>;
  }

  return (
    <table className="show-table">
      <thead>
        <tr>
          <th>Movie</th>
          <th>Date</th>
          <th>Location</th>
          <th>Screen</th>
          <th>Adult (€)</th>
          <th>Kid (€)</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {shows.map((show) => (
          <tr key={show.id}>
            {/* ✅ MOVIE NAME — SAME AS USER PAGE */}
            <td>{show.name}</td>

            <td>{new Date(show.date).toLocaleDateString()}</td>
            <td>{show.location}</td>
            <td>{show.screen}</td>
            <td>€{show.adult_price}</td>
            <td>€{show.kid_price}</td>

            <td className="actions">
              <button onClick={() => onEdit(show)} className="edit-btn">
                <FaEdit />
              </button>
              <button onClick={() => onDelete(show.id)} className="delete-btn">
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShowTable;
