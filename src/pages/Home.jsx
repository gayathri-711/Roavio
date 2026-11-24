import React from "react";
import { Link } from "react-router-dom";
import { Headphones, Phone, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import HeroSection from "../components/Home/HeroSection";
import TrustSection from "../components/Home/TrustSection";
import PopularDestinations from "../components/Home/PopularDestinations";
import AdventureCTA from "../components/Home/AdventureCTA";

export default function Home() {
  return (
    <div className="roavio-homepage-root">
      {/* 1. HERO SECTION WITH SEARCH BAR */}
      <HeroSection />

      {/* 2. TRUST & FEATURES SECTION */}
      <TrustSection />

      {/* 3. POPULAR DESTINATIONS (4 CARDS) */}
      <PopularDestinations />

      {/* 4. ADVENTURE CALL-TO-ACTION */}
      <AdventureCTA />

      {/* 5. 24x7 COMPACT CONTACT CONCIERGE STRIP */}
      <section className="roavio-compact-contact-strip" id="roavio-contact-section">
        <div className="container">
          <div className="roavio-compact-contact-box">
            <div className="roavio-compact-contact-left">
              <div className="roavio-compact-icon">
                <Headphones size={28} />
              </div>
              <div className="roavio-compact-text">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="live-support-pill">● 24x7 ACTIVE</span>
                  <span className="small text-muted">All 28 States &amp; 8 UTs</span>
                </div>
                <h3 className="compact-title">Need Help Planning Your Journey?</h3>
                <p className="compact-desc">
                  Speak to our certified India travel specialists 24x7. Free consultation, customized holiday itineraries, and verified instant ticket booking.
                </p>
              </div>
            </div>

            <div className="roavio-compact-contact-right">
              <a href="tel:18001029900" className="compact-contact-btn tel-btn" title="Call Toll-Free 24x7 Helpline">
                <Phone size={17} />
                <span><strong>1800 102 9900</strong> (Toll-Free)</span>
              </a>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="compact-contact-btn wa-btn"
                title="Chat with Live WhatsApp Concierge"
              >
                <MessageSquare size={17} />
                <span>WhatsApp Concierge</span>
              </a>
              <Link to="/contact" className="compact-contact-btn info-btn" title="Open Full Contact Desk">
                <span>Contact Page</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .roavio-homepage-root {
          background-color: transparent !important;
          color: var(--color-text);
          min-height: 100vh;
        }

        /* 24x7 Compact Contact Bar */
        .roavio-compact-contact-strip {
          padding: 2.8rem 0;
          background: transparent;
        }

        .roavio-compact-contact-box {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 20px;
          padding: 1.6rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          box-shadow: 0 10px 30px rgba(11, 19, 43, 0.05);
          backdrop-filter: blur(8px);
        }

        .roavio-compact-contact-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex: 1;
        }

        .roavio-compact-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #059669 0%, #10B981 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 18px rgba(16, 185, 129, 0.28);
          flex-shrink: 0;
        }

        .live-support-pill {
          background: #DCFCE7;
          color: #166534;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          letter-spacing: 0.04em;
        }

        .compact-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 4px;
        }

        .compact-desc {
          font-size: 0.88rem;
          color: #64748B;
          margin: 0;
          line-height: 1.45;
        }

        .roavio-compact-contact-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .compact-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0.72rem 1.25rem;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tel-btn {
          background: #0B132B;
          color: #FFFFFF;
        }

        .tel-btn:hover {
          background: #059669;
          transform: translateY(-2px);
          color: #FFFFFF;
        }

        .wa-btn {
          background: #F0FDF4;
          color: #16A34A;
          border: 1.5px solid #BBF7D0;
        }

        .wa-btn:hover {
          background: #16A34A;
          color: #FFFFFF;
          border-color: #16A34A;
          transform: translateY(-2px);
        }

        .info-btn {
          background: #F8FAFC;
          color: #475569;
          border: 1.5px solid #CBD5E1;
        }

        .info-btn:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        @media (max-width: 992px) {
          .roavio-compact-contact-box {
            flex-direction: column;
            align-items: flex-start;
          }
          .roavio-compact-contact-right {
            width: 100%;
          }
          .compact-contact-btn {
            flex: 1;
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .roavio-compact-contact-left {
            flex-direction: column;
            align-items: flex-start;
          }
          .roavio-compact-contact-right {
            flex-direction: column;
          }
          .compact-contact-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
