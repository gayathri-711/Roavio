import React, { useState } from "react";
import { 
  Settings, 
  ShieldCheck, 
  Key, 
  Database, 
  RefreshCw, 
  Globe, 
  CheckCircle2, 
  Sliders 
} from "lucide-react";

export default function AdminSettings() {
  const [platformName, setPlatformName] = useState("ROAVIO");
  const [tagline, setTagline] = useState("Discover India. Plan Your Journey. Travel Freely.");
  const [currencySymbol, setCurrencySymbol] = useState("₹ (INR)");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm("Reset all demonstration localStorage data (bookings, saved places, custom trips) to initial state?")) {
      localStorage.removeItem("roavio_saved_destinations");
      localStorage.removeItem("roavio_planned_trips");
      localStorage.removeItem("roavio_bookings");
      window.location.reload();
    }
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-page-header">
        <div>
          <h1>Platform Configuration & Integrations</h1>
          <p>Manage brand identity parameters, API connection credentials, and demonstration storage controls.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* General Settings */}
        <div className="settings-card">
          <div className="card-head">
            <Sliders size={18} className="text-navy" />
            <h3>Brand & Platform Parameters</h3>
          </div>

          <form onSubmit={handleSaveSettings} className="settings-form">
            <div className="form-group">
              <label>Platform Name</label>
              <input 
                type="text" 
                value={platformName} 
                onChange={(e) => setPlatformName(e.target.value)}
                className="roavio-input" 
              />
            </div>

            <div className="form-group">
              <label>Official Tagline</label>
              <input 
                type="text" 
                value={tagline} 
                onChange={(e) => setTagline(e.target.value)}
                className="roavio-input" 
              />
            </div>

            <div className="form-group">
              <label>Default Currency</label>
              <select 
                value={currencySymbol} 
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="roavio-select"
              >
                <option value="₹ (INR)">₹ (Indian Rupee - INR)</option>
                <option value="$ (USD)">$ (United States Dollar - USD)</option>
                <option value="€ (EUR)">€ (Euro - EUR)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              {savedSuccess ? "✓ Settings Saved" : "Save Brand Settings"}
            </button>
          </form>
        </div>

        {/* API Integrations Status */}
        <div className="settings-card">
          <div className="card-head">
            <Key size={18} className="text-orange" />
            <h3>External API Connectivity Architecture</h3>
          </div>

          <p className="settings-help">
            The platform is engineered with clean integration interfaces ready for authorized service provider APIs:
          </p>

          <div className="api-integrations-stack">
            <div className="api-item">
              <div className="api-info">
                <strong>Google Maps Platform / Mappls</strong>
                <span>Geocoding, route polylines, and transit durations</span>
              </div>
              <span className="badge badge-green">Ready (Leaflet Demo Active)</span>
            </div>

            <div className="api-item">
              <div className="api-info">
                <strong>Indian Railways IRCTC Partner API</strong>
                <span>Live PNR status & seat availability sync</span>
              </div>
              <span className="badge badge-navy">Stage 2 API Hook Ready</span>
            </div>

            <div className="api-item">
              <div className="api-info">
                <strong>Domestic Airline GDS (IndiGo / Air India)</strong>
                <span>Real-time flight schedule & tariff engine</span>
              </div>
              <span className="badge badge-navy">Stage 2 API Hook Ready</span>
            </div>

            <div className="api-item">
              <div className="api-info">
                <strong>Intercity Bus Aggregator API</strong>
                <span>Live luxury coach berth layouts & operator GPS</span>
              </div>
              <span className="badge badge-green">Demo Layout Active</span>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-card full-width">
          <div className="card-head">
            <Database size={18} className="text-red" />
            <h3>Demonstration Storage & Cache Management</h3>
          </div>

          <div className="flex-between flex-wrap gap-4 align-center">
            <div>
              <p className="mb-1">
                Roavio currently operates in <strong>FRONTEND FIRST</strong> demonstration mode using high-fidelity local datasets and browser localStorage.
              </p>
              <span className="text-muted text-sm">
                To reset any test bookings or custom itineraries back to their default demo states, click below.
              </span>
            </div>

            <button onClick={handleResetData} className="btn btn-outline flex-center gap-2">
              <RefreshCw size={16} /> Reset Demo LocalStorage Data
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .admin-settings-page {
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

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.8rem;
        }

        .settings-card {
          background: white;
          border-radius: 18px;
          padding: 1.8rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
        }

        .settings-card.full-width {
          grid-column: 1 / -1;
        }

        .card-head {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.4rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .card-head h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .settings-help {
          font-size: 0.88rem;
          color: #64748B;
          margin-bottom: 1.2rem;
        }

        .api-integrations-stack {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .api-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1px solid #F1F5F9;
          background: #F8FAFC;
        }

        .api-info strong {
          display: block;
          font-size: 0.9rem;
          color: var(--color-navy);
        }

        .api-info span {
          display: block;
          font-size: 0.76rem;
          color: #64748B;
        }

        @media (max-width: 992px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
