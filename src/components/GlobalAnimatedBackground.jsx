import React from "react";

/**
 * GlobalAnimatedBackground
 * 
 * Provides an eye-catching, ultra-modern luxury travel animated background across the entire Roavio website.
 * Features:
 * 1. Cruising Airplanes flying smoothly across the sky along animated curved flight trajectories with contrails.
 * 2. Drifting Hot Air Balloons floating gently with realistic floating physics.
 * 3. Dynamic Aurora Travel Waves (Emerald, Sunset Gold, Coastal Cyan, Sapphire) that morph continuously.
 * 4. Shimmering Constellations & Compass Stars (✦, ★, ✧) that twinkle across the screen.
 * 
 * 100% hardware-accelerated (60fps), fixed viewport positioning, pointer-events: none (zero click interference).
 */
export default function GlobalAnimatedBackground() {
  return (
    <div className="roavio-global-animated-canvas" aria-hidden="true">
      {/* 1. DYNAMIC VIBRANT AURORA WAVES */}
      <div className="aurora-wave wave-emerald"></div>
      <div className="aurora-wave wave-gold"></div>
      <div className="aurora-wave wave-cyan"></div>
      <div className="aurora-wave wave-sapphire"></div>

      {/* 2. SUBTLE TOPOGRAPHIC CONTOUR OVERLAY */}
      <div className="travel-grid-mesh"></div>

      {/* 3. ANIMATED FLIGHT PATH TRAILS (DASHED VECTOR ARCS) */}
      <svg className="flight-corridors-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
        <path
          d="M -100,220 C 320,80 750,380 1150,140 C 1300,50 1480,180 1600,120"
          className="flight-dash-corridor corridor-primary"
        />
        <path
          d="M -80,650 C 300,500 680,780 1100,560 C 1320,440 1500,600 1620,530"
          className="flight-dash-corridor corridor-secondary"
        />
      </svg>

      {/* 4. VISIBLE CRUISING AIRPLANES WITH CONTRAILS */}
      {/* Airplane 1: Cruising Top-Left to Top-Right */}
      <div className="cruising-airplane plane-1">
        <div className="plane-jet-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#059669">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
        <div className="plane-contrail"></div>
      </div>

      {/* Airplane 2: Cruising Across Lower Corridor */}
      <div className="cruising-airplane plane-2">
        <div className="plane-jet-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#D97706">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
        <div className="plane-contrail"></div>
      </div>

      {/* 5. FLOATING HOT AIR BALLOONS */}
      {/* Balloon 1: Left sky drift */}
      <div className="floating-balloon balloon-left">
        <svg viewBox="0 0 32 44" width="36" height="48" fill="none">
          <path d="M16 2C8 2 2 8 2 16c0 6 5 13 10 18h8c5-5 10-12 10-18 0-8-6-14-14-14z" fill="url(#balloonGrad1)"/>
          <path d="M11 34h10v2H11z" fill="#0F172A"/>
          <path d="M13 36h6v4h-6z" fill="#B45309" stroke="#78350F" strokeWidth="1"/>
          <defs>
            <linearGradient id="balloonGrad1" x1="2" y1="2" x2="30" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981"/>
              <stop offset="0.5" stopColor="#06B6D4"/>
              <stop offset="1" stopColor="#3B82F6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Balloon 2: Right sky drift */}
      <div className="floating-balloon balloon-right">
        <svg viewBox="0 0 32 44" width="30" height="40" fill="none">
          <path d="M16 2C8 2 2 8 2 16c0 6 5 13 10 18h8c5-5 10-12 10-18 0-8-6-14-14-14z" fill="url(#balloonGrad2)"/>
          <path d="M11 34h10v2H11z" fill="#0F172A"/>
          <path d="M13 36h6v4h-6z" fill="#D97706" stroke="#92400E" strokeWidth="1"/>
          <defs>
            <linearGradient id="balloonGrad2" x1="2" y1="2" x2="30" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B"/>
              <stop offset="0.5" stopColor="#EF4444"/>
              <stop offset="1" stopColor="#8B5CF6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 6. GLOWING COMPASS STARS & TRAVEL PARTICLES */}
      <div className="travel-star star-1">✦</div>
      <div className="travel-star star-2">★</div>
      <div className="travel-star star-3">✦</div>
      <div className="travel-star star-4">✧</div>
      <div className="travel-star star-5">★</div>
      <div className="travel-star star-6">✦</div>
      <div className="travel-star star-7">✧</div>

      <style>{`
        /* Root Fixed Background Canvas */
        .roavio-global-animated-canvas {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          pointer-events: none !important;
          z-index: -1 !important;
          overflow: hidden !important;
          background: linear-gradient(180deg, #F0FDF4 0%, #F8FAFC 40%, #EFF6FF 100%) !important;
        }

        /* 1. Aurora Glow Waves */
        .aurora-wave {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.75;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }

        .wave-emerald {
          width: 620px;
          height: 620px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(5, 150, 105, 0.08) 60%, transparent 100%);
          top: -140px;
          left: -120px;
          animation: floatAuroraEmerald 22s ease-in-out infinite alternate;
        }

        .wave-gold {
          width: 540px;
          height: 540px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.24) 0%, rgba(217, 119, 6, 0.06) 60%, transparent 100%);
          top: 20%;
          right: -140px;
          animation: floatAuroraGold 26s ease-in-out infinite alternate;
        }

        .wave-cyan {
          width: 580px;
          height: 580px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.24) 0%, rgba(14, 165, 233, 0.06) 60%, transparent 100%);
          bottom: 12%;
          left: -100px;
          animation: floatAuroraCyan 24s ease-in-out infinite alternate;
        }

        .wave-sapphire {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(59, 130, 246, 0.05) 60%, transparent 100%);
          bottom: -120px;
          right: 20%;
          animation: floatAuroraSapphire 28s ease-in-out infinite alternate;
        }

        @keyframes floatAuroraEmerald {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(120px, 90px, 0) scale(1.18); }
          100% { transform: translate3d(50px, 160px, 0) scale(0.92); }
        }

        @keyframes floatAuroraGold {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-110px, 80px, 0) scale(1.15); }
          100% { transform: translate3d(-60px, -90px, 0) scale(0.94); }
        }

        @keyframes floatAuroraCyan {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(100px, -80px, 0) scale(1.2); }
          100% { transform: translate3d(140px, 40px, 0) scale(0.95); }
        }

        @keyframes floatAuroraSapphire {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-90px, -110px, 0) scale(1.14); }
          100% { transform: translate3d(-140px, -40px, 0) scale(0.92); }
        }

        /* 2. Travel Grid Mesh Texture */
        .travel-grid-mesh {
          position: absolute;
          inset: 0;
          opacity: 0.055;
          background-image: 
            radial-gradient(#059669 1px, transparent 1px),
            radial-gradient(#0B132B 1px, transparent 1px);
          background-size: 32px 32px;
          background-position: 0 0, 16px 16px;
        }

        /* 3. Flight Corridors SVG */
        .flight-corridors-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.45;
        }

        .flight-dash-corridor {
          fill: none;
          stroke-linecap: round;
        }

        .corridor-primary {
          stroke: #10B981;
          stroke-width: 2;
          stroke-dasharray: 10, 14;
          animation: flightCorridorDash 30s linear infinite;
        }

        .corridor-secondary {
          stroke: #F59E0B;
          stroke-width: 1.8;
          stroke-dasharray: 8, 16;
          animation: flightCorridorDashReverse 36s linear infinite;
        }

        @keyframes flightCorridorDash {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1000; }
        }

        @keyframes flightCorridorDashReverse {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 1000; }
        }

        /* 4. Cruising Airplanes */
        .cruising-airplane {
          position: absolute;
          display: flex;
          align-items: center;
          will-change: transform;
        }

        .plane-1 {
          top: 15%;
          left: -80px;
          transform: rotate(24deg);
          animation: flyAirplaneAcross 32s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .plane-2 {
          top: 68%;
          left: -80px;
          transform: rotate(-18deg);
          animation: flyAirplaneAcross2 40s cubic-bezier(0.4, 0, 0.6, 1) infinite 14s;
        }

        .plane-jet-icon {
          filter: drop-shadow(0 4px 10px rgba(5, 150, 105, 0.35));
          animation: planeHoverWiggle 4s ease-in-out infinite alternate;
        }

        .plane-contrail {
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.5) 70%, #10B981 100%);
          border-radius: 999px;
          margin-left: -4px;
        }

        .plane-2 .plane-contrail {
          background: linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.5) 70%, #F59E0B 100%);
        }

        @keyframes flyAirplaneAcross {
          0% {
            transform: translate3d(-100px, 0, 0) rotate(22deg);
            opacity: 0;
          }
          5% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% {
            transform: translate3d(calc(100vw + 200px), 160px, 0) rotate(26deg);
            opacity: 0;
          }
        }

        @keyframes flyAirplaneAcross2 {
          0% {
            transform: translate3d(-100px, 0, 0) rotate(-16deg);
            opacity: 0;
          }
          5% { opacity: 0.85; }
          90% { opacity: 0.85; }
          100% {
            transform: translate3d(calc(100vw + 200px), -120px, 0) rotate(-12deg);
            opacity: 0;
          }
        }

        @keyframes planeHoverWiggle {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }

        /* 5. Floating Hot Air Balloons */
        .floating-balloon {
          position: absolute;
          filter: drop-shadow(0 8px 16px rgba(11, 19, 43, 0.12));
          will-change: transform;
        }

        .balloon-left {
          top: 35%;
          left: 4%;
          animation: balloonFloatBob 18s ease-in-out infinite alternate;
        }

        .balloon-right {
          top: 55%;
          right: 5%;
          animation: balloonFloatBob2 22s ease-in-out infinite alternate;
        }

        @keyframes balloonFloatBob {
          0% { transform: translate3d(0, 0, 0) rotate(-2deg); }
          50% { transform: translate3d(25px, -45px, 0) rotate(2deg); }
          100% { transform: translate3d(45px, 20px, 0) rotate(-1deg); }
        }

        @keyframes balloonFloatBob2 {
          0% { transform: translate3d(0, 0, 0) rotate(2deg); }
          50% { transform: translate3d(-30px, -50px, 0) rotate(-2deg); }
          100% { transform: translate3d(-50px, 15px, 0) rotate(1deg); }
        }

        /* 6. Glowing Compass Stars */
        .travel-star {
          position: absolute;
          color: #059669;
          font-weight: 800;
          user-select: none;
          animation: twinkleStar 6s ease-in-out infinite alternate;
        }

        .star-1 { top: 12%; left: 18%; font-size: 1.1rem; color: #10B981; animation-duration: 5s; }
        .star-2 { top: 28%; right: 22%; font-size: 0.9rem; color: #F59E0B; animation-duration: 7s; animation-delay: -2s; }
        .star-3 { top: 48%; left: 8%; font-size: 1rem; color: #06B6D4; animation-duration: 6s; animation-delay: -4s; }
        .star-4 { top: 62%; right: 14%; font-size: 0.85rem; color: #8B5CF6; animation-duration: 8s; animation-delay: -1s; }
        .star-5 { top: 82%; left: 30%; font-size: 0.95rem; color: #10B981; animation-duration: 7s; animation-delay: -3s; }
        .star-6 { top: 8%; right: 38%; font-size: 1.05rem; color: #F59E0B; animation-duration: 6s; animation-delay: -5s; }
        .star-7 { top: 75%; right: 35%; font-size: 0.8rem; color: #06B6D4; animation-duration: 9s; animation-delay: -2s; }

        @keyframes twinkleStar {
          0% { transform: scale(0.85); opacity: 0.25; }
          50% { transform: scale(1.25); opacity: 0.85; filter: drop-shadow(0 0 6px currentColor); }
          100% { transform: scale(0.9); opacity: 0.35; }
        }

        /* Respect Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .cruising-airplane,
          .floating-balloon,
          .aurora-wave,
          .corridor-primary,
          .corridor-secondary,
          .travel-star {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
