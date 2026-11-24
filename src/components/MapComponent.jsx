import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin, Compass, Car, Train, Plane, RefreshCw, ExternalLink, ShieldCheck, Zap } from "lucide-react";
import { useTrips } from "../context/TripsContext";

// Fix standard Leaflet default marker icon path issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export default function MapComponent({ 
  userLocation: propUserLocation, 
  destination, 
  destinations = null,
  height = "480px", 
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

  const [routeData, setRouteData] = useState(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Normalize target destinations array (supports single destination or list of stops)
  const targetDestinations = useMemo(() => {
    if (destinations && Array.isArray(destinations) && destinations.length > 0) {
      return destinations.filter(d => d && d.lat && d.lng);
    }
    if (destination && destination.lat && destination.lng) {
      return [destination];
    }
    return [];
  }, [destinations, destination]);

  // Handle Locate Me button click
  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      await requestUserLocation();
    } catch (e) {
      console.warn("Locate me error:", e);
    } finally {
      setIsLocating(false);
    }
  };

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = userLocation?.lat || 28.6139;
      const initialLng = userLocation?.lng || 77.2090;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 5,
        zoomControl: interactive,
        scrollWheelZoom: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Roavio Live Route Radar'
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Map cleanup happens only on unmount
    };
  }, [interactive]);

  // 2. Fetch OSRM Road Route from User Live Location to Destination(s)
  useEffect(() => {
    let isCancelled = false;

    if (!userLocation?.lat || !userLocation?.lng || targetDestinations.length === 0) {
      setRouteData(null);
      return;
    }

    const fetchRoadRoute = async () => {
      setIsRoutingLoading(true);
      try {
        // Construct coordinate string: user -> dest1 -> dest2 ...
        const coords = [
          `${userLocation.lng},${userLocation.lat}`,
          ...targetDestinations.map(d => `${d.lng},${d.lat}`)
        ].join(";");

        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
        const res = await fetch(osrmUrl);
        const data = await res.json();

        if (isCancelled) return;

        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          // OSRM returns coordinates as [lng, lat], Leaflet polyline requires [lat, lng]
          const latLngs = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

          setRouteData({
            isRoadRoute: true,
            coordinates: latLngs,
            distanceKm: Math.round(route.distance / 1000),
            durationHours: (route.duration / 3600).toFixed(1),
            durationMinutes: Math.round(route.duration / 60)
          });
        } else {
          // Fallback to straight / geodesic lines
          throw new Error("No road route available");
        }
      } catch (err) {
        if (isCancelled) return;
        // Calculate straight geodesic distance fallback
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
          durationHours: ((totalDist * 1.2) / 60).toFixed(1),
          durationMinutes: Math.round(((totalDist * 1.2) / 60) * 60)
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

  // 3. Render Markers, Polylines and Bounds on the Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    const bounds = [];

    // --- A. Render User Live Location Marker ---
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
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      // Optional GPS Accuracy radius circle
      if (isLive && userLocation.accuracy) {
        L.circle(userLatLng, {
          radius: Math.min(userLocation.accuracy * 10, 5000),
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
              <strong style="color: #0F172A; font-size: 13px;">${isLive ? 'Your Live Location' : 'Default Starting Point'}</strong>
            </div>
            <div style="color: #334155; font-size: 12.5px; font-weight: 600;">${userLocation.name || userLocation.city || 'Live GPS Coordinates'}</div>
            <div style="color: #64748B; font-size: 11px; margin-top: 2px;">
              ${userLocation.lat.toFixed(4)}° N, ${userLocation.lng.toFixed(4)}° E
              ${userLocation.accuracy ? ` · ±${userLocation.accuracy}m` : ''}
            </div>
          </div>
        `)
        .addTo(layerGroup);
    }

    // --- B. Render Destination Markers ---
    targetDestinations.forEach((dest, idx) => {
      const destLatLng = [dest.lat, dest.lng];
      bounds.push(destLatLng);

      const isMulti = targetDestinations.length > 1;
      const markerNumber = isMulti ? `${idx + 1}` : '★';

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
          <div style="font-family: var(--font-sans, sans-serif); min-width: 190px;">
            ${dest.image ? `<img src="${dest.image}" alt="${dest.name}" style="width: 100%; height: 85px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">` : ''}
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <strong style="color: #0F172A; font-size: 14px;">${dest.name}</strong>
              <span style="font-size: 11px; font-weight: 800; color: #059669; background: #ECFDF5; padding: 2px 6px; border-radius: 6px;">Stop #${idx + 1}</span>
            </div>
            <div style="color: #64748B; font-size: 12px; margin-top: 2px;">${dest.city || ''}${dest.state ? `, ${dest.state}` : ''}</div>
          </div>
        `)
        .addTo(layerGroup);
    });

    // --- C. Render Route Polyline ---
    if (routeData && routeData.coordinates && routeData.coordinates.length > 1) {
      // Background glow casing
      L.polyline(routeData.coordinates, {
        color: "#0F172A",
        weight: 7,
        opacity: 0.28,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(layerGroup);

      // Vivid foreground route line
      const routeLine = L.polyline(routeData.coordinates, {
        color: "#059669",
        weight: 4.5,
        opacity: 0.95,
        dashArray: routeData.isRoadRoute ? null : "8, 8",
        lineCap: "round",
        lineJoin: "round"
      }).addTo(layerGroup);

      routeLine.bindTooltip(`
        🚗 ${routeData.isRoadRoute ? 'Driving Route' : 'Geodesic Route'}: 
        <strong>${routeData.distanceKm.toLocaleString()} km</strong> 
        ${routeData.durationMinutes ? `(~${Math.floor(routeData.durationMinutes / 60)}h ${routeData.durationMinutes % 60}m)` : ''}
      `, { sticky: true });
    }

    // --- D. Fit Map Bounds ---
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 14 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 11);
    }

    // Invalidate size in case container rendered in accordion or modal
    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 250);

  }, [userLocation, targetDestinations, routeData]);

  const primaryDestination = targetDestinations[0] || null;
  const distKm = routeData ? routeData.distanceKm : null;
  const googleMapsUrl = userLocation?.lat && primaryDestination?.lat
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${primaryDestination.lat},${primaryDestination.lng}`
    : "#";

  return (
    <div className="roavio-map-wrapper">
      {/* Live Map Control Bar */}
      <div className="map-toolbar-overlay">
        <div className="location-indicator-pill">
          <span className={`status-dot ${userLocation.isLive ? 'live' : 'default'}`}></span>
          <span className="location-name">
            {userLocation.isLive 
              ? `Live GPS: ${userLocation.name || userLocation.city || 'Acquired'}` 
              : `Starting: ${userLocation.name || 'New Delhi'}`}
          </span>
        </div>

        {allowLocateMe && (
          <button 
            type="button" 
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`locate-me-btn ${isLocating ? 'locating' : ''}`}
            title="Recenter on your live GPS location"
          >
            <Navigation size={14} className={isLocating ? "animate-spin" : ""} />
            <span>{isLocating ? "Locating..." : "Locate Me"}</span>
          </button>
        )}
      </div>

      {/* Leaflet Map DOM Element */}
      <div 
        ref={mapContainerRef} 
        style={{ height, width: "100%", borderRadius: "16px" }}
        className="map-container-element"
      />

      {/* Transit & Navigation Stats Panel */}
      {showStats && primaryDestination && distKm !== null && (
        <div className="map-transit-stats-card">
          <div className="transit-header">
            <div className="route-tags-row">
              <span className={`route-badge ${routeData?.isRoadRoute ? 'badge-highway' : 'badge-geo'}`}>
                {routeData?.isRoadRoute ? '🚗 Real Highway Road Route' : '✈️ Geodesic Direct Track'}
              </span>
              {userLocation.isLive && (
                <span className="live-gps-badge">
                  <Zap size={12} /> Live Route from Your GPS
                </span>
              )}
            </div>

            <div className="route-title-row">
              <h4 className="transit-title">
                {userLocation.isLive ? userLocation.city || 'Your Location' : 'New Delhi'} ➔ {primaryDestination.name}
                {targetDestinations.length > 1 && ` (+${targetDestinations.length - 1} stops)`}
              </h4>
              <div className="distance-highlight">
                <span className="dist-num">{distKm.toLocaleString()}</span>
                <span className="dist-unit">km total road corridor</span>
              </div>
            </div>
          </div>

          <div className="transit-modes-grid">
            <div className="mode-item road-highlight">
              <div className="mode-icon-box car">
                <Car size={18} />
              </div>
              <div className="mode-info">
                <span className="mode-name">By Road (Car / Bus)</span>
                <span className="mode-time">
                  {routeData?.durationMinutes 
                    ? `${Math.floor(routeData.durationMinutes / 60)}h ${routeData.durationMinutes % 60}m` 
                    : `${Math.round((distKm * 1.25) / 55)}h driving`}
                </span>
                <span className="mode-sub">Via Indian Highways</span>
              </div>
            </div>

            <div className="mode-item">
              <div className="mode-icon-box train">
                <Train size={18} />
              </div>
              <div className="mode-info">
                <span className="mode-name">By Train / Indian Rail</span>
                <span className="mode-time">{Math.round(distKm / 65)}h – {Math.round(distKm / 50)}h</span>
                <span className="mode-sub">Express / Vande Bharat</span>
              </div>
            </div>

            <div className="mode-item">
              <div className="mode-icon-box plane">
                <Plane size={18} />
              </div>
              <div className="mode-info">
                <span className="mode-name">By Flight (Air Corridor)</span>
                <span className="mode-time">{Math.max(1, Math.round(distKm / 620))}h {Math.round((distKm % 620) / 10)}m</span>
                <span className="mode-sub">Non-stop air route</span>
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
              <ExternalLink size={14} /> Open Live Turn-by-Turn GPS Navigation
            </a>
            <span className="satellite-tag">
              🛰️ Live Geolocation Precision: {userLocation.accuracy ? `±${userLocation.accuracy}m` : 'Accurate to ~15m'}
            </span>
          </div>
        </div>
      )}

      {/* Styled JSX Styles */}
      <style>{`
        .roavio-map-wrapper {
          position: relative;
          width: 100%;
        }

        .map-container-element {
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
          overflow: hidden;
          z-index: 1;
        }

        .map-toolbar-overlay {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 400;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          padding: 6px 10px;
          border-radius: 30px;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .location-indicator-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #1E293B;
          padding-right: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-dot.live {
          background: #10B981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
        }
        .status-dot.default {
          background: #F59E0B;
        }

        .locate-me-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #10B981;
          color: white;
          border: none;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .locate-me-btn:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        /* Marker CSS Styles */
        .user-live-pin-container {
          position: relative;
          width: 40px;
          height: 40px;
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
          100% { transform: scale(2.0); opacity: 0; }
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

        /* Transit Stats Card */
        .map-transit-stats-card {
          margin-top: 16px;
          background: white;
          border-radius: 16px;
          padding: 20px 24px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        .transit-header {
          margin-bottom: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F1F5F9;
        }

        .route-tags-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .route-badge {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .badge-highway {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }
        .badge-geo {
          background: #EFF6FF;
          color: #1E40AF;
          border: 1px solid #BFDBFE;
        }

        .live-gps-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 800;
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #FDE68A;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .route-title-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .transit-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .distance-highlight {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .dist-num {
          font-size: 1.6rem;
          font-weight: 900;
          color: #059669;
          font-family: monospace;
        }

        .dist-unit {
          font-size: 0.85rem;
          color: #64748B;
          font-weight: 600;
        }

        .transit-modes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .mode-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #F8FAFC;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
        }
        .mode-item.road-highlight {
          border-color: #10B981;
          background: #F0FDF4;
        }

        .mode-icon-box {
          width: 40px;
          height: 40px;
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
          font-size: 0.75rem;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
        }

        .mode-time {
          font-size: 1rem;
          font-weight: 800;
          color: #0F172A;
        }

        .mode-sub {
          font-size: 0.72rem;
          color: #94A3B8;
        }

        .transit-footer-actions {
          margin-top: 16px;
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
          color: #059669;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }
        .btn-gmaps-link:hover {
          text-decoration: underline;
        }

        .satellite-tag {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .transit-modes-grid {
            grid-template-columns: 1fr;
          }
          .transit-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
