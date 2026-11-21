import React, { useState, useMemo } from "react";
import { 
  Train, 
  Calendar, 
  Users, 
  ArrowRightLeft, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sparkles, 
  Info,
  Zap,
  Coffee
} from "lucide-react";
import { TRAINS } from "../data/trains";
import TravelCard from "../components/TravelCard";

export default function TrainBooking() {
  const [fromCity, setFromCity] = useState("All");
  const [toCity, setToCity] = useState("All");
  const [selectedClass, setSelectedClass] = useState("All");
  const [trainTypeFilter, setTrainTypeFilter] = useState("All");
  const [searchDate, setSearchDate] = useState("2026-12-08");
  const [sortBy, setSortBy] = useState("departure");

  const fromCities = useMemo(() => ["All", ...new Set(TRAINS.map((t) => t.fromCity))], []);
  const toCities = useMemo(() => ["All", ...new Set(TRAINS.map((t) => t.toCity))], []);

  const handleSwap = () => {
    if (fromCity !== "All" && toCity !== "All") {
      const temp = fromCity;
      setFromCity(toCity);
      setToCity(temp);
    }
  };

  const filteredTrains = useMemo(() => {
    return TRAINS.filter((train) => {
      if (fromCity !== "All" && train.fromCity !== fromCity) return false;
      if (toCity !== "All" && train.toCity !== toCity) return false;
      if (trainTypeFilter === "vande-bharat" && !train.trainName.includes("Vande Bharat")) return false;
      if (trainTypeFilter === "rajdhani" && !train.trainName.includes("Rajdhani")) return false;
      if (trainTypeFilter === "shatabdi" && !train.trainName.includes("Shatabdi")) return false;
      if (selectedClass !== "All" && !train.classes.some((c) => c.code === selectedClass)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") {
        const minA = Math.min(...a.classes.map((c) => c.fare));
        const minB = Math.min(...b.classes.map((c) => c.fare));
        return minA - minB;
      }
      return 0;
    });
  }, [fromCity, toCity, trainTypeFilter, selectedClass, sortBy]);

  return (
    <div className="train-booking-page">
      {/* Search Hero */}
      <section className="train-hero">
        <div className="container">
          <div className="train-hero-content">
            <div className="train-pill">
              <Train size={15} />
              <span>INDIAN RAILWAYS RESERVATION DEMONSTRATION</span>
            </div>
            <h1>Search Premium Trains Across India</h1>
            <p>
              Experience Vande Bharat Express, Rajdhani, and Shatabdi connectivity with live seat availability preview.
            </p>
          </div>

          <div className="train-search-card">
            <div className="search-grid-inputs">
              <div className="search-input-box">
                <label>From Origin Station</label>
                <div className="input-with-icon">
                  <Train size={18} className="field-icon text-navy" />
                  <select 
                    value={fromCity} 
                    onChange={(e) => setFromCity(e.target.value)}
                    className="select-field"
                  >
                    {fromCities.map((c) => (
                      <option key={c} value={c}>
                        {c === "All" ? "All Departure Stations" : c}
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
                  title="Swap Stations"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              <div className="search-input-box">
                <label>To Destination Station</label>
                <div className="input-with-icon">
                  <Train size={18} className="field-icon text-green" />
                  <select 
                    value={toCity} 
                    onChange={(e) => setToCity(e.target.value)}
                    className="select-field"
                  >
                    {toCities.map((c) => (
                      <option key={c} value={c}>
                        {c === "All" ? "All Destination Stations" : c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="search-input-box">
                <label>Journey Date</label>
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
                <label>Preferred Travel Class</label>
                <div className="input-with-icon">
                  <Users size={18} className="field-icon" />
                  <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="select-field"
                  >
                    <option value="All">All Classes (1A, 2A, 3A, CC, EC)</option>
                    <option value="EC">Executive Chair Car (EC)</option>
                    <option value="CC">AC Chair Car (CC)</option>
                    <option value="1A">AC First Class (1A)</option>
                    <option value="2A">AC 2 Tier (2A)</option>
                    <option value="3A">AC 3 Tier (3A)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing */}
      <div className="container py-12">
        <div className="demo-notice-banner">
          <Info size={20} className="notice-icon" />
          <div className="notice-text">
            <strong>Demonstration Railway Search:</strong> Interface prepared for authorized Indian Railways IRCTC API integration. Realistic train numbers, schedules, and class fare tiers displayed for testing.
          </div>
        </div>

        <div className="travel-layout-grid">
          {/* Sidebar */}
          <aside className="filters-sidebar">
            <div className="filter-card">
              <div className="filter-card-header">
                <SlidersHorizontal size={18} />
                <h3>Filter Trains</h3>
                {(fromCity !== "All" || toCity !== "All" || trainTypeFilter !== "All" || selectedClass !== "All") && (
                  <button 
                    onClick={() => {
                      setFromCity("All");
                      setToCity("All");
                      setTrainTypeFilter("All");
                      setSelectedClass("All");
                    }}
                    className="reset-filter-btn"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Train Category */}
              <div className="filter-group">
                <label className="filter-group-title">Train Service Category</label>
                <div className="filter-radio-list">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="trainType" 
                      checked={trainTypeFilter === "All"} 
                      onChange={() => setTrainTypeFilter("All")} 
                    />
                    <span>All Trains</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="trainType" 
                      checked={trainTypeFilter === "vande-bharat"} 
                      onChange={() => setTrainTypeFilter("vande-bharat")} 
                    />
                    <span>⚡ Vande Bharat Express</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="trainType" 
                      checked={trainTypeFilter === "rajdhani"} 
                      onChange={() => setTrainTypeFilter("rajdhani")} 
                    />
                    <span>👑 Rajdhani Express</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="trainType" 
                      checked={trainTypeFilter === "shatabdi"} 
                      onChange={() => setTrainTypeFilter("shatabdi")} 
                    />
                    <span>🚄 Shatabdi Express</span>
                  </label>
                </div>
              </div>

              {/* Class Filter */}
              <div className="filter-group">
                <label className="filter-group-title">Quota & Class</label>
                <div className="filter-radio-list">
                  {["All", "EC", "CC", "1A", "2A", "3A"].map((c) => (
                    <label key={c} className="radio-label">
                      <input 
                        type="radio" 
                        name="railClass" 
                        checked={selectedClass === c} 
                        onChange={() => setSelectedClass(c)} 
                      />
                      <span>{c === "All" ? "All Travel Classes" : `Class ${c}`}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Service Highlights */}
              <div className="train-perks-box">
                <div className="perk-item">
                  <Zap size={16} className="text-orange" />
                  <span>High-Speed Punctual Services</span>
                </div>
                <div className="perk-item">
                  <Coffee size={16} className="text-green" />
                  <span>Catering & Refreshments Included</span>
                </div>
                <div className="perk-item">
                  <ShieldCheck size={16} className="text-navy" />
                  <span>Instant PNR Generation</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Main */}
          <main className="results-main">
            <div className="results-header-bar">
              <div className="results-count">
                Showing <strong>{filteredTrains.length}</strong> express trains
              </div>

              <div className="sort-box">
                <label>Sort By:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="departure">Scheduled Departure</option>
                  <option value="price_asc">Base Fare: Low to High</option>
                </select>
              </div>
            </div>

            {filteredTrains.length > 0 ? (
              <div className="travel-cards-list">
                {filteredTrains.map((train) => (
                  <TravelCard key={train.id} item={train} type="train" />
                ))}
              </div>
            ) : (
              <div className="no-results-box">
                <Train size={44} className="text-gray" />
                <h3>No Trains Found</h3>
                <p>Try clearing your train type or station filters to see all available routes.</p>
                <button 
                  onClick={() => {
                    setFromCity("All");
                    setToCity("All");
                    setTrainTypeFilter("All");
                    setSelectedClass("All");
                  }}
                  className="btn btn-outline"
                >
                  Show All Trains
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .train-booking-page {
          background-color: var(--color-bg);
          min-height: 100vh;
        }

        .train-hero {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: white;
          padding: 3rem 0 3.5rem;
          border-bottom: 4px solid var(--color-green);
        }

        .train-hero-content {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 2rem;
        }

        .train-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(21, 155, 117, 0.2);
          color: #4ADE80;
          border: 1px solid rgba(21, 155, 117, 0.4);
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 0.8rem;
        }

        .train-hero-content h1 {
          color: white;
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.6rem;
        }

        .train-hero-content p {
          color: #94A3B8;
          font-size: 1.05rem;
        }

        .train-search-card {
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
          background: var(--color-green);
          color: white;
          border-color: var(--color-green);
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
          accent-color: var(--color-green);
          cursor: pointer;
        }

        .train-perks-box {
          background: #F8FAFC;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          font-size: 0.82rem;
          color: #334155;
          font-weight: 600;
        }

        .perk-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
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
