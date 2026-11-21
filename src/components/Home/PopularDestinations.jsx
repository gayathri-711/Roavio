import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

export default function PopularDestinations() {
  const popularList = [
    {
      id: "munnar",
      name: "Munnar",
      location: "Kerala",
      description: "Lush green hills and serene beauty.",
      image: "/assets/img/india-tours/munnar.jpg"
    },
    {
      id: "taj-mahal",
      name: "Agra",
      location: "Uttar Pradesh",
      description: "A timeless symbol of love.",
      image: "/assets/img/india-tours/taj-mahal.jpg"
    },
    {
      id: "hawa-mahal",
      name: "Jaipur",
      location: "Rajasthan",
      description: "Royal heritage and vibrant culture.",
      image: "/assets/img/india-tours/hawa-mahal.jpg"
    },
    {
      id: "palolem-beach",
      name: "Goa",
      location: "Goa Coast",
      description: "Sun, sand and endless vibes.",
      image: "/assets/img/india-tours/palolem-beach.jpg"
    }
  ];

  return (
    <section className="roavio-popular-destinations">
      <div className="container">
        {/* Section Header */}
        <div className="destinations-header">
          <h2 className="destinations-title">Popular Destinations in India</h2>
          <p className="destinations-subtitle">
            Find inspiration for your next unforgettable journey.
          </p>
        </div>

        {/* Exactly 4 Destination Cards Grid */}
        <div className="four-cards-grid">
          {popularList.map((dest) => (
            <div key={dest.id} className="popular-dest-card">
              <div className="card-media-box">
                <img 
                  src={dest.image} 
                  alt={`${dest.name}, ${dest.location}`} 
                  className="dest-card-photo" 
                />
              </div>

              <div className="dest-card-content">
                <div className="dest-name-row">
                  <h3 className="dest-title">{dest.name}</h3>
                  <span className="dest-location-tag">
                    <MapPin size={13} className="text-green" />
                    <span>{dest.location}</span>
                  </span>
                </div>

                <p className="dest-short-desc">{dest.description}</p>

                <div className="dest-card-actions">
                  <Link 
                    to={`/destination/${dest.id}`} 
                    className="explore-dest-btn"
                  >
                    <span>Explore</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA Link */}
        <div className="explore-all-cta-box">
          <Link to="/explore-india" className="explore-all-link">
            <span>Explore All Destinations</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <style>{`
        .roavio-popular-destinations {
          padding: 3.5rem 0 4.5rem;
          background-color: #FFFFFF;
        }

        .destinations-header {
          text-align: center;
          margin-bottom: 2.8rem;
        }

        .destinations-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0 0 0.5rem;
          letter-spacing: -0.4px;
        }

        .destinations-subtitle {
          font-size: 1.05rem;
          color: #64748B;
          margin: 0;
        }

        /* Exactly 4 Cards Grid */
        .four-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .popular-dest-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .popular-dest-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
          border-color: #CBD5E1;
        }

        .card-media-box {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .dest-card-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .popular-dest-card:hover .dest-card-photo {
          transform: scale(1.06);
        }

        .dest-card-content {
          padding: 1.3rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .dest-name-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .dest-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0;
        }

        .dest-location-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748B;
        }

        .dest-short-desc {
          font-size: 0.88rem;
          color: #64748B;
          line-height: 1.55;
          margin: 0 0 1.2rem;
          flex-grow: 1;
        }

        .dest-card-actions {
          margin-top: auto;
          padding-top: 0.85rem;
          border-top: 1px solid #F1F5F9;
        }

        .explore-dest-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-green);
          text-decoration: none;
          transition: gap 0.2s ease;
        }

        .explore-dest-btn:hover {
          color: #118262;
          gap: 0.65rem;
        }

        .explore-all-cta-box {
          text-align: center;
          padding-top: 0.5rem;
        }

        .explore-all-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-green);
          text-decoration: none;
          padding: 0.6rem 1.4rem;
          border-radius: 999px;
          background: #F0FDF4;
          border: 1.5px solid #BBF7D0;
          transition: all 0.2s ease;
        }

        .explore-all-link:hover {
          background: var(--color-green);
          color: #FFFFFF;
          border-color: var(--color-green);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(21, 155, 117, 0.25);
        }

        @media (max-width: 1024px) {
          .four-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 580px) {
          .roavio-popular-destinations {
            padding: 2.8rem 0 3.5rem;
          }

          .destinations-title {
            font-size: 1.7rem;
          }

          .four-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
