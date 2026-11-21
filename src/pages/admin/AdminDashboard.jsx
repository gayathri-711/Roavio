import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  MapPin, 
  Calendar, 
  TicketCheck, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Plane, 
  Train, 
  Bus, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { 
  ADMIN_STATS, 
  MONTHLY_BOOKINGS_DATA, 
  TRANSPORT_CATEGORY_SPLIT, 
  SAMPLE_USERS 
} from "../../data/adminData";
import { useTrips } from "../../context/TripsContext";
import { useEffect } from "react";

// Helper to merge local registered users with default sample users
const getInitialCombinedUsers = () => {
  try {
    const registered = JSON.parse(localStorage.getItem("roavio_registered_users") || "[]");
    const emailMap = new Set();
    const result = [];

    registered.forEach((u) => {
      const email = (u.email || "").toLowerCase();
      if (email && !emailMap.has(email)) {
        emailMap.add(email);
        result.push({
          id: u.id || `usr-${Date.now().toString().slice(-4)}`,
          name: u.name || u.fullName || "Traveler",
          email: u.email,
          city: u.city || "New Delhi",
          role: u.role || (email.includes("admin") ? "Administrator" : "Traveler"),
          status: u.status || "Active",
          bookingsCount: u.bookingsCount || 0,
          tripsPlanned: u.tripsPlanned || 0
        });
      }
    });

    SAMPLE_USERS.forEach((u) => {
      const email = (u.email || "").toLowerCase();
      if (!emailMap.has(email)) {
        emailMap.add(email);
        result.push(u);
      }
    });

    return result;
  } catch (e) {
    return SAMPLE_USERS;
  }
};

