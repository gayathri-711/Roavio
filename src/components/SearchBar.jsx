import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Plane, 
  Train, 
  Bus,
  ArrowRightLeft
} from "lucide-react";
import { STATES } from "../data/states";

export default function SearchBar({ defaultTab = "explore" }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [source, setSource] = useState("New Delhi");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toISOString().split("T")[0];
  });
  const [travelers, setTravelers] = useState("2 Travelers");

  const handleSwap = () => {
    const temp = source;
    setSource(destination || "Goa");
    setDestination(temp);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === "explore") {
      const params = new URLSearchParams();
      if (destination) params.set("q", destination);
      navigate(`/explore?${params.toString()}`);
    } else if (activeTab === "flights") {
      const params = new URLSearchParams();
      params.set("from", source);
      if (destination) params.set("to", destination);
      params.set("date", travelDate);
      navigate(`/flights?${params.toString()}`);
    } else if (activeTab === "trains") {
      const params = new URLSearchParams();
      params.set("from", source);
      if (destination) params.set("to", destination);
      params.set("date", travelDate);
      navigate(`/trains?${params.toString()}`);
    } else if (activeTab === "buses") {
      const params = new URLSearchParams();
      params.set("from", source);
      if (destination) params.set("to", destination);
      params.set("date", travelDate);
      navigate(`/buses?${params.toString()}`);
    }
  };

  return (
    <div className="roavio-search-widget">
      {/* Search Category Tabs */}
      <div className="search-tabs-row">
        <button
          type="button"
          className={`search-tab-btn ${activeTab === "explore" ? "active" : ""}`}
          onClick={() => setActiveTab("explore")}
        >
          <Compass size={18} />
          <span>Explore Destinations</span>
        </button>
        <button
          type="button"
          className={`search-tab-btn ${activeTab === "flights" ? "active" : ""}`}
          onClick={() => setActiveTab("flights")}
        >
          <Plane size={18} />
          <span>Flights</span>
        </button>
        <button
          type="button"
          className={`search-tab-btn ${activeTab === "trains" ? "active" : ""}`}
          onClick={() => setActiveTab("trains")}
        >
          <Train size={18} />
          <span>Trains</span>
        </button>
        <button
          type="button"
          className={`search-tab-btn ${activeTab === "buses" ? "active" : ""}`}
          onClick={() => setActiveTab("buses")}
        >
          <Bus size={18} />
          <span>Buses</span>
        </button>
      </div>

      {/* Main Search Inputs Grid */}
      <form onSubmit={handleSearch} className="search-form-card">
        <div className="search-fields-grid">
          {/* Starting Location */}
          <div className="search-field">
            <label className="field-label">
              <MapPin size={14} className="text-muted" />
              <span>Starting Location</span>
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. New Delhi, Mumbai, Bengaluru"
              className="field-input"
            />
            <span className="field-sub">Where are you starting from?</span>
          </div>

          {/* Swap Button for transport */}
          {activeTab !== "explore" && (
            <button
              type="button"
              className="swap-loc-btn"
              onClick={handleSwap}
              title="Swap Locations"
            >
              <ArrowRightLeft size={16} />
            </button>
          )}

          {/* Destination */}
          <div className="search-field">
            <label className="field-label">
              <Compass size={14} className="text-green" />
              <span>Destination / State</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Taj Mahal, Munnar, Goa, Kerala"
              className="field-input"
            />
            <span className="field-sub">Select city, landmark or state</span>
          </div>

          {/* Travel Date */}
          <div className="search-field">
            <label className="field-label">
              <Calendar size={14} className="text-muted" />
              <span>Travel Date</span>
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="field-input date-input"
            />
            <span className="field-sub">Approximate departure</span>
          </div>

          {/* Number of Travelers */}
          <div className="search-field">
            <label className="field-label">
              <Users size={14} className="text-muted" />
              <span>Travelers</span>
            </label>
            <select
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="field-input select-input"
            >
              <option value="1 Solo Traveler">1 Solo Traveler</option>
              <option value="2 Travelers">2 Travelers (Couple/Friends)</option>
              <option value="Family (3-5 Travelers)">Family (3-5 Travelers)</option>
              <option value="Group (6+ Travelers)">Group Tour (6+ Travelers)</option>
            </select>
            <span className="field-sub">Class / Party Size</span>
          </div>

          {/* Submit Search Button */}
          <div className="search-btn-wrap">
            <button type="submit" className="search-submit-btn">
              <Search size={20} />
              <span>Search {activeTab === "explore" ? "Places" : activeTab}</span>
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .roavio-search-widget {
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
        }

        .search-tabs-row {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(20, 43, 69, 0.7);
          backdrop-filter: blur(12px);
          padding: 6px 8px;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          width: fit-content;
        }

        .search-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: transparent;
          color: #E2E8F0;
          border: none;
          font-weight: 600;
          font-size: 0.92rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .search-tab-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .search-tab-btn.active {
          background: var(--white);
          color: var(--primary-navy);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .search-form-card {
          background: var(--white);
          border-radius: 0 var(--radius-xl) var(--radius-xl) var(--radius-xl);
          padding: 24px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .search-fields-grid {
          display: grid;
          grid-template-columns: 1.2fr 1.3fr 1fr 1fr auto;
          gap: 16px;
          align-items: center;
          position: relative;
        }

        .search-field {
          background: #F8FAFC;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          transition: all 0.2s ease;
        }

        .search-field:focus-within {
          background: white;
          border-color: var(--travel-green);
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.15);
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .field-input {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--primary-navy);
          width: 100%;
        }

        .date-input {
          font-weight: 600;
          color: var(--text-main);
        }

        .select-input {
          cursor: pointer;
        }

        .field-sub {
          font-size: 0.72rem;
          color: var(--text-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .swap-loc-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: white;
          color: var(--primary-navy);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: absolute;
          left: 23%;
          z-index: 5;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s ease;
        }

        .swap-loc-btn:hover {
          background: var(--travel-green-light);
          color: var(--travel-green);
          transform: rotate(180deg);
        }

        .search-btn-wrap {
          display: flex;
          align-items: center;
          height: 100%;
        }

        .search-submit-btn {
          height: 100%;
          min-height: 64px;
          padding: 0 28px;
          background: var(--travel-green);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 6px 18px rgba(21, 155, 117, 0.35);
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .search-submit-btn:hover {
          background: var(--travel-green-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(21, 155, 117, 0.45);
        }

        @media (max-width: 1024px) {
          .search-fields-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .search-btn-wrap {
            grid-column: span 2;
          }
          .search-submit-btn {
            width: 100%;
            justify-content: center;
          }
          .swap-loc-btn {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .search-tabs-row {
            width: 100%;
            overflow-x: auto;
          }
          .search-tab-btn {
            padding: 8px 12px;
            font-size: 0.82rem;
            white-space: nowrap;
          }
          .search-fields-grid {
            grid-template-columns: 1fr;
          }
          .search-btn-wrap {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
