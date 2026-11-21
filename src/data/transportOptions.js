/**
 * Roavio - Transport Tickets & Carrier Options Generator
 * Provides realistic Flight, Train, AC Bus, and Private Cab travel options for any Indian route
 */

export function getTransportOptions(fromCity = "Coimbatore", toCity = "Ooty") {
  const normFrom = (fromCity || "Departure City").trim();
  const normTo = (toCity || "Ooty").trim();

  const isOoty = normTo.toLowerCase().includes("ooty");

  return {
    flights: [
      {
        id: "fl-1",
        mode: "flight",
        modeName: "Flight",
        operator: "IndiGo Express",
        flightNumber: "6E-2412",
        logo: "✈️",
        from: normFrom,
        to: isOoty ? "Coimbatore Intl Airport (CJB) - Transfer to Ooty" : `${normTo} Airport`,
        depTime: "07:15 AM",
        arrTime: "08:45 AM",
        duration: "1h 30m",
        stopType: "Non-stop",
        classType: "Economy Saver",
        price: 3650,
        inclusions: ["7kg Cabin Baggage", "15kg Check-in Baggage", "Free Seat Selection", "On-time Guarantee"],
        badge: "Fastest Travel"
      },
      {
        id: "fl-2",
        mode: "flight",
        modeName: "Flight",
        operator: "Air India",
        flightNumber: "AI-508",
        logo: "✈️",
        from: normFrom,
        to: isOoty ? "Coimbatore Intl Airport (CJB) - Scenic Transfer" : `${normTo} Hub`,
        depTime: "11:20 AM",
        arrTime: "01:05 PM",
        duration: "1h 45m",
        stopType: "Non-stop",
        classType: "Economy Flexi",
        price: 4450,
        inclusions: ["Complimentary Hot Meal", "25kg Check-in Baggage", "Free Date Change", "Spacious Legroom"],
        badge: "Full Service"
      }
    ],

    trains: [
      {
        id: "tr-1",
        mode: "train",
        modeName: "Train",
        operator: "Vande Bharat Express",
        trainNumber: "20643",
        logo: "🚆",
        from: `${normFrom} Junction`,
        to: isOoty ? "Mettupalayam (MTP) / Nilgiri Gateway" : `${normTo} Junction`,
        depTime: "06:00 AM",
        arrTime: "11:15 AM",
        duration: "5h 15m",
        stopType: "Direct Superfast",
        classType: "AC Chair Car (CC)",
        price: 1350,
        inclusions: ["Complimentary Breakfast & Tea", "Executive Pushback Seats", "Panoramic Wide Windows", "High-Speed Transit"],
        badge: "Top Rated"
      },
      {
        id: "tr-2",
        mode: "train",
        modeName: "Train",
        operator: isOoty ? "Nilgiri Mountain UNESCO Toy Train" : "Superfast Express",
        trainNumber: isOoty ? "06136" : "12675",
        logo: "🚂",
        from: isOoty ? "Mettupalayam (MTP)" : `${normFrom} Station`,
        to: isOoty ? "Udhagamandalam (OOTY)" : `${normTo} Terminal`,
        depTime: "07:10 AM",
        arrTime: "12:00 PM",
        duration: "4h 50m",
        stopType: "Heritage Mountain Track",
        classType: isOoty ? "First Class Heritage Coach" : "3-Tier AC Sleeper (3A)",
        price: isOoty ? 850 : 1050,
        inclusions: [isOoty ? "UNESCO Heritage Mountain Pass" : "Bedding & Linen", "Stunning Nilgiri Ravines & Waterfall Views", "Reserved Seat Guarantee"],
        badge: isOoty ? "UNESCO Heritage Experience" : "Comfort Value"
      }
    ],

    buses: [
      {
        id: "bus-1",
        mode: "bus",
        modeName: "AC Bus",
        operator: "KSRTC / SETC Airavat Club Class",
        busType: "Multi-Axle Volvo AC Sleeper",
        logo: "🚌",
        from: `${normFrom} Central Bus Terminal`,
        to: `${normTo} Bus Stand`,
        depTime: "09:30 PM (Overnight)",
        arrTime: "06:30 AM",
        duration: "9h 00m",
        stopType: "Direct Highway Coach",
        classType: "Premium AC Sleeper Berth",
        price: 950,
        inclusions: ["Clean Bedding & Pillow", "Reading Lamp & Charging Port", "Live Vehicle GPS Tracking", "Mineral Water Bottle"],
        badge: "Overnight Comfort"
      },
      {
        id: "bus-2",
        mode: "bus",
        modeName: "AC Bus",
        operator: "Orange Tours & Travels",
        busType: "BharatBenz AC Seater/Sleeper",
        logo: "🚌",
        from: `${normFrom} Boarding Point`,
        to: `${normTo} Main Drop`,
        depTime: "07:00 AM",
        arrTime: "02:30 PM",
        duration: "7h 30m",
        stopType: "Express",
        classType: "Executive Pushback AC Seater",
        price: 680,
        inclusions: ["Pushback Ergonomic Seats", "Air Conditioned", "Emergency Support", "Rest-Stop at Verified Diner"],
        badge: "Pocket Friendly"
      }
    ],

    cabs: [
      {
        id: "cab-1",
        mode: "cab",
        modeName: "Private Cab",
        operator: "Roavio Private Chauffeur Sedan",
        carModel: "Maruti Dzire / Honda Amaze (AC)",
        logo: "🚗",
        from: `${normFrom} Doorstep Pickup`,
        to: `${normTo} Hotel Drop & Local Sightseeing`,
        depTime: "Flexible (Your Choice)",
        arrTime: "Direct Transit",
        duration: "Scenic Private Drive",
        stopType: "Door-to-door Private Transfer",
        classType: "Sedan (Up to 4 Persons)",
        price: 1850,
        inclusions: ["Doorstep Home Pickup", "English / Regional Speaking Driver", "All Fuel, Tolls & State Border Taxes", "Flexible Photo Stops on Hills"],
        badge: "Private & Flexible"
      },
      {
        id: "cab-2",
        mode: "cab",
        modeName: "Private Cab",
        operator: "Roavio Premium SUV Chauffeur",
        carModel: "Toyota Innova Crysta (Luxury AC)",
        logo: "🚙",
        from: `${normFrom} Doorstep Pickup`,
        to: `${normTo} Hotel Drop & Hills Tour`,
        depTime: "Flexible (Your Choice)",
        arrTime: "Direct Transit",
        duration: "Luxury Hill Drive",
        stopType: "Door-to-door Private Transfer",
        classType: "Spacious SUV (Up to 6-7 Persons)",
        price: 2750,
        inclusions: ["Reclining Captain Seats", "Spacious Luggage Boot", "All Mountain Tolls & Permits Included", "Complimentary Refreshment Kit"],
        badge: "Family / Group Favorite"
      }
    ]
  };
}
