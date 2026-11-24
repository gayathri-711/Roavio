import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plane, 
  Train, 
  Bus, 
  Clock, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  X,
  CreditCard,
  Lock,
  Smartphone,
  Building2,
  User,
  Mail,
  Phone,
  Ticket,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useTrips } from "../context/TripsContext";
import { useAuth } from "../context/AuthContext";

export default function TravelCard({ item, type }) {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { addBooking } = useTrips();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedClass, setSelectedClass] = useState(item.classes ? item.classes[0] : null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Traveler Registration State
  const [passengerName, setPassengerName] = useState(user?.name || "Rahul Sharma");
  const [passengerAge, setPassengerAge] = useState(28);
  const [passengerGender, setPassengerGender] = useState("Male");
  const [passengerMobile, setPassengerMobile] = useState(user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : "9876543210");
  const [passengerEmail, setPassengerEmail] = useState(user?.email || "rahul.sharma@example.com");
  const [berthPreference, setBerthPreference] = useState(type === "train" ? "Lower Berth" : "Window Seat");

  // Keep passenger fields synced when user logs in
  useEffect(() => {
    if (user) {
      if (user.name) setPassengerName(user.name);
      if (user.phone) setPassengerMobile(user.phone.replace(/\D/g, '').slice(-10));
      if (user.email) setPassengerEmail(user.email);
    }
  }, [user]);

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" | "card" | "netbanking"
  const [upiId, setUpiId] = useState("traveler@okaxis");
  const [upiApp, setUpiApp] = useState("gpay");
  const [cardNumber, setCardNumber] = useState("4532 8920 1142 8821");
  const [cardExpiry, setCardExpiry] = useState("11/29");
  const [cardCvv, setCardCvv] = useState("824");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  const handleConfirmBooking = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!user) {
      alert("Please log in to your account before proceeding with payment.");
      return;
    }
    if (!passengerName.trim() || !passengerMobile.trim() || !passengerEmail.trim()) {
      alert("Please fill in passenger full name, 10-digit mobile number, and email address.");
      return;
    }

    setIsProcessing(true);

    let title = "";
    let fare = item.price || item.fare;
    let seat = "12A";

    if (type === "flight") {
      title = `${item.airline} ${item.flightNumber} (${item.fromCode} ➔ ${item.toCode})`;
      fare = item.price;
      seat = berthPreference === "Window Seat" ? "14A (Window)" : "14C (Aisle)";
    } else if (type === "train") {
      title = `${item.trainName} (${item.trainNumber}) - ${selectedClass?.name || "CC"}`;
      fare = selectedClass?.fare || 1450;
      seat = `Coach B2, Seat 32 (${berthPreference})`;
    } else if (type === "bus") {
      title = `${item.operator} (${item.busType})`;
      fare = item.fare;
      seat = selectedSeat ? `Seat ${selectedSeat.number} (${selectedSeat.deck || "Lower"} Deck)` : "Seat U4 (Upper Sleeper)";
    }

    const bookingPayload = {
      category: type,
      title,
      providerName: item.airline || item.trainName || item.operator,
      sourceLocation: item.fromCity,
      destination: item.toCity,
      travelDate: new Date().toISOString().split("T")[0],
      travelTime: item.departureTime,
      passengers: 1,
      leadPassenger: passengerName,
      mobileNumber: passengerMobile,
      email: passengerEmail,
      seatClass: seat,
      amount: fare,
      paymentStatus: `Verified (${paymentMethod.toUpperCase()})`,
      bookingStatus: "Confirmed"
    };

    try {
      // 1. Backend API dispatch
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });
      const data = await res.json();

      const pnrCode = data?.booking?.providerReference || (type === "flight" ? `ROA-FLT-${Math.floor(1000 + Math.random() * 9000)}` : type === "train" ? `ROA-IRCTC-${Math.floor(1000 + Math.random() * 9000)}` : `ROA-BUS-${Math.floor(1000 + Math.random() * 9000)}`);
      const bookingId = data?.booking?.bookingId || `BK-${Math.floor(10000 + Math.random() * 90000)}`;

      const confirmedObj = {
        ...bookingPayload,
        id: bookingId,
        pnr: pnrCode,
        category: type === "flight" ? "Flight Booking" : type === "train" ? "Train Booking" : "Bus Booking",
        route: `${item.fromCity} ➔ ${item.toCity}`,
        date: new Date().toISOString().split("T")[0],
        fare,
        seat,
        operator: item.airline || item.trainName || item.operator
      };

      // 2. Add to TripsContext local store
      addBooking(confirmedObj);

      setTimeout(() => {
        setIsProcessing(false);
        setBookedSuccess(true);
        setConfirmedBooking(confirmedObj);
      }, 1200);

    } catch (err) {
      console.warn("Booking API fallback:", err);
      const fallbackObj = addBooking({
        type,
        category: type === "flight" ? "Flight Booking" : type === "train" ? "Train Booking" : "Bus Booking",
        title,
        route: `${item.fromCity} ➔ ${item.toCity}`,
        date: new Date().toISOString().split("T")[0],
        passengers: 1,
        fare,
        seat,
        operator: item.airline || item.trainName || item.operator,
        leadPassenger: passengerName,
        mobileNumber: passengerMobile,
        email: passengerEmail,
        pnr: type === "flight" ? `ROA-FLT-${Math.floor(1000 + Math.random() * 9000)}` : type === "train" ? `ROA-IRCTC-${Math.floor(1000 + Math.random() * 9000)}` : `ROA-BUS-${Math.floor(1000 + Math.random() * 9000)}`
      });

      setTimeout(() => {
        setIsProcessing(false);
        setBookedSuccess(true);
        setConfirmedBooking(fallbackObj);
      }, 1200);
    }
  };

  return (
    <>
      <div className="roavio-travel-card">
        {/* Left: Carrier Brand & Name */}
        <div className="travel-col-brand">
          <div className="brand-badge-box">
            {type === "flight" && <Plane size={24} className="text-green" />}
            {type === "train" && <Train size={24} className="text-navy" />}
            {type === "bus" && <Bus size={24} className="text-orange" />}
          </div>
          <div className="brand-meta">
            <h4 className="carrier-name">{item.airline || item.trainName || item.operator}</h4>
            <span className="carrier-code">
              {item.flightNumber || `#${item.trainNumber}` || item.busType}
            </span>
            {item.rating && (
              <span className="rating-tag">★ {item.rating} ({item.reviewsCount || 420})</span>
            )}
          </div>
        </div>

        {/* Center: Timing & Route */}
        <div className="travel-col-timeline">
          <div className="time-block from-block">
            <span className="time-val">{item.departureTime}</span>
            <span className="city-val">{item.fromCode || item.fromCity}</span>
            <span className="station-sub">{item.fromAirport || item.fromStation || item.boardingPoint}</span>
          </div>

          <div className="duration-line-block">
            <span className="duration-label">{item.duration}</span>
            <div className="route-indicator">
              <span className="dot dot-left"></span>
              <div className="line"></div>
              <span className="dot dot-right"></span>
            </div>
            <span className="stops-label">{item.stops || item.type || "Direct Express"}</span>
          </div>

          <div className="time-block to-block">
            <span className="time-val">{item.arrivalTime}</span>
            <span className="city-val">{item.toCode || item.toCity}</span>
            <span className="station-sub">{item.toAirport || item.toStation || item.droppingPoint}</span>
          </div>
        </div>

        {/* Right: Pricing & Action */}
        <div className="travel-col-pricing">
          <div className="price-display">
            <span className="currency-label">Fare from</span>
            <span className="price-num">
              ₹{(item.price || item.fare || (selectedClass ? selectedClass.fare : 1200)).toLocaleString()}
            </span>
            <span className="seat-avail-tag">
              {item.seatsAvailable ? `${item.seatsAvailable} seats left` : "Available"}
            </span>
          </div>

          <button onClick={() => setModalOpen(true)} className="book-action-btn">
            <span>{type === "bus" ? "Select Seat" : type === "train" ? "Select Class" : "Book Demo"}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Booking Demonstration Modal */}
      {modalOpen && (
        <div className="travel-modal-overlay">
          <div className="travel-modal-box">
            <div className="modal-header">
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={22} className="text-green" />
                <h3 className="modal-title">
                  {type === "flight" ? "Flight Reservation (Demo)" : type === "train" ? "Train Ticket Booking (Demo)" : "Select Bus Seat (Demo)"}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="route-summary-banner">
                <div className="banner-carrier">
                  <strong>{item.airline || item.trainName || item.operator}</strong>
                  <span>{item.flightNumber || item.trainNumber || item.busType}</span>
                </div>
                <div className="banner-route">
                  <span>{item.fromCity}</span> ➔ <span>{item.toCity}</span>
                  <div className="text-muted small">{item.departureTime} – {item.arrivalTime} ({item.duration})</div>
                </div>
              </div>

              {/* Train Class Selector */}
              {type === "train" && item.classes && (
                <div className="class-selector-section">
                  <label className="section-label">Select Travel Class:</label>
                  <div className="class-cards-grid">
                    {item.classes.map((cls) => (
                      <div
                        key={cls.code}
                        onClick={() => setSelectedClass(cls)}
                        className={`class-card ${selectedClass?.code === cls.code ? "selected" : ""}`}
                      >
                        <div className="cls-code">{cls.code}</div>
                        <div className="cls-name">{cls.name}</div>
                        <div className="cls-fare">₹{cls.fare.toLocaleString()}</div>
                        <div className={`cls-status text-${cls.color}`}>{cls.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bus Seat Layout Demo */}
              {type === "bus" && item.seatLayout && (
                <div className="bus-seat-demo-section">
                  <label className="section-label">Interactive Seat Selection Demo:</label>
                  <p className="seat-note text-muted small mb-2">Click an available seat to select:</p>
                  
                  <div className="bus-deck-wrapper">
                    <span className="deck-title">Lower Deck</span>
                    <div className="deck-grid">
                      {item.seatLayout.lower.map((seat) => (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={seat.status === "booked"}
                          onClick={() => setSelectedSeat(seat)}
                          className={`seat-box ${seat.status} ${selectedSeat?.id === seat.id ? "selected" : ""}`}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>

                  {item.seatLayout.upper && item.seatLayout.upper.length > 0 && (
                    <div className="bus-deck-wrapper mt-3">
                      <span className="deck-title">Upper Sleeper Deck</span>
                      <div className="deck-grid">
                        {item.seatLayout.upper.map((seat) => (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={seat.status === "booked"}
                            onClick={() => setSelectedSeat(seat)}
                            className={`seat-box ${seat.status} ${selectedSeat?.id === seat.id ? "selected" : ""}`}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="seat-legend mt-3">
                    <span className="leg-item"><span className="box available"></span> Available</span>
                    <span className="leg-item"><span className="box selected"></span> Selected</span>
                    <span className="leg-item"><span className="box booked"></span> Booked</span>
                  </div>
                </div>
              )}

              {/* 1. TRAVELER REGISTRATION DETAILS & PAYMENT LOGIN GATE */}
              {!isProcessing && !bookedSuccess && (
                !user ? (
                  <div className="checkout-login-gate p-4 text-center bg-light rounded-3 my-3">
                    <div className="gate-icon-circle mx-auto mb-3" style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={28} />
                    </div>
                    <h4 className="text-navy mb-2" style={{ fontWeight: 800 }}>Login Required to Complete Payment</h4>
                    <p className="text-muted small mb-4" style={{ maxWidth: '440px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
                      To securely authorize your payment and issue confirmed {type.toUpperCase()} tickets directly to your traveler dashboard, please sign in.
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
                          navigate("/login", { state: { from: { pathname: window.location.pathname, search: window.location.search } } });
                        }}
                        className="btn btn-outline d-flex align-items-center justify-content-center gap-2 py-2"
                      >
                        <User size={16} />
                        <span>Log In with Password or OTP ↗</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="traveler-reg-box mt-3">
                    <div className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3 mb-3 small" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534' }}>
                      <div className="d-flex align-items-center gap-2">
                        <CheckCircle2 size={16} />
                        <span>Signed in as <strong>{user.name}</strong> ({user.email})</span>
                      </div>
                      <span className="badge bg-success text-white">Verified Traveler</span>
                    </div>

                    <div className="reg-box-header">
                      <User size={16} className="text-green" />
                      <strong>Passenger Registration Details</strong>
                    </div>

                  <div className="travel-form-grid">
                    <div className="form-group">
                      <label className="field-lbl">Passenger Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="modal-txt-input" 
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>

                    <div className="form-row-mini">
                      <div className="form-group">
                        <label className="field-lbl">Age</label>
                        <input 
                          type="number" 
                          min={1} 
                          max={110}
                          value={passengerAge}
                          onChange={(e) => setPassengerAge(Number(e.target.value))}
                          className="modal-txt-input" 
                        />
                      </div>
                      <div className="form-group">
                        <label className="field-lbl">Gender</label>
                        <select 
                          value={passengerGender}
                          onChange={(e) => setPassengerGender(e.target.value)}
                          className="modal-txt-input"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="travel-form-grid mt-2">
                    <div className="form-group">
                      <label className="field-lbl">Mobile Number (for SMS & E-Ticket) *</label>
                      <div className="checkout-phone-input-group">
                        <div className="phone-country-code">
                          <span className="flag-icon">🇮🇳</span>
                          <span className="code-text">+91</span>
                        </div>
                        <input 
                          type="tel" 
                          maxLength={10}
                          required
                          value={passengerMobile}
                          onChange={(e) => setPassengerMobile(e.target.value.replace(/\D/g, ''))}
                          className="checkout-phone-input" 
                          placeholder="10-digit number"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="field-lbl">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        className="modal-txt-input" 
                        placeholder="rahul.sharma@example.com"
                      />
                    </div>
                  </div>

                  {/* Seat / Berth Preferences */}
                  <div className="form-group mt-2">
                    <label className="field-lbl">
                      {type === "flight" ? "Seat Preference" : type === "train" ? "Berth Choice" : "Seat Notes"}
                    </label>
                    <select 
                      value={berthPreference}
                      onChange={(e) => setBerthPreference(e.target.value)}
                      className="modal-txt-input"
                    >
                      {type === "train" && (
                        <>
                          <option value="Lower Berth">Lower Berth (Senior / Preferred)</option>
                          <option value="Middle Berth">Middle Berth</option>
                          <option value="Upper Berth">Upper Berth</option>
                          <option value="Side Lower">Side Lower Window</option>
                        </>
                      )}
                      {type === "flight" && (
                        <>
                          <option value="Window Seat">Window Seat (14A)</option>
                          <option value="Aisle Seat">Aisle Seat (14C)</option>
                          <option value="Extra Legroom">Extra Legroom (Row 1)</option>
                        </>
                      )}
                      {type === "bus" && (
                        <>
                          <option value="Window Sleeper">Window Sleeper</option>
                          <option value="Aisle Semi-Sleeper">Aisle Semi-Sleeper</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 2. PAYMENT METHOD SELECTION */}
                  <div className="payment-select-section mt-3">
                    <div className="reg-box-header">
                      <CreditCard size={16} className="text-green" />
                      <strong>Payment Method & Instant Ticket Confirmation</strong>
                    </div>

                    <div className="pay-mini-tabs">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`pay-tab-chip ${paymentMethod === "upi" ? "active" : ""}`}
                      >
                        <Smartphone size={14} /> UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`pay-tab-chip ${paymentMethod === "card" ? "active" : ""}`}
                      >
                        <CreditCard size={14} /> Debit / Credit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("netbanking")}
                        className={`pay-tab-chip ${paymentMethod === "netbanking" ? "active" : ""}`}
                      >
                        <Building2 size={14} /> Net Banking
                      </button>
                    </div>

                    {paymentMethod === "upi" && (
                      <div className="mini-pay-box">
                        <div className="form-group mb-1">
                          <label className="small-lbl">UPI ID (Google Pay / PhonePe / Paytm):</label>
                          <input 
                            type="text" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="modal-txt-input" 
                            placeholder="username@okhdfcbank"
                          />
                        </div>
                        <span className="text-muted small">✓ Instant one-click confirmation without transaction fee</span>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="mini-pay-box">
                        <div className="form-group mb-2">
                          <label className="small-lbl">Card Number (Visa / MasterCard / RuPay):</label>
                          <input 
                            type="text" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="modal-txt-input" 
                          />
                        </div>
                        <div className="form-row-mini">
                          <div className="form-group">
                            <label className="small-lbl">Expiry (MM/YY)</label>
                            <input 
                              type="text" 
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="modal-txt-input" 
                            />
                          </div>
                          <div className="form-group">
                            <label className="small-lbl">CVV</label>
                            <input 
                              type="password" 
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="modal-txt-input" 
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <div className="mini-pay-box">
                        <label className="small-lbl mb-1 d-block">Select Bank:</label>
                        <select 
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="modal-txt-input"
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="State Bank of India">State Bank of India</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra">Kotak Mahindra</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* 3. Fare Breakdown */}
                  <div className="fare-breakdown-box mt-3">
                    <div className="fare-row">
                      <span>Base Ticket Fare ({type.toUpperCase()})</span>
                      <span>₹{(selectedClass?.fare || item.price || item.fare || 1400).toLocaleString()}</span>
                    </div>
                    <div className="fare-row">
                      <span>Carrier Reservation Fee & Taxes</span>
                      <span className="text-green">₹0 (Promo Waived)</span>
                    </div>
                    <div className="fare-row total">
                      <span>Total Payable Amount</span>
                      <span className="text-green">₹{(selectedClass?.fare || item.price || item.fare || 1400).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                )
              )}

              {/* PROCESSING STATE */}
              {isProcessing && (
                <div className="payment-processing-splash py-4 text-center">
                  <div className="pulse-spinner"></div>
                  <h4>Authorizing Payment & Issuing E-Ticket...</h4>
                  <p className="text-muted small">Verifying transaction with Bank & Carrier gateway ({item.airline || item.trainName || item.operator})</p>
                  <div className="secure-pill d-inline-flex align-items-center gap-1 small text-muted">
                    <Lock size={12} /> 256-Bit SSL Encrypted
                  </div>
                </div>
              )}

              {/* CONFIRMED E-TICKET SCREEN */}
              {bookedSuccess && confirmedBooking && (
                <div className="confirmed-ticket-splash text-center py-3">
                  <div className="check-bubble">
                    <Check size={28} />
                  </div>
                  <h3 className="text-navy mb-1">{type.toUpperCase()} Ticket Confirmed!</h3>
                  <p className="text-muted small mb-3">Official Roavio verified E-Ticket has been issued.</p>

                  <div className="confirmed-card-box text-start p-3 bg-light rounded-3">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <div>
                        <span className="small text-muted">{item.airline || item.trainName || item.operator}</span>
                        <h5 className="mb-0 text-navy">{confirmedBooking.title}</h5>
                      </div>
                      <div className="text-end">
                        <span className="small text-muted">PNR NUMBER</span>
                        <div className="fw-bold text-success fs-6">{confirmedBooking.pnr}</div>
                      </div>
                    </div>

                    <div className="row g-2 small">
                      <div className="col-6">
                        <span className="text-muted d-block">Passenger</span>
                        <strong>{passengerName} ({passengerAge}y, {passengerGender})</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Assigned Seat</span>
                        <strong>{confirmedBooking.seat}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Departure Route</span>
                        <strong>{item.fromCity} ➔ {item.toCity}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Amount Paid</span>
                        <strong className="text-green">₹{confirmedBooking.fare?.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-top text-success small d-flex align-items-center gap-1">
                      <CheckCircle2 size={15} />
                      <span>E-Ticket dispatched to +91 {passengerMobile} and {passengerEmail}</span>
                    </div>
                  </div>

                  <div className="mt-3 d-flex justify-content-center gap-2">
                    <Link to="/my-trips" onClick={() => setModalOpen(false)} className="btn btn-primary btn-sm">
                      <Ticket size={15} /> View in My Trips
                    </Link>
                    <button onClick={() => setModalOpen(false)} className="btn btn-outline btn-sm">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!bookedSuccess && (
              <div className="modal-footer">
                <button 
                  onClick={() => setModalOpen(false)} 
                  disabled={isProcessing} 
                  className="btn btn-outline btn-sm"
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
                    className="btn btn-primary btn-sm btn-pay-confirm-sm"
                  >
                    <Sparkles size={14} />
                    <span>Log In to Proceed with Payment</span>
                  </button>
                ) : (
                  <button 
                    onClick={handleConfirmBooking} 
                    disabled={isProcessing}
                    className="btn btn-primary btn-sm btn-pay-confirm-sm"
                  >
                    <Lock size={14} />
                    <span>Pay ₹{(selectedClass?.fare || item.price || item.fare || 1400).toLocaleString()} & Confirm Ticket</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .roavio-travel-card {
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          padding: 20px 24px;
          display: grid;
          grid-template-columns: 220px 1fr 200px;
          gap: 24px;
          align-items: center;
          box-shadow: var(--shadow-sm);
          transition: all 0.25s ease;
          margin-bottom: 16px;
        }

        .roavio-travel-card:hover {
          border-color: rgba(21, 155, 117, 0.35);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .travel-col-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-badge-box {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          background: #F8FAFC;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .carrier-name {
          font-size: 1.05rem;
          color: var(--primary-navy);
          margin-bottom: 2px;
        }

        .carrier-code {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
          display: block;
        }

        .rating-tag {
          display: inline-block;
          font-size: 0.72rem;
          background: #FEF3C7;
          color: #B45309;
          padding: 1px 6px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          margin-top: 4px;
        }

        .travel-col-timeline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }

        .time-block {
          display: flex;
          flex-direction: column;
        }

        .from-block {
          text-align: left;
        }

        .to-block {
          text-align: right;
        }

        .time-val {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--primary-navy);
          font-family: var(--font-heading);
        }

        .city-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .station-sub {
          font-size: 0.74rem;
          color: var(--text-light);
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .duration-line-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 16px;
          min-width: 140px;
        }

        .duration-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .route-indicator {
          width: 100%;
          display: flex;
          align-items: center;
          position: relative;
        }

        .route-indicator .line {
          height: 2px;
          background: #CBD5E1;
          width: 100%;
        }

        .route-indicator .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--travel-green);
          flex-shrink: 0;
        }

        .stops-label {
          font-size: 0.72rem;
          color: var(--travel-green-dark);
          font-weight: 600;
          margin-top: 4px;
        }

        .travel-col-pricing {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          border-left: 1px solid #F1F5F9;
          padding-left: 20px;
        }

        .price-display {
          text-align: right;
        }

        .currency-label {
          display: block;
          font-size: 0.72rem;
          color: var(--text-light);
          text-transform: uppercase;
          font-weight: 600;
        }

        .price-num {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--primary-navy);
          font-family: var(--font-heading);
          display: block;
        }

        .seat-avail-tag {
          font-size: 0.75rem;
          color: var(--travel-green-dark);
          font-weight: 700;
        }

        .book-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--travel-green);
          color: white;
          padding: 9px 18px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .book-action-btn:hover {
          background: var(--travel-green-dark);
          transform: translateY(-2px);
        }

        /* Modal Styles */
        .travel-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 16px;
        }

        .travel-modal-box {
          background: white;
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 580px;
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          animation: popIn 0.25s ease-out;
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
          padding: 18px 24px;
          background: #F8FAFC;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title {
          font-size: 1.15rem;
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
          max-height: 75vh;
          overflow-y: auto;
        }

        .route-summary-banner {
          background: #F1F5F9;
          border-radius: var(--radius-md);
          padding: 14px 18px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .class-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 8px;
          margin-bottom: 20px;
        }

        .class-card {
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .class-card.selected {
          border-color: var(--travel-green);
          background: var(--travel-green-light);
        }

        .cls-code {
          font-weight: 800;
          color: var(--primary-navy);
        }

        .cls-name {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .cls-fare {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-top: 4px;
        }

        .deck-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          margin-top: 8px;
        }

        .seat-box {
          height: 38px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
          background: #F8FAFC;
          cursor: pointer;
        }

        .seat-box.available:hover {
          border-color: var(--travel-green);
          color: var(--travel-green);
        }

        .seat-box.selected {
          background: var(--travel-green);
          color: white;
          border-color: var(--travel-green);
        }

        .seat-box.booked {
          background: #E2E8F0;
          color: #94A3B8;
          cursor: not-allowed;
        }

        .seat-legend {
          display: flex;
          gap: 16px;
          font-size: 0.78rem;
        }

        .leg-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .leg-item .box {
          width: 14px;
          height: 14px;
          border-radius: 3px;
        }

        .leg-item .box.available { background: #F8FAFC; border: 1px solid #CBD5E1; }
        .leg-item .box.selected { background: var(--travel-green); }
        .leg-item .box.booked { background: #CBD5E1; }

        .fare-breakdown-box {
          background: #F8FAFC;
          border-radius: var(--radius-md);
          padding: 14px;
          margin-top: 18px;
        }

        .fare-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          margin-bottom: 6px;
        }

        .fare-row.total {
          border-top: 1px solid #E2E8F0;
          padding-top: 8px;
          font-weight: 800;
          font-size: 1.05rem;
          color: var(--primary-navy);
          margin-bottom: 0;
        }

        .alert-success-box {
          background: var(--travel-green-light);
          border: 1px solid var(--travel-green);
          color: var(--travel-green-dark);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
        }

        .modal-footer {
          padding: 16px 24px;
          background: #F8FAFC;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        /* Traveler Registration & Payment Mini Box Styles */
        .travel-modal-box {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 740px;
          max-height: calc(100vh - 36px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(11, 19, 43, 0.35);
          border: 1px solid #E2E8F0;
        }

        .travel-modal-box .modal-header {
          flex-shrink: 0;
          padding: 16px 22px;
          border-bottom: 1px solid #E2E8F0;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .travel-modal-box .modal-body {
          flex: 1 1 auto;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 18px 22px;
        }

        .traveler-reg-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 16px;
        }

        .reg-box-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.92rem;
          color: var(--primary-navy);
          margin-bottom: 12px;
        }

        .travel-form-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 12px;
        }

        .form-row-mini {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 10px;
        }

        @media (max-width: 680px) {
          .travel-form-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .form-row-mini {
            grid-template-columns: 1fr 1fr;
          }
          .travel-modal-box {
            max-height: calc(100vh - 16px);
            border-radius: 18px 18px 0 0;
          }
          .travel-modal-box .modal-header {
            padding: 14px 16px;
          }
          .travel-modal-box .modal-body {
            padding: 14px 16px;
          }
          .modal-footer {
            padding: 12px 16px !important;
            flex-direction: column-reverse;
          }
          .modal-footer .btn {
            width: 100% !important;
          }
        }

        .field-lbl {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 5px;
        }

        .small-lbl {
          font-size: 0.74rem;
          font-weight: 700;
          color: #64748B;
        }

        .modal-txt-input {
          width: 100%;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 0.9rem;
          color: #0F172A;
          background: white;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .modal-txt-input:focus {
          border-color: var(--travel-green);
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);
        }

        .mobile-prefix-wrap {
          position: relative;
        }

        .mob-pre {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.84rem;
          font-weight: 700;
          color: #64748B;
        }

        .modal-txt-input.ps-prefix {
          padding-left: 42px;
        }

        .pay-mini-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }

        .pay-tab-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          border-radius: 10px;
          border: 1.5px solid #CBD5E1;
          background: white;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pay-tab-chip.active {
          border-color: var(--travel-green);
          background: #ECFDF5;
          color: var(--travel-green);
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.15);
        }

        .mini-pay-box {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px 12px;
        }

        .modal-footer {
          flex-shrink: 0;
          position: sticky;
          bottom: 0;
          background: #FFFFFF;
          border-top: 1px solid var(--border-color);
          padding: 14px 22px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          z-index: 20;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
        }

        .btn-pay-confirm-sm {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 800;
        }

        .check-bubble {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #DCFCE7;
          color: #16A34A;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px;
        }

        .pulse-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #E2E8F0;
          border-top-color: var(--travel-green);
          border-radius: 50%;
          margin: 0 auto 12px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 860px) {
          .travel-form-grid, .pay-mini-tabs {
            grid-template-columns: 1fr;
          }
          .roavio-travel-card {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .travel-col-timeline {
            padding: 12px 0;
            border-top: 1px solid #F1F5F9;
            border-bottom: 1px solid #F1F5F9;
          }
          .travel-col-pricing {
            border-left: none;
            padding-left: 0;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}