export default function AdminDashboard() {
  const { bookings, allPlatformBookings } = useTrips();
  const bookingsList = allPlatformBookings && allPlatformBookings.length > 0 ? allPlatformBookings : bookings;

  const [usersList, setUsersList] = useState(() => getInitialCombinedUsers());
  const [chartYear, setChartYear] = useState("2026");

  // Sync users with backend API
  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data?.users && Array.isArray(data.users)) {
          setUsersList((prev) => {
            const emailMap = new Set();
            const merged = [];

            data.users.forEach((u) => {
              const email = (u.email || "").toLowerCase();
              if (email && !emailMap.has(email)) {
                emailMap.add(email);
                merged.push({
                  id: u.id,
                  name: u.fullName || u.name || "Traveler",
                  email: u.email,
                  city: u.city || "New Delhi",
                  role: u.role || "Traveler",
                  status: u.status || "Active",
                  bookingsCount: u.bookingsCount || 0,
                  tripsPlanned: u.tripsPlanned || 0
                });
              }
            });

            prev.forEach((u) => {
              const email = (u.email || "").toLowerCase();
              if (!emailMap.has(email)) {
                emailMap.add(email);
                merged.push(u);
              }
            });

            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Max value for CSS bar height calculation
  const maxMonthlyRevenue = Math.max(...MONTHLY_BOOKINGS_DATA.map((d) => d.revenue));

  return (
    <div className="admin-dashboard-page">
      {/* Header Banner */}
      <div className="admin-page-header">
        <div>
          <div className="admin-badge-pill">
            <ShieldCheck size={14} />
            <span>PLATFORM EXECUTIVE CONTROL</span>
          </div>
          <h1>Roavio Platform Monitoring & Analytics</h1>
          <p>
            Real-time telemetry across 28 Indian States & 8 UTs · 175 Curated Destinations · Multi-modal transport bookings.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link to="/admin/destinations" className="btn btn-sm btn-primary">
            + Manage Destinations
          </Link>
          <Link to="/" target="_blank" className="btn btn-sm btn-outline flex-center gap-1">
            <span>Public Site</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="admin-kpi-grid">
        {/* Total Users */}
        <div className="admin-kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">TOTAL USERS</span>
            <div className="kpi-icon-box bg-blue">
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value">{ADMIN_STATS.totalUsers.toLocaleString()}</div>
          <div className="kpi-growth text-green">
            <ArrowUpRight size={14} />
            <span>{ADMIN_STATS.usersGrowth}</span>
          </div>
        </div>

        {/* Total Destinations */}
        <div className="admin-kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">DESTINATIONS COVERED</span>
            <div className="kpi-icon-box bg-green">
              <MapPin size={18} />
            </div>
          </div>
          <div className="kpi-value">{ADMIN_STATS.totalDestinations} Attractions</div>
          <div className="kpi-growth text-navy">
            <span>All 36 States & UTs active</span>
          </div>
        </div>

        {/* Total Planned Trips */}
        <div className="admin-kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">PLANNED ITINERARIES</span>
            <div className="kpi-icon-box bg-purple">
              <Calendar size={18} />
            </div>
          </div>
          <div className="kpi-value">{ADMIN_STATS.totalPlannedTrips.toLocaleString()}</div>
          <div className="kpi-growth text-green">
            <ArrowUpRight size={14} />
            <span>{ADMIN_STATS.tripsGrowth}</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="admin-kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">TOTAL BOOKINGS</span>
            <div className="kpi-icon-box bg-orange">
              <TicketCheck size={18} />
            </div>
          </div>
          <div className="kpi-value">{ADMIN_STATS.totalBookings.toLocaleString()}</div>
          <div className="kpi-growth text-green">
            <ArrowUpRight size={14} />
            <span>{ADMIN_STATS.bookingsGrowth}</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="admin-kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">DEMO REVENUE VOLUME</span>
            <div className="kpi-icon-box bg-emerald">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="kpi-value">₹4.82 Cr</div>
          <div className="kpi-growth text-green">
            <ArrowUpRight size={14} />
            <span>{ADMIN_STATS.revenueGrowth}</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="charts-split-grid">
        {/* Monthly Booking & Revenue Bar Chart */}
        <div className="admin-chart-card">
          <div className="chart-header">
            <div>
              <h3>Monthly Travel Revenue & Volume ({chartYear})</h3>
              <p>Aggregated gross booking value across flight, train, bus and site passes</p>
            </div>
            <select 
              value={chartYear} 
              onChange={(e) => setChartYear(e.target.value)}
              className="chart-filter-select"
            >
              <option value="2026">Fiscal Year 2026</option>
              <option value="2025">Fiscal Year 2025</option>
            </select>
          </div>

          <div className="css-bar-chart">
            {MONTHLY_BOOKINGS_DATA.map((item) => {
              const heightPercent = Math.round((item.revenue / maxMonthlyRevenue) * 100);
              return (
                <div key={item.month} className="bar-column" title={`${item.month}: ₹${(item.revenue / 100000).toFixed(1)}L (${item.bookings} bookings)`}>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ height: `${heightPercent}%` }}
                    >
                      <span className="bar-tooltip">₹{(item.revenue / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <span className="bar-month">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transport Share Card */}
        <div className="admin-share-card">
          <div className="chart-header">
            <h3>Transport Split Share</h3>
            <p>Distribution by passenger bookings</p>
          </div>

          <div className="transport-share-list">
            {TRANSPORT_CATEGORY_SPLIT.map((item) => (
              <div key={item.name} className="share-row">
                <div className="flex-between mb-1">
                  <span className="share-label font-semibold">{item.name}</span>
                  <span className="share-percent font-bold">{item.percentage}% ({item.count.toLocaleString()})</span>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="share-insights-box">
            <Sparkles size={16} className="text-orange" />
            <p>
              Domestic flights lead tourist transit at <strong>42%</strong>, with Vande Bharat and high-speed rail following at <strong>31%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Lower Row: Recent Bookings & Active Users */}
      <div className="tables-split-grid">
        {/* Recent Bookings Table */}
        <div className="admin-table-card">
          <div className="table-card-head">
            <h3>Recent Bookings Stream</h3>
            <Link to="/admin/bookings" className="view-more-link">
              View All Bookings ({bookings.length}) →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="admin-mini-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>PNR</th>
                  <th>Service Route</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookingsList.slice(0, 5).map((b) => {
                  const bType = (b.type || b.category || "flight").toLowerCase();
                  const bPnr = b.pnr || b.providerReference || "ROA-CONF";
                  const bDate = b.date || b.travelDate || b.bookingDate || "2026-11-21";
                  const bFare = b.fare || b.amount || 0;
                  const bStatus = b.status || b.bookingStatus || "Confirmed";

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
                      <td className="font-mono">{bPnr}</td>
                      <td className="font-semibold">{b.title}</td>
                      <td>{bDate}</td>
                      <td className="font-bold text-green">₹{Number(bFare).toLocaleString()}</td>
                      <td>
                        <span className="badge badge-green">{bStatus}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="admin-table-card">
          <div className="table-card-head">
            <h3>Verified Platform Users</h3>
            <Link to="/admin/users" className="view-more-link">
              View All Users →
            </Link>
          </div>

          <div className="users-list-stack">
            {usersList.slice(0, 5).map((usr) => (
              <div key={usr.id} className="user-row-item">
                <div className="user-avatar-pill">
                  {(usr.name || "TR").split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2) || "TR"}
                </div>
                <div className="user-meta-info">
                  <div className="flex-between">
                    <strong>{usr.name}</strong>
                    <span className="badge badge-green">{usr.status || "Active"}</span>
                  </div>
                  <span className="user-email-text">{usr.email}</span>
                  <div className="user-sub-stats">
                    <span>{usr.city || "New Delhi"}</span> · 
                    <span>{usr.bookingsCount || 0} Bookings</span> · 
                    <span>{usr.tripsPlanned || 0} Trips</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard-page {
          padding: 1.8rem 2.2rem;
        }

        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1.2rem;
        }

        .admin-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 0.4rem;
        }

        .admin-page-header h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0 0 0.3rem;
        }

        .admin-page-header p {
          color: #64748B;
          font-size: 0.92rem;
          margin: 0;
        }

        .admin-header-actions {
          display: flex;
          gap: 0.8rem;
          align-items: center;
        }

        .admin-kpi-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.2rem;
          margin-bottom: 2rem;
        }

        .admin-kpi-card {
          background: white;
          border-radius: 16px;
          padding: 1.4rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }

        .kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;
        }

        .kpi-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748B;
          letter-spacing: 0.5px;
        }

        .kpi-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .bg-blue { background: #2563EB; }
        .bg-green { background: #159B75; }
        .bg-purple { background: #7C3AED; }
        .bg-orange { background: #FF9B54; }
        .bg-emerald { background: #059669; }

        .kpi-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--color-navy);
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .kpi-growth {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .charts-split-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .admin-chart-card, .admin-share-card {
          background: white;
          border-radius: 18px;
          padding: 1.6rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .chart-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0 0 0.2rem;
        }

        .chart-header p {
          color: #64748B;
          font-size: 0.82rem;
          margin: 0;
        }

        .chart-filter-select {
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.35rem 0.7rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-navy);
          outline: none;
        }

        .css-bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 0.8rem;
          height: 240px;
          padding-top: 2rem;
          border-bottom: 1px solid #E2E8F0;
        }

        .bar-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
          cursor: pointer;
        }

        .bar-track {
          width: 100%;
          max-width: 38px;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .bar-fill {
          width: 100%;
          background: linear-gradient(180deg, var(--color-green) 0%, #0D694E 100%);
          border-radius: 6px 6px 0 0;
          position: relative;
          transition: height 0.3s ease;
        }

        .bar-fill:hover {
          background: linear-gradient(180deg, var(--color-orange) 0%, #D97706 100%);
        }

        .bar-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-navy);
          color: white;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          white-space: nowrap;
          margin-bottom: 4px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }

        .bar-column:hover .bar-tooltip {
          opacity: 1;
        }

        .bar-month {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #64748B;
          font-weight: 600;
        }

        .transport-share-list {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .share-label {
          font-size: 0.85rem;
          color: var(--color-navy);
        }

        .share-percent {
          font-size: 0.82rem;
          color: #64748B;
        }

        .progress-track {
          height: 8px;
          background: #F1F5F9;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
        }

        .share-insights-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 0.9rem;
          display: flex;
          gap: 0.6rem;
          align-items: flex-start;
          font-size: 0.82rem;
          color: #475569;
        }

        .tables-split-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr;
          gap: 1.5rem;
        }

        .admin-table-card {
          background: white;
          border-radius: 18px;
          padding: 1.5rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }

        .table-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .table-card-head h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0;
        }

        .view-more-link {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-green);
        }

        .admin-mini-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.84rem;
        }

        .admin-mini-table th {
          background: #F8FAFC;
          padding: 0.7rem 0.9rem;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
        }

        .admin-mini-table td {
          padding: 0.8rem 0.9rem;
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

        .users-list-stack {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .user-row-item {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.75rem;
          border-radius: 12px;
          border: 1px solid #F1F5F9;
        }

        .user-avatar-pill {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--color-navy);
          color: white;
          font-size: 0.85rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-meta-info {
          flex-grow: 1;
        }

        .user-email-text {
          display: block;
          font-size: 0.78rem;
          color: #64748B;
        }

        .user-sub-stats {
          font-size: 0.72rem;
          color: #94A3B8;
          margin-top: 0.2rem;
        }

        @media (max-width: 1200px) {
          .admin-kpi-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .charts-split-grid, .tables-split-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .admin-dashboard-page {
            padding: 1.2rem;
          }

          .admin-kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
