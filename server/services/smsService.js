/**
 * ROAVIO - SMS Gateway Integration Service
 * Supports Fast2SMS (OTP & Transactional Quick routes) and MSG91 Gateway APIs.
 * Handles verified Indian mobile number formatting, error reporting, and secure dispatch.
 */
import https from 'https';

/**
 * Format SMS message text following approved transactional template
 */
export function formatSmsMessage(booking, ticketUrl) {
  const categoryName = (booking.category || 'Travel').charAt(0).toUpperCase() + (booking.category || 'Travel').slice(1);
  const route = booking.sourceLocation && booking.destination 
    ? `${booking.sourceLocation} to ${booking.destination}`
    : (booking.destination || booking.title || 'India Travel');

  return `Hello ${booking.leadPassenger || 'Traveler'}, your Roavio ${categoryName} booking is confirmed. Booking ID: ${booking.bookingId}. Journey: ${route}. Date: ${booking.travelDate}. View your ticket: ${ticketUrl}`;
}

/**
 * Send 6-digit Verification OTP via SMS Gateway (Fast2SMS or MSG91)
 */
export async function sendOtpSms(mobileNumber, otpCode) {
  const apiKey = process.env.SMS_API_KEY;
  const provider = (process.env.SMS_PROVIDER || 'fast2sms').toLowerCase();
  const templateId = process.env.SMS_TEMPLATE_ID;
  const cleanMobile = String(mobileNumber || '').replace(/\D/g, '').slice(-10);

  // Validate 10-digit Indian mobile number
  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    return {
      success: false,
      channel: 'SMS',
      provider: provider === 'msg91' ? 'MSG91' : 'Fast2SMS',
      recipientMobile: cleanMobile,
      providerStatus: 'Invalid Mobile Number',
      providerResponse: `Mobile number '${mobileNumber}' is not a valid 10-digit Indian number starting with 6, 7, 8 or 9.`,
      timestamp: new Date().toISOString()
    };
  }

  // Check if API key is configured
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_')) {
    return {
      success: false,
      channel: 'SMS',
      provider: provider === 'msg91' ? 'MSG91 OTP Service' : 'Fast2SMS OTP Service',
      recipientMobile: cleanMobile,
      providerStatus: 'Awaiting Gateway Configuration (SMS_API_KEY not configured in .env)',
      providerResponse: 'SMS_API_KEY_UNSET: Configure SMS_API_KEY in .env to deliver real OTP SMS messages.',
      timestamp: new Date().toISOString()
    };
  }

  // --- 1. MSG91 Integration ---
  if (provider === 'msg91') {
    return new Promise((resolve) => {
      const postData = JSON.stringify({
        mobile: `91${cleanMobile}`,
        otp: otpCode,
        template_id: templateId || undefined
      });

      const queryPath = templateId 
        ? `/api/v5/otp?template_id=${templateId}&mobile=91${cleanMobile}&authkey=${apiKey}&otp=${otpCode}`
        : `/api/v5/otp?mobile=91${cleanMobile}&authkey=${apiKey}&otp=${otpCode}`;

      const options = {
        hostname: 'control.msg91.com',
        port: 443,
        path: queryPath,
        method: 'POST',
        headers: {
          'authkey': apiKey,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 8000
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          let isSuccess = false;
          let statusText = `HTTP_${res.statusCode}`;
          let reqId = null;
          try {
            const parsed = JSON.parse(body);
            reqId = parsed.request_id || null;
            isSuccess = parsed.type === 'success' || res.statusCode === 200;
            if (!templateId && isSuccess) {
              // MSG91 accepts API call but halts downstream carrier delivery under DLT Code 211
              statusText = 'Accepted by MSG91 but Paused by Carrier (Code 211: DLT Template ID Missing)';
            } else {
              statusText = parsed.message || (isSuccess ? 'Dispatched via MSG91' : `Failed: ${body}`);
            }
          } catch (e) {
            isSuccess = res.statusCode === 200;
          }

          // Also check balance to provide accurate feedback
          https.get(`https://control.msg91.com/api/balance.php?type=4&authkey=${apiKey}`, (bRes) => {
            let bal = '';
            bRes.on('data', c => bal += c);
            bRes.on('end', () => {
              const cleanBal = bal.trim();
              const isZeroBal = cleanBal === '0';

              let finalStatus = isSuccess ? 'Dispatched' : `Gateway Rejected: ${statusText}`;
              if (isZeroBal) {
                finalStatus = 'MSG91 Wallet Balance is 0 Credits (Recharge Required)';
              } else if (!templateId && isSuccess) {
                finalStatus = 'Paused (DLT Code 211: Template ID Missing in .env)';
              }

              resolve({
                success: isSuccess && !isZeroBal,
                channel: 'SMS',
                provider: 'MSG91',
                recipientMobile: cleanMobile,
                requestId: reqId,
                balance: cleanBal,
                providerStatus: finalStatus,
                providerResponse: isZeroBal 
                  ? `MSG91 accepted API call (ID ${reqId}), but your MSG91 wallet balance is 0 credits. Indian carriers will not deliver the SMS without credits in your account.`
                  : body,
                timestamp: new Date().toISOString()
              });
            });
          }).on('error', () => {
            resolve({
              success: isSuccess,
              channel: 'SMS',
              provider: 'MSG91',
              recipientMobile: cleanMobile,
              requestId: reqId,
              providerStatus: isSuccess ? 'Dispatched' : `Gateway Rejected: ${statusText}`,
              providerResponse: body,
              timestamp: new Date().toISOString()
            });
          });
        });
      });

      req.on('error', (err) => {
        resolve({
          success: false,
          channel: 'SMS',
          provider: 'MSG91',
          recipientMobile: cleanMobile,
          providerStatus: `Network Error: ${err.message}`,
          providerResponse: err.message,
          timestamp: new Date().toISOString()
        });
      });

      req.write(postData);
      req.end();
    });
  }

  // --- 2. Fast2SMS Integration (Default) ---
  return new Promise((resolve) => {
    // Fast2SMS Quick OTP Payload
    const postData = JSON.stringify({
      route: 'otp',
      variables_values: otpCode,
      numbers: cleanMobile
    });

    const options = {
      hostname: 'www.fast2sms.com',
      port: 443,
      path: '/dev/bulkV2',
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let isSuccess = false;
        let statusText = `HTTP_${res.statusCode}`;
        try {
          const parsed = JSON.parse(body);
          isSuccess = parsed.return === true || res.statusCode === 200;
          statusText = parsed.message ? (Array.isArray(parsed.message) ? parsed.message.join('; ') : parsed.message) : statusText;
        } catch (e) {
          isSuccess = res.statusCode === 200;
        }

        resolve({
          success: isSuccess,
          channel: 'SMS',
          provider: 'Fast2SMS',
          recipientMobile: cleanMobile,
          providerStatus: isSuccess ? 'Delivered' : `Gateway Rejected: ${statusText}`,
          providerResponse: body,
          timestamp: new Date().toISOString()
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        success: false,
        channel: 'SMS',
        provider: 'Fast2SMS',
        recipientMobile: cleanMobile,
        providerStatus: `Network Error: ${err.message}`,
        providerResponse: err.message,
        timestamp: new Date().toISOString()
      });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Dispatch Transactional Booking Confirmation SMS via Fast2SMS / MSG91 Gateway
 */
export async function sendSmsNotification(booking, ticketUrl) {
  const apiKey = process.env.SMS_API_KEY;
  const provider = (process.env.SMS_PROVIDER || 'fast2sms').toLowerCase();
  const senderId = process.env.SMS_SENDER_ID || 'ROAVIO';
  const rawMobile = booking.mobileNumber || booking.phone || '';
  const cleanMobile = String(rawMobile).replace(/\D/g, '').slice(-10);
  const messageText = formatSmsMessage(booking, ticketUrl);

  // If no credentials supplied, clearly label as awaiting configuration per specification
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_')) {
    return {
      success: false,
      channel: 'SMS',
      provider: 'Fast2SMS / MSG91 Integration',
      recipientMobile: cleanMobile || rawMobile,
      messageSummary: messageText,
      providerStatus: 'Awaiting Gateway Configuration (SMS_API_KEY not configured in .env)',
      providerResponse: 'GATEWAY_CREDENTIALS_UNSET: Set SMS_API_KEY in .env for live SMS delivery.',
      timestamp: new Date().toISOString()
    };
  }

  // Validate Indian mobile format
  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    return {
      success: false,
      channel: 'SMS',
      provider: 'SMS Gateway',
      recipientMobile: cleanMobile || rawMobile,
      messageSummary: messageText,
      providerStatus: 'Invalid Mobile Number',
      providerResponse: `Recipient number '${rawMobile}' is not a valid 10-digit Indian mobile number.`,
      timestamp: new Date().toISOString()
    };
  }

  // MSG91 Flow Integration
  if (provider === 'msg91') {
    return new Promise((resolve) => {
      const templateId = process.env.SMS_TEMPLATE_ID;
      const journeyRoute = booking.sourceLocation && booking.destination 
        ? `${booking.sourceLocation} to ${booking.destination}`
        : (booking.destination || booking.title || 'India Travel');

      const postData = JSON.stringify({
        template_id: templateId || 'roavio_booking_confirmed',
        short_url: "0",
        recipients: [
          {
            mobiles: `91${cleanMobile}`,
            name: booking.leadPassenger || 'Traveler',
            booking_id: booking.bookingId,
            route: journeyRoute,
            date: booking.travelDate,
            url: ticketUrl
          }
        ]
      });

      const options = {
        hostname: 'control.msg91.com',
        port: 443,
        path: '/api/v5/flow/',
        method: 'POST',
        headers: {
          'authkey': apiKey,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 8000
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          let isSuccess = false;
          let statusText = `HTTP_${res.statusCode}`;
          try {
            const parsed = JSON.parse(body);
            isSuccess = parsed.type === 'success' || res.statusCode === 200;
            statusText = parsed.message || (isSuccess ? 'Delivered' : `Failed: ${body}`);
          } catch (e) {
            isSuccess = res.statusCode === 200;
          }

          resolve({
            success: isSuccess,
            channel: 'SMS',
            provider: 'MSG91 Flow',
            recipientMobile: cleanMobile,
            messageSummary: messageText,
            providerStatus: isSuccess ? 'Delivered' : `Gateway Status: ${statusText}`,
            providerResponse: body,
            timestamp: new Date().toISOString()
          });
        });
      });

      req.on('error', (err) => {
        resolve({
          success: false,
          channel: 'SMS',
          provider: 'MSG91',
          recipientMobile: cleanMobile,
          messageSummary: messageText,
          providerStatus: `Network Error: ${err.message}`,
          providerResponse: err.message,
          timestamp: new Date().toISOString()
        });
      });

      req.write(postData);
      req.end();
    });
  }

  // Fast2SMS Transactional / Quick route
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      route: 'q',
      message: messageText,
      language: 'english',
      flash: 0,
      numbers: cleanMobile
    });

    const options = {
      hostname: 'www.fast2sms.com',
      port: 443,
      path: '/dev/bulkV2',
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let isDelivered = false;
        let responseCode = `HTTP_${res.statusCode}`;
        try {
          const parsed = JSON.parse(body);
          isDelivered = parsed.return === true || res.statusCode === 200;
          responseCode = parsed.message ? (Array.isArray(parsed.message) ? parsed.message.join('; ') : parsed.message) : responseCode;
        } catch (e) {
          isDelivered = res.statusCode === 200;
        }

        resolve({
          success: isDelivered,
          channel: 'SMS',
          provider: 'Fast2SMS',
          recipientMobile: cleanMobile,
          messageSummary: messageText,
          providerStatus: isDelivered ? 'Delivered' : `Gateway Rejected (HTTP ${res.statusCode}): ${responseCode}`,
          providerResponse: body,
          timestamp: new Date().toISOString()
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        success: false,
        channel: 'SMS',
        provider: 'Fast2SMS',
        recipientMobile: cleanMobile,
        messageSummary: messageText,
        providerStatus: `Network Error: ${err.message}`,
        providerResponse: err.message,
        timestamp: new Date().toISOString()
      });
    });

    req.write(postData);
    req.end();
  });
}
