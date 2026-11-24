import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Car, 
  Plane, 
  Train, 
  Bus, 
  Navigation, 
  Sparkles, 
  BookmarkCheck,
  ChevronRight,
  MoveUp,
  MoveDown,
  Eye,
  ExternalLink,
  CreditCard,
  ShieldCheck,
  Check,
  X,
  Smartphone,
  Lock,
  Building2,
  Ticket,
  QrCode,
  IndianRupee,
  AlertCircle,
  Phone,
  Mail,
  User,
  Star,
  Coffee,
  Utensils,
  Bed,
  Hotel,
  Layers,
  Luggage,
  Sliders,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  HeartHandshake
} from "lucide-react";
import { DESTINATIONS, calculateDistanceKm, getDestinationById } from "../data/destinations";
import { getHotelsForDestination } from "../data/hotels";
import { getTransportOptions } from "../data/transportOptions";
import { useTrips } from "../context/TripsContext";
import { useAuth } from "../context/AuthContext";
import MapComponent from "../components/MapComponent";

export default function PlanJourney() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login } = useAuth();
  const { userLocation, requestUserLocation, addPlannedTrip, addBooking } = useTrips();

  // Extract selected place from URL search parameters (dest, id, place, or to)
  const destQuery = searchParams.get("dest") || searchParams.get("id") || searchParams.get("place") || searchParams.get("to");
  const matchedInitial = destQuery ? getDestinationById(destQuery) : null;

  // Quick Explore Modal State
  const [quickExploreDest, setQuickExploreDest] = useState(null);
  const [activeExploreImg, setActiveExploreImg] = useState("");

  // Registration & Payment Checkout Modal State
  const [tripRegisterModalOpen, setTripRegisterModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  // Traveler Details Form State
  const [leadName, setLeadName] = useState(user?.name || "Rahul Sharma");
  const [leadPhone, setLeadPhone] = useState(user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : "9876543210");
  const [leadEmail, setLeadEmail] = useState(user?.email || "rahul.sharma@example.com");
  const [emergencyPhone, setEmergencyPhone] = useState("9811223344");

  // Keep traveler state synchronized when user logs in or switches account
  useEffect(() => {
    if (user) {
      if (user.name) setLeadName(user.name);
      if (user.phone) setLeadPhone(user.phone.replace(/\D/g, '').slice(-10));
      if (user.email) setLeadEmail(user.email);
    }
  }, [user]);

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" | "card" | "netbanking"
  const [upiId, setUpiId] = useState("traveler@okaxis");
  const [upiApp, setUpiApp] = useState("gpay");
  const [cardNumber, setCardNumber] = useState("4532 8920 1142 8821");
  const [cardExpiry, setCardExpiry] = useState("11/29");
  const [cardCvv, setCardCvv] = useState("824");
  const [cardName, setCardName] = useState("Rahul Sharma");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Planning Form State - dynamically centered around the user's chosen destination
  const [tripType, setTripType] = useState("direct"); // "direct" (Go only to selected place) | "circuit" (Multi-Stop Tour)
  const [showDestDetails, setShowDestDetails] = useState(false);
  const [tripTitle, setTripTitle] = useState(
    matchedInitial ? `Trip to ${matchedInitial.name}` : "Trip to Ooty, Tamil Nadu"
  );
  const [sourceCity, setSourceCity] = useState(searchParams.get("from") || "Coimbatore");

  // Auto-sync starting sourceCity if live GPS location is detected
  useEffect(() => {
    if (userLocation && userLocation.isLive && userLocation.city) {
      if (!sourceCity || sourceCity === "Coimbatore" || sourceCity === "New Delhi") {
        setSourceCity(userLocation.city);
      }
    }
  }, [userLocation?.isLive, userLocation?.city]);

  const [startDate, setStartDate] = useState(searchParams.get("date") || "2026-12-15");
  const [endDate, setEndDate] = useState("2026-12-17");
  const [travelersCount, setTravelersCount] = useState(
    parseInt(searchParams.get("travelers")) || 2
  );
  const [tripDurationDays, setTripDurationDays] = useState(2);
  const [nightsCount, setNightsCount] = useState(1);

  // Selected Destinations List - ONLY the clicked place by default (no unwanted round-trips or extra cities)
  const [selectedDestIds, setSelectedDestIds] = useState(() => {
    if (matchedInitial) {
      return [matchedInitial.id];
    }
    return ["ooty"];
  });

  // Expandable "See Details / Hide" state for tourist stops, hotels & packages
  const [expandedStopIds, setExpandedStopIds] = useState([]);
  const toggleStopDetails = (id) => {
    setExpandedStopIds((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const [expandedHotelIds, setExpandedHotelIds] = useState([]);
  const toggleHotelDetails = (id) => {
    setExpandedHotelIds((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const [expandedPackageIds, setExpandedPackageIds] = useState(["fixed_2day"]);
  const togglePackageDetails = (id) => {
    setExpandedPackageIds((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // =========================================================================
  // TWO-CHOICE ARCHITECTURE STATE
  // Mode: "custom" (Choice 1: Custom Build) vs "fixed" (Choice 2: Roavio Fixed Budget Package)
  // =========================================================================
  const [planMode, setPlanMode] = useState("custom"); // "custom" | "fixed"

  // CHOICE 1 (CUSTOM BUILD) STATE:
  // 1. Transport Ticket Selection:
  const [transportModeFilter, setTransportModeFilter] = useState("all"); // "all" | "flights" | "trains" | "buses" | "cabs"
  const [selectedTransportTicketId, setSelectedTransportTicketId] = useState("tr-1");

  // 2. Hotel Selection by Budget:
  const [hotelTierFilter, setHotelTierFilter] = useState("all"); // "all" | "budget" | "comfort" | "luxury"
  const [selectedHotelId, setSelectedHotelId] = useState("hotel-ooty-2");

  // 3. Meals & Sightseeing Inclusions:
  const [mealPlan, setMealPlan] = useState("all_meals"); // "all_meals" (₹750/day) | "breakfast_only" (₹250/day) | "no_meals" (₹0)
  const [includeSightseeingPasses, setIncludeSightseeingPasses] = useState(true);

  // CHOICE 2 (ROAVIO FIXED BUDGET PACKAGES) STATE:
  const [selectedFixedPackageId, setSelectedFixedPackageId] = useState("fixed_2day");

  const [tripNotes, setTripNotes] = useState(
    matchedInitial 
      ? `Direct journey to ${matchedInitial.name} in ${matchedInitial.city}, ${matchedInitial.state}. Best season: ${matchedInitial.bestTime}.`
      : "Direct trip focusing on local sights, nature, and peaceful relaxation."
  );

  // Automatically update the itinerary when user navigates or clicks "Plan" on another place
  useEffect(() => {
    const q = searchParams.get("dest") || searchParams.get("id") || searchParams.get("place") || searchParams.get("to");
    if (q) {
      const target = getDestinationById(q);
      if (target) {
        // Direct trip: ONLY the selected destination
        setSelectedDestIds([target.id]);
        setTripTitle(`Trip to ${target.name}`);
        setTripNotes(`Direct journey to ${target.name} in ${target.city}, ${target.state}. Best season: ${target.bestTime}.`);
      }
    }
    const fromParam = searchParams.get("from");
    if (fromParam) setSourceCity(fromParam);
    const dateParam = searchParams.get("date");
    if (dateParam) {
      setStartDate(dateParam);
      const d = new Date(dateParam);
      d.setDate(d.getDate() + 2);
      setEndDate(d.toISOString().split("T")[0]);
    }
    const travParam = searchParams.get("travelers");
    if (travParam) {
      const num = parseInt(travParam);
      if (!isNaN(num) && num > 0) setTravelersCount(num);
    }
  }, [searchParams]);

  const [searchToAdd, setSearchToAdd] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available destinations to pick from
  const availableToAdd = useMemo(() => {
    if (!searchToAdd.trim()) return [];
    return DESTINATIONS.filter(
      (d) => 
        !selectedDestIds.includes(d.id) &&
        (d.name.toLowerCase().includes(searchToAdd.toLowerCase()) ||
         d.state.toLowerCase().includes(searchToAdd.toLowerCase()) ||
         d.category.toLowerCase().includes(searchToAdd.toLowerCase()))
    ).slice(0, 6);
  }, [searchToAdd, selectedDestIds]);

  // Selected destinations objects
  const selectedDestinations = useMemo(() => {
    return selectedDestIds
      .map((id) => DESTINATIONS.find((d) => d.id === id))
      .filter(Boolean);
  }, [selectedDestIds]);

  // Primary Destination Spotlight
  const primaryDest = selectedDestinations[0] || DESTINATIONS.find(d => d.id === "ooty") || DESTINATIONS[0];

  // Total estimated distance between successive stops or direct point-to-point
  const totalDistanceKm = useMemo(() => {
    if (selectedDestinations.length === 0) return 0;
    if (selectedDestinations.length === 1) {
      const origLat = userLocation?.lat || 28.6139;
      const origLng = userLocation?.lng || 77.2090;
      return calculateDistanceKm(origLat, origLng, selectedDestinations[0].lat, selectedDestinations[0].lng);
    }
    let dist = 0;
    for (let i = 0; i < selectedDestinations.length - 1; i++) {
      dist += calculateDistanceKm(
        selectedDestinations[i].lat,
        selectedDestinations[i].lng,
        selectedDestinations[i + 1].lat,
        selectedDestinations[i + 1].lng
      );
    }
    return dist;
  }, [selectedDestinations, userLocation]);

  // Handle duration changes from buttons or date inputs
  const handleSelectDurationDays = (days) => {
    setTripDurationDays(days);
    const nights = Math.max(1, days - 1);
    setNightsCount(nights);
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + nights);
      setEndDate(end.toISOString().split("T")[0]);
    }
  };

  // Recalculate duration when date inputs change
  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diffMs = e - s;
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setNightsCount(diffDays);
        setTripDurationDays(diffDays + 1);
      }
    }
  }, [startDate, endDate]);

  // Available Hotels for the chosen destination
  const availableHotels = useMemo(() => {
    return getHotelsForDestination(primaryDest?.id, primaryDest?.city);
  }, [primaryDest]);

  // Filtered hotels based on budget tier
  const filteredHotels = useMemo(() => {
    if (hotelTierFilter === "all") return availableHotels;
    return availableHotels.filter(h => h.tier === hotelTierFilter);
  }, [availableHotels, hotelTierFilter]);

  // Active selected hotel
  const selectedHotel = useMemo(() => {
    return availableHotels.find(h => h.id === selectedHotelId) || availableHotels[0] || {
      id: "hotel-fallback",
      name: `${primaryDest?.city || "Ooty"} Scenic Pine Valley Resort`,
      tier: "comfort",
      tierName: "Comfort 3★ Resort",
      rating: 4.6,
      reviewsCount: 1450,
      pricePerNight: 2850,
      roomType: "Superior Deluxe Mountain Room",
      amenities: ["Free Wi-Fi", "Hot Water 24/7", "Breakfast Included", "Scenic Balcony"],
      mealsIncluded: "Complimentary Daily Breakfast Buffet"
    };
  }, [availableHotels, selectedHotelId, primaryDest]);

  // Available Transport Options for the route (Source ➔ Destination)
  const rawTransport = useMemo(() => {
    return getTransportOptions(sourceCity, primaryDest?.city || primaryDest?.name || "Ooty");
  }, [sourceCity, primaryDest]);

  // Flattened and filtered transport tickets list
  const transportTicketsList = useMemo(() => {
    const all = [
      ...rawTransport.flights,
      ...rawTransport.trains,
      ...rawTransport.buses,
      ...rawTransport.cabs
    ];
    if (transportModeFilter === "all") return all;
    if (transportModeFilter === "flights") return rawTransport.flights;
    if (transportModeFilter === "trains") return rawTransport.trains;
    if (transportModeFilter === "buses") return rawTransport.buses;
    if (transportModeFilter === "cabs") return rawTransport.cabs;
    return all;
  }, [rawTransport, transportModeFilter]);

  // Active selected transport ticket
  const selectedTransportTicket = useMemo(() => {
    const all = [
      ...rawTransport.flights,
      ...rawTransport.trains,
      ...rawTransport.buses,
      ...rawTransport.cabs
    ];
    return all.find(t => t.id === selectedTransportTicketId) || all[0];
  }, [rawTransport, selectedTransportTicketId]);

  // =========================================================================
  // CHOICE 1: DYNAMIC COST CALCULATION
  // Formula: ((Transport * 2 return) + (Hotel * Nights * Rooms) + (Food * Days) + Passes) * Travelers
  // =========================================================================
  const roomsCount = Math.ceil(travelersCount / 2);
  const returnTransportPerPerson = (selectedTransportTicket?.price || 1250) * 2;
  const totalTransportCost = returnTransportPerPerson * travelersCount;

  const totalHotelCost = (selectedHotel?.pricePerNight || 2850) * nightsCount * roomsCount;
  const hotelPerPerson = Math.round(totalHotelCost / travelersCount);

  const mealDailyRate = mealPlan === "all_meals" ? 750 : (mealPlan === "breakfast_only" ? 250 : 0);
  const totalFoodCost = mealDailyRate * tripDurationDays * travelersCount;
  const foodPerPerson = mealDailyRate * tripDurationDays;

  const passesCostPerPerson = includeSightseeingPasses ? 450 : 0;
  const totalPassesCost = passesCostPerPerson * travelersCount;

  const customTotalCost = totalTransportCost + totalHotelCost + totalFoodCost + totalPassesCost;
  const customPerPerson = Math.round(customTotalCost / travelersCount);

  // =========================================================================
  // CHOICE 2: ROAVIO FIXED BUDGET PACKAGES
  // E.g., ₹9,999 2-Day Ooty Plan, ₹14,999 3-Day Plan, ₹21,999 4-Day Plan
  // =========================================================================
  const fixedPackages = useMemo(() => {
    const destName = primaryDest?.name || "Ooty";
    const destCity = primaryDest?.city || "Ooty";

    return [
      {
        id: "fixed_2day",
        name: `₹9,999 All-Inclusive 2-Day ${destName} Plan`,
        duration: "2 Days / 1 Night",
        durationDays: 2,
        pricePerPerson: 9999,
        tag: "MOST POPULAR FIXED PLAN",
        tagClass: "badge-green",
        highlights: "Roavio arranges confirmed return travel tickets, hotel stay, all meals & sightseeing under fixed ₹9,999",
        facilities: [
          `Confirmed Return Travel Tickets (${sourceCity} ⇄ ${destCity})`,
          `1 Night Stay at Verified Mountain Pine Resort in ${destCity}`,
          "All Daily Meals (Welcome Drink, Lunch, Buffet Dinner & Breakfast)",
          `Dedicated Sightseeing Cab + Toy Train / Monument Entry Pass`,
          "Zero Hidden Charges - All inclusive fixed rate"
        ]
      },
      {
        id: "fixed_3day",
        name: `₹14,999 Complete 3-Day ${destName} Vacation`,
        duration: "3 Days / 2 Nights",
        durationDays: 3,
        pricePerPerson: 14999,
        tag: "FAMILY & COUPLE FAVORITE",
        tagClass: "badge-blue",
        highlights: "3 Days / 2 Nights complete holiday with 3★ resort, full sightseeing chauffeur, and daily gourmet meals",
        facilities: [
          `Confirmed Return Vande Bharat / Superfast Express / Air Tickets`,
          `2 Nights Stay at Premium 3★ Valley Resort in ${destCity}`,
          "Daily Buffet Breakfast & Specialty Chef Dinners Included",
          `Full-Day Sightseeing with Private Dedicated Chauffeur`,
          `Fast-Track Entry to all ${destName} attractions & Lake Boating`
        ]
      },
      {
        id: "fixed_4day",
        name: `₹21,999 Royal 4-Day ${destName} Luxury Tour`,
        duration: "4 Days / 3 Nights",
        durationDays: 4,
        pricePerPerson: 21999,
        tag: "VIP LUXURY HOLIDAY",
        tagClass: "badge-purple",
        highlights: "Flight tickets, 4★/5★ luxury resort stay, private SUV cab throughout, and VIP experiences",
        facilities: [
          `Confirmed Flight / Premier Travel with Airport Pickup & Drop`,
          `3 Nights at Sterling / Oberoi 4★/5★ Luxury Hill Resort`,
          "All Gourmet Meals + Evening High Tea & Bonfire Experience",
          `Dedicated Private SUV Cab (Innova Crysta) throughout the 4 days`,
          "VIP Passes, Priority Monument Access & Dedicated Concierge"
        ]
      }
    ];
  }, [primaryDest, sourceCity]);

  const selectedFixedPackage = useMemo(() => {
    return fixedPackages.find(p => p.id === selectedFixedPackageId) || fixedPackages[0];
  }, [fixedPackages, selectedFixedPackageId]);

  const fixedTotalCost = selectedFixedPackage.pricePerPerson * travelersCount;

  // Active total payable amount depending on user's mode choice
  const activePayableTotal = planMode === "custom" ? customTotalCost : fixedTotalCost;
  const activePerPersonRate = planMode === "custom" ? customPerPerson : selectedFixedPackage.pricePerPerson;

  // Day-by-Day Itinerary dynamically reflecting the chosen plan
  const dailyItinerary = useMemo(() => {
    const dest = primaryDest;
    const destName = dest?.name || "Ooty";
    const destCity = dest?.city || "Ooty";
    const activities = dest?.popularActivities || [
      "Scenic Valley Viewpoints",
      "Tea Plantation Stroll",
      "Trekking & Nature Trails"
    ];

    const daysToRender = planMode === "custom" ? tripDurationDays : selectedFixedPackage.durationDays;

    const days = [];
    for (let i = 1; i <= Math.min(daysToRender, 5); i++) {
      if (i === 1) {
        days.push({
          day: "Day 1",
          title: `Departure & Arrival in ${destCity}`,
          schedule: [
            {
              time: "08:00 AM",
              activity: planMode === "custom"
                ? `Board confirmed ${selectedTransportTicket.modeName} (${selectedTransportTicket.operator}) from ${sourceCity}.`
                : `Board Roavio arranged confirmed transit from ${sourceCity} to ${destCity}.`
            },
            {
              time: "01:30 PM",
              activity: planMode === "custom"
                ? `Check-in at ${selectedHotel.name} (${selectedHotel.roomType}). Refresh and relax.`
                : `Arrival and VIP check-in at Roavio verified partner resort in ${destCity}.`
            },
            {
              time: "03:30 PM",
              activity: `Visit ${dest.nearbyAttractions?.[0] || 'Botanical Gardens & Lake Promenade'} with entry pass.`
            },
            {
              time: "08:00 PM",
              activity: mealPlan !== "no_meals" || planMode === "fixed"
                ? "Complimentary dinner buffet at resort restaurant."
                : "Dinner at local cafes of your choice."
            }
          ]
        });
      } else if (i === daysToRender) {
        days.push({
          day: `Day ${i}`,
          title: `Morning Sightseeing & Return Journey`,
          schedule: [
            {
              time: "08:00 AM",
              activity: "Scenic breakfast with valley views and morning photography."
            },
            {
              time: "10:30 AM",
              activity: `Souvenir shopping, local tea & chocolate tasting in ${destCity}. Hotel checkout.`
            },
            {
              time: "02:00 PM",
              activity: planMode === "custom"
                ? `Board return ${selectedTransportTicket.modeName} back to ${sourceCity} with verified tickets.`
                : `Board Roavio arranged return transport back to ${sourceCity}. Trip successfully concluded!`
            }
          ]
        });
      } else {
        days.push({
          day: `Day ${i}`,
          title: `Full-Day ${destName} Sightseeing & Experiences`,
          schedule: [
            {
              time: "08:30 AM",
              activity: "Wholesome morning buffet breakfast."
            },
            {
              time: "10:00 AM",
              activity: `Guided visit to ${destName} viewpoint & ${dest.nearbyAttractions?.[1] || 'Tea Factory'}.`
            },
            {
              time: "02:30 PM",
              activity: `Experience: ${activities[(i - 2) % activities.length] || 'Panoramic viewpoints & nature trail'}.`
            },
            {
              time: "07:30 PM",
              activity: "Campfire, evening music & dinner at resort."
            }
          ]
        });
      }
    }
    return days;
  }, [primaryDest, sourceCity, planMode, selectedTransportTicket, selectedHotel, mealPlan, tripDurationDays, selectedFixedPackage]);

  // Reorder stops
  const moveStop = (index, direction) => {
    const newArr = [...selectedDestIds];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setSelectedDestIds(newArr);
  };

  const removeStop = (id) => {
    setSelectedDestIds(selectedDestIds.filter((item) => item !== id));
  };

  const addStop = (id) => {
    setSelectedDestIds([...selectedDestIds, id]);
    setSearchToAdd("");
  };

  const handleSaveToDashboard = () => {
    const newTrip = {
      title: tripTitle || `${selectedDestinations[0]?.name || "India"} Journey`,
      sourceCity,
      destinationSummary: selectedDestinations.map((d) => d.name).join(" ➔ "),
      dates: `${startDate} to ${endDate}`,
      startDate,
      endDate,
      duration: `${planMode === "custom" ? tripDurationDays : selectedFixedPackage.durationDays} Days / ${nightsCount} Nights`,
      travelers: travelersCount,
      transport: planMode === "custom" ? `${selectedTransportTicket.operator} (${selectedTransportTicket.classType})` : "Roavio Arranged Return Travel",
      hotel: planMode === "custom" ? selectedHotel.name : "Roavio Arranged Resort",
      planChoice: planMode === "custom" ? "Custom Built Plan" : selectedFixedPackage.name,
      estimatedBudget: activePayableTotal,
      stops: selectedDestinations.map((d) => ({
        id: d.id,
        name: d.name,
        state: d.state,
        image: d.image,
        category: d.category
      })),
      notes: tripNotes
    };

    addPlannedTrip(newTrip);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      navigate("/my-trips");
    }, 1500);
  };

  // User Registration & Online Payment Submission
  const handlePayAndConfirmTrip = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to your account before proceeding with payment.");
      return;
    }
    if (!leadName.trim() || !leadPhone.trim() || !leadEmail.trim()) {
      alert("Please provide the Lead Traveler's name, 10-digit mobile number, and email address.");
      return;
    }

    setIsProcessingPayment(true);
    const destSummary = selectedDestinations.map((d) => d.name).join(" ➔ ");
    const bookingTitle = planMode === "custom" 
      ? `${tripTitle} (Custom: ${selectedHotel.name} + ${selectedTransportTicket.operator})`
      : `${tripTitle} (${selectedFixedPackage.name})`;

    const bookingPayload = {
      category: "itinerary",
      title: bookingTitle,
      providerName: "Roavio Certified Tour Partner",
      sourceLocation: sourceCity,
      destination: selectedDestinations.map((d) => d.name).join(", "),
      travelDate: startDate,
      travelTime: "08:00 AM",
      passengers: travelersCount,
      leadPassenger: leadName,
      mobileNumber: leadPhone,
      email: leadEmail,
      seatClass: planMode === "custom" ? selectedTransportTicket.classType : "All-Inclusive Fixed Package",
      hotelName: planMode === "custom" ? selectedHotel.name : "Roavio Verified Partner Resort",
      amount: activePayableTotal,
      paymentStatus: `Verified (${paymentMethod.toUpperCase()})`,
      bookingStatus: "Confirmed"
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });
      const data = await res.json();
      
      const confirmedObj = data.booking || {
        ...bookingPayload,
        bookingId: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
        providerReference: `ROA-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "Confirmed (Verified)"
      };

      // Add to context storage
      addBooking({
        type: "itinerary",
        category: "Tour Package Booking",
        title: confirmedObj.title,
        route: `${sourceCity} ➔ ${selectedDestinations[selectedDestinations.length - 1]?.city || selectedDestinations[0]?.city || "India"}`,
        date: startDate,
        passengers: travelersCount,
        fare: activePayableTotal,
        seat: planMode === "custom" ? `${selectedTransportTicket.operator} + ${selectedHotel.name}` : selectedFixedPackage.name,
        operator: "Roavio Certified Tour Partner",
        leadPassenger: leadName,
        mobileNumber: leadPhone,
        email: leadEmail,
        pnr: confirmedObj.providerReference || `ROA-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
        id: confirmedObj.bookingId || `BK-${Math.floor(10000 + Math.random() * 90000)}`
      });

      addPlannedTrip({
        title: bookingTitle,
        sourceCity,
        destinationSummary: destSummary,
        dates: `${startDate} to ${endDate}`,
        startDate,
        endDate,
        duration: `${planMode === "custom" ? tripDurationDays : selectedFixedPackage.durationDays} Days / ${nightsCount} Nights`,
        travelers: travelersCount,
        transport: planMode === "custom" ? selectedTransportTicket.operator : "Roavio Arranged Travel",
        hotel: planMode === "custom" ? selectedHotel.name : "Roavio Verified Resort",
        estimatedBudget: activePayableTotal,
        stops: selectedDestinations.map((d) => ({
          id: d.id,
          name: d.name,
          state: d.state,
          image: d.image,
          category: d.category
        })),
        notes: tripNotes
      });

      setTimeout(() => {
        setIsProcessingPayment(false);
        setConfirmedBookingData(confirmedObj);
      }, 1400);
    } catch (err) {
      console.warn("Fallback local booking dispatch:", err);
      const fallbackBooking = addBooking({
        type: "itinerary",
        category: "Tour Package Booking",
        title: bookingTitle,
        route: `${sourceCity} ➔ ${selectedDestinations[0]?.city || "India"}`,
        date: startDate,
        passengers: travelersCount,
        fare: activePayableTotal,
        seat: planMode === "custom" ? `${selectedTransportTicket.operator} + ${selectedHotel.name}` : selectedFixedPackage.name,
        operator: "Roavio Certified Tour Partner",
        leadPassenger: leadName,
        mobileNumber: leadPhone,
        email: leadEmail,
        pnr: `ROA-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
        id: `BK-${Math.floor(10000 + Math.random() * 90000)}`
      });

      setTimeout(() => {
        setIsProcessingPayment(false);
        setConfirmedBookingData(fallbackBooking);
      }, 1400);
    }
  };

  return (
    <div className="plan-journey-page">
      {/* =========================================================================
          LUXURY TOURS HERO BANNER WITH BACKGROUND PHOTOGRAPHY & STATS
      ========================================================================= */}
      <section className="plan-hero">
        <div className="plan-hero-overlay"></div>
        <div className="container plan-hero-container">
          <div className="plan-hero-inner">
            <div className="hero-badge-pill">
              <Sparkles size={14} className="text-warning" />
              <span>OFFICIAL ROAVIO INDIA TOURS & ITINERARY ARCHITECT</span>
            </div>
            <h1 className="hero-main-title">
              Plan & Book Your <span className="hero-gradient-text">Incredible India Tour</span>
            </h1>
            <p className="hero-lead-text">
              Curate your personalized holiday with verified 3★ to 5★ resorts, confirmed return travel tickets, and authentic regional meals — or choose Roavio's fixed budget packages starting at ₹9,999!
            </p>

            {/* Quick Hero Value Chips */}
            <div className="hero-stats-row">
              <div className="hero-stat-chip">
                <Compass size={14} className="stat-ico" />
                <span>175+ Curated Sights</span>
              </div>
              <div className="hero-stat-chip">
                <Hotel size={14} className="stat-ico" />
                <span>Verified Handpicked Stays</span>
              </div>
              <div className="hero-stat-chip">
                <Ticket size={14} className="stat-ico" />
                <span>Confirmed Return Travel</span>
              </div>
              <div className="hero-stat-chip">
                <ShieldCheck size={14} className="stat-ico" />
                <span>Instant Verified E-Tickets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 main-planner-container">
        {/* =========================================================================
            TOP ARCHITECTURE: SLEEK SEGMENTED PLANNING MODE SWITCHER
        ========================================================================= */}
        <div className="planner-mode-bar-wrapper mb-4">
          <div className="planner-mode-bar-header">
            <span className="mode-kicker">STEP 1 OF 3 • SELECT PLANNING ARCHITECTURE</span>
            <h2 className="mode-main-title">How Would You Like to Plan Your Holiday?</h2>
            <p className="mode-subtitle">
              Choose between complete custom freedom with itemized live billing, or our fixed all-inclusive budget packages where Roavio arranges return tickets, hotel stay, all meals & sightseeing.
            </p>
          </div>

          <div className="planner-mode-toggle-grid">
            <div
              onClick={() => setPlanMode("custom")}
              className={`mode-toggle-card ${planMode === "custom" ? "active" : ""}`}
              role="button"
              tabIndex={0}
            >
              <div className="mode-toggle-top">
                <div className="mode-icon-box custom">
                  <Sliders size={20} />
                </div>
                <div className="mode-badge-wrap">
                  <span className="mode-badge custom">CHOICE 1: CUSTOM BUILD</span>
                  {planMode === "custom" && <span className="active-check-badge">✓ Active Choice</span>}
                </div>
              </div>
              <h3 className="mode-card-title">Custom Build Your Trip</h3>
              <p className="mode-card-desc">
                Select your hotel tier (Budget, Comfort, Luxury), pick travel tickets (Flight, Train, Bus, Cab), set duration, and view real-time dynamic cost calculation.
              </p>
              <div className="mode-perks-row">
                <span>✓ Selectable Hotels by Budget</span>
                <span>✓ Return Travel Tickets</span>
                <span>✓ Itemized Dynamic Bill</span>
              </div>
            </div>

            <div
              onClick={() => setPlanMode("fixed")}
              className={`mode-toggle-card ${planMode === "fixed" ? "active" : ""}`}
              role="button"
              tabIndex={0}
            >
              <div className="mode-toggle-top">
                <div className="mode-icon-box fixed">
                  <Sparkles size={20} />
                </div>
                <div className="mode-badge-wrap">
                  <span className="mode-badge fixed">CHOICE 2: FIXED PACKAGES</span>
                  {planMode === "fixed" && <span className="active-check-badge">✓ Active Choice</span>}
                </div>
              </div>
              <h3 className="mode-card-title">Roavio All-Inclusive Fixed Packages</h3>
              <p className="mode-card-desc">
                Single fixed all-inclusive rate starting from ₹9,999/person. Roavio takes care of your return travel tickets, hotel resort stay, regional dining & sightseeing!
              </p>
              <div className="mode-perks-row">
                <span>✓ All Facilities Arranged by Roavio</span>
                <span>✓ Return Tickets & Stay Included</span>
                <span>✓ Zero Hidden Surcharges</span>
              </div>
            </div>
          </div>
        </div>

        <div className="planner-grid">
          {/* Left Column: Form & Add Stops */}
          <div className="planner-form-col">
            {/* Step 1: Core Trip Details */}
            <div className="planner-card">
              <div className="card-section-title">
                <span className="step-num">1</span>
                <div>
                  <h3>Trip Essentials & Origin</h3>
                  <p>Choose your starting city, dates, and journey style</p>
                </div>
              </div>

              <div className="form-stack">
                <div className="form-group">
                  <label>Trip Title</label>
                  <input 
                    type="text" 
                    value={tripTitle} 
                    onChange={(e) => setTripTitle(e.target.value)}
                    className="roavio-input" 
                    placeholder="e.g. Ooty Nilgiri Mountain Vacation"
                  />
                </div>

                <div className="form-group">
                  <label className="fw-bold d-block mb-1">Trip Style / Journey Mode</label>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTripType("direct");
                        if (selectedDestIds.length > 1) {
                          setSelectedDestIds([selectedDestIds[0]]);
                        }
                      }}
                      className={`btn btn-sm ${tripType === "direct" ? "btn-primary" : "btn-outline"}`}
                      style={{ flex: 1, padding: "0.65rem 0.85rem", borderRadius: "10px", fontWeight: "700" }}
                    >
                      🎯 Direct Trip (Go Only to {selectedDestinations[0]?.name?.split(" ")[0] || "Destination"})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType("circuit")}
                      className={`btn btn-sm ${tripType === "circuit" ? "btn-primary" : "btn-outline"}`}
                      style={{ flex: 1, padding: "0.65rem 0.85rem", borderRadius: "10px", fontWeight: "700" }}
                    >
                      🔄 Multi-City Circuit (Multiple Stops)
                    </button>
                  </div>
                  <span className="text-muted small d-block mt-1">
                    {tripType === "direct" 
                      ? `✓ Direct destination trip exclusively to ${selectedDestinations[0]?.name || "selected place"} without round-trip circuits or extra cities.`
                      : "✓ Add multiple cities and intermediate stops along your tour route."}
                  </span>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Starting City / Source</label>
                    <div className="input-group-gps">
                      <input 
                        type="text" 
                        value={sourceCity} 
                        onChange={(e) => setSourceCity(e.target.value)}
                        className="roavio-input" 
                        placeholder="e.g. Coimbatore, Bengaluru, Chennai"
                      />
                      <button 
                        type="button" 
                        onClick={async () => {
                          const res = await requestUserLocation();
                          if (res && res.success && res.location) {
                            setSourceCity(res.location.city || res.location.name);
                          }
                        }}
                        className="gps-btn" 
                        title="Use my current GPS Location"
                      >
                        <Navigation size={16} />
                        <span>GPS</span>
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Travelers Count</label>
                    <select 
                      value={travelersCount} 
                      onChange={(e) => setTravelersCount(Number(e.target.value))}
                      className="roavio-select"
                    >
                      <option value={1}>1 Solo Explorer (1 Room)</option>
                      <option value={2}>2 Travelers / Couple (1 Room)</option>
                      <option value={3}>3 Travelers (2 Rooms)</option>
                      <option value={4}>4 Travelers (2 Rooms)</option>
                      <option value={6}>6+ Group Adventure (3 Rooms)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Manage Tourist Stops */}
            <div className="planner-card">
              <div className="card-section-title">
                <span className="step-num">2</span>
                <div>
                  <h3>Select & Order Tourist Attractions</h3>
                  <p>Choose from India's destinations or focus on your chosen place</p>
                </div>
              </div>

              {selectedDestinations.length === 1 && (
                <div className="single-dest-focus-banner p-3 rounded-3 mb-3">
                  <div className="d-flex align-items-start gap-2">
                    <CheckCircle2 size={18} className="text-green flex-shrink-0 mt-1" />
                    <span className="small fw-bold">
                      Direct Trip: Traveling exclusively to {selectedDestinations[0].name} ({selectedDestinations[0].city}, {selectedDestinations[0].state}). No unwanted round-trip circuits or extra cities.
                    </span>
                  </div>
                </div>
              )}

              {/* Destination Search Box */}
              <div className="search-stops-box">
                <div className="search-input-wrap">
                  <MapPin size={18} className="search-icon" />
                  <input 
                    type="text" 
                    value={searchToAdd} 
                    onChange={(e) => setSearchToAdd(e.target.value)}
                    placeholder="Search attraction to add or switch (e.g. Ooty, Munnar, Goa, Jaipur)..."
                    className="stops-search-input" 
                  />
                  {searchToAdd && (
                    <button onClick={() => setSearchToAdd("")} className="clear-search-btn">×</button>
                  )}
                </div>

                {/* Dropdown Suggestions */}
                {availableToAdd.length > 0 && (
                  <div className="stops-results-dropdown">
                    {availableToAdd.map((d) => (
                      <div key={d.id} className="stop-suggestion-row">
                        <img src={d.image} alt={d.name} className="sugg-thumb" />
                        <div className="sugg-info">
                          <span className="sugg-name">{d.name}</span>
                          <span className="sugg-state">{d.state} · {d.category}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setQuickExploreDest(d);
                              setActiveExploreImg(d.image);
                            }}
                            className="btn-quick-explore"
                            title={`Preview ${d.name}`}
                          >
                            <Eye size={13} />
                            <span>Explore</span>
                          </button>
                          <button 
                            onClick={() => addStop(d.id)}
                            className="btn btn-sm btn-primary add-stop-btn"
                          >
                            <Plus size={14} /> Add Stop
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Stops Ordered List with Slide & See Details / Hide Support */}
              <div className="selected-stops-list">
                {selectedDestinations.length === 0 ? (
                  <div className="empty-stops-prompt">
                    <MapPin size={32} className="text-gray" />
                    <p>No destinations added yet. Search above to add attractions to your itinerary.</p>
                  </div>
                ) : (
                  selectedDestinations.map((dest, idx) => {
                    const isExpanded = expandedStopIds.includes(dest.id);
                    return (
                      <div key={dest.id} className="selected-stop-card">
                        {/* Top Bar: Pill on left, Reorder & Delete actions on right */}
                        <div className="stop-card-topbar">
                          <div className="stop-index-pill">
                            {selectedDestinations.length === 1 ? "Direct Destination" : `Stop #${idx + 1}`}
                          </div>

                          <div className="stop-actions">
                            {selectedDestinations.length > 1 && (
                              <>
                                <button 
                                  disabled={idx === 0} 
                                  onClick={() => moveStop(idx, -1)}
                                  className="reorder-btn" 
                                  title="Move stop earlier"
                                >
                                  <MoveUp size={14} />
                                </button>
                                <button 
                                  disabled={idx === selectedDestinations.length - 1} 
                                  onClick={() => moveStop(idx, 1)}
                                  className="reorder-btn" 
                                  title="Move stop later"
                                >
                                  <MoveDown size={14} />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => removeStop(dest.id)}
                              className="delete-stop-btn" 
                              title="Remove from itinerary"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Main Info Row: Thumbnail + Title + Meta */}
                        <div className="stop-card-main">
                          <img src={dest.image} alt={dest.name} className="stop-img" />
                          <div className="stop-details">
                            <h4 className="stop-name">{dest.name}</h4>
                            <span className="stop-state">{dest.city || dest.name}, {dest.state} · {dest.category}</span>
                            <div className="stop-meta-tags">
                              <span className="meta-tag">⏱️ {dest.bestTime}</span>
                              <span className="meta-tag">💰 ₹{dest.estimatedBudget?.toLocaleString()} est.</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Action Row: See Details / Hide + Explore Photo & Link */}
                        <div className="stop-card-footer">
                          <button
                            type="button"
                            onClick={() => toggleStopDetails(dest.id)}
                            className="btn-toggle-details-pill"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp size={14} /> Hide Details
                              </>
                            ) : (
                              <>
                                <ChevronDown size={14} /> See Details
                              </>
                            )}
                          </button>

                          <div className="explore-btn-group">
                            <button
                              type="button"
                              onClick={() => {
                                setQuickExploreDest(dest);
                                setActiveExploreImg(dest.image);
                              }}
                              className="explore-pill-btn"
                              title={`Explore details for ${dest.name}`}
                            >
                              <Eye size={13} />
                              <span>Explore Photo</span>
                            </button>
                            <Link
                              to={`/destination/${dest.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="explore-ext-btn"
                              title="Open destination page in a new tab"
                            >
                              <ExternalLink size={13} />
                            </Link>
                          </div>
                        </div>

                        {/* Expandable Details Drawer */}
                        {isExpanded && (
                          <div className="stop-expanded-drawer">
                            <p className="stop-expanded-desc">{dest.description}</p>
                            {dest.highlights && dest.highlights.length > 0 && (
                              <div className="stop-highlights-wrap">
                                <span className="stop-hl-title">Highlights:</span>
                                {dest.highlights.slice(0, 3).map((h, i) => (
                                  <span key={i} className="stop-hl-chip">✓ {h}</span>
                                ))}
                              </div>
                            )}
                            <div className="stop-extra-specs">
                              <span>🕒 Hours: {dest.openingHours || "Sunrise to Sunset"}</span>
                              <span>🎟️ Entry: {dest.ticketPrice === 0 ? "Free Entry" : `₹${dest.ticketPrice} / person`}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Prominent Destination Details & Explore Showcase */}
            {primaryDest && (
              <div className="dest-spotlight-card mb-4">
                <div className="spotlight-header">
                  <div className="spotlight-header-top">
                    <div className="badge-pills-wrap">
                      <span className="badge-pill-accent">{primaryDest.badge || "Featured Destination"}</span>
                      <span className="badge-pill-cat">{primaryDest.categoryName || primaryDest.category}</span>
                      <span className="badge-pill-rating">★ {primaryDest.rating || "4.7"} ({primaryDest.reviews ? primaryDest.reviews.toLocaleString() : "12,000"} ratings)</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowDestDetails(!showDestDetails)}
                      className="btn-toggle-spotlight"
                    >
                      {showDestDetails ? "Hide Quick Details ▲" : "See Destination Highlights ▼"}
                    </button>
                  </div>
                  <h2 className="spotlight-title mt-2">{primaryDest.name}</h2>
                  <div className="spotlight-loc-row">
                    <MapPin size={15} className="text-green flex-shrink-0" />
                    <span>{primaryDest.city}, {primaryDest.state}</span>
                    <span className="dot-sep">·</span>
                    <Clock size={15} className="text-navy flex-shrink-0" />
                    <span>Best Time: {primaryDest.bestTime}</span>
                  </div>
                </div>

                {showDestDetails && (
                  <div className="spotlight-body mt-3">
                    <div className="spotlight-grid">
                      <div className="spotlight-img-box">
                        <img src={primaryDest.image} alt={primaryDest.name} className="spotlight-main-img" />
                        {primaryDest.gallery && primaryDest.gallery.length > 0 && (
                          <div className="spotlight-thumbs mobile-slide-track">
                            {[primaryDest.image, ...primaryDest.gallery].slice(0, 5).map((gImg, i) => (
                              <img key={i} src={gImg} alt="Gallery" className="spotlight-thumb" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="spotlight-info-box">
                        <p className="spotlight-desc">{primaryDest.description}</p>
                        
                        <div className="spotlight-highlights-block mt-3">
                          <h5>Attraction Highlights & Sightseeing:</h5>
                          <ul className="spotlight-highlights-list">
                            {primaryDest.highlights?.map((h, i) => (
                              <li key={i}>
                                <CheckCircle2 size={15} className="text-green flex-shrink-0 me-1" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="spotlight-activities-pills mt-3">
                          {primaryDest.popularActivities?.map((act, i) => (
                            <span key={i} className="act-pill">🏷️ {act}</span>
                          ))}
                        </div>

                        <div className="spotlight-actions-row mt-3">
                          <button
                            type="button"
                            onClick={() => {
                              setQuickExploreDest(primaryDest);
                              setActiveExploreImg(primaryDest.image);
                            }}
                            className="btn btn-outline btn-sm d-flex align-items-center gap-1"
                          >
                            <Eye size={14} /> Fullscreen Photos & Specs
                          </button>
                          <Link
                            to={`/destination/${primaryDest.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm d-flex align-items-center gap-1"
                          >
                            <ExternalLink size={14} /> Official Destination Guide ↗
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Live Route Map from User's Current GPS Location */}
            {selectedDestinations.length > 0 && (
              <div className="planner-card map-planner-card mb-4" style={{ border: "2px solid #A7F3D0", background: "#F0FDF4" }}>
                <div className="card-section-title" style={{ borderBottom: "1px solid #BBF7D0", paddingBottom: "12px", marginBottom: "16px" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#059669",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "16px"
                  }}>
                    🗺️
                  </div>
                  <div>
                    <h3 style={{ color: "#065F46", margin: "0 0 2px" }}>Interactive Live Route & Road Navigation Radar</h3>
                    <p style={{ color: "#047857", margin: 0, fontSize: "13px" }}>
                      {userLocation.isLive 
                        ? `Live turn-by-turn road route calculated from your GPS location (${userLocation.name})` 
                        : "Turn-by-turn road route from your starting location. Click 'Locate Me' on the map to track live from your device."}
                    </p>
                  </div>
                </div>

                <div className="planner-map-box" style={{ borderRadius: "14px", overflow: "hidden" }}>
                  <MapComponent 
                    userLocation={userLocation}
                    destinations={selectedDestinations}
                    height="420px"
                    showStats={true}
                    interactive={true}
                    allowLocateMe={true}
                  />
                </div>
              </div>
            )}


            {/* =========================================================================
                CHOICE 1: CUSTOM BUILD YOUR TRIP SECTION
                Visible when planMode === "custom"
            ========================================================================= */}
            {planMode === "custom" && (
              <div className="custom-plan-container">
                {/* 1. DECIDE TRIP DURATION (HOW MANY DAYS) */}
                <div className="planner-card">
                  <div className="card-section-title">
                    <span className="step-num">3</span>
                    <div>
                      <h3>Step 1: Decide Trip Duration (How Many Days?)</h3>
                      <p>Select duration preset or customize dates</p>
                    </div>
                  </div>

                  <div className="duration-picker-wrap">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="duration-label m-0">Quick Duration Presets:</label>
                      <span className="mobile-slide-hint d-md-none">👉 Swipe presets</span>
                    </div>

                    <div className="duration-presets-grid mobile-slide-track">
                      {[
                        { days: 2, label: "2 Days / 1 Night", badge: "Weekend Getaway" },
                        { days: 3, label: "3 Days / 2 Nights", badge: "Short Holiday" },
                        { days: 4, label: "4 Days / 3 Nights", badge: "Most Popular" },
                        { days: 5, label: "5 Days / 4 Nights", badge: "Relaxed Tour" },
                        { days: 7, label: "7 Days / 6 Nights", badge: "Full Vacation" }
                      ].map((preset) => {
                        const isSelected = tripDurationDays === preset.days;
                        return (
                          <button
                            key={preset.days}
                            type="button"
                            onClick={() => handleSelectDurationDays(preset.days)}
                            className={`duration-preset-btn mobile-slide-item ${isSelected ? "active" : ""}`}
                          >
                            <div className="preset-top">
                              <span className="preset-days">{preset.days} Days</span>
                              <span className="preset-badge">{preset.badge}</span>
                            </div>
                            <span className="preset-sub">{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="form-row-2 mt-3 pt-3 border-top">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input 
                          type="date" 
                          value={startDate} 
                          onChange={(e) => setStartDate(e.target.value)}
                          className="roavio-input" 
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input 
                          type="date" 
                          value={endDate} 
                          onChange={(e) => setEndDate(e.target.value)}
                          className="roavio-input" 
                        />
                      </div>
                    </div>

                    <div className="duration-selected-alert mt-2">
                      <Calendar size={16} className="text-green flex-shrink-0" />
                      <span>
                        Selected: <strong>{tripDurationDays} Days / {nightsCount} Nights</strong> ({startDate} to {endDate})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. CHOOSE TRAVEL TICKETS (FLIGHT, TRAIN, BUS, CAB) */}
                <div className="planner-card">
                  <div className="card-section-title">
                    <span className="step-num">4</span>
                    <div>
                      <h3>Step 2: Choose Travel Tickets ({sourceCity} ➔ {primaryDest?.city || "Destination"})</h3>
                      <p>Select your preferred travel mode and tickets</p>
                    </div>
                  </div>

                  {/* Mode filter tabs */}
                  <div className="transport-mode-tabs mb-3 mobile-slide-track">
                    {[
                      { id: "all", label: "All Travel Modes", icon: <Sliders size={14} /> },
                      { id: "flights", label: "✈️ Flights", icon: <Plane size={14} /> },
                      { id: "trains", label: "🚆 Trains / Rail", icon: <Train size={14} /> },
                      { id: "buses", label: "🚌 AC Buses", icon: <Bus size={14} /> },
                      { id: "cabs", label: "🚗 Private Cabs", icon: <Car size={14} /> }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTransportModeFilter(tab.id)}
                        className={`transport-tab-btn ${transportModeFilter === tab.id ? "active" : ""}`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mobile-slide-hint d-md-none mb-2">
                    <span>👉 Swipe horizontally to compare tickets</span>
                  </div>

                  {/* Transport tickets list */}
                  <div className="transport-tickets-stack mobile-slide-track">
                    {transportTicketsList.map((ticket) => {
                      const isSelected = selectedTransportTicketId === ticket.id;
                      return (
                        <div 
                          key={ticket.id}
                          onClick={() => setSelectedTransportTicketId(ticket.id)}
                          className={`transport-ticket-card mobile-slide-item ${isSelected ? "selected" : ""}`}
                        >
                          <div className="ticket-card-header">
                            <div className="d-flex align-items-center gap-2">
                              <span className="carrier-logo-badge">{ticket.logo}</span>
                              <div>
                                <h4 className="carrier-name">{ticket.operator}</h4>
                                <span className="carrier-code">{ticket.flightNumber || ticket.trainNumber || ticket.busType || ticket.carModel} · {ticket.classType}</span>
                              </div>
                            </div>
                            <span className="ticket-badge">{ticket.badge}</span>
                          </div>

                          <div className="ticket-timeline-row">
                            <div className="t-time-point">
                              <span className="t-time">{ticket.depTime}</span>
                              <span className="t-city">{ticket.from}</span>
                            </div>
                            <div className="t-duration-mid">
                              <span className="t-dur-val">{ticket.duration}</span>
                              <div className="t-line-track"></div>
                              <span className="t-stop-label">{ticket.stopType}</span>
                            </div>
                            <div className="t-time-point text-end">
                              <span className="t-time">{ticket.arrTime}</span>
                              <span className="t-city">{ticket.to}</span>
                            </div>
                          </div>

                          <div className="ticket-inclusions-chips">
                            {ticket.inclusions.map((inc, i) => (
                              <span key={i} className="inc-chip">✓ {inc}</span>
                            ))}
                          </div>

                          <div className="ticket-footer-row">
                            <div className="ticket-price-info">
                              <div className="d-flex align-items-baseline gap-1">
                                <span className="t-price-currency">₹</span>
                                <span className="t-price-num">{ticket.price.toLocaleString()}</span>
                                <span className="t-price-unit">/ person</span>
                              </div>
                              <span className="t-return-note">Round-trip (Return): <strong>₹{(ticket.price * 2).toLocaleString()}</strong></span>
                            </div>

                            <button 
                              type="button" 
                              className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline"}`}
                            >
                              {isSelected ? "Selected ✓" : "Select Ticket"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. CHOOSE HOTEL BY BUDGET */}
                <div className="planner-card">
                  <div className="card-section-title">
                    <span className="step-num">5</span>
                    <div>
                      <h3>Step 3: Choose Hotel by Considering Your Budget</h3>
                      <p>Verified partner hotels & resorts in {primaryDest?.city || "destination"}</p>
                    </div>
                  </div>

                  {/* Hotel budget tier filter pills */}
                  <div className="hotel-tier-pills mb-3 mobile-slide-track">
                    {[
                      { id: "all", label: "All Stays" },
                      { id: "budget", label: "Budget Homestay (₹1k-₹2k)" },
                      { id: "comfort", label: "Comfort 3★ Resort (₹2.5k-₹3.5k)" },
                      { id: "luxury", label: "Luxury 4★/5★ Resort (₹5k+)" }
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setHotelTierFilter(pill.id)}
                        className={`hotel-tier-btn ${hotelTierFilter === pill.id ? "active" : ""}`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  <div className="mobile-slide-hint d-md-none mb-2">
                    <span>👉 Swipe horizontally to browse Hotels by budget</span>
                  </div>

                  {/* Hotels list with slide-and-see and expandable details */}
                  <div className="hotels-selection-stack mobile-slide-track">
                    {filteredHotels.map((hotel) => {
                      const isSelected = selectedHotelId === hotel.id;
                      const roomStayTotal = hotel.pricePerNight * nightsCount * roomsCount;
                      const isHotelExpanded = expandedHotelIds.includes(hotel.id);
                      return (
                        <div 
                          key={hotel.id}
                          onClick={() => setSelectedHotelId(hotel.id)}
                          className={`hotel-select-card mobile-slide-item ${isSelected ? "selected" : ""}`}
                        >
                          <div className="hotel-card-left">
                            <img src={hotel.image} alt={hotel.name} className="hotel-card-img" />
                            <span className="hotel-rating-chip">★ {hotel.rating} ({hotel.reviewsCount})</span>
                          </div>

                          <div className="hotel-card-center">
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                              <span className={`hotel-tier-badge tier-${hotel.tier}`}>{hotel.tierName}</span>
                              <span className="hotel-loc-text"><MapPin size={12} /> {hotel.location}</span>
                            </div>

                            <h4 className="hotel-title">{hotel.name}</h4>
                            <p className="hotel-room-type"><strong>Room:</strong> {hotel.roomType}</p>
                            <p className="hotel-meals-tag"><Utensils size={13} /> {hotel.mealsIncluded}</p>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleHotelDetails(hotel.id);
                              }}
                              className="btn-toggle-hotel-details"
                            >
                              {isHotelExpanded ? "Hide Amenities ▲" : "See Amenities & Specs ▼"}
                            </button>

                            {isHotelExpanded && (
                              <div className="hotel-amenities-row mt-2">
                                {hotel.amenities.map((am, i) => (
                                  <span key={i} className="am-chip">• {am}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="hotel-card-right">
                            <div className="hotel-price-block">
                              <span className="h-price-label">Per Night Rate</span>
                              <div className="d-flex align-items-baseline gap-1">
                                <span className="h-curr">₹</span>
                                <span className="h-val">{hotel.pricePerNight.toLocaleString()}</span>
                                <span className="h-night">/ night</span>
                              </div>
                              <span className="h-total-stay">
                                {nightsCount}N x {roomsCount}R: <strong>₹{roomStayTotal.toLocaleString()}</strong>
                              </span>
                            </div>

                            <button 
                              type="button" 
                              className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline"}`}
                            >
                              {isSelected ? "Selected ✓" : "Select Hotel"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. CHOOSE FOOD & SIGHTSEEING OPTIONS */}
                <div className="planner-card">
                  <div className="card-section-title">
                    <span className="step-num">6</span>
                    <div>
                      <h3>Step 4: Meal Plan & Sightseeing Inclusions</h3>
                      <p>Tailor dining preferences and attraction tickets</p>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="m-0 fw-bold small text-navy">Choose Meal Plan:</label>
                    <span className="mobile-slide-hint d-md-none">👉 Swipe meal plans</span>
                  </div>

                  <div className="meals-selection-grid mobile-slide-track mb-3">
                    {[
                      {
                        id: "all_meals",
                        name: "All Meals Included",
                        desc: "Buffet Breakfast, Lunch & Dinner",
                        rate: 750,
                        tag: "RECOMMENDED"
                      },
                      {
                        id: "breakfast_only",
                        name: "Breakfast Only Included",
                        desc: "Morning Buffet Breakfast at Hotel",
                        rate: 250,
                        tag: "FLEXIBLE DINE"
                      },
                      {
                        id: "no_meals",
                        name: "Self-Arranged Dining",
                        desc: "Pay as you eat at local cafes",
                        rate: 0,
                        tag: "ROOM ONLY"
                      }
                    ].map((m) => {
                      const isSel = mealPlan === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setMealPlan(m.id)}
                          className={`meal-plan-card mobile-slide-item ${isSel ? "active" : ""}`}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="meal-tag">{m.tag}</span>
                            <div className={`meal-radio ${isSel ? "checked" : ""}`}>
                              {isSel && <Check size={12} color="#FFF" />}
                            </div>
                          </div>
                          <h5>{m.name}</h5>
                          <p>{m.desc}</p>
                          <span className="meal-rate-badge">
                            {m.rate === 0 ? "₹0 (Self-Arranged)" : `₹${m.rate} / person / day`}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="sightseeing-toggle-box p-3 rounded-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <label className="d-flex align-items-start gap-2 cursor-pointer m-0">
                      <input 
                        type="checkbox" 
                        checked={includeSightseeingPasses} 
                        onChange={(e) => setIncludeSightseeingPasses(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '3px' }}
                      />
                      <div>
                        <strong className="d-block text-navy">Include Verified Monument Passes & Sightseeing Entry (₹450 / person)</strong>
                        <span className="text-muted small">Fast-track access to botanical gardens, viewpoints, toy train reservation, and local museum access.</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 5. AT LAST CALCULATE THE COST */}
                <div className="planner-card dynamic-calculation-card">
                  <div className="card-section-title">
                    <span className="step-num">7</span>
                    <div>
                      <h3>Step 5: Dynamic Cost Calculation (Itemized Bill)</h3>
                      <p>Calculated live based on your exact chosen hotel, travel tickets, duration & meal plan</p>
                    </div>
                  </div>

                  <div className="calculation-breakdown-table">
                    <div className="calc-row">
                      <div className="calc-item-desc">
                        <strong>1. Return Travel Tickets ({selectedTransportTicket.operator})</strong>
                        <span>Round-trip {sourceCity} ⇄ {primaryDest?.city || "Ooty"} (₹{selectedTransportTicket.price.toLocaleString()} x 2 return x {travelersCount} travelers)</span>
                      </div>
                      <span className="calc-item-cost">₹{totalTransportCost.toLocaleString()}</span>
                    </div>

                    <div className="calc-row">
                      <div className="calc-item-desc">
                        <strong>2. Hotel Stay ({selectedHotel.name})</strong>
                        <span>{nightsCount} Night{nightsCount > 1 ? "s" : ""} x {roomsCount} Room{roomsCount > 1 ? "s" : ""} @ ₹{selectedHotel.pricePerNight.toLocaleString()}/night</span>
                      </div>
                      <span className="calc-item-cost">₹{totalHotelCost.toLocaleString()}</span>
                    </div>

                    <div className="calc-row">
                      <div className="calc-item-desc">
                        <strong>3. Dining & Meals ({mealPlan === "all_meals" ? "All Daily Meals" : mealPlan === "breakfast_only" ? "Breakfast Only" : "Self-Dining"})</strong>
                        <span>₹{mealDailyRate} x {tripDurationDays} days x {travelersCount} travelers</span>
                      </div>
                      <span className="calc-item-cost">{totalFoodCost > 0 ? `₹${totalFoodCost.toLocaleString()}` : "Self-Arranged (₹0)"}</span>
                    </div>

                    <div className="calc-row">
                      <div className="calc-item-desc">
                        <strong>4. Sightseeing & Monument Passes</strong>
                        <span>{includeSightseeingPasses ? `Official Passes for ${primaryDest?.name} (₹450 x ${travelersCount} travelers)` : "Self-Purchased"}</span>
                      </div>
                      <span className="calc-item-cost">{totalPassesCost > 0 ? `₹${totalPassesCost.toLocaleString()}` : "Excluded (₹0)"}</span>
                    </div>

                    <div className="calc-total-banner">
                      <div>
                        <span className="c-tot-label">TOTAL CALCULATED TRIP COST</span>
                        <span className="c-tot-sub">All taxes, return tickets, hotel nights & inclusions verified</span>
                      </div>
                      <div className="text-end">
                        <div className="c-tot-amount">₹{customTotalCost.toLocaleString()}</div>
                        <span className="c-tot-pp">₹{customPerPerson.toLocaleString()} / person</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                CHOICE 2: ROAVIO ALL-INCLUSIVE FIXED BUDGET PACKAGES
                Visible when planMode === "fixed"
            ========================================================================= */}
            {planMode === "fixed" && (
              <div className="fixed-packages-container">
                <div className="planner-card">
                  <div className="card-section-title">
                    <span className="step-num">3</span>
                    <div>
                      <h3>Choose Your Roavio All-Inclusive Fixed Package</h3>
                      <p>Pay only for your chosen package — Roavio arranges return tickets, hotel stay, all meals & sightseeing!</p>
                    </div>
                  </div>

                  <div className="mobile-slide-hint d-md-none mb-2">
                    <span>👉 Swipe horizontally to compare Roavio fixed plans</span>
                  </div>

                  <div className="fixed-packages-grid mobile-slide-track">
                    {fixedPackages.map((pkg) => {
                      const isSelected = selectedFixedPackageId === pkg.id;
                      const pkgTotal = pkg.pricePerPerson * travelersCount;
                      const isPkgExpanded = expandedPackageIds.includes(pkg.id);
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedFixedPackageId(pkg.id)}
                          className={`fixed-pkg-card mobile-slide-item ${isSelected ? "selected" : ""}`}
                        >
                          <div className="fixed-card-top">
                            <span className={`pkg-badge ${pkg.tagClass}`}>{pkg.tag}</span>
                            <div className={`pkg-radio-indicator ${isSelected ? "active" : ""}`}>
                              {isSelected && <Check size={14} color="#FFF" />}
                            </div>
                          </div>

                          <h4 className="pkg-name">{pkg.name}</h4>
                          <span className="pkg-duration-badge"><Clock size={13} /> {pkg.duration}</span>
                          <p className="pkg-highlights-text">{pkg.highlights}</p>

                          <div className="pkg-price-row">
                            <span className="pkg-price-currency">₹</span>
                            <span className="pkg-price-amount">{pkg.pricePerPerson.toLocaleString()}</span>
                            <span className="pkg-price-unit">/ person (All-Inclusive)</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePackageDetails(pkg.id);
                            }}
                            className="btn-toggle-pkg-details"
                          >
                            {isPkgExpanded ? (
                              <>
                                <ChevronUp size={14} className="me-1" /> Hide Inclusions ▲
                              </>
                            ) : (
                              <>
                                <ChevronDown size={14} className="me-1" /> See All Inclusions ▼
                              </>
                            )}
                          </button>

                          {isPkgExpanded && (
                            <div className="pkg-facilities-list">
                              <span className="fac-title">All Facilities Arranged by Roavio:</span>
                              {pkg.facilities.map((fac, i) => (
                                <div key={i} className="fac-item">
                                  <CheckCircle2 size={15} className="text-green flex-shrink-0 mt-1" />
                                  <span>{fac}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="pkg-select-footer mt-auto pt-3">
                            <button 
                              type="button" 
                              className={`btn btn-sm w-100 ${isSelected ? "btn-primary" : "btn-outline"}`}
                            >
                              {isSelected ? "Selected Fixed Package ✓" : "Choose This Fixed Package"}
                            </button>
                            <span className="d-block text-center text-muted small mt-1">
                              Total for {travelersCount} Traveler{travelersCount > 1 ? "s" : ""}: <strong>₹{pkgTotal.toLocaleString()}</strong>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Daily Itinerary Timeline */}
            <div className="planner-card daily-itinerary-step">
              <div className="card-section-title">
                <span className="step-num">{planMode === "custom" ? "8" : "4"}</span>
                <div>
                  <h3>Personalized Daily Itinerary Schedule</h3>
                  <p>
                    Calculated dynamically based on your chosen {planMode === "custom" ? "custom selections" : selectedFixedPackage.name} for {primaryDest?.name}
                  </p>
                </div>
              </div>

              <div className="itinerary-timeline-wrap">
                {dailyItinerary.map((dItem, idx) => (
                  <div key={idx} className="itinerary-day-card">
                    <div className="day-badge-column">
                      <div className="day-pill">{dItem.day}</div>
                      <div className="day-line"></div>
                    </div>
                    <div className="day-content-column">
                      <h4 className="day-title">{dItem.title}</h4>
                      <div className="day-events-list">
                        {dItem.schedule.map((ev, sIdx) => (
                          <div key={sIdx} className="day-event-row">
                            <span className="event-time-badge">{ev.time}</span>
                            <span className="event-desc">{ev.activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 5: Travel Notes & Preferences */}
            <div className="planner-card">
              <div className="card-section-title">
                <span className="step-num">{planMode === "custom" ? "9" : "5"}</span>
                <div>
                  <h3>Special Preferences & Travel Notes</h3>
                  <p>Fine-tune preferences like vegetarian meals, high-floor rooms, or guide assistance</p>
                </div>
              </div>

              <div className="form-stack">
                <div className="form-group">
                  <label>Travel Notes / Specific Inquiries</label>
                  <textarea 
                    rows={3} 
                    value={tripNotes} 
                    onChange={(e) => setTripNotes(e.target.value)}
                    className="roavio-textarea"
                    placeholder="Enter preferences (e.g. Jain / Vegetarian food, early morning sunrise photography, wheelchair accessibility)..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Overview & Save */}
          <aside className="planner-summary-col">
            <div className="summary-card">
              <div className="summary-header">
                <Sparkles size={20} className="text-orange" />
                <h3>Itinerary Summary</h3>
              </div>

              {/* Stat Badges */}
              <div className="summary-stats-grid">
                <div className="stat-pill">
                  <span className="stat-label">Total Duration</span>
                  <span className="stat-value">{planMode === "custom" ? tripDurationDays : selectedFixedPackage.durationDays} Days</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Attractions</span>
                  <span className="stat-value">{selectedDestinations.length} Stops</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Est. Distance</span>
                  <span className="stat-value">~{totalDistanceKm} km</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Travelers</span>
                  <span className="stat-value">{travelersCount} Person{travelersCount > 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Route Visualizer */}
              <div className="summary-route-track">
                <div className="track-point origin">
                  <div className="point-dot origin-dot"></div>
                  <div className="point-info">
                    <span className="point-role">Origin Base</span>
                    <strong>{sourceCity}</strong>
                  </div>
                </div>

                {selectedDestinations.map((dest, i) => (
                  <div key={dest.id} className="track-point">
                    <div className="point-line"></div>
                    <div className="point-dot"></div>
                    <div className="point-info">
                      <span className="point-role">
                        {selectedDestinations.length === 1 ? "Direct Destination" : `Stop #${i + 1}`}
                      </span>
                      <strong>{dest.name}</strong>
                      <span className="point-sub">{dest.state}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Plan Mode Pill */}
              <div className="selected-pkg-summary-pill mb-3 p-3 rounded-3" style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
                <span className="text-muted small d-block mb-1 font-weight-bold">
                  {planMode === "custom" ? "CHOICE 1: CUSTOM BUILD" : "CHOICE 2: ROAVIO FIXED PACKAGE"}
                </span>
                <strong className="text-green d-block" style={{ fontSize: '1.05rem' }}>
                  {planMode === "custom" ? `Custom Plan: ${selectedHotel.name}` : selectedFixedPackage.name}
                </strong>
                <span className="small text-muted">
                  {planMode === "custom" 
                    ? `Transit: ${selectedTransportTicket.operator} | Stay: ${nightsCount} Nights`
                    : "Roavio arranges return tickets, hotel stay, all meals & sightseeing"}
                </span>
              </div>

              {/* Expense Estimation Breakdown */}
              <div className="expense-breakdown-box">
                <h4 className="expense-title">Calculated Price Breakdown</h4>
                
                {planMode === "custom" ? (
                  <>
                    <div className="expense-row">
                      <span>Return Travel Tickets:</span>
                      <strong>₹{totalTransportCost.toLocaleString()}</strong>
                    </div>
                    <div className="expense-row">
                      <span>Hotel Stay ({nightsCount}N, {roomsCount}R):</span>
                      <strong>₹{totalHotelCost.toLocaleString()}</strong>
                    </div>
                    <div className="expense-row">
                      <span>Meals & Dining:</span>
                      <strong>{totalFoodCost > 0 ? `₹${totalFoodCost.toLocaleString()}` : "Self-Arranged (₹0)"}</strong>
                    </div>
                    <div className="expense-row">
                      <span>Monument & Entry Passes:</span>
                      <strong>{totalPassesCost > 0 ? `₹${totalPassesCost.toLocaleString()}` : "Excluded (₹0)"}</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="expense-row">
                      <span>Fixed Package Rate:</span>
                      <strong>₹{selectedFixedPackage.pricePerPerson.toLocaleString()} / person</strong>
                    </div>
                    <div className="expense-row">
                      <span>Return Tickets:</span>
                      <strong className="text-green">Roavio Arranged ✓</strong>
                    </div>
                    <div className="expense-row">
                      <span>Hotel Stay:</span>
                      <strong className="text-green">Roavio Arranged ✓</strong>
                    </div>
                    <div className="expense-row">
                      <span>All Meals & Sightseeing:</span>
                      <strong className="text-green">Roavio Arranged ✓</strong>
                    </div>
                  </>
                )}

                <div className="expense-total-row">
                  <div>
                    <span className="d-block font-weight-bold text-navy">Total Calculated Cost:</span>
                    <span className="text-muted small">({travelersCount} Traveler{travelersCount > 1 ? "s" : ""} x ₹{activePerPersonRate.toLocaleString()})</span>
                  </div>
                  <span className="total-amount">₹{activePayableTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="summary-actions">
                <button 
                  onClick={() => {
                    setConfirmedBookingData(null);
                    setTripRegisterModalOpen(true);
                  }}
                  disabled={selectedDestinations.length === 0}
                  className="btn btn-primary btn-block register-trip-btn"
                >
                  <CreditCard size={18} />
                  <span>Register & Pay for Trip (Confirm Tickets)</span>
                </button>

                <button 
                  onClick={handleSaveToDashboard}
                  disabled={selectedDestinations.length === 0}
                  className="btn btn-outline btn-block mt-2 save-itinerary-btn"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 size={18} /> Saved to My Trips!
                    </>
                  ) : (
                    <>
                      <BookmarkCheck size={18} /> Save Itinerary as Draft
                    </>
                  )}
                </button>

                <Link to="/map" className="btn btn-outline btn-block mt-2 flex-center gap-2">
                  <Navigation size={16} /> View Route on Live Map
                </Link>
              </div>

              {/* Security Reassurance Chips */}
              <div className="summary-trust-strip mt-3 pt-3 border-top text-center">
                <div className="d-flex justify-content-center align-items-center gap-2 text-muted small">
                  <ShieldCheck size={14} className="text-green" />
                  <span>256-Bit SSL Secured · Official QR E-Tickets</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* =========================================================================
          1. DESTINATION QUICK EXPLORE MODAL
      ========================================================================= */}
      {quickExploreDest && (
        <div className="plan-modal-overlay" onClick={() => setQuickExploreDest(null)}>
          <div className="plan-modal-box explore-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div className="d-flex align-items-center gap-2">
                <Compass size={22} className="text-green" />
                <h3 className="modal-title">Explore Attraction Details</h3>
              </div>
              <button onClick={() => setQuickExploreDest(null)} className="modal-close-x">
                <X size={20} />
              </button>
            </div>

            <div className="plan-modal-body">
              {/* Photo Showcase */}
              <div className="explore-showcase-wrap">
                <img 
                  src={activeExploreImg || quickExploreDest.image} 
                  alt={quickExploreDest.name} 
                  className="explore-main-img" 
                />
                {quickExploreDest.gallery && quickExploreDest.gallery.length > 0 && (
                  <div className="explore-thumbs-row mobile-slide-track">
                    {[quickExploreDest.image, ...quickExploreDest.gallery].slice(0, 5).map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Thumbnail" 
                        onClick={() => setActiveExploreImg(img)}
                        className={`explore-thumb ${ (activeExploreImg || quickExploreDest.image) === img ? "active" : "" }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="explore-details-content mt-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                  <div>
                    <span className="badge-pill-accent me-2">{quickExploreDest.badge || "Featured"}</span>
                    <span className="badge-pill-cat">{quickExploreDest.category || quickExploreDest.categoryName}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                    <Star size={16} fill="#F59E0B" />
                    <span>{quickExploreDest.rating || "4.8"}</span>
                    <span className="text-muted small">({quickExploreDest.reviews ? quickExploreDest.reviews.toLocaleString() : "1,200"} reviews)</span>
                  </div>
                </div>

                <h2 className="explore-dest-title">{quickExploreDest.name}</h2>
                <div className="explore-location-bar">
                  <MapPin size={15} className="text-green flex-shrink-0" />
                  <span>{quickExploreDest.city}, {quickExploreDest.state}</span>
                </div>

                <p className="explore-desc-text mt-3">
                  {quickExploreDest.description}
                </p>

                {/* Key Specs Grid */}
                <div className="explore-specs-grid mt-3">
                  <div className="spec-tile">
                    <Calendar size={18} className="text-green flex-shrink-0" />
                    <div>
                      <span className="spec-k">Best Time</span>
                      <strong className="spec-v">{quickExploreDest.bestTime || "Oct - Mar"}</strong>
                    </div>
                  </div>
                  <div className="spec-tile">
                    <Clock size={18} className="text-navy flex-shrink-0" />
                    <div>
                      <span className="spec-k">Visiting Hours</span>
                      <strong className="spec-v">{quickExploreDest.openingHours || "Sunrise to Sunset"}</strong>
                    </div>
                  </div>
                  <div className="spec-tile">
                    <IndianRupee size={18} className="text-orange flex-shrink-0" />
                    <div>
                      <span className="spec-k">Certified Entry</span>
                      <strong className="spec-v">{quickExploreDest.ticketPrice === 0 ? "Free Entry" : `₹${quickExploreDest.ticketPrice} / person`}</strong>
                    </div>
                  </div>
                  <div className="spec-tile">
                    <Plane size={18} className="text-blue flex-shrink-0" />
                    <div>
                      <span className="spec-k">Nearest Hub</span>
                      <strong className="spec-v">{quickExploreDest.nearestAirport?.name ? `${quickExploreDest.nearestAirport.name}` : `${quickExploreDest.city} Airport`}</strong>
                    </div>
                  </div>
                </div>

                {/* Highlights Checklist */}
                {quickExploreDest.highlights && quickExploreDest.highlights.length > 0 && (
                  <div className="explore-highlights-box mt-3">
                    <h4 className="box-title">Key Highlights & Cultural Features</h4>
                    <div className="highlights-pills-wrap">
                      {quickExploreDest.highlights.map((h, i) => (
                        <span key={i} className="hl-chip">
                          <Check size={14} className="text-green" /> {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="plan-modal-footer">
              <Link 
                to={`/destination/${quickExploreDest.id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-sm d-flex align-items-center gap-1"
              >
                <span>Open Full Destination Page</span>
                <ExternalLink size={14} />
              </Link>

              {selectedDestIds.includes(quickExploreDest.id) ? (
                <button 
                  type="button" 
                  disabled 
                  className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                >
                  <Check size={16} /> Added to Itinerary
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => {
                    addStop(quickExploreDest.id);
                    setQuickExploreDest(null);
                  }}
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                >
                  <Plus size={16} /> Add to Itinerary
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. TRIP REGISTRATION & PAYMENT CHECKOUT MODAL (LUXURY MODERN REDESIGN)
      ========================================================================= */}
      {tripRegisterModalOpen && (
        <div className="plan-modal-overlay" onClick={() => !isProcessingPayment && setTripRegisterModalOpen(false)}>
          <div className="plan-modal-box checkout-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="checkout-modal-hdr">
              <div className="d-flex align-items-center gap-3">
                <div className="modal-hdr-icon-box">
                  <Ticket size={24} />
                </div>
                <div>
                  <h3 className="modal-title">Complete Your Trip Registration</h3>
                  <span className="modal-subtitle">Instant E-Ticket Dispatch • Official IRCTC & Partner Verified</span>
                </div>
              </div>
              {!isProcessingPayment && (
                <button 
                  onClick={() => setTripRegisterModalOpen(false)} 
                  className="modal-close-x"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* PROCESSING STATE SPINNER */}
            {isProcessingPayment && (
              <div className="payment-processing-splash">
                <div className="pulse-spinner-glow">
                  <div className="inner-spin"></div>
                </div>
                <h3 className="process-title">Authorizing Secure Payment</h3>
                <p className="process-desc">
                  Connecting to NPCI & Bank Payment Gateway... Generating cryptographically verified Roavio E-Tickets with QR codes.
                </p>
                <div className="processing-progress-bar">
                  <div className="progress-bar-fill"></div>
                </div>
                <div className="secure-badge-pill">
                  <Lock size={14} /> 256-Bit SSL Encrypted Banking Channel
                </div>
              </div>
            )}

            {/* CONFIRMED BOOKING SUCCESS SCREEN */}
            {!isProcessingPayment && confirmedBookingData && (
              <div className="booking-confirmed-wrapper">
                <div className="booking-success-header">
                  <div className="success-pulse-circle">
                    <Check size={36} className="text-white" />
                  </div>
                  <h2 className="success-title">Custom Trip Confirmed & Booked!</h2>
                  <p className="success-desc">
                    Your reservation has been confirmed. Official verified E-Tickets with QR codes and boarding vouchers have been generated.
                  </p>
                </div>

                <div className="luxury-boarding-stub">
                  <div className="stub-top-bar">
                    <div className="d-flex align-items-center gap-2">
                      <Sparkles size={16} className="text-emerald" />
                      <span className="stub-brand-title">CONFIRMED ROAVIO PASS</span>
                    </div>
                    <div className="pnr-badge-box">
                      <span className="pnr-title">PNR / PASS ID</span>
                      <strong className="pnr-code">{confirmedBookingData.providerReference || `ROA-PASS-${Math.floor(1000 + Math.random() * 9000)}`}</strong>
                    </div>
                  </div>

                  <div className="stub-route-row">
                    <div>
                      <span className="stub-sub-lbl">FROM</span>
                      <h4 className="stub-station-name">{sourceCity}</h4>
                    </div>
                    <div className="stub-route-arrow">
                      <div className="transit-icon-badge">
                        {selectedTransportTicket.mode === "flight" ? <Plane size={18} /> : 
                         selectedTransportTicket.mode === "train" ? <Train size={18} /> : 
                         selectedTransportTicket.mode === "bus" ? <Bus size={18} /> : <Car size={18} />}
                      </div>
                      <span className="route-arrow-txt">➔</span>
                    </div>
                    <div className="text-end">
                      <span className="stub-sub-lbl">TO DESTINATION</span>
                      <h4 className="stub-station-name">{selectedDestinations[0]?.city || selectedDestinations[0]?.name || "India"}</h4>
                    </div>
                  </div>

                  <div className="stub-details-matrix">
                    <div className="stub-col">
                      <span className="stub-k">Lead Traveler</span>
                      <strong className="stub-v">{leadName}</strong>
                    </div>
                    <div className="stub-col">
                      <span className="stub-k">Travelers</span>
                      <strong className="stub-v">{travelersCount} Person{travelersCount > 1 ? "s" : ""}</strong>
                    </div>
                    <div className="stub-col">
                      <span className="stub-k">Dates</span>
                      <strong className="stub-v">{startDate} to {endDate}</strong>
                    </div>
                    <div className="stub-col">
                      <span className="stub-k">Plan Choice</span>
                      <strong className="stub-v">{planMode === "custom" ? "Custom Selected Stay & Transit" : selectedFixedPackage.name}</strong>
                    </div>
                    <div className="stub-col">
                      <span className="stub-k">Total Paid</span>
                      <strong className="stub-v text-emerald">₹{activePayableTotal.toLocaleString()}</strong>
                    </div>
                    <div className="stub-col">
                      <span className="stub-k">Booking Reference</span>
                      <strong className="stub-v">{confirmedBookingData.bookingId || `BK-${Math.floor(10000 + Math.random() * 90000)}`}</strong>
                    </div>
                  </div>

                  <div className="stub-dispatch-footer">
                    <div className="qr-box-simulated">
                      <QrCode size={40} className="text-navy" />
                    </div>
                    <div className="dispatch-text-col">
                      <div className="d-flex align-items-center gap-1 text-emerald fw-bold mb-1">
                        <CheckCircle2 size={16} /> Live E-Pass Dispatched Successfully
                      </div>
                      <p className="small text-muted mb-0">
                        Confirmation & Pass dispatched via SMS & WhatsApp to <strong>+91 {leadPhone}</strong> and email to <strong>{leadEmail}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="confirmed-actions-row mt-4">
                  <button 
                    onClick={() => {
                      setTripRegisterModalOpen(false);
                      navigate("/my-trips");
                    }}
                    className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-3 px-4"
                  >
                    <Ticket size={18} /> View Tickets in My Trips Dashboard
                  </button>
                  <button 
                    onClick={() => setTripRegisterModalOpen(false)}
                    className="btn btn-outline py-3 px-4"
                  >
                    Done / Return to Planner
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: REGISTRATION & PAYMENT FORM */}
            {!isProcessingPayment && !confirmedBookingData && (
              <form onSubmit={handlePayAndConfirmTrip} className="checkout-form-body">
                {/* Boarding Pass Hero Summary */}
                <div className="checkout-ticket-card">
                  <div className="ticket-top-ribbon">
                    <div className="ticket-badge-pill">
                      <Sparkles size={13} className="text-emerald" />
                      <span>{planMode === "custom" ? "CUSTOM BUILT ITINERARY" : "ROAVIO FIXED BUDGET PACKAGE"}</span>
                    </div>
                    <div className="ticket-class-pill">
                      <ShieldCheck size={13} className="text-emerald" />
                      <span>Instant Verified Booking</span>
                    </div>
                  </div>

                  <div className="ticket-main-route">
                    <div className="route-stop">
                      <span className="route-type-label">ORIGIN</span>
                      <h4 className="route-city-name">{sourceCity}</h4>
                    </div>

                    <div className="route-transit-divider">
                      <div className="transit-icon-circle">
                        {selectedTransportTicket.mode === "flight" ? <Plane size={18} /> : 
                         selectedTransportTicket.mode === "train" ? <Train size={18} /> : 
                         selectedTransportTicket.mode === "bus" ? <Bus size={18} /> : <Car size={18} />}
                      </div>
                      <div className="transit-line-dashed"></div>
                      <span className="transit-operator-badge">
                        {planMode === "custom" ? selectedTransportTicket.operator : selectedFixedPackage.name}
                      </span>
                    </div>

                    <div className="route-stop text-end">
                      <span className="route-type-label">DESTINATION</span>
                      <h4 className="route-city-name">{selectedDestinations.map(d => d.name).join(" ➔ ")}</h4>
                    </div>
                  </div>

                  <div className="ticket-perks-grid">
                    <div className="ticket-perk-item">
                      <Calendar size={15} className="text-emerald flex-shrink-0" />
                      <div>
                        <span className="t-lbl">Trip Duration & Dates</span>
                        <strong className="t-val">{startDate} to {endDate} ({planMode === "custom" ? tripDurationDays : selectedFixedPackage.durationDays} Days)</strong>
                      </div>
                    </div>

                    <div className="ticket-perk-item">
                      <Users size={15} className="text-emerald flex-shrink-0" />
                      <div>
                        <span className="t-lbl">Travel Party</span>
                        <strong className="t-val">{travelersCount} Adult Traveler{travelersCount > 1 ? "s" : ""}</strong>
                      </div>
                    </div>

                    <div className="ticket-perk-item">
                      <Hotel size={15} className="text-emerald flex-shrink-0" />
                      <div>
                        <span className="t-lbl">Hotel & Accommodation</span>
                        <strong className="t-val">{planMode === "custom" ? selectedHotel.name : "Roavio Luxury Partner Resort"}</strong>
                      </div>
                    </div>

                    <div className="ticket-perk-item">
                      <Award size={15} className="text-emerald flex-shrink-0" />
                      <div>
                        <span className="t-lbl">Verified Inclusions</span>
                        <strong className="t-val">Monument Pass & Certified Guide Included</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LOGIN REQUIRED GATE IF USER NOT LOGGED IN */}
                {!user ? (
                  <div className="checkout-login-gate p-4 text-center rounded-3 my-3">
                    <div className="gate-icon-circle mx-auto mb-3">
                      <Lock size={26} />
                    </div>
                    <h4 className="text-navy mb-2">Login Required to Complete Reservation</h4>
                    <p className="text-muted small mb-4" style={{ maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
                      To securely authorize your payment and link your cryptographically verified Roavio E-Tickets to your traveler account, please sign in.
                    </p>

                    <div className="d-flex flex-column gap-2" style={{ maxWidth: '360px', margin: '0 auto' }}>
                      <button 
                        type="button" 
                        onClick={() => {
                          login({
                            email: "rahul.sharma@example.com",
                            name: "Rahul Sharma",
                            phone: "9876543210"
                          });
                        }}
                        className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2"
                      >
                        <Sparkles size={16} />
                        <span>One-Click Sign In (Rahul Sharma)</span>
                      </button>

                      <button 
                        type="button" 
                        onClick={() => {
                          navigate("/login", { state: { from: { pathname: "/plan", search: `?dest=${selectedDestIds[0]}` } } });
                        }}
                        className="btn btn-outline d-flex align-items-center justify-content-center gap-2 py-2"
                      >
                        <User size={16} />
                        <span>Log In with Password or OTP ↗</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Signed-in Traveler Identity Banner */}
                    <div className="traveler-account-card">
                      <div className="account-avatar-circle">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="account-details-col">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <strong className="account-user-name">{user.name}</strong>
                          <span className="account-verified-tag">
                            <CheckCircle2 size={13} /> Verified Traveler
                          </span>
                        </div>
                        <span className="account-user-email">{user.email} • E-Tickets will automatically sync to your dashboard</span>
                      </div>
                    </div>

                    {/* Section 1: Traveler Registration Details */}
                    <div className="checkout-step-container">
                      <div className="checkout-step-hdr">
                        <div className="step-num-pill">1</div>
                        <div>
                          <h4 className="step-title">Primary Traveler & E-Ticket Delivery Details</h4>
                          <p className="step-desc">Boarding pass, booking voucher and live driver/conductor tracking will be sent here.</p>
                        </div>
                      </div>

                      <div className="checkout-form-grid">
                        <div className="field-block">
                          <label className="checkout-field-label">
                            Lead Passenger Full Name <span className="req-star">*</span>
                          </label>
                          <div className="checkout-input-wrap">
                            <User size={17} className="input-field-icon" />
                            <input 
                              type="text" 
                              required
                              value={leadName} 
                              onChange={(e) => setLeadName(e.target.value)}
                              className="checkout-text-input has-icon" 
                              placeholder="e.g. Rahul Sharma"
                            />
                          </div>
                          <span className="field-hint">Must match government photo ID (Aadhaar / Passport)</span>
                        </div>

                        <div className="field-block">
                          <label className="checkout-field-label">
                            Mobile Number (WhatsApp & SMS E-Ticket) <span className="req-star">*</span>
                          </label>
                          <div className="checkout-phone-input-group">
                            <div className="phone-country-code">
                              <span className="flag-icon">🇮🇳</span>
                              <span className="code-text">+91</span>
                            </div>
                            <input 
                              type="tel" 
                              required
                              maxLength={10}
                              value={leadPhone} 
                              onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, ''))}
                              className="checkout-phone-input" 
                              placeholder="10-digit mobile number"
                            />
                          </div>
                          <span className="field-hint">Instant SMS ticket & WhatsApp QR code will be dispatched here</span>
                        </div>

                        <div className="field-block">
                          <label className="checkout-field-label">
                            Email Address (Official PDF Ticket & Invoice) <span className="req-star">*</span>
                          </label>
                          <div className="checkout-input-wrap">
                            <Mail size={17} className="input-field-icon" />
                            <input 
                              type="email" 
                              required
                              value={leadEmail} 
                              onChange={(e) => setLeadEmail(e.target.value)}
                              className="checkout-text-input has-icon" 
                              placeholder="e.g. rahul.sharma@example.com"
                            />
                          </div>
                          <span className="field-hint">Tax invoice, GST receipt & PDF itinerary</span>
                        </div>

                        <div className="field-block">
                          <label className="checkout-field-label">
                            Emergency Contact Mobile <span className="opt-tag">(Optional)</span>
                          </label>
                          <div className="checkout-input-wrap">
                            <Phone size={17} className="input-field-icon" />
                            <input 
                              type="tel" 
                              value={emergencyPhone} 
                              onChange={(e) => setEmergencyPhone(e.target.value)}
                              className="checkout-text-input has-icon" 
                              placeholder="Family / Co-traveler contact"
                            />
                          </div>
                          <span className="field-hint">Used only during transit or medical emergency</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Choose Payment Method */}
                    <div className="checkout-step-container mt-4">
                      <div className="checkout-step-hdr">
                        <div className="step-num-pill">2</div>
                        <div>
                          <h4 className="step-title">Select Secure Payment Gateway</h4>
                          <p className="step-desc">Zero platform convenience fee • 256-Bit SSL Bank Encrypted</p>
                        </div>
                      </div>

                      {/* Payment Method Tabs */}
                      <div className="pay-methods-grid">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("upi")}
                          className={`pay-option-card ${paymentMethod === "upi" ? "active" : ""}`}
                        >
                          <div className="option-radio-indicator">
                            <div className="radio-inner-dot"></div>
                          </div>
                          <div className="option-icon-box">
                            <Smartphone size={18} />
                          </div>
                          <div className="option-text-col">
                            <div className="option-title">UPI Instant</div>
                            <div className="option-sub">GPay, PhonePe, Paytm, BHIM</div>
                          </div>
                          <span className="popular-badge">⚡ Fastest</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("card")}
                          className={`pay-option-card ${paymentMethod === "card" ? "active" : ""}`}
                        >
                          <div className="option-radio-indicator">
                            <div className="radio-inner-dot"></div>
                          </div>
                          <div className="option-icon-box">
                            <CreditCard size={18} />
                          </div>
                          <div className="option-text-col">
                            <div className="option-title">Credit / Debit Card</div>
                            <div className="option-sub">Visa, Mastercard, RuPay</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("netbanking")}
                          className={`pay-option-card ${paymentMethod === "netbanking" ? "active" : ""}`}
                        >
                          <div className="option-radio-indicator">
                            <div className="radio-inner-dot"></div>
                          </div>
                          <div className="option-icon-box">
                            <Building2 size={18} />
                          </div>
                          <div className="option-text-col">
                            <div className="option-title">Net Banking</div>
                            <div className="option-sub">All Major Indian Banks</div>
                          </div>
                        </button>
                      </div>

                      {/* UPI Inputs */}
                      {paymentMethod === "upi" && (
                        <div className="pay-subpanel">
                          <label className="checkout-field-label mb-2 d-block">Quick Select UPI App:</label>
                          <div className="upi-app-selectors">
                            <button type="button" onClick={() => setUpiApp("gpay")} className={`upi-app-btn ${upiApp === "gpay" ? "active" : ""}`}>
                              Google Pay
                            </button>
                            <button type="button" onClick={() => setUpiApp("phonepe")} className={`upi-app-btn ${upiApp === "phonepe" ? "active" : ""}`}>
                              PhonePe
                            </button>
                            <button type="button" onClick={() => setUpiApp("paytm")} className={`upi-app-btn ${upiApp === "paytm" ? "active" : ""}`}>
                              Paytm
                            </button>
                            <button type="button" onClick={() => setUpiApp("bhim")} className={`upi-app-btn ${upiApp === "bhim" ? "active" : ""}`}>
                              BHIM UPI
                            </button>
                          </div>

                          <div className="field-block mt-3">
                            <label className="checkout-field-label">Virtual Payment Address (UPI VPA)</label>
                            <div className="vpa-input-container">
                              <input 
                                type="text" 
                                value={upiId} 
                                onChange={(e) => setUpiId(e.target.value)}
                                className="checkout-text-input" 
                                placeholder="username@okhdfcbank"
                              />
                              <span className="vpa-verified-badge">
                                <Check size={14} /> Verified VPA
                              </span>
                            </div>
                            <span className="field-hint">You will receive an approval notification in your UPI app upon submission.</span>
                          </div>
                        </div>
                      )}

                      {/* Card Inputs */}
                      {paymentMethod === "card" && (
                        <div className="pay-subpanel">
                          <div className="field-block mb-3">
                            <label className="checkout-field-label">Card Number</label>
                            <div className="card-input-container">
                              <input 
                                type="text" 
                                value={cardNumber} 
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="checkout-text-input" 
                                placeholder="4532 •••• •••• 8821"
                              />
                              <span className="card-brand-badge">
                                <CreditCard size={14} /> VISA / RuPay
                              </span>
                            </div>
                          </div>

                          <div className="card-subgrid">
                            <div className="field-block">
                              <label className="checkout-field-label">Cardholder Name</label>
                              <input 
                                type="text" 
                                value={cardName} 
                                onChange={(e) => setCardName(e.target.value)}
                                className="checkout-text-input" 
                                placeholder="As on card"
                              />
                            </div>
                            <div className="field-block">
                              <label className="checkout-field-label">Expiry Date</label>
                              <input 
                                type="text" 
                                value={cardExpiry} 
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="checkout-text-input" 
                                placeholder="MM / YY"
                              />
                            </div>
                            <div className="field-block">
                              <label className="checkout-field-label">CVV / CVC</label>
                              <input 
                                type="password" 
                                maxLength={4}
                                value={cardCvv} 
                                onChange={(e) => setCardCvv(e.target.value)}
                                className="checkout-text-input" 
                                placeholder="•••"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Net Banking Inputs */}
                      {paymentMethod === "netbanking" && (
                        <div className="pay-subpanel">
                          <label className="checkout-field-label mb-2 d-block">Choose Your Primary Bank Account:</label>
                          <div className="bank-select-grid">
                            {["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank"].map((bank) => (
                              <button
                                key={bank}
                                type="button"
                                onClick={() => setSelectedBank(bank)}
                                className={`bank-option-card ${selectedBank === bank ? "active" : ""}`}
                              >
                                <Building2 size={16} />
                                <span>{bank}</span>
                                {selectedBank === bank && <Check size={14} className="bank-check-icon text-emerald" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 3: Live Transparent Fare Summary */}
                    <div className="checkout-fare-receipt mt-4">
                      <div className="fare-receipt-hdr">
                        <div className="d-flex align-items-center gap-2">
                          <Ticket size={16} className="text-emerald" />
                          <span className="receipt-title">Itemized Fare & Tax Summary</span>
                        </div>
                        <span className="guarantee-badge">Zero Hidden Surcharges</span>
                      </div>

                      <div className="fare-receipt-body">
                        <div className="fare-line-item">
                          <span className="line-item-desc">
                            {planMode === "custom" ? "Custom Itinerary Transit & Hotel Stay" : selectedFixedPackage.name} 
                            <span className="sub-tag">({travelersCount} traveler{travelersCount > 1 ? "s" : ""} x ₹{activePerPersonRate.toLocaleString()})</span>
                          </span>
                          <span className="line-item-amt">₹{activePayableTotal.toLocaleString()}</span>
                        </div>

                        <div className="fare-line-item">
                          <span className="line-item-desc">
                            Monument Passes & Certified Guided Sightseeing
                            <span className="sub-tag">(Complimentary Inclusion)</span>
                          </span>
                          <span className="line-item-amt text-emerald font-weight-700">₹0 Included</span>
                        </div>

                        <div className="fare-line-item">
                          <span className="line-item-desc">
                            IRCTC / Air Partner Convenience & Processing Fee
                            <span className="sub-tag">(Roavio Special Waiver)</span>
                          </span>
                          <span className="line-item-amt text-emerald font-weight-700">
                            <del className="text-muted me-1">₹350</del> ₹0 Promo
                          </span>
                        </div>

                        <div className="fare-total-banner">
                          <div className="total-label-col">
                            <div className="total-main-text">Total Payable Amount</div>
                            <div className="total-sub-text">Inclusive of all Goods & Services Taxes (GST)</div>
                          </div>
                          <div className="total-val-box">
                            <div className="total-currency-sym">₹</div>
                            <div className="total-numeric-amt">{activePayableTotal.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Checkout Sticky Action Bar */}
                <div className="checkout-sticky-footer mt-4">
                  <div className="trust-seals-row">
                    <div className="trust-seal-item">
                      <Lock size={13} className="text-emerald" />
                      <span>256-Bit SSL Encrypted</span>
                    </div>
                    <div className="trust-seal-item">
                      <CheckCircle2 size={13} className="text-emerald" />
                      <span>Instant PNR Dispatch</span>
                    </div>
                    <div className="trust-seal-item">
                      <ShieldCheck size={13} className="text-emerald" />
                      <span>100% Verified Reservation</span>
                    </div>
                  </div>

                  <div className="checkout-action-buttons">
                    <button 
                      type="button" 
                      onClick={() => setTripRegisterModalOpen(false)} 
                      className="btn-checkout-cancel"
                    >
                      Cancel & Review
                    </button>
                    {!user ? (
                      <button 
                        type="button" 
                        onClick={() => {
                          login({
                            email: "rahul.sharma@example.com",
                            name: "Rahul Sharma",
                            phone: "9876543210"
                          });
                        }}
                        className="btn-checkout-confirm"
                      >
                        <Lock size={18} />
                        <span>Log In to Authorize & Book</span>
                      </button>
                    ) : (
                      <button 
                        type="submit" 
                        className="btn-checkout-confirm"
                      >
                        <Lock size={18} />
                        <span>Pay ₹{activePayableTotal.toLocaleString()} & Confirm E-Tickets</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          LUXURY MODERN ROAVIO STYLES
      ========================================================================= */}
      <style>{`
        /* Global Page Wrapper - Strict Responsive Boundaries */
        .plan-journey-page {
          width: 100%;
          max-width: 100vw;
          overflow-x: clip;
          background: #F8FAFC;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .plan-journey-page *,
        .plan-journey-page *::before,
        .plan-journey-page *::after {
          box-sizing: border-box;
        }

        /* Hero Banner with Background Image & Gradient Overlay */
        .plan-hero {
          position: relative;
          background: #0F172A url('/assets/img/inner-page/breadcrumb/bg-3.jpg') center/cover no-repeat;
          color: white;
          padding: 4.5rem 0 3.8rem;
          border-bottom: 4px solid var(--color-green);
          overflow: hidden;
          width: 100%;
        }

        .plan-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.90) 50%, rgba(6, 78, 59, 0.94) 100%);
          z-index: 1;
        }

        .plan-hero-container {
          position: relative;
          z-index: 2;
        }

        .plan-hero-inner {
          max-width: 820px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          color: #4ADE80;
          border: 1px solid rgba(74, 222, 128, 0.4);
          padding: 0.4rem 1rem;
          border-radius: 999px;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-bottom: 1.2rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }

        .hero-main-title {
          font-size: clamp(1.8rem, 5vw, 3rem);
          font-weight: 900;
          color: #FFFFFF;
          margin-bottom: 1rem;
          line-height: 1.2;
          letter-spacing: -0.5px;
          word-break: break-word;
        }

        .hero-gradient-text {
          background: linear-gradient(135deg, #34D399 0%, #FBBF24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-lead-text {
          font-size: 1.02rem;
          color: #E2E8F0;
          line-height: 1.6;
          max-width: 680px;
          margin: 0 auto 1.8rem;
          font-weight: 400;
          word-break: break-word;
        }

        .hero-stats-row {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .hero-stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(6px);
          color: #F1F5F9;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
        }

        .stat-ico {
          color: #34D399;
        }

        /* Planner Grid Layout */
        .main-planner-container {
          padding-top: 2rem;
          padding-bottom: 4rem;
          width: 100%;
          box-sizing: border-box;
        }

        .planner-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2rem;
          align-items: start;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .planner-form-col {
          min-width: 0;
          width: 100%;
        }

        .planner-summary-col {
          min-width: 0;
          width: 100%;
        }

        /* Modern Decongested Card Styling */
        .planner-card {
          background: #FFFFFF;
          border-radius: 18px;
          padding: 1.4rem 1.6rem;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 4px 18px rgba(11, 19, 43, 0.04);
          margin-bottom: 1.4rem;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card-section-title {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.4rem;
          border-bottom: 1.5px solid #F1F5F9;
          padding-bottom: 1rem;
        }

        .card-section-title h3 {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0 0 0.15rem;
          letter-spacing: -0.2px;
          word-break: break-word;
        }

        .card-section-title p {
          font-size: 0.82rem;
          color: #64748B;
          margin: 0;
          word-break: break-word;
        }

        .step-num {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--color-navy) 0%, #1E3A8A 100%);
          color: white;
          font-size: 0.88rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
        }

        /* Luxury Mode Selector */
        .planner-mode-bar-wrapper {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 20px;
          padding: 1.6rem;
          box-shadow: 0 4px 20px -2px rgba(11, 19, 43, 0.05);
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .mode-kicker {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--travel-green);
          text-transform: uppercase;
        }

        .mode-main-title {
          font-size: clamp(1.2rem, 2.5vw, 1.45rem);
          font-weight: 900;
          color: var(--primary-navy);
          margin: 0.25rem 0 0.4rem;
        }

        .mode-subtitle {
          color: #64748B;
          font-size: 0.88rem;
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .planner-mode-toggle-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .mode-toggle-card {
          border: 2px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.3rem;
          cursor: pointer;
          transition: all 0.22s ease;
          background: #FAFAFA;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          text-align: left;
        }

        .mode-toggle-card:hover {
          border-color: #94A3B8;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
        }

        .mode-toggle-card.active {
          border-color: var(--travel-green);
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15), 0 10px 24px rgba(5, 150, 105, 0.08);
        }

        .mode-toggle-top {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 0.75rem;
        }

        .mode-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mode-icon-box.custom {
          background: #ECFDF5;
          color: #059669;
        }

        .mode-icon-box.fixed {
          background: #EFF6FF;
          color: #2563EB;
        }

        .mode-badge-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .mode-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
          letter-spacing: 0.04em;
        }

        .mode-badge.custom { background: #DCFCE7; color: #166534; }
        .mode-badge.fixed { background: #DBEAFE; color: #1E40AF; }

        .active-check-badge {
          font-size: 0.7rem;
          font-weight: 800;
          background: #059669;
          color: #FFFFFF;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }

        .mode-card-title {
          font-size: 1.08rem;
          font-weight: 800;
          color: var(--primary-navy);
          margin-bottom: 0.35rem;
        }

        .mode-card-desc {
          font-size: 0.82rem;
          color: #64748B;
          line-height: 1.5;
          margin-bottom: 0.85rem;
          flex-grow: 1;
        }

        .mode-perks-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          font-size: 0.74rem;
          font-weight: 700;
          color: #047857;
        }

        .mode-perks-row span {
          background: #F0FDF4;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          border: 1px solid #BBF7D0;
        }

        @media (max-width: 768px) {
          .planner-mode-toggle-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Direct Destination Banner */
        .single-dest-focus-banner {
          background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
          border: 1px solid #BBF7D0;
          color: #166534;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
          word-break: break-word;
        }

        /* Search Stops Box */
        .search-stops-box {
          position: relative;
          margin-bottom: 1.4rem;
          width: 100%;
        }

        .search-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #64748B;
        }

        .stops-search-input {
          width: 100%;
          padding: 0.85rem 2.6rem 0.85rem 3rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 14px;
          font-size: 0.9rem;
          box-sizing: border-box;
          background: #F8FAFC;
          transition: all 0.2s;
        }

        .stops-search-input:focus {
          outline: none;
          border-color: var(--color-green);
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.15);
        }

        .clear-search-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          font-size: 1.3rem;
          color: #64748B;
          cursor: pointer;
        }

        .stops-results-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
          z-index: 50;
          margin-top: 6px;
          overflow: hidden;
        }

        .stop-suggestion-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #F1F5F9;
          gap: 0.8rem;
          transition: background 0.15s;
        }

        .stop-suggestion-row:hover {
          background: #F8FAFC;
        }

        .sugg-thumb {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .sugg-info {
          flex-grow: 1;
          min-width: 0;
          overflow: hidden;
        }

        .sugg-name {
          display: block;
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--color-navy);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sugg-state {
          font-size: 0.74rem;
          color: #64748B;
        }

        /* Selected Stop Cards */
        .selected-stops-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          width: 100%;
          min-width: 0;
        }

        .selected-stop-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
          transition: all 0.2s;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .selected-stop-card:hover {
          border-color: #94A3B8;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .stop-card-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
        }

        .stop-index-pill {
          background: linear-gradient(135deg, var(--color-navy) 0%, #1E3A8A 100%);
          color: white;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          letter-spacing: 0.3px;
        }

        .stop-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .reorder-btn, .delete-stop-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: white;
          color: var(--color-navy);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }

        .reorder-btn:hover:not(:disabled) {
          border-color: var(--color-navy);
          background: #F1F5F9;
        }

        .delete-stop-btn {
          color: #DC2626;
          border-color: #FECACA;
        }

        .delete-stop-btn:hover {
          background: #FEF2F2;
        }

        .stop-card-main {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          width: 100%;
          min-width: 0;
        }

        .stop-img {
          width: 72px;
          height: 72px;
          border-radius: 12px;
          object-fit: cover;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stop-details {
          flex-grow: 1;
          min-width: 0;
          word-break: break-word;
        }

        .stop-name {
          font-size: 1.08rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0 0 0.25rem;
          line-height: 1.3;
          word-break: break-word;
        }

        .stop-state {
          font-size: 0.78rem;
          color: #64748B;
          display: block;
          margin-bottom: 0.35rem;
          word-break: break-word;
        }

        .stop-meta-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 0.74rem;
          font-weight: 700;
        }

        .meta-tag {
          background: #F0FDF4;
          color: #166534;
          padding: 0.18rem 0.55rem;
          border-radius: 6px;
          border: 1px solid #BBF7D0;
        }

        .stop-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.6rem;
          padding-top: 0.75rem;
          border-top: 1px dashed #E2E8F0;
          width: 100%;
        }

        .btn-toggle-details-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
          border-radius: 8px;
          padding: 0.38rem 0.85rem;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-toggle-details-pill:hover {
          background: #DBEAFE;
        }

        .explore-btn-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .explore-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: white;
          color: var(--color-navy);
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 0.35rem 0.75rem;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
        }

        .explore-ext-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: white;
          color: var(--color-navy);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .stop-expanded-drawer {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1rem;
          font-size: 0.82rem;
          line-height: 1.55;
          width: 100%;
          box-sizing: border-box;
          word-break: break-word;
        }

        .stop-expanded-desc {
          color: #475569;
          margin-bottom: 0.6rem;
        }

        .stop-highlights-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-bottom: 0.6rem;
        }

        .stop-hl-title {
          font-weight: 800;
          color: var(--color-navy);
          display: block;
          width: 100%;
          font-size: 0.72rem;
          text-transform: uppercase;
        }

        .stop-hl-chip {
          background: #FFFFFF;
          color: #1E293B;
          padding: 0.18rem 0.5rem;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          font-size: 0.74rem;
        }

        .stop-extra-specs {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.76rem;
          color: #64748B;
          border-top: 1px dashed #E2E8F0;
          padding-top: 0.5rem;
        }

        /* Destination Spotlight Card */
        .dest-spotlight-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 20px;
          padding: 1.8rem;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .spotlight-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .badge-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          align-items: center;
        }

        .badge-pill-accent, .badge-pill-cat, .badge-pill-rating {
          display: inline-flex;
          align-items: center;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          white-space: normal;
        }

        .badge-pill-accent { background: #DCFCE7; color: #166534; }
        .badge-pill-cat { background: #DBEAFE; color: #1E40AF; }
        .badge-pill-rating { background: #FEF3C7; color: #92400E; }

        .btn-toggle-spotlight {
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
          border-radius: 8px;
          padding: 0.38rem 0.85rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        .spotlight-title {
          font-size: clamp(1.3rem, 4vw, 1.8rem);
          font-weight: 900;
          color: var(--color-navy);
          margin: 0.4rem 0 0.2rem;
          word-break: break-word;
        }

        .spotlight-loc-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 0.88rem;
          color: #64748B;
          font-weight: 600;
        }

        .spotlight-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 1.8rem;
        }

        .spotlight-main-img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          border-radius: 14px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        }

        .spotlight-thumbs {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.6rem;
        }

        .spotlight-thumb {
          width: 64px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .spotlight-desc {
          color: #475569;
          font-size: 0.92rem;
          line-height: 1.6;
          word-break: break-word;
        }

        .spotlight-highlights-list {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.86rem;
          color: #334155;
        }

        .act-pill {
          display: inline-block;
          background: #F1F5F9;
          color: #475569;
          padding: 0.28rem 0.7rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          margin-right: 0.4rem;
          margin-bottom: 0.4rem;
        }

        .spotlight-actions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        /* Duration Presets */
        .duration-presets-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.75rem;
          width: 100%;
        }

        .duration-preset-btn {
          border: 1.5px solid #E2E8F0;
          background: #FFFFFF;
          border-radius: 12px;
          padding: 0.85rem 0.6rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .duration-preset-btn:hover {
          border-color: #94A3B8;
          transform: translateY(-2px);
        }

        .duration-preset-btn.active {
          border-color: var(--color-green);
          background: #F0FDF4;
          box-shadow: 0 0 0 2.5px rgba(21, 155, 117, 0.2);
        }

        .preset-days {
          font-size: 1rem;
          font-weight: 800;
          color: var(--color-navy);
          display: block;
        }

        .preset-badge {
          font-size: 0.68rem;
          font-weight: 800;
          color: #059669;
        }

        .preset-sub {
          font-size: 0.74rem;
          color: #64748B;
          display: block;
        }

        .duration-selected-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          color: #166534;
          background: #F0FDF4;
          padding: 0.6rem 0.9rem;
          border-radius: 10px;
          border: 1px solid #BBF7D0;
        }

        /* Transport Tabs & Tickets */
        .transport-mode-tabs {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .transport-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.9rem;
          border-radius: 10px;
          border: 1.5px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 0.84rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s;
        }

        .transport-tab-btn:hover {
          border-color: #94A3B8;
        }

        .transport-tab-btn.active {
          background: var(--color-navy);
          color: white;
          border-color: var(--color-navy);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }

        .transport-tickets-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .transport-ticket-card {
          border: 1.5px solid #E2E8F0;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 1.3rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .transport-ticket-card:hover {
          border-color: #94A3B8;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }

        .transport-ticket-card.selected {
          border-color: var(--color-green);
          background: #FAFDFB;
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.18), 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .ticket-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.9rem;
          gap: 0.6rem;
        }

        .carrier-logo-badge {
          font-size: 1.6rem;
        }

        .carrier-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0;
        }

        .carrier-code {
          font-size: 0.8rem;
          color: #64748B;
        }

        .ticket-badge {
          font-size: 0.7rem;
          font-weight: 800;
          background: #EFF6FF;
          color: #1D4ED8;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          border: 1px solid #BFDBFE;
        }

        .ticket-timeline-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: center;
          margin-bottom: 0.9rem;
          padding: 0.75rem 0;
          border-top: 1px dashed #E2E8F0;
          border-bottom: 1px dashed #E2E8F0;
        }

        .t-time-point .t-time {
          display: block;
          font-size: 1.05rem;
          font-weight: 900;
          color: var(--color-navy);
        }

        .t-time-point .t-city {
          font-size: 0.76rem;
          color: #64748B;
        }

        .t-duration-mid {
          text-align: center;
        }

        .t-dur-val {
          font-size: 0.76rem;
          font-weight: 800;
          color: #475569;
        }

        .t-line-track {
          height: 2px;
          background: #CBD5E1;
          margin: 0.25rem 0.6rem;
          position: relative;
        }

        .t-stop-label {
          font-size: 0.7rem;
          color: #059669;
          font-weight: 800;
        }

        .ticket-inclusions-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-bottom: 0.9rem;
        }

        .inc-chip {
          background: #F1F5F9;
          font-size: 0.74rem;
          color: #475569;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }

        .ticket-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .t-price-currency {
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--color-green);
        }

        .t-price-num {
          font-size: 1.45rem;
          font-weight: 900;
          color: var(--color-navy);
        }

        .t-price-unit {
          font-size: 0.78rem;
          color: #64748B;
        }

        .t-return-note {
          display: block;
          font-size: 0.74rem;
          color: #64748B;
        }

        /* Hotel Cards */
        .hotel-tier-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .hotel-tier-btn {
          border: 1.5px solid #CBD5E1;
          background: #FFFFFF;
          border-radius: 999px;
          padding: 0.4rem 0.85rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
        }

        .hotel-tier-btn.active {
          background: var(--color-navy);
          color: white;
          border-color: var(--color-navy);
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
        }

        .hotels-selection-stack {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .hotel-select-card {
          display: grid;
          grid-template-columns: 180px 1fr 190px;
          gap: 1.2rem;
          border: 1.5px solid #E2E8F0;
          border-radius: 18px;
          padding: 1.2rem;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s;
        }

        .hotel-select-card:hover {
          border-color: #94A3B8;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
        }

        .hotel-select-card.selected {
          border-color: var(--color-green);
          background: #FAFDFB;
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.18), 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .hotel-card-left {
          position: relative;
        }

        .hotel-card-img {
          width: 100%;
          height: 130px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .hotel-rating-chip {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.88);
          color: #FBBF24;
          font-size: 0.74rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }

        .hotel-tier-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }

        .hotel-tier-badge.tier-budget { background: #DCFCE7; color: #166534; }
        .hotel-tier-badge.tier-comfort { background: #DBEAFE; color: #1E40AF; }
        .hotel-tier-badge.tier-luxury { background: #FEF3C7; color: #92400E; }

        .hotel-loc-text {
          font-size: 0.76rem;
          color: #64748B;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .hotel-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0.25rem 0;
          word-break: break-word;
        }

        .hotel-room-type, .hotel-meals-tag {
          font-size: 0.82rem;
          color: #475569;
          margin-bottom: 0.35rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .btn-toggle-hotel-details {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          color: #1D4ED8;
          font-size: 0.76rem;
          font-weight: 800;
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.3rem;
        }

        .hotel-amenities-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .am-chip {
          background: #F1F5F9;
          font-size: 0.72rem;
          color: #475569;
          padding: 0.18rem 0.5rem;
          border-radius: 6px;
        }

        .hotel-card-right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: right;
          border-left: 1px dashed #E2E8F0;
          padding-left: 1.2rem;
        }

        .h-price-label {
          font-size: 0.72rem;
          color: #64748B;
          text-transform: uppercase;
          font-weight: 700;
          display: block;
        }

        .h-curr {
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--color-green);
        }

        .h-val {
          font-size: 1.55rem;
          font-weight: 900;
          color: var(--color-navy);
        }

        .h-night {
          font-size: 0.78rem;
          color: #64748B;
        }

        .h-total-stay {
          font-size: 0.76rem;
          color: #64748B;
          display: block;
          margin-top: 0.2rem;
        }

        /* Meal Plans */
        .meals-selection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .meal-plan-card {
          border: 1.5px solid #E2E8F0;
          background: #FFFFFF;
          border-radius: 14px;
          padding: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .meal-plan-card:hover {
          border-color: #94A3B8;
        }

        .meal-plan-card.active {
          border-color: var(--color-green);
          background: #F0FDF4;
          box-shadow: 0 0 0 2.5px rgba(21, 155, 117, 0.2);
        }

        .meal-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #166534;
          background: #DCFCE7;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }

        .meal-radio {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1.5px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .meal-radio.checked {
          background: var(--color-green);
          border-color: var(--color-green);
        }

        .meal-plan-card h5 {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-navy);
          margin: 0.35rem 0 0.2rem;
        }

        .meal-plan-card p {
          font-size: 0.8rem;
          color: #64748B;
          margin-bottom: 0.5rem;
        }

        .meal-rate-badge {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--color-green);
          background: #F0FDF4;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          display: inline-block;
        }

        /* Dynamic Calculation Receipt */
        .calculation-breakdown-table {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 18px;
          padding: 1.5rem;
        }

        .calc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 0;
          border-bottom: 1px dashed #E2E8F0;
          gap: 1rem;
        }

        .calc-item-desc {
          min-width: 0;
          word-break: break-word;
        }

        .calc-item-desc strong {
          display: block;
          font-size: 0.94rem;
          color: var(--color-navy);
        }

        .calc-item-desc span {
          font-size: 0.78rem;
          color: #64748B;
        }

        .calc-item-cost {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-navy);
          flex-shrink: 0;
        }

        .calc-total-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.2rem;
          padding-top: 1.2rem;
          border-top: 2px solid #CBD5E1;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .c-tot-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 900;
          color: var(--color-navy);
          letter-spacing: 0.5px;
        }

        .c-tot-sub {
          font-size: 0.76rem;
          color: #64748B;
        }

        .c-tot-amount {
          font-size: 2rem;
          font-weight: 900;
          color: var(--color-green);
          line-height: 1;
        }

        .c-tot-pp {
          font-size: 0.82rem;
          color: #64748B;
          font-weight: 700;
        }

        /* Fixed Packages Grid */
        .fixed-packages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.4rem;
        }

        .fixed-pkg-card {
          border: 2px solid #E2E8F0;
          background: #FFFFFF;
          border-radius: 20px;
          padding: 1.6rem;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          min-width: 0;
          box-sizing: border-box;
        }

        .fixed-pkg-card:hover {
          border-color: #94A3B8;
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }

        .fixed-pkg-card.selected {
          border-color: var(--color-green);
          background: #FAFDFB;
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.18), 0 12px 30px rgba(0, 0, 0, 0.08);
        }

        .fixed-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .pkg-badge {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
        }

        .pkg-badge.pkg-tag-popular { background: #FEF3C7; color: #92400E; }
        .pkg-badge.pkg-tag-best { background: #DCFCE7; color: #166534; }
        .pkg-badge.pkg-tag-vip { background: #DBEAFE; color: #1E40AF; }

        .pkg-radio-indicator {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pkg-radio-indicator.active {
          background: var(--color-green);
          border-color: var(--color-green);
        }

        .pkg-name {
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--color-navy);
          margin-bottom: 0.25rem;
          word-break: break-word;
        }

        .pkg-duration-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 800;
          color: #1D4ED8;
          background: #EFF6FF;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          margin-bottom: 0.75rem;
          width: fit-content;
        }

        .pkg-highlights-text {
          font-size: 0.84rem;
          color: #64748B;
          line-height: 1.45;
          margin-bottom: 0.9rem;
          word-break: break-word;
        }

        .pkg-price-row {
          display: flex;
          align-items: baseline;
          gap: 0.2rem;
          margin-bottom: 0.9rem;
          padding-bottom: 0.8rem;
          border-bottom: 1.5px solid #F1F5F9;
        }

        .pkg-price-currency {
          font-size: 1.2rem;
          font-weight: 900;
          color: var(--color-green);
        }

        .pkg-price-amount {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--color-navy);
        }

        .pkg-price-unit {
          font-size: 0.82rem;
          color: #64748B;
        }

        .btn-toggle-pkg-details {
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
          border-radius: 8px;
          padding: 0.45rem 0.8rem;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-toggle-pkg-details:hover {
          background: #DBEAFE;
        }

        .pkg-facilities-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.84rem;
          color: #334155;
          margin-bottom: 1.2rem;
          flex-grow: 1;
        }

        .fac-title {
          font-size: 0.74rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748B;
          margin-bottom: 0.2rem;
        }

        .fac-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          word-break: break-word;
        }

        /* Summary Sidebar */
        .summary-card {
          background: #FFFFFF;
          border-radius: 22px;
          padding: 1.8rem;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 10px 35px -5px rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 90px;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .summary-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
          padding-bottom: 0.8rem;
          border-bottom: 1.5px solid #F1F5F9;
        }

        .summary-header h3 {
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--color-navy);
          margin: 0;
        }

        .summary-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.4rem;
        }

        .stat-pill {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 0.75rem 0.9rem;
        }

        .stat-label {
          display: block;
          font-size: 0.72rem;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 1.05rem;
          font-weight: 900;
          color: var(--color-navy);
        }

        .summary-route-track {
          border-left: 2px dashed #CBD5E1;
          margin-left: 10px;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          margin-bottom: 1.4rem;
        }

        .track-point {
          position: relative;
        }

        .point-dot {
          position: absolute;
          left: -24px;
          top: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--color-navy);
        }

        .point-dot.origin-dot {
          background: var(--color-green);
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.25);
        }

        .point-role {
          display: block;
          font-size: 0.7rem;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
        }

        .point-sub {
          display: block;
          font-size: 0.75rem;
          color: #64748B;
        }

        .expense-breakdown-box {
          border-top: 1.5px solid #F1F5F9;
          padding-top: 1.1rem;
          margin-bottom: 1.4rem;
        }

        .expense-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--color-navy);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.8rem;
        }

        .expense-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #475569;
          margin-bottom: 0.55rem;
          gap: 0.5rem;
        }

        .expense-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 2px solid #E2E8F0;
          padding-top: 0.9rem;
          margin-top: 0.9rem;
          gap: 0.5rem;
        }

        .total-amount {
          font-size: 1.65rem;
          font-weight: 900;
          color: var(--color-green);
        }

        .register-trip-btn {
          background: linear-gradient(135deg, var(--color-green) 0%, #047857 100%) !important;
          border: none !important;
          padding: 0.85rem !important;
          font-size: 0.95rem !important;
          font-weight: 800 !important;
          border-radius: 12px !important;
          box-shadow: 0 6px 18px rgba(21, 155, 117, 0.35) !important;
          transition: all 0.2s !important;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: white;
        }

        .register-trip-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(21, 155, 117, 0.45) !important;
        }

        /* Daily Itinerary Step */
        .itinerary-timeline-wrap {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .itinerary-day-card {
          display: flex;
          gap: 1rem;
        }

        .day-badge-column {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .day-pill {
          background: var(--color-navy);
          color: white;
          font-size: 0.74rem;
          font-weight: 800;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          white-space: nowrap;
        }

        .day-line {
          width: 2px;
          flex-grow: 1;
          background: #CBD5E1;
          margin-top: 6px;
        }

        .day-content-column {
          flex-grow: 1;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 1rem;
          min-width: 0;
        }

        .day-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-navy);
          margin-bottom: 0.6rem;
          word-break: break-word;
        }

        .day-events-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .day-event-row {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.84rem;
          color: #334155;
          word-break: break-word;
        }

        .event-time-badge {
          background: #EFF6FF;
          color: #1D4ED8;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Form Controls */
        .roavio-input, .roavio-select, .roavio-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          font-size: 0.9rem;
          background: #FFFFFF;
          color: var(--color-navy);
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }

        .roavio-input:focus, .roavio-select:focus, .roavio-textarea:focus {
          border-color: var(--color-green);
          box-shadow: 0 0 0 3px rgba(21, 155, 117, 0.15);
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .input-group-gps {
          display: flex;
          gap: 0.5rem;
        }

        .gps-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0 0.8rem;
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1.5px solid #BFDBFE;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          flex-shrink: 0;
        }

        /* Modals & Checkout Styling - Luxury Modern Upgrade */
        .plan-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          overflow-y: auto;
        }

        .checkout-modal-box {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 820px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.35);
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-sizing: border-box;
          scrollbar-width: thin;
          scrollbar-color: #CBD5E1 transparent;
        }

        .checkout-modal-box::-webkit-scrollbar {
          width: 6px;
        }
        .checkout-modal-box::-webkit-scrollbar-thumb {
          background-color: #CBD5E1;
          border-radius: 6px;
        }

        /* Modal Header */
        .checkout-modal-hdr {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.4rem 1.8rem;
          border-bottom: 1.5px solid #F1F5F9;
          background: #FFFFFF;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .modal-hdr-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: linear-gradient(135deg, #059669 0%, #10B981 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.25);
          flex-shrink: 0;
        }

        .checkout-modal-hdr .modal-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .checkout-modal-hdr .modal-subtitle {
          font-size: 0.8rem;
          color: #64748B;
          display: block;
          margin-top: 2px;
          font-weight: 500;
        }

        .modal-close-x {
          background: #F1F5F9;
          border: none;
          color: #64748B;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-close-x:hover {
          background: #E2E8F0;
          color: #0F172A;
          transform: rotate(90deg);
        }

        /* Modal Form Body */
        .checkout-form-body {
          padding: 1.6rem 1.8rem 2rem;
        }

        /* Boarding Pass Hero Ticket Card */
        .checkout-ticket-card {
          background: linear-gradient(145deg, #F8FAFC 0%, #F1F5F9 100%);
          border: 1.5px solid #E2E8F0;
          border-radius: 18px;
          padding: 1.4rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
          position: relative;
        }

        .ticket-top-ribbon {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ticket-badge-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #DCFCE7;
          color: #166534;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.3rem 0.7rem;
          border-radius: 20px;
          letter-spacing: 0.03em;
          border: 1px solid #BBF7D0;
        }

        .ticket-class-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #EFF6FF;
          color: #1D4ED8;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.3rem 0.65rem;
          border-radius: 20px;
          border: 1px solid #DBEAFE;
        }

        .ticket-main-route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 0;
          border-top: 1px dashed #CBD5E1;
          border-bottom: 1px dashed #CBD5E1;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .route-stop {
          flex: 1;
        }

        .route-type-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #94A3B8;
          letter-spacing: 0.05em;
          display: block;
        }

        .route-city-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0F172A;
          margin: 2px 0 0;
        }

        .route-transit-divider {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: 0 1rem;
        }

        .transit-icon-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FFFFFF;
          color: #059669;
          border: 1.5px solid #BBF7D0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          z-index: 2;
        }

        .transit-operator-badge {
          margin-top: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #475569;
          background: #FFFFFF;
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          white-space: nowrap;
        }

        .ticket-perks-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem 1.2rem;
        }

        .ticket-perk-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .ticket-perk-item .t-lbl {
          display: block;
          font-size: 0.7rem;
          color: #64748B;
          font-weight: 600;
        }

        .ticket-perk-item .t-val {
          display: block;
          font-size: 0.84rem;
          color: #0F172A;
          font-weight: 700;
        }

        /* Traveler Account Card */
        .traveler-account-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #F0FDF4;
          border: 1.5px solid #BBF7D0;
          border-radius: 14px;
          padding: 0.9rem 1.2rem;
          margin-bottom: 1.5rem;
        }

        .account-avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669 0%, #10B981 100%);
          color: #FFFFFF;
          font-size: 1.1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 3px 8px rgba(16, 185, 129, 0.25);
        }

        .account-details-col {
          flex: 1;
        }

        .account-user-name {
          font-size: 0.95rem;
          color: #0F172A;
        }

        .account-verified-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #DCFCE7;
          color: #166534;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 12px;
          border: 1px solid #86EFAC;
        }

        .account-user-email {
          display: block;
          font-size: 0.78rem;
          color: #475569;
          margin-top: 2px;
        }

        /* Checkout Steps */
        .checkout-step-container {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 1.3rem;
          margin-bottom: 1.4rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .checkout-step-hdr {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 1.2rem;
        }

        .step-num-pill {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #059669;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .step-desc {
          font-size: 0.78rem;
          color: #64748B;
          margin: 2px 0 0;
        }

        /* Form Controls */
        .checkout-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.1rem;
        }

        .field-block {
          display: flex;
          flex-direction: column;
        }

        .checkout-field-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #1E293B;
          margin-bottom: 0.4rem;
        }

        .req-star {
          color: #EF4444;
          font-weight: 800;
        }

        .opt-tag {
          font-size: 0.72rem;
          font-weight: 500;
          color: #94A3B8;
        }

        .checkout-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-field-icon {
          position: absolute;
          left: 12px;
          color: #94A3B8;
          pointer-events: none;
        }

        .checkout-text-input {
          width: 100%;
          padding: 0.72rem 0.95rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 11px;
          font-size: 0.9rem;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }

        .checkout-text-input.has-icon {
          padding-left: 38px;
        }

        .checkout-text-input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }

        /* Phone Input Group with Country Code */
        .checkout-phone-input-group {
          display: flex;
          align-items: stretch;
          border: 1.5px solid #CBD5E1;
          border-radius: 11px;
          background: #FFFFFF;
          overflow: hidden;
          transition: all 0.2s;
        }

        .checkout-phone-input-group:focus-within {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }

        .phone-country-code {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 12px;
          background: #F8FAFC;
          border-right: 1.5px solid #E2E8F0;
          font-size: 0.88rem;
          font-weight: 700;
          color: #334155;
          user-select: none;
          flex-shrink: 0;
        }

        .checkout-phone-input {
          border: none;
          outline: none;
          flex: 1;
          padding: 0.72rem 0.95rem;
          font-size: 0.9rem;
          color: #0F172A;
          background: transparent;
        }

        .field-hint {
          font-size: 0.72rem;
          color: #94A3B8;
          margin-top: 0.35rem;
        }

        /* Payment Gateway Methods */
        .pay-methods-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.8rem;
          margin-bottom: 1.2rem;
        }

        .pay-option-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0.9rem 1rem;
          border: 1.5px solid #CBD5E1;
          border-radius: 12px;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .pay-option-card:hover {
          border-color: #94A3B8;
          background: #F8FAFC;
        }

        .pay-option-card.active {
          border-color: #059669;
          background: #F0FDF4;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .option-radio-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pay-option-card.active .option-radio-indicator {
          border-color: #059669;
          background: #059669;
        }

        .radio-inner-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FFFFFF;
          display: none;
        }

        .pay-option-card.active .radio-inner-dot {
          display: block;
        }

        .option-icon-box {
          color: #059669;
          margin-bottom: 0.4rem;
        }

        .option-title {
          font-size: 0.86rem;
          font-weight: 800;
          color: #0F172A;
        }

        .option-sub {
          font-size: 0.72rem;
          color: #64748B;
          margin-top: 2px;
        }

        .popular-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          font-size: 0.65rem;
          font-weight: 800;
          color: #D97706;
          background: #FEF3C7;
          padding: 1px 5px;
          border-radius: 4px;
        }

        .pay-subpanel {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.1rem;
        }

        .upi-app-selectors {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .upi-app-btn {
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          border: 1.5px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upi-app-btn.active {
          border-color: #0F172A;
          background: #0F172A;
          color: #FFFFFF;
        }

        .vpa-input-container,
        .card-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .vpa-verified-badge {
          position: absolute;
          right: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #059669;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .card-brand-badge {
          position: absolute;
          right: 12px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #475569;
          background: #F1F5F9;
          padding: 3px 8px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-subgrid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 0.8rem;
        }

        .bank-select-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.6rem;
        }

        .bank-option-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.7rem 0.9rem;
          border-radius: 10px;
          border: 1.5px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bank-option-card:hover {
          border-color: #94A3B8;
        }

        .bank-option-card.active {
          border-color: #059669;
          background: #F0FDF4;
          color: #166534;
        }

        .bank-check-icon {
          margin-left: auto;
        }

        /* Itemized Fare Receipt */
        .checkout-fare-receipt {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          overflow: hidden;
        }

        .fare-receipt-hdr {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1.2rem;
          background: #F1F5F9;
          border-bottom: 1.5px solid #E2E8F0;
        }

        .receipt-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: #0F172A;
        }

        .guarantee-badge {
          font-size: 0.7rem;
          font-weight: 800;
          color: #059669;
          background: #DCFCE7;
          padding: 2px 7px;
          border-radius: 10px;
        }

        .fare-receipt-body {
          padding: 1.1rem 1.3rem;
        }

        .fare-line-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.84rem;
          color: #475569;
          margin-bottom: 0.6rem;
        }

        .line-item-desc {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .sub-tag {
          font-size: 0.75rem;
          color: #64748B;
        }

        .line-item-amt {
          font-weight: 700;
          color: #0F172A;
        }

        .fare-total-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 2px dashed #CBD5E1;
          padding-top: 1rem;
          margin-top: 0.8rem;
        }

        .total-main-text {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
        }

        .total-sub-text {
          font-size: 0.75rem;
          color: #64748B;
        }

        .total-val-box {
          display: flex;
          align-items: baseline;
          gap: 2px;
          color: #059669;
        }

        .total-currency-sym {
          font-size: 1.2rem;
          font-weight: 800;
        }

        .total-numeric-amt {
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        /* Sticky Footer */
        .checkout-sticky-footer {
          position: sticky;
          bottom: 0;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          padding: 1.1rem 1.4rem;
          margin: 1.5rem -1.8rem -1.8rem;
          border-top: 1.5px solid #E2E8F0;
          box-shadow: 0 -8px 24px rgba(11, 19, 43, 0.08);
          z-index: 20;
          border-radius: 0 0 24px 24px;
        }

        .trust-seals-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.4rem;
          flex-wrap: wrap;
        }

        .trust-seal-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #475569;
        }

        .checkout-action-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .btn-checkout-cancel {
          background: transparent;
          border: 1.5px solid #CBD5E1;
          border-radius: 12px;
          padding: 0.9rem 1.4rem;
          font-weight: 700;
          font-size: 0.88rem;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-checkout-cancel:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        .btn-checkout-confirm {
          flex: 1;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          border: none;
          border-radius: 12px;
          padding: 0.95rem 1.6rem;
          font-weight: 800;
          font-size: 1rem;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(5, 150, 105, 0.35);
          transition: all 0.2s;
        }

        .btn-checkout-confirm:hover {
          background: linear-gradient(135deg, #047857 0%, #065F46 100%);
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(5, 150, 105, 0.45);
        }

        /* Processing Spinner Screen */
        .payment-processing-splash {
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pulse-spinner-glow {
          position: relative;
          width: 72px;
          height: 72px;
          margin-bottom: 1.5rem;
        }

        .inner-spin {
          width: 72px;
          height: 72px;
          border: 4px solid #E2E8F0;
          border-top-color: #059669;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .process-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 0.5rem;
        }

        .process-desc {
          font-size: 0.88rem;
          color: #64748B;
          max-width: 480px;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .processing-progress-bar {
          width: 100%;
          max-width: 360px;
          height: 8px;
          background: #E2E8F0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #059669, #34D399, #059669);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          width: 100%;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .secure-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EFF6FF;
          color: #1D4ED8;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.4rem 0.9rem;
          border-radius: 20px;
          border: 1px solid #BFDBFE;
        }

        /* Booking Confirmed E-Ticket Stub */
        .booking-confirmed-wrapper {
          padding: 2rem 2.2rem;
          text-align: center;
        }

        .booking-success-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .success-pulse-circle {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 0 0 10px rgba(16, 185, 129, 0.15);
        }

        .success-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 0.4rem;
        }

        .success-desc {
          font-size: 0.88rem;
          color: #64748B;
          max-width: 520px;
          line-height: 1.5;
        }

        .luxury-boarding-stub {
          background: #FFFFFF;
          border: 1.5px solid #BBF7D0;
          border-radius: 18px;
          padding: 1.4rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          text-align: left;
        }

        .stub-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1.5px solid #F1F5F9;
          padding-bottom: 0.8rem;
          margin-bottom: 1rem;
        }

        .stub-brand-title {
          font-size: 0.78rem;
          font-weight: 800;
          color: #059669;
          letter-spacing: 0.05em;
        }

        .pnr-badge-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .pnr-title {
          font-size: 0.65rem;
          font-weight: 700;
          color: #94A3B8;
        }

        .pnr-code {
          font-family: monospace;
          font-size: 1.05rem;
          color: #0F172A;
          letter-spacing: 0.05em;
        }

        .stub-route-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
          padding-bottom: 1rem;
          border-bottom: 1px dashed #E2E8F0;
        }

        .stub-sub-lbl {
          font-size: 0.68rem;
          font-weight: 700;
          color: #94A3B8;
          display: block;
        }

        .stub-station-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin: 2px 0 0;
        }

        .stub-route-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .transit-icon-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F0FDF4;
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .route-arrow-txt {
          font-size: 1rem;
          color: #CBD5E1;
        }

        .stub-details-matrix {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.2rem;
        }

        .stub-k {
          display: block;
          font-size: 0.7rem;
          color: #64748B;
          font-weight: 600;
        }

        .stub-v {
          display: block;
          font-size: 0.88rem;
          color: #0F172A;
          font-weight: 700;
          margin-top: 2px;
        }

        .stub-dispatch-footer {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #F8FAFC;
          border-radius: 12px;
          padding: 0.9rem;
          border: 1px solid #E2E8F0;
        }

        .qr-box-simulated {
          width: 52px;
          height: 52px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dispatch-text-col {
          flex: 1;
        }

        /* Mobile Adjustments for Checkout */
        @media (max-width: 640px) {
          .checkout-modal-hdr {
            padding: 1.1rem 1.2rem;
          }
          .checkout-form-body {
            padding: 1.2rem 1.2rem 1.5rem;
          }
          .checkout-sticky-footer {
            margin: 1.2rem -1.2rem -1.5rem;
            padding: 1rem 1.2rem;
            border-radius: 0 0 16px 16px;
          }
          .checkout-form-grid {
            grid-template-columns: 1fr;
          }
          .ticket-perks-grid {
            grid-template-columns: 1fr;
          }
          .pay-methods-grid {
            grid-template-columns: 1fr;
          }
          .card-subgrid {
            grid-template-columns: 1fr;
          }
          .stub-details-matrix {
            grid-template-columns: 1fr 1fr;
          }
          .checkout-action-buttons {
            flex-direction: column-reverse;
          }
          .btn-checkout-cancel,
          .btn-checkout-confirm {
            width: 100%;
          }
        }

        /* =========================================================================
           ADVANCED RESPONSIVE MOBILE VIEW & HORIZONTAL SLIDERS (< 992px & < 768px)
        ========================================================================= */
        @media (max-width: 992px) {
          .planner-grid {
            grid-template-columns: 1fr;
          }

          .summary-card {
            position: static;
            margin-top: 2rem;
          }

          .spotlight-grid {
            grid-template-columns: 1fr;
          }

          .spotlight-main-img {
            height: 200px;
          }

          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .plan-hero {
            padding: 3rem 0 2.2rem;
          }

          .hero-main-title {
            font-size: 1.75rem;
          }

          .planner-card, .dest-spotlight-card, .choice-mode-card {
            padding: 1.1rem;
            border-radius: 16px;
          }

          .choice-tabs-grid {
            grid-template-columns: 1fr;
          }

          /* TOUCH HORIZONTAL SLIDING CAROUSEL */
          .mobile-slide-track {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            gap: 12px !important;
            padding: 4px 4px 12px 4px !important;
            margin-left: -4px !important;
            margin-right: -4px !important;
            scrollbar-width: thin !important;
            scrollbar-color: #94A3B8 #F1F5F9 !important;
          }

          .mobile-slide-track::-webkit-scrollbar {
            height: 5px !important;
          }

          .mobile-slide-track::-webkit-scrollbar-track {
            background: #F1F5F9 !important;
            border-radius: 999px !important;
          }

          .mobile-slide-track::-webkit-scrollbar-thumb {
            background: #94A3B8 !important;
            border-radius: 999px !important;
          }

          .mobile-slide-item {
            flex: 0 0 88% !important;
            max-width: 88% !important;
            min-width: 270px !important;
            scroll-snap-align: start !important;
            box-sizing: border-box !important;
          }

          /* Attraction Stop Card on Mobile */
          .selected-stop-card {
            padding: 1rem;
          }

          .stop-card-main {
            gap: 0.75rem;
          }

          .stop-img {
            width: 60px;
            height: 60px;
            border-radius: 10px;
          }

          .stop-name {
            font-size: 1rem;
          }

          .stop-card-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 0.6rem;
          }

          .btn-toggle-details-pill {
            width: 100%;
            justify-content: center;
          }

          .explore-btn-group {
            width: 100%;
            justify-content: space-between;
          }

          .explore-pill-btn {
            flex-grow: 1;
            justify-content: center;
          }

          /* Destination Spotlight on Mobile */
          .spotlight-header-top {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .btn-toggle-spotlight {
            width: 100%;
            text-align: center;
            justify-content: center;
            display: flex;
          }

          /* Transport Ticket on Mobile */
          .ticket-timeline-row {
            grid-template-columns: 1fr auto 1fr;
            gap: 0.4rem;
          }

          .t-dur-val {
            font-size: 0.72rem;
          }

          /* Hotel Card on Mobile */
          .hotel-select-card {
            grid-template-columns: 1fr;
            gap: 0.9rem;
          }

          .hotel-card-img {
            height: 150px;
          }

          .hotel-card-right {
            border-left: none;
            border-top: 1px dashed #E2E8F0;
            padding-left: 0;
            padding-top: 0.8rem;
            text-align: left;
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .hotel-card-right .btn {
            width: 100%;
          }

          /* Fixed Package on Mobile */
          .fixed-packages-grid .mobile-slide-item {
            flex: 0 0 88% !important;
            max-width: 88% !important;
            min-width: 270px !important;
          }

          /* Duration Presets on Mobile */
          .duration-presets-grid .mobile-slide-item {
            flex: 0 0 150px !important;
            max-width: 150px !important;
            min-width: 150px !important;
          }

          /* Meal Plans on Mobile */
          .meals-selection-grid .mobile-slide-item {
            flex: 0 0 80% !important;
            max-width: 80% !important;
            min-width: 230px !important;
          }

          .pay-methods-tabs {
            grid-template-columns: 1fr;
          }

          .pass-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .main-planner-container {
            padding-left: 10px;
            padding-right: 10px;
          }

          .mobile-slide-item {
            flex: 0 0 92% !important;
            max-width: 92% !important;
            min-width: 260px !important;
          }

          .calc-total-banner {
            flex-direction: column;
            align-items: flex-start;
          }

          .calc-total-banner .text-end {
            text-align: left !important;
            margin-top: 0.5rem;
          }

          .pass-grid {
            grid-template-columns: 1fr;
          }

          .checkout-footer-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .checkout-footer-bar .btn {
            width: 100%;
            justify-content: center;
          }
        }
`}</style>
    </div>
  );
}
