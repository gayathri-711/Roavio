import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Phone, 
  MapPin, 
  Check, 
  X,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { SAMPLE_USERS } from "../../data/adminData";

// Helper to merge local registered users with default sample users
const getInitialCombinedUsers = () => {
  try {
    const registered = JSON.parse(localStorage.getItem("roavio_registered_users") || "[]");
    const emailMap = new Set();
    const result = [];

    // Registered or logged-in users first
    registered.forEach((u) => {
      const email = (u.email || "").toLowerCase();
      if (email && !emailMap.has(email)) {
        emailMap.add(email);
        result.push({
          id: u.id || `usr-${Date.now().toString().slice(-4)}`,
          name: u.name || u.fullName || "Traveler",
          email: u.email,
          phone: u.phone || u.mobileNumber || "+91 98765 43210",
          city: u.city || "New Delhi",
          role: u.role || (email.includes("admin") ? "Administrator" : "Traveler"),
          status: u.status || "Active",
          kycStatus: u.kycStatus || "Verified",
          bookingsCount: u.bookingsCount || 0,
          tripsPlanned: u.tripsPlanned || 0,
          joined: u.registeredAt ? new Date(u.registeredAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Nov 2026",
          isLiveUser: true
        });
      }
    });

    // Then sample seed users
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

export default function AdminUsers() {
  const [usersList, setUsersList] = useState(() => getInitialCombinedUsers());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  const refreshUsers = () => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data?.users && Array.isArray(data.users)) {
          setUsersList(() => {
            const emailMap = new Set();
            const merged = [];

            // 1. Backend persistent database users
            data.users.forEach((u) => {
              const email = (u.email || "").toLowerCase();
              if (email && !emailMap.has(email)) {
                emailMap.add(email);
                merged.push({
                  id: u.id,
                  name: u.fullName || u.name || "Traveler",
                  email: u.email,
                  phone: u.mobileNumber || u.phone || "+91 98765 43210",
                  city: u.city || "New Delhi",
                  role: u.role || (email.includes("admin") ? "Administrator" : "Traveler"),
                  status: u.status || "Active",
                  kycStatus: u.kycStatus || (u.mobileVerified ? "Verified" : "Pending"),
                  bookingsCount: u.bookingsCount || 0,
                  tripsPlanned: u.tripsPlanned || 0,
                  joined: u.createdAt || u.registeredAt ? new Date(u.createdAt || u.registeredAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Nov 2026",
                  isLiveUser: true
                });
              }
            });

            // 2. Client local storage registered users
            try {
              const registered = JSON.parse(localStorage.getItem("roavio_registered_users") || "[]");
              registered.forEach((u) => {
                const email = (u.email || "").toLowerCase();
                if (email && !emailMap.has(email)) {
                  emailMap.add(email);
                  merged.push({
                    id: u.id || ("usr-" + Date.now().toString().slice(-4)),
                    name: u.name || u.fullName || "Traveler",
                    email: u.email,
                    phone: u.phone || u.mobileNumber || "+91 98765 43210",
                    city: u.city || "New Delhi",
                    role: u.role || (email.includes("admin") ? "Administrator" : "Traveler"),
                    status: u.status || "Active",
                    kycStatus: u.kycStatus || "Verified",
                    bookingsCount: u.bookingsCount || 0,
                    tripsPlanned: u.tripsPlanned || 0,
                    joined: u.registeredAt ? new Date(u.registeredAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Nov 2026",
                    isLiveUser: true
                  });
                }
              });
            } catch (e) {}

            // 3. Fallback sample seed users
            SAMPLE_USERS.forEach((u) => {
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
  };

  // Sync with backend API on mount & live periodic polling + real-time BroadcastChannel
  useEffect(() => {
    refreshUsers();

    // 1. Live server polling every 2.5s for seamless multi-page/multi-device synchronization
    const pollTimer = setInterval(refreshUsers, 2500);

    // 2. Real-time instant BroadcastChannel for cross-tab synchronization in the same browser (0ms)
    let channel = null;
    try {
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        channel = new BroadcastChannel("roavio_platform_sync");
        channel.onmessage = (e) => {
          if (e.data?.type === "USER_REGISTERED" || e.data?.type === "USER_LOGGED_IN" || e.data?.type === "BOOKING_CREATED") {
            refreshUsers();
          }
        };
      }
    } catch (e) {}

    // 3. Storage event for cross-window / tab changes
    const onStorage = (e) => {
      if (e.key === "roavio_registered_users" || e.key === "roavio_user") {
        refreshUsers();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      clearInterval(pollTimer);
      if (channel) channel.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const filtered = useMemo(() => {
    return usersList.filter((u) => {
      if (statusFilter !== "All" && u.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [usersList, search, statusFilter]);

  const toggleUserStatus = (id) => {
    setUsersList((prev) => {
      const next = prev.map((u) => {
        if (u.id === id) {
          const updated = {
            ...u,
            status: u.status === "Active" ? "Suspended" : "Active"
          };
          // Persist back to local storage if it's a registered user
          try {
            const registered = JSON.parse(localStorage.getItem("roavio_registered_users") || "[]");
            const regIdx = registered.findIndex((r) => r.email?.toLowerCase() === u.email?.toLowerCase());
            if (regIdx >= 0) {
              registered[regIdx].status = updated.status;
              localStorage.setItem("roavio_registered_users", JSON.stringify(registered));
            }
          } catch (e) {}
          return updated;
        }
        return u;
      });
      return next;
    });
  };

  return (
    <div className="admin-users-page">
      <div className="admin-page-header">
        <div>
          <h1>User Accounts Management ({usersList.length})</h1>
          <p>Monitor registered travelers, verify identity profiles, and manage access privileges.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="search-box">
          <Search size={16} className="text-gray" />
          <input 
            type="text" 
            placeholder="Search by name, email, or city..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <div className="filter-dropdowns">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Users</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <table className="roavio-admin-table">
          <thead>
            <tr>
              <th>Traveler Profile</th>
              <th>Contact Details</th>
              <th>City / Base</th>
              <th>Role</th>
              <th>Trips & Bookings</th>
              <th>KYC Status</th>
              <th>Account Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((usr) => (
              <tr key={usr.id}>
                <td>
                  <div className="user-profile-flex">
                    <div className="table-avatar">
                      {(usr.name || "TR").split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2) || "TR"}
                    </div>
                    <div>
                      <strong className="user-name-text">{usr.name}</strong>
                      <span className="user-id-text">ID: {usr.id}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-text-box">
                    <span>{usr.email}</span>
                    <span className="text-muted">{usr.phone}</span>
                  </div>
                </td>
                <td>{usr.city}</td>
                <td>
                  <span className="badge badge-navy">{usr.role}</span>
                </td>
                <td>
                  <strong>{usr.bookingsCount}</strong> Bookings · <strong>{usr.tripsPlanned}</strong> Trips
                </td>
                <td>
                  {usr.kycVerified ? (
                    <span className="kyc-pill verified">
                      <ShieldCheck size={13} /> Verified
                    </span>
                  ) : (
                    <span className="kyc-pill pending">
                      <ShieldAlert size={13} /> Pending
                    </span>
                  )}
                </td>
                <td>
                  <span className={`status-pill ${usr.status.toLowerCase()}`}>
                    {usr.status}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => toggleUserStatus(usr.id)}
                    className={`btn btn-sm ${usr.status === "Active" ? "btn-outline-danger" : "btn-outline-success"}`}
                  >
                    {usr.status === "Active" ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-users-page {
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

        .user-profile-flex {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .table-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--color-navy);
          color: white;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name-text {
          display: block;
          color: var(--color-navy);
        }

        .user-id-text {
          font-size: 0.72rem;
          color: #94A3B8;
        }

        .contact-text-box {
          display: flex;
          flex-direction: column;
          font-size: 0.82rem;
        }

        .kyc-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }

        .kyc-pill.verified {
          background: #DCFCE7;
          color: #15803D;
        }

        .kyc-pill.pending {
          background: #FEF3C7;
          color: #B45309;
        }

        .btn-outline-danger {
          border: 1px solid #FECACA;
          background: transparent;
          color: #DC2626;
          border-radius: 6px;
          padding: 0.25rem 0.65rem;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-outline-danger:hover {
          background: #FEF2F2;
        }

        .btn-outline-success {
          border: 1px solid #BBF7D0;
          background: transparent;
          color: #16A34A;
          border-radius: 6px;
          padding: 0.25rem 0.65rem;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-outline-success:hover {
          background: #F0FDF4;
        }
      `}</style>
    </div>
  );
}
