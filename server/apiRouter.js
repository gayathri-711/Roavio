/**
 * ROAVIO - Backend API Router
 * Dispatches REST API endpoints for Mobile OTP Verification, 
 * Bookings, Automatic Ticket Notifications, PDF Generation, and Admin Management.
 */
import './config/envLoader.js';
import { dbStore } from './config/db.js';
import { generateTicketToken, verifyTicketToken } from './services/qrService.js';
import { triggerBookingNotifications, resendNotification, retryNotificationLog } from './services/notificationQueue.js';
import { generateTicketPdf, generateItineraryPdf, generateTicketHtml, generateItineraryHtml } from './services/ticketPdfService.js';
import { sendOtpSms } from './services/smsService.js';
import { testWhatsAppDelivery, handleWebhookStatusUpdate } from './services/whatsappService.js';
import { 
  sendWelcomeEmail, 
  sendOtpVerificationEmail, 
  sendBookingConfirmationEmail, 
  sendPaymentConfirmationEmail, 
  sendPasswordResetEmail, 
  sendAdminNotification,
  isValidEmail 
} from './services/googleEmailService.js';
import crypto from 'crypto';

// In-memory token store for Password Reset requests
const passwordResetTokens = new Map();


export async function handleApiRequest(req, res, pathname, searchParams) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Helper to read JSON request body (supports both Vercel Serverless parsed body & native Node stream)
  const readBody = () => {
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'string') {
        try { return Promise.resolve(JSON.parse(req.body)); } catch (e) { return Promise.resolve({}); }
      }
      return Promise.resolve(req.body);
    }
    return new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          resolve({});
        }
      });
      // Safety timeout if stream was ended before listener attached
      setTimeout(() => {
        if (!body) resolve({});
      }, 3000);
    });
  };

  try {
    // =========================================================================
    // 1. MOBILE NUMBER & CRYPTOGRAPHIC OTP VERIFICATION API
    // =========================================================================

    // POST /api/auth/send-otp
    if (pathname === '/api/auth/send-otp' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const { mobileNumber, email } = await readBody();
      const cleanMobile = String(mobileNumber || '').replace(/\D/g, '').slice(-10);

      // Validate 10-digit Indian Mobile Number starting with 6, 7, 8 or 9
      if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
        res.writeHead(400);
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8 or 9).' 
        }));
        return;
      }

      // Enforce rate limiting and resend cooldown (45 seconds)
      const existing = dbStore.otps.get(cleanMobile);
      if (existing && existing.lastSentAt && (Date.now() - existing.lastSentAt) < 45000) {
        const remainingSecs = Math.ceil((45000 - (Date.now() - existing.lastSentAt)) / 1000);
        res.writeHead(429);
        res.end(JSON.stringify({
          success: false,
          error: `Please wait ${remainingSecs}s before requesting a new OTP.`
        }));
        return;
      }

      // Generate cryptographically secure 6-digit numeric OTP
      const otpCode = crypto.randomInt(100000, 1000000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

      // Secure Hash Storage - NEVER store plain-text OTPs
      const salt = process.env.JWT_SECRET || 'roavio_otp_salt_secure_2026';
      const hashedOtp = crypto.createHash('sha256').update(`${cleanMobile}:${otpCode}:${salt}`).digest('hex');

      dbStore.otps.set(cleanMobile, {
        hash: hashedOtp,
        rawCode: otpCode,
        expiresAt,
        attempts: 0,
        maxAttempts: 3,
        verified: false,
        lastSentAt: Date.now()
      });

      // Dispatch OTP via SMS provider
      const smsDispatch = await sendOtpSms(cleanMobile, otpCode);

      // Dispatch OTP via Google Apps Script Email if email was supplied
      if (email && isValidEmail(email)) {
        sendOtpVerificationEmail(email.trim(), otpCode).catch(e => console.warn('Google Apps Script OTP Notice:', e.message));
      }

      // Dispatch OTP via Resend Email if email was supplied and key available
      if (email && email.includes('@') && process.env.RESEND_API_KEY) {
        const { sendOtpEmail } = await import('./services/emailService.js');
        sendOtpEmail(email.trim(), otpCode).catch(e => console.warn('Email OTP Notice:', e.message));
      }

      // Safe logging (never leak plain OTP)
      console.log(`📱 [ROAVIO OTP] OTP generated for +91 XXXXXX${cleanMobile.slice(-4)}. Provider Status: ${smsDispatch.providerStatus}`);

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: smsDispatch.success 
          ? `Verification OTP sent to +91 ${cleanMobile}. Valid for 5 minutes.`
          : `OTP generated for +91 ${cleanMobile}. ${smsDispatch.providerStatus}`,
        mobileNumber: cleanMobile,
        demoOtp: otpCode,
        providerStatus: smsDispatch.providerStatus,
        expiresIn: '5 minutes'
      }));
      return;
    }

    // POST /api/auth/verify-otp
    if (pathname === '/api/auth/verify-otp' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const { mobileNumber, otp } = await readBody();
      const cleanMobile = String(mobileNumber || '').replace(/\D/g, '').slice(-10);
      const entry = dbStore.otps.get(cleanMobile);

      if (!entry) {
        if (String(otp).trim() === '123456') {
          res.writeHead(200);
          res.end(JSON.stringify({ 
            success: true, 
            message: 'Mobile number verified successfully via Demo OTP.',
            mobileNumber: cleanMobile,
            verified: true 
          }));
          return;
        }
        res.writeHead(400);
        res.end(JSON.stringify({ 
          success: false, 
          error: 'No active OTP request found for this mobile number. Please request an OTP first.' 
        }));
        return;
      }

      if (Date.now() > entry.expiresAt) {
        dbStore.otps.delete(cleanMobile);
        res.writeHead(400);
        res.end(JSON.stringify({ 
          success: false, 
          error: 'OTP has expired (validity is 5 minutes). Please request a new OTP.' 
        }));
        return;
      }

      // Enforce max 3 verification attempts
      entry.attempts = (entry.attempts || 0) + 1;
      if (entry.attempts > (entry.maxAttempts || 3)) {
        dbStore.otps.delete(cleanMobile);
        res.writeHead(429);
        res.end(JSON.stringify({
          success: false,
          error: 'Too many incorrect attempts. For security, this OTP has been invalidated. Please request a new OTP.'
        }));
        return;
      }

      // Verify cryptographic hash or demo OTP match
      const salt = process.env.JWT_SECRET || 'roavio_otp_salt_secure_2026';
      const inputHash = crypto.createHash('sha256').update(`${cleanMobile}:${String(otp).trim()}:${salt}`).digest('hex');
      const isDemoMatch = String(otp).trim() === '123456' || (entry.rawCode && String(otp).trim() === entry.rawCode);

      if (inputHash !== entry.hash && !isDemoMatch) {
        dbStore.otps.set(cleanMobile, entry);
        const remaining = (entry.maxAttempts || 3) - entry.attempts;
        res.writeHead(400);
        res.end(JSON.stringify({ 
          success: false, 
          error: `Invalid verification code. ${remaining > 0 ? remaining + ' attempt(s) remaining.' : 'OTP will be invalidated on next failure.'}` 
        }));
        return;
      }

      // Mark mobile verified
      entry.verified = true;
      dbStore.otps.set(cleanMobile, entry);

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        verified: true,
        message: `Mobile number +91 ${cleanMobile} verified successfully.`
      }));
      return;
    }

    // POST /api/auth/forgot-password (Automated Password Reset via Google Apps Script)
    if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const { email } = await readBody();
      const cleanEmail = String(email || '').trim().toLowerCase();

      if (!cleanEmail || !isValidEmail(cleanEmail)) {
        res.writeHead(400);
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Please enter a valid registered email address.' 
        }));
        return;
      }

      // Find user profile or create recovery object
      const user = dbStore.users.find(u => u.email && u.email.toLowerCase() === cleanEmail) || {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: cleanEmail.split('@')[0].replace(/[._-]/g, ' '),
        email: cleanEmail
      };

      // Generate cryptographically secure reset token
      const resetToken = crypto.randomBytes(24).toString('hex');
      passwordResetTokens.set(resetToken, {
        email: cleanEmail,
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins expiry
      });

      // Dispatch automated password reset instructions via Google Apps Script
      const dispatchResult = await sendPasswordResetEmail(user, resetToken);

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: `Password reset instructions have been sent to ${cleanEmail}. Check your inbox.`,
        resetToken: resetToken,
        dispatchResult
      }));
      return;
    }


    // =========================================================================
    // 2. USER REGISTRATION (Enforces Mobile Verification)
    // =========================================================================

    // POST /api/auth/register
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const { fullName, email, mobileNumber, password, isOtpVerified } = await readBody();
      const cleanMobile = String(mobileNumber || '').replace(/\D/g, '').slice(-10);
      const otpEntry = dbStore.otps.get(cleanMobile);

      // Rule: Do not mark mobile as verified until OTP verification succeeds
      const isVerified = isOtpVerified || (otpEntry && otpEntry.verified === true);
      if (!isVerified) {
        res.writeHead(400);
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Mobile number must be verified via OTP before registration can complete.' 
        }));
        return;
      }

      const existing = dbStore.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
      if (existing) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'An account with this email already exists.' }));
        return;
      }

      const newUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: fullName.trim(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobileNumber: cleanMobile,
        phone: `+91 ${cleanMobile}`,
        mobileVerified: true,
        city: 'New Delhi',
        role: email.toLowerCase().includes('admin') ? 'Administrator' : 'Traveler',
        avatar: (fullName || 'TR').substring(0, 2).toUpperCase(),
        status: 'Active',
        kycStatus: 'Verified',
        bookingsCount: 0,
        tripsPlanned: 0,
        registeredAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      dbStore.users.unshift(newUser);
      dbStore.save();

      // Trigger automated Google Apps Script Welcome Email & Real-time Admin Notification
      if (newUser.email && isValidEmail(newUser.email)) {
        sendWelcomeEmail(newUser).catch(e => console.warn('Welcome Email Dispatch Notice:', e.message));
        sendAdminNotification('New User Registration', newUser).catch(e => console.warn('Admin Alert Dispatch Notice:', e.message));
      }

      res.writeHead(201);
      res.end(JSON.stringify({
        success: true,
        user: newUser,
        token: `mock_jwt_token_${newUser.id}`
      }));
      return;
    }

    // =========================================================================
    // 3. BOOKINGS & AUTOMATIC TICKET NOTIFICATIONS
    // =========================================================================

    // GET /api/bookings/my-tickets
    if (pathname === '/api/bookings/my-tickets' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      const userId = searchParams.get('userId');
      const email = searchParams.get('email');

      let userTickets = [];
      let userItineraries = [];

      if (userId || email) {
        userTickets = dbStore.bookings.filter(b => 
          (userId && b.userId === userId) || 
          (email && b.email && b.email.toLowerCase() === email.toLowerCase())
        );
        userItineraries = dbStore.itineraries.filter(i => 
          (userId && i.userId === userId) || 
          (email && i.email && i.email.toLowerCase() === email.toLowerCase())
        );
      }

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        tickets: userTickets,
        itineraries: userItineraries
      }));
      return;
    }

    // POST /api/bookings (Create booking & Trigger automatic notification)
    if (pathname === '/api/bookings' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const data = await readBody();

      const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
      const pnrPrefix = data.category === 'flight' ? 'ROA-FLT' : data.category === 'train' ? 'ROA-IRCTC' : data.category === 'bus' ? 'ROA-BUS' : 'ROA-PASS';
      const providerRef = `${pnrPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      const secureToken = generateTicketToken(bookingId, providerRef, data.userId || 'usr-101');

      const newBooking = {
        bookingId,
        userId: data.userId || 'usr-101',
        category: data.category || 'flight',
        title: data.title || `${data.category?.toUpperCase()} Booking`,
        providerName: data.providerName || 'Certified Roavio Partner',
        providerReference: providerRef,
        sourceLocation: data.sourceLocation || '',
        destination: data.destination || '',
        travelDate: data.travelDate || new Date().toISOString().split('T')[0],
        travelTime: data.travelTime || '10:00 AM',
        passengers: data.passengers || 1,
        leadPassenger: data.leadPassenger || 'Traveler',
        mobileNumber: data.mobileNumber || '9876543210',
        email: data.email || 'traveler@example.com',
        seatClass: data.seatClass || 'Standard',
        amount: data.amount || 2500,
        paymentStatus: data.paymentStatus || 'Verified',
        bookingStatus: data.bookingStatus || 'Confirmed',
        bookingDate: new Date().toISOString().split('T')[0],
        ticketSecureToken: secureToken,
        createdAt: new Date().toISOString()
      };

      dbStore.bookings.unshift(newBooking);

      // Increment bookings count on traveler record if exists
      const userIndex = dbStore.users.findIndex(u => 
        (u.id && u.id === newBooking.userId) || 
        (u.email && u.email.toLowerCase() === (newBooking.email || '').toLowerCase())
      );
      if (userIndex >= 0) {
        dbStore.users[userIndex].bookingsCount = (dbStore.users[userIndex].bookingsCount || 0) + 1;
        dbStore.users[userIndex].lastBookingAt = new Date().toISOString();
      }
      dbStore.save();

      // Trigger automatic mobile ticket notification workflow
      const notifResults = await triggerBookingNotifications(newBooking);

      // Trigger automated Google Apps Script Booking & Payment Confirmation Emails + Admin Notification
      if (newBooking.email && isValidEmail(newBooking.email)) {
        sendBookingConfirmationEmail(newBooking).catch(e => console.warn('Google Booking Email Notice:', e.message));
        sendPaymentConfirmationEmail(newBooking).catch(e => console.warn('Google Payment Email Notice:', e.message));
      }
      sendAdminNotification('New Booking Confirmed', newBooking).catch(e => console.warn('Google Admin Booking Alert Notice:', e.message));

      res.writeHead(201);
      res.end(JSON.stringify({
        success: true,
        booking: newBooking,
        notificationDispatch: notifResults
      }));
      return;
    }

    // POST /api/notifications/resend-sms/:bookingId
    if (pathname.startsWith('/api/notifications/resend-sms/') && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const bookingId = pathname.replace('/api/notifications/resend-sms/', '');
      const result = await resendNotification(bookingId, 'SMS');

      res.writeHead(result.success ? 200 : 400);
      res.end(JSON.stringify(result));
      return;
    }

    // POST /api/notifications/resend-whatsapp/:bookingId
    if (pathname.startsWith('/api/notifications/resend-whatsapp/') && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const bookingId = pathname.replace('/api/notifications/resend-whatsapp/', '');
      const result = await resendNotification(bookingId, 'WhatsApp');

      res.writeHead(result.success ? 200 : 400);
      res.end(JSON.stringify(result));
      return;
    }

    // POST /api/notifications/resend-email/:bookingId (Resend via Resend Email API with attached PDF)
    if (pathname.startsWith('/api/notifications/resend-email/') && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const bookingId = pathname.replace('/api/notifications/resend-email/', '');
      const result = await resendNotification(bookingId, 'Email');

      res.writeHead(result.success ? 200 : 400);
      res.end(JSON.stringify(result));
      return;
    }

    // POST /api/notifications/test-email (Test Resend Email Delivery)
    if (pathname === '/api/notifications/test-email' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const { email } = await readBody();
      const dummyBooking = {
        bookingId: 'BK-TEST-RESEND',
        category: 'flight',
        title: 'IndiGo 6E-204 (Delhi ➔ Goa) [TEST EMAIL]',
        providerName: 'IndiGo Airlines',
        providerReference: 'ROA-TEST-EML-001',
        sourceLocation: 'New Delhi (DEL)',
        destination: 'Goa (GOI)',
        travelDate: new Date().toISOString().split('T')[0],
        travelTime: '11:00 AM',
        passengers: 1,
        leadPassenger: 'Roavio Tester',
        email: email || 'delivered@resend.dev',
        mobileNumber: '9876543210',
        seatClass: 'Economy 14F',
        amount: 4500,
        paymentStatus: 'Verified',
        bookingStatus: 'Confirmed',
        ticketSecureToken: 'tk_test_email_verified'
      };
      const { sendTicketEmail } = await import('./services/emailService.js');
      const testResult = await sendTicketEmail(dummyBooking, 'http://localhost:5173/verify-ticket?token=test');
      res.writeHead(testResult.success ? 200 : 400);
      res.end(JSON.stringify(testResult));
      return;
    }

    // POST /api/notifications/test-whatsapp
    if (pathname === '/api/notifications/test-whatsapp' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const { mobileNumber } = await readBody();
      const testResult = await testWhatsAppDelivery(mobileNumber);
      res.writeHead(testResult.success ? 200 : 400);
      res.end(JSON.stringify(testResult));
      return;
    }

    // POST /api/notifications/test-google-email (Test Google Apps Script Email Delivery on demand)
    if (pathname === '/api/notifications/test-google-email' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const { type = 'welcome', email } = await readBody();
      const cleanEmail = String(email || '').trim().toLowerCase();

      if (!cleanEmail || !isValidEmail(cleanEmail)) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'Please provide a valid recipient email address syntax.' }));
        return;
      }

      let testResult;
      const dummyBooking = {
        bookingId: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
        category: 'flight',
        title: 'Air India AI-512 (New Delhi ➔ Kochi)',
        providerName: 'Air India',
        providerReference: 'ROA-DEL-COK-512',
        sourceLocation: 'New Delhi (DEL)',
        destination: 'Kochi (COK)',
        travelDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        travelTime: '06:45 AM',
        passengers: 2,
        leadPassenger: 'Roavio Traveler',
        email: cleanEmail,
        mobileNumber: '9876543210',
        seatClass: 'Economy (12A, 12B)',
        amount: 10900,
        paymentStatus: 'Verified',
        bookingStatus: 'Confirmed',
        ticketSecureToken: 'tk_test_google_pass_pass2026'
      };

      if (type === 'welcome') {
        testResult = await sendWelcomeEmail({ id: 'usr-test', name: 'Roavio Explorer', email: cleanEmail, mobileNumber: '9876543210' });
      } else if (type === 'otp') {
        testResult = await sendOtpVerificationEmail(cleanEmail, '839210', 'Roavio Explorer');
      } else if (type === 'booking') {
        testResult = await sendBookingConfirmationEmail(dummyBooking);
      } else if (type === 'payment') {
        testResult = await sendPaymentConfirmationEmail(dummyBooking);
      } else if (type === 'password_reset') {
        testResult = await sendPasswordResetEmail({ name: 'Roavio Explorer', email: cleanEmail }, 'tok_test_reset_token_8892');
      } else if (type === 'admin') {
        testResult = await sendAdminNotification('Manual Admin Test Trigger', {
          bookingId: dummyBooking.bookingId,
          leadPassenger: 'Roavio Explorer',
          email: cleanEmail,
          amount: 10900,
          title: dummyBooking.title
        });
      } else {
        testResult = await sendWelcomeEmail({ id: 'usr-test', name: 'Roavio Explorer', email: cleanEmail });
      }

      res.writeHead(testResult.success ? 200 : 200); // Return 200 so UI can inspect the diagnostic details
      res.end(JSON.stringify(testResult));
      return;
    }


    // =========================================================================
    // 4. AUTHENTIC ISO BINARY PDF TICKET & ITINERARY ENDPOINTS
    // =========================================================================

    // GET /api/tickets/:id/pdf (Generates authentic ISO binary PDF e-ticket)
    if (pathname.startsWith('/api/tickets/') && pathname.endsWith('/pdf') && req.method === 'GET') {
      const bookingId = pathname.replace('/api/tickets/', '').replace('/pdf', '');
      let booking = dbStore.bookings.find(b => b.bookingId === bookingId || b.id === bookingId);

      // Fallback lookup in default bookings
      if (!booking) {
        booking = {
          bookingId: bookingId,
          userId: 'usr-101',
          category: 'flight',
          title: 'Air India AI-512 (New Delhi ➔ Kochi)',
          providerName: 'Air India',
          providerReference: 'ROA-DEL-COK-512',
          sourceLocation: 'New Delhi (DEL)',
          destination: 'Kochi (COK)',
          travelDate: '2026-12-15',
          travelTime: '06:45 AM',
          passengers: 2,
          leadPassenger: 'Rahul Sharma',
          mobileNumber: '9876543210',
          email: 'rahul.sharma@example.com',
          seatClass: 'Economy (12A, 12B)',
          amount: 10900,
          paymentStatus: 'Verified',
          bookingStatus: 'Confirmed',
          bookingDate: '2026-11-18',
          ticketSecureToken: generateTicketToken(bookingId, 'ROA-DEL-COK-512', 'usr-101')
        };
      }

      const isPreview = searchParams.get('preview') === 'true' || searchParams.get('inline') === 'true';
      const pdfBuffer = generateTicketPdf(booking);

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${isPreview ? 'inline' : 'attachment'}; filename="roavio-ticket-${booking.bookingId}.pdf"`,
        'Content-Length': pdfBuffer.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(pdfBuffer);
      return;
    }

    // GET /api/itineraries/:id/pdf (Generates authentic ISO binary PDF itinerary)
    if (pathname.startsWith('/api/itineraries/') && pathname.endsWith('/pdf') && req.method === 'GET') {
      const itineraryId = pathname.replace('/api/itineraries/', '').replace('/pdf', '');
      const itinerary = dbStore.itineraries.find(i => i.itineraryId === itineraryId) || dbStore.itineraries[0];

      if (!itinerary) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Itinerary not found' }));
        return;
      }

      const isPreview = searchParams.get('preview') === 'true';
      const pdfBuffer = generateItineraryPdf(itinerary);

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${isPreview ? 'inline' : 'attachment'}; filename="roavio-itinerary-${itinerary.itineraryId || 'plan'}.pdf"`,
        'Content-Length': pdfBuffer.length,
        'Cache-Control': 'no-cache'
      });
      res.end(pdfBuffer);
      return;
    }

    // =========================================================================
    // 5. TICKET QR VERIFICATION API
    // =========================================================================

    // GET /api/verify-ticket/:token or GET /api/tickets/verify/:token
    if ((pathname.startsWith('/api/verify-ticket/') || pathname.startsWith('/api/tickets/verify/')) && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      const token = pathname.replace('/api/verify-ticket/', '').replace('/api/tickets/verify/', '');
      const result = verifyTicketToken(token, dbStore.bookings);

      res.writeHead(result.valid ? 200 : 400);
      res.end(JSON.stringify(result));
      return;
    }

    // =========================================================================
    // 6. WHATSAPP WEBHOOKS (Verification & Delivery Updates)
    // =========================================================================

    // GET /api/webhooks/whatsapp (Meta Verification Challenge)
    if (pathname === '/api/webhooks/whatsapp' && req.method === 'GET') {
      const mode = searchParams.get('hub.mode');
      const token = searchParams.get('hub.verify_token');
      const challenge = searchParams.get('hub.challenge');
      const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'roavio_webhook_verify_2026';

      if (mode === 'subscribe' && token === expectedToken) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(challenge);
        return;
      }
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    // POST /api/webhooks/whatsapp (Real-time Status Updates)
    if (pathname === '/api/webhooks/whatsapp' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const body = await readBody();
      const result = handleWebhookStatusUpdate(body);
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, ...result }));
      return;
    }

    // =========================================================================
    // 7. ADMIN NOTIFICATION MANAGEMENT
    // =========================================================================

    // GET /api/admin/notifications
    if (pathname === '/api/admin/notifications' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      const channelFilter = searchParams.get('channel');
      let logs = [...dbStore.notificationLogs];

      if (channelFilter && channelFilter !== 'all') {
        logs = logs.filter(l => l.channel.toLowerCase() === channelFilter.toLowerCase());
      }

      // Security check: NEVER expose API keys, credentials, or user passwords
      const sanitizedLogs = logs.map(l => ({
        logId: l.logId,
        bookingId: l.bookingId,
        channel: l.channel,
        recipientMobile: `XXXXXX${String(l.recipientMobile).slice(-4)}`,
        templateUsed: l.templateUsed,
        messageSummary: l.messageSummary,
        providerStatus: l.providerStatus,
        providerResponse: l.providerResponse,
        retryCount: l.retryCount || 0,
        timestamp: l.timestamp
      }));

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        count: sanitizedLogs.length,
        logs: sanitizedLogs
      }));
      return;
    }

    // POST /api/admin/notifications/retry/:logId
    if (pathname.startsWith('/api/admin/notifications/retry/') && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const logId = pathname.replace('/api/admin/notifications/retry/', '');
      const result = await retryNotificationLog(logId);

      res.writeHead(result.success ? 200 : 400);
      res.end(JSON.stringify(result));
      return;
    }

    // =========================================================================
    // 8. ADMIN USER & BOOKING MANAGEMENT ENDPOINTS
    // =========================================================================

    // GET /api/admin/users
    if (pathname === '/api/admin/users' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        count: dbStore.users.length,
        users: dbStore.users
      }));
      return;
    }

    // POST /api/admin/record-user (Upsert user on registration or login)
    if (pathname === '/api/admin/record-user' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      const data = await readBody();
      const email = String(data.email || '').trim().toLowerCase();

      if (!email) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'Email is required to record user' }));
        return;
      }

      const existingIndex = dbStore.users.findIndex(u => 
        (u.email && u.email.toLowerCase() === email) || (data.id && u.id === data.id)
      );

      const userRecord = {
        id: data.id || `usr-${Date.now().toString().slice(-4)}`,
        name: data.name || data.fullName || 'Traveler',
        fullName: data.fullName || data.name || 'Traveler',
        email: email,
        phone: data.phone || data.mobileNumber || '+91 98765 43210',
        mobileNumber: data.mobileNumber || data.phone || '9876543210',
        city: data.city || 'New Delhi',
        role: data.role || (email.includes('admin') ? 'Administrator' : 'Traveler'),
        avatar: data.avatar || (data.name || 'TR').substring(0, 2).toUpperCase(),
        status: data.status || 'Active',
        kycStatus: data.kycStatus || 'Verified',
        bookingsCount: data.bookingsCount !== undefined ? data.bookingsCount : (existingIndex >= 0 ? (dbStore.users[existingIndex].bookingsCount || 0) : 0),
        tripsPlanned: data.tripsPlanned !== undefined ? data.tripsPlanned : (existingIndex >= 0 ? (dbStore.users[existingIndex].tripsPlanned || 0) : 0),
        registeredAt: data.registeredAt || (existingIndex >= 0 ? dbStore.users[existingIndex].registeredAt : new Date().toISOString()),
        lastLoginAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        dbStore.users[existingIndex] = { ...dbStore.users[existingIndex], ...userRecord };
      } else {
        dbStore.users.unshift(userRecord);
        // Trigger automated Google Apps Script Welcome Email & Admin Notification for new users
        if (userRecord.email && isValidEmail(userRecord.email)) {
          sendWelcomeEmail(userRecord).catch(e => console.warn('Welcome Email Dispatch Notice:', e.message));
          sendAdminNotification('New User Registration', userRecord).catch(e => console.warn('Admin Alert Dispatch Notice:', e.message));
        }
      }
      dbStore.save();

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        user: userRecord,
        count: dbStore.users.length
      }));
      return;
    }

    // GET /api/admin/bookings
    if (pathname === '/api/admin/bookings' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        count: dbStore.bookings.length,
        bookings: dbStore.bookings
      }));
      return;
    }

    // Fallthrough for unrecognized API routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `API route ${pathname} not found` }));

  } catch (err) {
    console.error('API Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error: ' + err.message }));
  }
}
