import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Car, 
  Train, 
  Plane, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Zap,
  CornerUpLeft,
  CornerUpRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  RotateCw,
  ListOrdered,
  ChevronDown,
  ChevronUp,
  Volume2,
  Crosshair,
  Clock,
  Play,
  Square
} from "lucide-react";
import { useTrips } from "../context/TripsContext";

// Fix standard Leaflet default marker icon path issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// Helper to format maneuver meters to readable string
function formatDistance(meters) {
  if (meters === undefined || meters === null) return "0 m";
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

// Helper to format duration in seconds
function formatDuration(seconds) {
  if (!seconds) return "0 min";
  const mins = Math.round(seconds / 60);
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs} hr ${remMins} min`;
  }
  return `${mins} min`;
}

// Helper to calculate estimated arrival time
function calculateETA(durationSeconds) {
  if (!durationSeconds) return "--:--";
  const arrival = new Date(Date.now() + durationSeconds * 1000);
  return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Helper to render maneuver direction icon
function getManeuverIcon(type = "", modifier = "") {
  const t = type.toLowerCase();
  const m = modifier.toLowerCase();

  if (t === "roundabout" || t === "rotary") return <RotateCw size={18} />;
  if (m.includes("left")) {
    if (m.includes("slight")) return <ArrowUpLeft size={18} />;
    return <CornerUpLeft size={18} />;
  }
  if (m.includes("right")) {
    if (m.includes("slight")) return <ArrowUpRight size={18} />;
    return <CornerUpRight size={18} />;
  }
  if (t === "arrive") return <MapPin size={18} />;
  return <ArrowUp size={18} />;
}

// Helper to format human friendly turn instructions
function getManeuverText(step) {
  const t = (step.type || "").toLowerCase();
  const m = (step.modifier || "").toLowerCase();
  const road = step.name ? `onto ${step.name}` : "";

  if (t === "depart") return `Head out ${road}`;
  if (t === "arrive") return `Arrive at destination ${road}`;
  if (t === "roundabout" || t === "rotary") return `Take roundabout ${m} ${road}`;
  if (t === "turn") {
    if (m) return `Turn ${m} ${road}`;
    return `Turn ${road}`;
  }
  if (t === "merge") return `Merge ${m} ${road}`;
  if (t === "fork") return `Keep ${m} at the fork ${road}`;
  if (t === "new name" || t === "continue") return `Continue straight ${road}`;
  return `Continue ${m} ${road}`;
}

export default function MapComponent({ 
  userLocation: propUserLocation, 
  destination, 
  destinations = null,
  height = "520px", 
  showStats = true,
  interactive = true,
  allowLocateMe = true,
  title = null
}) {
  const { userLocation: contextUserLocation, requestUserLocation } = useTrips();
  const userLocation = propUserLocation || contextUserLocation;

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const stepHighlightLayerRef = useRef(null);

  const [routeData, setRouteData] = useState(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  // Navigation Modes: standard map vs live turn-by-turn driving HUD
  const [isNavigating, setIsNavigating] = useState(false);
  const [showDirectionsList, setShowDirectionsList] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Normalize target destinations array
  const targetDestinations = useMemo(() => {
    if (destinations && Array.isArray(destinations) && destinations.length > 0) {
      return destinations.filter(d => d && d.lat && d.lng);
    }
    if (destination && destination.lat && destination.lng) {
      return [destination];
    }
    return [];
  }, [destinations, destination]);

  // Handle Locate Me
  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      await requestUserLocation();
      if (mapInstanceRef.current && userLocation?.lat && userLocation?.lng) {
        mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { animate: true });
      }
    } catch (e) {
      console.warn("Locate me notice:", e);
    } finally {
      setIsLocating(false);
    }
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = userLocation?.lat || 28.6139;
      const initialLng = userLocation?.lng || 77.2090;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 6,
        zoomControl: interactive,
        scrollWheelZoom: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Roavio Google Navigation'
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
      stepHighlightLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Map cleanup on unmount
    };
  }, [interactive]);

  // 2. Fetch OSRM Road Route WITH turn-by-turn steps
  useEffect(() => {
    let isCancelled = false;

    if (!userLocation?.lat || !userLocation?.lng || targetDestinations.length === 0) {
      setRouteData(null);
      return;
    }

    const fetchRoadRoute = async () => {
      setIsRoutingLoading(true);
      try {
        const coords = [
          `${userLocation.lng},${userLocation.lat}`,
          ...targetDestinations.map(d => `${d.lng},${d.lat}`)
        ].join(";");

        // Request full overview with turn-by-turn steps
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(osrmUrl);
        const data = await res.json();

        if (isCancelled) return;

        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const latLngs = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

          // Extract all turn-by-turn maneuver steps
          const stepsList = [];
          if (route.legs) {
            route.legs.forEach((leg, legIdx) => {
              if (leg.steps) {
                leg.steps.forEach((st, sIdx) => {
                  stepsList.push({
                    stepNumber: stepsList.length + 1,
                    legIndex: legIdx,
                    name: st.name || (sIdx === 0 ? "Starting point" : "Main Highway"),
                    type: st.maneuver?.type || "continue",
                    modifier: st.maneuver?.modifier || "",
                    location: st.maneuver?.location ? [st.maneuver.location[1], st.maneuver.location[0]] : null,
                    distance: st.distance || 0,
                    duration: st.duration || 0
                  });
                });
              }
            });
          }

          setRouteData({
            isRoadRoute: true,
            coordinates: latLngs,
            distanceKm: Math.round(route.distance / 1000),
            distanceMeters: route.distance,
            durationSeconds: route.duration,
            durationHours: (route.duration / 3600).toFixed(1),
            durationMinutes: Math.round(route.duration / 60),
            steps: stepsList
          });
          setActiveStepIndex(0);
        } else {
          throw new Error("No road route available");
        }
      } catch (err) {
        if (isCancelled) return;
        // Fallback geodesic line
        const straightPoints = [
          [userLocation.lat, userLocation.lng],
          ...targetDestinations.map(d => [d.lat, d.lng])
        ];

        let totalDist = 0;
        for (let i = 0; i < straightPoints.length - 1; i++) {
          const [lat1, lon1] = straightPoints[i];
          const [lat2, lon2] = straightPoints[i + 1];
          const R = 6371;
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          totalDist += Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
        }

        setRouteData({
          isRoadRoute: false,
          coordinates: straightPoints,
          distanceKm: totalDist,
          distanceMeters: totalDist * 1000,
          durationSeconds: Math.round(((totalDist * 1.25) / 55) * 3600),
          durationMinutes: Math.round(((totalDist * 1.25) / 55) * 60),
          steps: [
            {
              stepNumber: 1,
              name: "Direct Route",
              type: "depart",
              modifier: "straight",
              location: [userLocation.lat, userLocation.lng],
              distance: totalDist * 1000,
              duration: Math.round(((totalDist * 1.25) / 55) * 3600)
            },
            {
              stepNumber: 2,
              name: targetDestinations[0]?.name || "Destination",
              type: "arrive",
              modifier: "straight",
              location: [targetDestinations[0]?.lat, targetDestinations[0]?.lng],
              distance: 0,
              duration: 0
            }
          ]
        });
      } finally {
        if (!isCancelled) setIsRoutingLoading(false);
      }
    };

    fetchRoadRoute();

    return () => {
      isCancelled = true;
    };
  }, [userLocation?.lat, userLocation?.lng, targetDestinations]);

  // 3. Render Leaflet Markers & Route Lines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    const bounds = [];

    // --- A. User Live GPS Marker ---
    if (userLocation && userLocation.lat && userLocation.lng) {
      const userLatLng = [userLocation.lat, userLocation.lng];
      bounds.push(userLatLng);

      const isLive = userLocation.isLive;
      const userIconHtml = `
        <div class="user-live-pin-container ${isLive ? 'live-active' : ''}">
          <div class="pulse-ring"></div>
          <div class="pin-core">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
          </div>
        </div>
      `;

      const userIcon = L.divIcon({
        className: "custom-user-leaflet-marker",
        html: userIconHtml,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      if (isLive && userLocation.accuracy) {
        L.circle(userLatLng, {
          radius: Math.min(userLocation.accuracy * 10, 4000),
          color: "#10B981",
          fillColor: "#10B981",
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: "4, 4"
        }).addTo(layerGroup);
      }

      L.marker(userLatLng, { icon: userIcon, zIndexOffset: 1000 })
        .bindPopup(`
          <div style="font-family: var(--font-sans, sans-serif); min-width: 170px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${isLive ? '#10B981' : '#F59E0B'};"></span>
              <strong style="color: #0F172A; font-size: 13px;">${isLive ? 'Your Live Location (GPS)' : 'Default Starting Point'}</strong>
            </div>
            <div style="color: #334155; font-size: 12.5px; font-weight: 700;">${userLocation.name || userLocation.city || 'Live GPS'}</div>
            <div style="color: #64748B; font-size: 11px; margin-top: 2px;">
              ${userLocation.lat.toFixed(4)}° N, ${userLocation.lng.toFixed(4)}° E
              ${userLocation.accuracy ? ` · ±${userLocation.accuracy}m accuracy` : ''}
            </div>
          </div>
        `)
        .addTo(layerGroup);
    }

    // --- B. Destination Markers ---
    targetDestinations.forEach((dest, idx) => {
      const destLatLng = [dest.lat, dest.lng];
      bounds.push(destLatLng);

      const markerNumber = targetDestinations.length > 1 ? `${idx + 1}` : '🏁';
      const destIcon = L.divIcon({
        className: "custom-dest-leaflet-marker",
        html: `
          <div class="dest-pin-wrapper">
            <div class="dest-pin-badge">${markerNumber}</div>
            <div class="dest-pin-stem"></div>
          </div>
        `,
        iconSize: [36, 46],
        iconAnchor: [18, 44],
        popupAnchor: [0, -42]
      });

      L.marker(destLatLng, { icon: destIcon })
        .bindPopup(`
          <div style="font-family: var(--font-sans, sans-serif); min-width: 180px;">
            ${dest.image ? `<img src="${dest.image}" alt="${dest.name}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">` : ''}
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <strong style="color: #0F172A; font-size: 14px;">${dest.name}</strong>
              <span style="font-size: 11px; font-weight: 800; color: #059669; background: #ECFDF5; padding: 2px 6px; border-radius: 6px;">Stop #${idx + 1}</span>
            </div>
            <div style="color: #64748B; font-size: 12px; margin-top: 2px;">${dest.city || ''}${dest.state ? `, ${dest.state}` : ''}</div>
          </div>
        `)
        .addTo(layerGroup);
    });

    // --- C. Dual-Layer Vivid Route Line ---
    if (routeData && routeData.coordinates && routeData.coordinates.length > 1) {
      // Background road contrast casing
      L.polyline(routeData.coordinates, {
        color: "#1E293B",
        weight: 8,
        opacity: 0.35,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(layerGroup);

      // Foreground Google blue / emerald route polyline
      const routeLine = L.polyline(routeData.coordinates, {
        color: "#2563EB", // Google Blue primary route color
        weight: 5,
        opacity: 0.95,
        dashArray: routeData.isRoadRoute ? null : "8, 8",
        lineCap: "round",
        lineJoin: "round"
      }).addTo(layerGroup);

      routeLine.bindTooltip(`
        <strong>🚗 Highway Driving Route</strong><br>
        Distance: ${routeData.distanceKm} km · ${formatDuration(routeData.durationSeconds)}
      `, { sticky: true });
    }

    // --- D. Set View Bounds ---
    if (!isNavigating) {
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 11);
      }
    }

    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 250);

  }, [userLocation, targetDestinations, routeData, isNavigating]);

  // Click on any step in the directions drawer to fly directly to that turn
  const handleStepClick = (step, index) => {
    setActiveStepIndex(index);
    const map = mapInstanceRef.current;
    const highlightLayer = stepHighlightLayerRef.current;
    if (!map || !highlightLayer || !step.location) return;

    highlightLayer.clearLayers();

    // Fly smoothly to the turn location like Google Maps
    map.flyTo(step.location, 16, { animate: true, duration: 1.2 });

    const stepMarker = L.divIcon({
      className: "step-turn-marker",
      html: `
        <div style="
          width: 34px; 
          height: 34px; 
          background: #2563EB; 
          color: white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.3);
          border: 2px solid white;
          font-weight: 800;
          font-size: 13px;
        ">
          ${step.stepNumber}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    L.marker(step.location, { icon: stepMarker })
      .bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px;">
          <strong style="color: #2563EB;">Step ${step.stepNumber}</strong><br>
          ${getManeuverText(step)}<br>
          <span style="color: #64748B; font-size: 11px;">Distance: ${formatDistance(step.distance)}</span>
        </div>
      `)
      .addTo(highlightLayer)
      .openPopup();
  };

  // Toggle Live Navigation Driving Mode
  const toggleNavigationMode = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      if (mapInstanceRef.current && userLocation?.lat && userLocation?.lng) {
        mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 16, { animate: true, duration: 1.5 });
      }
    } else {
      setIsNavigating(false);
      // Zoom out to whole route
      if (mapInstanceRef.current && routeData && routeData.coordinates) {
        mapInstanceRef.current.fitBounds(routeData.coordinates, { padding: [60, 60] });
      }
    }
  };

  const primaryDest = targetDestinations[0] || null;
  const currentStep = routeData?.steps ? routeData.steps[activeStepIndex] : null;
  const nextStep = routeData?.steps && routeData.steps.length > activeStepIndex + 1 
    ? routeData.steps[activeStepIndex + 1] 
    : null;

  // External Google Maps directions URL
  const googleMapsUrl = userLocation?.lat && primaryDest?.lat
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${primaryDest.lat},${primaryDest.lng}&travelmode=driving`
    : "#";

  return (
    <div className="roavio-map-wrapper">
      {/* =====================================================================
          1. GOOGLE MAPS NAVIGATION HUD BANNER (OVERLAY)
      ===================================================================== */}
      {routeData && (
        <div className="gmaps-nav-hud">
          <div className="hud-header">
            <div className="hud-maneuver-icon">
              {currentStep ? getManeuverIcon(currentStep.type, currentStep.modifier) : <ArrowUp size={22} />}
            </div>
            <div className="hud-instruction">
              <div className="hud-distance-pill">
                In {currentStep ? formatDistance(currentStep.distance) : "500 m"}
              </div>
              <div className="hud-main-text">
                {currentStep ? getManeuverText(currentStep) : `Head toward ${primaryDest?.name || "Destination"}`}
              </div>
              {nextStep && (
                <div className="hud-sub-text">
                  Then {getManeuverText(nextStep).toLowerCase()}
                </div>
              )}
            </div>
          </div>

          <div className="hud-actions-row">
            <button 
              type="button" 
              onClick={() => setShowDirectionsList(!showDirectionsList)} 
              className={`hud-btn ${showDirectionsList ? 'active' : ''}`}
            >
              <ListOrdered size={14} />
              <span>{showDirectionsList ? "Hide Steps" : `Directions (${routeData.steps?.length || 0})`}</span>
              {showDirectionsList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <button 
              type="button" 
              onClick={toggleNavigationMode}
              className={`hud-btn nav-toggle-btn ${isNavigating ? 'nav-active' : ''}`}
            >
              {isNavigating ? <Square size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
              <span>{isNavigating ? "Exit Nav" : "Start Nav"}</span>
            </button>

            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hud-btn gmaps-app-btn"
              title="Open turn-by-turn voice navigation in Google Maps app"
            >
              <ExternalLink size={14} />
              <span>Google Maps ↗</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Locate Me button */}
      <div className="map-quick-tools">
        {allowLocateMe && (
          <button 
            type="button" 
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`map-floating-gps-btn ${isLocating ? 'locating' : ''}`}
            title="Recenter on your live GPS location"
          >
            <Crosshair size={16} className={isLocating ? "animate-spin" : ""} />
            <span>{isLocating ? "Locating..." : (userLocation.isLive ? "GPS Live" : "Locate Me")}</span>
          </button>
        )}
      </div>

      {/* =====================================================================
          2. LEAFLET MAP ELEMENT
      ===================================================================== */}
      <div 
        ref={mapContainerRef} 
        style={{ height, width: "100%", borderRadius: "18px" }}
        className="map-container-element"
      />

      {/* =====================================================================
          3. GOOGLE MAPS TRIP SUMMARY STRIP (ETA · TIME · DISTANCE)
      ===================================================================== */}
      {routeData && (
        <div className="gmaps-trip-strip">
          <div className="trip-eta-block">
            <div className="eta-big">{calculateETA(routeData.durationSeconds)}</div>
            <div className="eta-label">Estimated Arrival</div>
          </div>
          <div className="trip-stat-divider"></div>
          <div className="trip-time-block">
            <div className="time-val">{formatDuration(routeData.durationSeconds)}</div>
            <div className="time-sub">Driving time</div>
          </div>
          <div className="trip-stat-divider"></div>
          <div className="trip-dist-block">
            <div className="dist-val">{routeData.distanceKm} km</div>
            <div className="dist-sub">Via Indian Highways</div>
          </div>
          <div className="trip-badge-block">
            <span className="fastest-route-pill">⚡ Fastest Road Route</span>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. COLLAPSIBLE STEP-BY-STEP DIRECTIONS DRAWER (GOOGLE MAPS STYLE)
      ===================================================================== */}
      {showDirectionsList && routeData?.steps && (
        <div className="gmaps-steps-drawer">
          <div className="drawer-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Navigation size={18} style={{ color: "#2563EB" }} />
              <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#0F172A" }}>
                Step-by-Step Road Directions
              </h4>
            </div>
            <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "600" }}>
              Tap any step to fly and preview on map
            </span>
          </div>

          <div className="steps-scroll-list">
            {routeData.steps.map((st, idx) => {
              const isSelected = idx === activeStepIndex;
              return (
                <div 
                  key={idx}
                  onClick={() => handleStepClick(st, idx)}
                  className={`step-item ${isSelected ? 'selected' : ''}`}
                >
                  <div className="step-num-icon">
                    <div className="step-maneuver-icon">
                      {getManeuverIcon(st.type, st.modifier)}
                    </div>
                    <span className="step-seq">{st.stepNumber}</span>
                  </div>

                  <div className="step-content">
                    <div className="step-instruction">
                      {getManeuverText(st)}
                    </div>
                    <div className="step-meta">
                      <span className="step-dist">{formatDistance(st.distance)}</span>
                      {st.duration > 0 && <span className="step-duration">· ~{formatDuration(st.duration)}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          5. COMPREHENSIVE TRANSIT COMPARISON & METRICS
      ===================================================================== */}
      {showStats && primaryDest && routeData && (
        <div className="map-transit-stats-card">
          <div className="transit-modes-grid">
            <div className="mode-item road-highlight">
              <div className="mode-icon-box car">
                <Car size={18} />
              </div>
              <div className="mode-info">
                <span className="mode-name">By Road (Car / Bus)</span>
                <span className="mode-time">{formatDuration(routeData.durationSeconds)}</span>
                <span className="mode-sub">{routeData.distanceKm} km via Highway</span>
              </div>
            </div>

            <div className="mode-item">
              <div className="mode-icon-box train">
                <Train size={18} />
              </div>
              <div className="mode-info">
                <span className="mode-name">By Train / Indian Rail</span>
                <span className="mode-time">{Math.round(routeData.distanceKm / 65)}h – {Math.round(routeData.distanceKm / 50)}h</span>
                <span className="mode-sub">Express Corridor</span>
              </div>
            </div>

            <div className="mode-item">
              <div className="mode-icon-box plane">
                <Plane size={18} />
              </div>
              <div className="mode-info">
                <span className="mode-name">By Flight</span>
                <span className="mode-time">{Math.max(1, Math.round(routeData.distanceKm / 620))}h {Math.round((routeData.distanceKm % 620) / 10)}m</span>
                <span className="mode-sub">Aerial Travel Time</span>
              </div>
            </div>
          </div>

          <div className="transit-footer-actions">
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-gmaps-link"
            >
              <ExternalLink size={15} /> Open Turn-by-Turn GPS in Google Maps App
            </a>
            <span className="satellite-tag">
              🛰️ Live Geolocation Source: {userLocation.isLive ? `${userLocation.name} (Accurate to ±${userLocation.accuracy || 15}m)` : 'Standard Geographic Center'}
            </span>
          </div>
        </div>
      )}

      {/* Styled JSX CSS */}
      <style>{`
        .roavio-map-wrapper {
          position: relative;
          width: 100%;
        }

        .map-container-element {
          border: 1.5px solid #CBD5E1;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.12);
          overflow: hidden;
          z-index: 1;
        }

        /* 1. Google Maps Navigation Top HUD */
        .gmaps-nav-hud {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          max-width: 520px;
          background: #0F172A;
          color: white;
          border-radius: 16px;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.35);
          z-index: 500;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .hud-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: linear-gradient(135deg, #047857 0%, #065F46 100%); /* Google Maps Driving Green */
        }

        .hud-maneuver-icon {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
        }

        .hud-instruction {
          flex: 1;
          min-width: 0;
        }

        .hud-distance-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 10px;
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .hud-main-text {
          font-size: 15px;
          font-weight: 800;
          color: #FFFFFF;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hud-sub-text {
          font-size: 12px;
          color: #D1FAE5;
          margin-top: 2px;
        }

        .hud-actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #0F172A;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          gap: 8px;
        }

        .hud-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: #E2E8F0;
          border: none;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .hud-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }
        .hud-btn.active {
          background: #2563EB;
          color: white;
        }

        .nav-toggle-btn {
          background: #10B981;
          color: white;
        }
        .nav-toggle-btn:hover {
          background: #059669;
        }
        .nav-toggle-btn.nav-active {
          background: #DC2626;
        }

        .gmaps-app-btn {
          background: #2563EB;
          color: white;
        }
        .gmaps-app-btn:hover {
          background: #1D4ED8;
        }

        /* Floating Locate Me button */
        .map-quick-tools {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 500;
        }

        .map-floating-gps-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          color: #0F172A;
          border: 1.5px solid #CBD5E1;
          padding: 8px 14px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }
        .map-floating-gps-btn:hover {
          background: #F8FAFC;
          border-color: #10B981;
          color: #059669;
          transform: translateY(-1px);
        }

        /* 3. Google Maps Trip Summary Strip */
        .gmaps-trip-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          padding: 14px 20px;
          margin-top: 12px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
          flex-wrap: wrap;
          gap: 12px;
        }

        .trip-eta-block .eta-big {
          font-size: 1.45rem;
          font-weight: 900;
          color: #059669; /* Green ETA like Google Maps */
          font-family: monospace;
          line-height: 1.1;
        }
        .trip-eta-block .eta-label {
          font-size: 11px;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
        }

        .trip-stat-divider {
          width: 1px;
          height: 32px;
          background: #E2E8F0;
        }

        .trip-time-block .time-val,
        .trip-dist-block .dist-val {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.1;
        }
        .trip-time-block .time-sub,
        .trip-dist-block .dist-sub {
          font-size: 11px;
          color: #64748B;
          font-weight: 600;
        }

        .fastest-route-pill {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
          font-size: 11.5px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 20px;
        }

        /* 4. Directions Drawer (Steps list) */
        .gmaps-steps-drawer {
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          border-radius: 16px;
          margin-top: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          flex-wrap: wrap;
          gap: 8px;
        }

        .steps-scroll-list {
          max-height: 340px;
          overflow-y: auto;
          divide-y: 1px solid #F1F5F9;
        }

        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 12px 18px;
          border-bottom: 1px solid #F1F5F9;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .step-item:hover {
          background: #F0FDF4;
        }
        .step-item.selected {
          background: #EFF6FF;
          border-left: 4px solid #2563EB;
        }

        .step-num-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          width: 34px;
          flex-shrink: 0;
        }

        .step-maneuver-icon {
          width: 32px;
          height: 32px;
          background: #E2E8F0;
          color: #1E293B;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step-item.selected .step-maneuver-icon {
          background: #2563EB;
          color: white;
        }

        .step-seq {
          font-size: 10px;
          font-weight: 800;
          color: #94A3B8;
        }

        .step-content {
          flex: 1;
        }

        .step-instruction {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.4;
        }

        .step-meta {
          display: flex;
          gap: 6px;
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
        }
        .step-dist {
          font-weight: 700;
          color: #059669;
        }

        /* 5. Transit comparison */
        .map-transit-stats-card {
          margin-top: 12px;
          background: white;
          border-radius: 16px;
          padding: 18px 20px;
          border: 1.5px solid #E2E8F0;
        }

        .transit-modes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .mode-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #F8FAFC;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
        }
        .mode-item.road-highlight {
          border-color: #10B981;
          background: #F0FDF4;
        }

        .mode-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mode-icon-box.plane { background: #E0F2FE; color: #0284C7; }
        .mode-icon-box.train { background: #EBF1F7; color: #0F172A; }
        .mode-icon-box.car { background: #D1FAE5; color: #059669; }

        .mode-info {
          display: flex;
          flex-direction: column;
        }
        .mode-name {
          font-size: 0.72rem;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
        }
        .mode-time {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0F172A;
        }
        .mode-sub {
          font-size: 0.7rem;
          color: #94A3B8;
        }

        .transit-footer-actions {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px dashed #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .btn-gmaps-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #2563EB;
          color: white;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .btn-gmaps-link:hover {
          background: #1D4ED8;
        }

        .satellite-tag {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
        }

        /* Marker CSS Styles */
        .user-live-pin-container {
          position: relative;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pin-core {
          width: 28px;
          height: 28px;
          background: #10B981;
          border: 2.5px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
          z-index: 2;
        }
        .pulse-ring {
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.4);
          animation: live-radar-wave 2s infinite ease-out;
          z-index: 1;
        }
        @keyframes live-radar-wave {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        .dest-pin-wrapper {
          position: relative;
          width: 36px;
          height: 46px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dest-pin-badge {
          width: 34px;
          height: 34px;
          background: #0F172A;
          color: #F59E0B;
          border: 2px solid #F59E0B;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.35);
        }
        .dest-pin-stem {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 10px solid #0F172A;
          margin-top: -2px;
        }

        @media (max-width: 768px) {
          .transit-modes-grid {
            grid-template-columns: 1fr;
          }
          .gmaps-nav-hud {
            left: 8px;
            right: 8px;
            top: 8px;
          }
          .gmaps-trip-strip {
            flex-direction: column;
            align-items: flex-start;
          }
          .trip-stat-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
