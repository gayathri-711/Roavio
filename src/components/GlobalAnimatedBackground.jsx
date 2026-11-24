import React from "react";

/**
 * GlobalAnimatedBackground
 * 
 * Provides an ultra-modern, luxury ambient background across the entire Roavio travel platform.
 * Features:
 * 1. Slow-drifting, hardware-accelerated aurora glow orbs (Emerald, Amber Gold, Sky Cyan, Sapphire)
 * 2. Subtle bespoke topographic wanderlust contour line texture (elevation map lines)
 * 3. Animated subtle flight paths with dashed trajectory line
 * 4. Delicate floating travel compass stars / particle nodes
 * 
 * 100% non-intrusive, zero pointer capture (pointer-events: none), 60fps GPU acceleration.
 */
export default function GlobalAnimatedBackground() {
  return (
    <div className="roavio-global-ambient-bg" aria-hidden="true">
      {/* 1. FLOATING AURORA GLOW ORBS (LUXURY AMBIENCE) */}
      <div className="aurora-orb orb-emerald"></div>
      <div className="aurora-orb orb-gold"></div>
      <div className="aurora-orb orb-cyan"></div>
      <div className="aurora-orb orb-sapphire"></div>

      {/* 2. SUBTLE TOPOGRAPHIC ELEVATION MAP CONTOUR PATTERN */}
      <div className="topographic-contour-overlay"></div>

      {/* 3. ANIMATED FLIGHT TRAJECTORY PATH */}
      <svg className="flight-trajectory-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
        <path
          d="M -100,250 C 300,100 650,420 1100,180 C 1300,80 1450,220 1600,150"
          className="flight-dash-stream stream-1"
        />
        <path
          d="M -50,680 C 350,550 720,820 1200,600 C 1400,520 1550,650 1650,580"
          className="flight-dash-stream stream-2"
        />
      </svg>

      {/* 4. DELICATE FLOATING COMPASS STARS & GLOW PARTICLES */}
      <div className="ambient-particle particle-1">✦</div>
      <div className="ambient-particle particle-2">✦</div>
      <div className="ambient-particle particle-3">✦</div>
      <div className="ambient-particle particle-4">★</div>
      <div className="ambient-particle particle-5">✦</div>
      <div className="ambient-particle particle-6">★</div>
      <div className="ambient-dot dot-1"></div>
      <div className="ambient-dot dot-2"></div>
      <div className="ambient-dot dot-3"></div>
      <div className="ambient-dot dot-4"></div>

      <style>{`
        /* Root Fixed Background Container */
        .roavio-global-ambient-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          background-color: #F8FAFC;
        }

        /* Ambient Aurora Glowing Orbs */
        .aurora-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.65;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }

        /* Orb 1: Emerald Travel Pulse */
        .orb-emerald {
          width: 580px;
          height: 580px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, rgba(5, 150, 105, 0.04) 65%, transparent 100%);
          top: -120px;
          left: -100px;
          animation: floatOrbEmerald 28s ease-in-out infinite alternate;
        }

        /* Orb 2: Warm Amber & Sunset Gold Glow */
        .orb-gold {
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, rgba(217, 119, 6, 0.03) 65%, transparent 100%);
          top: 25%;
          right: -120px;
          animation: floatOrbGold 32s ease-in-out infinite alternate;
        }

        /* Orb 3: Sky Cyan & Coastal Breeze */
        .orb-cyan {
          width: 540px;
          height: 540px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, rgba(14, 165, 233, 0.03) 65%, transparent 100%);
          bottom: 10%;
          left: -80px;
          animation: floatOrbCyan 26s ease-in-out infinite alternate;
        }

        /* Orb 4: Royal Sapphire & Indigo Twilight */
        .orb-sapphire {
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(59, 130, 246, 0.03) 65%, transparent 100%);
          bottom: -100px;
          right: 25%;
          animation: floatOrbSapphire 30s ease-in-out infinite alternate;
        }

        /* Topographic Elevation Map Texture Overlay */
        .topographic-contour-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.042;
          background-image: radial-gradient(#0B132B 0.75px, transparent 0.75px),
                            radial-gradient(#059669 0.75px, #F8FAFC 0.75px);
          background-size: 36px 36px;
          background-position: 0 0, 18px 18px;
        }

        /* Flight Trajectory Streams */
        .flight-trajectory-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.28;
        }

        .flight-dash-stream {
          fill: none;
          stroke: #10B981;
          stroke-width: 1.5;
          stroke-dasharray: 8, 12;
          animation: flightStreamDash 35s linear infinite;
        }

        .flight-dash-stream.stream-2 {
          stroke: #F59E0B;
          stroke-width: 1.2;
          stroke-dasharray: 6, 14;
          animation: flightStreamDashReverse 42s linear infinite;
        }

        /* Delicate Floating Particles & Stars */
        .ambient-particle {
          position: absolute;
          color: #059669;
          font-size: 0.85rem;
          opacity: 0.25;
          user-select: none;
          animation: floatDriftParticle 20s ease-in-out infinite alternate;
        }

        .particle-1 { top: 18%; left: 22%; animation-duration: 18s; animation-delay: 0s; color: #10B981; font-size: 0.95rem; }
        .particle-2 { top: 38%; right: 18%; animation-duration: 24s; animation-delay: -3s; color: #F59E0B; font-size: 0.75rem; }
        .particle-3 { top: 65%; left: 14%; animation-duration: 22s; animation-delay: -7s; color: #06B6D4; font-size: 0.85rem; }
        .particle-4 { top: 78%; right: 28%; animation-duration: 20s; animation-delay: -5s; color: #6366F1; font-size: 0.7rem; }
        .particle-5 { top: 12%; right: 35%; animation-duration: 26s; animation-delay: -10s; color: #10B981; font-size: 0.8rem; }
        .particle-6 { top: 88%; left: 42%; animation-duration: 28s; animation-delay: -2s; color: #F59E0B; font-size: 0.65rem; }

        .ambient-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #10B981;
          opacity: 0.22;
          box-shadow: 0 0 8px #10B981;
          animation: pulseDot 4s ease-in-out infinite alternate;
        }

        .dot-1 { top: 28%; left: 45%; animation-delay: 0s; }
        .dot-2 { top: 52%; right: 38%; animation-delay: -1.5s; background: #F59E0B; box-shadow: 0 0 8px #F59E0B; }
        .dot-3 { top: 72%; left: 25%; animation-delay: -3s; background: #06B6D4; box-shadow: 0 0 8px #06B6D4; }
        .dot-4 { top: 82%; right: 15%; animation-delay: -2s; background: #6366F1; box-shadow: 0 0 8px #6366F1; }

        /* KEYFRAME ANIMATIONS */
        @keyframes floatOrbEmerald {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(120px, 80px, 0) scale(1.12);
          }
          100% {
            transform: translate3d(40px, 140px, 0) scale(0.95);
          }
        }

        @keyframes floatOrbGold {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-100px, 110px, 0) scale(1.08);
          }
          100% {
            transform: translate3d(-40px, -60px, 0) scale(0.92);
          }
        }

        @keyframes floatOrbCyan {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(90px, -70px, 0) scale(1.15);
          }
          100% {
            transform: translate3d(140px, 30px, 0) scale(0.96);
          }
        }

        @keyframes floatOrbSapphire {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-80px, -90px, 0) scale(1.1);
          }
          100% {
            transform: translate3d(60px, -40px, 0) scale(0.94);
          }
        }

        @keyframes flightStreamDash {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -400;
          }
        }

        @keyframes flightStreamDashReverse {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 400;
          }
        }

        @keyframes floatDriftParticle {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0.18;
          }
          50% {
            transform: translate3d(15px, -25px, 0) rotate(45deg);
            opacity: 0.38;
          }
          100% {
            transform: translate3d(-10px, -45px, 0) rotate(90deg);
            opacity: 0.15;
          }
        }

        @keyframes pulseDot {
          0% {
            transform: scale(0.9);
            opacity: 0.15;
          }
          100% {
            transform: scale(1.5);
            opacity: 0.45;
          }
        }

        /* Low power / Reduced motion mode safety */
        @media (prefers-reduced-motion: reduce) {
          .aurora-orb,
          .flight-dash-stream,
          .ambient-particle,
          .ambient-dot {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
