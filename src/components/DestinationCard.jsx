import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Star, Bookmark, Navigation, ArrowRight, Calendar } from "lucide-react";
import { useTrips } from "../context/TripsContext";

export default function DestinationCard({ destination }) {
  const navigate = useNavigate();
  const { isSaved, toggleSaveDestination, getDistanceFromUser, userLocation } = useTrips();

  if (!destination) return null;

  const saved = isSaved(destination.id);
  const dist = getDistanceFromUser(destination.lat, destination.lng);

  return (
    <div className="roavio-dest-card">
      {/* Media Box */}
      <div className="card-media-box">
        <img
          src={destination.image}
          alt={destination.name}
          className="dest-thumb"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/img/india-tours/amber-fort-jaipur.jpg";
          }}
        />

        {/* Top Badges */}
        <div className="media-top-bar">
          <span className="dest-badge">{destination.badge}</span>
          <button
            className={`save-heart-btn ${saved ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaveDestination(destination.id);
            }}
            title={saved ? "Remove from Saved" : "Save Destination"}
          >
            <Bookmark size={16} fill={saved ? "var(--travel-green)" : "none"} />
          </button>
        </div>

        {/* Distance Pill */}
        <div className="distance-pill">
          <Navigation size={12} className="dist-icon" />
          <span>
            {dist !== null
              ? `${dist.toLocaleString()} km from ${userLocation.isLive ? "You" : "Delhi"}`
              : destination.city}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content-box">
        <div className="location-row">
          <div className="loc-tag">
            <MapPin size={14} className="pin-icon" />
            <span>{destination.city}, {destination.state}</span>
          </div>
          <span className="category-tag">{destination.categoryName}</span>
        </div>

        <h3 className="dest-title">
          <Link to={`/destination/${destination.id}`}>{destination.name}</Link>
        </h3>

        <div className="rating-row">
          <div className="stars-pill">
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
            <span>{destination.rating}</span>
          </div>
          <span className="reviews-text">({destination.reviews.toLocaleString()} reviews)</span>
          <span className="season-pill ms-auto">
            <Calendar size={12} /> {destination.bestTime?.split("(")[0]}
          </span>
        </div>

        <p className="dest-desc">{destination.description}</p>

        {/* Highlights */}
        {destination.highlights && destination.highlights.length > 0 && (
          <div className="highlights-row">
            {destination.highlights.slice(0, 2).map((h, i) => (
              <span key={i} className="hl-chip">✓ {h}</span>
            ))}
          </div>
        )}

        {/* Pricing & CTA */}
        <div className="card-footer-box">
          <div className="price-stack">
            <span className="price-label">Entry Pass / Trip</span>
            <div className="price-amount">
              {destination.ticketPrice === 0 ? "Free Entry" : `₹${destination.ticketPrice.toLocaleString()}`}
              <span className="price-sub"> / person</span>
            </div>
          </div>

          <div className="action-buttons-group">
            <button
              onClick={() => navigate(`/plan?dest=${destination.id}`)}
              className="plan-btn"
              title="Add to Itinerary"
            >
              Plan
            </button>
            <Link to={`/destination/${destination.id}`} className="view-btn">
              <span>Explore</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .roavio-dest-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          height: 100%;
        }

        .roavio-dest-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(21, 155, 117, 0.3);
        }

        .card-media-box {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: #0f172a;
        }

        .dest-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .roavio-dest-card:hover .dest-thumb {
          transform: scale(1.06);
        }

        .media-top-bar {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }

        .dest-badge {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          color: white;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 5px 11px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .save-heart-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(6px);
          border: none;
          color: var(--primary-navy);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .save-heart-btn:hover {
          background: white;
          transform: scale(1.1);
        }

        .save-heart-btn.active {
          color: var(--travel-green);
          background: white;
        }

        .distance-pill {
          position: absolute;
          bottom: 12px;
          left: 14px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(6px);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          z-index: 2;
        }

        .dist-icon {
          color: var(--accent-orange);
        }

        .card-content-box {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .location-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
        }

        .loc-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          font-size: 0.82rem;
          font-weight: 600;
        }

        .pin-icon {
          color: var(--travel-green);
        }

        .category-tag {
          font-size: 0.72rem;
          background: #F1F5F9;
          color: var(--primary-navy);
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .dest-title {
          font-size: 1.18rem;
          margin-bottom: 8px;
          line-height: 1.35;
        }

        .dest-title a {
          color: var(--primary-navy);
        }

        .dest-title a:hover {
          color: var(--travel-green);
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 0.82rem;
        }

        .stars-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 800;
          color: #B45309;
          background: #FEF3C7;
          padding: 2px 7px;
          border-radius: var(--radius-sm);
        }

        .reviews-text {
          color: var(--text-light);
        }

        .season-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          font-size: 0.76rem;
          margin-left: auto;
        }

        .dest-desc {
          color: var(--text-muted);
          font-size: 0.88rem;
          line-height: 1.5;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .highlights-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .hl-chip {
          font-size: 0.75rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #334155;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          font-weight: 500;
        }

        .card-footer-box {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .price-label {
          display: block;
          font-size: 0.72rem;
          color: var(--text-light);
          text-transform: uppercase;
          font-weight: 700;
        }

        .price-amount {
          font-size: 1.12rem;
          font-weight: 800;
          color: var(--primary-navy);
          font-family: var(--font-heading);
        }

        .price-sub {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--text-muted);
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .plan-btn {
          background: transparent;
          border: 1.5px solid var(--border-color);
          color: var(--primary-navy);
          padding: 7px 12px;
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .plan-btn:hover {
          border-color: var(--accent-orange);
          color: var(--accent-orange);
          background: var(--accent-orange-light);
        }

        .view-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--travel-green);
          color: white;
          padding: 8px 14px;
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }

        .view-btn:hover {
          background: var(--travel-green-dark);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
