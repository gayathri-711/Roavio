import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_BOOKINGS, INITIAL_SAVED_DESTINATIONS, INITIAL_PLANNED_TRIPS } from "../data/sampleBookings";
import { DESTINATIONS, calculateDistanceKm } from "../data/destinations";

const TripsContext = createContext();

export const TripsProvider = ({ children }) => {
  // Saved Destinations
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("roavio_saved_destinations");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAVED_DESTINATIONS;
  });

  // Planned Trips
  const [plannedTrips, setPlannedTrips] = useState(() => {
    try {
      const stored = localStorage.getItem("roavio_planned_trips");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PLANNED_TRIPS;
  });

  // Bookings (Flights, Trains, Buses, Monument Passes)
  const [bookings, setBookings] = useState(() => {
    try {
      const stored = localStorage.getItem("roavio_bookings");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BOOKINGS;
  });

  // User GPS Geolocation State (Defaulting to New Delhi center if not permitted)
  const [userLocation, setUserLocation] = useState({
    lat: 28.6139,
    lng: 77.2090,
    name: "New Delhi (Default GPS)",
    isLive: false,
    loading: false,
    error: null
  });

  useEffect(() => {
    localStorage.setItem("roavio_saved_destinations", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem("roavio_planned_trips", JSON.stringify(plannedTrips));
  }, [plannedTrips]);

  useEffect(() => {
    localStorage.setItem("roavio_bookings", JSON.stringify(bookings));
  }, [bookings]);

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

  const isSaved = (destId) => savedIds.includes(destId);

  const getSavedDestinationsList = () => {
    return DESTINATIONS.filter(d => savedIds.includes(d.id));
  };

  const addPlannedTrip = (tripData) => {
    const newTrip = {
      ...tripData,
      id: `trip-${Date.now()}`,
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
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      pnr: `ROA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: "Confirmed (Demo)",
      bookingDate: new Date().toISOString().split("T")[0]
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: "Cancelled (Demo)" } : b))
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
        isSaved,
        getSavedDestinationsList,
        plannedTrips,
        addPlannedTrip,
        deletePlannedTrip,
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
