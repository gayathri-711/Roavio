/**
 * Yatra.com Interactive Engine for Roavio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ensure Background Video Autoplays
  const bgVideo = document.querySelector('.yatra-bg-video');
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.play().catch(() => {});
  }

  // 2. Yatra Category Tabs
  const catTabs = document.querySelectorAll('.yatra-cat-tab');
  const fromLabel = document.getElementById('yatra-from-label');
  const fromCity = document.getElementById('yatra-from-city');
  const fromSub = document.getElementById('yatra-from-sub');

  const toLabel = document.getElementById('yatra-to-label');
  const toCity = document.getElementById('yatra-to-city');
  const toSub = document.getElementById('yatra-to-sub');

  const dateLabel = document.getElementById('yatra-date-label');
  const returnBlock = document.getElementById('yatra-return-block');
  const returnDate = document.getElementById('yatra-return-date');
  const returnSub = document.getElementById('yatra-return-sub');

  const travellersLabel = document.getElementById('yatra-travellers-label');
  const travellersVal = document.getElementById('yatra-travellers-val');
  const travellersSub = document.getElementById('yatra-travellers-sub');

  const searchBtnText = document.getElementById('yatra-search-text');
  const swapBtn = document.getElementById('yatra-swap-btn');

  const tabData = {
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
      showSwap: true,
      showReturn: true
    },
    hotels: {
      fromLabel: 'CITY / HOTEL / RESORT',
      fromCity: 'Goa, India',
      fromSub: '500+ Luxury Hotels & Beach Villas',
      toLabel: 'CHECK-IN DATE',
      toCity: '25 Nov 2026',
      toSub: 'Wednesday',
      dateLabel: 'CHECK-OUT DATE',
      travellersLabel: 'ROOMS & GUESTS',
      travellersVal: '1 Room, 2 Guests',
      travellersSub: 'Price per night',
      btnText: 'Search Hotels',
      showSwap: false,
      showReturn: false
    },
    holidays: {
      fromLabel: 'DEPARTURE CITY',
      fromCity: 'Mumbai',
      fromSub: 'India Departure City',
      toLabel: 'HOLIDAY DESTINATION',
      toCity: 'Bali, Indonesia',
      toSub: 'Top Trending International Package',
      dateLabel: 'TRAVEL DATE',
      travellersLabel: 'TRAVELLERS & ROOMS',
      travellersVal: '2 Travellers',
      travellersSub: 'Customisable Itinerary',
      btnText: 'Search Holidays',
      showSwap: true,
      showReturn: true
    },
    buses: {
      fromLabel: 'FROM',
      fromCity: 'Bengaluru',
      fromSub: 'Majestic / Anand Rao Circle',
      toLabel: 'TO',
      toCity: 'Ooty',
      toSub: 'Ooty Bus Stand',
      dateLabel: 'TRAVEL DATE',
      travellersLabel: 'SEAT TYPE',
      travellersVal: 'AC Sleeper / Seater',
      travellersSub: '1 Seat',
      btnText: 'Search Buses',
      showSwap: true,
      showReturn: false
    },
    trains: {
      fromLabel: 'FROM STATION',
      fromCity: 'New Delhi (NDLS)',
      fromSub: 'New Delhi Railway Station',
      toLabel: 'TO STATION',
      toCity: 'Varanasi (BSB)',
      toSub: 'Varanasi Junction',
      dateLabel: 'TRAVEL DATE',
      travellersLabel: 'CLASS & QUOTA',
      travellersVal: 'All Classes',
      travellersSub: 'General Quota',
      btnText: 'Search Trains',
      showSwap: true,
      showReturn: false
    },
    cabs: {
      fromLabel: 'PICKUP LOCATION',
      fromCity: 'Delhi Airport',
      fromSub: 'Indira Gandhi Terminal 3',
      toLabel: 'DROP LOCATION',
      toCity: 'Agra',
      toSub: 'Hotel / Taj Mahal Drop',
      dateLabel: 'PICKUP DATE & TIME',
      travellersLabel: 'CAB TYPE',
      travellersVal: 'Outstation Sedan',
      travellersSub: '4 Seater with AC',
      btnText: 'Search Cabs',
      showSwap: false,
      showReturn: false
    }
  };

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.getAttribute('data-cat');
      const data = tabData[cat] || tabData.flights;

      if (fromLabel) fromLabel.textContent = data.fromLabel;
      if (fromCity) fromCity.textContent = data.fromCity;
      if (fromSub) fromSub.textContent = data.fromSub;

      if (toLabel) toLabel.textContent = data.toLabel;
      if (toCity) toCity.textContent = data.toCity;
      if (toSub) toSub.textContent = data.toSub;

      if (dateLabel) dateLabel.textContent = data.dateLabel;
      if (travellersLabel) travellersLabel.textContent = data.travellersLabel;
      if (travellersVal) travellersVal.textContent = data.travellersVal;
      if (travellersSub) travellersSub.textContent = data.travellersSub;

      if (searchBtnText) searchBtnText.textContent = data.btnText;

      if (swapBtn) {
        swapBtn.style.display = data.showSwap ? 'flex' : 'none';
      }
    });
  });

  // 3. Swap City Button
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
    });
  }

  // 4. Trip Type Radios (One Way, Round Trip)
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

  // 5. Special Fares Chips
  const fareChips = document.querySelectorAll('.yatra-fare-chip');
  fareChips.forEach(chip => {
    chip.addEventListener('click', () => {
      fareChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // 6. Search Button Click
  const searchBtn = document.getElementById('yatra-main-search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('yatra-packages-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
