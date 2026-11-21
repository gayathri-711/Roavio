/**
 * Roavio - Realistic Sample Trains Dataset
 * Official Indian Railways (IRCTC-style demonstration) routes
 */

export const TRAINS = [
  {
    id: "tr-201",
    trainNumber: "22436",
    trainName: "Vande Bharat Express",
    type: "Superfast Semi-High Speed",
    fromCity: "New Delhi",
    fromStation: "New Delhi (NDLS)",
    toCity: "Varanasi",
    toStation: "Varanasi Junction (BSB)",
    departureTime: "06:00 AM",
    arrivalTime: "02:00 PM",
    duration: "8h 00m",
    runsOn: ["Mon", "Tue", "Wed", "Fri", "Sat", "Sun"],
    catering: "Complimentary Hot Meals & Tea Included",
    classes: [
      { code: "CC", name: "AC Chair Car", fare: 1750, status: "AVAILABLE - 42", color: "green" },
      { code: "EC", name: "Exec. Chair Car", fare: 3300, status: "AVAILABLE - 14", color: "green" }
    ]
  },
  {
    id: "tr-202",
    trainNumber: "12952",
    trainName: "Mumbai Rajdhani Express",
    type: "Premium Superfast",
    fromCity: "New Delhi",
    fromStation: "New Delhi (NDLS)",
    toCity: "Mumbai",
    toStation: "Mumbai Central (MMCT)",
    departureTime: "04:55 PM",
    arrivalTime: "08:35 AM",
    duration: "15h 40m",
    runsOn: ["Daily"],
    catering: "All Meals, Evening Tea & Breakfast Included",
    classes: [
      { code: "3A", name: "3 Tier AC", fare: 2380, status: "RAC 12", color: "amber" },
      { code: "2A", name: "2 Tier AC", fare: 3450, status: "AVAILABLE - 22", color: "green" },
      { code: "1A", name: "First AC", fare: 5200, status: "AVAILABLE - 04", color: "green" }
    ]
  },
  {
    id: "tr-203",
    trainNumber: "20635",
    trainName: "Ananthapuri Vande Bharat Express",
    type: "Semi-High Speed",
    fromCity: "Chennai",
    fromStation: "Chennai Egmore (MS)",
    toCity: "Madurai (Meenakshi)",
    toStation: "Madurai Junction (MDU)",
    departureTime: "05:15 AM",
    arrivalTime: "11:15 AM",
    duration: "6h 00m",
    runsOn: ["Daily except Thu"],
    catering: "Breakfast & Refreshments Included",
    classes: [
      { code: "CC", name: "AC Chair Car", fare: 1420, status: "AVAILABLE - 68", color: "green" },
      { code: "EC", name: "Exec. Chair Car", fare: 2650, status: "AVAILABLE - 18", color: "green" }
    ]
  },
  {
    id: "tr-204",
    trainNumber: "12002",
    trainName: "Bhopal Shatabdi Express",
    type: "Shatabdi Express",
    fromCity: "New Delhi",
    fromStation: "New Delhi (NDLS)",
    toCity: "Agra (Taj Mahal)",
    toStation: "Agra Cantt (AGC)",
    departureTime: "06:00 AM",
    arrivalTime: "07:50 AM",
    duration: "1h 50m",
    runsOn: ["Daily"],
    catering: "Morning Tea & Breakfast Included",
    classes: [
      { code: "CC", name: "AC Chair Car", fare: 680, status: "AVAILABLE - 85", color: "green" },
      { code: "EC", name: "Exec. Chair Car", fare: 1350, status: "AVAILABLE - 24", color: "green" }
    ]
  },
  {
    id: "tr-205",
    trainNumber: "20608",
    trainName: "Mysuru - Chennai Vande Bharat",
    type: "Semi-High Speed",
    fromCity: "Bengaluru",
    fromStation: "KSR Bengaluru (SBC)",
    toCity: "Chennai",
    toStation: "MGR Chennai Central (MAS)",
    departureTime: "02:20 PM",
    arrivalTime: "07:30 PM",
    duration: "5h 10m",
    runsOn: ["Mon", "Tue", "Thu", "Fri", "Sat", "Sun"],
    catering: "Evening Snacks & High Tea Included",
    classes: [
      { code: "CC", name: "AC Chair Car", fare: 1040, status: "AVAILABLE - 52", color: "green" },
      { code: "EC", name: "Exec. Chair Car", fare: 1990, status: "AVAILABLE - 16", color: "green" }
    ]
  },
  {
    id: "tr-206",
    trainNumber: "12015",
    trainName: "Ajmer Shatabdi Express",
    type: "Shatabdi Express",
    fromCity: "New Delhi",
    fromStation: "New Delhi (NDLS)",
    toCity: "Jaipur",
    toStation: "Jaipur Junction (JP)",
    departureTime: "06:10 AM",
    arrivalTime: "10:40 AM",
    duration: "4h 30m",
    runsOn: ["Daily"],
    catering: "Complimentary Hot Breakfast",
    classes: [
      { code: "CC", name: "AC Chair Car", fare: 990, status: "AVAILABLE - 40", color: "green" },
      { code: "EC", name: "Exec. Chair Car", fare: 1820, status: "AVAILABLE - 12", color: "green" }
    ]
  },
  {
    id: "tr-207",
    trainNumber: "12214",
    trainName: "Delhi Sarai Rohilla - Yesvantpur Duronto",
    type: "AC Duronto Non-Stop",
    fromCity: "New Delhi",
    fromStation: "Delhi Sarai Rohilla (DEE)",
    toCity: "Bengaluru",
    toStation: "Yesvantpur Junction (YPR)",
    departureTime: "11:00 PM",
    arrivalTime: "04:40 PM (+1 day)",
    duration: "29h 40m",
    runsOn: ["Mon"],
    catering: "Full Pantry & Meals Included",
    classes: [
      { code: "3A", name: "3 Tier AC", fare: 2790, status: "AVAILABLE - 34", color: "green" },
      { code: "2A", name: "2 Tier AC", fare: 3950, status: "WL 8", color: "red" },
      { code: "1A", name: "First AC", fare: 5900, status: "AVAILABLE - 02", color: "green" }
    ]
  },
  {
    id: "tr-208",
    trainNumber: "12019",
    trainName: "Howrah - Ranchi Shatabdi",
    type: "Shatabdi Express",
    fromCity: "Kolkata",
    fromStation: "Howrah Junction (HWH)",
    toCity: "Ranchi",
    toStation: "Ranchi Junction (RNC)",
    departureTime: "06:05 AM",
    arrivalTime: "01:15 PM",
    duration: "7h 10m",
    runsOn: ["Daily except Sun"],
    catering: "Breakfast & Lunch Provided",
    classes: [
      { code: "CC", name: "AC Chair Car", fare: 1220, status: "AVAILABLE - 46", color: "green" },
      { code: "EC", name: "Exec. Chair Car", fare: 2180, status: "AVAILABLE - 10", color: "green" }
    ]
  }
];

export const STATIONS = [
  { code: "NDLS", city: "New Delhi", name: "New Delhi Railway Station (NDLS)" },
  { code: "MMCT", city: "Mumbai", name: "Mumbai Central (MMCT)" },
  { code: "CSMT", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj Terminus (CSMT)" },
  { code: "SBC", city: "Bengaluru", name: "KSR Bengaluru City (SBC)" },
  { code: "MAS", city: "Chennai", name: "MGR Chennai Central (MAS)" },
  { code: "MS", city: "Chennai", name: "Chennai Egmore (MS)" },
  { code: "HWH", city: "Kolkata", name: "Howrah Junction (HWH)" },
  { code: "BSB", city: "Varanasi", name: "Varanasi Junction (BSB)" },
  { code: "AGC", city: "Agra (Taj Mahal)", name: "Agra Cantt (AGC)" },
  { code: "JP", city: "Jaipur", name: "Jaipur Junction (JP)" },
  { code: "MDU", city: "Madurai (Meenakshi)", name: "Madurai Junction (MDU)" },
  { code: "MAO", city: "Goa", name: "Madgaon Junction (MAO)" }
];
