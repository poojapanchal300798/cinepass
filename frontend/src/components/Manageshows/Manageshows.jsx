import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout/AdminLayout";
import ShowTable from "./Showtable";
import AddShowModal from "./AddShowModal";
import EditShowModal from "./EditShowModal";
import "../../style/manageShows.css";

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);

  const fetchShows = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/shows");
      const data = await response.json();
      if (Array.isArray(data)) setShows(data);
      else console.error("Expected array, got:", data);
    } catch (err) {
      console.error("Fetch shows error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this show?")) return;
    await fetch(`http://localhost:5000/api/shows/${id}`, { method: "DELETE" });
    fetchShows();
  };

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
          <button className="addShowBtn" onClick={() => setAddModalOpen(true)}>
            + Add Show
          </button>
        </div>

        {/* SEARCH BOX */}
        <input className="searchBox" placeholder="Search shows..." />

        {/* TABLE WRAPPER */}
        <div className="show-table-wrapper">
          {loading ? (
            <p style={{ color: "white" }}>Loading...</p>
          ) : (
            <ShowTable 
              shows={shows}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

      </div>

      {/* MODAL: ADD SHOW */}
      {addModalOpen && (
        <AddShowModal 
          onClose={() => setAddModalOpen(false)} 
          refresh={fetchShows} 
        />
      )}

      {/* MODAL: EDIT SHOW */}
      {editModalOpen && (
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
