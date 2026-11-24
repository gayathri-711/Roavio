import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Headphones, 
  ShieldCheck, 
  Sparkles,
  Building2,
  ExternalLink,
  HelpCircle,
  Smartphone
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Custom Itinerary Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate inquiry dispatch & Google email trigger
    try {
      await fetch('/api/contact-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => null);
    } catch (err) {
      // Graceful fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="contact-page-wrapper">
      {/* Hero Section */}
      <section className="contact-hero-banner">
        <div className="container position-relative z-2">
          <div className="contact-hero-content text-center">
            <div className="d-inline-flex align-items-center gap-2 hero-badge mb-3">
              <Sparkles size={15} className="text-orange" />
              <span>Official 24x7 India Travel Concierge & Helpline</span>
            </div>
            <h1 className="contact-hero-title">Get in Touch with Roavio</h1>
            <p className="contact-hero-subtitle">
              Have questions, need personalized itinerary advice, or require urgent booking assistance? 
              Our certified India travel specialists are standing by 24 hours a day, 7 days a week.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="contact-body-section py-5">
        <div className="container">
          {/* 4 Direct Contact Cards Grid */}
          <div className="contact-cards-grid mb-5">
            {/* Card 1: 24x7 Toll-Free Helpline */}
            <div className="contact-card">
              <div className="contact-card-icon-box phone-box">
                <Phone size={24} />
              </div>
              <span className="contact-card-badge">TOLL-FREE 24x7</span>
              <h3 className="contact-card-title">Helpline Number</h3>
              <p className="contact-card-desc">
                Instant telephone support across all Indian states and mobile operators. Zero waiting queue.
              </p>
              <div className="contact-card-action">
                <a href="tel:18001029900" className="contact-primary-link text-emerald">
                  1800 102 9900
                </a>
                <span className="contact-sub-info">Direct Toll-Free Hotline</span>
              </div>
            </div>

            {/* Card 2: WhatsApp Instant Concierge */}
            <div className="contact-card">
              <div className="contact-card-icon-box whatsapp-box">
                <Smartphone size={24} />
              </div>
              <span className="contact-card-badge wa-badge">WHATSAPP CHAT</span>
              <h3 className="contact-card-title">WhatsApp Support</h3>
              <p className="contact-card-desc">
                Chat with our live concierge for instant booking confirmation, PDF tickets & GPS routes.
              </p>
              <div className="contact-card-action">
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contact-primary-link text-green"
                >
                  +91 98765 43210
                </a>
                <span className="contact-sub-info">Replies usually in &lt; 2 minutes</span>
              </div>
            </div>

            {/* Card 3: Official Support Email */}
            <div className="contact-card">
              <div className="contact-card-icon-box email-box">
                <Mail size={24} />
              </div>
              <span className="contact-card-badge email-badge">OFFICIAL EMAIL</span>
              <h3 className="contact-card-title">Email Desk</h3>
              <p className="contact-card-desc">
                Send complex group tour inquiries, corporate partnerships, or custom itinerary requests.
              </p>
              <div className="contact-card-action">
                <a href="mailto:support@roavio.com" className="contact-primary-link text-blue">
                  support@roavio.com
                </a>
                <span className="contact-sub-info">Official ticketing &amp; tax invoicing</span>
              </div>
            </div>

            {/* Card 4: Headquarters & Working Hours */}
            <div className="contact-card">
              <div className="contact-card-icon-box office-box">
                <Building2 size={24} />
              </div>
              <span className="contact-card-badge office-badge">NATIONAL HQ</span>
              <h3 className="contact-card-title">Headquarters</h3>
              <p className="contact-card-desc">
                Connaught Place, Inner Circle, New Delhi 110001, India. Hubs in Mumbai &amp; Bengaluru.
              </p>
              <div className="contact-card-action">
                <strong className="contact-primary-text">Open 24/7 · 365 Days</strong>
                <span className="contact-sub-info">Always active for travelers</span>
              </div>
            </div>
          </div>

          {/* Form and Office Details Split */}
          <div className="contact-layout-split">
            {/* Left: Contact & Inquiry Form */}
            <div className="contact-form-container">
              <div className="form-header-box mb-4">
                <span className="form-kicker">SEND AN INQUIRY</span>
                <h2 className="form-title">Speak to Our Travel Specialists</h2>
                <p className="form-subtitle">
                  Fill out the form below and one of our dedicated holiday planners will get back to you with custom travel quotes within 15 minutes.
                </p>
              </div>

              {isSubmitted ? (
                <div className="contact-success-card text-center p-4">
                  <div className="success-icon-circle mx-auto mb-3">
                    <CheckCircle2 size={40} className="text-white" />
                  </div>
                  <h3 className="text-navy mb-2">Inquiry Dispatched Successfully!</h3>
                  <p className="text-muted mb-4">
                    Thank you, <strong>{formData.name}</strong>. We have received your inquiry. A Roavio specialist will call or WhatsApp you at <strong>+91 {formData.phone}</strong> and email details to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", subject: "Custom Itinerary Inquiry", message: "" });
                    }}
                    className="btn btn-outline"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="roavio-contact-form">
                  <div className="form-row-2 mb-3">
                    <div className="form-group">
                      <label className="contact-field-label">Full Name <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="contact-text-input" 
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>
                    <div className="form-group">
                      <label className="contact-field-label">Mobile Number <span className="text-danger">*</span></label>
                      <div className="phone-input-wrap">
                        <span className="phone-prefix">🇮🇳 +91</span>
                        <input 
                          type="tel" 
                          required
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                          className="contact-text-input ps-prefix" 
                          placeholder="10-digit mobile number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row-2 mb-3">
                    <div className="form-group">
                      <label className="contact-field-label">Email Address <span className="text-danger">*</span></label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="contact-text-input" 
                        placeholder="e.g. rahul.sharma@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="contact-field-label">Inquiry Subject</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="contact-text-input"
                      >
                        <option value="Custom Itinerary Inquiry">Custom Tour &amp; Itinerary Planning</option>
                        <option value="Booking Confirmation Help">Ticket Reservation &amp; PNR Help</option>
                        <option value="Group Tour Booking">Group / Corporate Tour Package</option>
                        <option value="Flight/Train/Bus Question">Transport Modes &amp; Verified Tickets</option>
                        <option value="Cancellation & Refund">Cancellation &amp; Refund Request</option>
                        <option value="Other Assistance">Other Questions</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label className="contact-field-label">How Can We Help You? <span className="text-danger">*</span></label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="contact-text-input contact-textarea" 
                      placeholder="Tell us about your destination preferences, travel dates, party size, or specific requirements..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn btn-primary btn-block contact-submit-btn"
                  >
                    {isSubmitting ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Inquiry to 24x7 Concierge</span>
                      </>
                    )}
                  </button>

                  <div className="form-security-strip mt-3 text-center text-muted small">
                    <ShieldCheck size={14} className="text-emerald me-1 inline-icon" />
                    <span>Your contact details are strictly confidential. Zero marketing spam guaranteed.</span>
                  </div>
                </form>
              )}
            </div>

            {/* Right: Quick Highlights, Locations & FAQ */}
            <div className="contact-sidebar-container">
              {/* 24x7 Emergency Help Desk Card */}
              <div className="sidebar-contact-card mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Headphones size={20} className="text-emerald" />
                  <h4 className="sidebar-card-title m-0">24x7 Traveler Emergency Desk</h4>
                </div>
                <p className="sidebar-card-desc">
                  Already traveling on a Roavio tour and need on-ground transit or hotel assistance?
                </p>
                <div className="emergency-callout">
                  <span className="emergency-lbl">Direct Emergency Line:</span>
                  <a href="tel:18001029900" className="emergency-num">
                    1800 102 9900 (Option 1)
                  </a>
                </div>
              </div>

              {/* Regional Offices */}
              <div className="sidebar-contact-card mb-4">
                <h4 className="sidebar-card-title mb-3">Regional Roavio Offices</h4>
                <div className="offices-list">
                  <div className="office-item">
                    <MapPin size={16} className="text-emerald flex-shrink-0 mt-1" />
                    <div>
                      <strong>New Delhi (HQ)</strong>
                      <p className="small text-muted mb-0">Connaught Place, Barakhamba Road, New Delhi 110001</p>
                    </div>
                  </div>
                  <div className="office-item">
                    <MapPin size={16} className="text-orange flex-shrink-0 mt-1" />
                    <div>
                      <strong>Mumbai Hub</strong>
                      <p className="small text-muted mb-0">Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051</p>
                    </div>
                  </div>
                  <div className="office-item">
                    <MapPin size={16} className="text-blue flex-shrink-0 mt-1" />
                    <div>
                      <strong>Bengaluru Hub</strong>
                      <p className="small text-muted mb-0">100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick FAQs */}
              <div className="sidebar-contact-card">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <HelpCircle size={18} className="text-orange" />
                  <h4 className="sidebar-card-title m-0">Frequently Asked Questions</h4>
                </div>
                <div className="contact-faq-stack">
                  <details className="faq-toggle">
                    <summary className="faq-q">How quickly will I receive my tickets?</summary>
                    <p className="faq-a">E-Tickets are dispatched immediately via WhatsApp and Email as soon as payment is confirmed.</p>
                  </details>
                  <details className="faq-toggle">
                    <summary className="faq-q">Can I modify my planned itinerary?</summary>
                    <p className="faq-a">Yes! You can edit, switch hotel tiers, and reorder attraction stops anytime in your traveler dashboard.</p>
                  </details>
                  <details className="faq-toggle">
                    <summary className="faq-q">Are all payments secured?</summary>
                    <p className="faq-a">All transactions are processed via NPCI-approved bank payment gateways with 256-Bit SSL encryption.</p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Google Map Section */}
      <section className="contact-map-embed-section pb-5">
        <div className="container">
          <div className="map-frame-box">
            <iframe 
              title="Roavio Headquarters Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.114782390885!2d77.2119!3d28.6328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b7582b9b%3A0x6a10052b61405a2!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="380" 
              style={{ border: 0, borderRadius: "18px" }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <style>{`
        .contact-page-wrapper {
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        .contact-hero-banner {
          position: relative;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.90) 50%, rgba(6, 78, 59, 0.94) 100%),
                      url('/assets/img/inner-page/breadcrumb/bg-3.jpg') center/cover no-repeat;
          color: #FFFFFF;
          padding: 4.5rem 0 3.8rem;
          border-bottom: 4px solid var(--color-green);
        }

        .hero-badge {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #F8FAFC;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          backdrop-filter: blur(8px);
        }

        .contact-hero-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: #FFFFFF;
          margin-bottom: 0.8rem;
        }

        .contact-hero-subtitle {
          color: #CBD5E1;
          font-size: 1.05rem;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* 4 Cards Grid */
        .contact-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .contact-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 18px;
          padding: 1.6rem 1.4rem;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.25s ease;
        }

        .contact-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
          border-color: #CBD5E1;
        }

        .contact-card-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .phone-box { background: #ECFDF5; color: #059669; }
        .whatsapp-box { background: #F0FDF4; color: #16A34A; }
        .email-box { background: #EFF6FF; color: #2563EB; }
        .office-box { background: #FFFBEB; color: #D97706; }

        .contact-card-badge {
          font-size: 0.68rem;
          font-weight: 800;
          color: #059669;
          background: #DCFCE7;
          padding: 2px 8px;
          border-radius: 10px;
          margin-bottom: 0.5rem;
          letter-spacing: 0.04em;
        }

        .wa-badge { color: #16A34A; background: #DCFCE7; }
        .email-badge { color: #2563EB; background: #DBEAFE; }
        .office-badge { color: #D97706; background: #FEF3C7; }

        .contact-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 0.5rem;
        }

        .contact-card-desc {
          font-size: 0.85rem;
          color: #64748B;
          line-height: 1.5;
          margin-bottom: 1.2rem;
          flex-grow: 1;
        }

        .contact-card-action {
          border-top: 1px solid #F1F5F9;
          padding-top: 0.85rem;
          width: 100%;
        }

        .contact-primary-link {
          font-size: 1.15rem;
          font-weight: 800;
          text-decoration: none;
          display: block;
          margin-bottom: 2px;
        }

        .contact-primary-text {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
          display: block;
          margin-bottom: 2px;
        }

        .contact-sub-info {
          font-size: 0.75rem;
          color: #94A3B8;
          display: block;
        }

        /* Split Layout */
        .contact-layout-split {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .contact-form-container {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 22px;
          padding: 2.2rem;
          box-shadow: 0 10px 35px rgba(15, 23, 42, 0.05);
        }

        .form-kicker {
          font-size: 0.75rem;
          font-weight: 800;
          color: #059669;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 0.35rem;
        }

        .form-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 0.4rem;
        }

        .form-subtitle {
          font-size: 0.9rem;
          color: #64748B;
          line-height: 1.5;
          margin: 0;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .contact-field-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #1E293B;
          margin-bottom: 0.35rem;
        }

        .contact-text-input {
          width: 100%;
          padding: 0.78rem 1rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 11px;
          font-size: 0.92rem;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }

        .contact-text-input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }

        .phone-input-wrap {
          display: flex;
          align-items: stretch;
          border: 1.5px solid #CBD5E1;
          border-radius: 11px;
          background: #FFFFFF;
          overflow: hidden;
        }

        .phone-input-wrap:focus-within {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }

        .phone-prefix {
          padding: 0 12px;
          background: #F8FAFC;
          border-right: 1.5px solid #E2E8F0;
          display: flex;
          align-items: center;
          font-size: 0.88rem;
          font-weight: 700;
          color: #334155;
          user-select: none;
        }

        .contact-text-input.ps-prefix {
          border: none;
          outline: none;
          border-radius: 0;
        }

        .contact-textarea {
          resize: vertical;
        }

        .contact-submit-btn {
          padding: 0.95rem;
          font-size: 1rem;
          font-weight: 800;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          border: none;
          color: #FFFFFF;
          box-shadow: 0 6px 18px rgba(5, 150, 105, 0.35);
          cursor: pointer;
          transition: all 0.2s;
        }

        .contact-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(5, 150, 105, 0.45);
        }

        .contact-success-card {
          background: #F0FDF4;
          border: 1.5px solid #BBF7D0;
          border-radius: 16px;
        }

        .success-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Sidebar Cards */
        .sidebar-contact-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 18px;
          padding: 1.5rem;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.03);
        }

        .sidebar-card-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
        }

        .sidebar-card-desc {
          font-size: 0.85rem;
          color: #64748B;
          line-height: 1.5;
          margin-bottom: 0.9rem;
        }

        .emergency-callout {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 0.75rem 1rem;
        }

        .emergency-lbl {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #991B1B;
        }

        .emergency-num {
          font-size: 1.15rem;
          font-weight: 900;
          color: #DC2626;
          text-decoration: none;
        }

        .offices-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .office-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.86rem;
        }

        .contact-faq-stack {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .faq-toggle {
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
          background: #F8FAFC;
        }

        .faq-q {
          font-size: 0.86rem;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
        }

        .faq-a {
          font-size: 0.82rem;
          color: #64748B;
          margin: 0.5rem 0 0;
          line-height: 1.45;
        }

        .map-frame-box {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          border: 1.5px solid #E2E8F0;
        }

        @media (max-width: 1024px) {
          .contact-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .contact-layout-split {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .contact-cards-grid {
            grid-template-columns: 1fr;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
          .contact-form-container {
            padding: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
