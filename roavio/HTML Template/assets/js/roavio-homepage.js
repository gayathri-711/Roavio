/**
 * Roavio Homepage Interactive Controls
 * 1. Hero Dual Mode Switch (Book Tickets vs Explore Tourist Places)
 * 2. Floating Showcase Quick Select (Redirects to tours.html)
 * 3. 24x7 Contact Inquiry Form Handler
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Mode Switcher
    const modeBookBtn = document.getElementById('roavio-mode-book-btn');
    const modeExploreBtn = document.getElementById('roavio-mode-explore-btn');
    const ticketSearchCard = document.getElementById('roavio-ticket-search-card');
    const exploreSearchCard = document.getElementById('roavio-explore-search-card');

    if (modeBookBtn && modeExploreBtn && ticketSearchCard && exploreSearchCard) {
        modeBookBtn.addEventListener('click', () => {
            modeBookBtn.classList.add('active');
            modeExploreBtn.classList.remove('active');
            ticketSearchCard.style.display = 'block';
            exploreSearchCard.style.display = 'none';
        });

        modeExploreBtn.addEventListener('click', () => {
            modeExploreBtn.classList.add('active');
            modeBookBtn.classList.remove('active');
            exploreSearchCard.style.display = 'block';
            ticketSearchCard.style.display = 'none';
        });
    }

    // 2. Instant Tourist Places Search & Display on Homepage
    const heroExploreForm = document.getElementById('roavio-hero-explore-form');
    const heroStateSelect = document.getElementById('hero-explore-state');
    const heroCatSelect = document.getElementById('hero-explore-cat');
    const heroPlaceInput = document.getElementById('hero-explore-place');

    function smoothScrollWithHeaderOffset(element, offset = 95) {
        if (!element) return;
        const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    function isHomeMatch(item, query, normQuery) {
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

    function searchTouristPlacesOnHome(overrideState) {
        const placeQuery = (heroPlaceInput ? heroPlaceInput.value.trim() : '').toLowerCase();
        let stateQuery = overrideState !== undefined ? overrideState : (heroStateSelect ? heroStateSelect.value : 'All States');
        const catQuery = heroCatSelect ? heroCatSelect.value : 'all';

        const resultsSection = document.getElementById('roavio-search-results-section');
        const resultsContainer = document.getElementById('roavio-results-list');
        const headingEl = document.getElementById('roavio-results-heading');
        const metaEl = document.getElementById('roavio-results-meta');
        const catIcon = document.getElementById('roavio-cat-icon');

        if (!resultsSection || !resultsContainer || typeof INDIA_TOURIST_DESTINATIONS === 'undefined') {
            navigateToTours(overrideState);
            return;
        }

        let list = [...INDIA_TOURIST_DESTINATIONS];
        const normQuery = placeQuery.replace(/[-_]/g, ' ');

        // Smart Cross-State & Category Match:
        // If a query is entered and does not match the currently selected state, auto-broaden to all states!
        if (placeQuery && stateQuery && stateQuery !== 'All States') {
            const matchesInState = list.some(item =>
                item.state.toLowerCase() === stateQuery.toLowerCase() &&
                isHomeMatch(item, placeQuery, normQuery)
            );
            if (!matchesInState) {
                const matchesAnywhere = list.some(item => isHomeMatch(item, placeQuery, normQuery));
                if (matchesAnywhere) {
                    stateQuery = 'All States';
                    if (heroStateSelect) heroStateSelect.value = 'All States';
                }
            }
        }

        if (stateQuery && stateQuery !== 'All States') {
            list = list.filter(item => item.state.toLowerCase() === stateQuery.toLowerCase());
        }

        if (catQuery && catQuery !== 'all') {
            const catMatches = list.filter(item => item.category === catQuery);
            if (catMatches.length > 0 || !placeQuery) list = catMatches;
        }

        if (placeQuery) {
            list = list.filter(item => isHomeMatch(item, placeQuery, normQuery));
        }

        // Show Results Section on Home
        resultsSection.style.display = 'block';
        if (catIcon) catIcon.className = 'fa-solid fa-compass';

        let titleText = 'All Indian Tourist Destinations';
        if (placeQuery && stateQuery !== 'All States') {
            titleText = `Tourist Places in ${stateQuery} matching "${placeQuery}"`;
        } else if (placeQuery) {
            titleText = `Tourist Places matching "${placeQuery}"`;
        } else if (stateQuery !== 'All States') {
            titleText = `Tourist Places in ${stateQuery}`;
        }
        if (headingEl) headingEl.textContent = `🏛️ ${titleText} (${list.length} Found)`;
        if (metaEl) metaEl.textContent = `Verified official monument entry passes, guided tour packages, and live distance calculations`;

        if (list.length === 0) {
            resultsContainer.innerHTML = `
                <div class="col-12 text-center py-5 bg-white rounded-4 shadow-sm my-3 p-4">
                    <div style="font-size: 3rem; margin-bottom: 12px;">🗺️</div>
                    <h4 class="fw-bold text-dark">No tourist places found matching "${placeQuery || stateQuery}"</h4>
                    <p class="text-muted">Try searching for popular destinations like Taj Mahal, Munnar, Goa, Solang, Delhi, or select another state.</p>
                    <a href="tours.html" class="btn btn-danger mt-2 px-4 py-2 fw-bold text-white">Browse All 175+ Destinations Across India</a>
                </div>
            `;
            smoothScrollWithHeaderOffset(resultsSection, 95);
            return;
        }

        const cardsHtml = list.map(place => {
            const dist = typeof calculateDistanceKm === 'function' ? calculateDistanceKm(28.6139, 77.2090, place.lat, place.lng) : 210;
            return `
            <div class="roavio-tour-card my-3" data-id="${place.id}">
                <div class="roavio-card-media">
                    <img src="${place.image}" alt="${place.name}" loading="lazy" onerror="this.src='assets/img/home-1/tour/tour-1.jpg'">
                    <span class="roavio-card-badge">${place.badge}</span>
                    <div class="roavio-card-distance">
                        <i class="fa-solid fa-location-arrow"></i>
                        <span>${dist.toLocaleString()} km from Delhi</span>
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
                        ${place.highlights.slice(0, 3).map(h => `<span class="roavio-high-chip">✓ ${h}</span>`).join('')}
                    </div>

                    <div class="roavio-pricing-row">
                        <div class="roavio-price-block">
                            <span class="price-label">Entry Pass</span>
                            <span class="price-val">${place.ticketPrice === 0 ? 'Free Entry' : '₹' + place.ticketPrice.toLocaleString()}</span>
                            <span class="price-sub">per person</span>
                        </div>
                        <div class="roavio-price-block text-end">
                            <span class="price-label">Full Day Tour</span>
                            <span class="price-val" style="color: #0284c7;">₹${place.tourPackagePrice.toLocaleString()}</span>
                            <span class="price-sub">guide + entry pass</span>
                        </div>
                    </div>

                    <div class="roavio-card-actions">
                        <button type="button" class="roavio-book-entry-btn" onclick="openTouristPassModal('${place.id}')">
                            <i class="fa-solid fa-ticket"></i>
                            <span>Book Entry Pass</span>
                        </button>
                        <a href="tours.html?q=${encodeURIComponent(place.name)}#roavio-tour-map-section" class="roavio-view-map-btn text-decoration-none">
                            <i class="fa-solid fa-map-location-dot"></i>
                            <span>View Live Route on Map</span>
                        </a>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        const moreBannerHtml = `
            <div class="text-center mt-4 p-4 rounded-4" style="background: linear-gradient(135deg, #09121f 0%, #1e293b 100%); color: white;">
                <h4 class="fw-bold mb-2 text-white">Looking for the full interactive route map and all 175+ Indian destinations?</h4>
                <p class="text-white-50 mb-3 small">Check live GPS tracking from your real location, estimated transit times, nearest railway hubs & airports.</p>
                <a href="tours.html?q=${encodeURIComponent(placeQuery)}&state=${encodeURIComponent(stateQuery !== 'All States' ? stateQuery : '')}" class="btn btn-danger px-4 py-2 fw-bold text-white">
                    <i class="fa-solid fa-compass me-2"></i> Open Dedicated Tours & Live Map Page →
                </a>
            </div>
        `;

        resultsContainer.innerHTML = cardsHtml + moreBannerHtml;
        smoothScrollWithHeaderOffset(resultsSection, 95);
    }

    function navigateToTours(overrideState) {
        const placeQuery = heroPlaceInput ? heroPlaceInput.value.trim() : '';
        const stateQuery = overrideState !== undefined ? overrideState : (heroStateSelect ? heroStateSelect.value : 'All States');
        const catQuery = heroCatSelect ? heroCatSelect.value : 'all';

        const params = new URLSearchParams();
        if (placeQuery) params.set('q', placeQuery);
        if (stateQuery && stateQuery !== 'All States') params.set('state', stateQuery);
        if (catQuery && catQuery !== 'all') params.set('cat', catQuery);

        const targetUrl = 'tours.html' + (params.toString() ? '?' + params.toString() : '');
        window.location.href = targetUrl;
    }

    if (heroStateSelect) {
        if (typeof $ !== 'undefined' && $.fn.niceSelect) {
            try { $(heroStateSelect).niceSelect('destroy'); } catch (err) {}
        }
        heroStateSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            searchTouristPlacesOnHome(val);
        });
    }

    if (heroCatSelect) {
        if (typeof $ !== 'undefined' && $.fn.niceSelect) {
            try { $(heroCatSelect).niceSelect('destroy'); } catch (err) {}
        }
        heroCatSelect.addEventListener('change', () => {
            searchTouristPlacesOnHome();
        });
    }

    if (heroExploreForm) {
        heroExploreForm.addEventListener('submit', (e) => {
            e.preventDefault();
            searchTouristPlacesOnHome();
        });
    }

    if (heroPlaceInput) {
        heroPlaceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchTouristPlacesOnHome();
            }
        });
    }

    // 3. Contact Form Submission
    const contactForm = document.getElementById('roavio-contact-form');
    const contactSuccessBox = document.getElementById('roavio-contact-success-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name')?.value || 'Traveler';
            const phone = document.getElementById('contact-phone')?.value || '';
            const dest = document.getElementById('contact-destination')?.value || 'your selected destination';

            if (contactSuccessBox) {
                contactSuccessBox.innerHTML = `
                    <div class="alert alert-success mt-3 p-3">
                        <h5 class="fw-bold mb-1"><i class="fa-solid fa-circle-check me-2"></i> Inquiry Received, ${name}!</h5>
                        <p class="small mb-0">Our senior travel specialist will call/WhatsApp you at <strong>${phone}</strong> within 15 minutes with a custom itinerary & best rates for <strong>${dest}</strong>.</p>
                    </div>
                `;
                contactForm.reset();
            }
        });
    }
});

// Quick shortcut to jump to a floating place on tours.html
window.selectFloatingDestination = function (placeId) {
    window.location.href = `tours.html?q=${encodeURIComponent(placeId)}`;
};

// Modal opener for tourist pass booking from home page
window.openTouristPassModal = function (placeId) {
    if (typeof INDIA_TOURIST_DESTINATIONS === 'undefined') return;
    const place = INDIA_TOURIST_DESTINATIONS.find(p => p.id === placeId);
    if (!place) return;

    const modal = document.getElementById('roavio-booking-modal');
    const modalItem = document.getElementById('roavio-modal-item-name');
    const modalRoute = document.getElementById('roavio-modal-route');
    const modalPrice = document.getElementById('roavio-modal-price');

    if (modalItem) modalItem.textContent = `${place.name} (Official Entry Ticket)`;
    if (modalRoute) modalRoute.textContent = `${place.city}, ${place.state} · ${place.categoryName}`;
    if (modalPrice) modalPrice.textContent = place.ticketPrice === 0 ? 'Free Entry Pass' : `₹${place.ticketPrice}`;

    if (modal) modal.classList.add('active');
};
