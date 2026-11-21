/**
 * Roavio Dynamic Travel & Search Engine
 * Handles Flights, Hotels, Holidays, Trains, Buses, and Cabs search results & booking
 */

document.addEventListener('DOMContentLoaded', () => {
  function smoothScrollToTarget(targetEl, offset = 95) {
    if (!targetEl) return;
    const y = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  // 1. Ensure Background Video Autoplays
  const bgVideo = document.querySelector('.yatra-bg-video');
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.play().catch(() => {});
  }

  // 2. State & Datasets
  let currentCategory = 'tours';
  let currentSort = 'all';

  const mockData = {
    flights: [
      {
        id: 'FL-6E2054',
        name: 'IndiGo 6E-2054',
        icon: 'fa-solid fa-plane',
        color: '#008cff',
        depTime: '06:15',
        depCode: 'DEL (New Delhi)',
        arrTime: '08:30',
        arrCode: 'BOM (Mumbai)',
        durTime: '2h 15m',
        stops: 'Non-stop',
        price: '₹4,250',
        slashed: '₹5,499',
        perks: ['Cabin 7kg', 'Check-in 15kg', 'On-time Guarantee', 'Flat ₹500 off code ROAVIOFLY'],
        sortPrice: 4250,
        sortDuration: 135,
        rating: 4.8
      },
      {
        id: 'FL-AI805',
        name: 'Air India AI-805',
        icon: 'fa-solid fa-plane-departure',
        color: '#ea2330',
        depTime: '08:45',
        depCode: 'DEL (New Delhi)',
        arrTime: '11:00',
        arrCode: 'BOM (Mumbai)',
        durTime: '2h 15m',
        stops: 'Non-stop',
        price: '₹4,890',
        slashed: '₹6,200',
        perks: ['Complimentary Hot Meal', '25kg Baggage Included', 'Extra Legroom', 'Star Alliance'],
        sortPrice: 4890,
        sortDuration: 135,
        rating: 4.9
      },
      {
        id: 'FL-UK995',
        name: 'Vistara UK-995',
        icon: 'fa-solid fa-plane-up',
        color: '#6b21a8',
        depTime: '10:20',
        depCode: 'DEL (New Delhi)',
        arrTime: '12:35',
        arrCode: 'BOM (Mumbai)',
        durTime: '2h 15m',
        stops: 'Non-stop',
        price: '₹5,350',
        slashed: '₹6,800',
        perks: ['Gourmet Meals by Chef', 'In-flight Entertainment', 'Club Vistara Points'],
        sortPrice: 5350,
        sortDuration: 135,
        rating: 4.9
      },
      {
        id: 'FL-QP1382',
        name: 'Akasa Air QP-1382',
        icon: 'fa-solid fa-plane',
        color: '#ff6d38',
        depTime: '15:40',
        depCode: 'DEL (New Delhi)',
        arrTime: '18:00',
        arrCode: 'BOM (Mumbai)',
        durTime: '2h 20m',
        stops: 'Non-stop',
        price: '₹3,999',
        slashed: '₹5,199',
        perks: ['Lowest Fare Today', 'USB Fast Charging', 'Cafe Akasa Menu'],
        sortPrice: 3999,
        sortDuration: 140,
        rating: 4.7
      },
      {
        id: 'FL-SG8169',
        name: 'SpiceJet SG-8169',
        icon: 'fa-solid fa-plane-arrival',
        color: '#dc2626',
        depTime: '19:10',
        depCode: 'DEL (New Delhi)',
        arrTime: '21:30',
        arrCode: 'BOM (Mumbai)',
        durTime: '2h 20m',
        stops: 'Non-stop',
        price: '₹4,120',
        slashed: '₹5,300',
        perks: ['Hot Beverage Included', 'SpiceMax Available', 'Zero Rescheduling Option'],
        sortPrice: 4120,
        sortDuration: 140,
        rating: 4.6
      }
    ],

    hotels: [
      {
        id: 'HT-HYATT',
        name: 'Grand Hyatt Goa Resort & Spa',
        icon: 'fa-solid fa-hotel',
        color: '#ea2330',
        depTime: 'Check-in: 14:00',
        depCode: 'Bambolim Bay, North Goa',
        arrTime: 'Check-out: 12:00',
        arrCode: 'Private Beach Access',
        durTime: '5-Star Luxury',
        stops: '★ 4.9 (2,450 Reviews)',
        price: '₹6,850',
        slashed: '₹9,500',
        perks: ['Free Breakfast', 'Free High-speed WiFi', 'Outdoor Lagoon Pool', 'Free Cancellation up to 24 hrs'],
        sortPrice: 6850,
        sortDuration: 1,
        rating: 4.9
      },
      {
        id: 'HT-TAJ',
        name: 'Taj Exotica Resort & Spa',
        icon: 'fa-solid fa-hotel',
        color: '#b06000',
        depTime: 'Check-in: 14:00',
        depCode: 'Benaulim, South Goa',
        arrTime: 'Check-out: 12:00',
        arrCode: '56 Acres Mediterranean Estate',
        durTime: '5-Star Deluxe',
        stops: '★ 5.0 (3,120 Reviews)',
        price: '₹11,400',
        slashed: '₹15,000',
        perks: ['Private Beach Front', 'Jiva Spa Sanctuary', 'Golf & Tennis Courts', 'Welcome Drink on Arrival'],
        sortPrice: 11400,
        sortDuration: 2,
        rating: 5.0
      },
      {
        id: 'HT-RADISSON',
        name: 'Radisson Blu Resort Cavelossim Beach',
        icon: 'fa-solid fa-hotel',
        color: '#008cff',
        depTime: 'Check-in: 15:00',
        depCode: 'Cavelossim, South Goa',
        arrTime: 'Check-out: 11:00',
        arrCode: 'Near Mobor Beach',
        durTime: '4-Star Premium',
        stops: '★ 4.7 (1,890 Reviews)',
        price: '₹4,999',
        slashed: '₹7,200',
        perks: ['Swimming Pool & Bar', 'Buffet Breakfast Included', 'Spa & Fitness Center'],
        sortPrice: 4999,
        sortDuration: 3,
        rating: 4.7
      },
      {
        id: 'HT-LEELA',
        name: 'The Leela Palace Heritage Lake Pichola',
        icon: 'fa-solid fa-hotel',
        color: '#7c3aed',
        depTime: 'Check-in: 14:00',
        depCode: 'Udaipur, Rajasthan',
        arrTime: 'Check-out: 12:00',
        arrCode: 'Royal Lake View Suite',
        durTime: 'Palatial 5-Star',
        stops: '★ 5.0 (4,200 Reviews)',
        price: '₹14,200',
        slashed: '₹19,000',
        perks: ['Private Boat Arrival', 'Butler Service', 'Royal Rajasthani Thali', 'Heritage Walk'],
        sortPrice: 14200,
        sortDuration: 4,
        rating: 5.0
      }
    ],

    trains: [
      {
        id: 'TR-22436',
        name: 'Vande Bharat Express (22436)',
        icon: 'fa-solid fa-train',
        color: '#0284c7',
        depTime: '06:00',
        depCode: 'NDLS (New Delhi)',
        arrTime: '14:00',
        arrCode: 'BSB (Varanasi Jn)',
        durTime: '8h 00m',
        stops: 'Semi High Speed · 4 Stops',
        price: '₹1,750',
        slashed: '₹2,100',
        perks: ['Chair Car (CC) Available (42)', 'Executive Class (EC) Available (12)', 'Complimentary Breakfast & Lunch', 'Free Wi-Fi Infotainment'],
        sortPrice: 1750,
        sortDuration: 480,
        rating: 4.9
      },
      {
        id: 'TR-12002',
        name: 'Bhopal Shatabdi Express (12002)',
        icon: 'fa-solid fa-train-subway',
        color: '#ea580c',
        depTime: '06:15',
        depCode: 'NDLS (New Delhi)',
        arrTime: '07:55',
        arrCode: 'AGC (Agra Cantt)',
        durTime: '1h 40m',
        stops: 'Superfast · Non-stop to Agra',
        price: '₹755',
        slashed: '₹950',
        perks: ['Confirmed Seat Guarantee', 'Food Included', 'AC Chair Car', 'Clean Restrooms'],
        sortPrice: 755,
        sortDuration: 100,
        rating: 4.8
      },
      {
        id: 'TR-12952',
        name: 'Mumbai Rajdhani Express (12952)',
        icon: 'fa-solid fa-train',
        color: '#b91c1c',
        depTime: '16:55',
        depCode: 'NDLS (New Delhi)',
        arrTime: '08:35',
        arrCode: 'MMCT (Mumbai Central)',
        durTime: '15h 40m',
        stops: 'Overnight Superfast · 5 Stops',
        price: '₹2,890',
        slashed: '₹3,400',
        perks: ['2AC / 3AC Available', 'Fresh Bedding & Gourmet Meals', 'Priority IRCTC Partner'],
        sortPrice: 2890,
        sortDuration: 940,
        rating: 4.9
      }
    ],

    buses: [
      {
        id: 'BS-ZING',
        name: 'Zingbus Electric & Volvo 9600 Multi-Axle',
        icon: 'fa-solid fa-bus',
        color: '#16a34a',
        depTime: '21:00',
        depCode: 'Bengaluru (Majestic / Madiwala)',
        arrTime: '06:00',
        arrCode: 'Ooty (Central Bus Stand)',
        durTime: '9h 00m',
        stops: 'AC Sleeper (2+1)',
        price: '₹1,150',
        slashed: '₹1,600',
        perks: ['Zero Emissions Electric / Volvo', 'Individual TV & USB Ports', 'Emergency SOS & GPS', 'Clean Blanket & Pillow'],
        sortPrice: 1150,
        sortDuration: 540,
        rating: 4.8
      },
      {
        id: 'BS-INTRCITY',
        name: 'IntrCity SmartBus AC Sleeper (2+1)',
        icon: 'fa-solid fa-bus',
        color: '#e11d48',
        depTime: '22:15',
        depCode: 'Bengaluru (Kalasipalyam)',
        arrTime: '07:30',
        arrCode: 'Ooty (Charring Cross)',
        durTime: '9h 15m',
        stops: 'AC Sleeper With Curtains',
        price: '₹1,299',
        slashed: '₹1,750',
        perks: ['In-bus Washroom', 'SmartBoarding Crew', 'Mineral Water & Snacks', 'High-speed Wi-Fi'],
        sortPrice: 1299,
        sortDuration: 555,
        rating: 4.9
      }
    ],

    holidays: [
      {
        id: 'PKG-BALI',
        name: 'Exotic Bali with Nusa Penida & Private Villa',
        icon: 'fa-solid fa-umbrella-beach',
        color: '#e53935',
        depTime: '4 Nights / 5 Days',
        depCode: 'Flights Included from DEL/BOM',
        arrTime: 'Daily Departures',
        arrCode: 'Bali, Indonesia',
        durTime: 'All-Inclusive',
        stops: '★ 4.9 (1,840 Travelers)',
        price: '₹42,999',
        slashed: '₹58,000',
        perks: ['Return Flights', 'Private Pool Villa 4★', 'Nusa Penida Speedboat', 'Kintamani Volcano & Swings'],
        sortPrice: 42999,
        sortDuration: 5,
        rating: 4.9
      },
      {
        id: 'PKG-KERALA',
        name: 'Munnar & Alleppey Houseboat Escapade',
        icon: 'fa-solid fa-umbrella-beach',
        color: '#0284c7',
        depTime: '5 Nights / 6 Days',
        depCode: 'Cochin - Munnar - Thekkady - Alleppey',
        arrTime: 'Private Sedan Transfer',
        arrCode: 'Kerala, India',
        durTime: 'Curated Holiday',
        stops: '★ 4.9 (2,900 Travelers)',
        price: '₹19,499',
        slashed: '₹26,000',
        perks: ['Luxury Houseboat Cruise', 'All Meals in Alleppey', 'Tea Plantation Walking Tour', 'Spice Garden Pass'],
        sortPrice: 19499,
        sortDuration: 6,
        rating: 4.9
      }
    ],

    cabs: [
      {
        id: 'CB-SEDAN',
        name: 'Roavio Verified Sedan (Dzire / Etios)',
        icon: 'fa-solid fa-taxi',
        color: '#ea580c',
        depTime: 'Instant / Pre-scheduled',
        depCode: 'Delhi Airport / City',
        arrTime: 'Express Highway',
        arrCode: 'Agra (Taj Mahal Drop)',
        durTime: '3h 30m (210 km)',
        stops: 'Toll & State Tax Included',
        price: '₹2,850',
        slashed: '₹3,500',
        perks: ['Clean Sanitized AC Car', 'Chauffeur in Uniform', 'Yamuna Expressway Express', 'Free Cancellation up to 1 hr'],
        sortPrice: 2850,
        sortDuration: 210,
        rating: 4.8
      }
    ]
  };

  // 3. Category Tab Metadata Configurations
  const tabConfigs = {
    tours: {
      fromLabel: 'SEARCH TOURIST DESTINATION',
      fromCity: 'Taj Mahal / Munnar / Solang',
      fromSub: 'Search across 175+ iconic tourist places',
      toLabel: 'FILTER BY STATE',
      toCity: 'All States / Rajasthan / Kerala',
      toSub: 'Explore places by Indian state',
      dateLabel: 'TRAVEL DATE',
      travellersLabel: 'EXPERIENCE TYPE',
      travellersVal: 'All Experiences',
      travellersSub: 'Heritage, Hills, Beaches, Adventure',
      btnText: 'Explore India Tours',
      showSwap: false
    },
    flights: {
      fromLabel: 'DEPART FROM',
      fromCity: 'New Delhi',
      fromSub: 'DEL, Indira Gandhi International',
      toLabel: 'GOING TO',
      toCity: 'Mumbai',
      toSub: 'BOM, Chhatrapati Shivaji Maharaj',
      dateLabel: 'DEPARTURE DATE',
      travellersLabel: 'TRAVELLER(S), CLASS',
      travellersVal: '1 Traveller',
      travellersSub: 'Economy',
      btnText: 'Search Flights',
      showSwap: true
    },
    hotels: {
      fromLabel: 'CITY, LOCATION OR HOTEL',
      fromCity: 'Goa, India',
      fromSub: 'North Goa, South Goa, Calangute',
      toLabel: 'ROOM TYPE',
      toCity: 'Resorts & Villas',
      toSub: '5-Star Beachfront & Haveli',
      dateLabel: 'CHECK-IN DATE',
      travellersLabel: 'GUESTS & ROOMS',
      travellersVal: '2 Guests, 1 Room',
      travellersSub: 'Couples / Family Special',
      btnText: 'Search Hotels',
      showSwap: false
    },
    trains: {
      fromLabel: 'FROM STATION',
      fromCity: 'New Delhi (NDLS)',
      fromSub: 'New Delhi Railway Station',
      toLabel: 'TO STATION',
      toCity: 'Varanasi (BSB)',
      toSub: 'Varanasi Junction / Agra Cantt',
      dateLabel: 'JOURNEY DATE',
      travellersLabel: 'CLASS & QUOTA',
      travellersVal: 'All Classes (CC / 2A / 3A)',
      travellersSub: 'General Quota',
      btnText: 'Search Trains',
      showSwap: true
    },
    buses: {
      fromLabel: 'BOARDING FROM',
      fromCity: 'Bengaluru',
      fromSub: 'Majestic / Anand Rao Circle',
      toLabel: 'DROPPING AT',
      toCity: 'Ooty / Manali / Goa',
      toSub: 'Central Bus Terminal',
      dateLabel: 'TRAVEL DATE',
      travellersLabel: 'BUS TYPE',
      travellersVal: 'Volvo Multi-Axle AC Sleeper',
      travellersSub: 'Individual TV & Blanket',
      btnText: 'Search Buses',
      showSwap: true
    },
    map: {
      fromLabel: 'YOUR LIVE GPS LOCATION',
      fromCity: 'Auto-Detected GPS',
      fromSub: 'Latitude & Longitude',
      toLabel: 'SELECTED DESTINATION',
      toCity: 'Tourist Place across India',
      toSub: 'Real-time Route & Distance',
      dateLabel: 'ROUTE CALCULATION',
      travellersLabel: 'ESTIMATED TIMES',
      travellersVal: 'Flight / Train / Drive',
      travellersSub: 'Turn-by-turn Google Maps',
      btnText: 'View Live Route Map',
      showSwap: false
    }
  };

  const catTabs = document.querySelectorAll('.yatra-cat-tab');
  const fromLabel = document.getElementById('yatra-from-label');
  const fromCity = document.getElementById('yatra-from-city');
  const fromSub = document.getElementById('yatra-from-sub');
  const toLabel = document.getElementById('yatra-to-label');
  const toCity = document.getElementById('yatra-to-city');
  const toSub = document.getElementById('yatra-to-sub');
  const dateLabel = document.getElementById('yatra-date-label');
  const travellersLabel = document.getElementById('yatra-travellers-label');
  const travellersVal = document.getElementById('yatra-travellers-val');
  const travellersSub = document.getElementById('yatra-travellers-sub');
  const searchBtnText = document.getElementById('yatra-search-text');
  const swapBtn = document.getElementById('yatra-swap-btn');
  const returnDate = document.getElementById('yatra-return-date');
  const returnSub = document.getElementById('yatra-return-sub');

  // 4. Render Dynamic Results for Transport
  const resultsContainer = document.getElementById('roavio-results-list');
  const resultsHeaderTitle = document.getElementById('roavio-results-heading');
  const resultsHeaderMeta = document.getElementById('roavio-results-meta');
  const resultsCatIcon = document.getElementById('roavio-cat-icon');

  function renderResults(category, sortMode) {
    if (!resultsContainer) return;
    if (category === 'tours' || category === 'map') return;

    let items = [...(mockData[category] || mockData.flights)];

    if (sortMode === 'cheapest') {
      items.sort((a, b) => a.sortPrice - b.sortPrice);
    } else if (sortMode === 'fastest') {
      items.sort((a, b) => a.sortDuration - b.sortDuration);
    } else if (sortMode === 'top-rated') {
      items.sort((a, b) => b.rating - a.rating);
    }

    const curFrom = fromCity ? fromCity.textContent.trim() : 'New Delhi';
    const curTo = toCity ? toCity.textContent.trim() : 'Mumbai';

    // Set header
    if (category === 'flights') {
      if (resultsHeaderTitle) resultsHeaderTitle.textContent = `✈️ Flights from ${curFrom} to ${curTo}`;
      if (resultsHeaderMeta) resultsHeaderMeta.textContent = `Showing 5 fastest & cheapest verified domestic flights between ${curFrom} and ${curTo}`;
      if (resultsCatIcon) resultsCatIcon.className = 'fa-solid fa-plane-departure';
    } else if (category === 'hotels') {
      if (resultsHeaderTitle) resultsHeaderTitle.textContent = `🏨 Luxury Hotels & Beach Resorts in ${curTo || curFrom}`;
      if (resultsHeaderMeta) resultsHeaderMeta.textContent = `Showing top-rated verified stays with free breakfast in ${curTo || curFrom}`;
      if (resultsCatIcon) resultsCatIcon.className = 'fa-solid fa-hotel';
    } else if (category === 'trains') {
      if (resultsHeaderTitle) resultsHeaderTitle.textContent = `🚆 IRCTC Superfast & Vande Bharat Trains: ${curFrom} to ${curTo}`;
      if (resultsHeaderMeta) resultsHeaderMeta.textContent = `Showing confirmed seat express trains between ${curFrom} and ${curTo}`;
      if (resultsCatIcon) resultsCatIcon.className = 'fa-solid fa-train';
    } else if (category === 'buses') {
      if (resultsHeaderTitle) resultsHeaderTitle.textContent = `🚌 Luxury Volvo AC Sleeper Buses: ${curFrom} to ${curTo}`;
      if (resultsHeaderMeta) resultsHeaderMeta.textContent = `Showing premium overnight buses between ${curFrom} and ${curTo}`;
      if (resultsCatIcon) resultsCatIcon.className = 'fa-solid fa-bus';
    }

    resultsContainer.innerHTML = items.map(item => {
      let depDisplay = item.depCode;
      let arrDisplay = item.arrCode;
      if (category === 'flights') {
        depDisplay = `${curFrom.substring(0, 3).toUpperCase()} (${curFrom})`;
        arrDisplay = `${curTo.substring(0, 3).toUpperCase()} (${curTo})`;
      } else if (category === 'trains') {
        depDisplay = curFrom;
        arrDisplay = curTo;
      } else if (category === 'buses') {
        depDisplay = curFrom;
        arrDisplay = curTo;
      }

      return `
      <div class="roavio-result-card">
          <!-- Logo & Name -->
          <div class="roavio-card-airline">
              <div class="roavio-airline-logo-box" style="color: ${item.color};">
                  <i class="${item.icon}"></i>
              </div>
              <div>
                  <h4 class="roavio-airline-name">${item.name}</h4>
                  <span>ID: ${item.id} · ★ ${item.rating}</span>
              </div>
          </div>

          <!-- Schedule & Duration Flow -->
          <div class="roavio-route-timing">
              <div class="roavio-time-block">
                  <div class="roavio-time-val">${item.depTime}</div>
                  <div class="roavio-station-code">${depDisplay}</div>
              </div>

              <div class="roavio-duration-bar">
                  <span class="roavio-dur-time">${item.durTime}</span>
                  <div class="roavio-dur-line"></div>
                  <span class="roavio-dur-stops">${item.stops}</span>
              </div>

              <div class="roavio-time-block">
                  <div class="roavio-time-val">${item.arrTime}</div>
                  <div class="roavio-station-code">${arrDisplay}</div>
              </div>
          </div>

          <!-- Price & Book Button -->
          <div class="roavio-price-cta-block">
              <div>
                  <span class="roavio-slashed-fare">${item.slashed}</span>
                  <span class="roavio-final-fare">${item.price}</span>
              </div>
              <span class="roavio-fare-sub">per traveller (inclusive taxes)</span>
              <button type="button" class="roavio-action-book-btn" onclick="openRoavioBookingModal('${item.name}', '${item.price}', '${depDisplay} to ${arrDisplay}')">
                  Book Now
              </button>
          </div>

          <!-- Inclusions / Perks Row -->
          <div class="roavio-perks-list">
              ${item.perks.map((p, idx) => `
                  <span class="roavio-perk-badge ${idx === 0 ? 'green' : idx === item.perks.length - 1 ? 'red' : ''}">
                      <i class="fa-solid fa-check"></i> ${p}
                  </span>
              `).join('')}
          </div>
      </div>
      `;
    }).join('');
  }

  // 5. Category Tab Switching
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      currentCategory = tab.getAttribute('data-cat') || 'tours';
      const cfg = tabConfigs[currentCategory] || tabConfigs.tours;

      if (fromLabel) fromLabel.textContent = cfg.fromLabel;
      if (fromCity) fromCity.textContent = cfg.fromCity;
      if (fromSub) fromSub.textContent = cfg.fromSub;

      if (toLabel) toLabel.textContent = cfg.toLabel;
      if (toCity) toCity.textContent = cfg.toCity;
      if (toSub) toSub.textContent = cfg.toSub;

      if (dateLabel) dateLabel.textContent = cfg.dateLabel;
      if (travellersLabel) travellersLabel.textContent = cfg.travellersLabel;
      if (travellersVal) travellersVal.textContent = cfg.travellersVal;
      if (travellersSub) travellersSub.textContent = cfg.travellersSub;

      if (searchBtnText) searchBtnText.textContent = cfg.btnText;
      if (swapBtn) swapBtn.style.display = cfg.showSwap ? 'flex' : 'none';

      const resultsSection = document.getElementById('roavio-search-results-section');

      if (currentCategory === 'tours') {
        if (resultsSection) resultsSection.style.display = 'none';
        const tourSection = document.getElementById('roavio-tours-section') || document.getElementById('roavio-tours-preview-section');
        if (tourSection) smoothScrollToTarget(tourSection, 95);
      } else if (currentCategory === 'map') {
        if (resultsSection) resultsSection.style.display = 'none';
        const mapSection = document.getElementById('roavio-tour-map-section');
        if (mapSection) smoothScrollToTarget(mapSection, 95);
      } else {
        if (resultsSection) resultsSection.style.display = 'block';
        renderResults(currentCategory, currentSort);
      }
    });
  });

  // 6. City Swap Button
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const curFromCity = fromCity.textContent;
      const curFromSub = fromSub.textContent;
      const curToCity = toCity.textContent;
      const curToSub = toSub.textContent;

      fromCity.textContent = curToCity;
      fromSub.textContent = curToSub;
      toCity.textContent = curFromCity;
      toSub.textContent = curFromSub;

      renderResults(currentCategory, currentSort);
    });
  }

  // 7. Trip Type Radios
  const tripRadios = document.querySelectorAll('input[name="yatra_trip_type"]');
  tripRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'oneway') {
        if (returnDate) returnDate.style.opacity = '0.35';
        if (returnSub) returnSub.textContent = 'Save more on round trip';
      } else {
        if (returnDate) returnDate.style.opacity = '1';
        if (returnSub) returnSub.textContent = 'Saturday 2026';
      }
    });
  });

  // 8. Special Fares Chips
  const fareChips = document.querySelectorAll('.yatra-fare-chip');
  fareChips.forEach(chip => {
    chip.addEventListener('click', () => {
      fareChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // 9. Search Button Action
  const searchBtn = document.getElementById('yatra-main-search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentCategory === 'tours') {
        const toVal = toCity ? toCity.textContent.trim() : '';
        if (toVal && toVal !== 'All States / Rajasthan / Kerala' && !toVal.includes('/')) {
          window.location.href = `tours.html?state=${encodeURIComponent(toVal)}`;
        } else {
          window.location.href = 'tours.html';
        }
        return;
      } else if (currentCategory === 'map') {
        window.location.href = 'tours.html';
        return;
      } else {
        const resultsSection = document.getElementById('roavio-search-results-section');
        if (resultsSection) {
          resultsSection.style.display = 'block';
          renderResults(currentCategory, currentSort);
          smoothScrollToTarget(resultsSection, 95);
        }
      }
    });
  }

  // 10. Filter & Sort Buttons for Transport
  const filterPills = document.querySelectorAll('.roavio-filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentSort = pill.getAttribute('data-sort') || 'all';
      renderResults(currentCategory, currentSort);
    });
  });

  // Hide transport results by default, user starts with India Tours
  const initialResultsSection = document.getElementById('roavio-search-results-section');
  if (initialResultsSection) {
    initialResultsSection.style.display = 'none';
  }

  // 11. Interactive FROM / TO City & Route Picker
  const indianDestinations = [
    {
      city: 'New Delhi',
      code: 'DEL',
      sub: 'DEL, Indira Gandhi International Airport',
      station: 'NDLS, New Delhi Railway Station',
      bus: 'Kashmiri Gate / Anand Vihar ISBT',
      hotel: 'Connaught Place & Aerocity Luxury Hotels',
      state: 'Delhi NCR',
      category: 'metro'
    },
    {
      city: 'Mumbai',
      code: 'BOM',
      sub: 'BOM, Chhatrapati Shivaji Maharaj International',
      station: 'MMCT, Mumbai Central / CSMT Station',
      bus: 'Borivali / Dadar TT / Vashi Terminal',
      hotel: 'Marine Drive & Juhu Beach Resorts',
      state: 'Maharashtra',
      category: 'metro'
    },
    {
      city: 'Goa',
      code: 'GOI',
      sub: 'GOI / GOX, Dabolim & Manohar Mopa Airport',
      station: 'MAO, Madgaon Junction Railway Station',
      bus: 'Panaji / Calangute KTC Bus Stand',
      hotel: 'North & South Goa 5-Star Beach Resorts',
      state: 'Goa',
      category: 'beaches,tourist'
    },
    {
      city: 'Jaipur',
      code: 'JAI',
      sub: 'JAI, Jaipur International Airport (Sanganer)',
      station: 'JP, Jaipur Junction Railway Station',
      bus: 'Sindhi Camp Central Bus Terminal',
      hotel: 'Royal Heritage Palaces & Havelis',
      state: 'Rajasthan',
      category: 'heritage,tourist'
    },
    {
      city: 'Bengaluru',
      code: 'BLR',
      sub: 'BLR, Kempegowda International Airport',
      station: 'SBC, KSR Bengaluru City Junction',
      bus: 'Majestic / Anand Rao Circle Terminal',
      hotel: 'Indiranagar & Whitefield Luxury Stays',
      state: 'Karnataka',
      category: 'metro'
    },
    {
      city: 'Kochi & Munnar',
      code: 'COK',
      sub: 'COK, Cochin International Airport',
      station: 'ERS, Ernakulam Junction Railway Station',
      bus: 'Kochi KSRTC Central Terminal',
      hotel: 'Alleppey Houseboats & Munnar Tea Estates',
      state: 'Kerala',
      category: 'hills,beaches,tourist'
    },
    {
      city: 'Manali & Solang Valley',
      code: 'IXC',
      sub: 'KUU / IXC, Kullu & Chandigarh Airport',
      station: 'CDG, Chandigarh Railway Station',
      bus: 'Mall Road Private & HRTC Bus Stand',
      hotel: 'Snow View Mountain Cottages & Chalets',
      state: 'Himachal Pradesh',
      category: 'hills,tourist'
    },
    {
      city: 'Agra (Taj Mahal)',
      code: 'AGR',
      sub: 'AGR, Agra Kheria Airport',
      station: 'AGC, Agra Cantt Railway Station',
      bus: 'Idgah Central Bus Terminal',
      hotel: 'Taj View Luxury Resorts',
      state: 'Uttar Pradesh',
      category: 'heritage,tourist'
    },
    {
      city: 'Varanasi',
      code: 'VNS',
      sub: 'VNS, Lal Bahadur Shastri International',
      station: 'BSB, Varanasi Junction Railway Station',
      bus: 'Chaudhary Charan Singh Bus Stand',
      hotel: 'Ganga Ghat Riverside Heritage Stays',
      state: 'Uttar Pradesh',
      category: 'heritage,tourist'
    },
    {
      city: 'Srinagar & Gulmarg',
      code: 'SXR',
      sub: 'SXR, Sheikh ul-Alam International Airport',
      station: 'JAT, Jammu Tawi Railway Station',
      bus: 'TRC Central Bus Stand Srinagar',
      hotel: 'Dal Lake Houseboats & Ski Chalets',
      state: 'Jammu & Kashmir',
      category: 'hills,tourist'
    },
    {
      city: 'Udaipur',
      code: 'UDR',
      sub: 'UDR, Maharana Pratap Airport',
      station: 'UDZ, Udaipur City Railway Station',
      bus: 'Udaipur Central Bus Stand',
      hotel: 'Lake Pichola Palace Resorts',
      state: 'Rajasthan',
      category: 'heritage,tourist'
    },
    {
      city: 'Kolkata',
      code: 'CCU',
      sub: 'CCU, Netaji Subhash Chandra Bose Airport',
      station: 'HWH, Howrah Junction Railway Station',
      bus: 'Esplanade Central Bus Terminus',
      hotel: 'Park Street & Salt Lake Luxury Stays',
      state: 'West Bengal',
      category: 'metro'
    },
    {
      city: 'Chennai',
      code: 'MAA',
      sub: 'MAA, Chennai International Airport',
      station: 'MAS, Dr. MGR Chennai Central',
      bus: 'CMBT Koyambedu Bus Terminal',
      hotel: 'Marina Beach & ECR Seaside Resorts',
      state: 'Tamil Nadu',
      category: 'metro,beaches'
    },
    {
      city: 'Hyderabad',
      code: 'HYD',
      sub: 'HYD, Rajiv Gandhi International Airport',
      station: 'SC, Secunderabad Railway Station',
      bus: 'MGBS Central Bus Station',
      hotel: 'Banjara Hills & Hitec City Hotels',
      state: 'Telangana',
      category: 'metro,heritage'
    },
    {
      city: 'Shimla',
      code: 'SLV',
      sub: 'SLV, Jubbarhatti Airport',
      station: 'SML, Shimla Heritage Railway Station',
      bus: 'ISBT Tutikandi Shimla',
      hotel: 'Mall Road & Cedar Forest Stays',
      state: 'Himachal Pradesh',
      category: 'hills,tourist'
    },
    {
      city: 'Ooty',
      code: 'CJB',
      sub: 'CJB, Coimbatore International Airport',
      station: 'UAM, Udagamandalam Mountain Railway',
      bus: 'Ooty Central Bus Stand',
      hotel: 'Colonial Bungalows & Coffee Estates',
      state: 'Tamil Nadu',
      category: 'hills,tourist'
    },
    {
      city: 'Hampi',
      code: 'VDY',
      sub: 'VDY, Jindal Vijayanagar Airport',
      station: 'HPT, Hosapete Junction Railway Station',
      bus: 'Hampi Bazaar Bus Stand',
      hotel: 'Heritage Boulder View Resorts',
      state: 'Karnataka',
      category: 'heritage,tourist'
    },
    {
      city: 'Rishikesh & Haridwar',
      code: 'DED',
      sub: 'DED, Dehradun Jolly Grant Airport',
      station: 'HW, Haridwar Junction Station',
      bus: 'Rishikesh ISBT Terminal',
      hotel: 'Ganges Riverside Ashrams & Resorts',
      state: 'Uttarakhand',
      category: 'heritage,hills,tourist'
    },
    {
      city: 'Amritsar',
      code: 'ATQ',
      sub: 'ATQ, Sri Guru Ram Dass Jee Airport',
      station: 'ASR, Amritsar Junction Railway Station',
      bus: 'Amritsar ISBT Stand',
      hotel: 'Golden Temple Heritage Hotels',
      state: 'Punjab',
      category: 'heritage,tourist'
    },
    {
      city: 'Ahmedabad',
      code: 'AMD',
      sub: 'AMD, Sardar Vallabhbhai Patel Airport',
      station: 'ADI, Ahmedabad Junction (Kalupur)',
      bus: 'Geeta Mandir Central Bus Stand',
      hotel: 'Sabarmati Riverfront Stays',
      state: 'Gujarat',
      category: 'metro,heritage'
    },
    {
      city: 'Pune',
      code: 'PNQ',
      sub: 'PNQ, Pune International Airport',
      station: 'PUNE, Pune Junction Railway Station',
      bus: 'Swargate & Wakad Bus Stand',
      hotel: 'Koregaon Park & Hinjawadi Hotels',
      state: 'Maharashtra',
      category: 'metro'
    },
    {
      city: 'Leh Ladakh',
      code: 'IXL',
      sub: 'IXL, Kushok Bakula Rimpochee Airport',
      station: 'JAT, Jammu Tawi (Road connection)',
      bus: 'Leh New Bus Stand',
      hotel: 'Pangong & Nubra Valley Luxury Camps',
      state: 'Ladakh',
      category: 'hills,tourist'
    }
  ];

  let activePickerMode = 'from';
  let activeCityFilter = 'all';

  const cityPickerBackdrop = document.getElementById('roavio-city-picker-backdrop');
  const cityPickerClose = document.getElementById('roavio-city-picker-close');
  const citySearchInput = document.getElementById('roavio-city-search-input');
  const cityListEl = document.getElementById('roavio-city-list');
  const pickerTitle = document.getElementById('roavio-picker-title');
  const pickerIcon = document.getElementById('roavio-picker-icon');
  const filterChips = document.querySelectorAll('.roavio-city-chip');

  const fromBlock = document.getElementById('yatra-from-block');
  const toBlock = document.getElementById('yatra-to-block');
  const dateBlock = document.getElementById('yatra-date-block');
  const returnBlock = document.getElementById('yatra-return-block');
  const travellersBlock = document.getElementById('yatra-travellers-block');

  const nativeDepDate = document.getElementById('roavio-native-dep-date');
  const nativeRetDate = document.getElementById('roavio-native-ret-date');
  const dateVal = document.getElementById('yatra-date-val');
  const dateSub = document.getElementById('yatra-date-sub');

  function getSubForCategory(item, cat) {
    if (cat === 'trains') return item.station;
    if (cat === 'buses') return item.bus;
    if (cat === 'hotels') return item.hotel;
    return item.sub;
  }

  function getIconForCategory(cat) {
    if (cat === 'trains') return 'fa-solid fa-train';
    if (cat === 'buses') return 'fa-solid fa-bus';
    if (cat === 'hotels') return 'fa-solid fa-hotel';
    return 'fa-solid fa-plane-departure';
  }

  function renderCityList(filterTerm = '', categoryFilter = 'all') {
    if (!cityListEl) return;
    const term = filterTerm.toLowerCase().trim();

    const filtered = indianDestinations.filter(d => {
      const matchCat = categoryFilter === 'all' || d.category.includes(categoryFilter);
      const matchTerm = !term || 
        d.city.toLowerCase().includes(term) || 
        d.code.toLowerCase().includes(term) || 
        d.sub.toLowerCase().includes(term) || 
        d.state.toLowerCase().includes(term);
      return matchCat && matchTerm;
    });

    if (filtered.length === 0) {
      cityListEl.innerHTML = `
        <div class="roavio-city-empty-msg">
          <i class="fa-solid fa-map-location-dot fs-2 text-muted mb-2 d-block"></i>
          <strong>No matching destinations found for "${term}"</strong>
          <p class="small text-muted mb-0">Try searching for Goa, Jaipur, Mumbai, Bengaluru, or Delhi</p>
        </div>
      `;
      return;
    }

    const catIcon = getIconForCategory(currentCategory);

    cityListEl.innerHTML = filtered.map(item => `
      <div class="roavio-city-item" data-city="${item.city}">
        <div class="roavio-city-info">
          <div class="roavio-city-icon">
            <i class="${catIcon}"></i>
          </div>
          <div class="roavio-city-names">
            <h5>${item.city} <span class="badge bg-light text-secondary border ms-1" style="font-size: 0.72rem;">${item.state}</span></h5>
            <span>${getSubForCategory(item, currentCategory)}</span>
          </div>
        </div>
        <span class="roavio-city-code">${item.code}</span>
      </div>
    `).join('');

    cityListEl.querySelectorAll('.roavio-city-item').forEach(el => {
      el.addEventListener('click', () => {
        const cityName = el.getAttribute('data-city');
        const cityObj = indianDestinations.find(d => d.city === cityName);
        if (!cityObj) return;

        const subText = getSubForCategory(cityObj, currentCategory);

        if (activePickerMode === 'from') {
          if (fromCity) fromCity.textContent = cityObj.city;
          if (fromSub) fromSub.textContent = subText;
        } else {
          if (toCity) toCity.textContent = cityObj.city;
          if (toSub) toSub.textContent = subText;
        }

        closeCityPicker();

        if (currentCategory === 'tours') {
          window.location.href = `tours.html?state=${encodeURIComponent(cityObj.state)}`;
          return;
        }

        const resultsSection = document.getElementById('roavio-search-results-section');
        if (resultsSection && resultsSection.style.display !== 'none') {
          renderResults(currentCategory, currentSort);
        }
      });
    });
  }

  function openCityPicker(mode) {
    activePickerMode = mode;
    activeCityFilter = 'all';

    if (filterChips) {
      filterChips.forEach(c => c.classList.remove('active'));
      const allChip = document.querySelector('.roavio-city-chip[data-filter="all"]');
      if (allChip) allChip.classList.add('active');
    }

    if (citySearchInput) {
      citySearchInput.value = '';
    }

    let catName = 'City / Airport';
    if (currentCategory === 'trains') catName = 'Railway Station';
    if (currentCategory === 'buses') catName = 'Bus Terminal';
    if (currentCategory === 'hotels') catName = 'Hotel / Resort Destination';

    if (pickerTitle) {
      pickerTitle.textContent = mode === 'from' 
        ? `Select Origin / Departure ${catName}` 
        : `Select Arrival / Destination ${catName}`;
    }

    if (pickerIcon) {
      pickerIcon.className = mode === 'from' 
        ? `${getIconForCategory(currentCategory)} text-danger me-2` 
        : `fa-solid fa-location-dot text-danger me-2`;
    }

    renderCityList('', 'all');

    if (cityPickerBackdrop) {
      cityPickerBackdrop.classList.add('show');
      setTimeout(() => {
        if (citySearchInput) citySearchInput.focus();
      }, 100);
    }
  }

  function closeCityPicker() {
    if (cityPickerBackdrop) {
      cityPickerBackdrop.classList.remove('show');
    }
  }

  if (fromBlock) {
    fromBlock.addEventListener('click', () => openCityPicker('from'));
  }
  if (toBlock) {
    toBlock.addEventListener('click', () => openCityPicker('to'));
  }
  if (cityPickerClose) {
    cityPickerClose.addEventListener('click', closeCityPicker);
  }
  if (cityPickerBackdrop) {
    cityPickerBackdrop.addEventListener('click', (e) => {
      if (e.target === cityPickerBackdrop) closeCityPicker();
    });
  }

  if (citySearchInput) {
    citySearchInput.addEventListener('input', (e) => {
      renderCityList(e.target.value, activeCityFilter);
    });
  }

  if (filterChips) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCityFilter = chip.getAttribute('data-filter') || 'all';
        renderCityList(citySearchInput ? citySearchInput.value : '', activeCityFilter);
      });
    });
  }

  // Departure Date picker
  if (dateBlock && nativeDepDate) {
    dateBlock.addEventListener('click', () => {
      try {
        if (nativeDepDate.showPicker) {
          nativeDepDate.showPicker();
        } else {
          nativeDepDate.click();
        }
      } catch (err) {
        nativeDepDate.click();
      }
    });

    nativeDepDate.addEventListener('change', () => {
      if (nativeDepDate.value) {
        const d = new Date(nativeDepDate.value);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (dateVal) dateVal.textContent = `${d.getDate()} ${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`;
        if (dateSub) dateSub.textContent = dayNames[d.getDay()];
      }
    });
  }

  // Return Date picker
  if (returnBlock && nativeRetDate) {
    returnBlock.addEventListener('click', () => {
      try {
        if (nativeRetDate.showPicker) {
          nativeRetDate.showPicker();
        } else {
          nativeRetDate.click();
        }
      } catch (err) {
        nativeRetDate.click();
      }
    });

    nativeRetDate.addEventListener('change', () => {
      if (nativeRetDate.value) {
        const d = new Date(nativeRetDate.value);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (returnDate) {
          returnDate.style.opacity = '1';
          returnDate.textContent = `${d.getDate()} ${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`;
        }
        if (returnSub) returnSub.textContent = dayNames[d.getDay()];
      }
    });
  }

  // Travellers & Class Picker
  const travellersModal = document.getElementById('roavio-travellers-picker-backdrop');
  const travellersClose = document.getElementById('roavio-travellers-picker-close');
  const applyTravellersBtn = document.getElementById('roavio-apply-travellers-btn');
  let selectedPaxCount = '1';
  let selectedClass = 'Economy';

  if (travellersBlock) {
    travellersBlock.addEventListener('click', () => {
      if (travellersModal) travellersModal.classList.add('show');
    });
  }
  if (travellersClose) {
    travellersClose.addEventListener('click', () => {
      if (travellersModal) travellersModal.classList.remove('show');
    });
  }
  if (travellersModal) {
    travellersModal.addEventListener('click', (e) => {
      if (e.target === travellersModal) travellersModal.classList.remove('show');
    });
  }

  const paxButtons = document.querySelectorAll('#roavio-traveller-count-group button');
  paxButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      paxButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPaxCount = btn.getAttribute('data-count') || '1';
    });
  });

  const classButtons = document.querySelectorAll('#roavio-class-group button');
  classButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      classButtons.forEach(b => {
        b.classList.remove('active');
        const icon = b.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-check text-muted me-2';
      });
      btn.classList.add('active');
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-check text-danger me-2';
      selectedClass = btn.getAttribute('data-class') || 'Economy';
    });
  });

  if (applyTravellersBtn) {
    applyTravellersBtn.addEventListener('click', () => {
      if (travellersVal) {
        travellersVal.textContent = selectedPaxCount === '1' ? '1 Traveller' : `${selectedPaxCount} Travellers`;
      }
      if (travellersSub) {
        travellersSub.textContent = selectedClass;
      }
      if (travellersModal) travellersModal.classList.remove('show');
    });
  }
});

// Modal Actions
window.openRoavioBookingModal = function(itemName, itemPrice, routeInfo) {
  const modal = document.getElementById('roavio-booking-modal');
  const modalItem = document.getElementById('roavio-modal-item-name');
  const modalPrice = document.getElementById('roavio-modal-price');
  const modalRoute = document.getElementById('roavio-modal-route');

  if (modalItem) modalItem.textContent = itemName;
  if (modalPrice) modalPrice.textContent = itemPrice;
  if (modalRoute) modalRoute.textContent = routeInfo;

  if (modal) modal.classList.add('active');
};

window.closeRoavioBookingModal = function() {
  const modal = document.getElementById('roavio-booking-modal');
  if (modal) modal.classList.remove('active');
};

window.confirmRoavioBooking = function() {
  const name = document.getElementById('roavio-book-pax-name').value || 'Traveller';
  alert(`Thank you, ${name}! Your booking has been successfully confirmed at Roavio with Instant Best Price Guarantee. An e-ticket/voucher has been sent to your email.`);
  closeRoavioBookingModal();
};
