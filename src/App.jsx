import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Main Pages
import Home from "./pages/Home";
import ExploreIndia from "./pages/ExploreIndia";
import DestinationDetails from "./pages/DestinationDetails";
import FlightBooking from "./pages/FlightBooking";
import TrainBooking from "./pages/TrainBooking";
import BusBooking from "./pages/BusBooking";
import PlanJourney from "./pages/PlanJourney";
import LiveMap from "./pages/LiveMap";
import MyTrips from "./pages/MyTrips";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TicketVerification from "./pages/TicketVerification";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Destinations from "./pages/admin/Destinations";
import AdminUsers from "./pages/admin/Users";
import AdminBookings from "./pages/admin/Bookings";
import Reports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/AdminSettings";
import NotificationManagement from "./pages/admin/NotificationManagement";

// 404 Not Found Page
function NotFound() {
  return (
    <div style={{ padding: "6rem 2rem", textAlign: "center", minHeight: "60vh" }}>
      <h1 style={{ fontSize: "3rem", color: "var(--color-navy)", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Destination Not Found</h2>
      <p style={{ color: "#64748B", maxWidth: "480px", margin: "0 auto 2rem" }}>
        The travel page you are looking for does not exist or has been relocated in the Roavio directory.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Roavio Homepage
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Public Website Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<ExploreIndia />} />
          <Route path="explore-india" element={<ExploreIndia />} />
          <Route path="destination/:id" element={<DestinationDetails />} />
          <Route path="flights" element={<FlightBooking />} />
          <Route path="trains" element={<TrainBooking />} />
          <Route path="buses" element={<BusBooking />} />
          <Route path="plan" element={<PlanJourney />} />
          <Route path="plan-journey" element={<PlanJourney />} />
          <Route path="tours" element={<PlanJourney />} />
          <Route path="tour" element={<PlanJourney />} />
          <Route path="map" element={<LiveMap />} />
          <Route path="my-trips" element={<MyTrips />} />
          <Route path="my-tickets" element={<MyTrips defaultTab="tickets" />} />
          <Route path="verify-ticket" element={<TicketVerification />} />
          <Route path="verify-ticket/:token" element={<TicketVerification />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Dedicated Admin Management Portal Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
