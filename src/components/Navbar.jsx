import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  User, 
  Menu, 
  X, 
  LogOut,
  Briefcase,
  Percent,
  ChevronDown,
  MapPin,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Phone,
  Mail,
  Clock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTrips } from "../context/TripsContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [offersModalOpen, setOffersModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { savedIds } = useTrips();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && (location.pathname === path || location.pathname.startsWith(path + "/"))) return true;
    if (path === "/explore-india" && (location.pathname === "/explore" || location.pathname.startsWith("/explore"))) return true;
    if (path === "/plan-journey" && (location.pathname === "/plan" || location.pathname.startsWith("/plan"))) return true;
    return false;
  };

  const copyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const promoOffers = [
    {
      code: "ROAVIO20",
      title: "First Booking Special",
      desc: "Get 20% OFF up to ₹2,500 on your first India tour package",
      tag: "POPULAR"
    },
    {
      code: "EXPLOREINDIA",
      title: "Multi-City Explorer",
      desc: "Flat ₹1,500 OFF when you book 2 or more state itineraries",
      tag: "DISCOVERY"
    },
    {
      code: "FLYBHARAT",
      title: "Domestic Flights Saver",
      desc: "Instant 12% cashback on roundtrip flights across all Indian metros",
      tag: "FLIGHTS"
    },
    {
      code: "HERITAGE",
      title: "Golden Triangle & Palaces",
      desc: "Complimentary guided monument pass on Rajasthan & Agra bookings",
      tag: "CULTURE"
    }
  ];

  return (
    <>
      {/* 24x7 Top Contact Bar */}
      <div className="roavio-top-contact-bar">
        <div className="container">
          <div className="top-bar-inner">
            <div className="top-bar-left">
              <a href="tel:18001029900" className="top-contact-link">
                <Phone size={13} className="text-emerald" />
                <span>24x7 Helpline: <strong>1800 102 9900</strong></span>
              </a>
              <span className="top-bar-sep">•</span>
              <a href="mailto:support@roavio.com" className="top-contact-link d-none d-sm-inline-flex">
                <Mail size={13} className="text-blue" />
                <span>support@roavio.com</span>
              </a>
            </div>
            <div className="top-bar-right">
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="top-contact-link wa-link"
              >
                <span className="wa-pulse-dot"></span>
                <span>WhatsApp Instant: <strong>+91 98765 43210</strong></span>
              </a>
              <span className="top-bar-sep d-none d-md-inline">•</span>
              <Link to="/contact" className="top-contact-link d-none d-md-inline-flex">
                <Clock size={13} className="text-orange" />
                <span>Open 24/7 (365 Days)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <header className="roavio-navbar">
        <div className="container">
          <div className="navbar-inner">
            {/* Brand Logo - Authentic Roavio Vector Logo */}
            <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)} title="Roavio Homepage">
              <img 
                src="/assets/img/logo/black-logo.svg" 
                alt="ROAVIO – Discover India" 
                className="roavio-brand-img"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav">
              <ul className="nav-list">
                {/* Home */}
                <li className="nav-item-wrap">
                  <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                    <span>Home</span>
                  </Link>
                </li>

                {/* Destinations Dropdown */}
                <li className="nav-item-wrap has-dropdown">
                  <Link 
                    to="/explore-india" 
                    className={`nav-link ${isActive("/explore-india") ? "active" : ""}`}
                  >
                    <span>Destinations</span>
                    <ChevronDown size={14} className="dropdown-arrow" />
                  </Link>
                  <div className="nav-dropdown-menu">
                    <div className="dropdown-header">
                      <MapPin size={14} className="text-orange" />
                      <span>Explore Indian Destinations</span>
                    </div>
                    <Link to="/explore-india" className="dropdown-item">
                      <span className="dropdown-title">All 36 States & UTs</span>
                      <span className="dropdown-desc">175+ curated destinations across India</span>
                    </Link>
                    <Link to="/explore-india" className="dropdown-item">
                      <span className="dropdown-title">Top Heritage Sites</span>
                      <span className="dropdown-desc">Taj Mahal, Hawa Mahal, Red Fort & more</span>
                    </Link>
                    <Link to="/explore-india" className="dropdown-item">
                      <span className="dropdown-title">Hill Stations & Scenic Valleys</span>
                      <span className="dropdown-desc">Munnar, Manali, Gulmarg, Ooty</span>
                    </Link>
                    <Link to="/explore-india" className="dropdown-item">
                      <span className="dropdown-title">Beaches & Coastal Getaways</span>
                      <span className="dropdown-desc">Goa, Havelock Island, Varkala</span>
                    </Link>
                  </div>
                </li>

                {/* Tours / Plan Journey Dropdown */}
                <li className="nav-item-wrap has-dropdown">
                  <Link 
                    to="/plan-journey" 
                    className={`nav-link ${isActive("/plan-journey") ? "active" : ""}`}
                  >
                    <span>Tours</span>
                    <ChevronDown size={14} className="dropdown-arrow" />
                  </Link>
                  <div className="nav-dropdown-menu">
                    <div className="dropdown-header">
                      <Calendar size={14} className="text-green" />
                      <span>Journey Planning & Tours</span>
                    </div>
                    <Link to="/plan-journey" className="dropdown-item">
                      <span className="dropdown-title">Smart Trip Planner</span>
                      <span className="dropdown-desc">Custom route, schedule & budget calculator</span>
                    </Link>
                    <Link to="/map" className="dropdown-item">
                      <span className="dropdown-title">Interactive GPS & Route Map</span>
                      <span className="dropdown-desc">Live distance, directions and travel times</span>
                    </Link>
                    <Link to="/flights" className="dropdown-item">
                      <span className="dropdown-title">Compare Transport Modes</span>
                      <span className="dropdown-desc">Compare Flights, Trains and Express Buses</span>
                    </Link>
                  </div>
                </li>

                {/* Flights */}
                <li className="nav-item-wrap">
                  <Link to="/flights" className={`nav-link ${isActive("/flights") ? "active" : ""}`}>
                    <span>Flights</span>
                  </Link>
                </li>

                {/* Trains */}
                <li className="nav-item-wrap">
                  <Link to="/trains" className={`nav-link ${isActive("/trains") ? "active" : ""}`}>
                    <span>Trains</span>
                  </Link>
                </li>

                {/* Buses */}
                <li className="nav-item-wrap">
                  <Link to="/buses" className={`nav-link ${isActive("/buses") ? "active" : ""}`}>
                    <span>Buses</span>
                  </Link>
                </li>

                {/* Contact Us */}
                <li className="nav-item-wrap">
                  <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>
                    <span>Contact Us</span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Right Action Utilities (Matches Reference Header) */}
            <div className="navbar-actions">
              {/* My Trips with Luggage Icon */}
              <Link to="/my-trips" className="nav-util-item" title="View Saved Destinations & Itineraries">
                <Briefcase size={17} className="util-icon text-orange" />
                <span className="util-label">My Trips</span>
                {savedIds.length > 0 && (
                  <span className="trips-count-badge">{savedIds.length}</span>
                )}
              </Link>

              {/* Offers Trigger */}
              <button 
                type="button" 
                onClick={() => setOffersModalOpen(true)} 
                className="nav-util-item offers-btn"
                title="View Exclusive India Travel Offers"
              >
                <Percent size={17} className="util-icon text-red" />
                <span className="util-label">Offers</span>
                <span className="sparkle-dot"></span>
              </button>

              {/* Red Pill Button: My Account / Login */}
              {user ? (
                <div className="user-dropdown-wrap">
                  <Link to="/my-trips" className="roavio-user-pill" title="User Profile & Trips">
                    <User size={16} className="user-avatar-icon" />
                    <span className="user-name-text">{user.name.split(" ")[0]}</span>
                  </Link>
                  <button 
                    onClick={logout} 
                    className="logout-action-btn" 
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="roavio-red-auth-btn" title="Traveler Account Login">
                  <div className="auth-btn-icon-wrap">
                    <User size={16} />
                  </div>
                  <span className="auth-btn-text">My Account / Login</span>
                </Link>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                className="mobile-hamburger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offers & Deals Modal */}
      {offersModalOpen && (
        <div className="offers-modal-backdrop" onClick={() => setOffersModalOpen(false)}>
          <div className="offers-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="offers-modal-header">
              <div className="offers-modal-title-group">
                <div className="offers-badge">
                  <Sparkles size={16} />
                  <span>SPECIAL PROMOTIONS</span>
                </div>
                <h3>Exclusive Roavio Travel Offers</h3>
                <p>Apply these promotional codes during journey planning for instant discounts</p>
              </div>
              <button 
                className="offers-close-btn" 
                onClick={() => setOffersModalOpen(false)}
                aria-label="Close offers"
              >
                <X size={20} />
              </button>
            </div>

            <div className="offers-list">
              {promoOffers.map((offer) => (
                <div key={offer.code} className="offer-card">
                  <div className="offer-tag-pill">{offer.tag}</div>
                  <div className="offer-info">
                    <h4>{offer.title}</h4>
                    <p>{offer.desc}</p>
                  </div>
                  <div className="offer-code-box">
                    <span className="coupon-code-text">{offer.code}</span>
                    <button 
                      type="button" 
                      onClick={() => copyCoupon(offer.code)} 
                      className="copy-coupon-btn"
                      title="Copy promo code"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check size={14} className="text-green" />
                          <span className="copied-text">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="offers-modal-footer">
              <Link 
                to="/plan-journey" 
                className="btn btn-primary btn-sm"
                onClick={() => setOffersModalOpen(false)}
              >
                Apply In Journey Planner →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay">
          <div className="mobile-drawer-content">
            <div className="mobile-drawer-brand">
              <img 
                src="/assets/img/logo/black-logo.svg" 
                alt="Roavio Logo" 
                className="mobile-brand-img"
              />
              <button 
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
              >
                <X size={22} />
              </button>
            </div>

            <ul className="mobile-nav-links">
              <li>
                <Link to="/" className={`mobile-nav-link ${isActive("/") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore-india" className={`mobile-nav-link ${isActive("/explore-india") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                  Destinations (All 36 States)
                </Link>
              </li>
              <li>
                <Link to="/plan-journey" className={`mobile-nav-link ${isActive("/plan-journey") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                  Plan Journey & Tours
                </Link>
              </li>
              <li>
                <Link to="/flights" className={`mobile-nav-link ${isActive("/flights") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                  Flight Booking
                </Link>
              </li>
              <li>
                <Link to="/trains" className={`mobile-nav-link ${isActive("/trains") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                  Train Reservations
                </Link>
              </li>
              <li>
                <Link to="/buses" className={`mobile-nav-link ${isActive("/buses") ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                  Express Buses
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  💼 My Trips ({savedIds.length} saved)
                </Link>
              </li>
              <li>
                <button 
                  className="mobile-nav-link mobile-btn-link" 
                  onClick={() => { setMobileMenuOpen(false); setOffersModalOpen(true); }}
                >
                  % Travel Offers & Coupons
                </button>
              </li>
              <li>
                <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Contact Us
                </Link>
              </li>
            </ul>

            <div className="mobile-drawer-footer">
              {user ? (
                <div className="mobile-user-card">
                  <div className="mobile-user-info">
                    <User size={18} className="text-green" />
                    <span>Logged in as <strong>{user.name}</strong></span>
                  </div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn btn-outline btn-sm w-100">
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="roavio-red-auth-btn w-100 text-center" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} />
                  <span>My Account / Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Embedded Component CSS */}
      <style>{`
        /* 24x7 Top Contact Bar */
        .roavio-top-contact-bar {
          background: #0B132B;
          color: #E2E8F0;
          font-size: 0.76rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.35rem 0;
          position: relative;
          z-index: 1001;
        }

        .top-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .top-bar-left,
        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .top-contact-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #CBD5E1;
          text-decoration: none;
          transition: color 0.18s;
        }

        .top-contact-link:hover {
          color: #FFFFFF;
        }

        .top-contact-link strong {
          color: #FFFFFF;
        }

        .top-bar-sep {
          color: #475569;
          font-size: 0.7rem;
        }

        .wa-link {
          color: #86EFAC !important;
        }

        .wa-link strong {
          color: #4ADE80 !important;
        }

        .wa-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22C55E;
          box-shadow: 0 0 6px #22C55E;
          display: inline-block;
          animation: pulseGreen 1.8s infinite;
        }

        @keyframes pulseGreen {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }

        /* Header Base */
        .roavio-navbar {
          background-color: rgba(255, 255, 255, 0.96) !important;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px -2px rgba(11, 19, 43, 0.06);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.25s ease;
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 74px;
        }

        /* Brand Logo */
        .brand-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }

        .roavio-brand-img {
          height: 38px;
          width: auto;
          display: block;
          object-fit: contain;
        }

        /* Desktop Nav */
        .desktop-nav {
          display: flex;
          align-items: center;
        }

        .nav-list {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item-wrap {
          position: relative;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.6rem 0.85rem;
          font-size: 0.94rem;
          font-weight: 600;
          color: #1E293B !important;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-link:hover {
          color: #FB5B32 !important;
          background-color: #F8FAFC;
        }

        .nav-link.active {
          color: #159B75 !important;
          font-weight: 700;
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 2px;
          left: 12px;
          right: 12px;
          height: 2.5px;
          background: #159B75;
          border-radius: 4px;
        }

        .dropdown-arrow {
          transition: transform 0.2s ease;
          opacity: 0.7;
        }

        .nav-item-wrap:hover .dropdown-arrow {
          transform: rotate(180deg);
          opacity: 1;
        }

        /* Dropdown Menus */
        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 290px;
          background: #FFFFFF;
          border-radius: 12px;
          padding: 0.75rem;
          box-shadow: 0 16px 36px rgba(20, 43, 69, 0.14);
          border: 1px solid #E2E8F0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          z-index: 1010;
        }

        .nav-item-wrap.has-dropdown:hover .nav-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.6rem 0.6rem;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748B;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 0.4rem;
        }

        .dropdown-item {
          display: flex;
          flex-direction: column;
          padding: 0.55rem 0.75rem;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.18s ease;
        }

        .dropdown-item:hover {
          background-color: #F8FAFC;
        }

        .dropdown-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1E293B;
          line-height: 1.3;
        }

        .dropdown-item:hover .dropdown-title {
          color: #FB5B32;
        }

        .dropdown-desc {
          font-size: 0.75rem;
          color: #64748B;
          margin-top: 2px;
        }

        /* Navbar Actions Right */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.15rem;
        }

        /* Utility Links: My Trips & Offers */
        .nav-util-item {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.92rem;
          font-weight: 600;
          color: #1E293B !important;
          text-decoration: none;
          padding: 0.4rem 0.3rem;
          position: relative;
          transition: color 0.2s ease;
        }

        .nav-util-item:hover {
          color: #FB5B32 !important;
        }

        .util-icon {
          flex-shrink: 0;
        }

        .util-label {
          font-weight: 600;
        }

        .trips-count-badge {
          background: #FB5B32;
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.1rem 0.45rem;
          border-radius: 999px;
          line-height: 1.2;
        }

        .sparkle-dot {
          width: 7px;
          height: 7px;
          background: #EF4444;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }

        /* Red Coral Pill CTA: My Account / Login */
        .roavio-red-auth-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #F1352C !important;
          color: #FFFFFF !important;
          padding: 0.55rem 1.25rem;
          border-radius: 999px;
          font-size: 0.92rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(241, 53, 44, 0.32);
          transition: all 0.22s ease;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .roavio-red-auth-btn:hover {
          background: #D9231A !important;
          transform: translateY(-1.5px);
          box-shadow: 0 6px 18px rgba(241, 53, 44, 0.42);
          color: #FFFFFF !important;
        }

        .auth-btn-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* User Logged In Pill */
        .user-dropdown-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .roavio-user-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          padding: 0.45rem 1rem;
          border-radius: 999px;
          text-decoration: none;
          color: #1E293B !important;
          font-size: 0.88rem;
          font-weight: 700;
          transition: background 0.2s ease;
        }

        .roavio-user-pill:hover {
          background: #E2E8F0;
        }

        .user-avatar-icon {
          color: #159B75;
        }

        .logout-action-btn {
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.4rem;
          border-radius: 6px;
          transition: color 0.2s ease;
        }

        .logout-action-btn:hover {
          color: #EF4444;
          background-color: #FEF2F2;
        }

        /* Mobile Hamburger */
        .mobile-hamburger-btn {
          display: none;
          background: none;
          border: none;
          color: #1E293B;
          cursor: pointer;
          padding: 0.3rem;
          border-radius: 6px;
        }

        /* Offers Modal */
        .offers-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1.25rem;
        }

        .offers-modal-box {
          background: #FFFFFF;
          border-radius: 16px;
          width: 100%;
          max-width: 580px;
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .offers-modal-header {
          padding: 1.5rem 1.5rem 1rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #F1F5F9;
        }

        .offers-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #FEF2F2;
          color: #EF4444;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .offers-modal-title-group h3 {
          font-size: 1.35rem;
          color: #142B45;
          margin-bottom: 0.3rem;
        }

        .offers-modal-title-group p {
          font-size: 0.88rem;
          color: #64748B;
        }

        .offers-close-btn {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
        }

        .offers-close-btn:hover {
          color: #0F172A;
          background: #F1F5F9;
        }

        .offers-list {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .offer-card {
          border: 1.5px dashed #E2E8F0;
          border-radius: 12px;
          padding: 1rem 1.2rem;
          background: #FAFAFA;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: relative;
          transition: border-color 0.2s ease;
        }

        .offer-card:hover {
          border-color: #FB5B32;
          background: #FFFBF9;
        }

        .offer-tag-pill {
          position: absolute;
          top: -9px;
          left: 14px;
          background: #159B75;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.1rem 0.5rem;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }

        .offer-info h4 {
          font-size: 0.95rem;
          color: #1E293B;
          margin-bottom: 0.2rem;
        }

        .offer-info p {
          font-size: 0.8rem;
          color: #64748B;
        }

        .offer-code-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .coupon-code-text {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 800;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          color: #142B45;
          letter-spacing: 0.06em;
        }

        .copy-coupon-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #142B45;
          color: #FFFFFF;
          border: none;
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .copy-coupon-btn:hover {
          background: #FB5B32;
        }

        .copied-text {
          color: #4ADE80;
        }

        .offers-modal-footer {
          padding: 1rem 1.5rem;
          background: #F8FAFC;
          border-top: 1px solid #F1F5F9;
          display: flex;
          justify-content: flex-end;
        }

        /* Mobile Drawer */
        .mobile-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(3px);
          z-index: 1100;
          display: flex;
          justify-content: flex-end;
        }

        .mobile-drawer-content {
          width: 82%;
          max-width: 340px;
          background: #FFFFFF;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          box-shadow: -8px 0 30px rgba(0, 0, 0, 0.2);
          animation: slideLeft 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .mobile-drawer-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 1rem;
        }

        .mobile-brand-img {
          height: 32px;
          width: auto;
        }

        .mobile-drawer-close {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
        }

        .mobile-nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow-y: auto;
          flex-grow: 1;
        }

        .mobile-nav-link {
          display: block;
          padding: 0.65rem 0.9rem;
          color: #1E293B !important;
          font-size: 0.98rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.18s ease;
        }

        .mobile-nav-link:hover {
          background-color: #F8FAFC;
          color: #FB5B32 !important;
        }

        .mobile-nav-link.active {
          background-color: #E8F6F1;
          color: #159B75 !important;
          font-weight: 700;
        }

        .mobile-btn-link {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }

        .mobile-drawer-footer {
          padding-top: 1.25rem;
          border-top: 1px solid #F1F5F9;
        }

        .mobile-user-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          color: #334155;
        }

        .text-orange { color: #FB5B32 !important; }
        .text-green { color: #159B75 !important; }
        .text-red { color: #EF4444 !important; }

        /* Responsive Breakpoints */
        @media (max-width: 1100px) {
          .desktop-nav {
            display: none;
          }
          .mobile-hamburger-btn {
            display: block;
          }
        }

        @media (max-width: 640px) {
          .navbar-inner {
            height: 64px;
          }
          .roavio-brand-img {
            height: 32px;
          }
          .nav-util-item {
            display: none;
          }
          .roavio-red-auth-btn {
            padding: 0.45rem 0.9rem;
            font-size: 0.82rem;
          }
        }
      `}</style>
    </>
  );
}
