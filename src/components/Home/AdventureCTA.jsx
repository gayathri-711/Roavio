import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

export default function AdventureCTA() {
  return (
    <section className="roavio-adventure-cta">
      <div className="adventure-bg-image"></div>
      <div className="adventure-dark-overlay"></div>

      <div className="container adventure-inner-container">
        <div className="adventure-content-box">
          <h2 className="adventure-title">Your Next Adventure Starts Here.</h2>
          <p className="adventure-description">
            From discovering beautiful destinations to planning your route, make your Indian travel experience easier with Roavio.
          </p>

          <div className="adventure-buttons-row">
            <Link to="/plan-journey" className="btn btn-primary adventure-btn-primary">
              <span>Start Planning Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/explore-india" className="btn btn-adventure-secondary">
              Discover India
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .roavio-adventure-cta {
          position: relative;
          padding: 6rem 0;
          color: #FFFFFF;
          overflow: hidden;
          text-align: center;
        }

        .adventure-bg-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/assets/img/india-tours/solang-manali.jpg');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          z-index: 1;
        }

        .adventure-dark-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(20, 43, 69, 0.82) 0%,
            rgba(20, 43, 69, 0.92) 100%
          );
          z-index: 2;
        }

        .adventure-inner-container {
          position: relative;
          z-index: 3;
        }

        .adventure-content-box {
          max-width: 740px;
          margin: 0 auto;
        }

        .adventure-title {
          font-size: 2.6rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 1.2rem;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        .adventure-description {
          font-size: 1.15rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 auto 2.2rem;
          max-width: 620px;
        }

        .adventure-buttons-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        .adventure-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.9rem 1.8rem;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(21, 155, 117, 0.4);
        }

        .btn-adventure-secondary {
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

        .btn-adventure-secondary:hover {
          background: #FFFFFF;
          color: var(--color-navy);
          border-color: #FFFFFF;
        }

        @media (max-width: 768px) {
          .roavio-adventure-cta {
            padding: 4.5rem 0;
          }

          .adventure-title {
            font-size: 2rem;
          }

          .adventure-description {
            font-size: 1rem;
          }

          .adventure-buttons-row {
            flex-direction: column;
            width: 100%;
          }

          .adventure-btn-primary, .btn-adventure-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
