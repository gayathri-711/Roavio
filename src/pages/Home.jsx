import React from "react";
import HeroSection from "../components/Home/HeroSection";
import TrustSection from "../components/Home/TrustSection";
import PopularDestinations from "../components/Home/PopularDestinations";
import AdventureCTA from "../components/Home/AdventureCTA";

export default function Home() {
  return (
    <div className="roavio-homepage-root">
      {/* 1. HERO SECTION WITH SEARCH BAR */}
      <HeroSection />

      {/* 2. TRUST & FEATURES SECTION */}
      <TrustSection />

      {/* 3. POPULAR DESTINATIONS (4 CARDS) */}
      <PopularDestinations />

      {/* 4. ADVENTURE CALL-TO-ACTION */}
      <AdventureCTA />

      <style>{`
        .roavio-homepage-root {
          background-color: var(--color-bg);
          color: var(--color-text);
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
