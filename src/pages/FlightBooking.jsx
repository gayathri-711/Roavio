import React, { useState, useMemo } from "react";
import { 
  Plane, 
  Search, 
  Calendar, 
  Users, 
  ArrowRightLeft, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Info
} from "lucide-react";
import { FLIGHTS } from "../data/flights";
import TravelCard from "../components/TravelCard";

export default function FlightBooking() {
  const [fromCity, setFromCity] = useState("All");
  const [toCity, setToCity] = useState("All");
  const [selectedAirline, setSelectedAirline] = useState("All");
  const [stopsFilter, setStopsFilter] = useState("All");
  const [sortBy, setSortBy] = useState("price_asc");
  const [maxPrice, setMaxPrice] = useState(12000);
  const [searchDepartureDate, setSearchDepartureDate] = useState("2026-12-05");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("Economy");

  // Unique from/to cities
  const fromCities = useMemo(() => ["All", ...new Set(FLIGHTS.map((f) => f.fromCity))], []);
  const toCities = useMemo(() => ["All", ...new Set(FLIGHTS.map((f) => f.toCity))], []);
  const airlines = useMemo(() => ["All", ...new Set(FLIGHTS.map((f) => f.airline))], []);

  const handleSwapCities = () => {
    if (fromCity !== "All" && toCity !== "All") {
      const temp = fromCity;
      setFromCity(toCity);
      setToCity(temp);
    }
  };

  const filteredFlights = useMemo(() => {
    return FLIGHTS.filter((flight) => {
      if (fromCity !== "All" && flight.fromCity !== fromCity) return false;
      if (toCity !== "All" && flight.toCity !== toCity) return false;
      if (selectedAirline !== "All" && flight.airline !== selectedAirline) return false;
      if (stopsFilter === "non-stop" && flight.stopCount !== 0) return false;
      if (stopsFilter === "1-stop" && flight.stopCount !== 1) return false;
      if (flight.price > maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "duration") {
        const getMins = (dur) => {
          const parts = dur.match(/\d+/g);
          return parts ? parseInt(parts[0]) * 60 + (parts[1] ? parseInt(parts[1]) : 0) : 0;
        };
        return getMins(a.duration) - getMins(b.duration);
      }
      return 0;
    });
  }, [fromCity, toCity, selectedAirline, stopsFilter, maxPrice, sortBy]);

  return (
    <div className="flight-booking-page">
      {/* Hero Banner */}
      <section className="travel-search-hero">
        <div className="container">
          <div className="travel-hero-header">
            <div className="inline-chip">
              <Plane size={15} />
              <span>DOMESTIC AIRWAYS DISCOVERY</span>
            </div>
            <h1>Search & Compare Flights Across India</h1>
            <p>
              Connect between major metro hubs and India's top tourist destinations with verified schedule estimates.
            </p>
          </div>

          {/* Search Box */}
          <div className="travel-search-container">
            <div className="search-grid-inputs">
              <div className="search-input-box">
                <label>From Origin Airport</label>
                <div className="input-with-icon">
                  <Plane size={18} className="field-icon" />
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
                  onClick={handleSwapCities} 
                  className="swap-btn" 
                  title="Swap Origin and Destination"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              <div className="search-input-box">
                <label>To Destination Airport</label>
                <div className="input-with-icon">
                  <Plane size={18} className="field-icon text-green" />
                  <select 
                    value={toCity} 
                    onChange={(e) => setToCity(e.target.value)}
                    className="select-field"
                  >
                    {toCities.map((c) => (
                      <option key={c} value={c}>
                        {c === "All" ? "All Arrival Destinations" : c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="search-input-box">
                <label>Departure Date</label>
                <div className="input-with-icon">
                  <Calendar size={18} className="field-icon" />
                  <input 
                    type="date" 
                    value={searchDepartureDate} 
                    onChange={(e) => setSearchDepartureDate(e.target.value)}
                    className="text-input" 
                  />
                </div>
              </div>

              <div className="search-input-box">
                <label>Travelers & Class</label>
                <div className="input-with-icon">
                  <Users size={18} className="field-icon" />
                  <select 
                    value={cabinClass} 
                    onChange={(e) => setCabinClass(e.target.value)}
                    className="select-field"
                  >
                    <option value="Economy">1 Traveler, Economy</option>
                    <option value="Premium Economy">2 Travelers, Premium Economy</option>
                    <option value="Business">Business Class</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container py-12">
        {/* Notice Banner */}
        <div className="demo-notice-banner">
          <Info size={20} className="notice-icon" />
          <div className="notice-text">
            <strong>Demonstration Flight Search:</strong> Showing realistic domestic flight schedules, fares, and baggage allowance for Indian air routes. Instant seat reservation demonstration integrates with your personal <strong>My Trips</strong> dashboard.
          </div>
        </div>

        <div className="travel-layout-grid">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filter-card">
              <div className="filter-card-header">
                <SlidersHorizontal size={18} />
                <h3>Filter Flights</h3>
                {(fromCity !== "All" || toCity !== "All" || selectedAirline !== "All" || stopsFilter !== "All") && (
                  <button 
                    onClick={() => {
                      setFromCity("All");
                      setToCity("All");
                      setSelectedAirline("All");
                      setStopsFilter("All");
                      setMaxPrice(12000);
                    }}
                    className="reset-filter-btn"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Stops Filter */}
              <div className="filter-group">
                <label className="filter-group-title">Flight Stops</label>
                <div className="filter-radio-list">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="stops" 
                      checked={stopsFilter === "All"} 
                      onChange={() => setStopsFilter("All")} 
                    />
                    <span>All Flights</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="stops" 
                      checked={stopsFilter === "non-stop"} 
                      onChange={() => setStopsFilter("non-stop")} 
                    />
                    <span>Non-stop Only</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="stops" 
                      checked={stopsFilter === "1-stop"} 
                      onChange={() => setStopsFilter("1-stop")} 
                    />
                    <span>1 Stop</span>
                  </label>
                </div>
              </div>

              {/* Airlines Filter */}
              <div className="filter-group">
                <label className="filter-group-title">Preferred Airlines</label>
                <div className="filter-radio-list">
                  {airlines.map((a) => (
                    <label key={a} className="radio-label">
                      <input 
                        type="radio" 
                        name="airline" 
                        checked={selectedAirline === a} 
                        onChange={() => setSelectedAirline(a)} 
                      />
                      <span>{a === "All" ? "All Airlines" : a}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Price Slider */}
              <div className="filter-group">
                <div className="flex-between">
                  <label className="filter-group-title">Max Fare</label>
                  <span className="price-tag">₹{maxPrice.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="3000" 
                  max="12000" 
                  step="500" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="range-slider" 
                />
                <div className="range-bounds">
                  <span>₹3,000</span>
                  <span>₹12,000</span>
                </div>
              </div>

              {/* Verified Trust Tag */}
              <div className="sidebar-trust-box">
                <ShieldCheck size={22} className="text-green" />
                <div>
                  <h4>Zero Hidden Fees</h4>
                  <p>Transparent fare breakdown with standard cabin allowance included.</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Column */}
          <main className="results-main">
            {/* Sorting Header */}
            <div className="results-header-bar">
              <div className="results-count">
                Showing <strong>{filteredFlights.length}</strong> available flights
              </div>

              <div className="sort-box">
                <label>Sort By:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="price_asc">Price: Lowest to Highest</option>
                  <option value="price_desc">Price: Highest to Lowest</option>
                  <option value="duration">Fastest Duration</option>
                </select>
              </div>
            </div>

            {/* Flight Cards List */}
            {filteredFlights.length > 0 ? (
              <div className="travel-cards-list">
                {filteredFlights.map((flight) => (
                  <TravelCard key={flight.id} item={flight} type="flight" />
                ))}
              </div>
            ) : (
              <div className="no-results-box">
                <Plane size={44} className="text-gray" />
                <h3>No Flights Found</h3>
                <p>Try broadening your departure city or increasing the fare filter range.</p>
                <button 
                  onClick={() => {
                    setFromCity("All");
                    setToCity("All");
                    setSelectedAirline("All");
                    setStopsFilter("All");
                    setMaxPrice(12000);
                  }}
                  className="btn btn-outline"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .flight-booking-page {
          background-color: var(--color-bg);
          min-height: 100vh;
        }

        .travel-search-hero {
          background: linear-gradient(135deg, var(--color-navy) 0%, #1c3b5d 100%);
          color: white;
          padding: 3rem 0 3.5rem;
          border-bottom: 4px solid var(--color-green);
        }

        .travel-hero-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 2rem;
        }

        .travel-hero-header h1 {
          color: white;
          font-size: 2.25rem;
          font-weight: 800;
          margin: 0.8rem 0 0.5rem;
        }

        .travel-hero-header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.05rem;
          line-height: 1.5;
        }

        .travel-search-container {
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
          transition: all 0.2s ease;
        }

        .input-with-icon:focus-within {
          border-color: var(--color-green);
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.15);
          background: white;
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

        .price-tag {
          font-weight: 800;
          color: var(--color-green);
          font-size: 0.95rem;
        }

        .range-slider {
          width: 100%;
          accent-color: var(--color-green);
          cursor: pointer;
          margin: 0.5rem 0;
        }

        .range-bounds {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: #94A3B8;
        }

        .sidebar-trust-box {
          display: flex;
          gap: 0.8rem;
          align-items: flex-start;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 12px;
          padding: 0.9rem;
          font-size: 0.82rem;
          color: #166534;
        }

        .sidebar-trust-box h4 {
          font-size: 0.88rem;
          font-weight: 700;
          margin: 0 0 0.2rem;
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
