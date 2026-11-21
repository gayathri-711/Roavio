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

  // Helper to load all platform bookings across all users for admin views
  const loadAllPlatformBookings = () => {
    try {
      const stored = localStorage.getItem("roavio_all_platform_bookings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading platform bookings:", e);
    }
    return INITIAL_BOOKINGS;
  };

  // States initialized per logged-in user
  const [savedIds, setSavedIds] = useState(() => loadUserSaved(userKey));
  const [plannedTrips, setPlannedTrips] = useState(() => loadUserPlanned(userKey));
  const [bookings, setBookings] = useState(() => loadUserBookings(userKey));
  const [allPlatformBookings, setAllPlatformBookings] = useState(() => loadAllPlatformBookings());

  // Helper to sync bookings with backend API
  const syncPlatformBookings = () => {
    fetch("/api/admin/bookings")
      .then(res => res.json())
      .then(data => {
        if (data?.bookings && Array.isArray(data.bookings)) {
          setAllPlatformBookings(prev => {
            const map = new Map();
            // Server bookings first
            data.bookings.forEach(b => {
              const bId = b.bookingId || b.id;
              if (bId) map.set(bId, {
                ...b,
                id: bId,
                type: b.category || b.type || "pass",
                route: b.route || `${b.sourceLocation || ""} ➔ ${b.destination || ""}`.trim() || b.title,
                date: b.travelDate || b.bookingDate || b.date,
                fare: b.amount || b.fare || 0,
                status: b.bookingStatus || b.status || "Confirmed"
              });
            });
            // Previous local bookings merged
            prev.forEach(b => {
              const bId = b.id || b.bookingId;
              if (bId && !map.has(bId)) map.set(bId, b);
            });
            const merged = Array.from(map.values());
            try {
              localStorage.setItem("roavio_all_platform_bookings", JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(() => {});
  };

  // Live polling (2.5s) + BroadcastChannel for real-time cross-tab and cross-device sync
  useEffect(() => {
    syncPlatformBookings();
    const timer = setInterval(syncPlatformBookings, 2500);

    let channel = null;
    try {
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        channel = new BroadcastChannel("roavio_platform_sync");
        channel.onmessage = (e) => {
          if (e.data?.type === "BOOKING_CREATED" || e.data?.type === "USER_REGISTERED" || e.data?.type === "USER_LOGGED_IN") {
            syncPlatformBookings();
          }
        };
      }
    } catch (e) {}

    const onStorage = (e) => {
      if (e.key === "roavio_all_platform_bookings") {
        syncPlatformBookings();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      clearInterval(timer);
      if (channel) channel.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

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
    const bookingEmail = bookingData.email || user?.email || "";
    const newBooking = {
      ...bookingData,
      id: bookingData.id || `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      pnr: bookingData.pnr || `ROA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: bookingData.status || "Confirmed",
      userEmail: bookingEmail,
      email: bookingEmail,
      userId: user?.id || bookingData.userId || "usr-101",
      leadPassenger: bookingData.leadPassenger || user?.name || "Traveler",
      fare: bookingData.fare || bookingData.amount || 2500,
      amount: bookingData.amount || bookingData.fare || 2500,
      bookingDate: new Date().toISOString().split("T")[0]
    };

    // 1. Update user-scoped bookings
    setBookings(prev => [newBooking, ...prev]);

    // 2. Update platform-wide bookings store for Admin dashboard
    setAllPlatformBookings(prev => {
      const updated = [newBooking, ...prev.filter(b => (b.id !== newBooking.id && b.pnr !== newBooking.pnr))];
      try {
        localStorage.setItem("roavio_all_platform_bookings", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        const ch = new BroadcastChannel("roavio_platform_sync");
        ch.postMessage({ type: "BOOKING_CREATED", booking: newBooking, timestamp: Date.now() });
        ch.close();
      }
    } catch (e) {}

    // 3. Increment bookingsCount for this user in registered users registry
    if (bookingEmail) {
      try {
        const storedUsers = JSON.parse(localStorage.getItem("roavio_registered_users") || "[]");
        const idx = storedUsers.findIndex(u => u.email && u.email.toLowerCase() === bookingEmail.toLowerCase());
        if (idx >= 0) {
          storedUsers[idx].bookingsCount = (storedUsers[idx].bookingsCount || 0) + 1;
          storedUsers[idx].lastBookingAt = new Date().toISOString();
          localStorage.setItem("roavio_registered_users", JSON.stringify(storedUsers));
          fetch("/api/admin/record-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(storedUsers[idx])
          }).catch(() => {});
        }
      } catch (e) {}
    }

    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
    );
    setAllPlatformBookings(prev => {
      const updated = prev.map(b => ((b.id === bookingId || b.bookingId === bookingId) ? { ...b, status: "Cancelled", bookingStatus: "Cancelled" } : b));
      try {
        localStorage.setItem("roavio_all_platform_bookings", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
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
        allPlatformBookings,
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
