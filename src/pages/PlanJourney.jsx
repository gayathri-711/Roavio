import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  MoveDown,
  Eye,
  ExternalLink,
  CreditCard,
  ShieldCheck,
  Check,
  X,
  Smartphone,
  Lock,
  Building2,
  Ticket,
  QrCode,
  IndianRupee,
  AlertCircle,
  Phone,
  Mail,
  User,
  Star
} from "lucide-react";
import { DESTINATIONS, calculateDistanceKm, getDestinationById } from "../data/destinations";
import { useTrips } from "../context/TripsContext";
import { useAuth } from "../context/AuthContext";

export default function PlanJourney() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login } = useAuth();
  const { userLocation, requestUserLocation, addPlannedTrip, addBooking } = useTrips();

  // Extract selected place from URL search parameters (dest, id, place, or to)
  const destQuery = searchParams.get("dest") || searchParams.get("id") || searchParams.get("place") || searchParams.get("to");
  const matchedInitial = destQuery ? getDestinationById(destQuery) : null;

  // Quick Explore Modal State
  const [quickExploreDest, setQuickExploreDest] = useState(null);
  const [activeExploreImg, setActiveExploreImg] = useState("");

  // Registration & Payment Checkout Modal State
  const [tripRegisterModalOpen, setTripRegisterModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Traveler Details Form State
  const [leadName, setLeadName] = useState(user?.name || "Rahul Sharma");
  const [leadPhone, setLeadPhone] = useState(user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : "9876543210");
  const [leadEmail, setLeadEmail] = useState(user?.email || "rahul.sharma@example.com");
  const [emergencyPhone, setEmergencyPhone] = useState("9811223344");

  // Keep traveler state synchronized when user logs in or switches account
  useEffect(() => {
    if (user) {
      if (user.name) setLeadName(user.name);
      if (user.phone) setLeadPhone(user.phone.replace(/\D/g, '').slice(-10));
      if (user.email) setLeadEmail(user.email);
    }
  }, [user]);

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" | "card" | "netbanking"
  const [upiId, setUpiId] = useState("traveler@okaxis");
  const [upiApp, setUpiApp] = useState("gpay");
  const [cardNumber, setCardNumber] = useState("4532 8920 1142 8821");
  const [cardExpiry, setCardExpiry] = useState("11/29");
  const [cardCvv, setCardCvv] = useState("824");
  const [cardName, setCardName] = useState("Rahul Sharma");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Planning Form State - dynamically centered around the user's chosen destination
  const [tripTitle, setTripTitle] = useState(
    matchedInitial ? `Explore ${matchedInitial.name} & ${matchedInitial.state}` : "Incredible North & South India Discovery"
  );
  const [sourceCity, setSourceCity] = useState(searchParams.get("from") || "New Delhi");
  const [startDate, setStartDate] = useState(searchParams.get("date") || "2026-12-15");
  const [endDate, setEndDate] = useState("2026-12-22");
  const [travelersCount, setTravelersCount] = useState(
    parseInt(searchParams.get("travelers")) || 2
  );
  const [budgetPerPerson, setBudgetPerPerson] = useState(
    matchedInitial?.tourPackagePrice ? Math.max(12000, matchedInitial.tourPackagePrice * 2) : 25000
  );
  const [preferredTransport, setPreferredTransport] = useState("Flight & High-Speed Train");
  const [tripNotes, setTripNotes] = useState(
    matchedInitial 
      ? `Focused exploration of ${matchedInitial.name} in ${matchedInitial.city}, ${matchedInitial.state}. Best season: ${matchedInitial.bestTime}.`
      : "Focus on heritage architecture, authentic regional cuisine, and sunrise viewpoints."
  );

  // Selected Destinations List - centers on the clicked place instead of a static generic list
  const [selectedDestIds, setSelectedDestIds] = useState(() => {
    if (matchedInitial) {
      const sameState = DESTINATIONS.filter(d => d.state === matchedInitial.state && d.id !== matchedInitial.id).slice(0, 2);
      return [matchedInitial.id, ...sameState.map(d => d.id)];
    }
    return ["taj-mahal", "solang-manali", "munnar"];
  });

  // Automatically update the itinerary when user navigates or clicks "Plan" on another place
  useEffect(() => {
    const q = searchParams.get("dest") || searchParams.get("id") || searchParams.get("place") || searchParams.get("to");
    if (q) {
      const target = getDestinationById(q);
      if (target) {
        const sameState = DESTINATIONS.filter(d => d.state === target.state && d.id !== target.id).slice(0, 2);
        const newStops = [target.id, ...sameState.map(d => d.id)];
        setSelectedDestIds(newStops);
        setTripTitle(`Explore ${target.name} & ${target.state}`);
        setTripNotes(`Focused exploration of ${target.name} in ${target.city}, ${target.state}. Best season: ${target.bestTime}.`);
        if (target.tourPackagePrice) {
          setBudgetPerPerson(Math.max(12000, target.tourPackagePrice * (newStops.length > 1 ? 1.5 : 1)));
        }
      }
    }
    const fromParam = searchParams.get("from");
    if (fromParam) setSourceCity(fromParam);
    const dateParam = searchParams.get("date");
    if (dateParam) {
      setStartDate(dateParam);
      const d = new Date(dateParam);
      d.setDate(d.getDate() + 7);
      setEndDate(d.toISOString().split("T")[0]);
    }
    const travParam = searchParams.get("travelers");
    if (travParam) {
      const num = parseInt(travParam);
      if (!isNaN(num) && num > 0) setTravelersCount(num);
    }
  }, [searchParams]);

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

  // User Registration & Online Payment Submission
  const handlePayAndConfirmTrip = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to your account before proceeding with payment.");
      return;
    }
    if (!leadName.trim() || !leadPhone.trim() || !leadEmail.trim()) {
      alert("Please provide the Lead Traveler's name, 10-digit mobile number, and email address.");
      return;
    }

    setIsProcessingPayment(true);
    const totalPackagePrice = budgetPerPerson * travelersCount;
    const destSummary = selectedDestinations.map((d) => d.name).join(" ➔ ");
    const bookingPayload = {
      category: "itinerary",
      title: tripTitle || "Incredible India Custom Tour",
      providerName: "Roavio Certified Tour Partner",
      sourceLocation: sourceCity,
      destination: selectedDestinations.map((d) => d.name).join(", "),
      travelDate: startDate,
      travelTime: "08:30 AM",
      passengers: travelersCount,
      leadPassenger: leadName,
      mobileNumber: leadPhone,
      email: leadEmail,
      seatClass: preferredTransport,
      amount: totalPackagePrice,
      paymentStatus: `Verified (${paymentMethod.toUpperCase()})`,
      bookingStatus: "Confirmed"
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });
      const data = await res.json();
      
      const confirmedObj = data.booking || {
        ...bookingPayload,
        bookingId: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
        providerReference: `ROA-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "Confirmed (Verified)"
      };

      // Add to context storage
      addBooking({
        type: "itinerary",
        category: "Tour Package Booking",
        title: confirmedObj.title,
        route: `${sourceCity} ➔ ${selectedDestinations[selectedDestinations.length - 1]?.city || selectedDestinations[0]?.city || "India"}`,
        date: startDate,
        passengers: travelersCount,
        fare: totalPackagePrice,
        seat: `All-Inclusive Pass (${preferredTransport})`,
        operator: "Roavio Certified Tour Partner",
        leadPassenger: leadName,
        mobileNumber: leadPhone,
        email: leadEmail,
        pnr: confirmedObj.providerReference || `ROA-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
        id: confirmedObj.bookingId || `BK-${Math.floor(10000 + Math.random() * 90000)}`
      });

      addPlannedTrip({
        title: tripTitle || `${selectedDestinations[0]?.name || "India"} Journey`,
        sourceCity,
        destinationSummary: destSummary,
        dates: `${startDate} to ${endDate}`,
        startDate,
        endDate,
        duration: `${tripDurationDays} Days / ${tripDurationDays - 1} Nights`,
        travelers: travelersCount,
        transport: preferredTransport,
        estimatedBudget: totalPackagePrice,
        stops: selectedDestinations.map((d) => ({
          id: d.id,
          name: d.name,
          state: d.state,
          image: d.image,
          category: d.category
        })),
        notes: tripNotes
      });

      setTimeout(() => {
        setIsProcessingPayment(false);
        setConfirmedBookingData(confirmedObj);
      }, 1400);
    } catch (err) {
      console.warn("Fallback local booking dispatch:", err);
      const fallbackBooking = addBooking({
        type: "itinerary",
        category: "Tour Package Booking",
        title: tripTitle,
        route: `${sourceCity} ➔ ${selectedDestinations[0]?.city || "India"}`,
        date: startDate,
        passengers: travelersCount,
        fare: totalPackagePrice,
        seat: `All-Inclusive Pass (${preferredTransport})`,
        operator: "Roavio Certified Tour Partner",
        leadPassenger: leadName,
        mobileNumber: leadPhone,
        email: leadEmail,
        pnr: `ROA-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
        id: `BK-${Math.floor(10000 + Math.random() * 90000)}`
      });

      setTimeout(() => {
        setIsProcessingPayment(false);
        setConfirmedBookingData(fallbackBooking);
      }, 1400);
    }
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
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setQuickExploreDest(d);
                              setActiveExploreImg(d.image);
                            }}
                            className="btn-quick-explore"
                            title={`Preview ${d.name}`}
                          >
                            <Eye size={13} />
                            <span>Explore</span>
                          </button>
                          <button 
                            onClick={() => addStop(d.id)}
                            className="btn btn-sm btn-primary add-stop-btn"
                          >
                            <Plus size={14} /> Add Stop
                          </button>
                        </div>
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
                        <div className="stop-title-flex">
                          <h4>{dest.name}</h4>
                          <div className="explore-btn-group">
                            <button
                              type="button"
                              onClick={() => {
                                setQuickExploreDest(dest);
                                setActiveExploreImg(dest.image);
                              }}
                              className="explore-pill-btn"
                              title={`Explore details for ${dest.name}`}
                            >
                              <Eye size={13} />
                              <span>Explore</span>
                            </button>
                            <Link
                              to={`/destination/${dest.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="explore-ext-btn"
                              title="Open destination page in a new tab"
                            >
                              <ExternalLink size={13} />
                            </Link>
                          </div>
                        </div>
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
                  onClick={() => {
                    setConfirmedBookingData(null);
                    setTripRegisterModalOpen(true);
                  }}
                  disabled={selectedDestinations.length === 0}
                  className="btn btn-primary btn-block register-trip-btn"
                >
                  <CreditCard size={18} />
                  <span>Register & Pay for Trip (Confirm Tickets)</span>
                </button>

                <button 
                  onClick={handleSaveToDashboard}
                  disabled={selectedDestinations.length === 0}
                  className="btn btn-outline btn-block mt-2 save-itinerary-btn"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 size={18} /> Saved to My Trips!
                    </>
                  ) : (
                    <>
                      <BookmarkCheck size={18} /> Save Itinerary as Draft
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

      {/* =========================================================================
          1. DESTINATION QUICK EXPLORE MODAL
          Allows user to view detailed attraction info without losing trip plan
      ========================================================================= */}
      {quickExploreDest && (
        <div className="plan-modal-overlay" onClick={() => setQuickExploreDest(null)}>
          <div className="plan-modal-box explore-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div className="d-flex align-items-center gap-2">
                <Compass size={22} className="text-green" />
                <h3 className="modal-title">Explore Attraction Details</h3>
              </div>
              <button onClick={() => setQuickExploreDest(null)} className="modal-close-x">
                <X size={20} />
              </button>
            </div>

            <div className="plan-modal-body">
              {/* Photo Showcase */}
              <div className="explore-showcase-wrap">
                <img 
                  src={activeExploreImg || quickExploreDest.image} 
                  alt={quickExploreDest.name} 
                  className="explore-main-img" 
                />
                {quickExploreDest.gallery && quickExploreDest.gallery.length > 0 && (
                  <div className="explore-thumbs-row">
                    {[quickExploreDest.image, ...quickExploreDest.gallery].slice(0, 5).map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Thumbnail" 
                        onClick={() => setActiveExploreImg(img)}
                        className={`explore-thumb ${ (activeExploreImg || quickExploreDest.image) === img ? "active" : "" }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="explore-details-content mt-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                  <div>
                    <span className="badge-pill-accent me-2">{quickExploreDest.badge || "Featured"}</span>
                    <span className="badge-pill-cat">{quickExploreDest.category || quickExploreDest.categoryName}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                    <Star size={16} fill="#F59E0B" />
                    <span>{quickExploreDest.rating || "4.8"}</span>
                    <span className="text-muted small">({quickExploreDest.reviews ? quickExploreDest.reviews.toLocaleString() : "1,200"} reviews)</span>
                  </div>
                </div>

                <h2 className="explore-dest-title">{quickExploreDest.name}</h2>
                <div className="explore-location-bar">
                  <MapPin size={15} className="text-green" />
                  <span>{quickExploreDest.city}, {quickExploreDest.state}</span>
                </div>

                <p className="explore-desc-text mt-3">
                  {quickExploreDest.description}
                </p>

                {/* Key Specs Grid */}
                <div className="explore-specs-grid mt-3">
                  <div className="spec-tile">
                    <Calendar size={18} className="text-green" />
                    <div>
                      <span className="spec-k">Best Time</span>
                      <strong className="spec-v">{quickExploreDest.bestTime || "Oct - Mar"}</strong>
                    </div>
                  </div>
                  <div className="spec-tile">
                    <Clock size={18} className="text-navy" />
                    <div>
                      <span className="spec-k">Visiting Hours</span>
                      <strong className="spec-v">{quickExploreDest.openingHours || "Sunrise to Sunset"}</strong>
                    </div>
                  </div>
                  <div className="spec-tile">
                    <IndianRupee size={18} className="text-orange" />
                    <div>
                      <span className="spec-k">Certified Entry</span>
                      <strong className="spec-v">{quickExploreDest.ticketPrice === 0 ? "Free Entry" : `₹${quickExploreDest.ticketPrice} / person`}</strong>
                    </div>
                  </div>
                  <div className="spec-tile">
                    <Plane size={18} className="text-blue" />
                    <div>
                      <span className="spec-k">Nearest Hub</span>
                      <strong className="spec-v">{quickExploreDest.nearestAirport?.name ? `${quickExploreDest.nearestAirport.name} (${quickExploreDest.nearestAirport.dist})` : `${quickExploreDest.city} Airport`}</strong>
                    </div>
                  </div>
                </div>

                {/* Highlights Checklist */}
                {quickExploreDest.highlights && quickExploreDest.highlights.length > 0 && (
                  <div className="explore-highlights-box mt-3">
                    <h4 className="box-title">Key Highlights & Cultural Features</h4>
                    <div className="highlights-pills-wrap">
                      {quickExploreDest.highlights.map((h, i) => (
                        <span key={i} className="hl-chip">
                          <Check size={14} className="text-green" /> {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="plan-modal-footer">
              <Link 
                to={`/destination/${quickExploreDest.id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-sm d-flex align-items-center gap-1"
              >
                <span>Open Full Destination Page</span>
                <ExternalLink size={14} />
              </Link>

              {selectedDestIds.includes(quickExploreDest.id) ? (
                <button 
                  type="button" 
                  disabled 
                  className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                >
                  <Check size={16} /> Added to Itinerary
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => {
                    addStop(quickExploreDest.id);
                    setQuickExploreDest(null);
                  }}
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                >
                  <Plus size={16} /> Add to Itinerary
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. TRIP REGISTRATION & PAYMENT CHECKOUT MODAL
          User registers for the trip, selects payment method, pays and confirms tickets
      ========================================================================= */}
      {tripRegisterModalOpen && (
        <div className="plan-modal-overlay" onClick={() => !isProcessingPayment && setTripRegisterModalOpen(false)}>
          <div className="plan-modal-box checkout-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div className="d-flex align-items-center gap-2">
                <CreditCard size={22} className="text-green" />
                <div>
                  <h3 className="modal-title">Register & Book Your Custom Journey</h3>
                  <span className="modal-subtitle">Secure Online Reservation & Instant Ticket Generation</span>
                </div>
              </div>
              {!isProcessingPayment && (
                <button onClick={() => setTripRegisterModalOpen(false)} className="modal-close-x">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* PROCESSING STATE SPINNER */}
            {isProcessingPayment && (
              <div className="payment-processing-splash">
                <div className="pulse-spinner"></div>
                <h3>Authorizing Secure Payment</h3>
                <p>Verifying with Bank & NPCI Payment Gateway... Generating your cryptographically verified Roavio E-Tickets.</p>
                <div className="secure-badge-pill">
                  <Lock size={14} /> 256-Bit SSL Encrypted Banking Channel
                </div>
              </div>
            )}

            {/* CONFIRMED BOOKING SUCCESS SCREEN */}
            {!isProcessingPayment && confirmedBookingData && (
              <div className="booking-confirmed-splash">
                <div className="success-icon-badge">
                  <Check size={36} />
                </div>
                <h2>Custom Trip Confirmed & Booked!</h2>
                <p className="lead-text">
                  Your reservation is confirmed. Official verified E-Tickets with QR codes have been generated and dispatched.
                </p>

                <div className="confirmed-ticket-pass">
                  <div className="pass-header">
                    <div>
                      <span className="pass-label">CONFIRMED ROAVIO PASS</span>
                      <h4>{confirmedBookingData.title}</h4>
                    </div>
                    <div className="pass-pnr-box">
                      <span className="pnr-k">PNR / PASS ID</span>
                      <strong className="pnr-v">{confirmedBookingData.providerReference || `ROA-PASS-${Math.floor(1000 + Math.random() * 9000)}`}</strong>
                    </div>
                  </div>

                  <div className="pass-grid">
                    <div>
                      <span className="pg-k">Lead Traveler</span>
                      <strong className="pg-v">{leadName}</strong>
                    </div>
                    <div>
                      <span className="pg-k">Travelers</span>
                      <strong className="pg-v">{travelersCount} Person{travelersCount > 1 ? "s" : ""}</strong>
                    </div>
                    <div>
                      <span className="pg-k">Dates</span>
                      <strong className="pg-v">{startDate} to {endDate}</strong>
                    </div>
                    <div>
                      <span className="pg-k">Primary Transport</span>
                      <strong className="pg-v">{preferredTransport}</strong>
                    </div>
                    <div>
                      <span className="pg-k">Route</span>
                      <strong className="pg-v">{sourceCity} ➔ {selectedDestinations[0]?.city || "India"}</strong>
                    </div>
                    <div>
                      <span className="pg-k">Total Paid</span>
                      <strong className="pg-v text-green">₹{(budgetPerPerson * travelersCount).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="pass-dispatch-alert">
                    <CheckCircle2 size={16} className="text-green" />
                    <span>Confirmation & Live Pass dispatched to <strong>+91 {leadPhone}</strong> and <strong>{leadEmail}</strong></span>
                  </div>
                </div>

                <div className="confirmed-actions-row mt-4">
                  <button 
                    onClick={() => {
                      setTripRegisterModalOpen(false);
                      navigate("/my-trips");
                    }}
                    className="btn btn-primary"
                  >
                    <Ticket size={18} /> View Tickets in My Trips Dashboard
                  </button>
                  <button 
                    onClick={() => setTripRegisterModalOpen(false)}
                    className="btn btn-outline"
                  >
                    Close & Keep Planning
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: REGISTRATION & PAYMENT FORM */}
            {!isProcessingPayment && !confirmedBookingData && (
              <form onSubmit={handlePayAndConfirmTrip} className="checkout-form-body">
                {/* Trip Overview Strip */}
                <div className="checkout-trip-strip">
                  <div className="strip-info">
                    <span className="strip-badge">ROAVIO ITINERARY</span>
                    <h4>{tripTitle}</h4>
                    <p>{sourceCity} ➔ {selectedDestinations.map(d => d.name).join(" ➔ ")}</p>
                  </div>
                  <div className="strip-stats">
                    <span>{tripDurationDays} Days</span>
                    <span>{selectedDestinations.length} Attractions</span>
                    <span>{preferredTransport}</span>
                  </div>
                </div>

                {/* LOGIN REQUIRED GATE IF USER NOT LOGGED IN */}
                {!user ? (
                  <div className="checkout-login-gate p-4 text-center bg-light rounded-3 my-3">
                    <div className="gate-icon-circle mx-auto mb-3" style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={28} />
                    </div>
                    <h4 className="text-navy mb-2">Login Required to Complete Payment</h4>
                    <p className="text-muted small mb-4" style={{ maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
                      To securely authorize your payment and link confirmed Roavio E-Tickets to your traveler dashboard, please sign in to your account.
                    </p>

                    <div className="d-flex flex-column gap-2" style={{ maxWidth: '360px', margin: '0 auto' }}>
                      <button 
                        type="button" 
                        onClick={() => {
                          login({
                            email: "rahul.sharma@example.com",
                            name: "Rahul Sharma",
                            phone: "9876543210"
                          });
                        }}
                        className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2"
                      >
                        <Sparkles size={16} />
                        <span>One-Click Sign In (Rahul Sharma)</span>
                      </button>

                      <button 
                        type="button" 
                        onClick={() => {
                          navigate("/login", { state: { from: { pathname: "/plan", search: `?dest=${selectedDestIds[0]}` } } });
                        }}
                        className="btn btn-outline d-flex align-items-center justify-content-center gap-2 py-2"
                      >
                        <User size={16} />
                        <span>Log In with Password or OTP ↗</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="logged-in-user-strip d-flex align-items-center justify-content-between p-2 px-3 rounded-3 mb-3 small" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534' }}>
                      <div className="d-flex align-items-center gap-2">
                        <CheckCircle2 size={16} />
                        <span>Signed in as <strong>{user.name}</strong> ({user.email})</span>
                      </div>
                      <span className="badge bg-success text-white">Verified Account</span>
                    </div>

                    {/* Section A: Traveler Registration Details */}
                    <div className="checkout-section">
                      <div className="section-title-wrap">
                        <User size={18} className="text-green" />
                        <h4>1. Traveler Registration Details</h4>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Lead Passenger Full Name *</label>
                          <input 
                            type="text" 
                            required
                            value={leadName} 
                            onChange={(e) => setLeadName(e.target.value)}
                            className="roavio-input" 
                            placeholder="e.g. Rahul Sharma"
                          />
                        </div>

                        <div className="form-group">
                          <label>Mobile Number (for SMS & WhatsApp E-Ticket) *</label>
                          <div className="phone-prefix-wrap">
                            <span className="phone-prefix">+91</span>
                            <input 
                              type="tel" 
                              required
                              maxLength={10}
                              value={leadPhone} 
                              onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, ''))}
                              className="roavio-input ps-prefix" 
                              placeholder="10-digit number"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-row-2 mt-2">
                        <div className="form-group">
                          <label>Email Address (for Official PDF Pass) *</label>
                          <input 
                            type="email" 
                            required
                            value={leadEmail} 
                            onChange={(e) => setLeadEmail(e.target.value)}
                            className="roavio-input" 
                            placeholder="rahul.sharma@example.com"
                          />
                        </div>

                        <div className="form-group">
                          <label>Emergency Contact Phone</label>
                          <input 
                            type="tel" 
                            value={emergencyPhone} 
                            onChange={(e) => setEmergencyPhone(e.target.value)}
                            className="roavio-input" 
                            placeholder="Family / Emergency contact"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section B: Choose Payment Method */}
                    <div className="checkout-section mt-4">
                      <div className="section-title-wrap">
                        <ShieldCheck size={18} className="text-green" />
                        <h4>2. Select Payment Method & Verify Tickets</h4>
                      </div>

                      {/* Payment Method Tabs */}
                      <div className="pay-methods-tabs">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("upi")}
                          className={`pay-tab-btn ${paymentMethod === "upi" ? "active" : ""}`}
                        >
                          <Smartphone size={16} />
                          <span>UPI Instant (GPay / PhonePe)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("card")}
                          className={`pay-tab-btn ${paymentMethod === "card" ? "active" : ""}`}
                        >
                          <CreditCard size={16} />
                          <span>Credit / Debit Card</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("netbanking")}
                          className={`pay-tab-btn ${paymentMethod === "netbanking" ? "active" : ""}`}
                        >
                          <Building2 size={16} />
                          <span>Net Banking</span>
                        </button>
                      </div>

                      {/* UPI Inputs */}
                      {paymentMethod === "upi" && (
                        <div className="pay-tab-content">
                          <div className="upi-apps-row">
                            <button type="button" onClick={() => setUpiApp("gpay")} className={`app-chip ${upiApp === "gpay" ? "selected" : ""}`}>
                              Google Pay
                            </button>
                            <button type="button" onClick={() => setUpiApp("phonepe")} className={`app-chip ${upiApp === "phonepe" ? "selected" : ""}`}>
                              PhonePe
                            </button>
                            <button type="button" onClick={() => setUpiApp("paytm")} className={`app-chip ${upiApp === "paytm" ? "selected" : ""}`}>
                              Paytm
                            </button>
                            <button type="button" onClick={() => setUpiApp("bhim")} className={`app-chip ${upiApp === "bhim" ? "selected" : ""}`}>
                              BHIM UPI
                            </button>
                          </div>

                          <div className="form-group mt-3">
                            <label>Virtual Payment Address (UPI ID)</label>
                            <div className="input-with-btn">
                              <input 
                                type="text" 
                                value={upiId} 
                                onChange={(e) => setUpiId(e.target.value)}
                                className="roavio-input" 
                                placeholder="username@okhdfcbank"
                              />
                              <span className="verified-pill">Verified ID ✓</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Card Inputs */}
                      {paymentMethod === "card" && (
                        <div className="pay-tab-content">
                          <div className="form-group">
                            <label>Card Number</label>
                            <div className="input-with-card-brand">
                              <input 
                                type="text" 
                                value={cardNumber} 
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="roavio-input" 
                                placeholder="4532 •••• •••• 8821"
                              />
                              <span className="card-brand-badge">VISA / RuPay</span>
                            </div>
                          </div>

                          <div className="form-row-3 mt-2">
                            <div className="form-group">
                              <label>Cardholder Name</label>
                              <input 
                                type="text" 
                                value={cardName} 
                                onChange={(e) => setCardName(e.target.value)}
                                className="roavio-input" 
                              />
                            </div>
                            <div className="form-group">
                              <label>Expiry Date</label>
                              <input 
                                type="text" 
                                value={cardExpiry} 
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="roavio-input" 
                                placeholder="MM/YY"
                              />
                            </div>
                            <div className="form-group">
                              <label>CVV / CVC</label>
                              <input 
                                type="password" 
                                maxLength={4}
                                value={cardCvv} 
                                onChange={(e) => setCardCvv(e.target.value)}
                                className="roavio-input" 
                                placeholder="•••"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Net Banking Inputs */}
                      {paymentMethod === "netbanking" && (
                        <div className="pay-tab-content">
                          <label className="mb-2 d-block small fw-bold">Select Bank:</label>
                          <div className="banks-radio-grid">
                            {["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra"].map((bank) => (
                              <div 
                                key={bank} 
                                onClick={() => setSelectedBank(bank)}
                                className={`bank-tile ${selectedBank === bank ? "active" : ""}`}
                              >
                                <Building2 size={18} />
                                <span>{bank}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section C: Live Transparent Fare Summary */}
                    <div className="checkout-fare-summary mt-4">
                      <div className="fare-line">
                        <span>Custom Itinerary Package ({travelersCount} travelers x ₹{budgetPerPerson.toLocaleString()}):</span>
                        <strong>₹{(budgetPerPerson * travelersCount).toLocaleString()}</strong>
                      </div>
                      <div className="fare-line">
                        <span>Monument Passes & Certified Guided Tours:</span>
                        <strong className="text-green">Included ✓</strong>
                      </div>
                      <div className="fare-line">
                        <span>Transit Booking & Convenience Fee:</span>
                        <strong className="text-green">₹0 (Promo Waived)</strong>
                      </div>
                      <div className="fare-line-total">
                        <div>
                          <span className="total-title">Total Payable Amount</span>
                          <span className="total-sub">All taxes and certified monument access included</span>
                        </div>
                        <span className="total-num">₹{(budgetPerPerson * travelersCount).toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="checkout-footer-bar mt-4">
                  <button 
                    type="button" 
                    onClick={() => setTripRegisterModalOpen(false)} 
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  {!user ? (
                    <button 
                      type="button" 
                      onClick={() => {
                        login({
                          email: "rahul.sharma@example.com",
                          name: "Rahul Sharma",
                          phone: "9876543210"
                        });
                      }}
                      className="btn btn-primary btn-pay-confirm"
                    >
                      <Lock size={16} />
                      <span>Log In to Proceed to Payment</span>
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-pay-confirm"
                    >
                      <Lock size={16} />
                      <span>Pay ₹{(budgetPerPerson * travelersCount).toLocaleString()} & Confirm Trip Tickets</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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

        .register-trip-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0.9rem;
          background: var(--color-green);
          color: white;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(21, 155, 117, 0.25);
        }

        .register-trip-btn:hover {
          background: #0f7a5b;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(21, 155, 117, 0.35);
        }

        .save-itinerary-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          padding: 0.85rem;
        }

        /* Explore buttons in stops */
        .stop-title-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem;
        }

        .explore-btn-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .explore-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          color: #1D4ED8;
          border-radius: 6px;
          padding: 0.2rem 0.55rem;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .explore-pill-btn:hover {
          background: #DBEAFE;
        }

        .explore-ext-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          color: #64748B;
          border: 1px solid #E2E8F0;
          background: white;
        }

        .explore-ext-btn:hover {
          color: var(--color-navy);
          background: #F1F5F9;
        }

        .btn-quick-explore {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: white;
          border: 1px solid #CBD5E1;
          color: var(--color-navy);
          border-radius: 6px;
          padding: 0.35rem 0.6rem;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-quick-explore:hover {
          background: #F8FAFC;
          border-color: var(--color-green);
        }

        /* Modal Overlays & Boxes */
        .plan-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          z-index: 1050;
          overflow-y: auto;
        }

        .plan-modal-box {
          background: white;
          border-radius: 20px;
          width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .explore-modal-box {
          max-width: 680px;
        }

        .checkout-modal-box {
          max-width: 760px;
        }

        .plan-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 1.6rem;
          border-bottom: 1px solid #E2E8F0;
          background: #F8FAFC;
        }

        .modal-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0;
        }

        .modal-subtitle {
          font-size: 0.78rem;
          color: #64748B;
        }

        .modal-close-x {
          background: transparent;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 0.2rem;
        }

        .plan-modal-body {
          padding: 1.5rem 1.6rem;
          overflow-y: auto;
        }

        .plan-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.6rem;
          border-top: 1px solid #E2E8F0;
          background: #F8FAFC;
        }

        /* Explore Modal Inner */
        .explore-showcase-wrap {
          border-radius: 14px;
          overflow: hidden;
        }

        .explore-main-img {
          width: 100%;
          height: 260px;
          object-fit: cover;
          border-radius: 12px;
        }

        .explore-thumbs-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.6rem;
        }

        .explore-thumb {
          width: 60px;
          height: 45px;
          object-fit: cover;
          border-radius: 6px;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .explore-thumb.active {
          border-color: var(--color-green);
        }

        .explore-dest-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0.3rem 0;
        }

        .explore-location-bar {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #64748B;
          font-size: 0.88rem;
          font-weight: 600;
        }

        .explore-desc-text {
          color: #334155;
          line-height: 1.6;
          font-size: 0.92rem;
        }

        .explore-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }

        .spec-tile {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 0.7rem 0.9rem;
          border-radius: 10px;
        }

        .spec-k {
          display: block;
          font-size: 0.72rem;
          color: #64748B;
          text-transform: uppercase;
          font-weight: 700;
        }

        .spec-v {
          font-size: 0.85rem;
          color: var(--color-navy);
        }

        .explore-highlights-box {
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 10px;
          padding: 0.9rem;
        }

        .box-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #166534;
          margin: 0 0 0.5rem;
        }

        .highlights-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        /* Checkout Modal Inner */
        .checkout-form-body {
          padding: 1.5rem 1.6rem;
          overflow-y: auto;
        }

        .checkout-trip-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 1rem 1.2rem;
          border-radius: 12px;
          margin-bottom: 1.2rem;
        }

        .strip-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--color-green);
          letter-spacing: 0.5px;
          margin-bottom: 0.2rem;
        }

        .strip-info h4 {
          margin: 0 0 0.2rem;
          font-size: 1.05rem;
          color: var(--color-navy);
        }

        .strip-info p {
          margin: 0;
          font-size: 0.82rem;
          color: #64748B;
        }

        .strip-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.2rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-navy);
        }

        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.9rem;
        }

        .section-title-wrap h4 {
          font-size: 1rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0;
        }

        .phone-prefix-wrap {
          position: relative;
        }

        .phone-prefix {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.9rem;
          font-weight: 700;
          color: #64748B;
        }

        .roavio-input.ps-prefix {
          padding-left: 48px;
        }

        /* Payment Tabs */
        .pay-methods-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }

        .pay-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem;
          border-radius: 10px;
          border: 1.5px solid #CBD5E1;
          background: #F8FAFC;
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pay-tab-btn.active {
          border-color: var(--color-green);
          background: #F0FDF4;
          color: #166534;
        }

        .upi-apps-row {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
        }

        .app-chip {
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: white;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        .app-chip.selected {
          border-color: var(--color-green);
          background: #F0FDF4;
          color: var(--color-green);
        }

        .input-with-btn, .input-with-card-brand {
          position: relative;
        }

        .verified-pill, .card-brand-badge {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-green);
        }

        .banks-radio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.6rem;
        }

        .bank-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 0.8rem 0.5rem;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          background: #F8FAFC;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 700;
          text-align: center;
        }

        .bank-tile.active {
          border-color: var(--color-green);
          background: #F0FDF4;
          color: var(--color-green);
        }

        .checkout-fare-summary {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.1rem;
        }

        .fare-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #475569;
          margin-bottom: 0.4rem;
        }

        .fare-line-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #CBD5E1;
          padding-top: 0.8rem;
          margin-top: 0.6rem;
        }

        .total-title {
          display: block;
          font-weight: 800;
          color: var(--color-navy);
          font-size: 1rem;
        }

        .total-sub {
          display: block;
          font-size: 0.74rem;
          color: #64748B;
        }

        .total-num {
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--color-green);
        }

        .checkout-footer-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #E2E8F0;
        }

        .btn-pay-confirm {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          font-weight: 800;
          padding: 0.8rem 1.4rem;
        }

        /* Payment Splash & Confirmation */
        .payment-processing-splash {
          padding: 4rem 2rem;
          text-align: center;
        }

        .pulse-spinner {
          width: 55px;
          height: 55px;
          border: 4px solid #E2E8F0;
          border-top-color: var(--color-green);
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .secure-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1rem;
          font-size: 0.78rem;
          color: #64748B;
          background: #F1F5F9;
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
        }

        .booking-confirmed-splash {
          padding: 2.5rem 2rem;
          text-align: center;
        }

        .success-icon-badge {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: #DCFCE7;
          color: #16A34A;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .confirmed-ticket-pass {
          background: #F8FAFC;
          border: 2px dashed #CBD5E1;
          border-radius: 16px;
          padding: 1.4rem;
          margin: 1.5rem auto 0;
          max-width: 580px;
          text-align: left;
        }

        .pass-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 0.8rem;
          margin-bottom: 1rem;
        }

        .pass-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--color-green);
          letter-spacing: 0.5px;
        }

        .pass-header h4 {
          margin: 0.2rem 0 0;
          font-size: 1.05rem;
          color: var(--color-navy);
        }

        .pass-pnr-box {
          text-align: right;
        }

        .pnr-k {
          display: block;
          font-size: 0.68rem;
          color: #64748B;
        }

        .pnr-v {
          font-size: 1.05rem;
          color: var(--color-navy);
          font-weight: 800;
        }

        .pass-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }

        .pg-k {
          display: block;
          font-size: 0.72rem;
          color: #64748B;
        }

        .pg-v {
          font-size: 0.88rem;
          color: var(--color-navy);
        }

        .pass-dispatch-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 8px;
          padding: 0.6rem 0.8rem;
          font-size: 0.8rem;
          color: #166534;
        }

        .confirmed-actions-row {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        @media (max-width: 992px) {
          .planner-grid {
            grid-template-columns: 1fr;
          }

          .form-row-2, .form-row-3 {
            grid-template-columns: 1fr;
          }

          .pay-methods-tabs {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
