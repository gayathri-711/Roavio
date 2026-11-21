import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Star, 
  Bookmark, 
  Route, 
  Navigation, 
  Plane, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft,
  Share2,
  Ticket,
  ShieldCheck,
  Check,
  CreditCard,
  Lock,
  Smartphone,
  Building2,
  User,
  Mail,
  Phone
} from "lucide-react";
import { getDestinationById, DESTINATIONS } from "../data/destinations";
import { useTrips } from "../context/TripsContext";
import { useAuth } from "../context/AuthContext";
import MapComponent from "../components/MapComponent";

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSaved, toggleSaveDestination, getDistanceFromUser, userLocation, addBooking } = useTrips();

  const destination = getDestinationById(id) || DESTINATIONS[0];
  const [activeImage, setActiveImage] = useState(destination.image);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [passCount, setPassCount] = useState(2);
  const [isProcessingPass, setIsProcessingPass] = useState(false);
  const [passBooked, setPassBooked] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);
  const [sharedToast, setSharedToast] = useState(false);

  // Traveler Registration & Payment State
  const [visitorName, setVisitorName] = useState(user?.name || "Rahul Sharma");
  const [visitorMobile, setVisitorMobile] = useState(user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : "9876543210");
  const [visitorEmail, setVisitorEmail] = useState(user?.email || "rahul.sharma@example.com");
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" | "card" | "netbanking"
  const [upiId, setUpiId] = useState("traveler@okaxis");
  const [cardNumber, setCardNumber] = useState("4532 8920 1142 8821");
  const [cardExpiry, setCardExpiry] = useState("11/29");
  const [cardCvv, setCardCvv] = useState("824");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  const saved = isSaved(destination.id);
  const dist = getDistanceFromUser(destination.lat, destination.lng);

  const handleBookPass = async (e) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorMobile.trim() || !visitorEmail.trim()) {
      alert("Please fill in visitor name, 10-digit mobile number, and email address.");
      return;
    }

    setIsProcessingPass(true);
    const totalFare = (destination.ticketPrice || 250) * passCount;

    const bookingPayload = {
      category: "tour",
      title: `${destination.name} Official Entry Pass`,
      providerName: "ASI / Certified State Partner",
      sourceLocation: `${destination.city}, ${destination.state}`,
      destination: destination.name,
      travelDate: new Date().toISOString().split("T")[0],
      travelTime: "All-Day Valid Pass",
      passengers: passCount,
      leadPassenger: visitorName,
      mobileNumber: visitorMobile,
      email: visitorEmail,
      seatClass: "Monument Access Pass",
      amount: totalFare,
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

      const pnrCode = data?.booking?.providerReference || `ROA-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
      const bookingId = data?.booking?.bookingId || `BK-${Math.floor(10000 + Math.random() * 90000)}`;

      const confirmedObj = {
        ...bookingPayload,
        id: bookingId,
        pnr: pnrCode,
        category: "Certified Monument Pass",
        route: `${destination.city}, ${destination.state}`,
        date: new Date().toISOString().split("T")[0],
        fare: totalFare,
        seat: "All-Day Valid Pass",
        operator: "ASI / State Certified Partner"
      };

      addBooking(confirmedObj);

      setTimeout(() => {
        setIsProcessingPass(false);
        setPassBooked(true);
        setConfirmedPass(confirmedObj);
      }, 1200);

    } catch (err) {
      console.warn("API booking fallback:", err);
      const fallbackObj = addBooking({
        type: "tour",
        category: "Certified Monument Pass",
        title: `${destination.name} Official Entry Pass`,
        route: `${destination.city}, ${destination.state}`,
        date: new Date().toISOString().split("T")[0],
        passengers: passCount,
        fare: totalFare,
        seat: "All-Day Valid Pass",
        operator: "ASI / State Certified Partner",
        leadPassenger: visitorName,
        mobileNumber: visitorMobile,
        email: visitorEmail,
        pnr: `ROA-PASS-${Math.floor(1000 + Math.random() * 9000)}`
      });

      setTimeout(() => {
        setIsProcessingPass(false);
        setPassBooked(true);
        setConfirmedPass(fallbackObj);
      }, 1200);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2000);
    }
  };

  return (
    <div className="dest-details-page">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="details-top-bar">
        <div className="container">
          <div className="top-bar-inner">
            <button onClick={() => navigate(-1)} className="back-link-btn">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <div className="breadcrumb-trail">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/explore">Explore India</Link>
              <span>/</span>
              <Link to={`/explore?state=${destination.state}`}>{destination.state}</Link>
              <span>/</span>
              <span className="current-crumb">{destination.name}</span>
            </div>
            <div className="top-actions ms-auto">
              <button 
                onClick={handleShare} 
                className="action-icon-btn" 
                title="Copy share link"
              >
                <Share2 size={16} />
                {sharedToast && <span className="toast-pill">Copied!</span>}
              </button>
              <button 
                onClick={() => toggleSaveDestination(destination.id)} 
                className={`action-icon-btn ${saved ? "saved" : ""}`}
                title={saved ? "Remove from Favorites" : "Save Destination"}
              >
                <Bookmark size={16} fill={saved ? "var(--travel-green)" : "none"} />
                <span>{saved ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        {/* Main Grid: Left Gallery + Details / Right Booking Sidebar */}
        <div className="details-layout-grid">
          {/* Main Left Content */}
          <div className="details-main-content">
            {/* Header Titles */}
            <div className="details-header-block">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge-pill-accent">{destination.badge}</span>
                <span className="badge-pill-cat">{destination.categoryName}</span>
                <span className="location-pill">
                  <MapPin size={13} /> {destination.city}, {destination.state}
                </span>
              </div>
              <h1 className="destination-name-title">{destination.name}</h1>
              <div className="ratings-stats-row">
                <div className="stars-badge">
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  <span>{destination.rating}</span>
                </div>
                <span className="reviews-count-text">
                  Based on {destination.reviews.toLocaleString()} traveler ratings
                </span>
                <span className="dot-divider">·</span>
                <span className="dist-indicator">
                  <Navigation size={13} className="text-orange" />
                  {dist !== null
                    ? `${dist.toLocaleString()} km from ${userLocation.isLive ? "your GPS location" : "Delhi"}`
                    : `${destination.city}, ${destination.state}`}
                </span>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="gallery-showcase-box">
              <div className="main-display-image">
                <img 
                  src={activeImage} 
                  alt={destination.name} 
                  className="full-photo" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = destination.image;
                  }}
                />
              </div>
              <div className="gallery-thumbs-row">
                {[destination.image, ...destination.gallery].slice(0, 4).map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`thumb-box ${activeImage === imgUrl ? "active" : ""}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${i}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Overview & Description */}
            <div className="content-card-box">
              <h3 className="section-heading">Overview & History</h3>
              <p className="overview-paragraph">{destination.description}</p>
              
              <div className="highlights-callout-grid">
                {destination.highlights.map((h, i) => (
                  <div key={i} className="callout-item">
                    <CheckCircle2 size={18} className="callout-icon" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Visit Info Strip */}
            <div className="key-specs-grid">
              <div className="spec-card">
                <Calendar className="spec-icon text-green" size={24} />
                <div>
                  <span className="spec-label">Best Season to Visit</span>
                  <span className="spec-val">{destination.bestTime}</span>
                </div>
              </div>

              <div className="spec-card">
                <Clock className="spec-icon text-navy" size={24} />
                <div>
                  <span className="spec-label">Visiting Hours</span>
                  <span className="spec-val">{destination.openingHours}</span>
                </div>
              </div>

              <div className="spec-card">
                <IndianRupee className="spec-icon text-orange" size={24} />
                <div>
                  <span className="spec-label">Certified Entry Fee</span>
                  <span className="spec-val">
                    {destination.ticketPrice === 0 ? "Free Entry" : `₹${destination.ticketPrice} per person`}
                  </span>
                </div>
              </div>

              <div className="spec-card">
                <Plane className="spec-icon text-blue" size={24} />
                <div>
                  <span className="spec-label">Nearest Airport Hub</span>
                  <span className="spec-val">{destination.nearestAirport.name} ({destination.nearestAirport.dist})</span>
                </div>
              </div>
            </div>

            {/* Popular Activities */}
            <div className="content-card-box">
              <h3 className="section-heading">Popular Activities & Experiences</h3>
              <div className="activities-grid">
                {destination.popularActivities.map((act, i) => (
                  <div key={i} className="activity-card">
                    <div className="act-bullet">{i + 1}</div>
                    <span className="act-name">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Location & Route Map */}
            <div className="content-card-box">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="section-heading mb-0">Location & Transit Route</h3>
                <Link to={`/map?dest=${destination.id}`} className="btn btn-outline btn-sm">
                  <Navigation size={14} /> Fullscreen Live Map
                </Link>
              </div>
              <p className="text-muted small mb-3">
                Showing direct geodesic route between your GPS coordinates ({userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)}) and {destination.name}.
              </p>
              <MapComponent userLocation={userLocation} destination={destination} height="380px" />
            </div>
          </div>

          {/* Right Sticky Booking & Actions Card */}
          <div className="details-sidebar-col">
            <div className="booking-sticky-card">
              <div className="price-header-strip">
                <div>
                  <span className="from-label">Certified Entry Pass</span>
                  <div className="price-big">
                    {destination.ticketPrice === 0 ? "Free Access" : `₹${destination.ticketPrice}`}
                    <span className="per-person"> / person</span>
                  </div>
                </div>
                <div className="rating-pill-right">
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  <span>{destination.rating}</span>
                </div>
              </div>

              <div className="badge-guarantee">
                <ShieldCheck size={18} className="text-green" />
                <span>Government Certified Booking Partner</span>
              </div>

              <div className="sidebar-buttons-stack">
                <button 
                  onClick={() => setTicketModalOpen(true)}
                  className="btn btn-primary w-100"
                >
                  <Ticket size={18} />
                  <span>Book Monument Pass</span>
                </button>

                <button 
                  onClick={() => navigate(`/plan?dest=${destination.id}`)}
                  className="btn btn-secondary w-100"
                >
                  <Route size={18} />
                  <span>Add to Custom Trip Planner</span>
                </button>

                <button 
                  onClick={() => navigate(`/map?dest=${destination.id}`)}
                  className="btn btn-outline w-100"
                >
                  <Navigation size={18} />
                  <span>Get Live Directions</span>
                </button>
              </div>

              {/* Transit Recommendations */}
              <div className="transit-teaser-box">
                <span className="teaser-heading">Connected Transit Options:</span>
                <div className="transit-links-list">
                  <Link to={`/flights?to=${encodeURIComponent(destination.city)}`} className="transit-row-link">
                    <Plane size={15} className="text-blue" />
                    <span>Search Flights to {destination.city}</span>
                  </Link>
                  <Link to={`/trains?to=${encodeURIComponent(destination.city)}`} className="transit-row-link">
                    <Train size={15} className="text-navy" />
                    <span>Search Trains to {destination.city}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Booking Demonstration Modal */}
      {ticketModalOpen && (
        <div className="travel-modal-overlay">
          <div className="travel-modal-box">
            <div className="modal-header">
              <div className="d-flex align-items-center gap-2">
                <Ticket size={22} className="text-green" />
                <h3 className="modal-title">Official Monument Pass (Demo)</h3>
              </div>
              <button onClick={() => setTicketModalOpen(false)} className="close-btn">×</button>
            </div>

            <div className="modal-body">
              {!isProcessingPass && !passBooked && (
                <form onSubmit={handleBookPass}>
                  <div className="p-3 bg-light rounded-3 mb-3">
                    <h4 className="mb-1 text-navy">{destination.name}</h4>
                    <p className="text-muted small mb-0">{destination.city}, {destination.state} · Open {destination.openingHours}</p>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Number of Visitors:</label>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm px-3"
                        onClick={() => setPassCount(Math.max(1, passCount - 1))}
                      >
                        -
                      </button>
                      <span className="fw-bold fs-5">{passCount} Travelers</span>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm px-3"
                        onClick={() => setPassCount(passCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Visitor Registration */}
                  <div className="p-3 border rounded-3 mb-3 bg-white">
                    <div className="d-flex align-items-center gap-2 mb-2 text-navy fw-bold small">
                      <User size={15} className="text-green" />
                      <span>Primary Visitor Registration</span>
                    </div>

                    <div className="mb-2">
                      <label className="small text-muted d-block mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="form-control form-control-sm"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <label className="small text-muted d-block mb-1">Mobile (+91) *</label>
                        <input 
                          type="tel" 
                          maxLength={10}
                          required
                          value={visitorMobile}
                          onChange={(e) => setVisitorMobile(e.target.value.replace(/\D/g, ''))}
                          className="form-control form-control-sm"
                          placeholder="10-digit number"
                        />
                      </div>
                      <div className="col-6">
                        <label className="small text-muted d-block mb-1">Email *</label>
                        <input 
                          type="email" 
                          required
                          value={visitorEmail}
                          onChange={(e) => setVisitorEmail(e.target.value)}
                          className="form-control form-control-sm"
                          placeholder="rahul.sharma@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Selection */}
                  <div className="p-3 border rounded-3 mb-3 bg-white">
                    <div className="d-flex align-items-center gap-2 mb-2 text-navy fw-bold small">
                      <CreditCard size={15} className="text-green" />
                      <span>Select Payment Method</span>
                    </div>

                    <div className="d-flex gap-2 mb-2">
                      <button 
                        type="button" 
                        onClick={() => setPaymentMethod("upi")}
                        className={`btn btn-sm ${paymentMethod === "upi" ? "btn-success" : "btn-outline-secondary"}`}
                      >
                        <Smartphone size={13} className="me-1" /> UPI
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPaymentMethod("card")}
                        className={`btn btn-sm ${paymentMethod === "card" ? "btn-success" : "btn-outline-secondary"}`}
                      >
                        <CreditCard size={13} className="me-1" /> Card
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPaymentMethod("netbanking")}
                        className={`btn btn-sm ${paymentMethod === "netbanking" ? "btn-success" : "btn-outline-secondary"}`}
                      >
                        <Building2 size={13} className="me-1" /> Net Banking
                      </button>
                    </div>

                    {paymentMethod === "upi" && (
                      <div>
                        <input 
                          type="text" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="form-control form-control-sm"
                          placeholder="username@okhdfcbank"
                        />
                        <span className="text-muted small">✓ Verified Instant UPI Portal</span>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="row g-2">
                        <div className="col-12">
                          <input 
                            type="text" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="form-control form-control-sm"
                            placeholder="Card Number"
                          />
                        </div>
                        <div className="col-6">
                          <input 
                            type="text" 
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="form-control form-control-sm"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="col-6">
                          <input 
                            type="password" 
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="form-control form-control-sm"
                            placeholder="CVV"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <select 
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="form-select form-select-sm"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                      </select>
                    )}
                  </div>

                  <div className="fare-breakdown-box">
                    <div className="fare-row">
                      <span>Certified Monument Pass ({passCount} x ₹{destination.ticketPrice || 250})</span>
                      <span>₹{((destination.ticketPrice || 250) * passCount).toLocaleString()}</span>
                    </div>
                    <div className="fare-row">
                      <span>ASI Service Fee</span>
                      <span className="text-green">₹0 (Waived)</span>
                    </div>
                    <div className="fare-row total">
                      <span>Total Amount Payable</span>
                      <span className="text-green">₹{((destination.ticketPrice || 250) * passCount).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="modal-footer px-0 pb-0 mt-3 d-flex justify-content-between">
                    <button type="button" onClick={() => setTicketModalOpen(false)} className="btn btn-outline btn-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm d-flex align-items-center gap-1">
                      <Lock size={14} />
                      <span>Pay ₹{((destination.ticketPrice || 250) * passCount).toLocaleString()} & Confirm Pass</span>
                    </button>
                  </div>
                </form>
              )}

              {/* PROCESSING PASS */}
              {isProcessingPass && (
                <div className="py-4 text-center">
                  <div className="spinner-border text-success mb-2" role="status"></div>
                  <h5 className="text-navy">Processing Official Monument Pass...</h5>
                  <p className="text-muted small">Verifying payment gateway with Archaeological Survey of India (ASI)</p>
                </div>
              )}

              {/* CONFIRMED PASS */}
              {passBooked && confirmedPass && (
                <div className="py-3 text-center">
                  <div className="mb-2 text-success">
                    <CheckCircle2 size={42} className="mx-auto" />
                  </div>
                  <h4 className="text-navy mb-1">Official Monument Pass Confirmed!</h4>
                  <p className="text-muted small mb-3">Ticket with QR verification has been generated and saved.</p>

                  <div className="p-3 bg-light rounded-3 text-start small mb-3">
                    <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                      <strong>{confirmedPass.title}</strong>
                      <span className="text-success fw-bold">{confirmedPass.pnr}</span>
                    </div>
                    <div>Visitor: <strong>{visitorName} ({passCount} Visitors)</strong></div>
                    <div>Location: <strong>{destination.city}, {destination.state}</strong></div>
                    <div>Total Paid: <strong className="text-success">₹{confirmedPass.fare?.toLocaleString()}</strong></div>
                    <div className="mt-2 text-success">
                      ✓ E-Ticket pass dispatched to +91 {visitorMobile} and {visitorEmail}
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-2">
                    <Link to="/my-trips" onClick={() => setTicketModalOpen(false)} className="btn btn-primary btn-sm">
                      <Ticket size={15} /> View in My Trips
                    </Link>
                    <button onClick={() => setTicketModalOpen(false)} className="btn btn-outline btn-sm">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dest-details-page {
          padding-bottom: 90px;
        }

        .details-top-bar {
          background: white;
          border-bottom: 1px solid var(--border-color);
          padding: 14px 0;
        }

        .top-bar-inner {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--primary-navy);
          cursor: pointer;
        }

        .back-link-btn:hover {
          background: #F1F5F9;
        }

        .breadcrumb-trail {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .breadcrumb-trail a {
          color: var(--text-muted);
        }

        .breadcrumb-trail a:hover {
          color: var(--travel-green);
        }

        .current-crumb {
          color: var(--primary-navy);
          font-weight: 700;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .action-icon-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1.5px solid var(--border-color);
          padding: 7px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary-navy);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-icon-btn:hover {
          border-color: var(--travel-green);
        }

        .action-icon-btn.saved {
          border-color: var(--travel-green);
          color: var(--travel-green);
          background: var(--travel-green-light);
        }

        .toast-pill {
          position: absolute;
          top: 100%;
          left: 0;
          background: var(--primary-navy);
          color: white;
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          white-space: nowrap;
          margin-top: 4px;
        }

        .details-layout-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 36px;
        }

        .details-header-block {
          margin-bottom: 24px;
        }

        .badge-pill-accent {
          background: var(--accent-orange-light);
          color: #C25E1A;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .badge-pill-cat {
          background: var(--travel-green-light);
          color: var(--travel-green-dark);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }

        .location-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .destination-name-title {
          font-size: 2.5rem;
          color: var(--primary-navy);
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .ratings-stats-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          flex-wrap: wrap;
        }

        .stars-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #FEF3C7;
          color: #B45309;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .reviews-count-text {
          color: var(--text-muted);
        }

        .dot-divider {
          color: #CBD5E1;
        }

        .dist-indicator {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--text-main);
          font-weight: 600;
        }

        /* Gallery Showcase */
        .gallery-showcase-box {
          margin-bottom: 30px;
        }

        .main-display-image {
          height: 440px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: #0f172a;
          box-shadow: var(--shadow-md);
          margin-bottom: 12px;
        }

        .full-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-thumbs-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .thumb-box {
          height: 90px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .thumb-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumb-box.active {
          border-color: var(--travel-green);
          box-shadow: 0 0 0 2px rgba(21, 155, 117, 0.3);
        }

        .content-card-box {
          background: white;
          border-radius: var(--radius-xl);
          padding: 30px;
          border: 1px solid var(--border-color);
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }

        .section-heading {
          font-size: 1.35rem;
          margin-bottom: 16px;
        }

        .overview-paragraph {
          font-size: 1.05rem;
          color: #334155;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .highlights-callout-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .callout-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F8FAFC;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          border: 1px solid #E2E8F0;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--primary-navy);
        }

        .callout-icon {
          color: var(--travel-green);
          flex-shrink: 0;
        }

        .key-specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .spec-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 20px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: flex-start;
          gap: 14px;
          box-shadow: var(--shadow-sm);
        }

        .spec-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .spec-label {
          display: block;
          font-size: 0.76rem;
          text-transform: uppercase;
          color: var(--text-light);
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .spec-val {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--primary-navy);
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .activity-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #F8FAFC;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .act-bullet {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--travel-green);
          color: white;
          font-weight: 800;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .act-name {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--primary-navy);
        }

        /* Sticky Booking Sidebar */
        .booking-sticky-card {
          position: sticky;
          top: calc(var(--header-height) + 20px);
          background: white;
          border-radius: var(--radius-xl);
          padding: 28px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
        }

        .price-header-strip {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .from-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-light);
          font-weight: 700;
        }

        .price-big {
          font-size: 1.7rem;
          font-weight: 800;
          color: var(--primary-navy);
          font-family: var(--font-heading);
        }

        .per-person {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .rating-pill-right {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #FEF3C7;
          color: #B45309;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--radius-md);
        }

        .badge-guarantee {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--travel-green-light);
          color: var(--travel-green-dark);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
        }

        .sidebar-buttons-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .transit-teaser-box {
          padding-top: 18px;
          border-top: 1px solid var(--border-color);
        }

        .teaser-heading {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .transit-links-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .transit-row-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          background: #F8FAFC;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary-navy);
          transition: all 0.2s ease;
        }

        .transit-row-link:hover {
          background: var(--travel-green-light);
          color: var(--travel-green-dark);
        }

        @media (max-width: 992px) {
          .details-layout-grid {
            grid-template-columns: 1fr;
          }
          .main-display-image {
            height: 320px;
          }
          .destination-name-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
