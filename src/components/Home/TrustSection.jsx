import React from "react";
import { Compass, Briefcase, ShieldCheck, Map } from "lucide-react";

export default function TrustSection() {
  const features = [
    {
      icon: Compass,
      title: "Explore India",
      desc: "Discover amazing destinations with detailed travel information."
    },
    {
      icon: Briefcase,
      title: "Smarter Planning",
      desc: "Compare options and plan your journey easily."
    },
    {
      icon: ShieldCheck,
      title: "Easy Management",
      desc: "Keep your travel plans organized in one place."
    },
    {
      icon: Map,
      title: "Discover More",
      desc: "Find popular attractions and hidden gems."
    }
  ];

  return (
    <section className="roavio-trust-section">
      <div className="container">
        <div className="trust-header">
          <h2 className="trust-title">Your Journey, Planned with Confidence.</h2>
        </div>

        <div className="trust-cards-grid">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="trust-card">
                <div className="trust-icon-box">
                  <Icon size={24} className="trust-icon" />
                </div>
                <h3 className="trust-card-title">{item.title}</h3>
                <p className="trust-card-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .roavio-trust-section {
          padding: 4.5rem 0 3.5rem;
          background-color: var(--color-bg);
        }

        .trust-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .trust-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0;
          letter-spacing: -0.3px;
        }

        .trust-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .trust-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.8rem 1.4rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          height: 100%;
        }

        .trust-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.07);
          border-color: #CBD5E1;
        }

        .trust-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: #ECFDF5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.2rem;
        }

        .trust-icon {
          color: var(--color-green);
        }

        .trust-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0 0 0.5rem;
        }

        .trust-card-desc {
          font-size: 0.88rem;
          color: #64748B;
          line-height: 1.55;
          margin: 0;
        }

        @media (max-width: 992px) {
          .trust-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 580px) {
          .roavio-trust-section {
            padding: 3rem 0 2.5rem;
          }

          .trust-title {
            font-size: 1.6rem;
          }

          .trust-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
