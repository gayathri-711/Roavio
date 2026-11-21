import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Car, 
  Plane, 
  Train, 
  Bus, 
  Navigation, 
  Sparkles, 
  BookmarkCheck,
  ChevronRight,
  MoveUp,
  MoveDown
} from "lucide-react";
import { DESTINATIONS, calculateDistanceKm } from "../data/destinations";
import { useTrips } from "../context/TripsContext";

export default function PlanJourney() {
  const navigate = useNavigate();
  const { userLocation, requestUserLocation, addPlannedTrip } = useTrips();

  // Planning Form State
  const [tripTitle, setTripTitle] = useState("Incredible North & South India Discovery");
  const [sourceCity, setSourceCity] = useState("New Delhi");
  const [startDate, setStartDate] = useState("2026-12-15");
  const [endDate, setEndDate] = useState("2026-12-22");
  const [travelersCount, setTravelersCount] = useState(2);
  const [budgetPerPerson, setBudgetPerPerson] = useState(25000);
  const [preferredTransport, setPreferredTransport] = useState("Flight & High-Speed Train");
  const [tripNotes, setTripNotes] = useState("Focus on heritage architecture, authentic regional cuisine, and sunrise viewpoints.");

  // Selected Destinations List (Default with 3 top destinations)
  const [selectedDestIds, setSelectedDestIds] = useState([
    "taj-mahal",
    "jaipur-city-palace",
    "munnar-tea-gardens"
  ]);

  const [searchToAdd, setSearchToAdd] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available destinations to pick from
  const availableToAdd = useMemo(() => {
    if (!searchToAdd.trim()) return [];
    return DESTINATIONS.filter(
      (d) => 
        !selectedDestIds.includes(d.id) &&
        (d.name.toLowerCase().includes(searchToAdd.toLowerCase()) ||
         d.state.toLowerCase().includes(searchToAdd.toLowerCase()) ||
         d.category.toLowerCase().includes(searchToAdd.toLowerCase()))
    ).slice(0, 6);
  }, [searchToAdd, selectedDestIds]);

  // Selected destinations objects
  const selectedDestinations = useMemo(() => {
    return selectedDestIds
      .map((id) => DESTINATIONS.find((d) => d.id === id))
      .filter(Boolean);
  }, [selectedDestIds]);

  // Total estimated distance between successive stops
  const totalDistanceKm = useMemo(() => {
    if (selectedDestinations.length < 2) return 320;
    let dist = 0;
    for (let i = 0; i < selectedDestinations.length - 1; i++) {
      dist += calculateDistanceKm(
        selectedDestinations[i].lat,
        selectedDestinations[i].lng,
        selectedDestinations[i + 1].lat,
        selectedDestinations[i + 1].lng
      );
    }
    return dist;
  }, [selectedDestinations]);

  // Calculate days
  const tripDurationDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) || diffDays <= 0 ? 7 : diffDays + 1;
  }, [startDate, endDate]);

  // Reorder stops
  const moveStop = (index, direction) => {
    const newArr = [...selectedDestIds];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setSelectedDestIds(newArr);
  };

  const removeStop = (id) => {
    setSelectedDestIds(selectedDestIds.filter((item) => item !== id));
  };

  const addStop = (id) => {
    setSelectedDestIds([...selectedDestIds, id]);
    setSearchToAdd("");
  };

  const handleSaveToDashboard = () => {
    const newTrip = {
      title: tripTitle || `${selectedDestinations[0]?.name || "India"} Journey`,
      sourceCity,
      destinationSummary: selectedDestinations.map((d) => d.name).join(" ➔ "),
      dates: `${startDate} to ${endDate}`,
      startDate,
      endDate,
      duration: `${tripDurationDays} Days / ${tripDurationDays - 1} Nights`,
      travelers: travelersCount,
      transport: preferredTransport,
      estimatedBudget: budgetPerPerson * travelersCount,
      stops: selectedDestinations.map((d) => ({
        id: d.id,
        name: d.name,
        state: d.state,
        image: d.image,
        category: d.category
      })),
      notes: tripNotes
    };

    addPlannedTrip(newTrip);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      navigate("/my-trips");
    }, 1500);
  };

  return (
    <div className="plan-journey-page">
      {/* Hero Header */}
      <section className="plan-hero">
        <div className="container">
          <div className="plan-hero-inner">
            <div className="badge-pill">
              <Compass size={15} />
              <span>ROAVIO ITINERARY ARCHITECT</span>
            </div>
            <h1>Plan Your Personalized India Journey</h1>
            <p>
              Custom build multi-destination itineraries across 28 states & 8 UTs with realistic distance calculations, route optimization, and budget forecasting.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="planner-grid">
          {/* Left Column: Form & Add Stops */}
          <div className="planner-form-col">
            {/* Step 1: Core Trip Details */}
            <div className="planner-card">
              <div className="card-section-title">
                <span className="step-num">1</span>
                <div>
                  <h3>Trip Essentials</h3>
                  <p>Name your itinerary and choose origin & dates</p>
                </div>
              </div>

              <div className="form-stack">
                <div className="form-group">
                  <label>Trip Title</label>
                  <input 
                    type="text" 
                    value={tripTitle} 
                    onChange={(e) => setTripTitle(e.target.value)}
                    className="roavio-input" 
                    placeholder="e.g. Royal Rajasthan Golden Triangle"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Starting City / Source</label>
                    <div className="input-group-gps">
                      <input 
                        type="text" 
                        value={sourceCity} 
                        onChange={(e) => setSourceCity(e.target.value)}
                        className="roavio-input" 
                        placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                      />
                      <button 
                        type="button" 
                        onClick={requestUserLocation}
                        className="gps-btn" 
                        title="Use my current GPS Location"
                      >
                        <Navigation size={16} />
                        <span>GPS</span>
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Preferred Primary Transport</label>
                    <select 
                      value={preferredTransport} 
                      onChange={(e) => setPreferredTransport(e.target.value)}
                      className="roavio-select"
                    >
                      <option value="Flight & High-Speed Train">Flight & High-Speed Train</option>
                      <option value="Vande Bharat Express (Rail)">Vande Bharat Express (Rail)</option>
                      <option value="Chauffeur Luxury Cab">Chauffeur Luxury Cab</option>
                      <option value="AC Sleeper Coach">AC Sleeper Coach</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="roavio-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="roavio-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Travelers</label>
                    <select 
                      value={travelersCount} 
                      onChange={(e) => setTravelersCount(Number(e.target.value))}
                      className="roavio-select"
                    >
                      <option value={1}>1 Solo Explorer</option>
                      <option value={2}>2 Travelers (Couple)</option>
                      <option value={4}>4 Travelers (Family / Friends)</option>
                      <option value={6}>6+ Group Adventure</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Manage Tourist Stops */}
            <div className="planner-card">
              <div className="card-section-title">
                <span className="step-num">2</span>
                <div>
                  <h3>Select & Order Tourist Attractions</h3>
                  <p>Choose from India's 175+ destinations and reorder your route</p>
                </div>
              </div>

              {/* Destination Search Box */}
              <div className="search-stops-box">
                <div className="search-input-wrap">
                  <MapPin size={18} className="search-icon" />
                  <input 
                    type="text" 
                    value={searchToAdd} 
                    onChange={(e) => setSearchToAdd(e.target.value)}
                    placeholder="Search attraction to add (e.g. Hampi, Munnar, Varanasi, Kaziranga)..."
                    className="stops-search-input" 
                  />
                  {searchToAdd && (
                    <button onClick={() => setSearchToAdd("")} className="clear-search-btn">×</button>
                  )}
                </div>

                {/* Dropdown Suggestions */}
                {availableToAdd.length > 0 && (
                  <div className="stops-results-dropdown">
                    {availableToAdd.map((d) => (
                      <div key={d.id} className="stop-suggestion-row">
                        <img src={d.image} alt={d.name} className="sugg-thumb" />
                        <div className="sugg-info">
                          <span className="sugg-name">{d.name}</span>
                          <span className="sugg-state">{d.state} · {d.category}</span>
                        </div>
                        <button 
                          onClick={() => addStop(d.id)}
                          className="btn btn-sm btn-primary add-stop-btn"
                        >
                          <Plus size={14} /> Add Stop
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Stops Ordered List */}
              <div className="selected-stops-list">
                {selectedDestinations.length === 0 ? (
                  <div className="empty-stops-prompt">
                    <MapPin size={32} className="text-gray" />
                    <p>No destinations added yet. Search above to add attractions to your itinerary.</p>
                  </div>
                ) : (
                  selectedDestinations.map((dest, idx) => (
                    <div key={dest.id} className="selected-stop-card">
                      <div className="stop-index-pill">Stop #{idx + 1}</div>
                      <img src={dest.image} alt={dest.name} className="stop-img" />
                      <div className="stop-details">
                        <h4>{dest.name}</h4>
                        <span className="stop-state">{dest.state} · {dest.category}</span>
                        <div className="stop-meta">
                          <span>⏱️ {dest.bestTime}</span>
                          <span>💰 ₹{dest.estimatedBudget?.toLocaleString()} est.</span>
                        </div>
                      </div>

                      {/* Reorder and Delete Actions */}
                      <div className="stop-actions">
                        <button 
                          disabled={idx === 0} 
                          onClick={() => moveStop(idx, -1)}
                          className="reorder-btn" 
                          title="Move stop earlier"
                        >
                          <MoveUp size={16} />
                        </button>
                        <button 
                          disabled={idx === selectedDestinations.length - 1} 
                          onClick={() => moveStop(idx, 1)}
                          className="reorder-btn" 
                          title="Move stop later"
                        >
                          <MoveDown size={16} />
                        </button>
                        <button 
                          onClick={() => removeStop(dest.id)}
                          className="delete-stop-btn" 
                          title="Remove from itinerary"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Step 3: Budget & Notes */}
            <div className="planner-card">
              <div className="card-section-title">
                <span className="step-num">3</span>
                <div>
                  <h3>Budget & Travel Notes</h3>
                  <p>Fine-tune budget limits and travel preferences</p>
                </div>
              </div>

              <div className="form-stack">
                <div className="form-group">
                  <div className="flex-between mb-2">
                    <label>Approximate Budget per Traveler</label>
                    <span className="budget-val">₹{budgetPerPerson.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="8000" 
                    max="80000" 
                    step="1000" 
                    value={budgetPerPerson} 
                    onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
                    className="range-slider" 
                  />
                  <div className="range-bounds">
                    <span>₹8,000 (Budget)</span>
                    <span>₹40,000 (Comfort)</span>
                    <span>₹80,000+ (Luxury)</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Travel Notes / Specific Interests</label>
                  <textarea 
                    rows={3} 
                    value={tripNotes} 
                    onChange={(e) => setTripNotes(e.target.value)}
                    className="roavio-textarea"
                    placeholder="Enter preferences like vegetarian meals, sunrise photography, cultural guides..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Overview & Save */}
          <aside className="planner-summary-col">
            <div className="summary-card">
              <div className="summary-header">
                <Sparkles size={20} className="text-orange" />
                <h3>Itinerary Summary</h3>
              </div>

              {/* Stat Badges */}
              <div className="summary-stats-grid">
                <div className="stat-pill">
                  <span className="stat-label">Total Duration</span>
                  <span className="stat-value">{tripDurationDays} Days</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Attractions</span>
                  <span className="stat-value">{selectedDestinations.length} Stops</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Est. Distance</span>
                  <span className="stat-value">~{totalDistanceKm} km</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Travelers</span>
                  <span className="stat-value">{travelersCount} Person{travelersCount > 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Route Visualizer */}
              <div className="summary-route-track">
                <div className="track-point origin">
                  <div className="point-dot origin-dot"></div>
                  <div className="point-info">
                    <span className="point-role">Origin Base</span>
                    <strong>{sourceCity}</strong>
                  </div>
                </div>

                {selectedDestinations.map((dest, i) => (
                  <div key={dest.id} className="track-point">
                    <div className="point-line"></div>
                    <div className="point-dot"></div>
                    <div className="point-info">
                      <span className="point-role">Stop #{i + 1}</span>
                      <strong>{dest.name}</strong>
                      <span className="point-sub">{dest.state}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expense Estimation Breakdown */}
              <div className="expense-breakdown-box">
                <h4 className="expense-title">Estimated Expense Breakdown</h4>
                <div className="expense-row">
                  <span>Transit & Travel:</span>
                  <strong>₹{Math.round(budgetPerPerson * travelersCount * 0.45).toLocaleString()}</strong>
                </div>
                <div className="expense-row">
                  <span>Stay & Hotels:</span>
                  <strong>₹{Math.round(budgetPerPerson * travelersCount * 0.35).toLocaleString()}</strong>
                </div>
                <div className="expense-row">
                  <span>Passes, Food & Sightseeing:</span>
                  <strong>₹{Math.round(budgetPerPerson * travelersCount * 0.20).toLocaleString()}</strong>
                </div>
                <div className="expense-total-row">
                  <span>Total Planned Budget:</span>
                  <span className="total-amount">₹{(budgetPerPerson * travelersCount).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="summary-actions">
                <button 
                  onClick={handleSaveToDashboard}
                  disabled={selectedDestinations.length === 0}
                  className="btn btn-primary btn-block save-itinerary-btn"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 size={18} /> Saved to My Trips!
                    </>
                  ) : (
                    <>
                      <BookmarkCheck size={18} /> Save to My Trips Dashboard
                    </>
                  )}
                </button>

                <Link to="/map" className="btn btn-outline btn-block mt-2 flex-center gap-2">
                  <Navigation size={16} /> View Route on Live Map
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .plan-journey-page {
          background-color: var(--color-bg);
          min-height: 100vh;
        }

        .plan-hero {
          background: linear-gradient(135deg, var(--color-navy) 0%, #1A365D 100%);
          color: white;
          padding: 3.5rem 0 3rem;
          border-bottom: 4px solid var(--color-green);
        }

        .plan-hero-inner {
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
        }

        .badge-pill {
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
          margin-bottom: 0.8rem;
        }

        .plan-hero-inner h1 {
          color: white;
          font-size: 2.3rem;
          font-weight: 800;
          margin-bottom: 0.8rem;
        }

        .plan-hero-inner p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.05rem;
          line-height: 1.6;
        }

        .planner-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2rem;
          align-items: start;
        }

        .planner-card {
          background: white;
          border-radius: 18px;
          padding: 1.8rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          margin-bottom: 1.8rem;
        }

        .card-section-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .step-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-green);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .card-section-title h3 {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0 0 0.2rem;
        }

        .card-section-title p {
          font-size: 0.85rem;
          color: #64748B;
          margin: 0;
        }

        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-navy);
          margin-bottom: 0.5rem;
        }

        .roavio-input, .roavio-select, .roavio-textarea {
          width: 100%;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
          font-size: 0.92rem;
          color: var(--color-navy);
          background: #F8FAFC;
          outline: none;
          transition: border-color 0.2s;
        }

        .roavio-input:focus, .roavio-select:focus, .roavio-textarea:focus {
          border-color: var(--color-green);
          background: white;
        }

        .input-group-gps {
          display: flex;
          gap: 0.5rem;
        }

        .gps-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #EFF6FF;
          border: 1.5px solid #BFDBFE;
          color: #1D4ED8;
          border-radius: 10px;
          padding: 0 0.8rem;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .gps-btn:hover {
          background: #DBEAFE;
        }

        .search-stops-box {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .search-input-wrap {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 12px;
          padding: 0.6rem 0.9rem;
        }

        .search-icon {
          color: #94A3B8;
          margin-right: 0.6rem;
        }

        .stops-search-input {
          flex-grow: 1;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          outline: none;
          color: var(--color-navy);
        }

        .clear-search-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #94A3B8;
          cursor: pointer;
        }

        .stops-results-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: 12px;
          border: 1px solid #CBD5E1;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
          z-index: 50;
          margin-top: 0.4rem;
          max-height: 320px;
          overflow-y: auto;
        }

        .stop-suggestion-row {
          display: flex;
          align-items: center;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid #F1F5F9;
          gap: 0.9rem;
        }

        .sugg-thumb {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
        }

        .sugg-info {
          flex-grow: 1;
        }

        .sugg-name {
          display: block;
          font-weight: 700;
          color: var(--color-navy);
          font-size: 0.92rem;
        }

        .sugg-state {
          font-size: 0.8rem;
          color: #64748B;
        }

        .selected-stops-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .selected-stop-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 0.9rem 1.1rem;
        }

        .stop-index-pill {
          background: var(--color-navy);
          color: white;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          white-space: nowrap;
        }

        .stop-img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
        }

        .stop-details {
          flex-grow: 1;
        }

        .stop-details h4 {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--color-navy);
          margin: 0 0 0.2rem;
        }

        .stop-state {
          font-size: 0.8rem;
          color: #64748B;
          display: block;
        }

        .stop-meta {
          display: flex;
          gap: 0.8rem;
          font-size: 0.76rem;
          color: #0F766E;
          font-weight: 600;
          margin-top: 0.3rem;
        }

        .stop-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .reorder-btn, .delete-stop-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: white;
          color: var(--color-navy);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .reorder-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .delete-stop-btn {
          color: #DC2626;
          border-color: #FECACA;
        }

        .delete-stop-btn:hover {
          background: #FEF2F2;
        }

        .budget-val {
          font-weight: 800;
          color: var(--color-green);
          font-size: 1.05rem;
        }

        .range-slider {
          width: 100%;
          accent-color: var(--color-green);
        }

        .range-bounds {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #94A3B8;
          margin-top: 0.3rem;
        }

        /* Summary Column */
        .summary-card {
          background: white;
          border-radius: 18px;
          padding: 1.6rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 90px;
        }

        .summary-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 1.2rem;
        }

        .summary-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0;
        }

        .summary-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }

        .stat-pill {
          background: #F8FAFC;
          border-radius: 10px;
          padding: 0.75rem;
          border: 1px solid #E2E8F0;
        }

        .stat-label {
          display: block;
          font-size: 0.72rem;
          color: #64748B;
          text-transform: uppercase;
          font-weight: 700;
        }

        .stat-value {
          display: block;
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-navy);
          margin-top: 0.2rem;
        }

        .summary-route-track {
          margin-bottom: 1.5rem;
          padding-left: 0.5rem;
        }

        .track-point {
          position: relative;
          padding-left: 1.5rem;
          padding-bottom: 1rem;
        }

        .point-dot {
          position: absolute;
          left: 0;
          top: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--color-green);
          border: 2px solid white;
          box-shadow: 0 0 0 2px var(--color-green);
        }

        .origin-dot {
          background: var(--color-navy);
          box-shadow: 0 0 0 2px var(--color-navy);
        }

        .point-line {
          position: absolute;
          left: 5px;
          top: -16px;
          bottom: 12px;
          width: 2px;
          background: #CBD5E1;
        }

        .point-role {
          display: block;
          font-size: 0.72rem;
          color: #94A3B8;
          text-transform: uppercase;
          font-weight: 700;
        }

        .point-info strong {
          color: var(--color-navy);
          font-size: 0.9rem;
        }

        .point-sub {
          display: block;
          font-size: 0.76rem;
          color: #64748B;
        }

        .expense-breakdown-box {
          background: #F8FAFC;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid #E2E8F0;
        }

        .expense-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-navy);
          margin: 0 0 0.8rem;
        }

        .expense-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: #475569;
          margin-bottom: 0.4rem;
        }

        .expense-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.6rem;
          border-top: 1px solid #CBD5E1;
          margin-top: 0.6rem;
          font-weight: 800;
          color: var(--color-navy);
        }

        .total-amount {
          color: var(--color-green);
          font-size: 1.1rem;
        }

        .save-itinerary-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          padding: 0.85rem;
        }

        @media (max-width: 992px) {
          .planner-grid {
            grid-template-columns: 1fr;
          }

          .form-row-2, .form-row-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
