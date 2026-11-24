/**
 * ROAVIO - Google Apps Script Email Automation Service
 * Official integration with Google Apps Script Web App for automated transactional emails:
 * 1. User Registration (Welcome Email)
 * 2. Email Verification (OTP Code)
 * 3. Booking Confirmation (Boarding Pass & Itinerary)
 * 4. Payment Confirmation (Transaction Receipt & Taxes)
 * 5. Password Reset (Secure Reset Instructions)
 * 6. Admin Notifications (Real-time alerts on registration & booking)
 */
import https from 'https';
import { URL } from 'url';
import { dbStore } from '../config/db.js';

const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsIwLWcwf6tAeRsscM4yrNR_M9jb3XegnKTkY8Cl4xJLx5IsSMyDQhtVFDi61rypQK/exec';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@roavio.com';

// Cooldown tracking for deduplication: key = "recipient:type:refId" -> timestamp
const emailDeduplicationCache = new Map();
const DEDUPLICATION_COOLDOWN_MS = 60 * 1000; // 60 seconds

/**
 * Validate standard email syntax
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Disallow placeholders or malformed strings
  if (trimmed.length > 254 || trimmed.includes('@example.com') || trimmed.includes('@roavio.user')) {
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Execute HTTP POST to Google Apps Script following 302 redirects
 */
export async function executeAppsScriptPost(url, payload) {
  return new Promise((resolve) => {
    try {
      const targetUrl = new URL(url);
      const postData = JSON.stringify(payload);

      const options = {
        hostname: targetUrl.hostname,
        path: targetUrl.pathname + targetUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 15000
      };

      const req = https.request(options, (res) => {
        // Google Apps Script always issues 302 redirect on Web App execution
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectReq = https.get(res.headers.location, (redirRes) => {
            let body = '';
            redirRes.on('data', chunk => body += chunk);
            redirRes.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                resolve({
                  success: parsed.success === true,
                  statusCode: redirRes.statusCode,
                  data: parsed,
                  raw: body
                });
              } catch (e) {
                resolve({
                  success: redirRes.statusCode === 200,
                  statusCode: redirRes.statusCode,
                  raw: body
                });
              }
            });
          });

          redirectReq.on('error', (err) => {
            resolve({ success: false, error: 'Apps Script redirect error: ' + err.message });
          });
          return;
        }

        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve({
              success: parsed.success === true,
              statusCode: res.statusCode,
              data: parsed,
              raw: body
            });
          } catch (e) {
            resolve({
              success: res.statusCode === 200,
              statusCode: res.statusCode,
              raw: body
            });
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, error: 'Google Apps Script request timed out after 15s' });
      });

      req.on('error', (err) => {
        resolve({ success: false, error: 'Network error connecting to Google Apps Script: ' + err.message });
      });

      req.write(postData);
      req.end();
    } catch (err) {
      resolve({ success: false, error: 'Execution error: ' + err.message });
    }
  });
}

/**
 * Core Reusable Email Dispatch Function
 */
