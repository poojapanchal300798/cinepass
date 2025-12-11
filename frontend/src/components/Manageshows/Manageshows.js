import "../../style/manageShows.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ShowTable from "./Showtable";
import AddShowModal from "./AddShowModal";
import EditShowModal from "./EditShowModal";

import "../../style/manageShows.css"; 
import logo from "../../assets/north-star-logo.jpg";

export default function ManageShows() {
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editShow, setEditShow] = useState(null);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/shows");
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Expected array, got:", data);
        return;
      }

      const mapped = data.map((s) => ({
        id: s.id,
        name: s.movie_title,
        datetime: `${s.date} ${s.time}`,
        location: s.location_name,
        screen: s.screen,
        adult_price: s.adult_price,
        kid_price: s.child_price,
      }));

      setShows(mapped);
    } catch (err) {
      console.log("Error fetching shows:", err);
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm("Delete this show?")) return;

    await fetch(`http://localhost:5000/api/shows/${id}`, {
      method: "DELETE",
    });

    fetchShows();
  };

  return (
    <div className="manage-page">

      {/* HEADER */}
      <div className="admin-header">
        <div className="header-left">
          <img src={logo} className="logo-img" alt="logo" />
          <div>
            <h2 className="header-title">NORTH STAR</h2>
            <span className="header-sub">ADMIN PORTAL</span>
          </div>
        </div>

        <button className="logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>

      {/* NAV BAR */}
      <div className="admin-tabs">
        <button onClick={() => navigate("/admin/dashboard")}>Overview</button>
        <button className="active">Shows</button>
        <button>Staff</button>
        <button>Revenue</button>
      </div>

      {/* TITLE */}
      <h1 className="manage-title">Manage Shows</h1>

      {/* SEARCH + ADD */}
      <div className="manage-toolbar">
        <input
          type="text"
          placeholder="Search shows..."
          className="manage-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn-add-show" onClick={() => setIsAddModalOpen(true)}>
          + Add Show
        </button>
      </div>

      {/* TABLE */}
      <div className="show-table-container">
        <ShowTable
          shows={shows.filter((s) =>
            s.name.toLowerCase().includes(search.toLowerCase())
          )}
          onEdit={setEditShow}
          onDelete={handleDeleteShow}
        />
      </div>

      {isAddModalOpen && (
        <AddShowModal onClose={() => setIsAddModalOpen(false)} onSuccess={fetchShows} />
      )}

      {editShow && (
        <EditShowModal show={editShow} onClose={() => setEditShow(null)} onSuccess={fetchShows} />
      )}
    </div>
  );
}
