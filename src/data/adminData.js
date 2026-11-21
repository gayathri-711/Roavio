/**
 * Roavio - Admin Dashboard Statistics & Management Sample Dataset
 */

export const ADMIN_STATS = {
  totalUsers: 28450,
  usersGrowth: "+14.2% this month",
  totalDestinations: 175,
  statesCovered: 36, // 28 states + 8 UTs
  totalPlannedTrips: 14290,
  tripsGrowth: "+22.5% this month",
  totalBookings: 18920,
  bookingsGrowth: "+18.8% this month",
  totalRevenue: 48250000, // ₹4.82 Crore (sample data)
  revenueGrowth: "+16.4% this month"
};

export const MONTHLY_BOOKINGS_DATA = [
  { month: "Jan", bookings: 1120, revenue: 2850000 },
  { month: "Feb", bookings: 1280, revenue: 3200000 },
  { month: "Mar", bookings: 1450, revenue: 3680000 },
  { month: "Apr", bookings: 1390, revenue: 3510000 },
  { month: "May", bookings: 1680, revenue: 4250000 },
  { month: "Jun", bookings: 1540, revenue: 3900000 },
  { month: "Jul", bookings: 1420, revenue: 3600000 },
  { month: "Aug", bookings: 1610, revenue: 4100000 },
  { month: "Sep", bookings: 1750, revenue: 4450000 },
  { month: "Oct", bookings: 2100, revenue: 5320000 },
  { month: "Nov", bookings: 2350, revenue: 5980000 },
  { month: "Dec", bookings: 2240, revenue: 5710000 }
];

export const TRANSPORT_CATEGORY_SPLIT = [
  { name: "Flights", percentage: 42, color: "#159B75", count: 7946 },
  { name: "Trains", percentage: 31, color: "#142B45", count: 5865 },
  { name: "Buses", percentage: 18, color: "#FF9B54", count: 3405 },
  { name: "Monument Passes", percentage: 9, color: "#6366F1", count: 1704 }
];

export const SAMPLE_USERS = [
  {
    id: "usr-101",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    joinedDate: "2026-04-12",
    city: "New Delhi",
    bookingsCount: 6,
    tripsPlanned: 4,
    status: "Active",
    kycVerified: true,
    role: "Traveler"
  },
  {
    id: "usr-102",
    name: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    phone: "+91 98451 22334",
    joinedDate: "2026-06-19",
    city: "Bengaluru",
    bookingsCount: 4,
    tripsPlanned: 3,
    status: "Active",
    kycVerified: true,
    role: "Traveler"
  },
  {
    id: "usr-103",
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "+91 97112 34567",
    joinedDate: "2026-07-03",
    city: "Mumbai",
    bookingsCount: 8,
    tripsPlanned: 5,
    status: "Active",
    kycVerified: true,
    role: "Traveler"
  },
  {
    id: "usr-104",
    name: "Pooja Deshmukh",
    email: "pooja.d@example.com",
    phone: "+91 94220 88991",
    joinedDate: "2026-08-21",
    city: "Pune",
    bookingsCount: 2,
    tripsPlanned: 2,
    status: "Active",
    kycVerified: false,
    role: "Traveler"
  },
  {
    id: "usr-105",
    name: "Arjun Nambiar",
    email: "arjun.n@example.com",
    phone: "+91 94471 55667",
    joinedDate: "2026-09-14",
    city: "Kochi",
    bookingsCount: 5,
    tripsPlanned: 3,
    status: "Active",
    kycVerified: true,
    role: "Traveler"
  },
  {
    id: "usr-106",
    name: "Admin Superuser",
    email: "admin@roavio.com",
    phone: "+91 1800 102 9900",
    joinedDate: "2026-01-01",
    city: "New Delhi",
    bookingsCount: 0,
    tripsPlanned: 0,
    status: "Active",
    kycVerified: true,
    role: "Administrator"
  }
];

export const SYSTEM_LOGS = [
  { id: "log-1", time: "10 mins ago", event: "New flight booking demonstration confirmed", user: "Rahul Sharma", type: "success" },
  { id: "log-2", time: "25 mins ago", event: "User generated 5-day Kerala Itinerary", user: "Ananya Iyer", type: "info" },
  { id: "log-3", time: "1 hour ago", event: "GPS Route calculation requested: Delhi to Leh", user: "Guest User", type: "info" },
  { id: "log-4", time: "2 hours ago", event: "Destination added to favorites: Pangong Tso", user: "Vikram Malhotra", type: "success" },
  { id: "log-5", time: "3 hours ago", event: "Simulated bus seat reservation: Seat U4", user: "Guest User", type: "warning" }
];
