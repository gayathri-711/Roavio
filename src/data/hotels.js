/**
 * Roavio - Realistic Hotels & Resorts Dataset
 * Curated stays categorized by Budget, Comfort, and Luxury across Indian Destinations
 */

export const HOTELS = [
  // ---------------- OOTY, TAMIL NADU ----------------
  {
    id: "hotel-ooty-1",
    destId: "ooty",
    city: "Ooty",
    state: "Tamil Nadu",
    name: "Nilgiri Mountain Cloud Homestay",
    tier: "budget",
    tierName: "Budget Homestay",
    rating: 4.3,
    reviewsCount: 840,
    pricePerNight: 1450,
    image: "/assets/img/india-tours/ooty.jpg",
    roomType: "Deluxe Mountain View Room",
    amenities: ["Free High-Speed Wi-Fi", "Hot Water 24/7", "Scenic Valley Balcony", "Local Nilgiri Tea Service", "Complimentary Parking"],
    location: "Near Doddabetta Road, Ooty",
    mealsIncluded: "Morning Tea Included (Meals on request)"
  },
  {
    id: "hotel-ooty-2",
    destId: "ooty",
    city: "Ooty",
    state: "Tamil Nadu",
    name: "Ooty Heritage Pine Resort (3★)",
    tier: "comfort",
    tierName: "Comfort 3★ Resort",
    rating: 4.6,
    reviewsCount: 1620,
    pricePerNight: 2850,
    image: "/assets/img/india-tours/ooty.jpg",
    roomType: "Superior Pine Valley Cottage",
    amenities: ["Complimentary Buffet Breakfast", "Heated Rooms", "In-house Multi-Cuisine Restaurant", "Campfire & Music", "Free Wi-Fi", "Tour Desk"],
    location: "Charring Cross / Botanical Garden Road, Ooty",
    mealsIncluded: "Complimentary Daily Breakfast Buffet"
  },
  {
    id: "hotel-ooty-3",
    destId: "ooty",
    city: "Ooty",
    state: "Tamil Nadu",
    name: "Sterling Ooty Fern Hill Luxury Resort (4★/5★)",
    tier: "luxury",
    tierName: "Luxury 4★/5★ Resort",
    rating: 4.8,
    reviewsCount: 3150,
    pricePerNight: 5900,
    image: "/assets/img/india-tours/ooty.jpg",
    roomType: "Premium Valley Suite with Panoramic Deck",
    amenities: ["Buffet Breakfast & Dinner Included", "Spa & Wellness Center", "Indoor Heated Activity Zone", "Private Tea Plantation Walk", "24/7 Concierge"],
    location: "Fern Hill Estate, Ooty",
    mealsIncluded: "Daily Breakfast & Chef Dinner Buffet Included"
  },

  // ---------------- TAJ MAHAL / AGRA, UTTAR PRADESH ----------------
  {
    id: "hotel-agra-1",
    destId: "taj-mahal",
    city: "Agra",
    state: "Uttar Pradesh",
    name: "Taj View Budget Inn & Homestay",
    tier: "budget",
    tierName: "Budget Homestay",
    rating: 4.2,
    reviewsCount: 920,
    pricePerNight: 1250,
    image: "/assets/img/india-tours/taj-mahal.jpg",
    roomType: "Standard Air-Conditioned Room",
    amenities: ["Free Wi-Fi", "Rooftop Taj Mahal Silhouette View", "24/7 Hot Water", "Power Backup"],
    location: "Taj East Gate Road, Agra",
    mealsIncluded: "Bed & Morning Masala Chai"
  },
  {
    id: "hotel-agra-2",
    destId: "taj-mahal",
    city: "Agra",
    state: "Uttar Pradesh",
    name: "Courtyard by Marriott / Heritage Agra (3★)",
    tier: "comfort",
    tierName: "Comfort 3★ Hotel",
    rating: 4.6,
    reviewsCount: 2450,
    pricePerNight: 3200,
    image: "/assets/img/india-tours/taj-mahal.jpg",
    roomType: "Deluxe City Room",
    amenities: ["Complimentary Buffet Breakfast", "Swimming Pool", "Fitness Center", "Mughlai Dining Restaurant", "Fast Taj Shuttle"],
    location: "Fatehabad Road, Agra",
    mealsIncluded: "Complimentary Royal Breakfast Buffet"
  },
  {
    id: "hotel-agra-3",
    destId: "taj-mahal",
    city: "Agra",
    state: "Uttar Pradesh",
    name: "The Oberoi Amarvilas Luxury Heritage (5★)",
    tier: "luxury",
    tierName: "Luxury 5★ Resort",
    rating: 4.9,
    reviewsCount: 4120,
    pricePerNight: 8500,
    image: "/assets/img/india-tours/taj-mahal.jpg",
    roomType: "Premier Room with Uninterrupted Taj Mahal View",
    amenities: ["Private Balcony Facing Taj Mahal", "World-Class Ayurvedic Spa", "Fine Dining", "Golf Cart Transit to Monument", "Personal Butler Service"],
    location: "600m from Taj Mahal, Taj East Gate",
    mealsIncluded: "All Meals & Royal Mughlai Dining Experience"
  },

  // ---------------- MUNNAR, KERALA ----------------
  {
    id: "hotel-munnar-1",
    destId: "munnar",
    city: "Munnar",
    state: "Kerala",
    name: "Munnar Green Mist Valley Homestay",
    tier: "budget",
    tierName: "Budget Homestay",
    rating: 4.3,
    reviewsCount: 680,
    pricePerNight: 1350,
    image: "/assets/img/india-tours/munnar-tea-hills.jpg",
    roomType: "Tea Garden View Standard Room",
    amenities: ["Free Wi-Fi", "Hot Showers", "Tea Plantation Walk", "Home-Cooked Kerala Food"],
    location: "Old Munnar Hills, Kerala",
    mealsIncluded: "Authentic Kerala Breakfast"
  },
  {
    id: "hotel-munnar-2",
    destId: "munnar",
    city: "Munnar",
    state: "Kerala",
    name: "Tea County Hill Resort Munnar (3★)",
    tier: "comfort",
    tierName: "Comfort 3★ Resort",
    rating: 4.7,
    reviewsCount: 2280,
    pricePerNight: 3100,
    image: "/assets/img/india-tours/munnar-tea-hills.jpg",
    roomType: "Superior Pine Valley Cottage",
    amenities: ["Complimentary Breakfast & Dinner", "Campfire", "Ayurvedic Massage Center", "Activity Games Room", "Mountain Balcony"],
    location: "KTDC Hill, Munnar",
    mealsIncluded: "Daily Buffet Breakfast & Dinner"
  },
  {
    id: "hotel-munnar-3",
    destId: "munnar",
    city: "Munnar",
    state: "Kerala",
    name: "Fragrant Nature Luxury Resort & Spa (5★)",
    tier: "luxury",
    tierName: "Luxury 5★ Resort",
    rating: 4.9,
    reviewsCount: 3890,
    pricePerNight: 6900,
    image: "/assets/img/india-tours/munnar-tea-hills.jpg",
    roomType: "Honeymoon Mountain Villa with Fireplace",
    amenities: ["Private Jacuzzi & Fireplace", "Infinity Mountain Pool", "Ayurvedic Wellness Spa", "All Meals Included", "Tea Tasting Tour"],
    location: "Pothamedu Viewpoint Road, Munnar",
    mealsIncluded: "All Daily Gourmet Meals & High Tea"
  },

  // ---------------- JAIPUR, RAJASTHAN ----------------
  {
    id: "hotel-jaipur-1",
    destId: "jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    name: "Pink City Haveli Homestay",
    tier: "budget",
    tierName: "Budget Homestay",
    rating: 4.2,
    reviewsCount: 790,
    pricePerNight: 1200,
    image: "/assets/img/india-tours/amber-fort-jaipur.jpg",
    roomType: "Rajasthani Traditional Room",
    amenities: ["Air Conditioned", "Free Wi-Fi", "Rooftop Fort View", "Rajasthani Thali Dining"],
    location: "Old City Pink City, Jaipur",
    mealsIncluded: "Morning Tea & Poha / Paratha"
  },
  {
    id: "hotel-jaipur-2",
    destId: "jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    name: "Alsisar Haveli Heritage Hotel (3★)",
    tier: "comfort",
    tierName: "Comfort 3★ Heritage",
    rating: 4.7,
    reviewsCount: 1980,
    pricePerNight: 3400,
    image: "/assets/img/india-tours/amber-fort-jaipur.jpg",
    roomType: "Royal Heritage Courtyard Room",
    amenities: ["Complimentary Breakfast", "Swimming Pool", "Folk Dance Shows", "Palace Courtyard Dining", "Free Wi-Fi"],
    location: "Sansar Chandra Road, Jaipur",
    mealsIncluded: "Royal Rajasthani Buffet Breakfast"
  },
  {
    id: "hotel-jaipur-3",
    destId: "jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    name: "Taj Rambagh Palace (5★)",
    tier: "luxury",
    tierName: "Luxury 5★ Palace",
    rating: 4.9,
    reviewsCount: 5200,
    pricePerNight: 9800,
    image: "/assets/img/india-tours/amber-fort-jaipur.jpg",
    roomType: "Palace Chamber with Garden Courtyard",
    amenities: ["Vintage Car Airport Transfer", "Royal Butler", "Jiva Grand Spa", "All Meals & High Tea", "Historic Palace Tour"],
    location: "Bhawani Singh Road, Jaipur",
    mealsIncluded: "All Royal Dining & High Tea Included"
  },

  // ---------------- GOA ----------------
  {
    id: "hotel-goa-1",
    destId: "goa",
    city: "Goa",
    state: "Goa",
    name: "Calangute Sunshine Beach Homestay",
    tier: "budget",
    tierName: "Budget Beach Stay",
    rating: 4.3,
    reviewsCount: 1100,
    pricePerNight: 1400,
    image: "/assets/img/india-tours/red-fort-delhi.jpg",
    roomType: "AC Deluxe Room near Beach",
    amenities: ["300m to Beach", "Air Conditioning", "Free Wi-Fi", "Scooter Rental Desk"],
    location: "Calangute Beach Road, North Goa",
    mealsIncluded: "Free Morning Tea"
  },
  {
    id: "hotel-goa-2",
    destId: "goa",
    city: "Goa",
    state: "Goa",
    name: "Lemon Tree Amarante Beach Resort (3★)",
    tier: "comfort",
    tierName: "Comfort 3★ Resort",
    rating: 4.6,
    reviewsCount: 2750,
    pricePerNight: 3500,
    image: "/assets/img/india-tours/red-fort-delhi.jpg",
    roomType: "Heritage Superior Room with Balcony",
    amenities: ["Complimentary Breakfast Buffet", "Outdoor Swimming Pool", "Beach Access", "Poolside Bar & Grill", "Spa"],
    location: "Candolim Beach, Goa",
    mealsIncluded: "Daily Coastal Buffet Breakfast"
  },
  {
    id: "hotel-goa-3",
    destId: "goa",
    city: "Goa",
    state: "Goa",
    name: "Taj Exotica Resort & Spa (5★)",
    tier: "luxury",
    tierName: "Luxury 5★ Beach Resort",
    rating: 4.9,
    reviewsCount: 4600,
    pricePerNight: 8900,
    image: "/assets/img/india-tours/red-fort-delhi.jpg",
    roomType: "Villa with Private Plunge Pool & Sea View",
    amenities: ["Private Beach", "Golf Course", "Jiva Spa", "All Inclusive Dining", "Water Sports Concierge"],
    location: "Benaulim, South Goa",
    mealsIncluded: "All Meals & Seafood Buffet Included"
  }
];

