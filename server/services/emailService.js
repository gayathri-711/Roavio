/**
 * ROAVIO - Resend Email Integration Service
 * Official Resend.com API integration for automatic e-ticket delivery with PDF attachments,
 * booking confirmations, and verification OTP emails.
 */
import https from 'https';
import { generateTicketPdf } from './ticketPdfService.js';
import { dbStore } from '../config/db.js';

/**
 * Send confirmed booking e-ticket via Resend Email with attached PDF
 */
export async function sendTicketEmail(booking, ticketUrl, customPdfBuffer = null) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Roavio Travel <onboarding@resend.dev>';
  let toEmail = (booking.email || '').trim();
  if (!toEmail || toEmail.includes('@example.com') || toEmail.includes('@roavio.user') || !toEmail.includes('@')) {
    toEmail = 'delivered@resend.dev';
  }

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_')) {
    return {
      success: false,
      channel: 'Email',
      provider: 'Resend Email API',
      recipientEmail: toEmail,
      messageId: null,
      providerStatus: 'Awaiting Gateway Configuration (RESEND_API_KEY not configured in .env)',
      providerResponse: 'RESEND_KEY_UNSET',
      timestamp: new Date().toISOString()
    };
  }

  // Generate binary PDF if not provided
  const pdfBuffer = customPdfBuffer || generateTicketPdf(booking);
  const pdfBase64 = pdfBuffer.toString('base64');

  const categoryName = (booking.category || 'Travel').charAt(0).toUpperCase() + (booking.category || 'Travel').slice(1);
  const route = booking.sourceLocation && booking.destination 
    ? `${booking.sourceLocation} ➔ ${booking.destination}`
    : (booking.destination || booking.title || 'India Journey');

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F8FAFC; margin: 0; padding: 20px; color: #1E293B; }
    .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0; }
    .header { background: #142B45; color: white; padding: 28px; text-align: left; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; }
    .header p { margin: 4px 0 0; font-size: 13px; color: #FF9B54; font-weight: 600; text-transform: uppercase; }
    .content { padding: 28px; }
    .seal { background: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; display: inline-block; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 4px; }
    .sub { color: #64748B; font-size: 14px; margin: 0 0 20px; }
    .grid { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EDF2F7; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .label { color: #64748B; font-weight: 600; }
    .val { color: #0F172A; font-weight: 700; }
    .btn { display: inline-block; background: #159B75; color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: center; }
    .attachment-note { background: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin: 20px 0; }
    .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 16px 28px; font-size: 12px; color: #94A3B8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>✈️ ROAVIO</h1>
      <p>Discover India · Official E-Ticket & Boarding Pass</p>
    </div>
    <div class="content">
      <div class="seal">✓ Confirmed & Payment Verified</div>
      <h2 class="title">${booking.title}</h2>
      <p class="sub">Carrier / Operator: <strong>${booking.providerName || 'Certified Operator'}</strong></p>

      <div class="grid">
        <div class="row"><span class="label">Booking ID:</span><span class="val">${booking.bookingId}</span></div>
        <div class="row"><span class="label">Provider PNR:</span><span class="val" style="color: #047857;">${booking.providerReference}</span></div>
        <div class="row"><span class="label">Lead Passenger:</span><span class="val">${booking.leadPassenger}</span></div>
        <div class="row"><span class="label">Journey Route:</span><span class="val">${route}</span></div>
        <div class="row"><span class="label">Travel Date:</span><span class="val">${booking.travelDate} (${booking.travelTime || '10:00 AM'})</span></div>
        <div class="row"><span class="label">Seat / Accommodation:</span><span class="val">${booking.seatClass || 'Standard'}</span></div>
        <div class="row"><span class="label">Amount Paid:</span><span class="val">₹${Number(booking.amount || 0).toLocaleString('en-IN')} (Verified)</span></div>
      </div>

      <div class="attachment-note">
        📎 <strong>Official PDF Attached:</strong> Your authentic electronic ticket <code>roavio-ticket-${booking.bookingId}.pdf</code> is attached to this email. You can present this on your mobile device or print it.
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${ticketUrl}" class="btn">View Live Boarding Pass & QR Verification →</a>
      </div>
    </div>
    <div class="footer">
      Roavio Technologies Private Limited · Discover India. Plan Your Journey. Travel Freely.<br>
      24x7 Traveler Support: support@roavio.com · www.roavio.com
    </div>
  </div>
</body>
</html>`;

  const payload = JSON.stringify({
    from: fromEmail,
    to: [toEmail],
    subject: `✈️ Your Roavio ${categoryName} Confirmed E-Ticket (${booking.bookingId}) - ${route}`,
    html: htmlContent,
    attachments: [
      {
        filename: `roavio-ticket-${booking.bookingId}.pdf`,
        content: pdfBase64
      }
    ]
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
          if (parsed.id) {
            isSuccess = true;
            messageId = parsed.id;
            providerStatus = 'Delivered (Resend API)';
            providerResponse = `MSG_ID: ${messageId}`;
          } else if (parsed.message) {
            providerStatus = `Resend Error: ${parsed.message}`;
          }
        } catch (e) {
          isSuccess = res.statusCode === 200;
        }

        const logEntry = {
          logId: `NOTIF-${Date.now().toString().slice(-6)}`,
          bookingId: booking.bookingId,
          recipientMobile: toEmail,
          channel: 'Email',
          messageId,
          templateUsed: 'roavio_eticket_pdf_attachment_v1',
          messageSummary: `Confirmed ${categoryName} ticket with attached PDF sent to ${toEmail}`,
          providerStatus,
          providerResponse,
          retryCount: 0,
          timestamp: new Date().toISOString()
        };
        dbStore.notificationLogs.unshift(logEntry);
        dbStore.save();

        resolve({
          success: isSuccess,
          channel: 'Email',
          provider: 'Resend Email API',
          recipientEmail: toEmail,
          messageId,
          providerStatus,
          providerResponse,
          timestamp: new Date().toISOString()
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        success: false,
        channel: 'Email',
        provider: 'Resend Email API',
        recipientEmail: toEmail,
        messageId: null,
        providerStatus: `Network Error: ${err.message}`,
        providerResponse: err.message,
        timestamp: new Date().toISOString()
      });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Send 6-digit verification OTP to user's email via Resend
 */
export async function sendOtpEmail(email, otpCode) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Roavio Security <onboarding@resend.dev>';

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_')) {
    return {
      success: false,
      channel: 'Email',
      provider: 'Resend Email API',
      recipientEmail: email,
      providerStatus: 'Awaiting Gateway Configuration (RESEND_API_KEY not configured in .env)',
      providerResponse: 'RESEND_KEY_UNSET',
      timestamp: new Date().toISOString()
    };
  }

  const payload = JSON.stringify({
    from: fromEmail,
    to: [email],
    subject: `🔐 Your Roavio Verification Code: ${otpCode}`,
    html: `<div style="font-family: sans-serif; padding: 24px; background: #F8FAFC; color: #0F172A;">
      <div style="max-width: 500px; margin: 0 auto; background: white; padding: 28px; border-radius: 12px; border: 1px solid #E2E8F0;">
        <h2 style="color: #142B45; margin-top: 0;">Roavio Account Verification</h2>
        <p style="color: #64748B;">Use the following 6-digit one-time password to verify your account:</p>
        <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; text-align: center; background: #F1F5F9; padding: 16px; border-radius: 8px; margin: 20px 0; color: #159B75;">
          ${otpCode}
        </div>
        <p style="font-size: 13px; color: #94A3B8;">This verification code is valid for 5 minutes. If you did not request this, please ignore this email.</p>
      </div>
    </div>`
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
        try {
          const parsed = JSON.parse(body);
          isSuccess = Boolean(parsed.id);
        } catch (e) {
          isSuccess = res.statusCode === 200;
        }

        resolve({
          success: isSuccess,
          channel: 'Email',
          provider: 'Resend',
          recipientEmail: email,
          providerStatus: isSuccess ? 'Delivered' : `Failed: ${body}`,
          providerResponse: body,
          timestamp: new Date().toISOString()
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        success: false,
        channel: 'Email',
        provider: 'Resend',
        recipientEmail: email,
        providerStatus: `Network Error: ${err.message}`,
        providerResponse: err.message,
        timestamp: new Date().toISOString()
      });
    });

    req.write(payload);
    req.end();
  });
}
