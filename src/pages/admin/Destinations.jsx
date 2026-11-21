import React, { useState, useMemo } from "react";
import { 
  MapPin, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  SlidersHorizontal, 
  X, 
  Check, 
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { DESTINATIONS } from "../../data/destinations";
import { INDIAN_STATES } from "../../data/states";
import { CATEGORIES } from "../../data/categories";

export default function Destinations() {
  const [destList, setDestList] = useState(DESTINATIONS);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [activeItem, setActiveItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    state: "Rajasthan",
    city: "",
    category: "Heritage",
    rating: 4.8,
    reviews: 2400,
    estimatedBudget: 15000,
    bestTime: "Oct - Mar",
    image: "/assets/img/india-tours/taj-mahal.jpg",
    description: "",
    popularActivities: "Guided Heritage Walk, Photography",
    ticketPrice: 250
  });

  const filtered = useMemo(() => {
    return destList.filter((d) => {
      if (selectedState !== "All" && d.state !== selectedState) return false;
      if (selectedCategory !== "All" && d.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [destList, search, selectedState, selectedCategory]);

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      state: "Rajasthan",
      city: "",
      category: "Heritage",
      rating: 4.8,
      reviews: 1200,
      estimatedBudget: 15000,
      bestTime: "Oct - Mar",
      image: "/assets/img/india-tours/hawa-mahal.jpg",
      description: "An awe-inspiring tourist destination rich in historical significance and scenic splendor.",
      popularActivities: "Heritage Tour, Photography, Regional Cuisine Tasting",
      ticketPrice: 200
    });
    setModalMode("add");
  };

  const handleOpenEdit = (dest) => {
    setActiveItem(dest);
    setFormData({
      ...dest,
      popularActivities: Array.isArray(dest.popularActivities) 
        ? dest.popularActivities.join(", ") 
        : dest.popularActivities
    });
    setModalMode("edit");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tourist destination?")) {
      setDestList(destList.filter((d) => d.id !== id));
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newDest = {
        ...formData,
        id: `dest-${Date.now()}`,
        popularActivities: formData.popularActivities.split(",").map((s) => s.trim()),
        lat: 26.9124,
        lng: 75.7873
      };
      setDestList([newDest, ...destList]);
    } else if (modalMode === "edit" && activeItem) {
      setDestList(destList.map((d) => {
        if (d.id === activeItem.id) {
          return {
            ...d,
            ...formData,
            popularActivities: typeof formData.popularActivities === "string" 
              ? formData.popularActivities.split(",").map((s) => s.trim()) 
              : formData.popularActivities
          };
        }
        return d;
      }));
    }
    setModalMode(null);
  };

  return (
    <div className="admin-destinations-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>Destinations Directory ({destList.length})</h1>
          <p>Manage, add, edit and curate tourist attractions across all Indian States & Union Territories.</p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add Destination
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="search-box">
          <Search size={16} className="text-gray" />
          <input 
            type="text" 
            placeholder="Search destination by name or city..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <div className="filter-dropdowns">
          <select 
            value={selectedState} 
            onChange={(e) => setSelectedState(e.target.value)}
            className="filter-select"
          >
            <option value="All">All States & UTs (36)</option>
            {INDIAN_STATES.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>

          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Destinations Table */}
      <div className="admin-table-container">
        <table className="roavio-admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Destination Name</th>
              <th>State & Region</th>
              <th>Category</th>
              <th>Rating & Reviews</th>
              <th>Est. Budget</th>
              <th>Entry Pass</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 30).map((dest) => (
              <tr key={dest.id}>
                <td>
                  <img src={dest.image} alt={dest.name} className="dest-table-thumb" />
                </td>
                <td>
                  <strong className="dest-table-title">{dest.name}</strong>
                  <span className="dest-table-city">{dest.city}</span>
                </td>
                <td>
                  <span className="badge badge-navy">{dest.state}</span>
                </td>
                <td>
                  <span className="badge badge-green">{dest.category}</span>
                </td>
                <td>
                  <span className="font-bold text-navy">★ {dest.rating}</span>
                  <span className="text-muted ml-1">({dest.reviews})</span>
                </td>
                <td className="font-semibold text-green">
                  ₹{dest.estimatedBudget?.toLocaleString()}
                </td>
                <td>
                  ₹{dest.ticketPrice || "Free"}
                </td>
                <td>
                  <div className="action-buttons-cell">
                    <button 
                      onClick={() => handleOpenEdit(dest)}
                      className="table-action-icon-btn text-blue" 
                      title="Edit Destination"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(dest.id)}
                      className="table-action-icon-btn text-red" 
                      title="Delete Destination"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length > 30 && (
          <div className="table-pagination-footer">
            Showing first 30 of {filtered.length} matching destinations
          </div>
        )}
      </div>

      {/* Add / Edit Destination Modal */}
      {modalMode && (
        <div className="modal-backdrop" onClick={() => setModalMode(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{modalMode === "add" ? "Add New Tourist Destination" : `Edit: ${formData.name}`}</h3>
              <button onClick={() => setModalMode(null)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="admin-modal-body">
              <div className="modal-form-grid">
                <div className="form-group">
                  <label>Destination Name *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                    className="roavio-input" 
                  />
                </div>

                <div className="form-group">
                  <label>City / Location *</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required 
                    className="roavio-input" 
                  />
                </div>

                <div className="form-group">
                  <label>Indian State / UT *</label>
                  <select 
                    value={formData.state} 
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="roavio-select"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Experience Category *</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="roavio-select"
                  >
                    {CATEGORIES.filter((c) => c.name !== "All").map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Estimated Trip Budget (₹)</label>
                  <input 
                    type="number" 
                    value={formData.estimatedBudget} 
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
                    className="roavio-input" 
                  />
                </div>

                <div className="form-group">
                  <label>Entry Pass Fee (₹)</label>
                  <input 
                    type="number" 
                    value={formData.ticketPrice} 
                    onChange={(e) => setFormData({ ...formData, ticketPrice: Number(e.target.value) })}
                    className="roavio-input" 
                  />
                </div>

                <div className="form-group">
                  <label>Best Season to Visit</label>
                  <input 
                    type="text" 
                    value={formData.bestTime} 
                    onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                    className="roavio-input" 
                    placeholder="e.g. October to March" 
                  />
                </div>

                <div className="form-group">
                  <label>Image Asset URL</label>
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="roavio-input" 
                  />
                </div>
              </div>

              <div className="form-group mt-3">
                <label>Key Activities (Comma separated)</label>
                <input 
                  type="text" 
                  value={formData.popularActivities} 
                  onChange={(e) => setFormData({ ...formData, popularActivities: e.target.value })}
                  className="roavio-input" 
                />
              </div>

              <div className="form-group mt-3">
                <label>Destination Description</label>
                <textarea 
                  rows={3} 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="roavio-textarea" 
                />
              </div>

              <div className="admin-modal-footer">
                <button type="button" onClick={() => setModalMode(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === "add" ? "Create Destination" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-destinations-page {
          padding: 1.8rem 2.2rem;
        }

        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.8rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-page-header h1 {
          font-size: 1.7rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0 0 0.3rem;
        }

        .admin-page-header p {
          color: #64748B;
          font-size: 0.9rem;
          margin: 0;
        }

        .admin-filter-bar {
          background: white;
          border-radius: 14px;
          padding: 1rem 1.2rem;
          border: 1px solid #E2E8F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          padding: 0.5rem 0.8rem;
          max-width: 360px;
          width: 100%;
        }

        .search-box input {
          border: none;
          background: transparent;
          margin-left: 0.5rem;
          width: 100%;
          font-size: 0.88rem;
          outline: none;
        }

        .filter-dropdowns {
          display: flex;
          gap: 0.8rem;
        }

        .filter-select {
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.45rem 0.8rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-navy);
          outline: none;
        }

        .admin-table-container {
          background: white;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          overflow-x: auto;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
        }

        .roavio-admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }

        .roavio-admin-table th {
          background: #F8FAFC;
          padding: 0.9rem 1.1rem;
          text-align: left;
          font-size: 0.74rem;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          border-bottom: 1.5px solid #E2E8F0;
        }

        .roavio-admin-table td {
          padding: 0.85rem 1.1rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .dest-table-thumb {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
        }

        .dest-table-title {
          display: block;
          color: var(--color-navy);
          font-weight: 700;
        }

        .dest-table-city {
          font-size: 0.76rem;
          color: #64748B;
        }

        .action-buttons-cell {
          display: flex;
          gap: 0.5rem;
        }

        .table-action-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .table-action-icon-btn.text-blue:hover {
          background: #EFF6FF;
          border-color: #BFDBFE;
          color: #2563EB;
        }

        .table-action-icon-btn.text-red:hover {
          background: #FEF2F2;
          border-color: #FECACA;
          color: #DC2626;
        }

        .table-pagination-footer {
          padding: 1rem;
          text-align: center;
          font-size: 0.82rem;
          color: #64748B;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .admin-modal-card {
          background: white;
          border-radius: 20px;
          max-width: 680px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2);
        }

        .admin-modal-header {
          padding: 1.4rem 1.8rem;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-modal-header h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0;
        }

        .admin-modal-body {
          padding: 1.6rem 1.8rem;
        }

        .modal-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.1rem;
        }

        .admin-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.8rem;
          margin-top: 1.8rem;
          padding-top: 1.2rem;
          border-top: 1px solid #E2E8F0;
        }
      `}</style>
    </div>
  );
}
