import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Search, 
  MapPin, 
  Filter, 
  Compass, 
  SlidersHorizontal, 
  Navigation, 
  Sparkles, 
  RotateCcw,
  Calendar,
  IndianRupee
} from "lucide-react";
import DestinationCard from "../components/DestinationCard";
import { DESTINATIONS } from "../data/destinations";
import { STATES } from "../data/states";
import { CATEGORIES } from "../data/categories";
import { useTrips } from "../context/TripsContext";

export default function ExploreIndia() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userLocation, requestUserLocation, getDistanceFromUser } = useTrips();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "All States");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("cat") || "all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync with URL search params if changed
  useEffect(() => {
    if (searchParams.has("q")) setSearchQuery(searchParams.get("q"));
    if (searchParams.has("state")) setSelectedState(searchParams.get("state"));
    if (searchParams.has("cat")) setSelectedCategory(searchParams.get("cat"));
  }, [searchParams]);

  // Comprehensive Filtering & Sorting Logic
  const filteredDestinations = useMemo(() => {
    let result = DESTINATIONS;

    // 1. Text Search Filter (name, city, state, description, highlights)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        (d.highlights && d.highlights.some(h => h.toLowerCase().includes(q)))
      );
    }

    // 2. State Filter
    if (selectedState && selectedState !== "All States") {
      result = result.filter(d => d.state.toLowerCase() === selectedState.toLowerCase());
    }

    // 3. Category Filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(d => d.category === selectedCategory);
    }

    // 4. Budget Filter
    if (selectedBudget === "free") {
      result = result.filter(d => d.ticketPrice === 0);
    } else if (selectedBudget === "under1000") {
      result = result.filter(d => d.tourPackagePrice <= 2000);
    } else if (selectedBudget === "luxury") {
      result = result.filter(d => d.tourPackagePrice > 2500);
    }

    // 5. Rating Filter
    if (selectedRating === "4.8") {
      result = result.filter(d => d.rating >= 4.8);
    } else if (selectedRating === "4.5") {
      result = result.filter(d => d.rating >= 4.5);
    }

    // 6. Sorting
    const sorted = [...result];
    if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-low") {
      sorted.sort((a, b) => a.ticketPrice - b.ticketPrice);
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => b.tourPackagePrice - a.tourPackagePrice);
    } else if (sortBy === "distance") {
      sorted.sort((a, b) => {
        const distA = getDistanceFromUser(a.lat, a.lng) || 9999;
        const distB = getDistanceFromUser(b.lat, b.lng) || 9999;
        return distA - distB;
      });
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: Popular (reviews count)
      sorted.sort((a, b) => b.reviews - a.reviews);
    }

    return sorted;
  }, [searchQuery, selectedState, selectedCategory, selectedBudget, selectedRating, sortBy, userLocation]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedState("All States");
    setSelectedCategory("all");
    setSelectedBudget("all");
    setSelectedRating("all");
    setSortBy("popular");
    setSearchParams({});
  };

  return (
    <div className="explore-page-container">
      {/* Page Header Banner */}
      <section className="explore-header-banner">
        <div className="container">
          <div className="banner-text-box">
            <span className="banner-tag">
              <Compass size={14} /> National Travel Directory
            </span>
            <h1 className="banner-title">Explore All Indian Tourist Destinations</h1>
            <p className="banner-subtitle">
              Discover 175+ curated tourist wonders across all 28 Indian States & 8 Union Territories. Filter by category, budget, distance from your live GPS location, and book verified passes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Filter & Search Control Panel */}
      <section className="control-bar-section">
        <div className="container">
          <div className="search-controls-box">
            {/* Top Row: Search Input + State + Sort */}
            <div className="controls-main-row">
              <div className="main-search-input-wrap">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by destination (e.g. Taj Mahal, Munnar, Hampi), city, or keyword..."
                  className="search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="clear-btn">×</button>
                )}
              </div>

              <div className="select-dropdown-wrap">
                <MapPin size={16} className="dropdown-icon" />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="state-select"
                >
                  <option value="All States">📍 All Indian States & UTs</option>
                  {STATES.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.destinationsCount})
                    </option>
                  ))}
                </select>
              </div>

              <div className="select-dropdown-wrap">
                <SlidersHorizontal size={16} className="dropdown-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="popular">🔥 Most Popular</option>
                  <option value="distance">📍 Nearest to My GPS</option>
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="price-low">💰 Entry Pass: Low to High</option>
                  <option value="price-high">💎 Tour Package: High to Low</option>
                  <option value="name">🔤 Name (A - Z)</option>
                </select>
              </div>

              <button
                type="button"
                className={`filters-toggle-btn ${filtersOpen ? "active" : ""}`}
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Filter size={16} />
                <span>Filters</span>
              </button>
            </div>

            {/* Category Pills Bar */}
            <div className="category-pills-bar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`cat-pill-btn ${selectedCategory === cat.id ? "active" : ""}`}
                >
                  <span>{cat.name}</span>
                  <span className="pill-count">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Expandable Advanced Filters Row */}
            {filtersOpen && (
              <div className="advanced-filters-panel">
                <div className="adv-filter-col">
                  <label className="adv-label"><IndianRupee size={14} /> Budget Filter:</label>
                  <div className="btn-group-pill">
                    <button
                      type="button"
                      className={`pill-option ${selectedBudget === "all" ? "active" : ""}`}
                      onClick={() => setSelectedBudget("all")}
                    >
                      All Budgets
                    </button>
                    <button
                      type="button"
                      className={`pill-option ${selectedBudget === "free" ? "active" : ""}`}
                      onClick={() => setSelectedBudget("free")}
                    >
                      Free Entry
                    </button>
                    <button
                      type="button"
                      className={`pill-option ${selectedBudget === "under1000" ? "active" : ""}`}
                      onClick={() => setSelectedBudget("under1000")}
                    >
                      Under ₹2,000
                    </button>
                    <button
                      type="button"
                      className={`pill-option ${selectedBudget === "luxury" ? "active" : ""}`}
                      onClick={() => setSelectedBudget("luxury")}
                    >
                      Premium (₹2,500+)
                    </button>
                  </div>
                </div>

                <div className="adv-filter-col">
                  <label className="adv-label"><Sparkles size={14} /> Minimum Rating:</label>
                  <div className="btn-group-pill">
                    <button
                      type="button"
                      className={`pill-option ${selectedRating === "all" ? "active" : ""}`}
                      onClick={() => setSelectedRating("all")}
                    >
                      All Ratings
                    </button>
                    <button
                      type="button"
                      className={`pill-option ${selectedRating === "4.5" ? "active" : ""}`}
                      onClick={() => setSelectedRating("4.5")}
                    >
                      4.5+ ★
                    </button>
                    <button
                      type="button"
                      className={`pill-option ${selectedRating === "4.8" ? "active" : ""}`}
                      onClick={() => setSelectedRating("4.8")}
                    >
                      4.8+ ★ (Exceptional)
                    </button>
                  </div>
                </div>

                <div className="adv-filter-actions">
                  <button onClick={resetFilters} className="btn-reset-filters">
                    <RotateCcw size={14} />
                    <span>Reset All</span>
                  </button>
                </div>
              </div>
            )}

            {/* Status & Live GPS Strip */}
            <div className="results-status-strip">
              <div className="count-info">
                <strong>{filteredDestinations.length}</strong> tourist destinations found
                {selectedState !== "All States" && <span> in <strong>{selectedState}</strong></span>}
                {selectedCategory !== "all" && <span> under <strong>{CATEGORIES.find(c => c.id === selectedCategory)?.name}</strong></span>}
              </div>

              <div className="gps-pill-box">
                <button 
                  type="button" 
                  onClick={requestUserLocation}
                  className={`live-gps-btn ${userLocation.isLive ? "live" : ""}`}
                  title="Refresh or grant location permission for accurate distance sorting"
                >
                  <Navigation size={14} className={userLocation.loading ? "spin" : ""} />
                  <span>
                    {userLocation.isLive 
                      ? "Live GPS Active" 
                      : userLocation.loading 
                      ? "Acquiring GPS..." 
                      : "Use My GPS Location"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Cards Grid */}
      <section className="destinations-grid-section">
        <div className="container">
          {filteredDestinations.length === 0 ? (
            <div className="empty-results-box">
              <div className="empty-icon">🗺️</div>
              <h3>No Destinations Found</h3>
              <p>We couldn't find any places matching your current search and filter combination.</p>
              <button onClick={resetFilters} className="btn btn-primary mt-3">
                <RotateCcw size={16} /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid-4">
              {filteredDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .explore-page-container {
          padding-bottom: 90px;
        }

        .explore-header-banner {
          background: linear-gradient(135deg, var(--primary-navy-dark) 0%, var(--primary-navy) 100%);
          color: white;
          padding: 60px 0 70px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .banner-text-box {
          max-width: 820px;
        }

        .banner-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(21, 155, 117, 0.2);
          color: #6EE7B7;
          border: 1px solid rgba(21, 155, 117, 0.4);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .banner-title {
          color: white;
          font-size: 2.6rem;
          font-weight: 800;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }

        .banner-subtitle {
          color: #CBD5E1;
          font-size: 1.08rem;
          line-height: 1.6;
        }

        .control-bar-section {
          margin-top: -30px;
          position: relative;
          z-index: 10;
        }

        .search-controls-box {
          background: white;
          border-radius: var(--radius-xl);
          padding: 24px;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.1);
          border: 1px solid var(--border-color);
        }

        .controls-main-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .main-search-input-wrap {
          flex: 1.6;
          min-width: 280px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 12px 38px 12px 42px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          font-size: 0.95rem;
          outline: none;
          color: var(--primary-navy);
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: var(--travel-green);
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.15);
        }

        .clear-btn {
          position: absolute;
          right: 12px;
          background: #E2E8F0;
          border: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .select-dropdown-wrap {
          flex: 1;
          min-width: 200px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .dropdown-icon {
          position: absolute;
          left: 14px;
          color: var(--travel-green);
          pointer-events: none;
        }

        .state-select, .sort-select {
          width: 100%;
          padding: 12px 14px 12px 40px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--border-color);
          background: white;
          color: var(--primary-navy);
          font-weight: 600;
          font-size: 0.92rem;
          outline: none;
          cursor: pointer;
        }

        .state-select:focus, .sort-select:focus {
          border-color: var(--travel-green);
        }

        .filters-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 18px;
          background: #F8FAFC;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          font-weight: 700;
          color: var(--primary-navy);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filters-toggle-btn:hover, .filters-toggle-btn.active {
          background: var(--primary-navy);
          color: white;
          border-color: var(--primary-navy);
        }

        .category-pills-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 6px;
        }

        .category-pills-bar::-webkit-scrollbar {
          height: 4px;
        }

        .category-pills-bar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }

        .cat-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #F8FAFC;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .cat-pill-btn:hover {
          background: white;
          border-color: var(--travel-green);
          color: var(--travel-green);
        }

        .cat-pill-btn.active {
          background: var(--travel-green);
          color: white;
          border-color: var(--travel-green);
        }

        .pill-count {
          font-size: 0.72rem;
          background: rgba(0, 0, 0, 0.08);
          padding: 1px 6px;
          border-radius: 10px;
        }

        .cat-pill-btn.active .pill-count {
          background: rgba(255, 255, 255, 0.25);
          color: white;
        }

        .advanced-filters-panel {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .adv-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        .btn-group-pill {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .pill-option {
          padding: 6px 12px;
          background: white;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill-option.active {
          background: var(--primary-navy);
          color: white;
          border-color: var(--primary-navy);
        }

        .btn-reset-filters {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--danger);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
        }

        .btn-reset-filters:hover {
          background: var(--danger-light);
        }

        .results-status-strip {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.88rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 12px;
        }

        .live-gps-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #F1F5F9;
          color: var(--primary-navy);
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .live-gps-btn.live {
          background: var(--travel-green-light);
          color: var(--travel-green-dark);
          border-color: var(--travel-green);
        }

        .destinations-grid-section {
          padding-top: 40px;
        }

        .empty-results-box {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-color);
          max-width: 500px;
          margin: 0 auto;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        .empty-results-box h3 {
          font-size: 1.4rem;
          margin-bottom: 8px;
        }

        .empty-results-box p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        @media (max-width: 860px) {
          .banner-title {
            font-size: 2rem;
          }
          .controls-main-row {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
