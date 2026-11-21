/**
 * ROAVIO - Notification Queue & Deduplication Engine
 * Handles dispatching, deduplication prevention, and retry mechanisms.
 */
import { sendSmsNotification } from './smsService.js';
import { sendWhatsAppNotification } from './whatsappService.js';
import { sendTicketEmail } from './emailService.js';
import { dbStore } from '../config/db.js';

// In-memory cooldown tracking: key = "bookingId:channel" -> timestamp
const notificationCooldowns = new Map();
const COOLDOWN_MS = 120 * 1000; // 2 minutes cooldown to prevent duplicates

/**
 * Dispatch booking notifications to SMS and WhatsApp
 * Only for confirmed bookings with verified payments
 */
export async function triggerBookingNotifications(booking, baseUrl = 'http://localhost:5173') {
  if (!booking) return { error: 'Booking data missing' };

  // Rule 2: Only send confirmed tickets after actual booking provider confirms and payment status is verified
  if (booking.bookingStatus !== 'Confirmed' || booking.paymentStatus !== 'Verified') {
    return {
      skipped: true,
      reason: `Notifications withheld: Booking status is '${booking.bookingStatus}' and payment is '${booking.paymentStatus}'. Confirmed tickets are only dispatched upon full verification.`
    };
  }

  const ticketUrl = `${baseUrl}/verify-ticket?token=${booking.ticketSecureToken}`;
  const pdfUrl = `${baseUrl}/api/tickets/${booking.bookingId}/pdf`;
  const results = [];

  // 1. SMS Dispatch with Deduplication Check
  const smsKey = `${booking.bookingId}:SMS`;
  const lastSmsTime = notificationCooldowns.get(smsKey);
  const now = Date.now();

  if (lastSmsTime && (now - lastSmsTime) < COOLDOWN_MS) {
    const remainingSecs = Math.round((COOLDOWN_MS - (now - lastSmsTime)) / 1000);
    results.push({
      channel: 'SMS',
      status: 'Duplicate Blocked',
      reason: `Duplicate SMS notification prevented. Cooldown active for another ${remainingSecs} seconds.`
    });
  } else {
    const smsResult = await sendSmsNotification(booking, ticketUrl);
    notificationCooldowns.set(smsKey, now);

    // Save to database notification history
    const logEntry = {
      logId: `NOTIF-${Date.now().toString().slice(-6)}`,
      bookingId: booking.bookingId,
      recipientMobile: smsResult.recipientMobile,
      channel: 'SMS',
      templateUsed: 'ROAVIO_BOOKING_CONFIRMED_V1',
      messageSummary: smsResult.messageSummary,
      providerStatus: smsResult.providerStatus,
      providerResponse: smsResult.providerResponse,
      retryCount: 0,
      timestamp: smsResult.timestamp
    };
    dbStore.notificationLogs.unshift(logEntry);
    dbStore.save();
    results.push(logEntry);
  }

  // 2. WhatsApp Dispatch with Deduplication Check
  const waKey = `${booking.bookingId}:WhatsApp`;
  const lastWaTime = notificationCooldowns.get(waKey);

  if (lastWaTime && (now - lastWaTime) < COOLDOWN_MS) {
    const remainingSecs = Math.round((COOLDOWN_MS - (now - lastWaTime)) / 1000);
    results.push({
      channel: 'WhatsApp',
      status: 'Duplicate Blocked',
      reason: `Duplicate WhatsApp notification prevented. Cooldown active for another ${remainingSecs} seconds.`
    });
  } else {
    const waResult = await sendWhatsAppNotification(booking, ticketUrl, pdfUrl);
    notificationCooldowns.set(waKey, now);

    const logEntry = {
      logId: `NOTIF-${Date.now().toString().slice(-6) + 1}`,
      bookingId: booking.bookingId,
      recipientMobile: waResult.recipientMobile,
      channel: 'WhatsApp',
      messageId: waResult.messageId || null,
      templateUsed: 'roavio_ticket_delivery_v1',
      messageSummary: waResult.messageSummary,
      providerStatus: waResult.providerStatus,
      providerResponse: waResult.providerResponse,
      retryCount: 0,
      timestamp: waResult.timestamp
    };
    dbStore.notificationLogs.unshift(logEntry);
    dbStore.save();
    results.push(logEntry);
  }

  // 3. Resend Email Dispatch with PDF Ticket Attachment
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== '') {
    const emailKey = `${booking.bookingId}:Email`;
    const lastEmailTime = notificationCooldowns.get(emailKey);

    if (!lastEmailTime || (now - lastEmailTime) >= COOLDOWN_MS) {
      const emailResult = await sendTicketEmail(booking, ticketUrl);
      notificationCooldowns.set(emailKey, now);
      results.push(emailResult);
    }
  }

  return { success: true, notifications: results };
}

