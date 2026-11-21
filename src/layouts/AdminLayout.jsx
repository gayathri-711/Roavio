import React from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Bell, Search, ExternalLink, Globe } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="admin-app-layout">
      <Sidebar />
      <div className="admin-main-container">
        {/* Admin Topbar */}
        <header className="admin-topbar">
          <div className="topbar-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search destinations, users, PNRs or analytics..." 
              className="topbar-input" 
            />
          </div>

          <div className="topbar-actions">
            <Link to="/" className="topbar-link-btn" target="_blank" title="Preview Public Website">
              <Globe size={16} />
              <span>Live Site</span>
              <ExternalLink size={12} />
            </Link>

            <button className="notif-btn" title="System Notifications">
              <Bell size={18} />
              <span className="notif-badge">3</span>
            </button>
          </div>
        </header>

        {/* Dynamic Admin Page Outlet */}
        <div className="admin-page-content">
          <Outlet />
        </div>
      </div>

      <style>{`
        .admin-app-layout {
          display: flex;
          min-height: 100vh;
          background-color: #F8FAFC;
        }

        .admin-main-container {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .admin-topbar {
          height: 68px;
          background: white;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .topbar-search {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F1F5F9;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          width: 380px;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .topbar-input {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.88rem;
          color: var(--primary-navy);
          width: 100%;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .topbar-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: var(--travel-green-light);
          color: var(--travel-green-dark);
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .topbar-link-btn:hover {
          background: var(--travel-green);
          color: white;
        }

        .notif-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: white;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .notif-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--danger);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-page-content {
          padding: 32px;
          flex-grow: 1;
        }

        @media (max-width: 900px) {
          .topbar-search {
            width: 220px;
          }
          .admin-page-content {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
}
