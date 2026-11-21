import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_BOOKINGS, INITIAL_SAVED_DESTINATIONS, INITIAL_PLANNED_TRIPS } from "../data/sampleBookings";
import { DESTINATIONS, calculateDistanceKm } from "../data/destinations";
import { useAuth } from "./AuthContext";

const TripsContext = createContext();

export const TripsProvider = ({ children }) => {
  const { user } = useAuth();
  const userKey = user?.email ? user.email.toLowerCase().trim() : (user?.id ? String(user.id) : "guest");
  const isDemoAccount = userKey === "rahul.sharma@example.com";

  // Purge legacy shared keys once so old mock data does not pollute user accounts
  useEffect(() => {
    try {
      localStorage.removeItem("roavio_bookings");
      localStorage.removeItem("roavio_planned_trips");
      localStorage.removeItem("roavio_saved_destinations");
    } catch (e) {}
  }, []);

  // Helper to load user-scoped saved destinations
  const loadUserSaved = (key) => {
    if (!key || key === "guest") return [];
    try {
      const stored = localStorage.getItem(`roavio_saved_${key}`);
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading user saved destinations:", e);
    }
    // Only the explicit demo account starts with demo bookmarks
    return key === "rahul.sharma@example.com" ? INITIAL_SAVED_DESTINATIONS : [];
  };

  // Helper to load user-scoped planned trips
  const loadUserPlanned = (key) => {
    if (!key || key === "guest") return [];
    try {
      const stored = localStorage.getItem(`roavio_planned_${key}`);
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading user planned trips:", e);
    }
    // Only the explicit demo account starts with demo planned trips
    return key === "rahul.sharma@example.com" ? INITIAL_PLANNED_TRIPS : [];
  };

  // Helper to load user-scoped bookings
  const loadUserBookings = (key) => {
    if (!key || key === "guest") return [];
    try {
      const stored = localStorage.getItem(`roavio_bookings_${key}`);
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading user bookings:", e);
    }
    // Only the explicit demo account starts with demo bookings; all new users start completely clean
    return key === "rahul.sharma@example.com" ? INITIAL_BOOKINGS : [];
  };

  // States initialized per logged-in user
  const [savedIds, setSavedIds] = useState(() => loadUserSaved(userKey));
  const [plannedTrips, setPlannedTrips] = useState(() => loadUserPlanned(userKey));
  const [bookings, setBookings] = useState(() => loadUserBookings(userKey));

  // Switch data whenever the logged in user changes or user logs in/out
  useEffect(() => {
    setSavedIds(loadUserSaved(userKey));
    setPlannedTrips(loadUserPlanned(userKey));
    setBookings(loadUserBookings(userKey));
  }, [userKey]);

  // Persist user-scoped saved destinations
  useEffect(() => {
    if (userKey && userKey !== "guest") {
      try {
        localStorage.setItem(`roavio_saved_${userKey}`, JSON.stringify(savedIds));
      } catch (e) {
        console.error(e);
      }
    }
  }, [savedIds, userKey]);

  // Persist user-scoped planned trips
  useEffect(() => {
    if (userKey && userKey !== "guest") {
      try {
        localStorage.setItem(`roavio_planned_${userKey}`, JSON.stringify(plannedTrips));
      } catch (e) {
        console.error(e);
      }
    }
  }, [plannedTrips, userKey]);

  // Persist user-scoped bookings
  useEffect(() => {
    if (userKey && userKey !== "guest") {
      try {
        localStorage.setItem(`roavio_bookings_${userKey}`, JSON.stringify(bookings));
      } catch (e) {
        console.error(e);
      }
    }
  }, [bookings, userKey]);

  // User GPS Geolocation State (Defaulting to New Delhi center if not permitted)
  const [userLocation, setUserLocation] = useState({
    lat: 28.6139,
    lng: 77.2090,
    name: "New Delhi (Default GPS)",
    isLive: false,
    loading: false,
    error: null
  });

  // Request browser location
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser.",
        loading: false
      }));
      return;
    }

    setUserLocation(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: "My Live GPS Location",
          isLive: true,
          loading: false,
          error: null
        });
      },
      (err) => {
        console.warn("GPS Permission not granted:", err.message);
        setUserLocation(prev => ({
          ...prev,
          loading: false,
          error: "Location permission denied. Using New Delhi as reference."
        }));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const toggleSaveDestination = (destId) => {
    setSavedIds(prev => {
      if (prev.includes(destId)) {
        return prev.filter(id => id !== destId);
      } else {
        return [...prev, destId];
      }
    });
  };

  const removeSavedDestination = (destId) => {
    setSavedIds(prev => prev.filter(id => id !== destId));
  };

  const isSaved = (destId) => savedIds.includes(destId);

  const getSavedDestinationsList = () => {
    return DESTINATIONS.filter(d => savedIds.includes(d.id));
  };

  const addPlannedTrip = (tripData) => {
    const newTrip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      userEmail: user?.email || "",
      userId: user?.id || "",
      createdAt: new Date().toISOString().split("T")[0]
    };
    setPlannedTrips(prev => [newTrip, ...prev]);
    return newTrip;
  };

  const deletePlannedTrip = (tripId) => {
    setPlannedTrips(prev => prev.filter(t => t.id !== tripId));
  };

  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: bookingData.id || `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      pnr: bookingData.pnr || `ROA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: bookingData.status || "Confirmed",
      userEmail: user?.email || bookingData.email || "",
      userId: user?.id || "",
      leadPassenger: bookingData.leadPassenger || user?.name || "Traveler",
      bookingDate: new Date().toISOString().split("T")[0]
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
    );
  };

  // Distance helper from user current GPS to destination
  const getDistanceFromUser = (destLat, destLng) => {
    return calculateDistanceKm(userLocation.lat, userLocation.lng, destLat, destLng);
  };

  return (
    <TripsContext.Provider
      value={{
        savedIds,
        toggleSaveDestination,
        removeSavedDestination,
        isSaved,
        getSavedDestinationsList,
        plannedTrips,
        addPlannedTrip,
        deletePlannedTrip,
        removePlannedTrip: deletePlannedTrip,
        bookings,
        addBooking,
        cancelBooking,
        userLocation,
        requestUserLocation,
        getDistanceFromUser
      }}
    >
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => useContext(TripsContext);
