import React, { useState } from "react";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  MapPin, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { 
  MONTHLY_BOOKINGS_DATA, 
  TRANSPORT_CATEGORY_SPLIT,
  ADMIN_STATS 
} from "../../data/adminData";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("monthly");

  const popularStatesDemand = [
    { state: "Rajasthan", share: "22%", volume: "4,160 Trips", revenue: "₹1.06 Cr" },
    { state: "Kerala", share: "18%", volume: "3,405 Trips", revenue: "₹86.8 Lakhs" },
    { state: "Himachal Pradesh", share: "15%", volume: "2,835 Trips", revenue: "₹72.3 Lakhs" },
    { state: "Goa", share: "14%", volume: "2,650 Trips", revenue: "₹67.5 Lakhs" },
    { state: "Jammu & Kashmir", share: "11%", volume: "2,080 Trips", revenue: "₹53.0 Lakhs" },
    { state: "Uttarakhand", share: "10%", volume: "1,890 Trips", revenue: "₹48.2 Lakhs" },
    { state: "Tamil Nadu & Others", share: "10%", volume: "1,890 Trips", revenue: "₹48.2 Lakhs" }
  ];

  const handleExportCSV = () => {
    alert("Roavio Analytics CSV report generation demonstration completed. File downloaded.");
  };

  return (
    <div className="admin-reports-page">
      <div className="admin-page-header">
        <div>
          <h1>Platform Intelligence & Reports</h1>
          <p>Audited analytics, seasonal travel demand forecasting, and gross ticket revenue trends.</p>
        </div>

        <button onClick={handleExportCSV} className="btn btn-primary flex-center gap-2">
          <Download size={16} /> Export CSV Report
        </button>
      </div>

      {/* KPI Overview Strip */}
      <div className="reports-kpi-strip">
        <div className="r-kpi-item">
          <span className="r-kpi-label">Fiscal Year Bookings</span>
          <strong className="r-kpi-val">{ADMIN_STATS.totalBookings.toLocaleString()}</strong>
          <span className="text-green text-sm flex-center gap-1">
            <ArrowUpRight size={14} /> +18.8% growth
          </span>
        </div>

        <div className="r-kpi-item">
          <span className="r-kpi-label">Annualized Gross Volume</span>
          <strong className="r-kpi-val">₹4,82,50,000</strong>
          <span className="text-green text-sm flex-center gap-1">
            <ArrowUpRight size={14} /> +16.4% growth
          </span>
        </div>

        <div className="r-kpi-item">
          <span className="r-kpi-label">Avg. Itinerary Budget</span>
          <strong className="r-kpi-val">₹33,760 / Trip</strong>
          <span className="text-muted text-sm">Domestic average</span>
        </div>

        <div className="r-kpi-item">
          <span className="r-kpi-label">Active Itinerary Planners</span>
          <strong className="r-kpi-val">{ADMIN_STATS.totalPlannedTrips.toLocaleString()}</strong>
          <span className="text-green text-sm flex-center gap-1">
            <ArrowUpRight size={14} /> +22.5% this month
          </span>
        </div>
      </div>

      {/* Report Cards Split */}
      <div className="reports-grid">
        {/* Monthly Breakdown Table */}
        <div className="report-card">
          <div className="report-card-head">
            <h3>Monthly Performance Telemetry (FY 2026)</h3>
          </div>

          <table className="roavio-admin-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Confirmed Bookings</th>
                <th>Gross Revenue</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {MONTHLY_BOOKINGS_DATA.map((row) => (
                <tr key={row.month}>
                  <td><strong>{row.month} 2026</strong></td>
                  <td>{row.bookings.toLocaleString()} tickets</td>
                  <td className="font-bold text-green">₹{(row.revenue / 100000).toFixed(2)} Lakhs</td>
                  <td>
                    <span className="badge badge-green">Healthy Growth</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* State-Wise Demand & Transit Share */}
        <div className="reports-side-stack">
          {/* State Demand Ranking */}
          <div className="report-card">
            <div className="report-card-head">
              <h3>Top Destination Demand by State</h3>
            </div>

            <div className="state-demand-list">
              {popularStatesDemand.map((item, idx) => (
                <div key={item.state} className="state-demand-row">
                  <div className="state-rank">{idx + 1}</div>
                  <div className="state-info">
                    <strong>{item.state}</strong>
                    <span className="text-muted text-sm">{item.volume} · {item.revenue}</span>
                  </div>
                  <div className="state-share-pill font-bold text-navy">{item.share}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Transport Split */}
          <div className="report-card">
            <div className="report-card-head">
              <h3>Passenger Mode Distribution</h3>
            </div>

            <div className="transport-share-list">
              {TRANSPORT_CATEGORY_SPLIT.map((item) => (
                <div key={item.name} className="share-row">
                  <div className="flex-between mb-1">
                    <span className="share-label font-semibold">{item.name}</span>
                    <span className="share-percent font-bold">{item.percentage}%</span>
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
          </div>
        </div>
      </div>

      <style>{`
        .admin-reports-page {
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

        .reports-kpi-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.2rem;
          margin-bottom: 2rem;
        }

        .r-kpi-item {
          background: white;
          border-radius: 16px;
          padding: 1.3rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
        }

        .r-kpi-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
        }

        .r-kpi-val {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0.3rem 0;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 1.8rem;
        }

        .report-card {
          background: white;
          border-radius: 18px;
          padding: 1.6rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
          margin-bottom: 1.5rem;
        }

        .report-card-head {
          margin-bottom: 1.2rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .report-card-head h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0;
        }

        .state-demand-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .state-demand-row {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.6rem;
          border-radius: 10px;
          border: 1px solid #F1F5F9;
        }

        .state-rank {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-navy);
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .state-info {
          flex-grow: 1;
        }

        .state-info strong {
          display: block;
          color: var(--color-navy);
          font-size: 0.9rem;
        }

        .state-share-pill {
          background: #F1F5F9;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        @media (max-width: 992px) {
          .reports-kpi-strip {
            grid-template-columns: 1fr 1fr;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