export async function sendEmailViaAppsScript({
  type,
  to,
  recipientName = 'Traveler',
  subject,
  htmlBody,
  textBody = '',
  referenceId = '',
  bypassCooldown = false
}) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
  const scriptKey = process.env.GOOGLE_APPS_SCRIPT_KEY || '';
  const cleanEmail = String(to || '').trim().toLowerCase();

  // 1. Validate Email
  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return {
      success: false,
      channel: 'Google Email',
      recipientEmail: cleanEmail,
      error: 'Invalid recipient email address syntax.',
      timestamp: new Date().toISOString()
    };
  }

  // 2. Deduplication check
  const dedupKey = `${cleanEmail}:${type}:${referenceId || 'default'}`;
  const lastSentTime = emailDeduplicationCache.get(dedupKey);
  const now = Date.now();

  if (!bypassCooldown && lastSentTime && (now - lastSentTime) < DEDUPLICATION_COOLDOWN_MS) {
    const remainingSecs = Math.ceil((DEDUPLICATION_COOLDOWN_MS - (now - lastSentTime)) / 1000);
    return {
      success: false,
      isDuplicateBlocked: true,
      channel: 'Google Email',
      recipientEmail: cleanEmail,
      error: `Duplicate email prevented. Cooldown active for another ${remainingSecs}s.`,
      timestamp: new Date().toISOString()
    };
  }

  // 3. Prepare payload matching Google Apps Script requirements
  const payload = {
    action: 'sendEmail',
    type: type || 'general',
    to: cleanEmail,
    recipientName: recipientName,
    subject: subject,
    htmlBody: htmlBody,
    textBody: textBody || htmlBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    apiKey: scriptKey,
    key: scriptKey,
    token: scriptKey,
    referenceId: referenceId,
    timestamp: new Date().toISOString()
  };

  // 4. Send request to Apps Script Web App
  const result = await executeAppsScriptPost(scriptUrl, payload);
  emailDeduplicationCache.set(dedupKey, now);

  const isSuccess = result.success;
  const messageSummary = `${type.toUpperCase()} email sent to ${cleanEmail} (${subject})`;
  const providerStatus = isSuccess 
    ? 'Delivered (Google Apps Script Web App)' 
    : (result.data?.message || result.error || 'Google Apps Script Dispatched');

  // 5. Audit Logging to dbStore
  const logEntry = {
    logId: `NOTIF-${Date.now().toString().slice(-6)}`,
    bookingId: referenceId || type,
    recipientMobile: cleanEmail,
    channel: 'Google Email',
    templateUsed: `roavio_${type}_template_v1`,
    messageSummary,
    providerStatus,
    providerResponse: result.raw || JSON.stringify(result.data || {}),
    retryCount: 0,
    timestamp: new Date().toISOString()
  };

  if (dbStore && dbStore.notificationLogs) {
    dbStore.notificationLogs.unshift(logEntry);
    dbStore.save();
  }

  return {
    success: isSuccess,
    channel: 'Google Email',
    recipientEmail: cleanEmail,
    type,
    providerStatus,
    response: result.data || result.raw,
    timestamp: new Date().toISOString()
  };
}

// =============================================================================
// HTML EMAIL TEMPLATE BUILDERS
// =============================================================================

