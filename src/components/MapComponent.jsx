import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin, Compass, Car, Train, Plane } from "lucide-react";

// Fix standard Leaflet default marker icon path issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export default function MapComponent({ 
  userLocation, 
  destination, 
  height = "480px", 
  showStats = true,
  interactive = true 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

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
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Roavio Live Map'
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const bounds = [];

    // 1. User Location Marker
    if (userLocation && userLocation.lat && userLocation.lng) {
      const userLatLng = [userLocation.lat, userLocation.lng];
      bounds.push(userLatLng);

      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `
          <div style="
            background: #159B75; 
            color: white; 
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 0 0 6px rgba(21, 155, 117, 0.25);
            border: 2px solid white;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker(userLatLng, { icon: userIcon })
        .bindPopup(`<strong>Your Location</strong><br>${userLocation.name || "Live Coordinates"}`)
        .addTo(layerGroup);
    }

    // 2. Destination Marker
    if (destination && destination.lat && destination.lng) {
      const destLatLng = [destination.lat, destination.lng];
      bounds.push(destLatLng);

      const destIcon = L.divIcon({
        className: "custom-dest-marker",
        html: `
          <div style="
            background: #142B45; 
            color: white; 
            width: 36px; 
            height: 36px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 0 0 6px rgba(20, 43, 69, 0.25);
            border: 2px solid #FF9B54;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      L.marker(destLatLng, { icon: destIcon })
        .bindPopup(`
          <div style="font-family: var(--font-heading); min-width: 160px;">
            <strong style="color: #142B45; font-size: 14px;">${destination.name}</strong><br>
            <span style="color: #64748B; font-size: 12px;">${destination.city}, ${destination.state}</span>
          </div>
        `)
        .addTo(layerGroup)
        .openPopup();

      // 3. Draw Route Polyline if both exist
      if (userLocation && userLocation.lat && userLocation.lng) {
        const routePoints = [
          [userLocation.lat, userLocation.lng],
          [destination.lat, destination.lng]
        ];

        L.polyline(routePoints, {
          color: "#159B75",
          weight: 4,
          opacity: 0.8,
          dashArray: "8, 8"
        }).addTo(layerGroup);
      }
    }

    // Fit map bounds
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 9);
    }
  }, [userLocation, destination, interactive]);

  // Estimate transit calculations
  const calculateDistance = () => {
    if (!userLocation || !destination || !userLocation.lat || !destination.lat) return null;
    const R = 6371;
    const dLat = ((destination.lat - userLocation.lat) * Math.PI) / 180;
    const dLon = ((destination.lng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((destination.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const distKm = calculateDistance();

  return (
    <div className="roavio-map-wrapper">
      <div 
        ref={mapContainerRef} 
        style={{ height, width: "100%", borderRadius: "var(--radius-lg)" }}
        className="map-container-element"
      />

      {showStats && destination && distKm !== null && (
        <div className="map-transit-stats-card">
          <div className="transit-header">
            <span className="route-badge">Direct Geodesic Route</span>
            <h4 className="transit-title">
              {userLocation.isLive ? "From Your Live GPS" : "From New Delhi"} ➔ {destination.name}
            </h4>
            <div className="distance-highlight">
              <span className="dist-num">{distKm.toLocaleString()}</span>
              <span className="dist-unit">km (approx aerial route)</span>
            </div>
          </div>

          <div className="transit-modes-grid">
            <div className="mode-item">
              <div className="mode-icon-box plane">
                <Plane size={18} />
              </div>
              <div className="mode-info">
                <span className="mode-name">By Flight</span>
                <span className="mode-time">{Math.max(1, Math.round(distKm / 600))}h {Math.round((distKm % 600) / 10)}m</span>
              </div>
            </div>

            <div className="mode-item">
              <div className="mode-icon-box train">
                <Train size={18} />
              </div>
              <div className="mode-info">
                <span className="mode-name">By Train / Rail</span>
                <span className="mode-time">{Math.round(distKm / 65)}h – {Math.round(distKm / 50)}h</span>
              </div>
            </div>

            <div className="mode-item">
              <div className="mode-icon-box car">
                <Car size={18} />
              </div>
              <div className="mode-info">
                <span className="mode-name">By Road / Car</span>
                <span className="mode-time">{Math.round((distKm * 1.25) / 55)}h driving</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .roavio-map-wrapper {
          position: relative;
          width: 100%;
        }

        .map-container-element {
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          z-index: 1;
        }

        .map-transit-stats-card {
          margin-top: 16px;
          background: white;
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .transit-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F1F5F9;
        }

        .route-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--travel-green-dark);
          background: var(--travel-green-light);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .transit-title {
          font-size: 1.12rem;
          color: var(--primary-navy);
          margin: 0;
        }

        .distance-highlight {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .dist-num {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--travel-green);
          font-family: var(--font-heading);
        }

        .dist-unit {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .transit-modes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .mode-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #F8FAFC;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          border: 1px solid #E2E8F0;
        }

        .mode-icon-box {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mode-icon-box.plane { background: #E0F2FE; color: #0284C7; }
        .mode-icon-box.train { background: #EBF1F7; color: var(--primary-navy); }
        .mode-icon-box.car { background: #FEF3C7; color: #D97706; }

        .mode-info {
          display: flex;
          flex-direction: column;
        }

        .mode-name {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .mode-time {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary-navy);
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
