/**
 * MakeMyTrip & Yatra Interactive Experience for Roavio
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure background video plays automatically
  const bgVideo = document.querySelector('.mmt-bg-video');
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.play().catch(() => {});
  }

  // 1. Category Tabs Switching
  const categoryTabs = document.querySelectorAll('.mmt-cat-tab');
  const fromCityLabel = document.getElementById('mmt-from-label');
  const fromCityName = document.getElementById('mmt-from-city');
  const fromCitySub = document.getElementById('mmt-from-sub');

  const toCityLabel = document.getElementById('mmt-to-label');
  const toCityName = document.getElementById('mmt-to-city');
  const toCitySub = document.getElementById('mmt-to-sub');

  const dateLabel = document.getElementById('mmt-date-label');
  const returnBlock = document.getElementById('mmt-return-block');
  const guestsLabel = document.getElementById('mmt-guests-label');
  const guestsVal = document.getElementById('mmt-guests-val');
  const guestsSub = document.getElementById('mmt-guests-sub');

  const swapBtn = document.getElementById('mmt-swap-btn');
  const radioGroup = document.querySelector('.mmt-trip-type-bar');
  const searchBtnText = document.getElementById('mmt-search-text');

  const tabConfigs = {
    flights: {
      fromLabel: 'FROM',
      fromCity: 'Delhi',
      fromSub: 'DEL, Indira Gandhi International Airport',
      toLabel: 'TO',
      toCity: 'Goa',
      toSub: 'GOI, Dabolim International Airport',
      dateLabel: 'DEPARTURE',
      guestsLabel: 'TRAVELLERS & CLASS',
      guestsVal: '1 Traveller',
      guestsSub: 'Economy / Premium',
      showTripType: true,
      showReturn: true,
      showSwap: true,
      btnText: 'SEARCH FLIGHTS'
    },
    hotels: {
      fromLabel: 'CITY / LOCATION / PROPERTY',
      fromCity: 'Goa, India',
      fromSub: 'Popular Beachside Resorts & Villas',
      toLabel: 'CHECK-IN',
      toCity: '25 Nov',
      toSub: 'Wednesday 2026',
      dateLabel: 'CHECK-OUT',
      guestsLabel: 'ROOMS & GUESTS',
      guestsVal: '1 Room, 2 Adults',
      guestsSub: 'Price per night',
      showTripType: false,
      showReturn: false,
      showSwap: false,
      btnText: 'SEARCH HOTELS'
    },
    holidays: {
      fromLabel: 'FROM CITY',
      fromCity: 'Mumbai',
      fromSub: 'India Departure City',
      toLabel: 'TO DESTINATION',
      toCity: 'Bali, Indonesia',
      toSub: 'South East Asia Holiday Packages',
      dateLabel: 'STARTING DATE',
      guestsLabel: 'TRAVELLERS & ROOMS',
      guestsVal: '2 Travellers',
      guestsSub: '1 Room · Customized Plan',
      showTripType: true,
      showReturn: true,
      showSwap: true,
      btnText: 'EXPLORE PACKAGES'
    },
    trains: {
      fromLabel: 'FROM STATION',
      fromCity: 'New Delhi',
      fromSub: 'NDLS, Railway Station',
      toLabel: 'TO STATION',
      toCity: 'Varanasi',
      toSub: 'BSB, Varanasi Junction',
      dateLabel: 'TRAVEL DATE',
      guestsLabel: 'CLASS & QUOTA',
      guestsVal: 'All Classes',
      guestsSub: 'General Quota',
      showTripType: false,
      showReturn: false,
      showSwap: true,
      btnText: 'SEARCH TRAINS'
    },
    buses: {
      fromLabel: 'FROM',
      fromCity: 'Bengaluru',
      fromSub: 'Majestic Bus Stand',
      toLabel: 'TO',
      toCity: 'Ooty',
      toSub: 'Ooty Central Stand',
      dateLabel: 'DEPARTURE DATE',
      guestsLabel: 'SEAT PREFERENCE',
      guestsVal: 'Sleeper / AC',
      guestsSub: '1 Passenger',
      showTripType: false,
      showReturn: false,
      showSwap: true,
      btnText: 'SEARCH BUSES'
    },
    cabs: {
      fromLabel: 'FROM CITY',
      fromCity: 'Delhi Airport',
      fromSub: 'Pickup Terminal 3',
      toLabel: 'TO DESTINATION',
      toCity: 'Agra',
      toSub: 'Taj Mahal / Hotel Drop',
      dateLabel: 'PICKUP DATE & TIME',
      guestsLabel: 'TRIP TYPE',
      guestsVal: 'Outstation One-Way',
      guestsSub: 'Sedan / SUV Available',
      showTripType: false,
      showReturn: false,
      showSwap: false,
      btnText: 'SEARCH CABS'
    }
  };

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.getAttribute('data-cat');
      const cfg = tabConfigs[cat] || tabConfigs.flights;

      if (fromCityLabel) fromCityLabel.textContent = cfg.fromLabel;
      if (fromCityName) fromCityName.textContent = cfg.fromCity;
      if (fromCitySub) fromCitySub.textContent = cfg.fromSub;

      if (toCityLabel) toCityLabel.textContent = cfg.toLabel;
      if (toCityName) toCityName.textContent = cfg.toCity;
      if (toCitySub) toCitySub.textContent = cfg.toSub;

      if (dateLabel) dateLabel.textContent = cfg.dateLabel;
      if (guestsLabel) guestsLabel.textContent = cfg.guestsLabel;
      if (guestsVal) guestsVal.textContent = cfg.guestsVal;
      if (guestsSub) guestsSub.textContent = cfg.guestsSub;

      if (searchBtnText) searchBtnText.textContent = cfg.btnText;

      if (swapBtn) {
        swapBtn.style.display = cfg.showSwap ? 'flex' : 'none';
      }
    });
  });

  // 2. City Swap Button
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const currentFrom = fromCityName.textContent;
      const currentFromSub = fromCitySub.textContent;

      const currentTo = toCityName.textContent;
      const currentToSub = toCitySub.textContent;

      fromCityName.textContent = currentTo;
      fromCitySub.textContent = currentToSub;

      toCityName.textContent = currentFrom;
      toCitySub.textContent = currentFromSub;
    });
  }

  // 3. Trip Type Radios (One Way, Round Trip)
  const tripTypeRadios = document.querySelectorAll('input[name="mmt_trip_type"]');
  const returnSub = document.getElementById('mmt-return-sub');
  const returnDate = document.getElementById('mmt-return-date');

  tripTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'oneway') {
        if (returnDate) returnDate.style.opacity = '0.4';
        if (returnSub) returnSub.textContent = 'Save more on return flight';
      } else {
        if (returnDate) returnDate.style.opacity = '1';
        if (returnSub) returnSub.textContent = 'Saturday 2026';
      }
    });
  });

  // 4. Special Fare Chips
  const fareChips = document.querySelectorAll('.mmt-fare-chip');
  fareChips.forEach(chip => {
    chip.addEventListener('click', () => {
      fareChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // 5. Search Action
  const mainSearchBtn = document.getElementById('mmt-main-search-btn');
  if (mainSearchBtn) {
    mainSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = document.getElementById('featured-packages-section');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
