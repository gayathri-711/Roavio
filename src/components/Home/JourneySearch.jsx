import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRightLeft, 
  Search,
  ArrowRight
} from "lucide-react";

export default function JourneySearch() {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState("New Delhi");
  const [destination, setDestination] = useState("Munnar, Kerala");
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [travelers, setTravelers] = useState("2 Travelers");
  const [validationError, setValidationError] = useState("");

  const popularCities = [
    "New Delhi",
    "Mumbai, Maharashtra",
    "Bengaluru, Karnataka",
    "Kochi, Kerala",
    "Jaipur, Rajasthan",
    "Kolkata, West Bengal",
    "Chennai, Tamil Nadu",
    "Hyderabad, Telangana",
    "Agra, Uttar Pradesh",
    "Munnar, Kerala",
    "Goa",
    "Manali, Himachal Pradesh",
    "Shimla, Himachal Pradesh",
    "Varanasi, Uttar Pradesh",
    "Leh Ladakh"
  ];

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(destination);
    setDestination(temp);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!fromLocation.trim() || !destination.trim()) {
      setValidationError("Please select both origin and destination.");
      return;
    }
    setValidationError("");

    // Navigate to plan-journey with query params
    const params = new URLSearchParams({
      from: fromLocation,
      to: destination,
      date: travelDate,
      travelers: travelers
    });
    navigate(`/plan-journey?${params.toString()}`);
  };

  return (
    <div className="journey-search-wrapper">
      {validationError && (
        <div className="search-error-msg">{validationError}</div>
      )}

      <form onSubmit={handleSearchSubmit} className="journey-search-card">
        {/* Field 1: From Location */}
        <div className="search-field-group">
          <label className="field-label">From Location</label>
          <div className="field-input-box">
            <MapPin size={18} className="field-icon text-navy" />
            <input 
              type="text" 
              list="from-cities-list"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="Enter Origin City"
              className="field-input"
              required
            />
            <datalist id="from-cities-list">
              {popularCities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Swap Button */}
        <div className="search-swap-wrap">
          <button 
            type="button" 
            onClick={handleSwap} 
            className="swap-icon-btn" 
            title="Swap Origin and Destination"
          >
            <ArrowRightLeft size={16} />
          </button>
        </div>

        {/* Field 2: Destination */}
        <div className="search-field-group">
          <label className="field-label">Destination</label>
          <div className="field-input-box">
            <MapPin size={18} className="field-icon text-green" />
            <input 
              type="text" 
              list="to-cities-list"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to go?"
              className="field-input"
              required
            />
            <datalist id="to-cities-list">
              {popularCities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Field 3: Travel Date */}
        <div className="search-field-group date-group">
          <label className="field-label">Travel Date</label>
          <div className="field-input-box">
            <Calendar size={18} className="field-icon" />
            <input 
              type="date" 
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="field-input date-input"
              required
            />
          </div>
        </div>

        {/* Field 4: Number of Travelers */}
        <div className="search-field-group travelers-group">
          <label className="field-label">Travelers</label>
          <div className="field-input-box">
            <Users size={18} className="field-icon" />
            <select 
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="field-select"
            >
              <option value="1 Solo Traveler">1 Solo Traveler</option>
              <option value="2 Travelers">2 Travelers</option>
              <option value="3 Travelers">3 Travelers</option>
              <option value="4+ Family/Group">4+ Family / Group</option>
            </select>
          </div>
        </div>

        {/* Field 5: Search Button */}
        <div className="search-action-wrap">
          <button type="submit" className="search-journey-btn">
            <span>Search Journey</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      <style>{`
        .journey-search-wrapper {
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .search-error-msg {
          background: #FEE2E2;
          color: #B91C1C;
          border: 1px solid #FECACA;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.84rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 0.6rem;
        }

        .journey-search-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
          display: grid;
          grid-template-columns: 1.2fr auto 1.2fr 1fr 1fr auto;
          gap: 1rem;
          align-items: flex-end;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .search-field-group {
          display: flex;
          flex-direction: column;
        }

        .field-label {
          font-size: 0.74rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748B;
          margin-bottom: 0.45rem;
        }

        .field-input-box {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.6rem 0.8rem;
          transition: all 0.2s ease;
        }

        .field-input-box:focus-within {
          border-color: var(--color-green);
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.15);
        }

        .field-icon {
          color: #94A3B8;
          margin-right: 0.55rem;
          flex-shrink: 0;
        }

        .field-icon.text-navy {
          color: var(--color-navy);
        }

        .field-icon.text-green {
          color: var(--color-green);
        }

        .field-input, .field-select {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-navy);
          outline: none;
        }

        .field-input::placeholder {
          color: #94A3B8;
          font-weight: 400;
        }

        .search-swap-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 0.35rem;
        }

        .swap-icon-btn {
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
          transition: all 0.25s ease;
        }

        .swap-icon-btn:hover {
          background: var(--color-green);
          color: white;
          border-color: var(--color-green);
          transform: rotate(180deg);
        }

        .search-action-wrap {
          display: flex;
          align-items: flex-end;
        }

        .search-journey-btn {
          background: var(--color-green);
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          padding: 0.78rem 1.4rem;
          font-size: 0.94rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 6px 18px rgba(21, 155, 117, 0.35);
          white-space: nowrap;
          height: 44px;
        }

        .search-journey-btn:hover {
          background: #118262;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(21, 155, 117, 0.45);
        }

        @media (max-width: 1024px) {
          .journey-search-card {
            grid-template-columns: 1fr 1fr;
          }

          .search-swap-wrap {
            display: none;
          }

          .search-action-wrap {
            grid-column: 1 / -1;
          }

          .search-journey-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .journey-search-card {
            grid-template-columns: 1fr;
            padding: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
