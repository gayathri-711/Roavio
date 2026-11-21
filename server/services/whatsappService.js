/**
 * ROAVIO - WhatsApp Business Cloud API Integration Service
 * Meta for Developers Graph API v18.0
 * Handles official Cloud API document, template, and text messaging,
 * recipient number internationalization (+91), status tracking, and webhooks.
 */
import https from 'https';
import { dbStore } from '../config/db.js';

/**
 * Format mobile number into international E.164 digits without symbols for Meta Graph API
 * E.g. "+91 98765-43210" -> "919876543210"
 */
export function formatWhatsAppNumber(rawNumber) {
  if (!rawNumber) return '';
  const digits = String(rawNumber).replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Send WhatsApp booking confirmation with official PDF document pass and text summary
 */
export async function sendWhatsAppNotification(booking, ticketUrl, pdfUrl) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME; // Optional pre-approved Meta template
  const rawMobile = booking.mobileNumber || booking.phone || '';
  const formattedMobile = formatWhatsAppNumber(rawMobile);

  const categoryName = (booking.category || 'Travel').charAt(0).toUpperCase() + (booking.category || 'Travel').slice(1);
  const route = booking.sourceLocation && booking.destination 
    ? `${booking.sourceLocation} ➔ ${booking.destination}`
    : (booking.destination || booking.title || 'India Journey');

  const summaryText = `✈️ *ROAVIO TRAVEL CONFIRMATION*\n\nHello *${booking.leadPassenger || 'Traveler'}*,\nYour Roavio *${categoryName}* booking has been confirmed!\n\n📋 *Booking ID:* ${booking.bookingId}\n🔖 *PNR / Ref:* ${booking.providerReference}\n📍 *Journey / Attraction:* ${route}\n📅 *Travel Date:* ${booking.travelDate} (${booking.travelTime || '10:00 AM'})\n💺 *Seat / Class:* ${booking.seatClass || 'Standard'}\n💳 *Amount:* ₹${Number(booking.amount || 0).toLocaleString('en-IN')} (Verified)\n\n🎫 *View Confirmed Mobile Ticket:*\n${ticketUrl}\n\n📄 *Download PDF Ticket Document:*\n${pdfUrl}\n\nThank you for choosing Roavio – Discover India.`;

  // 1. Check for missing/placeholder credentials
  if (!accessToken || accessToken.trim() === '' || accessToken.includes('your_') || !phoneNumberId || phoneNumberId.includes('your_')) {
    return {
      success: false,
      channel: 'WhatsApp',
      provider: 'WhatsApp Business Cloud API (Meta)',
      recipientMobile: formattedMobile || rawMobile,
      messageSummary: summaryText,
      messageId: null,
      providerStatus: 'Awaiting Gateway Configuration (WHATSAPP_ACCESS_TOKEN not configured in .env)',
      providerResponse: 'CLOUD_API_TOKEN_UNSET: Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env',
      timestamp: new Date().toISOString()
    };
  }

  // 2. Validate Indian recipient phone number
  if (!/^91[6-9]\d{9}$/.test(formattedMobile)) {
    return {
      success: false,
      channel: 'WhatsApp',
      provider: 'WhatsApp Business Cloud API',
      recipientMobile: formattedMobile || rawMobile,
      messageSummary: summaryText,
      messageId: null,
      providerStatus: 'Invalid Recipient Number',
      providerResponse: `Phone number '${rawMobile}' does not match valid Indian format (+91 10-digit number starting with 6-9).`,
      timestamp: new Date().toISOString()
    };
  }

  // 3. Build Cloud API message payload
  let payloadObj;
  
  if (templateName && templateName.trim() !== '') {
    // Approved Meta Template Payload
    payloadObj = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedMobile,
      type: 'template',
      template: {
        name: templateName.trim(),
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: booking.leadPassenger || 'Traveler' },
              { type: 'text', text: booking.bookingId },
              { type: 'text', text: route },
              { type: 'text', text: booking.travelDate }
            ]
          }
        ]
      }
    };
  } else {
    // Document PDF Message with Caption (Official e-ticket delivery)
    payloadObj = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedMobile,
      type: 'document',
      document: {
        link: pdfUrl,
        filename: `Roavio-Ticket-${booking.bookingId}.pdf`,
        caption: `✈️ Roavio Confirmed ${categoryName} Ticket (${booking.bookingId}) for ${booking.leadPassenger}. Journey: ${route} on ${booking.travelDate}. View live: ${ticketUrl}`
      }
    };
  }

  const payload = JSON.stringify(payloadObj);

  return new Promise((resolve) => {
    const options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: `/v18.0/${phoneNumberId}/messages`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let isSuccess = false;
        let messageId = null;
        let providerStatus = `HTTP_${res.statusCode}`;
        let providerResponse = body;

        try {
          const parsed = JSON.parse(body);
          if (parsed.messages && parsed.messages[0] && parsed.messages[0].id) {
            isSuccess = true;
            messageId = parsed.messages[0].id;
            providerStatus = 'Accepted / Sent';
            providerResponse = `MSG_ID: ${messageId} (Recipient: +${formattedMobile})`;
          } else if (parsed.error) {
            isSuccess = false;
            const errCode = parsed.error.code;
            const errSubcode = parsed.error.error_subcode;
            const errMsg = parsed.error.message || 'WhatsApp Cloud API Error';
            
            // Diagnostic status mapping
            if (errCode === 190) {
              providerStatus = 'Failed: Access Token Expired or Invalid';
            } else if (errCode === 131030) {
              providerStatus = 'Failed: Recipient Number Not Registered on WhatsApp';
            } else if (errCode === 131047) {
              providerStatus = 'Failed: 24h Customer Window Expired (Requires Approved Template)';
            } else if (errCode === 100) {
              providerStatus = 'Failed: Invalid Phone Number ID or Parameters';
            } else {
              providerStatus = `Rejected by Meta: ${errMsg} (Code ${errCode}${errSubcode ? '.' + errSubcode : ''})`;
            }
            providerResponse = JSON.stringify(parsed.error);
          }
        } catch (e) {
          isSuccess = res.statusCode === 200 || res.statusCode === 201;
          providerStatus = isSuccess ? 'Accepted' : `HTTP Error ${res.statusCode}`;
        }

        resolve({
          success: isSuccess,
          channel: 'WhatsApp',
          provider: 'WhatsApp Business Cloud API',
          recipientMobile: formattedMobile,
          messageId,
          messageSummary: summaryText,
          providerStatus,
          providerResponse,
          timestamp: new Date().toISOString()
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        success: false,
        channel: 'WhatsApp',
        provider: 'WhatsApp Business Cloud API',
        recipientMobile: formattedMobile,
        messageId: null,
        messageSummary: summaryText,
        providerStatus: `Network Error: ${err.message}`,
        providerResponse: err.stack || err.message,
        timestamp: new Date().toISOString()
      });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Send direct test message to a verified WhatsApp mobile number
 */
export async function testWhatsAppDelivery(targetMobile, baseUrl = 'http://localhost:5173') {
  const dummyBooking = {
    bookingId: 'BK-TEST-WHATSAPP',
    category: 'flight',
    title: 'IndiGo 6E-204 (Delhi ➔ Goa) [TEST NOTIFICATION]',
    providerName: 'IndiGo Airlines',
    providerReference: 'ROA-TEST-WA-001',
    sourceLocation: 'New Delhi (DEL)',
    destination: 'Goa (GOI)',
    travelDate: new Date().toISOString().split('T')[0],
    travelTime: '11:00 AM',
    passengers: 1,
    leadPassenger: 'Roavio Tester',
    mobileNumber: targetMobile,
    seatClass: 'Economy 12A',
    amount: 4500,
    paymentStatus: 'Verified',
    bookingStatus: 'Confirmed',
    ticketSecureToken: 'tk_test_wa_token_verified'
  };

  const ticketUrl = `${baseUrl}/verify-ticket?token=${dummyBooking.ticketSecureToken}`;
  const pdfUrl = `${baseUrl}/api/tickets/${dummyBooking.bookingId}/pdf`;

  return await sendWhatsAppNotification(dummyBooking, ticketUrl, pdfUrl);
}

/**
 * Handle Meta Cloud API Webhook Status Updates (sent, delivered, read, failed)
 */
export function handleWebhookStatusUpdate(payload) {
  if (!payload || !payload.entry) return { processed: 0 };
  let processed = 0;

  for (const entry of payload.entry) {
    if (!entry.changes) continue;
    for (const change of entry.changes) {
      if (change.value && change.value.statuses) {
        for (const statusObj of change.value.statuses) {
          const messageId = statusObj.id;
          const status = statusObj.status; // 'sent', 'delivered', 'read', 'failed'
          const recipientId = statusObj.recipient_id;

          // Find and update matching log in database
          const existingLog = dbStore.notificationLogs.find(l => l.messageId === messageId || (l.providerResponse && l.providerResponse.includes(messageId)));
          if (existingLog) {
            existingLog.providerStatus = `Cloud API: ${status.toUpperCase()}`;
            if (statusObj.errors) {
              existingLog.providerResponse = JSON.stringify(statusObj.errors);
            }
            existingLog.updatedAt = new Date().toISOString();
            processed++;
          }
        }
      }
    }
  }

  if (processed > 0) {
    dbStore.save();
  }

  return { processed };
}
