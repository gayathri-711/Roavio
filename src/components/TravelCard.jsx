import React, { useState } from "react";
import { Plane, Train, Bus, Clock, ShieldCheck, Check, ArrowRight, X } from "lucide-react";
import { useTrips } from "../context/TripsContext";

export default function TravelCard({ item, type }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedClass, setSelectedClass] = useState(item.classes ? item.classes[0] : null);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const { addBooking } = useTrips();

  const handleConfirmBooking = () => {
    let title = "";
    let fare = item.price || item.fare;
    let seat = "12A";

    if (type === "flight") {
      title = `${item.airline} ${item.flightNumber} (${item.fromCode} ➔ ${item.toCode})`;
      fare = item.price;
      seat = "14B";
    } else if (type === "train") {
      title = `${item.trainName} (${item.trainNumber}) - ${selectedClass?.name || "CC"}`;
      fare = selectedClass?.fare || 1450;
      seat = "Coach C2, Seat 28";
    } else if (type === "bus") {
      title = `${item.operator} (${item.busType})`;
      fare = item.fare;
      seat = selectedSeat ? `Seat ${selectedSeat.number}` : "Seat U4 (Upper)";
    }

    addBooking({
      type,
      category: type === "flight" ? "Flight Booking" : type === "train" ? "Train Booking" : "Bus Booking",
      title,
      route: `${item.fromCity} ➔ ${item.toCity}`,
      date: new Date().toISOString().split("T")[0],
      passengers: 1,
      fare,
      seat,
      operator: item.airline || item.trainName || item.operator
    });

    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setModalOpen(false);
    }, 1800);
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

              {/* Fare & Passenger Breakdown */}
              <div className="fare-breakdown-box">
                <div className="fare-row">
                  <span>Base Demonstration Fare</span>
                  <span>₹{(selectedClass?.fare || item.price || item.fare || 1400).toLocaleString()}</span>
                </div>
                <div className="fare-row">
                  <span>Convenience & Tax</span>
                  <span>₹0 (Waived for Demo)</span>
                </div>
                <div className="fare-row total">
                  <span>Total Payable (Demonstration)</span>
                  <span>₹{(selectedClass?.fare || item.price || item.fare || 1400).toLocaleString()}</span>
                </div>
              </div>

              {bookedSuccess && (
                <div className="alert-success-box">
                  <Check size={20} />
                  <span>Demonstration Booking Confirmed! Saved to your My Trips Dashboard.</span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setModalOpen(false)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button 
                onClick={handleConfirmBooking} 
                disabled={bookedSuccess}
                className="btn btn-primary btn-sm"
              >
                {bookedSuccess ? "Confirmed ✓" : "Confirm Booking Demo"}
              </button>
            </div>
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

        @media (max-width: 860px) {
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