function getBaseEmailWrapper(headerTitle, headerSubtitle, contentHtml) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px 12px; color: #1E293B; line-height: 1.6; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); border: 1.5px solid #E2E8F0; }
    .email-header { background: linear-gradient(135deg, #091E3A 0%, #102A45 100%); color: #FFFFFF; padding: 32px 28px; text-align: left; position: relative; }
    .brand-logo-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .brand-name { font-size: 26px; font-weight: 900; letter-spacing: 0.5px; color: #FFFFFF; margin: 0; }
    .brand-tag { font-size: 11px; font-weight: 800; color: #10B981; background: rgba(16, 185, 129, 0.18); border: 1px solid #10B981; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase; }
    .header-title { font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0 0 4px; }
    .header-sub { font-size: 13px; color: #94A3B8; margin: 0; }
    .email-body { padding: 32px 28px; }
    .greeting { font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 16px; }
    .lead-text { font-size: 14px; color: #475569; margin-bottom: 24px; line-height: 1.6; }
    .info-card { background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
    .info-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px dashed #E2E8F0; font-size: 13.5px; }
    .info-row:last-child { border-bottom: none; }
    .info-lbl { color: #64748B; font-weight: 600; }
    .info-val { color: #0F172A; font-weight: 700; text-align: right; }
    .btn-cta { display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #FFFFFF !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 800; font-size: 14px; text-align: center; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35); }
    .badge-pill { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; }
    .badge-success { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
    .badge-info { background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
    .email-footer { background: #F8FAFC; border-top: 1.5px solid #F1F5F9; padding: 24px 28px; font-size: 12px; color: #94A3B8; text-align: center; }
    .footer-links { margin-top: 8px; }
    .footer-links a { color: #059669; text-decoration: none; margin: 0 6px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <div class="brand-logo-row">
        <h1 class="brand-name">✈️ ROAVIO</h1>
        <span class="brand-tag">Discover India</span>
      </div>
      <h2 class="header-title">${headerTitle}</h2>
      <p class="header-sub">${headerSubtitle}</p>
    </div>
    <div class="email-body">
      ${contentHtml}
    </div>
    <div class="email-footer">
      <strong>Roavio Travel Technologies Pvt Ltd</strong> · Discover India. Plan Your Journey. Travel Freely.<br>
      24x7 Traveler Helpline: support@roavio.com · +91 98765 43210<br>
      <div class="footer-links">
        <a href="http://localhost:5173/explore-india">Explore Destinations</a> · 
        <a href="http://localhost:5173/my-trips">My Trips Portal</a> · 
        <a href="http://localhost:5173/plan">Itinerary Planner</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// =============================================================================
// 1. USER REGISTRATION - WELCOME EMAIL
// =============================================================================
export async function sendWelcomeEmail(user) {
  const recipientName = user.name || user.fullName || 'Explorer';
  const subject = `🌟 Welcome to Roavio, ${recipientName}! Your India Journey Begins`;

  const content = `
    <div class="greeting">Namaste ${recipientName},</div>
    <p class="lead-text">
      Welcome to <strong>Roavio</strong> — India's premier travel discovery and intelligent journey booking platform. 
      Your account has been successfully created and verified.
    </p>

    <div class="info-card">
      <div style="font-size: 13px; font-weight: 800; color: #059669; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">Your Account Profile</div>
      <div class="info-row"><span class="info-lbl">Member Name:</span><span class="info-val">${recipientName}</span></div>
      <div class="info-row"><span class="info-lbl">Registered Email:</span><span class="info-val">${user.email}</span></div>
      <div class="info-row"><span class="info-lbl">Verified Mobile:</span><span class="info-val">${user.phone || user.mobileNumber || 'Verified via OTP'}</span></div>
      <div class="info-row"><span class="info-lbl">Membership Tier:</span><span class="info-val" style="color: #059669;">Explorer Club (Active)</span></div>
    </div>

    <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <strong style="color: #166534; font-size: 14px; display: block; margin-bottom: 6px;">✨ What you can do right now:</strong>
      <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px;">
        <li>Explore over <strong>175+ curated Indian tourist destinations</strong> across all 28 states.</li>
        <li>Architect multi-destination custom itineraries with hotels and transit.</li>
        <li>Book instant verified tickets with IRCTC rail, luxury buses, and airlines.</li>
        <li>Access cryptographically verified digital passes on your phone anytime.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 28px 0 12px;">
      <a href="http://localhost:5173/explore-india" class="btn-cta">Start Exploring Destinations ➔</a>
    </div>
  `;

  const htmlBody = getBaseEmailWrapper(
    'Welcome to Roavio Travel',
    'Official Account Confirmation & Membership Access',
    content
  );

  return sendEmailViaAppsScript({
    type: 'welcome',
    to: user.email,
    recipientName,
    subject,
    htmlBody,
    referenceId: user.id || user.email
  });
}

// =============================================================================
// 2. EMAIL VERIFICATION - OTP CODE
// =============================================================================
export async function sendOtpVerificationEmail(email, otpCode, recipientName = 'Traveler') {
  const subject = `🔐 Your Roavio Verification Code: ${otpCode}`;

  const content = `
    <div class="greeting">Hello ${recipientName},</div>
    <p class="lead-text">
      Please use the following 6-digit one-time password (OTP) to securely verify your email address and authorize your Roavio account action.
    </p>

    <div style="background: #F1F5F9; border: 2px dashed #CBD5E1; border-radius: 14px; padding: 24px; text-align: center; margin: 24px 0;">
      <span style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">One-Time Verification Code</span>
      <div style="font-size: 38px; font-weight: 900; color: #059669; letter-spacing: 8px; margin: 8px 0; font-family: monospace;">
        ${otpCode}
      </div>
      <span style="font-size: 12px; color: #94A3B8;">⏰ Code expires in <strong>5 minutes</strong>. Do not share this with anyone.</span>
    </div>

    <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 14px; font-size: 12.5px; color: #1E40AF;">
      🛡️ <strong>Security Tip:</strong> Roavio staff will never ask for your verification code or password over phone, email or messaging apps.
    </div>
  `;

  const htmlBody = getBaseEmailWrapper(
    'Account Verification',
    'Secure One-Time Passcode Authorization',
    content
  );

  return sendEmailViaAppsScript({
    type: 'otp',
    to: email,
    recipientName,
    subject,
    htmlBody,
    referenceId: otpCode,
    bypassCooldown: true // OTPs can be resent on user demand
  });
}

// =============================================================================
// 3. BOOKING CONFIRMATION - TICKET & ITINERARY DETAILS
// =============================================================================
export async function sendBookingConfirmationEmail(booking, baseUrl = 'http://localhost:5173') {
  const recipientName = booking.leadPassenger || 'Valued Traveler';
  const bookingId = booking.bookingId || 'BK-CONFIRMED';
  const pnr = booking.providerReference || 'ROA-PASS';
  const route = booking.sourceLocation && booking.destination 
    ? `${booking.sourceLocation} ➔ ${booking.destination}`
    : (booking.destination || booking.title || 'India Journey');

  const subject = `✈️ Booking Confirmed: ${booking.title} (PNR: ${pnr})`;
  const ticketUrl = `${baseUrl}/verify-ticket?token=${booking.ticketSecureToken || pnr}`;
  const myTripsUrl = `${baseUrl}/my-trips`;

  const content = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <span class="badge-pill badge-success">✓ Confirmed & Payment Verified</span>
      <span style="font-size: 12px; color: #64748B; font-weight: 700;">PNR: <strong style="color: #059669;">${pnr}</strong></span>
    </div>

    <div class="greeting">Dear ${recipientName},</div>
    <p class="lead-text">
      Your travel booking has been confirmed with our certified travel operator partner. Official digital e-tickets and reservation passes have been generated.
    </p>

    <div class="info-card">
      <div style="font-size: 13px; font-weight: 800; color: #059669; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">Reservation & Transit Summary</div>
      <div class="info-row"><span class="info-lbl">Booking Reference ID:</span><span class="info-val font-mono">${bookingId}</span></div>
      <div class="info-row"><span class="info-lbl">Official Provider PNR:</span><span class="info-val" style="color: #059669; font-family: monospace;">${pnr}</span></div>
      <div class="info-row"><span class="info-lbl">Journey Title:</span><span class="info-val">${booking.title}</span></div>
      <div class="info-row"><span class="info-lbl">Route Corridor:</span><span class="info-val">${route}</span></div>
      <div class="info-row"><span class="info-lbl">Travel Date & Time:</span><span class="info-val">${booking.travelDate} (${booking.travelTime || 'Scheduled'})</span></div>
      <div class="info-row"><span class="info-lbl">Passenger Group:</span><span class="info-val">${booking.passengers || 1} Person(s) · ${booking.leadPassenger}</span></div>
      <div class="info-row"><span class="info-lbl">Class / Accommodation:</span><span class="info-val">${booking.seatClass || 'Confirmed Standard'}</span></div>
      <div class="info-row"><span class="info-lbl">Operator Partner:</span><span class="info-val">${booking.providerName || 'Roavio Certified Partner'}</span></div>
      <div class="info-row"><span class="info-lbl">Total Fare Paid:</span><span class="info-val" style="color: #059669;">₹${Number(booking.amount || 0).toLocaleString('en-IN')} (Verified)</span></div>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${ticketUrl}" class="btn-cta" style="margin-right: 12px;">View Digital Boarding Pass ➔</a>
      <a href="${myTripsUrl}" style="display: inline-block; padding: 12px 20px; font-size: 13px; font-weight: 700; color: #475569; text-decoration: none;">View in My Trips Dashboard ↗</a>
    </div>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; font-size: 12px; color: #64748B;">
      📱 <strong>Boarding Instructions:</strong> Please arrive 45 minutes prior to scheduled departure. Present your digital boarding pass QR code or carry an official government photo ID (Aadhaar / Voter ID / Passport).
    </div>
  `;

  const htmlBody = getBaseEmailWrapper(
    'Confirmed Travel E-Ticket',
    `Official Reservation Voucher · ${bookingId}`,
    content
  );

  return sendEmailViaAppsScript({
    type: 'booking',
    to: booking.email,
    recipientName,
    subject,
    htmlBody,
    referenceId: bookingId
  });
}

// =============================================================================
// 4. PAYMENT CONFIRMATION - TRANSACTION & TAX RECEIPT
// =============================================================================
export async function sendPaymentConfirmationEmail(booking) {
  const recipientName = booking.leadPassenger || 'Valued Traveler';
  const bookingId = booking.bookingId || 'BK-PAYMENT';
  const amountPaid = Number(booking.amount || 0);
  const subject = `💳 Payment Receipt: ₹${amountPaid.toLocaleString('en-IN')} Confirmed for Booking ${bookingId}`;
  const txnId = `TXN-${Date.now().toString().slice(-8)}`;

  const content = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <span class="badge-pill badge-success">✓ Payment Received & Reconciled</span>
      <span style="font-size: 12px; color: #64748B; font-weight: 700;">Status: <strong style="color: #059669;">Success</strong></span>
    </div>

    <div class="greeting">Dear ${recipientName},</div>
    <p class="lead-text">
      Thank you for your payment. Your financial transaction for Roavio Travel Booking <strong>${bookingId}</strong> has been successfully verified through our secure 256-bit banking gateway.
    </p>

    <div class="info-card">
      <div style="font-size: 13px; font-weight: 800; color: #059669; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">Tax Invoice & Transaction Details</div>
      <div class="info-row"><span class="info-lbl">Transaction Reference:</span><span class="info-val font-mono">${txnId}</span></div>
      <div class="info-row"><span class="info-lbl">Booking ID:</span><span class="info-val font-mono">${bookingId}</span></div>
      <div class="info-row"><span class="info-lbl">Payment Mode:</span><span class="info-val">${booking.paymentStatus || 'Online (UPI / Card)'}</span></div>
      <div class="info-row"><span class="info-lbl">Transaction Timestamp:</span><span class="info-val">${new Date().toLocaleString('en-IN')}</span></div>
      <div class="info-row"><span class="info-lbl">Base Package Fare:</span><span class="info-val">₹${Math.round(amountPaid / 1.05).toLocaleString('en-IN')}</span></div>
      <div class="info-row"><span class="info-lbl">GST & Tourism Tax (5%):</span><span class="info-val">₹${Math.round(amountPaid - (amountPaid / 1.05)).toLocaleString('en-IN')}</span></div>
      <div class="info-row"><span class="info-lbl">Convenience & Booking Fee:</span><span class="info-val" style="color: #059669;">₹0 (Promo Waived)</span></div>
      <div class="info-row" style="padding-top: 12px; border-top: 2px dashed #CBD5E1;"><span class="info-lbl" style="font-size: 15px; color: #0F172A; font-weight: 800;">Total Amount Paid:</span><span class="info-val" style="font-size: 18px; color: #059669; font-weight: 900;">₹${amountPaid.toLocaleString('en-IN')}</span></div>
    </div>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; font-size: 12px; color: #64748B;">
      📄 <strong>GST Note:</strong> This email serves as an official customer payment voucher. An itemized invoice can also be downloaded directly from your <a href="http://localhost:5173/my-trips" style="color: #059669; font-weight: 700;">My Trips Dashboard</a>.
    </div>
  `;

  const htmlBody = getBaseEmailWrapper(
    'Payment Confirmation & Invoice',
    `Official Transaction Receipt · ${txnId}`,
    content
  );

  return sendEmailViaAppsScript({
    type: 'payment',
    to: booking.email,
    recipientName,
    subject,
    htmlBody,
    referenceId: txnId
  });
}

// =============================================================================
// 5. PASSWORD RESET INSTRUCTIONS
// =============================================================================
export async function sendPasswordResetEmail(user, resetToken, baseUrl = 'http://localhost:5173') {
  const recipientName = user.name || user.fullName || 'Traveler';
  const resetUrl = `${baseUrl}/login?resetToken=${resetToken}&email=${encodeURIComponent(user.email)}`;
  const subject = `🔑 Reset Your Roavio Account Password`;

  const content = `
    <div class="greeting">Hello ${recipientName},</div>
    <p class="lead-text">
      We received a request to reset the password for your Roavio Travel account (<strong>${user.email}</strong>). 
      If you made this request, please click the secure button below to set a new password:
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="btn-cta">Reset My Account Password ➔</a>
    </div>

    <div class="info-card">
      <div class="info-row"><span class="info-lbl">Security Token:</span><span class="info-val font-mono">${resetToken.slice(0, 16)}...</span></div>
      <div class="info-row"><span class="info-lbl">Token Expiry:</span><span class="info-val">15 Minutes</span></div>
    </div>

    <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 14px; font-size: 12.5px; color: #92400E;">
      ⚠️ <strong>Didn't request this?</strong> If you did not request a password reset, you can safely disregard this email. Your existing password remains secure.
    </div>
  `;

  const htmlBody = getBaseEmailWrapper(
    'Password Reset Request',
    'Official Security & Account Recovery Instructions',
    content
  );

  return sendEmailViaAppsScript({
    type: 'password_reset',
    to: user.email,
    recipientName,
    subject,
    htmlBody,
    referenceId: resetToken
  });
}

// =============================================================================
// 6. ADMIN REAL-TIME NOTIFICATIONS
// =============================================================================
export async function sendAdminNotification(eventType, details) {
  const adminEmail = process.env.ADMIN_EMAIL || ADMIN_EMAIL;
  const timestamp = new Date().toLocaleString('en-IN');
  const subject = `🔔 [Roavio Admin Alert] ${eventType} - ${timestamp}`;

  let detailsHtml = '';
  if (details.bookingId) {
    detailsHtml = `
      <div class="info-row"><span class="info-lbl">Event:</span><span class="info-val">New Booking Completed</span></div>
      <div class="info-row"><span class="info-lbl">Booking ID:</span><span class="info-val font-mono">${details.bookingId}</span></div>
      <div class="info-row"><span class="info-lbl">Provider PNR:</span><span class="info-val font-mono">${details.providerReference || 'N/A'}</span></div>
      <div class="info-row"><span class="info-lbl">Passenger Name:</span><span class="info-val">${details.leadPassenger}</span></div>
      <div class="info-row"><span class="info-lbl">Passenger Contact:</span><span class="info-val">${details.email} · +91 ${details.mobileNumber}</span></div>
      <div class="info-row"><span class="info-lbl">Route / Title:</span><span class="info-val">${details.title}</span></div>
      <div class="info-row"><span class="info-lbl">Revenue Amount:</span><span class="info-val" style="color: #059669; font-weight: 800;">₹${Number(details.amount || 0).toLocaleString('en-IN')}</span></div>
    `;
  } else {
    detailsHtml = `
      <div class="info-row"><span class="info-lbl">Event:</span><span class="info-val">New User Registration</span></div>
      <div class="info-row"><span class="info-lbl">User ID:</span><span class="info-val font-mono">${details.id}</span></div>
      <div class="info-row"><span class="info-lbl">Full Name:</span><span class="info-val">${details.name || details.fullName}</span></div>
      <div class="info-row"><span class="info-lbl">Email Address:</span><span class="info-val">${details.email}</span></div>
      <div class="info-row"><span class="info-lbl">Verified Mobile:</span><span class="info-val">${details.phone || details.mobileNumber}</span></div>
      <div class="info-row"><span class="info-lbl">Account Status:</span><span class="info-val" style="color: #059669;">Active & Verified</span></div>
    `;
  }

  const content = `
    <div class="greeting">Administrator Alert,</div>
    <p class="lead-text">
      A critical transaction or user event has occurred on the Roavio Travel platform that requires administrative record-keeping:
    </p>

    <div class="info-card">
      <div style="font-size: 13px; font-weight: 800; color: #1D4ED8; text-transform: uppercase; margin-bottom: 12px;">Real-Time System Event Details</div>
      ${detailsHtml}
      <div class="info-row"><span class="info-lbl">Server Timestamp:</span><span class="info-val">${timestamp}</span></div>
    </div>

    <div style="text-align: center; margin: 24px 0 12px;">
      <a href="http://localhost:5173/admin" class="btn-cta">Open Roavio Admin Portal ➔</a>
    </div>
  `;

  const htmlBody = getBaseEmailWrapper(
    'Admin System Notification',
    `Automated Platform Alert · ${eventType}`,
    content
  );

  return sendEmailViaAppsScript({
    type: 'admin_notification',
    to: adminEmail,
    recipientName: 'Administrator',
    subject,
    htmlBody,
    referenceId: details.bookingId || details.id || 'admin'
  });
}
