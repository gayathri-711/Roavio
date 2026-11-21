/**
 * Roavio - Sample Bookings & Demonstration History
 */

export const INITIAL_BOOKINGS = [
  {
    id: "BK-89021",
    pnr: "ROA-DEL-COK-512",
    type: "flight",
    category: "Flight Booking",
    title: "Air India AI-512 (New Delhi ➔ Kochi)",
    route: "DEL ➔ COK",
    date: "2026-12-15",
    passengers: 2,
    leadPassenger: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@example.com",
    seat: "12A, 12B",
    fare: 10900,
    status: "Confirmed (Demo)",
    bookingDate: "2026-11-18",
    operator: "Air India",
    paymentMode: "Roavio Pay (Demo UPI)"
  },
  {
    id: "BK-89022",
    pnr: "ROA-IRCTC-22436",
    type: "train",
    category: "Train Booking",
    title: "Vande Bharat Express (22436) - Executive Class",
    route: "NDLS ➔ BSB",
    date: "2026-12-22",
    passengers: 1,
    leadPassenger: "Ananya Iyer",
    phone: "+91 98451 22334",
    email: "ananya.iyer@example.com",
    seat: "C2 - 24 (Window)",
    fare: 3300,
    status: "Confirmed (Demo)",
    bookingDate: "2026-11-17",
    operator: "Indian Railways",
    paymentMode: "Net Banking (Demo)"
  },
  {
    id: "BK-89023",
    pnr: "ROA-BUS-BLR-GOA",
    type: "bus",
    category: "Bus Booking",
    title: "IntrCity SmartBus Multi-Axle AC Sleeper",
    route: "Bengaluru ➔ Goa (Panaji)",
    date: "2026-11-05",
    passengers: 2,
    leadPassenger: "Vikram Malhotra",
    phone: "+91 97112 34567",
    email: "vikram.m@example.com",
    seat: "U3, U4",
    fare: 3300,
    status: "Completed (Demo)",
    bookingDate: "2026-10-28",
    operator: "IntrCity SmartBus",
    paymentMode: "Credit Card (Demo)"
  },
  {
    id: "BK-89024",
    pnr: "ROA-PASS-TAJ-482",
    type: "tour",
    category: "Monument Pass",
    title: "Taj Mahal & Agra Fort Certified Entry Pass",
    route: "Agra, Uttar Pradesh",
    date: "2026-12-08",
    passengers: 3,
    leadPassenger: "Siddharth Verma",
    phone: "+91 99887 76655",
    email: "sid.verma@example.com",
    seat: "All-Day Guided Access",
    fare: 3450,
    status: "Active (Demo)",
    bookingDate: "2026-11-19",
    operator: "ASI Certified Partner",
    paymentMode: "Demo UPI"
  }
];

export const INITIAL_SAVED_DESTINATIONS = [
  "taj-mahal",
  "munnar-tea-hills",
  "pangong-lake",
  "hampi-ruins",
  "golden-temple"
];

export const INITIAL_PLANNED_TRIPS = [
  {
    id: "trip-01",
    title: "Grand Kerala Backwaters & Tea Hills",
    sourceLocation: "Kochi",
    destinationState: "Kerala",
    startDate: "2026-12-24",
    endDate: "2026-12-29",
    durationDays: 5,
    travelers: 2,
    budget: 35000,
    transportPreference: "Cab & Houseboat",
    destinations: ["munnar-tea-hills", "alleppey-backwaters", "athirappilly-falls"],
    notes: "Book authentic houseboat with sunset cruise on Vembanad Lake.",
    createdAt: "2026-11-15"
  },
  {
    id: "trip-02",
    title: "Royal Rajasthan Heritage Odyssey",
    sourceLocation: "New Delhi",
    destinationState: "Rajasthan",
    startDate: "2027-01-10",
    endDate: "2027-01-16",
    durationDays: 6,
    travelers: 4,
    budget: 52000,
    transportPreference: "Train & Private Chauffeur",
    destinations: ["amber-fort-jaipur", "city-palace-udaipur", "mehrangarh-fort"],
    notes: "Attend evening folk dance at Bagore Ki Haveli.",
    createdAt: "2026-11-17"
  }
];