/**
 * Resend a single notification (SMS, WhatsApp, or Email) on demand
 */
export async function resendNotification(bookingId, channel, baseUrl = 'http://localhost:5173', bypassCooldown = false) {
  const booking = dbStore.bookings.find(b => b.bookingId === bookingId);
  if (!booking) return { success: false, error: 'Booking not found' };

  if (booking.bookingStatus !== 'Confirmed' || booking.paymentStatus !== 'Verified') {
    return {
      success: false,
      error: `Cannot send ticket: Booking status is '${booking.bookingStatus}' and payment status is '${booking.paymentStatus}'.`
    };
  }

  const key = `${bookingId}:${channel}`;
  const lastTime = notificationCooldowns.get(key);
  const now = Date.now();

  // Enforce 30s cooldown on manual resend unless explicitly bypassed for test/admin
  if (!bypassCooldown && lastTime && (now - lastTime) < 30000) {
    const remainingSecs = Math.round((30000 - (now - lastTime)) / 1000);
    return {
      success: false,
      error: `Please wait ${remainingSecs}s before requesting another ${channel} message.`
    };
  }

  const ticketUrl = `${baseUrl}/verify-ticket?token=${booking.ticketSecureToken}`;
  const pdfUrl = `${baseUrl}/api/tickets/${booking.bookingId}/pdf`;
  let result;

  if (channel.toUpperCase() === 'SMS') {
    result = await sendSmsNotification(booking, ticketUrl);
  } else if (channel.toUpperCase() === 'EMAIL') {
    result = await sendTicketEmail(booking, ticketUrl);
    notificationCooldowns.set(key, now);
    return { success: result.success, log: result };
  } else {
    result = await sendWhatsAppNotification(booking, ticketUrl, pdfUrl);
  }

  notificationCooldowns.set(key, now);

  const logEntry = {
    logId: `NOTIF-${Date.now().toString().slice(-6)}`,
    bookingId: booking.bookingId,
    recipientMobile: result.recipientMobile,
    channel: channel.toUpperCase() === 'SMS' ? 'SMS' : 'WhatsApp',
    messageId: result.messageId || null,
    templateUsed: channel.toUpperCase() === 'SMS' ? 'ROAVIO_BOOKING_CONFIRMED_V1' : 'roavio_ticket_delivery_v1',
    messageSummary: result.messageSummary,
    providerStatus: result.providerStatus,
    providerResponse: result.providerResponse,
    retryCount: 0,
    timestamp: result.timestamp
  };
  dbStore.notificationLogs.unshift(logEntry);
  dbStore.save();

  return { success: true, log: logEntry };
}

/**
 * Admin Retry Action for a failed/awaiting notification log
 */
export async function retryNotificationLog(logId, baseUrl = 'http://localhost:5173') {
  const log = dbStore.notificationLogs.find(l => l.logId === logId);
  if (!log) return { success: false, error: 'Log entry not found' };

  const booking = dbStore.bookings.find(b => b.bookingId === log.bookingId);
  if (!booking) return { success: false, error: 'Associated booking record not found' };

  const ticketUrl = `${baseUrl}/verify-ticket?token=${booking.ticketSecureToken}`;
  const pdfUrl = `${baseUrl}/api/tickets/${booking.bookingId}/pdf`;
  let result;

  if (log.channel === 'SMS') {
    result = await sendSmsNotification(booking, ticketUrl);
  } else {
    result = await sendWhatsAppNotification(booking, ticketUrl, pdfUrl);
  }

  log.providerStatus = result.providerStatus;
  log.providerResponse = result.providerResponse;
  log.retryCount = (log.retryCount || 0) + 1;
  log.timestamp = new Date().toISOString();
  dbStore.save();

  return { success: true, log };
}
