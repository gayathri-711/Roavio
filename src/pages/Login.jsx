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
  Clock,
  Key,
  X
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

  // Forgot Password Modal States
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    const clean = (forgotEmail || "").trim();
    if (!clean || !clean.includes("@")) {
      setForgotError("Please enter a valid registered email address.");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean })
      });
      const data = await res.json();
      setForgotLoading(false);
      if (data.success) {
        setForgotSuccess(data.message || `Password reset instructions sent to ${clean}.`);
      } else {
        setForgotError(data.error || "Failed to dispatch password recovery email.");
      }
    } catch (err) {
      setForgotLoading(false);
      setForgotError("Network error while connecting to server. Please try again.");
    }
  };

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
          try {
            if (typeof window !== "undefined" && window.BroadcastChannel) {
              const channel = new BroadcastChannel("roavio_platform_sync");
              channel.postMessage({ type: "USER_LOGGED_IN", user: userToLogin, timestamp: Date.now() });
              channel.close();
            }
          } catch (e) {}
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
        try {
          if (typeof window !== "undefined" && window.BroadcastChannel) {
            const channel = new BroadcastChannel("roavio_platform_sync");
            channel.postMessage({ type: "USER_LOGGED_IN", user: userToLogin, timestamp: Date.now() });
            channel.close();
          }
        } catch (e) {}
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
                    <button 
                      type="button" 
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotError("");
                        setForgotSuccess("");
                        setForgotModalOpen(true);
                      }} 
                      className="forgot-link"
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
                    >
                      Forgot password?
                    </button>
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

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "16px"
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "460px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            border: "1px solid #E2E8F0"
          }}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #091E3A 0%, #102A45 100%)",
              color: "#FFFFFF",
              padding: "24px 24px 20px",
              position: "relative"
            }}>
              <button 
                type="button" 
                onClick={() => setForgotModalOpen(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  cursor: "pointer"
                }}
              >
                <X size={18} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid #10B981",
                  borderRadius: "10px",
                  padding: "8px",
                  display: "flex"
                }}>
                  <Key size={20} style={{ color: "#34D399" }} />
                </div>
                <h3 style={{ margin: 0, fontSize: "19px", fontWeight: "800" }}>Reset Account Password</h3>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#94A3B8", lineHeight: "1.5" }}>
                Enter your registered email. We will send secure reset instructions via our Google Apps Script email service.
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: "24px" }}>
              {forgotSuccess ? (
                <div style={{
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: "12px",
                  padding: "18px",
                  textAlign: "center"
                }}>
                  <CheckCircle2 size={36} style={{ color: "#059669", margin: "0 auto 10px" }} />
                  <h4 style={{ margin: "0 0 6px", color: "#065F46", fontSize: "16px", fontWeight: "800" }}>Instructions Dispatched</h4>
                  <p style={{ margin: "0 0 16px", color: "#047857", fontSize: "13px", lineHeight: "1.5" }}>
                    {forgotSuccess}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(false);
                      setForgotSuccess("");
                    }}
                    className="btn btn-primary btn-block"
                    style={{ padding: "10px 16px", fontSize: "13px" }}
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  {forgotError && (
                    <div style={{
                      background: "#FEF2F2",
                      border: "1px solid #FECACA",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#991B1B",
                      fontSize: "13px"
                    }}>
                      <AlertCircle size={16} />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px", color: "#334155" }}>
                      Registered Email Address
                    </label>
                    <div className="input-icon-box">
                      <Mail size={18} className="input-icon" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="auth-input"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(false)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "#F1F5F9",
                        border: "1px solid #CBD5E1",
                        borderRadius: "12px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#475569",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="btn btn-primary"
                      style={{
                        flex: 2,
                        padding: "12px",
                        fontSize: "14px",
                        fontWeight: "700"
                      }}
                    >
                      {forgotLoading ? "Sending..." : "Send Reset Email ➔"}
                    </button>
                  </div>
                </form>
              )}
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
