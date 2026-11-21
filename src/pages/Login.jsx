import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Compass, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Phone,
  Sparkles,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loginMethod, setLoginMethod] = useState("password"); // "password" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Mobile OTP Login States
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const from = location.state?.from?.pathname || "/my-trips";

  const handleSendLoginOtp = async (e) => {
    e?.preventDefault();
    setError("");
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
        body: JSON.stringify({ mobileNumber: cleanMobile })
      });
      const data = await res.json();
      setOtpLoading(false);
      setOtpSent(true);
      setDemoOtp(data.demoOtp || "123456");
      setOtpCode("");
    } catch (err) {
      setOtpLoading(false);
      setOtpSent(true);
      setDemoOtp("123456");
      setOtpCode("");
    }
  };

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setError("");
    const cleanMobile = mobileNumber.replace(/\D/g, "").slice(-10);

    if (!otpCode || otpCode.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: cleanMobile, otp: otpCode.trim() })
      });
      const data = await res.json();
      setOtpLoading(false);

      if (data.success || otpCode.trim() === "123456" || otpCode.trim() === demoOtp) {
        let registeredUser = null;
        try {
          const storedUsers = JSON.parse(localStorage.getItem("roavio_registered_users") || "[]");
          registeredUser = storedUsers.find(u => (u.phone || "").includes(cleanMobile) || (u.mobileNumber || "") === cleanMobile);
        } catch (e) {}

        const userToLogin = registeredUser || {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name: "Traveler " + cleanMobile.slice(-4),
          email: `traveler${cleanMobile.slice(-4)}@roavio.com`,
          phone: `+91 ${cleanMobile}`,
          mobileNumber: cleanMobile,
          avatar: "TR",
          role: "Traveler",
          isLoggedIn: true
        };

        const result = login(userToLogin, "otp_login");
        if (result.success) {
          navigate(from, { replace: true });
        } else {
          setError(result.error || "Login failed.");
        }
      } else {
        setError(data.error || "Invalid verification code. Please check and try again.");
      }
    } catch (err) {
      setOtpLoading(false);
      setError("Verification failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const isAdminLogin = trimmedEmail.toLowerCase().includes("admin") || trimmedEmail.toLowerCase() === "admin@roavio.com";
      const displayName = isAdminLogin 
        ? "Roavio Administrator" 
        : trimmedEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

      // Check registered users in localStorage
      let registeredUser = null;
      try {
        const storedUsers = JSON.parse(localStorage.getItem("roavio_registered_users") || "[]");
        registeredUser = storedUsers.find(u => u.email.toLowerCase() === trimmedEmail.toLowerCase());
      } catch (e) {}

      const userToLogin = registeredUser || {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: displayName,
        email: trimmedEmail,
        avatar: (displayName || "TR").substring(0, 2).toUpperCase(),
        role: isAdminLogin ? "Administrator" : "Traveler"
      };

      const result = login(userToLogin, password);

      if (result.success) {
        if (isAdminLogin) {
          navigate("/admin", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setError("Login failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side: Brand Showcase */}
        <div className="auth-showcase">
          <div className="showcase-content">
            <Link to="/" className="auth-logo" title="Back to Homepage">
              <img 
                src="/assets/img/logo/white-logo.svg" 
                alt="ROAVIO – Discover India" 
                style={{ height: "38px", width: "auto", display: "block" }} 
              />
            </Link>

            <h2>Your Passport to Exploring Incredible India</h2>
            <p>
              Access your personalized travel itineraries, booked tickets, saved destinations, and geodetic route maps from any device.
            </p>

            <div className="showcase-perks">
              <div className="perk-row">
                <ShieldCheck size={18} className="text-green" />
                <span>Instant itinerary sync across 175+ Indian destinations</span>
              </div>
              <div className="perk-row">
                <ShieldCheck size={18} className="text-green" />
                <span>IRCTC train & luxury sleeper bus reservation demo</span>
              </div>
              <div className="perk-row">
                <ShieldCheck size={18} className="text-green" />
                <span>Verified aerial distance & route planning tools</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-card-head">
              <h3>Welcome Back</h3>
              <p>Log in to access your planned trips and travel bookings</p>
            </div>

            {/* Login Method Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#F1F5F9', padding: '4px', borderRadius: '10px' }}>
              <button 
                type="button" 
                onClick={() => { setLoginMethod("password"); setError(""); }}
                style={{ flex: 1, padding: '9px 12px', border: 'none', borderRadius: '8px', background: loginMethod === "password" ? "#FFFFFF" : "transparent", fontWeight: 600, color: loginMethod === "password" ? "#142B45" : "#64748B", boxShadow: loginMethod === "password" ? "0 1px 3px rgba(0,0,0,0.08)" : "none", cursor: 'pointer', transition: 'all 0.2s', fontSize: '13px' }}
              >
                Sign In with Password
              </button>
              <button 
                type="button" 
                onClick={() => { setLoginMethod("otp"); setError(""); }}
                style={{ flex: 1, padding: '9px 12px', border: 'none', borderRadius: '8px', background: loginMethod === "otp" ? "#FFFFFF" : "transparent", fontWeight: 600, color: loginMethod === "otp" ? "#142B45" : "#64748B", boxShadow: loginMethod === "otp" ? "0 1px 3px rgba(0,0,0,0.08)" : "none", cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
              >
                <Sparkles size={14} style={{ color: '#159B75' }} />
                Sign In with Mobile OTP
              </button>
            </div>

            {error && (
              <div className="auth-error-alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {loginMethod === "password" ? (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-icon-box">
                    <Mail size={18} className="input-icon" />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="auth-input" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="flex-between">
                    <label>Password</label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo Mode: You can use any password to log in."); }} className="forgot-link">
                      Forgot password?
                    </a>
                  </div>
                  <div className="input-icon-box">
                    <Lock size={18} className="input-icon" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
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

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary btn-block auth-submit-btn"
                >
                  {loading ? "Logging In..." : (
                    <>
                      Sign In to Roavio <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={otpSent ? handleVerifyLoginOtp : handleSendLoginOtp} className="auth-form">
                <div className="form-group">
                  <label>Mobile Number (India)</label>
                  <div className="input-icon-box" style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '0 12px', color: '#64748B', fontWeight: '700', fontSize: '14px', borderRight: '1px solid #E2E8F0' }}>+91</span>
                    <input 
                      type="tel" 
                      maxLength={10}
                      value={mobileNumber} 
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="auth-input" 
                      style={{ border: 'none', outline: 'none' }}
                      required 
                    />
                  </div>
                </div>

                {otpSent && (
                  <>
                    {demoOtp && (
                      <div 
                        onClick={() => setOtpCode(demoOtp)} 
                        style={{ 
                          cursor: 'pointer', 
                          background: '#ECFDF5', 
                          border: '1px solid #10B981', 
                          padding: '10px 14px', 
                          borderRadius: '8px', 
                          marginBottom: '16px',
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

                    <div className="form-group">
                      <label>6-Digit Verification Code</label>
                      <div className="input-icon-box">
                        <Lock size={18} className="input-icon" />
                        <input 
                          type="text" 
                          maxLength={6}
                          value={otpCode} 
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="• • • • • •"
                          className="auth-input" 
                          autoFocus
                          required 
                        />
                      </div>
                    </div>
                  </>
                )}

                <button 
                  type="submit" 
                  disabled={otpLoading}
                  className="btn btn-primary btn-block auth-submit-btn"
                >
                  {otpLoading ? "Processing..." : (
                    otpSent ? (
                      <>
                        Verify OTP & Log In <ArrowRight size={16} />
                      </>
                    ) : (
                      <>
                        Send Login OTP <ArrowRight size={16} />
                      </>
                    )
                  )}
                </button>

                {otpSent && (
                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <button 
                      type="button" 
                      onClick={handleSendLoginOtp}
                      style={{ background: 'none', border: 'none', color: '#159B75', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Resend Verification Code
                    </button>
                  </div>
                )}
              </form>
            )}

            <div className="auth-footer-link">
              Don't have an account yet?{" "}
              <Link to="/register">Create an account</Link>
            </div>
          </div>
        </div>
      </div>

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
          background: linear-gradient(135deg, var(--color-navy) 0%, #1c3c63 100%);
          color: white;
          padding: 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }

        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 2.5rem;
          text-decoration: none;
        }

        .logo-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--color-green);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-title {
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: 1px;
          color: white;
          display: block;
        }

        .logo-tag {
          font-size: 0.65rem;
          letter-spacing: 2px;
          color: var(--color-orange);
          font-weight: 700;
          display: block;
        }

        .auth-showcase h2 {
          color: white;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .auth-showcase p {
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.98rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .showcase-perks {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .perk-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .auth-form-side {
          padding: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
        }

        .auth-card-head {
          margin-bottom: 1.5rem;
        }

        .auth-card-head h3 {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0 0 0.3rem;
        }

        .auth-card-head p {
          color: #64748B;
          font-size: 0.9rem;
          margin: 0;
        }

        .demo-credentials-bar {
          background: #F1F5F9;
          border-radius: 10px;
          padding: 0.5rem 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.4rem;
        }

        .demo-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
        }

        .demo-pill {
          background: white;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          padding: 0.2rem 0.55rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-navy);
          cursor: pointer;
        }

        .demo-pill:hover {
          border-color: var(--color-green);
          color: var(--color-green);
        }

        .auth-error-alert {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #FEE2E2;
          color: #B91C1C;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 0.7rem 0.9rem;
          font-size: 0.85rem;
          margin-bottom: 1.2rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .input-icon-box {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 12px;
          padding: 0.65rem 0.9rem;
          transition: all 0.2s;
        }

        .input-icon-box:focus-within {
          border-color: var(--color-green);
          background: white;
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.12);
        }

        .input-icon {
          color: #94A3B8;
          margin-right: 0.6rem;
          flex-shrink: 0;
        }

        .auth-input {
          flex-grow: 1;
          border: none;
          background: transparent;
          font-size: 0.92rem;
          color: var(--color-navy);
          outline: none;
        }

        .eye-toggle-btn {
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .forgot-link {
          font-size: 0.8rem;
          color: var(--color-green);
          font-weight: 600;
        }

        .auth-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem;
          font-size: 0.95rem;
          margin-top: 0.5rem;
        }

        .auth-footer-link {
          margin-top: 1.8rem;
          text-align: center;
          font-size: 0.88rem;
          color: #64748B;
        }

        .auth-footer-link a {
          color: var(--color-green);
          font-weight: 700;
        }

        @media (max-width: 860px) {
          .auth-container {
            grid-template-columns: 1fr;
          }

          .auth-showcase {
            display: none;
          }

          .auth-form-side {
            padding: 2.5rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
