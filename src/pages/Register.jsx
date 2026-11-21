import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Compass, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  X,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSentMobile, setOtpSentMobile] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [gatewayNotice, setGatewayNotice] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (otpModalOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpModalOpen, countdown]);

  const handleSendOtp = async () => {
    setError("");
    setOtpError("");
    const cleanMobile = mobileNumber.replace(/\D/g, "").slice(-10);

    if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError("Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8 or 9).");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: cleanMobile, email: email.trim() })
      });
      const data = await res.json();
      setOtpLoading(false);

      if (data.success) {
        setOtpSentMobile(cleanMobile);
        setDemoOtp(data.demoOtp || "123456");
        if (data.providerStatus && data.providerStatus.includes("0 Credits")) {
          setGatewayNotice("MSG91 Account Alert: Your MSG91 wallet balance is currently 0 SMS Credits. Use the Demo OTP below to complete verification instantly without wallet credits.");
        } else if (data.providerStatus && data.providerStatus.includes("Code 211")) {
          setGatewayNotice("MSG91 received the request, but Indian telecom operators require an approved MSG91 Template ID (SMS_TEMPLATE_ID in .env). Carrier delivery is paused under Code 211. Use the Demo OTP below to verify.");
        } else {
          setGatewayNotice("");
        }
        setOtpModalOpen(true);
        setCountdown(60);
        setCanResend(false);
        setOtpCode("");
      } else {
        setError(data.error || "Failed to send verification OTP via SMS gateway.");
      }
    } catch (err) {
      setOtpLoading(false);
      setOtpSentMobile(cleanMobile);
      setDemoOtp("123456");
      setOtpModalOpen(true);
      setCountdown(60);
      setCanResend(false);
      setOtpCode("");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: otpSentMobile, otp: otpCode.trim() })
      });
      const data = await res.json();
      setOtpLoading(false);

      if (data.success) {
        setIsMobileVerified(true);
        setOtpModalOpen(false);
        setError("");
      } else {
        setOtpError(data.error || "Invalid verification code. Please check and try again.");
      }
    } catch (err) {
      setOtpLoading(false);
      setOtpError("Connection error while verifying OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !mobileNumber) {
      setError("Please fill in all mandatory fields.");
      return;
    }

    // Rule 1: Do not mark mobile as verified until OTP verification succeeds
    if (!isMobileVerified) {
      handleSendOtp();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the terms and privacy policy.");
      return;
    }

    setLoading(true);
    try {
      const trimmedName = (fullName || "Traveler").trim();
      const initials = trimmedName
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "TR";

      const cleanMobile = mobileNumber.replace(/\D/g, "").slice(-10);

      const userProfile = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: trimmedName,
        fullName: trimmedName,
        email: email.trim().toLowerCase(),
        phone: `+91 ${cleanMobile}`,
        mobileNumber: cleanMobile,
        mobileVerified: true,
        avatar: initials,
        city: "New Delhi",
        role: "Traveler",
        status: "Active",
        kycStatus: "Verified",
        bookingsCount: 0,
        tripsPlanned: 0,
        registeredAt: new Date().toISOString()
      };

      // 1. Immediately persist to server disk store (/server/data_store.json)
      try {
        await fetch("/api/admin/record-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userProfile)
        });
      } catch (apiErr) {
        console.warn("Backend user recording sync notice:", apiErr);
      }

      // 2. Broadcast across all open browser windows/tabs for instant zero-latency update
      try {
        if (typeof window !== "undefined" && window.BroadcastChannel) {
          const channel = new BroadcastChannel("roavio_platform_sync");
          channel.postMessage({ type: "USER_REGISTERED", user: userProfile, timestamp: Date.now() });
          channel.close();
        }
      } catch (bcErr) {}

      // 3. Register user in client state
      const result = register(userProfile);

      if (result.success) {
        navigate("/my-trips", { replace: true });
      } else {
        setError(result.error || "Registration failed. Please check inputs.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration error: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Showcase Side */}
        <div className="auth-showcase">
          <div className="showcase-content">
            <Link to="/" className="auth-logo" title="Back to Homepage">
              <img 
                src="/assets/img/logo/white-logo.svg" 
                alt="ROAVIO – Discover India" 
                style={{ height: "38px", width: "auto", display: "block" }} 
              />
            </Link>

            <h2>Begin Your Epic Journey Across Incredible India</h2>
            <p>
              Join 50,000+ travelers discovering hidden gems, iconic UNESCO heritage sites, and scenic mountain escapes.
            </p>

            <div className="showcase-perks">
              <div className="perk-row">
                <ShieldCheck size={18} className="text-green" />
                <span>Verified Mobile Ticket Delivery via SMS & WhatsApp</span>
              </div>
              <div className="perk-row">
                <ShieldCheck size={18} className="text-green" />
                <span>Save favorite attractions across all 36 Indian states & UTs</span>
              </div>
              <div className="perk-row">
                <ShieldCheck size={18} className="text-green" />
                <span>Smart budget forecasting and multi-day itinerary planner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-card-head">
              <h3>Create Your Roavio Account</h3>
              <p>Sign up to start planning and receiving verified mobile tickets</p>
            </div>

            {/* Demo Quick-Fill Buttons */}
            <div className="demo-credentials-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', padding: '0.5rem 0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span className="demo-label" style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Demo Quick Fill:</span>
              <button 
                type="button" 
                onClick={() => {
                  setFullName("Ananya Deshmukh");
                  setEmail("ananya.travel@example.com");
                  setMobileNumber("9823012345");
                  setPassword("roavio2026");
                  setConfirmPassword("roavio2026");
                }}
                className="demo-pill"
                style={{ fontSize: '0.78rem', padding: '4px 10px', background: 'white', border: '1px solid #CBD5E1', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, color: '#0F172A' }}
              >
                Traveler Profile
              </button>
            </div>

            {error && (
              <div className="auth-error-alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Full Name */}
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-icon-box">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="auth-input" 
                    required 
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-icon-box">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="auth-input" 
                    required 
                  />
                </div>
              </div>

              {/* Mobile Number with OTP Verification Flow */}
              <div className="form-group">
                <div className="mobile-label-row">
                  <label>Mobile Number (For Ticket Delivery) *</label>
                  {isMobileVerified ? (
                    <span className="verified-badge-pill">
                      <CheckCircle2 size={13} /> Verified
                    </span>
                  ) : (
                    <span className="unverified-badge-pill">
                      OTP Required
                    </span>
                  )}
                </div>

                <div className="mobile-input-action-row">
                  <div className="input-icon-box flex-grow">
                    <span className="country-code-prefix">+91</span>
                    <input 
                      type="tel" 
                      value={mobileNumber} 
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                        if (isMobileVerified) setIsMobileVerified(false);
                      }}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="auth-input mobile-input-padded" 
                      required 
                    />
                  </div>

                  {!isMobileVerified ? (
                    <button 
                      type="button" 
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="btn-send-otp"
                    >
                      {otpLoading ? "Sending..." : "Verify OTP"}
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => setIsMobileVerified(false)}
                      className="btn-change-mobile"
                      title="Change verified number"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password *</label>
                <div className="input-icon-box">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="auth-input" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-toggle-btn"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label>Confirm Password *</label>
                <div className="input-icon-box">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="auth-input" 
                    required 
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="terms-checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    checked={agreeTerms} 
                    onChange={(e) => setAgreeTerms(e.target.checked)} 
                  />
                  <span>I agree to Roavio's Terms of Service, Privacy Policy & SMS/WhatsApp Travel Notifications</span>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary btn-block auth-submit-btn"
              >
                {loading ? "Creating Verified Account..." : (
                  <>
                    Create Free Account <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer-link">
              Already have an account? <Link to="/login">Sign In here</Link>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {otpModalOpen && (
        <div className="otp-modal-backdrop" onClick={() => setOtpModalOpen(false)}>
          <div className="otp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="otp-modal-header">
              <div className="otp-icon-seal">
                <Phone size={24} />
              </div>
              <button 
                className="otp-close-btn"
                onClick={() => setOtpModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="otp-modal-body">
              <h3>Verify Your Mobile Number</h3>
              <p className="otp-sub-text">
                Enter the 6-digit verification code sent via SMS to <br />
                <strong>+91 {otpSentMobile}</strong>
              </p>

              {demoOtp && (
                <div 
                  className="demo-otp-helper" 
                  onClick={() => setOtpCode(demoOtp)} 
                  style={{ 
                    cursor: 'pointer', 
                    background: '#ECFDF5', 
                    border: '1px solid #10B981', 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }} 
                  title="Click to auto-fill demo OTP"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} style={{ color: '#059669' }} />
                    <span style={{ color: '#065F46', fontSize: '13px' }}>
                      Demo OTP: <strong style={{ textDecoration: 'underline', fontSize: '14px' }}>{demoOtp}</strong>
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setOtpCode(demoOtp); }}
                    style={{ background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Auto Fill
                  </button>
                </div>
              )}

              {gatewayNotice && (
                <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', color: '#92400E', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.4', marginBottom: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Carrier Note:</strong> {gatewayNotice}</span>
                </div>
              )}

              {otpError && (
                <div className="otp-error-alert">
                  <AlertCircle size={15} />
                  <span>{otpError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="otp-form">
                <div className="otp-input-wrap">
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="otp-digit-input"
                    autoFocus
                  />
                </div>

                <div className="otp-timer-row">
                  {countdown > 0 ? (
                    <span className="timer-text">
                      <Clock size={13} /> Resend OTP in <strong>{countdown}s</strong>
                    </span>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleSendOtp}
                      className="resend-otp-btn"
                    >
                      <RefreshCw size={13} /> Resend OTP
                    </button>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={otpLoading || otpCode.length < 6}
                  className="btn btn-primary btn-block btn-confirm-otp"
                >
                  {otpLoading ? "Verifying..." : "Verify Mobile Number"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .auth-page {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-bg);
          padding: 2.5rem 1rem;
        }

        .auth-container {
          max-width: 1040px;
          width: 100%;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.08);
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          border: 1px solid #E2E8F0;
        }

        .auth-showcase {
          background: #142B45;
          color: white;
          padding: 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }

        .auth-logo {
          margin-bottom: 2rem;
          display: inline-block;
        }

        .auth-showcase h2 {
          font-size: 2rem;
          color: white;
          line-height: 1.25;
          margin-bottom: 1rem;
        }

        .auth-showcase p {
          color: #94A3B8;
          font-size: 1rem;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .showcase-perks {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .perk-row {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          font-size: 0.92rem;
          color: #E2E8F0;
        }

        .auth-form-side {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-card-head {
          margin-bottom: 1.8rem;
        }

        .auth-card-head h3 {
          font-size: 1.6rem;
          color: #142B45;
          margin-bottom: 0.3rem;
        }

        .auth-card-head p {
          color: #64748B;
          font-size: 0.92rem;
        }

        .auth-error-alert {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          margin-bottom: 1.5rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.4rem;
        }

        .mobile-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }

        .verified-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
        }

        .unverified-badge-pill {
          display: inline-flex;
          align-items: center;
          background: #FFFBEB;
          color: #D97706;
          border: 1px solid #FDE68A;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
        }

        .mobile-input-action-row {
          display: flex;
          gap: 0.6rem;
          align-items: stretch;
        }

        .flex-grow {
          flex-grow: 1;
        }

        .country-code-prefix {
          padding-left: 0.85rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: #142B45;
        }

        .mobile-input-padded {
          padding-left: 0.4rem !important;
        }

        .btn-send-otp {
          background: #142B45;
          color: white;
          border: none;
          padding: 0 1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s ease;
        }

        .btn-send-otp:hover {
          background: #159B75;
        }

        .btn-change-mobile {
          background: #F1F5F9;
          color: #475569;
          border: 1px solid #CBD5E1;
          padding: 0 0.8rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .input-icon-box {
          position: relative;
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          transition: border-color 0.2s ease;
        }

        .input-icon-box:focus-within {
          border-color: #159B75;
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.15);
        }

        .input-icon {
          margin-left: 0.85rem;
          color: #94A3B8;
        }

        .auth-input {
          width: 100%;
          padding: 0.75rem 0.85rem;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.95rem;
          color: #1E293B;
        }

        .eye-toggle-btn {
          background: none;
          border: none;
          padding: 0.5rem 0.85rem;
          color: #94A3B8;
          cursor: pointer;
        }

        .terms-checkbox label {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.82rem;
          color: #64748B;
          cursor: pointer;
          line-height: 1.4;
        }

        .terms-checkbox input {
          margin-top: 3px;
        }

        .auth-submit-btn {
          margin-top: 0.5rem;
          padding: 0.85rem;
          font-size: 1rem;
        }

        .auth-footer-link {
          text-align: center;
          font-size: 0.9rem;
          color: #64748B;
          margin-top: 1.5rem;
        }

        .auth-footer-link a {
          color: #159B75;
          font-weight: 700;
        }

        /* OTP Modal Styles */
        .otp-modal-backdrop {
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
          padding: 1rem;
        }

        .otp-modal-card {
          background: white;
          border-radius: 20px;
          max-width: 440px;
          width: 100%;
          padding: 2rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
          animation: modalPop 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .otp-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .otp-icon-seal {
          width: 48px;
          height: 48px;
          background: #ECFDF5;
          color: #159B75;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .otp-close-btn {
          background: #F1F5F9;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
        }

        .otp-modal-body h3 {
          font-size: 1.35rem;
          color: #142B45;
          margin-bottom: 0.35rem;
        }

        .otp-sub-text {
          font-size: 0.9rem;
          color: #64748B;
          margin-bottom: 1.2rem;
          line-height: 1.5;
        }

        .demo-otp-helper {
          background: #FFF7ED;
          border: 1px dashed #FDBA74;
          padding: 0.6rem 0.9rem;
          border-radius: 8px;
          font-size: 0.82rem;
          color: #9A3412;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.2rem;
        }

        .otp-error-alert {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FECACA;
          border-radius: 8px;
          padding: 0.5rem 0.8rem;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .otp-digit-input {
          width: 100%;
          text-align: center;
          font-family: monospace;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: 0.4em;
          padding: 0.75rem;
          border: 2px solid #CBD5E1;
          border-radius: 12px;
          background: #F8FAFC;
          outline: none;
          color: #142B45;
          margin-bottom: 1.2rem;
        }

        .otp-digit-input:focus {
          border-color: #159B75;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(21, 155, 117, 0.15);
        }

        .otp-timer-row {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .timer-text {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          color: #64748B;
        }

        .resend-otp-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          color: #159B75;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-confirm-otp {
          padding: 0.85rem;
          font-size: 0.95rem;
        }

        @media (max-width: 900px) {
          .auth-container {
            grid-template-columns: 1fr;
          }
          .auth-showcase {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
