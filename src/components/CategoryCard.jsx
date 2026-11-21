import React from "react";
import { Link } from "react-router-dom";
import { 
  Mountain, 
  Waves, 
  Landmark, 
  Sparkles, 
  Trees, 
  Droplets, 
  Flame, 
  Sailboat, 
  Crown, 
  Compass, 
  ArrowRight 
} from "lucide-react";

const ICON_MAP = {
  Mountain,
  Waves,
  Landmark,
  Sparkles,
  Trees,
  Droplets,
  Flame,
  Sailboat,
  Crown,
  Compass
};

export default function CategoryCard({ category }) {
  const IconComponent = ICON_MAP[category.icon] || Compass;

  return (
    <Link to={`/explore?cat=${category.id}`} className="roavio-category-card">
      <div className="cat-icon-wrap">
        <IconComponent className="cat-icon" size={26} />
      </div>
      <div className="cat-text-group">
        <h4 className="cat-name">{category.name}</h4>
        <p className="cat-tagline">{category.tagline}</p>
      </div>
      <div className="cat-footer">
        <span className="cat-count">{category.count}+ Places</span>
        <div className="cat-arrow">
          <ArrowRight size={14} />
        </div>
      </div>

      <style>{`
        .roavio-category-card {
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-sm);
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .roavio-category-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--travel-green);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .roavio-category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: rgba(21, 155, 117, 0.3);
        }

        .roavio-category-card:hover::before {
          opacity: 1;
        }

        .cat-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background: var(--travel-green-light);
          color: var(--travel-green);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          transition: all 0.25s ease;
        }

        .roavio-category-card:hover .cat-icon-wrap {
          background: var(--travel-green);
          color: white;
          transform: scale(1.08);
        }

        .cat-name {
          font-size: 1.15rem;
          margin-bottom: 6px;
          color: var(--primary-navy);
        }

        .cat-tagline {
          color: var(--text-muted);
          font-size: 0.86rem;
          line-height: 1.45;
          margin-bottom: 18px;
        }

        .cat-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #F1F5F9;
        }

        .cat-count {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-navy);
          background: #F8FAFC;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }

        .cat-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #F1F5F9;
          color: var(--primary-navy);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .roavio-category-card:hover .cat-arrow {
          background: var(--travel-green);
          color: white;
          transform: translateX(3px);
        }
      `}</style>
    </Link>
  );
}
