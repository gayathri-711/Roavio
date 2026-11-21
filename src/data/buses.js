/**
 * Roavio - Realistic Sample Buses Dataset
 * Luxury Sleeper & Electric Intercity Coach Routes across India
 */

export const BUSES = [
  {
    id: "bus-301",
    operator: "Zingbus Plus",
    busType: "BharatBenz AC Sleeper (2+1)",
    rating: 4.8,
    reviewsCount: 3820,
    fromCity: "New Delhi",
    boardingPoint: "Kashmere Gate Metro Gate 5 / Majnu Ka Tilla",
    toCity: "Manali (Himachal)",
    droppingPoint: "Private Bus Stand, Manali",
    departureTime: "07:30 PM",
    arrivalTime: "08:15 AM (+1 day)",
    duration: "12h 45m",
    fare: 1299,
    seatsAvailable: 12,
    amenities: ["WiFi", "Live GPS Tracking", "Charging Port", "Blanket & Pillow", "Mineral Water", "Air Freshener"],
    seatLayout: {
      lower: [
        { id: "L1", number: "1", type: "single", price: 1299, status: "available" },
        { id: "L2", number: "2", type: "double-left", price: 1299, status: "booked" },
        { id: "L3", number: "3", type: "double-right", price: 1299, status: "available" },
        { id: "L4", number: "4", type: "single", price: 1299, status: "female" },
        { id: "L5", number: "5", type: "double-left", price: 1299, status: "available" },
        { id: "L6", number: "6", type: "double-right", price: 1299, status: "booked" },
        { id: "L7", number: "7", type: "single", price: 1299, status: "available" },
        { id: "L8", number: "8", type: "double-left", price: 1299, status: "available" },
        { id: "L9", number: "9", type: "double-right", price: 1299, status: "booked" }
      ],
      upper: [
        { id: "U1", number: "U1", type: "single", price: 1399, status: "available" },
        { id: "U2", number: "U2", type: "double-left", price: 1399, status: "booked" },
        { id: "U3", number: "U3", type: "double-right", price: 1399, status: "available" },
        { id: "U4", number: "U4", type: "single", price: 1399, status: "available" },
        { id: "U5", number: "U5", type: "double-left", price: 1399, status: "available" },
        { id: "U6", number: "U6", type: "double-right", price: 1399, status: "booked" },
        { id: "U7", number: "U7", type: "single", price: 1399, status: "booked" },
        { id: "U8", number: "U8", type: "double-left", price: 1399, status: "available" },
        { id: "U9", number: "U9", type: "double-right", price: 1399, status: "available" }
      ]
    }
  },
  {
    id: "bus-302",
    operator: "IntrCity SmartBus",
    busType: "Volvo Multi-Axle AC Sleeper (2+1)",
    rating: 4.9,
    reviewsCount: 5120,
    fromCity: "Bengaluru",
    boardingPoint: "Madiwala / Majestic / Anand Rao Circle",
    toCity: "Goa (Panaji)",
    droppingPoint: "Panaji KTC Bus Stand / Mapusa",
    departureTime: "08:00 PM",
    arrivalTime: "07:30 AM (+1 day)",
    duration: "11h 30m",
    fare: 1550,
    seatsAvailable: 9,
    amenities: ["SmartBus Lounge Access", "GPS Live Tracking", "Personal LCD Screen", "Charging Socket", "Emergency SOS"],
    seatLayout: {
      lower: [
        { id: "L1", number: "1", type: "single", price: 1550, status: "available" },
        { id: "L2", number: "2", type: "double-left", price: 1550, status: "booked" },
        { id: "L3", number: "3", type: "double-right", price: 1550, status: "available" },
        { id: "L4", number: "4", type: "single", price: 1550, status: "available" },
        { id: "L5", number: "5", type: "double-left", price: 1550, status: "female" },
        { id: "L6", number: "6", type: "double-right", price: 1550, status: "booked" }
      ],
      upper: [
        { id: "U1", number: "U1", type: "single", price: 1650, status: "booked" },
        { id: "U2", number: "U2", type: "double-left", price: 1650, status: "available" },
        { id: "U3", number: "U3", type: "double-right", price: 1650, status: "available" },
        { id: "U4", number: "U4", type: "single", price: 1650, status: "available" },
        { id: "U5", number: "U5", type: "double-left", price: 1650, status: "booked" },
        { id: "U6", number: "U6", type: "double-right", price: 1650, status: "available" }
      ]
    }
  },
  {
    id: "bus-303",
    operator: "NueGo Green Mobility",
    busType: "Electric Premium Luxury AC Seater (2+2)",
    rating: 4.7,
    reviewsCount: 2240,
    fromCity: "New Delhi",
    boardingPoint: "ISBT Kashmere Gate / Sarai Kale Khan",
    toCity: "Jaipur",
    droppingPoint: "Sindhi Camp / 200 Ft Bypass",
    departureTime: "06:30 AM",
    arrivalTime: "11:30 AM",
    duration: "5h 00m",
    fare: 649,
    seatsAvailable: 21,
    amenities: ["Zero Emissions Eco Bus", "CCTV Surveillance", "Mobile Charging", "Reclining Seats", "Snack Pack"],
    seatLayout: {
      lower: [
        { id: "S1", number: "1A", type: "seater", price: 649, status: "available" },
        { id: "S2", number: "1B", type: "seater", price: 649, status: "available" },
        { id: "S3", number: "1C", type: "seater", price: 649, status: "booked" },
        { id: "S4", number: "1D", type: "seater", price: 649, status: "available" },
        { id: "S5", number: "2A", type: "seater", price: 649, status: "female" },
        { id: "S6", number: "2B", type: "seater", price: 649, status: "available" },
        { id: "S7", number: "2C", type: "seater", price: 649, status: "booked" },
        { id: "S8", number: "2D", type: "seater", price: 649, status: "available" }
      ],
      upper: []
    }
  },
  {
    id: "bus-304",
    operator: "KSRTC FlyBus & Airavat",
    busType: "Scania Diamond Class Multi-Axle AC",
    rating: 4.8,
    reviewsCount: 4600,
    fromCity: "Bengaluru",
    boardingPoint: "Kempegowda Bus Station (Majestic)",
    toCity: "Mysuru / Ooty",
    droppingPoint: "Ooty Bus Stand",
    departureTime: "09:00 PM",
    arrivalTime: "05:30 AM (+1 day)",
    duration: "8h 30m",
    fare: 1150,
    seatsAvailable: 15,
    amenities: ["Official State Transport", "Punctual Service", "Thermal Blankets", "Bottle Holder", "Live GPS"],
    seatLayout: {
      lower: [
        { id: "L1", number: "1", type: "single", price: 1150, status: "available" },
        { id: "L2", number: "2", type: "double-left", price: 1150, status: "booked" },
        { id: "L3", number: "3", type: "double-right", price: 1150, status: "available" },
        { id: "L4", number: "4", type: "single", price: 1150, status: "available" }
      ],
      upper: [
        { id: "U1", number: "U1", type: "single", price: 1250, status: "available" },
        { id: "U2", number: "U2", type: "double-left", price: 1250, status: "booked" },
        { id: "U3", number: "U3", type: "double-right", price: 1250, status: "available" },
        { id: "U4", number: "U4", type: "single", price: 1250, status: "available" }
      ]
    }
  },
  {
    id: "bus-305",
    operator: "SRS Travels",
    busType: "Volvo Multi-Axle AC Sleeper",
    rating: 4.6,
    reviewsCount: 3100,
    fromCity: "Chennai",
    boardingPoint: "Koyambedu / Guindy / Tambaram",
    toCity: "Madurai (Meenakshi)",
    droppingPoint: "Mattuthavani Integrated Bus Terminus",
    departureTime: "10:15 PM",
    arrivalTime: "06:00 AM (+1 day)",
    duration: "7h 45m",
    fare: 990,
    seatsAvailable: 14,
    amenities: ["Personal Reading Light", "Charging Port", "Blanket", "Water Bottle"],
    seatLayout: {
      lower: [
        { id: "L1", number: "1", type: "single", price: 990, status: "available" },
        { id: "L2", number: "2", type: "double-left", price: 990, status: "booked" },
        { id: "L3", number: "3", type: "double-right", price: 990, status: "available" }
      ],
      upper: [
        { id: "U1", number: "U1", type: "single", price: 1090, status: "available" },
        { id: "U2", number: "U2", type: "double-left", price: 1090, status: "booked" },
        { id: "U3", number: "U3", type: "double-right", price: 1090, status: "available" }
      ]
    }
  }
];

export const BUS_CITIES = [
  "New Delhi",
  "Manali (Himachal)",
  "Jaipur",
  "Bengaluru",
  "Goa (Panaji)",
  "Mysuru / Ooty",
  "Chennai",
  "Madurai (Meenakshi)",
  "Mumbai",
  "Pune",
  "Varanasi"
];
