import React from "react";
import { Link } from "react-router-dom";
import { 
  Compass, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube 
} from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="roavio-reference-footer">
      <div className="container">
        {/* 4 Columns Grid */}
        <div className="footer-columns-grid">
          {/* Column 1 – Brand */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand-logo">
              <div className="brand-icon-box">
                <Compass className="logo-icon" size={22} />
              </div>
              <div className="brand-text-wrap">
                <span className="brand-title">ROAVIO</span>
                <span className="brand-tag">DISCOVER INDIA</span>
              </div>
            </Link>
            <p className="brand-tagline-quote">
              Discover India. Plan Your Journey. Travel Freely.
            </p>
            <p className="brand-short-desc">
              A comprehensive Indian travel discovery and journey planning platform connecting travelers with verified destinations, curated multi-stop itineraries, and multi-modal transit options.
            </p>
          </div>

          {/* Column 2 – Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/explore-india">Explore India</Link></li>
              <li><Link to="/plan-journey">Plan Journey</Link></li>
              <li><Link to="/flights">Flights</Link></li>
              <li><Link to="/trains">Trains</Link></li>
              <li><Link to="/buses">Buses</Link></li>
              <li><Link to="/my-trips">My Trips</Link></li>
            </ul>
          </div>

          {/* Column 3 – Contact Us */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <div className="contact-details-stack">
              <div className="contact-row">
                <Mail size={16} className="contact-icon text-green" />
                <a href="mailto:support@roavio.com" className="contact-link">
                  support@roavio.com
                </a>
              </div>
              <div className="contact-row">
                <Phone size={16} className="contact-icon text-green" />
                <a href="tel:+919876543210" className="contact-link">
                  +91 98765 43210
                </a>
              </div>
              <div className="contact-row">
                <MapPin size={16} className="contact-icon text-green" />
                <span className="contact-text">
                  Connaught Place, New Delhi, India
                </span>
              </div>
              <div className="contact-row">
                <Clock size={16} className="contact-icon text-green" />
                <span className="contact-text">
                  Monday–Saturday, 9 AM–6 PM
                </span>
              </div>
            </div>
          </div>

          {/* Column 4 – Follow Us */}
          <div className="footer-col">
            <h4 className="footer-col-title">Follow Us</h4>
            <p className="social-subtext">
              Stay connected with our travel community across social platforms for destination guides and updates.
            </p>
            <div className="social-icons-row">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-icon-btn" 
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-icon-btn" 
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-icon-btn" 
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="social-icon-btn" 
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-line">
            © 2026 Roavio. All Rights Reserved.
          </p>
          <div className="bottom-policy-links">
            <a href="#contact">Contact Us</a>
            <span className="sep-dot">·</span>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Roavio Privacy Policy: We respect your privacy and protect traveler data with industry-standard protocols."); }}>
              Privacy Policy
            </a>
            <span className="sep-dot">·</span>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Roavio Terms & Conditions: Demonstration platform terms for travel discovery and planning."); }}>
              Terms & Conditions
            </a>
            <span className="sep-dot">·</span>
            <Link to="/admin" className="admin-link-accent">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .roavio-reference-footer {
          background-color: var(--color-navy);
          color: #E2E8F0;
          padding: 4.5rem 0 2rem;
          border-top: 3px solid var(--color-green);
        }

        .footer-columns-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1.2fr 1fr;
          gap: 2.5rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .brand-col {
          display: flex;
          flex-direction: column;
        }

        .footer-brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #FFFFFF;
          margin-bottom: 1rem;
        }

        .brand-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--color-green);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }

        .brand-title {
          font-size: 1.3rem;
          font-weight: 900;
          letter-spacing: 1px;
          color: #FFFFFF;
          display: block;
        }

        .brand-tag {
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--color-orange);
          letter-spacing: 2px;
          display: block;
        }

        .brand-tagline-quote {
          font-size: 0.88rem;
          font-weight: 700;
          color: #A7F3D0;
          margin: 0 0 0.8rem;
        }

        .brand-short-desc {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #94A3B8;
          margin: 0;
        }

        .footer-col-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 1.2rem;
          letter-spacing: -0.2px;
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .footer-links-list a {
          color: #CBD5E1;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .footer-links-list a:hover {
          color: var(--color-green);
          transform: translateX(3px);
        }

        .contact-details-stack {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .contact-row {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.88rem;
        }

        .contact-icon {
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .contact-link {
          color: #CBD5E1;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-link:hover {
          color: var(--color-green);
          text-decoration: underline;
        }

        .contact-text {
          color: #94A3B8;
          line-height: 1.45;
        }

        .social-subtext {
          font-size: 0.85rem;
          color: #94A3B8;
          line-height: 1.5;
          margin: 0 0 1.2rem;
        }

        .social-icons-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .social-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .social-icon-btn:hover {
          background: var(--color-green);
          border-color: var(--color-green);
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.2rem;
          padding-top: 1.8rem;
          font-size: 0.85rem;
          color: #94A3B8;
        }

        .copyright-line {
          margin: 0;
        }

        .bottom-policy-links {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .bottom-policy-links a {
          color: #CBD5E1;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .bottom-policy-links a:hover {
          color: var(--color-green);
        }

        .sep-dot {
          color: #64748B;
        }

        .admin-link-accent {
          color: var(--color-orange) !important;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .footer-columns-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 640px) {
          .roavio-reference-footer {
            padding: 3.5rem 0 1.5rem;
          }

          .footer-columns-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
