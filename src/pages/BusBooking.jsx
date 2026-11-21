import React, { useState, useMemo } from "react";
import { 
  Bus, 
  Calendar, 
  Users, 
  ArrowRightLeft, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sparkles, 
  Info,
  Wifi,
  Zap,
  MapPin
} from "lucide-react";
import { BUSES } from "../data/buses";
import TravelCard from "../components/TravelCard";

export default function BusBooking() {
  const [fromCity, setFromCity] = useState("All");
  const [toCity, setToCity] = useState("All");
  const [operatorFilter, setOperatorFilter] = useState("All");
  const [busTypeFilter, setBusTypeFilter] = useState("All");
  const [searchDate, setSearchDate] = useState("2026-12-06");
  const [sortBy, setSortBy] = useState("price_asc");

  const fromCities = useMemo(() => ["All", ...new Set(BUSES.map((b) => b.fromCity))], []);
  const toCities = useMemo(() => ["All", ...new Set(BUSES.map((b) => b.toCity))], []);
  const operators = useMemo(() => ["All", ...new Set(BUSES.map((b) => b.operator))], []);

  const handleSwap = () => {
    if (fromCity !== "All" && toCity !== "All") {
      const temp = fromCity;
      setFromCity(toCity);
      setToCity(temp);
    }
  };

  const filteredBuses = useMemo(() => {
    return BUSES.filter((bus) => {
      if (fromCity !== "All" && bus.fromCity !== fromCity) return false;
      if (toCity !== "All" && bus.toCity !== toCity) return false;
      if (operatorFilter !== "All" && bus.operator !== operatorFilter) return false;
      if (busTypeFilter === "sleeper" && !bus.busType.toLowerCase().includes("sleeper")) return false;
      if (busTypeFilter === "electric" && !bus.busType.toLowerCase().includes("electric")) return false;
      if (busTypeFilter === "volvo" && !bus.busType.toLowerCase().includes("volvo")) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.fare - b.fare;
      if (sortBy === "price_desc") return b.fare - a.fare;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [fromCity, toCity, operatorFilter, busTypeFilter, sortBy]);

  return (
    <div className="bus-booking-page">
      {/* Search Hero */}
      <section className="bus-hero">
        <div className="container">
          <div className="bus-hero-content">
            <div className="bus-pill">
              <Bus size={15} />
              <span>PREMIUM INTERCITY EXPRESS BUSES</span>
            </div>
            <h1>Book AC Sleeper & Volvo Coaches Across India</h1>
            <p>
              Travel comfortably with verified luxury fleet operators, live seat layout selection, and real-time tracking.
            </p>
          </div>

          <div className="bus-search-card">
            <div className="search-grid-inputs">
              <div className="search-input-box">
                <label>Leaving From (City)</label>
                <div className="input-with-icon">
                  <MapPin size={18} className="field-icon text-orange" />
                  <select 
                    value={fromCity} 
                    onChange={(e) => setFromCity(e.target.value)}
                    className="select-field"
                  >
                    {fromCities.map((c) => (
                      <option key={c} value={c}>
                        {c === "All" ? "All Departure Cities" : c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="swap-btn-wrap">
                <button 
                  type="button" 
                  onClick={handleSwap} 
                  className="swap-btn" 
                  title="Swap Origin and Destination"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              <div className="search-input-box">
                <label>Going To (Destination)</label>
                <div className="input-with-icon">
                  <MapPin size={18} className="field-icon text-green" />
                  <select 
                    value={toCity} 
                    onChange={(e) => setToCity(e.target.value)}
                    className="select-field"
                  >
                    {toCities.map((c) => (
                      <option key={c} value={c}>
                        {c === "All" ? "All Destination Cities" : c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="search-input-box">
                <label>Travel Date</label>
                <div className="input-with-icon">
                  <Calendar size={18} className="field-icon" />
                  <input 
                    type="date" 
                    value={searchDate} 
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="text-input" 
                  />
                </div>
              </div>

              <div className="search-input-box">
                <label>Coach Type</label>
                <div className="input-with-icon">
                  <Bus size={18} className="field-icon" />
                  <select 
                    value={busTypeFilter} 
                    onChange={(e) => setBusTypeFilter(e.target.value)}
                    className="select-field"
                  >
                    <option value="All">All Coach Types</option>
                    <option value="sleeper">AC Sleeper (2+1)</option>
                    <option value="electric">⚡ NueGo Electric AC</option>
                    <option value="volvo">Volvo Multi-Axle</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing Area */}
      <div className="container py-12">
        <div className="demo-notice-banner">
          <Info size={20} className="notice-icon" />
          <div className="notice-text">
            <strong>Demonstration Bus Search:</strong> Featuring interactive berth selection (Upper/Lower deck), verified luxury amenities (WiFi, GPS, charging points), and direct booking saving to <strong>My Trips</strong>.
          </div>
        </div>

        <div className="travel-layout-grid">
          {/* Sidebar */}
          <aside className="filters-sidebar">
            <div className="filter-card">
              <div className="filter-card-header">
                <SlidersHorizontal size={18} />
                <h3>Filter Buses</h3>
                {(fromCity !== "All" || toCity !== "All" || operatorFilter !== "All" || busTypeFilter !== "All") && (
                  <button 
                    onClick={() => {
                      setFromCity("All");
                      setToCity("All");
                      setOperatorFilter("All");
                      setBusTypeFilter("All");
                    }}
                    className="reset-filter-btn"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Coach Type */}
              <div className="filter-group">
                <label className="filter-group-title">Coach Configuration</label>
                <div className="filter-radio-list">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="coach" 
                      checked={busTypeFilter === "All"} 
                      onChange={() => setBusTypeFilter("All")} 
                    />
                    <span>All Buses</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="coach" 
                      checked={busTypeFilter === "sleeper"} 
                      onChange={() => setBusTypeFilter("sleeper")} 
                    />
                    <span>🛏️ AC Sleeper (2+1)</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="coach" 
                      checked={busTypeFilter === "electric"} 
                      onChange={() => setBusTypeFilter("electric")} 
                    />
                    <span>⚡ Electric Eco Coach</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="coach" 
                      checked={busTypeFilter === "volvo"} 
                      onChange={() => setBusTypeFilter("volvo")} 
                    />
                    <span>🚌 Volvo 9600 Multi-Axle</span>
                  </label>
                </div>
              </div>

              {/* Operators Filter */}
              <div className="filter-group">
                <label className="filter-group-title">Fleet Operators</label>
                <div className="filter-radio-list">
                  {operators.map((op) => (
                    <label key={op} className="radio-label">
                      <input 
                        type="radio" 
                        name="operator" 
                        checked={operatorFilter === op} 
                        onChange={() => setOperatorFilter(op)} 
                      />
                      <span>{op === "All" ? "All Fleet Partners" : op}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="bus-amenities-box">
                <span className="amenity-title">Included on Board</span>
                <div className="amenity-item">
                  <Wifi size={14} className="text-green" />
                  <span>Free High-Speed Wi-Fi</span>
                </div>
                <div className="amenity-item">
                  <Zap size={14} className="text-orange" />
                  <span>Individual USB & AC Sockets</span>
                </div>
                <div className="amenity-item">
                  <ShieldCheck size={14} className="text-navy" />
                  <span>GPS Tracking & Women Safe Berth</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Main */}
          <main className="results-main">
            <div className="results-header-bar">
              <div className="results-count">
                Showing <strong>{filteredBuses.length}</strong> luxury coaches
              </div>

              <div className="sort-box">
                <label>Sort By:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="price_asc">Fare: Low to High</option>
                  <option value="price_desc">Fare: High to Low</option>
                  <option value="rating">Top Rated (4.5+)</option>
                </select>
              </div>
            </div>

            {filteredBuses.length > 0 ? (
              <div className="travel-cards-list">
                {filteredBuses.map((bus) => (
                  <TravelCard key={bus.id} item={bus} type="bus" />
                ))}
              </div>
            ) : (
              <div className="no-results-box">
                <Bus size={44} className="text-gray" />
                <h3>No Buses Found</h3>
                <p>Try clearing your operator or coach filters to see all available intercity routes.</p>
                <button 
                  onClick={() => {
                    setFromCity("All");
                    setToCity("All");
                    setOperatorFilter("All");
                    setBusTypeFilter("All");
                  }}
                  className="btn btn-outline"
                >
                  Show All Buses
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .bus-booking-page {
          background-color: var(--color-bg);
          min-height: 100vh;
        }

        .bus-hero {
          background: linear-gradient(135deg, #18283B 0%, #203A43 100%);
          color: white;
          padding: 3rem 0 3.5rem;
          border-bottom: 4px solid var(--color-orange);
        }

        .bus-hero-content {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 2rem;
        }

        .bus-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 155, 84, 0.2);
          color: #FFB380;
          border: 1px solid rgba(255, 155, 84, 0.4);
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 0.8rem;
        }

        .bus-hero-content h1 {
          color: white;
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.6rem;
        }

        .bus-hero-content p {
          color: #CBD5E1;
          font-size: 1.05rem;
        }

        .bus-search-card {
          background: white;
          border-radius: 18px;
          padding: 1.5rem 1.8rem;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
          color: var(--color-text);
        }

        .search-grid-inputs {
          display: grid;
          grid-template-columns: 1fr auto 1fr 1fr 1fr;
          gap: 1rem;
          align-items: center;
        }

        .search-input-box label {
          display: block;
          font-size: 0.76rem;
          text-transform: uppercase;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 0.4rem;
          letter-spacing: 0.5px;
        }

        .input-with-icon {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.4rem 0.75rem;
        }

        .field-icon {
          color: #94A3B8;
          margin-right: 0.5rem;
          flex-shrink: 0;
        }

        .select-field, .text-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-navy);
          outline: none;
          cursor: pointer;
        }

        .swap-btn-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1.2rem;
        }

        .swap-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid #E2E8F0;
          background: #F8FAFC;
          color: var(--color-navy);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .swap-btn:hover {
          background: var(--color-orange);
          color: white;
          border-color: var(--color-orange);
          transform: rotate(180deg);
        }

        .demo-notice-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 12px;
          padding: 1rem 1.4rem;
          margin-bottom: 2rem;
          color: #1E40AF;
          font-size: 0.92rem;
        }

        .travel-layout-grid {
          display: grid;
          grid-template-columns: 290px 1fr;
          gap: 2rem;
          align-items: start;
        }

        .filter-card {
          background: white;
          border-radius: 16px;
          padding: 1.4rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
          position: sticky;
          top: 90px;
        }

        .filter-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 1.2rem;
        }

        .filter-card-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-navy);
          margin: 0;
          flex-grow: 1;
          margin-left: 0.5rem;
        }

        .reset-filter-btn {
          background: none;
          border: none;
          color: var(--color-orange);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }

        .filter-group {
          margin-bottom: 1.5rem;
          padding-bottom: 1.2rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .filter-group-title {
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--color-navy);
          margin-bottom: 0.8rem;
          display: block;
        }

        .filter-radio-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          color: #475569;
          cursor: pointer;
        }

        .radio-label input {
          accent-color: var(--color-orange);
          cursor: pointer;
        }

        .bus-amenities-box {
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .amenity-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #C2410C;
          margin-bottom: 0.2rem;
        }

        .amenity-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #7C2D12;
          font-weight: 600;
        }

        .results-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          padding: 1rem 1.4rem;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          margin-bottom: 1.5rem;
        }

        .results-count {
          font-size: 0.95rem;
          color: #475569;
        }

        .sort-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          color: #64748B;
        }

        .sort-select {
          border: 1.5px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--color-navy);
          outline: none;
        }

        .travel-cards-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .no-results-box {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          border: 1px dashed #CBD5E1;
        }

        .no-results-box h3 {
          margin: 1rem 0 0.5rem;
          color: var(--color-navy);
        }

        .no-results-box p {
          color: #64748B;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 992px) {
          .travel-layout-grid {
            grid-template-columns: 1fr;
          }

          .search-grid-inputs {
            grid-template-columns: 1fr;
          }

          .swap-btn-wrap {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
