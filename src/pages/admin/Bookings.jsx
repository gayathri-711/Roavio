import React, { useState, useMemo } from "react";
import { 
  TicketCheck, 
  Search, 
  Plane, 
  Train, 
  Bus, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle,
  X
} from "lucide-react";
import { useTrips } from "../../context/TripsContext";

export default function AdminBookings() {
  const { bookings, allPlatformBookings, cancelBooking } = useTrips();
  const bookingsList = allPlatformBookings && allPlatformBookings.length > 0 ? allPlatformBookings : bookings;

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [previewTicket, setPreviewTicket] = useState(null);

  const filtered = useMemo(() => {
    return bookingsList.filter((b) => {
      const bType = (b.type || b.category || "").toLowerCase();
      if (typeFilter !== "All") {
        if (typeFilter === "pass" && !["pass", "tour"].includes(bType)) return false;
        if (typeFilter !== "pass" && bType !== typeFilter.toLowerCase()) return false;
      }

      const bStatus = b.status || b.bookingStatus || "Confirmed";
      if (statusFilter !== "All" && bStatus.toLowerCase() !== statusFilter.toLowerCase()) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          b.title?.toLowerCase().includes(q) ||
          b.pnr?.toLowerCase().includes(q) ||
          b.providerReference?.toLowerCase().includes(q) ||
          b.route?.toLowerCase().includes(q) ||
          b.leadPassenger?.toLowerCase().includes(q) ||
          b.email?.toLowerCase().includes(q) ||
          b.userEmail?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bookingsList, search, typeFilter, statusFilter]);

  return (
    <div className="admin-bookings-page">
      <div className="admin-page-header">
        <div>
          <h1>Reservations & Ticket Management ({bookingsList.length})</h1>
          <p>Monitor multi-modal transport inventory, passenger seat assignments, and reservation statuses across all users.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="search-box">
          <Search size={16} className="text-gray" />
          <input 
            type="text" 
            placeholder="Search by PNR, train/flight title, route..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <div className="filter-dropdowns">
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            <option value="flight">Flights</option>
            <option value="train">Trains</option>
            <option value="bus">Buses</option>
            <option value="pass">Monument Passes</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="admin-table-container">
        <table className="roavio-admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>PNR Reference</th>
              <th>Service / Title</th>
              <th>Route</th>
              <th>Travel Date</th>
              <th>Passengers & Seat</th>
              <th>Total Fare</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const bType = (b.type || b.category || "flight").toLowerCase();
              const bPnr = b.pnr || b.providerReference || "ROA-CONF";
              const bDate = b.date || b.travelDate || b.bookingDate || "2026-11-21";
              const bFare = b.fare || b.amount || 0;
              const bStatus = b.status || b.bookingStatus || "Confirmed";
              const bPassenger = b.leadPassenger || b.email || b.userEmail || "Traveler";

              return (
                <tr key={b.id || b.bookingId || bPnr}>
                  <td>
                    <span className={`admin-type-pill ${bType}`}>
                      {bType === "flight" && <Plane size={12} />}
                      {bType === "train" && <Train size={12} />}
                      {bType === "bus" && <Bus size={12} />}
                      {(bType === "pass" || bType === "tour") && <TicketCheck size={12} />}
                      {b.category || bType}
                    </span>
                  </td>
                  <td className="font-mono font-bold">{bPnr}</td>
                  <td>
                    <strong className="booking-title-text">{b.title}</strong>
                    <span className="booking-operator-text">{b.operator || b.providerName || "Roavio Certified"}</span>
                    <span className="text-muted small d-block">Passenger: {bPassenger}</span>
                  </td>
                  <td>{b.route || `${b.sourceLocation || ""} ➔ ${b.destination || ""}`.trim() || "Local Attraction"}</td>
                  <td>{bDate}</td>
                  <td>
                    <span>{b.passengers || 1} Pax</span>
                    <span className="seat-badge">{b.seat || b.seatClass || "Standard"}</span>
                  </td>
                  <td className="font-bold text-green">
                    ₹{Number(bFare).toLocaleString()}
                  </td>
                  <td>
                    <span className={`status-pill ${bStatus.toLowerCase()}`}>
                      {bStatus}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-cell">
                      <button 
                        onClick={() => setPreviewTicket(b)}
                        className="table-action-icon-btn text-blue"
                        title="Inspect E-Ticket"
                      >
                        <Eye size={16} />
                      </button>
                      {bStatus !== "Cancelled" && (
                        <button 
                          onClick={() => cancelBooking(b.id || b.bookingId)}
                          className="table-action-icon-btn text-red"
                          title="Cancel Booking"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Preview */}
      {previewTicket && (
        <div className="modal-backdrop" onClick={() => setPreviewTicket(null)}>
          <div className="ticket-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ticket-modal-header">
              <div>
                <span className="ticket-brand">ADMIN E-PASS AUDIT</span>
                <h3>{previewTicket.title}</h3>
              </div>
              <button onClick={() => setPreviewTicket(null)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="ticket-modal-body">
              <div className="ticket-pnr-banner">
                <span className="pnr-title">RESERVATION PNR</span>
                <span className="pnr-code">{previewTicket.pnr}</span>
              </div>

              <div className="ticket-details-grid">
                <div>
                  <span className="t-label">Travel Date</span>
                  <strong>{previewTicket.date}</strong>
                </div>
                <div>
                  <span className="t-label">Route</span>
                  <strong>{previewTicket.route}</strong>
                </div>
                <div>
                  <span className="t-label">Seat / Berth</span>
                  <strong>{previewTicket.seat}</strong>
                </div>
                <div>
                  <span className="t-label">Total Fare</span>
                  <strong className="text-green">₹{previewTicket.fare?.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="ticket-modal-footer">
              <button onClick={() => setPreviewTicket(null)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-bookings-page {
          padding: 1.8rem 2.2rem;
        }

        .admin-page-header {
          margin-bottom: 1.8rem;
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
          padding: 0.95rem 1.1rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .admin-type-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }

        .admin-type-pill.flight { background: #ECFDF5; color: #047857; }
        .admin-type-pill.train { background: #EFF6FF; color: #1D4ED8; }
        .admin-type-pill.bus { background: #FFF7ED; color: #C2410C; }
        .admin-type-pill.pass { background: #F5F3FF; color: #6D28D9; }

        .booking-title-text {
          display: block;
          color: var(--color-navy);
        }

        .booking-operator-text {
          font-size: 0.75rem;
          color: #64748B;
        }

        .seat-badge {
          display: block;
          font-size: 0.72rem;
          color: #0F766E;
          font-weight: 600;
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
      `}</style>
    </div>
  );
}
