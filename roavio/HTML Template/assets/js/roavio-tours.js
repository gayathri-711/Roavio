/**
 * Roavio India Tour Explorer & Live Location Routing Engine
 * Implements:
 * 1. Tourist Places Exploration across India
 * 2. Search by Place Name or State Name with instant filtering
 * 3. Interactive Leaflet Map showing User's Live Location, Destination & Route
 * 4. Booking Tickets for Tourist Place Entry / Tour Packages
 * 5. Booking Transport (Flights, Trains, Buses) & Hotels for that destination
 */

(function () {
    // Current application state
    const state = {
        places: INDIA_TOURIST_DESTINATIONS,
        filteredPlaces: [...INDIA_TOURIST_DESTINATIONS],
        selectedState: "All States",
        selectedCategory: "all",
        searchQuery: "",
        sortBy: "popular",
        isExpanded: false,
        featuredCount: 4,
        // Default User Location: New Delhi
        userLocation: {
            lat: 28.6139,
            lng: 77.2090,
            name: "New Delhi (Live GPS / Center)",
            isLive: false
        },
        // Currently selected destination on map
        activeDestination: INDIA_TOURIST_DESTINATIONS[0],
        mapInstance: null,
        userMarker: null,
        destMarker: null,
        routeLine: null
    };

    // DOM references
    const elements = {};

    function init() {
        cacheDom();
        if (!elements.toursGrid) return; // Exit safely if not on tours directory page

        // On dedicated tours page, expand directory by default
        state.isExpanded = true;

        // Read query params from URL (e.g. from Home page explore form)
        if (typeof window !== "undefined" && window.location.search) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("q") && urlParams.get("q")) {
                state.searchQuery = urlParams.get("q").trim().toLowerCase();
            }
            if (urlParams.has("state") && urlParams.get("state")) {
                state.selectedState = urlParams.get("state");
            }
            if (urlParams.has("cat") && urlParams.get("cat")) {
                state.selectedCategory = urlParams.get("cat");
            }
        }

        populateStateDropdown();
        initCategoryFilters();
        initSearchListeners();
        initMap();
        applyFilters();
        bindGlobalModals();
        tryAutoDetectLocation();

        // Auto-scroll to results if filtered by state or query
        if ((state.selectedState && state.selectedState !== "All States") || state.searchQuery) {
            setTimeout(() => {
                const sec = document.getElementById("roavio-tours-section");
                if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 250);
        }
    }

    function cacheDom() {
        elements.stateSelect = document.getElementById("roavio-tour-state-select");
        elements.searchInput = document.getElementById("roavio-tour-search-input");
        elements.sortSelect = document.getElementById("roavio-tour-sort-select");
        elements.catPillsContainer = document.getElementById("roavio-cat-pills-bar");
        elements.toursGrid = document.getElementById("roavio-tours-grid");
        elements.countText = document.getElementById("roavio-tours-count");
        elements.detectGpsBtn = document.getElementById("roavio-detect-gps-btn");
        elements.gpsPill = document.getElementById("roavio-gps-status-pill");

        // Map elements
        elements.mapOriginName = document.getElementById("roavio-map-origin-name");
        elements.mapOriginCoords = document.getElementById("roavio-map-origin-coords");
        elements.mapDestName = document.getElementById("roavio-map-dest-name");
        elements.mapDestCoords = document.getElementById("roavio-map-dest-coords");
        elements.mapDistance = document.getElementById("roavio-map-distance");
        elements.mapFlightTime = document.getElementById("roavio-flight-time");
        elements.mapTrainTime = document.getElementById("roavio-train-time");
        elements.mapRoadTime = document.getElementById("roavio-road-time");
        elements.openGmapsBtn = document.getElementById("roavio-open-gmaps-btn");

        // Modals
        elements.ticketModal = document.getElementById("roavio-tour-ticket-modal");
        elements.transportModal = document.getElementById("roavio-transport-modal");
    }

    function populateStateDropdown() {
        if (!elements.stateSelect) return;
        elements.stateSelect.innerHTML = "";
        INDIA_STATES.forEach(st => {
            const opt = document.createElement("option");
            opt.value = st;
            opt.textContent = st === "All States" ? "📍 All Indian States" : `📍 ${st}`;
            if (state.selectedState && opt.value.toLowerCase() === state.selectedState.toLowerCase()) {
                opt.selected = true;
            }
            elements.stateSelect.appendChild(opt);
        });

        if (state.selectedState) {
            elements.stateSelect.value = state.selectedState;
        }

        elements.stateSelect.addEventListener("change", (e) => {
            state.selectedState = e.target.value;
            applyFilters();
        });
    }

    function initCategoryFilters() {
        if (!elements.catPillsContainer) return;
        elements.catPillsContainer.innerHTML = "";
        INDIA_CATEGORIES.forEach(cat => {
            const pill = document.createElement("div");
            pill.className = `roavio-cat-pill ${cat.id === state.selectedCategory ? 'active' : ''}`;
            pill.dataset.cat = cat.id;
            pill.innerHTML = `<i class="fa-solid ${cat.icon}"></i> <span>${cat.name}</span>`;
            pill.addEventListener("click", () => {
                document.querySelectorAll(".roavio-cat-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                state.selectedCategory = cat.id;
                applyFilters();
            });
            elements.catPillsContainer.appendChild(pill);
        });
    }

    function initSearchListeners() {
        if (elements.searchInput) {
            if (state.searchQuery) elements.searchInput.value = state.searchQuery;
            elements.searchInput.addEventListener("input", (e) => {
                state.searchQuery = e.target.value.trim().toLowerCase();
                applyFilters();
            });
            elements.searchInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    state.searchQuery = e.target.value.trim().toLowerCase();
                    applyFilters();
                    const sec = document.getElementById("roavio-tours-section");
                    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        }

        if (elements.sortSelect) {
            elements.sortSelect.addEventListener("change", (e) => {
                state.sortBy = e.target.value;
                applyFilters();
            });
        }

        if (elements.detectGpsBtn) {
            elements.detectGpsBtn.addEventListener("click", detectUserLiveLocation);
        }
        if (elements.gpsPill) {
            elements.gpsPill.addEventListener("click", detectUserLiveLocation);
        }
    }

    function isItemMatch(item, query, normQuery) {
        if (!query) return true;
        const normName = item.name.toLowerCase().replace(/[-_]/g, ' ');
        const normId = item.id.toLowerCase().replace(/[-_]/g, ' ');
        const normCity = item.city.toLowerCase();
        const normState = item.state.toLowerCase();
        const normCat = (item.categoryName || '').toLowerCase();
        const normDesc = item.description.toLowerCase();

        return (
            normName.includes(query) || normName.includes(normQuery) ||
            normId.includes(query) || normId.includes(normQuery) ||
            normCity.includes(query) || normCity.includes(normQuery) ||
            normState.includes(query) || normState.includes(normQuery) ||
            normCat.includes(query) || normCat.includes(normQuery) ||
            normDesc.includes(query) || normDesc.includes(normQuery) ||
            item.highlights.some(h => {
                const nh = h.toLowerCase();
                return nh.includes(query) || nh.includes(normQuery);
            })
        );
    }

    function applyFilters() {
        let list = [...state.places];
        const query = (state.searchQuery || "").trim().toLowerCase();
        const normQuery = query.replace(/[-_]/g, ' ');

        // Smart Cross-State & Category Resolution:
        // If a search query is typed, verify if it matches in the selected state.
        // If not found in that state, but exists across India, auto-release the state filter to show matching places!
        if (query && state.selectedState && state.selectedState !== "All States") {
            const matchesInState = list.some(item =>
                item.state.toLowerCase() === state.selectedState.toLowerCase() &&
                isItemMatch(item, query, normQuery)
            );
            if (!matchesInState) {
                const matchesAnywhere = list.some(item => isItemMatch(item, query, normQuery));
                if (matchesAnywhere) {
                    state.selectedState = "All States";
                    if (elements.stateSelect) elements.stateSelect.value = "All States";
                }
            }
        }

        // 1. State filter
        if (state.selectedState && state.selectedState !== "All States") {
            list = list.filter(item => item.state.toLowerCase() === state.selectedState.toLowerCase());
        }

        // 2. Category filter (auto-broaden if category conflicts with specific text query)
        if (state.selectedCategory && state.selectedCategory !== "all") {
            const catMatches = list.filter(item => item.category === state.selectedCategory);
            if (catMatches.length > 0 || !query) {
                list = catMatches;
            } else {
                state.selectedCategory = "all";
                document.querySelectorAll(".roavio-cat-pill").forEach(p => {
                    p.classList.toggle("active", p.dataset.cat === "all");
                });
            }
        }

        // 3. Search query (matches place name, state name, city, id, description, or highlights)
        if (query) {
            list = list.filter(item => isItemMatch(item, query, normQuery));
        }

        // 4. Sorting
        if (state.sortBy === "price-low") {
            list.sort((a, b) => a.ticketPrice - b.ticketPrice);
        } else if (state.sortBy === "rating") {
            list.sort((a, b) => b.rating - a.rating);
        } else if (state.sortBy === "distance") {
            list.sort((a, b) => {
                const distA = calculateDistanceKm(state.userLocation.lat, state.userLocation.lng, a.lat, a.lng);
                const distB = calculateDistanceKm(state.userLocation.lat, state.userLocation.lng, b.lat, b.lng);
                return distA - distB;
            });
        } else {
            // Default: popular (rating & review count)
            list.sort((a, b) => b.reviews - a.reviews);
        }

        const hasActiveFilter = Boolean(query || (state.selectedState && state.selectedState !== "All States") || (state.selectedCategory && state.selectedCategory !== "all"));
        if (hasActiveFilter) {
            state.isExpanded = true;
        }
        state.filteredPlaces = list;
        renderToursGrid();
    }

    function renderToursGrid() {
        if (!elements.toursGrid) return;

        const isFilterActive = Boolean(state.searchQuery || (state.selectedState && state.selectedState !== "All States") || (state.selectedCategory && state.selectedCategory !== "all"));

        let displayPlaces = state.filteredPlaces;
        if (!isFilterActive && !state.isExpanded) {
            displayPlaces = state.filteredPlaces.slice(0, 4);
        }

        if (elements.countText) {
            if (isFilterActive) {
                if (state.selectedState && state.selectedState !== "All States") {
                    elements.countText.textContent = `Showing all ${state.filteredPlaces.length} Tourist Places in ${state.selectedState}`;
                } else if (state.searchQuery) {
                    elements.countText.textContent = `Showing ${state.filteredPlaces.length} tourist places matching "${state.searchQuery}"`;
                } else {
                    elements.countText.textContent = `Showing ${state.filteredPlaces.length} matching tourist places`;
                }
            } else if (!state.isExpanded) {
                elements.countText.textContent = `Showing 4 Featured Tourist Places (${state.filteredPlaces.length - 4}+ more destinations available below)`;
            } else {
                elements.countText.textContent = `Showing all ${state.filteredPlaces.length} Tourist Places across India`;
            }
        }

        // Manage Explore More Button state
        const toggleBtnContainer = document.getElementById("roavio-explore-more-container");
        const toggleBtnText = document.getElementById("roavio-explore-toggle-text");
        const toggleBtnIcon = document.getElementById("roavio-explore-toggle-icon");

        if (toggleBtnContainer) {
            if (isFilterActive) {
                toggleBtnContainer.style.display = "none";
            } else {
                toggleBtnContainer.style.display = "block";
                if (!state.isExpanded) {
                    if (toggleBtnText) toggleBtnText.textContent = `Explore More Places (See ${state.filteredPlaces.length - 4}+ More Destinations)`;
                    if (toggleBtnIcon) toggleBtnIcon.className = "fa-solid fa-chevron-down ms-2";
                } else {
                    if (toggleBtnText) toggleBtnText.textContent = "Show Featured 4 Places Only";
                    if (toggleBtnIcon) toggleBtnIcon.className = "fa-solid fa-chevron-up ms-2";
                }
            }
        }

        if (state.filteredPlaces.length === 0) {
            elements.toursGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div style="font-size: 3rem; margin-bottom: 12px;">🗺️</div>
                    <h4>No tourist places found matching "${state.searchQuery || state.selectedState}"</h4>
                    <p class="text-muted">Try clearing your filters or searching for states like Rajasthan, Kerala, Himachal, or Goa.</p>
                    <button class="btn btn-outline-danger mt-2" onclick="window.RoavioTours.resetFilters()">Reset All Filters</button>
                </div>
            `;
            return;
        }

        const cardsHtml = displayPlaces.map(place => {
            const distance = calculateDistanceKm(
                state.userLocation.lat,
                state.userLocation.lng,
                place.lat,
                place.lng
            );

            const highlightsHtml = place.highlights
                .slice(0, 3)
                .map(h => `<span class="roavio-high-chip">✓ ${h}</span>`)
                .join("");

            return `
                <div class="roavio-tour-card" data-id="${place.id}">
                    <div class="roavio-card-media">
                        <img src="${place.image}" alt="${place.name}" loading="lazy" onerror="this.src='assets/img/home-1/tour/tour-1.jpg'">
                        <span class="roavio-card-badge">${place.badge}</span>
                        <div class="roavio-card-distance">
                            <i class="fa-solid fa-location-arrow"></i>
                            <span>${distance.toLocaleString()} km from you</span>
                        </div>
                    </div>
                    <div class="roavio-card-body">
                        <div class="roavio-card-location">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>${place.city}, ${place.state}</span>
                        </div>
                        <h3 class="roavio-card-title">${place.name}</h3>
                        <div class="roavio-card-rating-row">
                            <span class="roavio-rating-pill"><i class="fa-solid fa-star"></i> ${place.rating}</span>
                            <span class="roavio-review-text">(${place.reviews.toLocaleString()} reviews)</span>
                            <span class="badge bg-light text-dark ms-auto" style="font-size: 0.75rem; border: 1px solid #e2e8f0;">${place.categoryName}</span>
                        </div>
                        <p class="roavio-card-desc">${place.description}</p>
                        
                        <div class="roavio-card-highlights">
                            ${highlightsHtml}
                        </div>

                        <!-- Transport Hubs Connection -->
                        <div class="roavio-transport-hubs-bar">
                            <div class="roavio-hub-item" title="Nearest Airport">
                                <i class="fa-solid fa-plane"></i>
                                <span>${place.nearestAirport.name} (${place.nearestAirport.dist})</span>
                            </div>
                            <div class="roavio-hub-item" title="Nearest Railway Station">
                                <i class="fa-solid fa-train"></i>
                                <span>${place.nearestTrain.name} (${place.nearestTrain.dist})</span>
                            </div>
                        </div>

                        <!-- Pricing Row -->
                        <div class="roavio-pricing-row">
                            <div class="roavio-price-block">
                                <span class="price-label">Entry Ticket</span>
                                <span class="price-val">${place.ticketPrice === 0 ? 'Free Entry' : '₹' + place.ticketPrice.toLocaleString()}</span>
                                <span class="price-sub">per person</span>
                            </div>
                            <div class="roavio-price-block text-end">
                                <span class="price-label">Full Day Tour</span>
                                <span class="price-val" style="color: #0284c7;">₹${place.tourPackagePrice.toLocaleString()}</span>
                                <span class="price-sub">guide + entry pass</span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="roavio-card-actions">
                            <!-- Requirement 1: Book Tour Ticket -->
                            <button type="button" class="roavio-book-ticket-btn" onclick="window.RoavioTours.openTicketBooking('${place.id}')">
                                <i class="fa-solid fa-ticket"></i>
                                <span>Book Tour Ticket</span>
                            </button>

                            <!-- Requirement 4: Direct Flight, Train, Bus, Hotel Buttons -->
                            <div class="roavio-travel-buttons-row">
                                <button type="button" class="roavio-quick-travel-btn flight-btn" onclick="window.RoavioTours.openTransport('${place.id}', 'flight')" title="Book Flights to ${place.city}">
                                    <i class="fa-solid fa-plane"></i>
                                    <span>Flights</span>
                                </button>
                                <button type="button" class="roavio-quick-travel-btn train-btn" onclick="window.RoavioTours.openTransport('${place.id}', 'train')" title="Book Trains to ${place.nearestTrain.code}">
                                    <i class="fa-solid fa-train"></i>
                                    <span>Trains</span>
                                </button>
                                <button type="button" class="roavio-quick-travel-btn bus-btn" onclick="window.RoavioTours.openTransport('${place.id}', 'bus')" title="Book Buses to ${place.city}">
                                    <i class="fa-solid fa-bus"></i>
                                    <span>Buses</span>
                                </button>
                                <button type="button" class="roavio-quick-travel-btn hotel-btn" onclick="window.RoavioTours.openTransport('${place.id}', 'hotel')" title="Book Hotels in ${place.city}">
                                    <i class="fa-solid fa-hotel"></i>
                                    <span>Hotels</span>
                                </button>
                            </div>

                            <!-- Requirement 3: View on Map -->
                            <button type="button" class="roavio-view-map-btn" onclick="window.RoavioTours.focusOnMap('${place.id}')">
                                <i class="fa-solid fa-map-location-dot"></i>
                                <span>View Route & Distance on Map</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        elements.toursGrid.innerHTML = cardsHtml;
    }

    // =========================================================================
    // Leaflet Interactive Map & Geolocation Routing (Requirement 3)
    // =========================================================================

    function initMap() {
        const mapContainer = document.getElementById("roavio-live-map");
        if (!mapContainer || typeof L === "undefined") return;

        // Initialize Leaflet map
        state.mapInstance = L.map("roavio-live-map", {
            zoomControl: true,
            scrollWheelZoom: false
        }).setView([state.userLocation.lat, state.userLocation.lng], 5);

        // Standard OpenStreetMap Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Roavio Live Routing'
        }).addTo(state.mapInstance);

        updateMapDisplay();
    }

    function updateMapDisplay() {
        if (!state.mapInstance || !state.activeDestination) return;

        const uLat = state.userLocation.lat;
        const uLng = state.userLocation.lng;
        const dLat = state.activeDestination.lat;
        const dLng = state.activeDestination.lng;

        // Clean previous markers & route
        if (state.userMarker) state.mapInstance.removeLayer(state.userMarker);
        if (state.destMarker) state.mapInstance.removeLayer(state.destMarker);
        if (state.routeLine) state.mapInstance.removeLayer(state.routeLine);

        // Custom User Marker Icon
        const userIcon = L.divIcon({
            className: "roavio-user-pin-wrapper",
            html: `<div class="roavio-map-pin-user" title="Your Location"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        state.userMarker = L.marker([uLat, uLng], { icon: userIcon })
            .addTo(state.mapInstance)
            .bindPopup(`<b>📍 Your Location</b><br>${state.userLocation.name}<br>Lat: ${uLat.toFixed(4)}, Lng: ${uLng.toFixed(4)}`)
            .openPopup();

        // Custom Destination Marker Icon
        const destIcon = L.divIcon({
            className: "roavio-dest-pin-wrapper",
            html: `<div class="roavio-map-pin-dest"><i class="fa-solid fa-flag"></i> ${state.activeDestination.name}</div>`,
            iconSize: [140, 36],
            iconAnchor: [70, 36]
        });

        state.destMarker = L.marker([dLat, dLng], { icon: destIcon })
            .addTo(state.mapInstance)
            .bindPopup(`<b>🚩 Destination: ${state.activeDestination.name}</b><br>${state.activeDestination.city}, ${state.activeDestination.state}<br>Entry: ₹${state.activeDestination.ticketPrice}`);

        // Draw animated curved route line
        const midLat = (uLat + dLat) / 2 + (dLng - uLng) * 0.05;
        const midLng = (uLng + dLng) / 2 + (uLat - dLat) * 0.05;

        state.routeLine = L.polyline([[uLat, uLng], [midLat, midLng], [dLat, dLng]], {
            color: "#e53935",
            weight: 4,
            opacity: 0.85,
            dashArray: "8, 8"
        }).addTo(state.mapInstance);

        // Fit map bounds to show both user & destination comfortably
        const group = new L.featureGroup([state.userMarker, state.destMarker]);
        state.mapInstance.fitBounds(group.getBounds().pad(0.35));

        // Update Sidebar Stats
        const distance = calculateDistanceKm(uLat, uLng, dLat, dLng);

        if (elements.mapOriginName) elements.mapOriginName.textContent = state.userLocation.name;
        if (elements.mapOriginCoords) elements.mapOriginCoords.textContent = `${uLat.toFixed(3)}° N, ${uLng.toFixed(3)}° E`;

        if (elements.mapDestName) elements.mapDestName.textContent = `${state.activeDestination.name} (${state.activeDestination.city})`;
        if (elements.mapDestCoords) elements.mapDestCoords.textContent = `${dLat.toFixed(3)}° N, ${dLng.toFixed(3)}° E · ${state.activeDestination.state}`;

        if (elements.mapDistance) elements.mapDistance.textContent = `${distance.toLocaleString()} km`;

        // Calculate travel times
        // Flight: avg 650 km/h + 40 min buffer
        const flightHours = Math.max(1, Math.round((distance / 650 + 0.6) * 10) / 10);
        // Train: avg 75 km/h
        const trainHours = Math.round((distance / 75) * 10) / 10;
        // Road: avg 55 km/h
        const roadHours = Math.round((distance / 55) * 10) / 10;

        if (elements.mapFlightTime) elements.mapFlightTime.textContent = distance < 150 ? '30 min' : `${flightHours} hrs`;
        if (elements.mapTrainTime) elements.mapTrainTime.textContent = `${trainHours} hrs`;
        if (elements.mapRoadTime) elements.mapRoadTime.textContent = `${roadHours} hrs`;

        // Update Google Maps external directions URL
        if (elements.openGmapsBtn) {
            elements.openGmapsBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${uLat},${uLng}&destination=${dLat},${dLng}&travelmode=driving`;
        }
    }

    function tryAutoDetectLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    state.userLocation.lat = pos.coords.latitude;
                    state.userLocation.lng = pos.coords.longitude;
                    state.userLocation.name = "Your Live GPS Location";
                    state.userLocation.isLive = true;

                    if (elements.gpsPill) {
                        elements.gpsPill.innerHTML = `<span class="roavio-live-pulse-dot"></span> <span>Live GPS Active</span>`;
                        elements.gpsPill.style.background = "#dcfce7";
                        elements.gpsPill.style.color = "#15803d";
                    }

                    updateMapDisplay();
                    renderToursGrid();
                },
                (err) => {
                    console.log("GPS not granted or unavailable, using Delhi as central India hub:", err.message);
                },
                { timeout: 7000 }
            );
        }
    }

    function detectUserLiveLocation() {
        if (!("geolocation" in navigator)) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        if (elements.detectGpsBtn) {
            elements.detectGpsBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Detecting GPS...`;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                state.userLocation.lat = pos.coords.latitude;
                state.userLocation.lng = pos.coords.longitude;
                state.userLocation.name = "Your Live GPS Location";
                state.userLocation.isLive = true;

                if (elements.detectGpsBtn) {
                    elements.detectGpsBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Live GPS Found`;
                }
                if (elements.gpsPill) {
                    elements.gpsPill.innerHTML = `<span class="roavio-live-pulse-dot"></span> <span>Live GPS: Active</span>`;
                    elements.gpsPill.style.background = "#dcfce7";
                    elements.gpsPill.style.color = "#15803d";
                }

                updateMapDisplay();
                renderToursGrid();
            },
            (err) => {
                if (elements.detectGpsBtn) {
                    elements.detectGpsBtn.innerHTML = `<i class="fa-solid fa-location-crosshairs"></i> Detect Live GPS Location`;
                }
                alert("Could not retrieve GPS coordinates. Defaulting to Delhi central location. Error: " + err.message);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    function focusOnMap(placeId) {
        const place = state.places.find(p => p.id === placeId);
        if (!place) return;

        state.activeDestination = place;
        updateMapDisplay();

        // Smooth scroll to map section
        const mapSection = document.getElementById("roavio-tour-map-section");
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // =========================================================================
    // Ticket Booking & Travel Booking Modals (Requirements 1 & 4)
    // =========================================================================

    function openTicketBooking(placeId) {
        const place = state.places.find(p => p.id === placeId);
        if (!place) return;

        const modal = elements.ticketModal;
        if (!modal) return;

        const today = new Date();
        today.setDate(today.getDate() + 1);
        const defaultDate = today.toISOString().split("T")[0];

        modal.innerHTML = `
            <div class="roavio-modal-dialog">
                <div class="roavio-modal-header">
                    <h4 class="roavio-modal-title">
                        <i class="fa-solid fa-ticket text-danger"></i>
                        <span>Book Tour Ticket: ${place.name}</span>
                    </h4>
                    <button type="button" class="roavio-modal-close" onclick="window.RoavioTours.closeModal('ticket')">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="roavio-modal-body" id="ticket-modal-content">
                    <div class="d-flex align-items-center gap-3 mb-3 p-3 bg-light rounded-3">
                        <img src="${place.image}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px;">
                        <div>
                            <h6 class="mb-1">${place.name}</h6>
                            <small class="text-muted"><i class="fa-solid fa-location-dot text-primary"></i> ${place.city}, ${place.state} · ${place.timings}</small>
                        </div>
                    </div>

                    <form id="roavio-ticket-form" onsubmit="window.RoavioTours.confirmTicketBooking(event, '${place.id}')">
                        <!-- Ticket Category Selection -->
                        <div class="mb-3">
                            <label class="form-label fw-bold">Select Ticket Type:</label>
                            <div class="form-check p-3 border rounded-3 mb-2 bg-white">
                                <input class="form-check-input" type="radio" name="ticket_tier" id="tier_entry" value="entry" checked onchange="window.RoavioTours.updateTicketPrice(${place.ticketPrice}, ${place.tourPackagePrice})">
                                <label class="form-check-label d-flex justify-content-between align-items-center w-100 ps-2" for="tier_entry">
                                    <div>
                                        <strong>Official Monument / Attraction Entry Pass</strong>
                                        <div class="text-muted small">Standard entry with skip-the-box-office barcode.</div>
                                    </div>
                                    <span class="fs-5 fw-bold text-danger">${place.ticketPrice === 0 ? 'FREE' : '₹' + place.ticketPrice}</span>
                                </label>
                            </div>
                            <div class="form-check p-3 border rounded-3 bg-white">
                                <input class="form-check-input" type="radio" name="ticket_tier" id="tier_package" value="package" onchange="window.RoavioTours.updateTicketPrice(${place.ticketPrice}, ${place.tourPackagePrice})">
                                <label class="form-check-label d-flex justify-content-between align-items-center w-100 ps-2" for="tier_package">
                                    <div>
                                        <strong>Full-Day Guided Heritage Tour Package</strong>
                                        <div class="text-muted small">All monument entries + licensed historian guide + private AC transfer.</div>
                                    </div>
                                    <span class="fs-5 fw-bold text-primary">₹${place.tourPackagePrice}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Date & Slot -->
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Visit Date:</label>
                                <input type="date" class="form-control" id="ticket-visit-date" value="${defaultDate}" min="${new Date().toISOString().split('T')[0]}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Time Slot:</label>
                                <select class="form-select" id="ticket-slot" required>
                                    <option value="Morning Sunrise (06:00 AM - 09:30 AM)">Morning Sunrise (06:00 AM - 09:30 AM)</option>
                                    <option value="Daytime General (10:00 AM - 02:00 PM)" selected>Daytime General (10:00 AM - 02:00 PM)</option>
                                    <option value="Sunset Golden Hour (03:30 PM - 06:30 PM)">Sunset Golden Hour (03:30 PM - 06:30 PM)</option>
                                </select>
                            </div>
                        </div>

                        <!-- Guests -->
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Adults (Age 12+):</label>
                                <input type="number" class="form-control" id="ticket-adults" value="2" min="1" max="20" onchange="window.RoavioTours.updateTicketPrice(${place.ticketPrice}, ${place.tourPackagePrice})" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Children (Age 5-11):</label>
                                <input type="number" class="form-control" id="ticket-children" value="0" min="0" max="10" onchange="window.RoavioTours.updateTicketPrice(${place.ticketPrice}, ${place.tourPackagePrice})">
                            </div>
                        </div>

                        <!-- Visitor Contact -->
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Lead Visitor Name:</label>
                                <input type="text" class="form-control" id="ticket-name" placeholder="e.g. Rahul Sharma" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Mobile Number (For E-Ticket SMS):</label>
                                <input type="tel" class="form-control" id="ticket-phone" placeholder="e.g. +91 98765 43210" required>
                            </div>
                        </div>

                        <!-- Price summary -->
                        <div class="d-flex justify-content-between align-items-center p-3 rounded-3 mb-4" style="background: #fff1f2; border: 1px solid #fecdd3;">
                            <div>
                                <span class="text-muted d-block small">Total Payable Amount</span>
                                <strong class="fs-4 text-danger" id="ticket-total-display">₹${(place.ticketPrice * 2).toLocaleString()}</strong>
                            </div>
                            <span class="badge bg-success px-3 py-2">✓ Instant E-Ticket Confirmation</span>
                        </div>

                        <button type="submit" class="btn btn-danger w-100 py-3 fw-bold fs-6">
                            <i class="fa-solid fa-lock me-2"></i> Pay & Generate Official E-Ticket
                        </button>
                    </form>
                </div>
            </div>
        `;

        modal.classList.add("active");
    }

    function updateTicketPrice(baseEntry, basePackage) {
        const isPackage = document.getElementById("tier_package")?.checked;
        const adults = parseInt(document.getElementById("ticket-adults")?.value || 1, 10);
        const children = parseInt(document.getElementById("ticket-children")?.value || 0, 10);

        const unit = isPackage ? basePackage : baseEntry;
        const total = (adults * unit) + Math.round(children * unit * 0.5);

        const display = document.getElementById("ticket-total-display");
        if (display) {
            display.textContent = total === 0 ? "FREE" : `₹${total.toLocaleString()}`;
        }
    }

    function confirmTicketBooking(e, placeId) {
        e.preventDefault();
        const place = state.places.find(p => p.id === placeId);
        if (!place) return;

        const isPackage = document.getElementById("tier_package")?.checked;
        const adults = document.getElementById("ticket-adults")?.value || 1;
        const children = document.getElementById("ticket-children")?.value || 0;
        const date = document.getElementById("ticket-visit-date")?.value;
        const slot = document.getElementById("ticket-slot")?.value;
        const name = document.getElementById("ticket-name")?.value || "Guest Traveler";
        const phone = document.getElementById("ticket-phone")?.value || "+91 98765 43210";
        const unit = isPackage ? place.tourPackagePrice : place.ticketPrice;
        const total = (parseInt(adults, 10) * unit) + Math.round(parseInt(children, 10) * unit * 0.5);
        const bookingId = "ROAV-TOUR-" + Math.floor(100000 + Math.random() * 900000);

        const content = document.getElementById("ticket-modal-content");
        if (!content) return;

        content.innerHTML = `
            <div class="roavio-eticket-card">
                <span class="roavio-eticket-badge"><i class="fa-solid fa-circle-check"></i> E-Ticket Confirmed & Verified</span>
                <h4 class="mb-1 text-dark">${place.name}</h4>
                <p class="text-muted small mb-3"><i class="fa-solid fa-location-dot text-danger"></i> ${place.city}, ${place.state}</p>

                <!-- Barcode / QR Simulation -->
                <div class="roavio-qr-box">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=ROAVIO_BOOKING_${bookingId}_${place.id}" alt="Ticket QR Code" onerror="this.src='assets/img/favicon.svg'">
                </div>
                <div class="text-primary fw-bold font-monospace mb-3">${bookingId}</div>

                <div class="roavio-eticket-details-grid">
                    <div>
                        <div class="item-label">Lead Traveler</div>
                        <div class="item-val">${name}</div>
                    </div>
                    <div>
                        <div class="item-label">Mobile Number</div>
                        <div class="item-val">${phone}</div>
                    </div>
                    <div>
                        <div class="item-label">Visit Date</div>
                        <div class="item-val">${date}</div>
                    </div>
                    <div>
                        <div class="item-label">Time Slot</div>
                        <div class="item-val">${slot}</div>
                    </div>
                    <div>
                        <div class="item-label">Guests</div>
                        <div class="item-val">${adults} Adult(s), ${children} Child(ren)</div>
                    </div>
                    <div>
                        <div class="item-label">Total Amount Paid</div>
                        <div class="item-val text-success">${total === 0 ? 'FREE ENTRY' : '₹' + total.toLocaleString()}</div>
                    </div>
                </div>

                <div class="mt-4 d-flex gap-2">
                    <button class="btn btn-outline-dark flex-fill" onclick="window.print()">
                        <i class="fa-solid fa-print me-1"></i> Print / Save Ticket PDF
                    </button>
                    <button class="btn btn-danger flex-fill" onclick="window.RoavioTours.closeModal('ticket')">
                        <i class="fa-solid fa-check me-1"></i> Done
                    </button>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // Direct Travel Booking Modals (Flight, Train, Bus, Hotel) - Requirement 4
    // =========================================================================

    function openTransport(placeId, mode) {
        const place = state.places.find(p => p.id === placeId);
        if (!place) return;

        const modal = elements.transportModal;
        if (!modal) return;

        let title = "";
        let icon = "";
        let bodyContent = "";

        if (mode === "flight") {
            title = `Book Flights to ${place.city} (${place.nearestAirport.code})`;
            icon = "fa-plane text-primary";
            bodyContent = `
                <div class="p-3 bg-light rounded-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Origin:</strong> ${state.userLocation.name}
                            <span class="mx-2">➔</span>
                            <strong>Destination:</strong> ${place.nearestAirport.name}
                        </div>
                        <span class="badge bg-primary">Daily Direct Flights</span>
                    </div>
                </div>

                <div class="list-group mb-3">
                    <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold">IndiGo 6E-2145 · Non-stop</div>
                            <div class="text-muted small">06:20 AM ➔ 08:35 AM (2h 15m) · Hand baggage + 15kg</div>
                        </div>
                        <div class="text-end">
                            <div class="fs-5 fw-bold text-danger">₹4,250</div>
                            <button class="btn btn-sm btn-danger mt-1" onclick="window.RoavioTours.confirmBookingModal('Flight IndiGo 6E-2145 to ${place.city}', '₹4,250')">Book Now</button>
                        </div>
                    </div>
                    <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold">Air India AI-804 · Non-stop</div>
                            <div class="text-muted small">09:15 AM ➔ 11:30 AM (2h 15m) · Free Hot Meal Included</div>
                        </div>
                        <div class="text-end">
                            <div class="fs-5 fw-bold text-danger">₹4,890</div>
                            <button class="btn btn-sm btn-danger mt-1" onclick="window.RoavioTours.confirmBookingModal('Flight Air India AI-804 to ${place.city}', '₹4,890')">Book Now</button>
                        </div>
                    </div>
                    <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold">Vistara UK-927 · Premium Economy</div>
                            <div class="text-muted small">04:45 PM ➔ 07:05 PM (2h 20m) · Extra Legroom</div>
                        </div>
                        <div class="text-end">
                            <div class="fs-5 fw-bold text-danger">₹5,400</div>
                            <button class="btn btn-sm btn-danger mt-1" onclick="window.RoavioTours.confirmBookingModal('Flight Vistara UK-927 to ${place.city}', '₹5,400')">Book Now</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (mode === "train") {
            title = `IRCTC Trains to ${place.nearestTrain.name} (${place.nearestTrain.code})`;
            icon = "fa-train text-warning";
            bodyContent = `
                <div class="p-3 bg-light rounded-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Nearest Railway Station:</strong> ${place.nearestTrain.name} (${place.nearestTrain.dist} to site)
                        </div>
                        <span class="badge bg-success">Confirmed Seat Guarantee</span>
                    </div>
                </div>

                <div class="list-group mb-3">
                    <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold text-dark">🚆 Vande Bharat Express (20172 / 20635)</div>
                            <div class="text-muted small">Departure: 06:00 AM · Superfast Semi-High Speed · CC / EC Available</div>
                        </div>
                        <div class="text-end">
                            <div class="fs-5 fw-bold text-danger">₹865 <small class="fs-6 text-muted">CC</small></div>
                            <button class="btn btn-sm btn-danger mt-1" onclick="window.RoavioTours.confirmBookingModal('Vande Bharat Express to ${place.nearestTrain.code}', '₹865')">Book Ticket</button>
                        </div>
                    </div>
                    <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold text-dark">🚆 Shatabdi / Rajdhani Express (12002)</div>
                            <div class="text-muted small">Departure: 06:15 AM · On-board Food & Bedding Included · 1A / 2A / 3A</div>
                        </div>
                        <div class="text-end">
                            <div class="fs-5 fw-bold text-danger">₹1,450 <small class="fs-6 text-muted">2A</small></div>
                            <button class="btn btn-sm btn-danger mt-1" onclick="window.RoavioTours.confirmBookingModal('Rajdhani/Shatabdi Express to ${place.nearestTrain.code}', '₹1,450')">Book Ticket</button>
                        </div>
                    </div>
                    <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold text-dark">🚆 Superfast Express (12280)</div>
                            <div class="text-muted small">Daily Overnight Express · Sleeper & 3AC Available</div>
                        </div>
                        <div class="text-end">
                            <div class="fs-5 fw-bold text-danger">₹480 <small class="fs-6 text-muted">SL</small></div>
                            <button class="btn btn-sm btn-danger mt-1" onclick="window.RoavioTours.confirmBookingModal('Superfast Express to ${place.nearestTrain.code}', '₹480')">Book Ticket</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (mode === "bus") {
            title = `AC Sleeper & Volvo Buses to ${place.city}`;
            icon = "fa-bus text-success";
            bodyContent = `
                <div class="p-3 bg-light rounded-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Arrival Terminal:</strong> ${place.nearestBus.terminal} (${place.nearestBus.dist} away)
                        </div>
                        <span class="badge bg-success">Live GPS Tracking</span>
                    </div>
                </div>

                <div class="list-group mb-3">
                    <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold text-dark">🚌 Zingbus Luxury Volvo 9600 AC Multi-Axle</div>
                            <div class="text-muted small">Dep: 09:30 PM ➔ 06:00 AM · Individual TV, Water Bottle, Blanket</div>
                        </div>
                        <div class="text-end">
                            <div class="fs-5 fw-bold text-danger">₹1,150</div>
                            <button class="btn btn-sm btn-danger mt-1" onclick="window.RoavioTours.confirmBookingModal('Zingbus Volvo AC to ${place.city}', '₹1,150')">Select Seat</button>
                        </div>
                    </div>
                    <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold text-dark">🚌 IntrCity SmartBus AC Sleeper (2+1)</div>
                            <div class="text-muted small">Dep: 10:45 PM ➔ 07:15 AM · Private Cabin, Wi-Fi, Charging Point</div>
                        </div>
                        <div class="text-end">
                            <div class="fs-5 fw-bold text-danger">₹1,299</div>
                            <button class="btn btn-sm btn-danger mt-1" onclick="window.RoavioTours.confirmBookingModal('IntrCity SmartBus to ${place.city}', '₹1,299')">Select Seat</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (mode === "hotel") {
            title = `Top Rated Hotels in ${place.city} (${place.state})`;
            icon = "fa-hotel text-info";
            bodyContent = `
                <div class="p-3 bg-light rounded-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Stay near:</strong> ${place.name}
                        </div>
                        <span class="badge bg-primary">Free Cancellation & Breakfast</span>
                    </div>
                </div>

                <div class="list-group mb-3">
                    <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold text-dark">🏨 ${place.recommendedHotel.name} ★★★★★</div>
                            <div class="text-muted small">Monument View Room · Free Breakfast & Swimming Pool · Rating 4.9</div>
                        </div>
                        <div class="text-end">
                            <div class="fs-5 fw-bold text-danger">₹${place.recommendedHotel.price.toLocaleString()} <small class="fs-6 text-muted">/ night</small></div>
                            <button class="btn btn-sm btn-danger mt-1" onclick="window.RoavioTours.confirmBookingModal('${place.recommendedHotel.name}', '₹${place.recommendedHotel.price.toLocaleString()}')">Book Room</button>
                        </div>
                    </div>
                    <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold text-dark">🏨 Roavio Boutique Heritage Haveli / Resort ★★★★</div>
                            <div class="text-muted small">Courtyard View · Free Wi-Fi · 5 min walking distance from ${place.name}</div>
                        </div>
                        <div class="text-end">
                            <div class="fs-5 fw-bold text-danger">₹3,450 <small class="fs-6 text-muted">/ night</small></div>
                            <button class="btn btn-sm btn-danger mt-1" onclick="window.RoavioTours.confirmBookingModal('Roavio Boutique Heritage Resort ${place.city}', '₹3,450')">Book Room</button>
                        </div>
                    </div>
                </div>
            `;
        }

        modal.innerHTML = `
            <div class="roavio-modal-dialog">
                <div class="roavio-modal-header">
                    <h4 class="roavio-modal-title">
                        <i class="fa-solid ${icon}"></i>
                        <span>${title}</span>
                    </h4>
                    <button type="button" class="roavio-modal-close" onclick="window.RoavioTours.closeModal('transport')">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="roavio-modal-body" id="transport-modal-body">
                    ${bodyContent}
                </div>
            </div>
        `;

        modal.classList.add("active");
    }

    function confirmBookingModal(itemName, price) {
        const pnr = "ROAV-" + Math.floor(100000 + Math.random() * 900000);
        const body = document.getElementById("transport-modal-body");
        if (!body) return;

        body.innerHTML = `
            <div class="roavio-eticket-card">
                <span class="roavio-eticket-badge"><i class="fa-solid fa-circle-check"></i> Booking Confirmed!</span>
                <h4 class="text-dark mb-1">${itemName}</h4>
                <p class="text-muted small mb-3">Booking Reference PNR: <strong class="text-primary font-monospace">${pnr}</strong></p>

                <div class="roavio-qr-box">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=ROAVIO_${pnr}" alt="PNR QR Code" onerror="this.src='assets/img/favicon.svg'">
                </div>

                <div class="alert alert-success mt-3 py-2">
                    <i class="fa-solid fa-envelope-circle-check me-2"></i> SMS and WhatsApp confirmation sent with ticket invoice (${price}).
                </div>

                <button class="btn btn-danger w-100 mt-2 py-2" onclick="window.RoavioTours.closeModal('transport')">
                    Done
                </button>
            </div>
        `;
    }

    function closeModal(type) {
        if (type === "ticket" && elements.ticketModal) {
            elements.ticketModal.classList.remove("active");
        } else if (type === "transport" && elements.transportModal) {
            elements.transportModal.classList.remove("active");
        }
    }

    function bindGlobalModals() {
        window.addEventListener("click", (e) => {
            if (e.target === elements.ticketModal) closeModal("ticket");
            if (e.target === elements.transportModal) closeModal("transport");
        });
    }

    
    function toggleExpand(forceExpand) {
        if (typeof forceExpand === "boolean") {
            state.isExpanded = forceExpand;
        } else {
            state.isExpanded = !state.isExpanded;
        }
        renderToursGrid();

        if (state.isExpanded) {
            const grid = document.getElementById("roavio-tours-grid");
            if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            const section = document.getElementById("roavio-tours-section");
            if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function resetFilters() {
        state.selectedState = "All States";
        state.selectedCategory = "all";
        state.searchQuery = "";
        state.sortBy = "popular";

        if (elements.stateSelect) elements.stateSelect.value = "All States";
        if (elements.searchInput) elements.searchInput.value = "";
        if (elements.sortSelect) elements.sortSelect.value = "popular";

        document.querySelectorAll(".roavio-cat-pill").forEach(p => {
            p.classList.toggle("active", p.dataset.cat === "all");
        });

        applyFilters();
    }

    // Public API on window
    window.RoavioTours = {
        init,
        applyFilters,
        renderToursGrid,
        focusOnMap,
        openTicketBooking,
        updateTicketPrice,
        confirmTicketBooking,
        openTransport,
        confirmBookingModal,
        closeModal,
        resetFilters,
        toggleExpand,
        detectUserLiveLocation
    };

    // Auto-init on DOMContentLoaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