// Helper to get hotels for a specific destination with intelligent fallback
export function getHotelsForDestination(destId, destCity) {
  const normId = String(destId || "").toLowerCase();
  const normCity = String(destCity || "").toLowerCase();

  const matched = HOTELS.filter(h => 
    h.destId === normId || 
    normId.includes(h.destId) || 
    h.city.toLowerCase() === normCity ||
    normCity.includes(h.city.toLowerCase())
  );

  if (matched.length > 0) return matched;

  // Generic fallback hotels customized for any city
  const cityName = destCity || "Destined City";
  return [
    {
      id: `gen-hotel-1-${normId}`,
      destId: normId,
      city: cityName,
      state: "India",
      name: `${cityName} Comfort Travelers Lodge`,
      tier: "budget",
      tierName: "Budget Homestay",
      rating: 4.2,
      reviewsCount: 640,
      pricePerNight: 1350,
      image: "/assets/img/india-tours/ooty.jpg",
      roomType: "Standard AC Room",
      amenities: ["Free Wi-Fi", "24/7 Hot Water", "City Center Access", "Parking"],
      location: `Central ${cityName}`,
      mealsIncluded: "Morning Tea Included"
    },
    {
      id: `gen-hotel-2-${normId}`,
      destId: normId,
      city: cityName,
      state: "India",
      name: `${cityName} Grand Valley Resort (3★)`,
      tier: "comfort",
      tierName: "Comfort 3★ Hotel",
      rating: 4.6,
      reviewsCount: 1820,
      pricePerNight: 2950,
      image: "/assets/img/india-tours/ooty.jpg",
      roomType: "Deluxe Premium Room with Balcony",
      amenities: ["Buffet Breakfast Included", "Multi-Cuisine Restaurant", "Free Wi-Fi", "Tour Concierge", "Power Backup"],
      location: `Scenic Road, ${cityName}`,
      mealsIncluded: "Daily Complimentary Breakfast Buffet"
    },
    {
      id: `gen-hotel-3-${normId}`,
      destId: normId,
      city: cityName,
      state: "India",
      name: `${cityName} Royal Heritage Luxury Resort (4★/5★)`,
      tier: "luxury",
      tierName: "Luxury 4★/5★ Resort",
      rating: 4.8,
      reviewsCount: 3100,
      pricePerNight: 6200,
      image: "/assets/img/india-tours/ooty.jpg",
      roomType: "Luxury Suite with Panoramic Balcony",
      amenities: ["All Meals Included", "Swimming Pool & Wellness Spa", "Executive Lounge", "24/7 Butler Service"],
      location: `VIP Estate, ${cityName}`,
      mealsIncluded: "All Daily Buffet Meals Included"
    }
  ];
}
