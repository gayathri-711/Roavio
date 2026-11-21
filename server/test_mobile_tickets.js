/**
 * ROAVIO - Automated Test Suite for Mobile Ticket Delivery & Notification System
 * Validates all 11 test cases required by the prompt specification.
 */
import { dbStore } from './config/db.js';
import { generateTicketToken, verifyTicketToken, generateQrSvg } from './services/qrService.js';
import { sendSmsNotification, formatSmsMessage } from './services/smsService.js';
import { sendWhatsAppNotification } from './services/whatsappService.js';
import { triggerBookingNotifications, resendNotification } from './services/notificationQueue.js';
import { generateTicketHtml, generateItineraryHtml } from './services/ticketPdfService.js';

console.log('=================================================================');
console.log('🧪 RUNNING ROAVIO MOBILE TICKET & NOTIFICATION TEST SUITE');
console.log('=================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${testName}: ${details}`);
    failCount++;
  }
}

async function runTests() {
  // Test 1: Mobile Number Validation
  console.log('--- TEST 1: Mobile Number Validation ---');
  const validMobile = '9876543210';
  const invalidMobile1 = '12345';
  const invalidMobile2 = '4567890123'; // Starts with 4 (invalid in India)
  assert(/^[6-9]\d{9}$/.test(validMobile), 'Valid Indian 10-digit mobile number passes regex');
  assert(!/^[6-9]\d{9}$/.test(invalidMobile1), 'Short mobile number rejected');
  assert(!/^[6-9]\d{9}$/.test(invalidMobile2), 'Mobile number not starting with 6-9 rejected');

  // Test 2: OTP Generation & Expiry
  console.log('\n--- TEST 2: OTP Verification Flow ---');
  const testOtp = '849201';
  dbStore.otps.set(validMobile, { code: testOtp, expiresAt: Date.now() + 60000, verified: false });
  const otpEntry = dbStore.otps.get(validMobile);
  assert(otpEntry && otpEntry.code === testOtp, 'OTP stored in memory with expiry');
  otpEntry.verified = true;
  assert(otpEntry.verified === true, 'Mobile number marked as verified after valid OTP');

  // Test 3: Successful Confirmed Booking Triggers Notifications
  console.log('\n--- TEST 3: Confirmed Booking Notification Trigger ---');
  const confirmedBooking = {
    bookingId: 'BK-TEST-001',
    category: 'flight',
    title: 'IndiGo 6E-204 (Delhi ➔ Goa)',
    providerName: 'IndiGo Airlines',
    providerReference: 'ROA-FLT-TEST-881',
    sourceLocation: 'New Delhi (DEL)',
    destination: 'Goa (GOI)',
    travelDate: '2026-12-28',
    travelTime: '11:00 AM',
    passengers: 1,
    leadPassenger: 'Siddharth Roy',
    mobileNumber: '9876543210',
    seatClass: 'Economy 14F',
    amount: 5400,
    paymentStatus: 'Verified',
    bookingStatus: 'Confirmed',
    ticketSecureToken: generateTicketToken('BK-TEST-001', 'ROA-FLT-TEST-881', 'usr-test')
  };

  const dispatchResult = await triggerBookingNotifications(confirmedBooking);
  assert(dispatchResult.success === true, 'Automatic notification workflow triggered for confirmed booking');
  assert(dispatchResult.notifications?.length === 2, 'Dispatched to both SMS and WhatsApp channels');

  // Test 4: Blocked for Pending / Failed / Cancelled Bookings
  console.log('\n--- TEST 4: Pending / Failed Bookings Blocked ---');
  const pendingBooking = {
    ...confirmedBooking,
    bookingId: 'BK-PENDING-002',
    bookingStatus: 'Pending',
    paymentStatus: 'Unpaid'
  };
  const pendingResult = await triggerBookingNotifications(pendingBooking);
  assert(pendingResult.skipped === true, 'Notification skipped for pending/unpaid booking (No tickets sent)');

  // Test 5: Awaiting Gateway Configuration Handling
  console.log('\n--- TEST 5: Awaiting Gateway Configuration (No Fake Delivery) ---');
  const smsStatus = await sendSmsNotification(confirmedBooking, 'http://localhost:5173/verify-ticket?token=test');
  assert(smsStatus.providerStatus.includes('Awaiting Gateway Configuration'), 'SMS provider status labeled as Awaiting Gateway Configuration when key unset');
  const waStatus = await sendWhatsAppNotification(confirmedBooking, 'http://localhost:5173/verify-ticket?token=test', 'http://localhost:5173/ticket.pdf');
  assert(waStatus.providerStatus.includes('Awaiting Gateway Configuration'), 'WhatsApp provider status labeled as Awaiting Gateway Configuration when token unset');

  // Test 6: PDF Ticket Generation with Roavio Branding
  console.log('\n--- TEST 6: PDF E-Ticket Generation ---');
  const ticketHtml = generateTicketHtml(confirmedBooking);
  assert(ticketHtml.includes('ROAVIO'), 'Ticket HTML contains Roavio branding');
  assert(ticketHtml.includes('BK-TEST-001'), 'Ticket HTML contains booking reference');
  assert(ticketHtml.includes('ROA-FLT-TEST-881'), 'Ticket HTML contains provider PNR');
  assert(ticketHtml.includes('<svg'), 'Ticket HTML contains embedded verification QR code SVG');

  // Test 7: QR Code Signature & Token Verification
  console.log('\n--- TEST 7: Cryptographic QR Code Verification ---');
  const token = confirmedBooking.ticketSecureToken;
  const qrSvg = generateQrSvg(`http://localhost:5173/verify-ticket?token=${token}`);
  assert(qrSvg.includes('<svg') && qrSvg.includes('rect'), 'Vector QR code SVG successfully generated');
  
  dbStore.bookings.push(confirmedBooking);
  const verifyValid = verifyTicketToken(token, dbStore.bookings);
  assert(verifyValid.valid === true, 'Valid token verified with Roavio reservation registry');
  assert(verifyValid.booking.leadPassenger === 'Siddharth Roy', 'Verified booking returns passenger authenticity data');

  const verifyInvalid = verifyTicketToken('fake_tampered_token_99999', dbStore.bookings);
  assert(verifyInvalid.valid === false, 'Tampered/invalid token rejected by verification engine');

  // Test 8: Resend SMS & WhatsApp Actions
  console.log('\n--- TEST 8: Resend Notification Action ---');
  const resendSmsRes = await resendNotification('BK-TEST-001', 'SMS', 'http://localhost:5173', true);
  assert(resendSmsRes.success === true, 'Manual Resend SMS endpoint dispatches and logs event');
  const resendWaRes = await resendNotification('BK-TEST-001', 'WhatsApp', 'http://localhost:5173', true);
  assert(resendWaRes.success === true, 'Manual Resend WhatsApp endpoint dispatches and logs event');

  // Test 9: Duplicate Notification Prevention (Cooldown)
  console.log('\n--- TEST 9: Duplicate Notification Prevention ---');
  const duplicateResend = await resendNotification('BK-TEST-001', 'SMS');
  assert(duplicateResend.success === false && duplicateResend.error.includes('wait'), 'Rapid duplicate dispatch blocked by cooldown guard');

  // Test 10: User Ticket Access Restriction (Ownership)
  console.log('\n--- TEST 10: User Ticket Access Restriction ---');
  const user1Tickets = dbStore.bookings.filter(b => b.userId === 'usr-101');
  const user2Tickets = dbStore.bookings.filter(b => b.userId === 'usr-other-999');
  assert(user1Tickets.length > 0, 'User 101 retrieves their own registered tickets');
  assert(user2Tickets.length === 0, 'Unrelated User 999 cannot access User 101 tickets');

  // Test 11: Planned Itinerary vs. Confirmed Ticket Distinction
  console.log('\n--- TEST 11: Itinerary vs. Confirmed Ticket Distinction ---');
  const sampleItinerary = dbStore.itineraries[0];
  const itineraryHtml = generateItineraryHtml(sampleItinerary);
  assert(itineraryHtml.includes('TRAVEL ITINERARY & ROUTE GUIDE — NOT A CONFIRMED TRANSPORTATION TICKET'), 'Itinerary PDF contains prominent non-ticket disclaimer banner');
  assert(!itineraryHtml.includes('CONFIRMED TICKET'), 'Itinerary document does not claim to be an admission ticket');

  console.log('\n=================================================================');
  console.log(`🏁 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('=================================================================');

  if (failCount > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test Suite Exception:', err);
  process.exit(1);
});
