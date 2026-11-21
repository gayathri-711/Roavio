import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  ExternalLink, 
  Info,
  Car,
  Train,
  Plane,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { DESTINATIONS, calculateDistanceKm } from "../data/destinations";
import { useTrips } from "../context/TripsContext";
import MapComponent from "../components/MapComponent";

export default function LiveMap() {
  const { userLocation, requestUserLocation } = useTrips();
  const [selectedDestId, setSelectedDestId] = useState("taj-mahal");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const selectedDestination = useMemo(() => {
    return DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];
  }, [selectedDestId]);

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      if (activeCategory !== "All" && d.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, activeCategory]);

  const distanceKm = useMemo(() => {
    if (!userLocation || !selectedDestination) return 0;
    return calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      selectedDestination.lat,
      selectedDestination.lng
    );
  }, [userLocation, selectedDestination]);

  const categories = ["All", "Hill Stations", "Beaches", "Heritage", "Spiritual", "Wildlife", "Waterfalls", "Adventure"];

  return (
    <div className="live-map-page">
      {/* Top Header */}
      <section className="live-map-header">
        <div className="container">
          <div className="flex-between flex-wrap gap-4 align-center">
            <div>
              <div className="badge-pill mb-2">
                <Navigation size={14} />
                <span>INTERACTIVE GEODETIC NAVIGATION</span>
              </div>
              <h1>Live Indian Travel Map & Route Radar</h1>
              <p>
                Track live distances, calculated travel routes, and transit durations between your location and 175+ Indian tourist attractions.
              </p>
            </div>

            {/* GPS Trigger Pill */}
            <div className="gps-status-card">
              <div className="gps-info">
                <span className="gps-label">Current Geolocation:</span>
                <strong>{userLocation.name}</strong>
                <span className="gps-coords">
                  {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
                </span>
              </div>
              <button 
                onClick={requestUserLocation}
                disabled={userLocation.loading}
                className="btn btn-sm btn-primary gps-action-btn"
              >
                <Navigation size={15} />
                {userLocation.loading ? "Acquiring..." : "Get Live GPS"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Map View & Destination Selector */}
      <div className="container py-8">
        <div className="map-page-layout">
          {/* Left Column: Interactive Map Component */}
          <div className="map-view-column">
            <div className="map-card-wrapper">
              <MapComponent 
                userLocation={userLocation} 
                destination={selectedDestination} 
                height="600px"
                showStats={true}
              />
            </div>

            {/* Selected Destination Feature Banner */}
            <div className="destination-spotlight-card">
              <img 
                src={selectedDestination.image} 
                alt={selectedDestination.name} 
                className="spotlight-thumb" 
              />
              <div className="spotlight-details">
                <div className="spotlight-tags">
                  <span className="badge badge-green">{selectedDestination.category}</span>
                  <span className="badge badge-navy">{selectedDestination.state}</span>
                  <span className="rating-badge">★ {selectedDestination.rating} ({selectedDestination.reviews} reviews)</span>
                </div>
                <h2>{selectedDestination.name}</h2>
                <p className="spotlight-desc">{selectedDestination.description}</p>
                <div className="spotlight-stats">
                  <span>⏱️ Best Time: <strong>{selectedDestination.bestTime}</strong></span>
                  <span>💰 Est. Budget: <strong>₹{selectedDestination.estimatedBudget?.toLocaleString()}</strong></span>
                  <span>🎟️ Entry Pass: <strong>₹{selectedDestination.ticketPrice}</strong></span>
                </div>
              </div>
              <div className="spotlight-actions">
                <Link to={`/destination/${selectedDestination.id}`} className="btn btn-primary btn-block mb-2">
                  View Full Details <ArrowRight size={16} />
                </Link>
                <Link to="/plan" className="btn btn-outline btn-block">
                  Plan Itinerary Here
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Searchable Destination Navigator */}
          <aside className="destination-nav-column">
            <div className="nav-panel-card">
              <div className="nav-panel-header">
                <Compass size={18} />
                <h3>Choose Destination ({DESTINATIONS.length})</h3>
              </div>

              {/* Search input */}
              <div className="nav-search-box">
                <Search size={16} className="text-gray" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search attraction, city, or state..." 
                  className="nav-search-input"
                />
              </div>

              {/* Category Pills */}
              <div className="map-cat-pills">
                {categories.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Scrollable Destinations List */}
              <div className="nav-dest-list">
                {filteredDestinations.map((dest) => {
                  const dist = calculateDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    dest.lat,
                    dest.lng
                  );
                  const isSelected = dest.id === selectedDestId;

                  return (
                    <div 
                      key={dest.id} 
                      onClick={() => setSelectedDestId(dest.id)}
                      className={`nav-dest-item ${isSelected ? "selected" : ""}`}
                    >
                      <img src={dest.image} alt={dest.name} className="dest-item-img" />
                      <div className="dest-item-info">
                        <span className="dest-item-title">{dest.name}</span>
                        <span className="dest-item-sub">{dest.city}, {dest.state}</span>
                        <div className="dest-item-distance">
                          <Navigation size={12} />
                          <span>~{dist} km from you</span>
                        </div>
                      </div>
                      {isSelected && <div className="selected-indicator">●</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .live-map-page {
          background-color: var(--color-bg);
          min-height: 100vh;
        }

        .live-map-header {
          background: linear-gradient(135deg, var(--color-navy) 0%, #17324D 100%);
          color: white;
          padding: 2.5rem 0 2rem;
          border-bottom: 4px solid var(--color-green);
        }

        .live-map-header h1 {
          color: white;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.4rem;
        }

        .live-map-header p {
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.98rem;
          max-width: 680px;
          line-height: 1.5;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(21, 155, 117, 0.2);
          color: #4ADE80;
          border: 1px solid rgba(21, 155, 117, 0.4);
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .gps-status-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          padding: 0.9rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .gps-label {
          display: block;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          font-weight: 700;
        }

        .gps-info strong {
          display: block;
          color: white;
          font-size: 0.92rem;
        }

        .gps-coords {
          display: block;
          font-size: 0.74rem;
          color: #A7F3D0;
          font-family: monospace;
        }

        .gps-action-btn {
          white-space: nowrap;
        }

        .map-page-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 1.8rem;
          align-items: start;
        }

        .map-card-wrapper {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border: 1px solid #E2E8F0;
          margin-bottom: 1.5rem;
        }

        .destination-spotlight-card {
          background: white;
          border-radius: 18px;
          padding: 1.5rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          display: grid;
          grid-template-columns: 180px 1fr 200px;
          gap: 1.5rem;
          align-items: center;
        }

        .spotlight-thumb {
          width: 100%;
          height: 140px;
          border-radius: 12px;
          object-fit: cover;
        }

        .spotlight-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .rating-badge {
          background: #FEF3C7;
          color: #92400E;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }

        .spotlight-details h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0 0 0.4rem;
        }

        .spotlight-desc {
          font-size: 0.88rem;
          color: #64748B;
          margin-bottom: 0.8rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .spotlight-stats {
          display: flex;
          gap: 1.2rem;
          font-size: 0.82rem;
          color: #475569;
        }

        .nav-panel-card {
          background: white;
          border-radius: 18px;
          padding: 1.4rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          position: sticky;
          top: 90px;
        }

        .nav-panel-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--color-navy);
          padding-bottom: 0.9rem;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 1rem;
        }

        .nav-panel-header h3 {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0;
        }

        .nav-search-box {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          padding: 0.5rem 0.8rem;
          margin-bottom: 0.8rem;
        }

        .nav-search-input {
          flex-grow: 1;
          border: none;
          background: transparent;
          font-size: 0.88rem;
          margin-left: 0.5rem;
          outline: none;
          color: var(--color-navy);
        }

        .map-cat-pills {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding-bottom: 0.6rem;
          margin-bottom: 0.8rem;
        }

        .cat-pill {
          background: #F1F5F9;
          border: none;
          border-radius: 999px;
          padding: 0.3rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .cat-pill.active {
          background: var(--color-navy);
          color: white;
        }

        .nav-dest-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 0.3rem;
        }

        .nav-dest-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.6rem;
          border-radius: 12px;
          border: 1.5px solid #F1F5F9;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-dest-item:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
        }

        .nav-dest-item.selected {
          border-color: var(--color-green);
          background: #F0FDF4;
        }

        .dest-item-img {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .dest-item-info {
          flex-grow: 1;
        }

        .dest-item-title {
          display: block;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-navy);
        }

        .dest-item-sub {
          font-size: 0.76rem;
          color: #64748B;
          display: block;
        }

        .dest-item-distance {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          color: var(--color-green);
          font-weight: 700;
          margin-top: 0.2rem;
        }

        .selected-indicator {
          color: var(--color-green);
          font-size: 1.2rem;
        }

        @media (max-width: 992px) {
          .map-page-layout {
            grid-template-columns: 1fr;
          }

          .destination-spotlight-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
