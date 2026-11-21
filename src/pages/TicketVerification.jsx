import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  ShieldCheck, 
  AlertTriangle, 
  TicketCheck, 
  Calendar, 
  User, 
  MapPin, 
  Plane, 
  Train, 
  Bus, 
  Compass, 
  Download, 
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function TicketVerification() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("No ticket verification token provided in the URL.");
      return;
    }

    // Call backend verification API
    fetch(`/api/verify-ticket/${encodeURIComponent(token)}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.valid && data.booking) {
          setVerificationResult(data.booking);
        } else {
          setError(data.message || "Invalid, unverified or expired ticket token.");
        }
      })
      .catch(err => {
        setLoading(false);
        setError("Network error communicating with Roavio verification service: " + err.message);
      });
  }, [token]);

  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case "flight": return <Plane size={20} className="text-green" />;
      case "train": return <Train size={20} className="text-orange" />;
      case "bus": return <Bus size={20} className="text-green" />;
      default: return <Compass size={20} className="text-green" />;
    }
  };

  return (
    <div className="ticket-verify-page">
      <div className="container">
        <div className="verify-card-box">
          {/* Header */}
          <div className="verify-header">
            <Link to="/" className="verify-brand-logo">
              <img src="/assets/img/logo/white-logo.svg" alt="Roavio Logo" style={{ height: "32px" }} />
            </Link>
            <div className="verify-title-tag">OFFICIAL DIGITAL TICKET VERIFICATION SYSTEM</div>
          </div>

          {loading ? (
            <div className="verify-state-box">
              <div className="verify-spinner"></div>
              <h3>Authenticating Ticket Security Signature...</h3>
              <p>Validating digital cryptographic token with Roavio backend verification gateway.</p>
            </div>
          ) : error ? (
            <div className="verify-state-box error-box">
              <div className="icon-seal error-seal">
                <XCircle size={44} />
              </div>
              <h2 className="text-red">Ticket Verification Failed</h2>
              <p className="error-desc">{error}</p>
              <div className="token-code-row">
                <span>Submitted Security Token:</span>
                <code>{token || "NONE"}</code>
              </div>
              <Link to="/" className="btn btn-primary btn-sm">
                <ArrowLeft size={16} /> Return to Homepage
              </Link>
            </div>
          ) : (
            <div className="verify-content">
              {/* Authenticity Banner */}
              <div className="valid-status-banner">
                <div className="seal-badge">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3>VERIFIED & CONFIRMED TICKET</h3>
                  <p>This digital ticket has been authenticated by the official Roavio Central Reservation Gateway.</p>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="ticket-meta-section">
                <div className="category-title-row">
                  <div className="category-pill">
                    {getCategoryIcon(verificationResult.category)}
                    <span>{(verificationResult.category || "Ticket").toUpperCase()}</span>
                  </div>
                  <span className="booking-ref-code">PNR: {verificationResult.providerReference}</span>
                </div>

                <h2 className="booking-main-title">{verificationResult.title}</h2>
                <div className="route-sub">
                  <MapPin size={16} className="text-green" />
                  <span>
                    {verificationResult.sourceLocation && verificationResult.destination 
                      ? `${verificationResult.sourceLocation} ➔ ${verificationResult.destination}`
                      : verificationResult.destination}
                  </span>
                </div>

                <div className="meta-grid">
                  <div className="meta-item">
                    <label>Lead Passenger</label>
                    <strong>{verificationResult.leadPassenger}</strong>
                  </div>
                  <div className="meta-item">
                    <label>Booking ID</label>
                    <strong style="color: #159B75;">{verificationResult.bookingId}</strong>
                  </div>
                  <div className="meta-item">
                    <label>Travel / Visit Date</label>
                    <strong>{verificationResult.travelDate} ({verificationResult.travelTime})</strong>
                  </div>
                  <div className="meta-item">
                    <label>Seat / Class</label>
                    <strong>{verificationResult.seatClass || "Standard Access"}</strong>
                  </div>
                  <div className="meta-item">
                    <label>Service Provider</label>
                    <strong>{verificationResult.operator}</strong>
                  </div>
                  <div className="meta-item">
                    <label>Payment Status</label>
                    <strong style="color: #059669;">₹{verificationResult.amount?.toLocaleString("en-IN")} · Paid & Verified</strong>
                  </div>
                </div>

                {/* Verification Assurance */}
                <div className="assurance-box">
                  <ShieldCheck size={18} className="text-green" />
                  <span>
                    Digital Signature Verified against Roavio Database · Token: <code>{token.slice(0, 20)}...</code>
                  </span>
                </div>

                <div className="action-row">
                  <a 
                    href={`/api/tickets/${verificationResult.bookingId}/pdf`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                  >
                    <Download size={16} /> Download Official PDF Ticket
                  </a>
                  <Link to="/" className="btn btn-outline">
                    Back to Roavio
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ticket-verify-page {
          min-height: 80vh;
          background: #F8FAFC;
          padding: 3rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .verify-card-box {
          max-width: 720px;
          margin: 0 auto;
          background: #FFFFFF;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 16px 45px rgba(20, 43, 69, 0.12);
          border: 1px solid #E2E8F0;
        }

        .verify-header {
          background: #142B45;
          color: white;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .verify-title-tag {
          font-size: 0.72rem;
          color: #FF9B54;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .verify-state-box {
          padding: 3.5rem 2rem;
          text-align: center;
        }

        .verify-spinner {
          width: 44px;
          height: 44px;
          border: 4px solid #E2E8F0;
          border-top-color: #159B75;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-seal {
          color: #EF4444;
          margin-bottom: 1rem;
        }

        .text-red { color: #DC2626; }
        .text-green { color: #159B75; }
        .text-orange { color: #FF9B54; }

        .error-desc {
          color: #64748B;
          max-width: 460px;
          margin: 0.5rem auto 1.5rem;
          font-size: 0.95rem;
        }

        .token-code-row {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 8px;
          padding: 0.6rem 1rem;
          font-size: 0.82rem;
          color: #991B1B;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          word-break: break-all;
        }

        .valid-status-banner {
          background: #ECFDF5;
          border-bottom: 2px solid #10B981;
          padding: 1.25rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #065F46;
        }

        .seal-badge {
          color: #059669;
          flex-shrink: 0;
        }

        .valid-status-banner h3 {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }

        .valid-status-banner p {
          font-size: 0.82rem;
          color: #047857;
        }

        .ticket-meta-section {
          padding: 2rem;
        }

        .category-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .category-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #F1F5F9;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #1E293B;
        }

        .booking-ref-code {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 800;
          color: #159B75;
          background: #E8F6F1;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
        }

        .booking-main-title {
          font-size: 1.4rem;
          color: #142B45;
          margin-bottom: 0.4rem;
        }

        .route-sub {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #64748B;
          font-size: 0.95rem;
          margin-bottom: 1.75rem;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.2rem;
          background: #F8FAFC;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #E2E8F0;
          margin-bottom: 1.5rem;
        }

        .meta-item label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #64748B;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .meta-item strong {
          font-size: 1rem;
          color: #1E293B;
        }

        .assurance-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.82rem;
          color: #059669;
          background: #F0FDF4;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .action-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
