import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Compass, 
  LayoutDashboard, 
  MapPin, 
  Users, 
  TicketCheck, 
  BarChart3, 
  Settings, 
  ArrowLeft,
  Shield,
  Layers,
  CalendarDays,
  Bell
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "Overview Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Destinations (175+)", path: "/admin/destinations", icon: MapPin },
    { name: "Users Management", path: "/admin/users", icon: Users },
    { name: "Bookings & Tickets", path: "/admin/bookings", icon: TicketCheck },
    { name: "Notification Logs", path: "/admin/notifications", icon: Bell },
    { name: "Reports & Analytics", path: "/admin/reports", icon: BarChart3 },
    { name: "Platform Settings", path: "/admin/settings", icon: Settings }
  ];

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="roavio-admin-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <Link to="/" className="sidebar-brand">
          <div className="admin-badge">
            <Compass size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-name">ROAVIO</span>
            <span className="brand-tag">ADMIN PORTAL</span>
          </div>
        </Link>
      </div>

      {/* Security Status Banner */}
      <div className="security-status-box">
        <Shield size={14} className="shield-icon" />
        <span>Secure Demonstration Workspace</span>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <span className="nav-group-label">Management Modules</span>
        <ul className="sidebar-menu">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <li key={link.path}>
                <Link to={link.path} className={`sidebar-link ${active ? "active" : ""}`}>
                  <Icon size={18} className="link-icon" />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="sidebar-footer">
        <Link to="/" className="back-site-btn">
          <ArrowLeft size={16} />
          <span>Exit to Main Website</span>
        </Link>
        <div className="admin-user-pill">
          <div className="admin-avatar">AD</div>
          <div className="admin-meta">
            <span className="admin-name">Administrator</span>
            <span className="admin-role">Platform Monitor</span>
          </div>
        </div>
      </div>

      <style>{`
        .roavio-admin-sidebar {
          width: 270px;
          background: #0B192A;
          color: #94A3B8;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding: 24px 16px;
          flex-shrink: 0;
        }

        .sidebar-brand-box {
          margin-bottom: 20px;
          padding-left: 8px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .admin-badge {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--travel-green);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          color: white;
          font-size: 1.35rem;
          font-weight: 800;
          font-family: var(--font-heading);
          line-height: 1;
        }

        .brand-tag {
          color: var(--accent-orange);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          margin-top: 3px;
        }

        .security-status-box {
          background: rgba(21, 155, 117, 0.1);
          border: 1px solid rgba(21, 155, 117, 0.25);
          color: #6EE7B7;
          border-radius: var(--radius-sm);
          padding: 6px 10px;
          font-size: 0.74rem;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
        }

        .shield-icon {
          flex-shrink: 0;
        }

        .sidebar-nav {
          flex-grow: 1;
        }

        .nav-group-label {
          display: block;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: #64748B;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
          padding-left: 10px;
        }

        .sidebar-menu {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          color: #94A3B8;
          font-size: 0.92rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .sidebar-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.06);
        }

        .sidebar-link.active {
          color: white;
          background: var(--travel-green);
          font-weight: 700;
        }

        .link-icon {
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .back-site-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #E2E8F0;
          font-size: 0.88rem;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.2s ease;
        }

        .back-site-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: white;
        }

        .admin-user-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: var(--radius-md);
        }

        .admin-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-orange);
          color: white;
          font-weight: 800;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-meta {
          display: flex;
          flex-direction: column;
        }

        .admin-name {
          color: white;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .admin-role {
          font-size: 0.7rem;
          color: #64748B;
        }
      `}</style>
    </aside>
  );
}
