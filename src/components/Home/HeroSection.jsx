import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import JourneySearch from "./JourneySearch";

export default function HeroSection() {
  return (
    <section className="roavio-reference-hero">
      <div className="hero-backdrop-image"></div>
      <div className="hero-gradient-overlay"></div>

      <div className="container hero-inner-container">
        {/* Left-Aligned Prominent Content */}
        <div className="hero-content-column">
          <div className="hero-tag-badge">
            <Compass size={15} className="text-green" />
            <span>Official India Discovery & Journey Platform</span>
          </div>

          <h1 className="hero-main-heading">
            Discover India.<br />
            <span className="hero-highlight-line">Travel Beyond Expectations.</span>
          </h1>

          <p className="hero-lead-description">
            Explore destinations, compare travel options and plan your perfect journey across India with Roavio.
          </p>

          <div className="hero-cta-buttons-row">
            <Link to="/plan-journey" className="btn btn-primary hero-btn-primary">
              <span>Plan Your Journey</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/explore-india" className="btn btn-hero-secondary">
              Explore Destinations
            </Link>
          </div>
        </div>

        {/* Travel Search Panel Near Bottom */}
        <div className="hero-search-placement">
          <JourneySearch />
        </div>
      </div>

      <style>{`
        .roavio-reference-hero {
          position: relative;
          min-height: 640px;
          display: flex;
          align-items: center;
          padding: 5rem 0 3.5rem;
          color: #FFFFFF;
          overflow: hidden;
        }

        .hero-backdrop-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/assets/img/india-tours/taj-mahal.jpg');
          background-size: cover;
          background-position: center right;
          background-repeat: no-repeat;
          z-index: 1;
        }

        .hero-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            rgba(20, 43, 69, 0.96) 0%,
            rgba(20, 43, 69, 0.88) 45%,
            rgba(20, 43, 69, 0.55) 75%,
            rgba(20, 43, 69, 0.35) 100%
          );
          z-index: 2;
        }

        .hero-inner-container {
          position: relative;
          z-index: 3;
          width: 100%;
        }

        .hero-content-column {
          max-width: 680px;
          margin-bottom: 3.5rem;
        }

        .hero-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #E2E8F0;
          padding: 0.35rem 0.95rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 1.4rem;
          backdrop-filter: blur(8px);
        }

        .hero-main-heading {
          font-size: 3.4rem;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.15;
          margin: 0 0 1.2rem;
          letter-spacing: -0.6px;
        }

        .hero-highlight-line {
          color: #4ADE80;
          display: block;
        }

        .hero-lead-description {
          font-size: 1.18rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 2.2rem;
          max-width: 580px;
        }

        .hero-cta-buttons-row {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 1.8rem;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(21, 155, 117, 0.4);
        }

        .btn-hero-secondary {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          color: #FFFFFF;
          padding: 0.85rem 1.6rem;
          border-radius: 10px;
          font-size: 0.98rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-hero-secondary:hover {
          background: #FFFFFF;
          color: var(--color-navy);
          border-color: #FFFFFF;
        }

        .hero-search-placement {
          margin-top: 1rem;
        }

        @media (max-width: 992px) {
          .hero-main-heading {
            font-size: 2.6rem;
          }

          .hero-content-column {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .roavio-reference-hero {
            padding: 4rem 0 2.5rem;
          }

          .hero-main-heading {
            font-size: 2.1rem;
          }

          .hero-lead-description {
            font-size: 1rem;
          }

          .hero-cta-buttons-row {
            flex-direction: column;
            width: 100%;
          }

          .hero-btn-primary, .btn-hero-secondary {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
