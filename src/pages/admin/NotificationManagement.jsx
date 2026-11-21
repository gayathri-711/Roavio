import React, { useState, useEffect } from "react";
import { 
  Bell, 
  MessageSquare, 
  Phone, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Filter, 
  Search,
  ExternalLink,
  ChevronRight,
  Send,
  Check
} from "lucide-react";

export default function NotificationManagement() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [retryingId, setRetryingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchLogs = () => {
    setLoading(true);
    fetch(`/api/admin/notifications?channel=${channelFilter}`)
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load notification logs:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, [channelFilter]);

  const handleRetry = (logId) => {
    setRetryingId(logId);
    fetch(`/api/admin/notifications/retry/${logId}`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setRetryingId(null);
        if (data.success) {
          setToastMessage(`Retry request sent for ${logId}. Provider status updated.`);
          fetchLogs();
        } else {
          setToastMessage(`Retry failed: ${data.error}`);
        }
        setTimeout(() => setToastMessage(null), 3500);
      })
      .catch(err => {
        setRetryingId(null);
        setToastMessage(`Error retrying notification: ${err.message}`);
        setTimeout(() => setToastMessage(null), 3500);
      });
  };

  const filteredLogs = logs.filter(log => {
    if (statusFilter !== "all") {
      if (statusFilter === "delivered" && !log.providerStatus.toLowerCase().includes("delivered")) return false;
      if (statusFilter === "awaiting" && !log.providerStatus.toLowerCase().includes("awaiting")) return false;
      if (statusFilter === "failed" && !log.providerStatus.toLowerCase().includes("failed")) return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.bookingId?.toLowerCase().includes(term) ||
        log.logId?.toLowerCase().includes(term) ||
        log.recipientMobile?.toLowerCase().includes(term) ||
        log.messageSummary?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("delivered") || s.includes("sent")) {
      return (
        <span className="badge badge-success">
          <CheckCircle2 size={12} /> {status}
        </span>
      );
    }
    if (s.includes("awaiting")) {
      return (
        <span className="badge badge-warning" title={status}>
          <Clock size={12} /> Awaiting Gateway Config
        </span>
      );
    }
    return (
      <span className="badge badge-danger">
        <AlertCircle size={12} /> {status}
      </span>
    );
  };

  // Metrics summary
  const totalSms = logs.filter(l => l.channel === "SMS").length;
  const totalWa = logs.filter(l => l.channel === "WhatsApp").length;
  const totalAwaiting = logs.filter(l => l.providerStatus?.toLowerCase().includes("awaiting")).length;
  const totalDelivered = logs.filter(l => l.providerStatus?.toLowerCase().includes("delivered")).length;

  return (
    <div className="notif-admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-title">Notification Gateway Management</h1>
          <p className="admin-subtitle">
            Monitor real-time SMS and WhatsApp Business Cloud API ticket dispatches, delivery statuses, and gateway provider responses.
          </p>
        </div>
        <button onClick={fetchLogs} className="btn btn-outline btn-sm">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Logs
        </button>
      </div>

      {/* Security Banner */}
      <div className="security-notice-banner">
        <ShieldAlert size={16} className="text-orange" />
        <span>
          <strong>Backend Security Notice:</strong> Gateway credentials (<code>SMS_API_KEY</code>, <code>WHATSAPP_ACCESS_TOKEN</code>) are stored securely in backend server environment variables. Sensitive authentication secrets are never exposed to the frontend or administration UI.
        </span>
      </div>

      {toastMessage && (
        <div className="admin-toast-alert">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="notif-stats-grid">
        <div className="notif-stat-card">
          <div className="stat-icon-wrap bg-blue-light text-blue">
            <Phone size={20} />
          </div>
          <div>
            <span className="stat-label">Total SMS Logs</span>
            <h3 className="stat-num">{totalSms}</h3>
          </div>
        </div>

        <div className="notif-stat-card">
          <div className="stat-icon-wrap bg-green-light text-green">
            <MessageSquare size={20} />
          </div>
          <div>
            <span className="stat-label">WhatsApp Logs</span>
            <h3 className="stat-num">{totalWa}</h3>
          </div>
        </div>

        <div className="notif-stat-card">
          <div className="stat-icon-wrap bg-amber-light text-amber">
            <Clock size={20} />
          </div>
          <div>
            <span className="stat-label">Awaiting Gateway Keys</span>
            <h3 className="stat-num">{totalAwaiting}</h3>
          </div>
        </div>

        <div className="notif-stat-card">
          <div className="stat-icon-wrap bg-emerald-light text-emerald">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="stat-label">Delivered Dispatches</span>
            <h3 className="stat-num">{totalDelivered}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-filter-bar">
        <div className="filter-controls-group">
          {/* Channel Filters */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab-btn ${channelFilter === "all" ? "active" : ""}`}
              onClick={() => setChannelFilter("all")}
            >
              All Channels
            </button>
            <button 
              className={`filter-tab-btn ${channelFilter === "SMS" ? "active" : ""}`}
              onClick={() => setChannelFilter("SMS")}
            >
              SMS Gateway
            </button>
            <button 
              className={`filter-tab-btn ${channelFilter === "WhatsApp" ? "active" : ""}`}
              onClick={() => setChannelFilter("WhatsApp")}
            >
              WhatsApp Cloud API
            </button>
          </div>

          {/* Status Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Delivery Statuses</option>
            <option value="delivered">Delivered / Sent</option>
            <option value="awaiting">Awaiting Configuration</option>
            <option value="failed">Failed / Errors</option>
          </select>
        </div>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search booking ID, log ID, or mobile..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="table-card">
        {loading ? (
          <div className="table-loading-box">
            <RefreshCw size={24} className="animate-spin text-green" />
            <p>Loading notification audit history from Roavio Database...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="table-empty-box">
            <Bell size={36} className="text-muted" />
            <h3>No Notification Records Found</h3>
            <p>No dispatches match the selected filter parameters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Log ID & Time</th>
                  <th>Booking Ref</th>
                  <th>Channel</th>
                  <th>Recipient Mobile</th>
                  <th>Message Summary</th>
                  <th>Gateway Status</th>
                  <th>Provider Response</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.logId}>
                    <td>
                      <div className="log-id-col">
                        <strong className="log-id-text">{log.logId}</strong>
                        <span className="log-time-text">
                          {new Date(log.timestamp).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "short"
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="booking-tag">{log.bookingId}</span>
                    </td>
                    <td>
                      <span className={`channel-pill ${log.channel === "SMS" ? "channel-sms" : "channel-wa"}`}>
                        {log.channel === "SMS" ? <Phone size={12} /> : <MessageSquare size={12} />}
                        <span>{log.channel}</span>
                      </span>
                    </td>
                    <td>
                      <span className="mobile-masked">{log.recipientMobile}</span>
                    </td>
                    <td>
                      <p className="message-snippet" title={log.messageSummary}>
                        {log.messageSummary?.slice(0, 75)}...
                      </p>
                    </td>
                    <td>
                      {getStatusBadge(log.providerStatus)}
                    </td>
                    <td>
                      <code className="provider-code">{log.providerResponse || "N/A"}</code>
                    </td>
                    <td>
                      <button
                        onClick={() => handleRetry(log.logId)}
                        disabled={retryingId === log.logId}
                        className="retry-btn"
                        title="Retry Notification Dispatch"
                      >
                        <RefreshCw size={13} className={retryingId === log.logId ? "animate-spin" : ""} />
                        <span>{retryingId === log.logId ? "Retrying..." : "Retry"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .notif-admin-page {
          padding: 2rem;
          background: #F8FAFC;
          min-height: 100vh;
        }

        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-title {
          font-size: 1.75rem;
          color: #142B45;
          margin-bottom: 0.25rem;
        }

        .admin-subtitle {
          color: #64748B;
          font-size: 0.95rem;
          max-width: 780px;
        }

        .security-notice-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #FFFBF5;
          border: 1px solid #FED7AA;
          border-radius: 10px;
          padding: 0.85rem 1.25rem;
          font-size: 0.86rem;
          color: #9A3412;
          margin-bottom: 1.5rem;
        }

        .admin-toast-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .notif-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .notif-stat-card {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 1.25rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-blue-light { background: #EFF6FF; }
        .text-blue { color: #2563EB; }
        .bg-green-light { background: #ECFDF5; }
        .text-green { color: #159B75; }
        .bg-amber-light { background: #FFFBEB; }
        .text-amber { color: #D97706; }
        .bg-emerald-light { background: #F0FDF4; }
        .text-emerald { color: #16A34A; }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
        }

        .stat-num {
          font-size: 1.45rem;
          color: #142B45;
          margin-top: 2px;
        }

        .table-filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filter-controls-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-tabs {
          display: flex;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 3px;
        }

        .filter-tab-btn {
          border: none;
          background: transparent;
          padding: 0.45rem 0.9rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748B;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-tab-btn.active {
          background: #142B45;
          color: #FFFFFF;
        }

        .filter-select {
          padding: 0.45rem 0.8rem;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          background: white;
          font-size: 0.85rem;
          color: #334155;
        }

        .search-box {
          position: relative;
          min-width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 0.8rem 0.5rem 2rem;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }

        .table-card {
          background: #FFFFFF;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
          text-align: left;
        }

        .admin-table th {
          background: #F8FAFC;
          padding: 0.85rem 1rem;
          color: #475569;
          font-weight: 700;
          border-bottom: 1px solid #E2E8F0;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
        }

        .log-id-col {
          display: flex;
          flex-direction: column;
        }

        .log-id-text {
          font-family: monospace;
          color: #142B45;
          font-size: 0.85rem;
        }

        .log-time-text {
          font-size: 0.72rem;
          color: #94A3B8;
        }

        .booking-tag {
          font-family: monospace;
          background: #F1F5F9;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 700;
          color: #334155;
        }

        .channel-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .channel-sms {
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
        }

        .channel-wa {
          background: #ECFDF5;
          color: #047857;
          border: 1px solid #A7F3D0;
        }

        .mobile-masked {
          font-family: monospace;
          font-size: 0.85rem;
          color: #475569;
        }

        .message-snippet {
          color: #64748B;
          font-size: 0.82rem;
          max-width: 280px;
          line-height: 1.4;
          margin: 0;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .badge-success { background: #ECFDF5; color: #047857; }
        .badge-warning { background: #FFFBEB; color: #B45309; }
        .badge-danger { background: #FEF2F2; color: #DC2626; }

        .provider-code {
          font-size: 0.75rem;
          background: #F1F5F9;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          color: #475569;
        }

        .retry-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          color: #334155;
          padding: 0.35rem 0.7rem;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .retry-btn:hover {
          background: #142B45;
          color: #FFFFFF;
          border-color: #142B45;
        }

        .table-loading-box, .table-empty-box {
          padding: 3.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: #64748B;
        }

        .animate-spin {
          animation: spin 0.9s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .notif-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .notif-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
