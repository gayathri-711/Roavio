import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="roavio-site-wrapper">
      <Navbar />
      <main className="roavio-main-content">
        <Outlet />
      </main>
      <Footer />
      <style>{`
        .roavio-site-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .roavio-main-content {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}
