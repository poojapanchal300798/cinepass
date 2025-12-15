import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout/AdminLayout";
import ShowTable from "./Showtable";
import AddShowModal from "./AddShowModal";
import EditShowModal from "./EditShowModal";
import "../../style/manageShows.css";

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);

  // ✅ FETCH SHOWS (ROBUST)
  const fetchShows = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/shows");

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Fetch shows failed:", errorText);
        setError("Failed to load shows");
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setShows(data);
      } else {
        console.error("Unexpected shows response:", data);
        setError("Invalid shows data");
      }
    } catch (err) {
      console.error("Fetch shows error:", err);
      setError("Server error while loading shows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  // ✅ DELETE SHOW
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this show?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/shows/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      fetchShows();
    } catch (err) {
      console.error("Delete show error:", err);
      alert("Failed to delete show");
    }
  };

  // ✅ OPEN EDIT MODAL
  const handleEdit = (show) => {
    setSelectedShow(show);
    setEditModalOpen(true);
  };

  return (
    <AdminLayout active="shows">
      <div className="manage-shows-page">

        {/* HEADER */}
        <div className="manage-header">
          <h1 className="page-title">Manage Shows</h1>
          <button
            className="addShowBtn"
            onClick={() => setAddModalOpen(true)}
          >
            + Add Show
          </button>
        </div>

        {/* SEARCH */}
        <input className="searchBox" placeholder="Search shows..." />

        {/* TABLE */}
        <div className="show-table-wrapper">
          {loading && <p style={{ color: "white" }}>Loading...</p>}

          {!loading && error && (
            <p style={{ color: "red" }}>{error}</p>
          )}

          {!loading && !error && shows.length > 0 && (
            <ShowTable
              shows={shows}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {!loading && !error && shows.length === 0 && (
            <p style={{ color: "white" }}>No shows available</p>
          )}
        </div>
      </div>

      {/* ADD SHOW MODAL */}
      {addModalOpen && (
        <AddShowModal
          onClose={() => setAddModalOpen(false)}
          refresh={fetchShows}
        />
      )}

      {/* EDIT SHOW MODAL */}
      {editModalOpen && selectedShow && (
        <EditShowModal
          show={selectedShow}
          onClose={() => setEditModalOpen(false)}
          refresh={fetchShows}
        />
      )}
    </AdminLayout>
  );
};

export default ManageShows;
