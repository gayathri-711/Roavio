/**
 * ROAVIO - Database Configuration
 * MongoDB Atlas Connection with In-Memory / File Fallback Store
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data_store.json');

class LocalStore {
  constructor() {
    this.users = [];
    this.bookings = [];
    this.notificationLogs = [];
    this.otps = new Map(); // mobile -> { code, expiresAt, verified }
    this.itineraries = [];
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(raw);
        this.users = data.users || [];
        this.bookings = data.bookings || [];
        this.notificationLogs = data.notificationLogs || [];
        this.itineraries = data.itineraries || [];
      } else {
        this.seedDefaults();
      }
    } catch (e) {
      console.warn('Fallback store load notice:', e.message);
      this.seedDefaults();
    }
  }

  save() {
    try {
      const data = {
        users: this.users,
        bookings: this.bookings,
        notificationLogs: this.notificationLogs,
        itineraries: this.itineraries
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.warn('Fallback store save notice:', e.message);
    }
  }

  seedDefaults() {
    this.users = [
      {
        id: "usr-101",
        fullName: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        mobileNumber: "9876543210",
        mobileVerified: true,
        role: "Traveler",
        avatar: "RS",
        createdAt: new Date().toISOString()
      },
      {
        id: "usr-admin",
        fullName: "Roavio Administrator",
        email: "admin@roavio.com",
        mobileNumber: "9876500000",
        mobileVerified: true,
        role: "Administrator",
        avatar: "AD",
        createdAt: new Date().toISOString()
      }
    ];

    this.bookings = [
      {
        bookingId: "BK-89021",
        userId: "usr-101",
        category: "flight",
        title: "Air India AI-512 (New Delhi ➔ Kochi)",
        providerName: "Air India",
        providerReference: "ROA-DEL-COK-512",
        sourceLocation: "New Delhi (DEL)",
        destination: "Kochi (COK)",
        travelDate: "2026-12-15",
        travelTime: "06:45 AM",
        passengers: 2,
        leadPassenger: "Rahul Sharma",
        mobileNumber: "9876543210",
        email: "rahul.sharma@example.com",
        seatClass: "Economy (12A, 12B)",
        amount: 10900,
        paymentStatus: "Verified",
        bookingStatus: "Confirmed",
        bookingDate: "2026-11-18",
        ticketSecureToken: "tk_sec_flt_del_cok_89021",
        createdAt: "2026-11-18T10:30:00Z"
      },
      {
        bookingId: "BK-89022",
        userId: "usr-101",
        category: "train",
        title: "Vande Bharat Express (22436) - Executive Class",
        providerName: "Indian Railways",
        providerReference: "ROA-IRCTC-22436",
        sourceLocation: "New Delhi (NDLS)",
        destination: "Varanasi (BSB)",
        travelDate: "2026-12-22",
        travelTime: "06:00 AM",
        passengers: 1,
        leadPassenger: "Rahul Sharma",
        mobileNumber: "9876543210",
        email: "rahul.sharma@example.com",
        seatClass: "Executive Class (C2 - 24 Window)",
        amount: 3300,
        paymentStatus: "Verified",
        bookingStatus: "Confirmed",
        bookingDate: "2026-11-17",
        ticketSecureToken: "tk_sec_trn_ndls_bsb_89022",
        createdAt: "2026-11-17T14:15:00Z"
      },
      {
        bookingId: "BK-89023",
        userId: "usr-101",
        category: "bus",
        title: "IntrCity SmartBus Multi-Axle AC Sleeper",
        providerName: "IntrCity SmartBus",
        providerReference: "ROA-BUS-BLR-GOA",
        sourceLocation: "Bengaluru (Majestic)",
        destination: "Goa (Panaji)",
        travelDate: "2026-11-05",
        travelTime: "09:30 PM",
        passengers: 2,
        leadPassenger: "Rahul Sharma",
        mobileNumber: "9876543210",
        email: "rahul.sharma@example.com",
        seatClass: "Upper Sleeper (U3, U4)",
        amount: 3300,
        paymentStatus: "Verified",
        bookingStatus: "Confirmed",
        bookingDate: "2026-10-28",
        ticketSecureToken: "tk_sec_bus_blr_goa_89023",
        createdAt: "2026-10-28T18:40:00Z"
      },
      {
        bookingId: "BK-89024",
        userId: "usr-101",
        category: "attraction",
        title: "Taj Mahal & Agra Fort Certified Monument Pass",
        providerName: "ASI Certified Partner",
        providerReference: "ROA-PASS-TAJ-482",
        sourceLocation: "Agra, Uttar Pradesh",
        destination: "Taj Mahal Complex",
        travelDate: "2026-12-08",
        travelTime: "All-Day Guided Access",
        passengers: 3,
        leadPassenger: "Rahul Sharma",
        mobileNumber: "9876543210",
        email: "rahul.sharma@example.com",
        seatClass: "Priority Guided Monument Access",
        amount: 3450,
        paymentStatus: "Verified",
        bookingStatus: "Confirmed",
        bookingDate: "2026-11-19",
        ticketSecureToken: "tk_sec_att_taj_agra_89024",
        createdAt: "2026-11-19T09:20:00Z"
      }
    ];

    this.notificationLogs = [
      {
        logId: "NOTIF-001",
        bookingId: "BK-89021",
        recipientMobile: "9876543210",
        channel: "SMS",
        templateUsed: "ROAVIO_BOOKING_CONFIRMED_V1",
        messageSummary: "Hello Rahul Sharma, your Roavio Flight booking is confirmed. Booking ID: BK-89021. Journey: New Delhi to Kochi. Date: 2026-12-15. View your ticket: http://localhost:5173/verify-ticket?token=tk_sec_flt_del_cok_89021",
        providerStatus: "Awaiting Gateway Configuration (SMS_API_KEY not configured)",
        providerResponse: "GATEWAY_KEY_UNSET",
        retryCount: 0,
        timestamp: "2026-11-18T10:30:05Z"
      },
      {
        logId: "NOTIF-002",
        bookingId: "BK-89021",
        recipientMobile: "9876543210",
        channel: "WhatsApp",
        templateUsed: "roavio_ticket_delivery_v1",
        messageSummary: "WhatsApp Ticket PDF & Confirmation for Air India AI-512 (DEL -> COK)",
        providerStatus: "Awaiting Gateway Configuration (WHATSAPP_ACCESS_TOKEN not configured)",
        providerResponse: "CLOUD_API_KEY_UNSET",
        retryCount: 0,
        timestamp: "2026-11-18T10:30:06Z"
      },
      {
        logId: "NOTIF-003",
        bookingId: "BK-89022",
        recipientMobile: "9876543210",
        channel: "SMS",
        templateUsed: "ROAVIO_BOOKING_CONFIRMED_V1",
        messageSummary: "Hello Rahul Sharma, your Roavio Train booking is confirmed. Booking ID: BK-89022. Journey: New Delhi to Varanasi. Date: 2026-12-22. View your ticket: http://localhost:5173/verify-ticket?token=tk_sec_trn_ndls_bsb_89022",
        providerStatus: "Awaiting Gateway Configuration (SMS_API_KEY not configured)",
        providerResponse: "GATEWAY_KEY_UNSET",
        retryCount: 0,
        timestamp: "2026-11-17T14:15:04Z"
      }
    ];

    this.itineraries = [
      {
        itineraryId: "itin-01",
        userId: "usr-101",
        title: "Grand Kerala Backwaters & Tea Hills",
        sourceLocation: "Kochi",
        destinationState: "Kerala",
        startDate: "2026-12-24",
        endDate: "2026-12-29",
        durationDays: 5,
        travelers: 2,
        estimatedBudget: 35000,
        destinations: ["Munnar Tea Hills", "Alleppey Backwaters", "Athirappilly Waterfalls"],
        routeInfo: "Kochi -> Athirappilly (72 km) -> Munnar (134 km) -> Alleppey (175 km) -> Kochi (53 km)",
        mapUrl: "http://localhost:5173/map",
        estimatedTravelTime: "Approx. 11 hours total transit time across scenic Kerala highway corridors",
        notes: "Authentic Vembanad lake sunset cruise booked. Tea museum tour in Munnar scheduled for Day 3 morning.",
        createdAt: "2026-11-15T12:00:00Z"
      }
    ];

    this.save();
  }
}

export const dbStore = new LocalStore();

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ MongoDB URI not set in .env. Running with local persistent data store.');
    return false;
  }
  try {
    // Dynamic import if mongoose is installed
    const mongoose = await import('mongoose');
    await mongoose.default.connect(uri);
    console.log('✅ Connected to MongoDB Atlas successfully.');
    return true;
  } catch (err) {
    console.warn('⚠️ Could not connect to MongoDB Atlas:', err.message);
    console.log('ℹ️ Using local persistent data store as fallback.');
    return false;
  }
}
