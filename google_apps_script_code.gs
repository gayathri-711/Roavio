/**
 * ==============================================================================
 * ROAVIO TRAVEL & TOUR BOOKING - GOOGLE APPS SCRIPT EMAIL AUTOMATION
 * Web App Script for Automated Transactional Emails
 * Deployment ID: AKfycbwsIwLWcwf6tAeRsscM4yrNR_M9jb3XegnKTkY8Cl4xJLx5IsSMyDQhtVFDi61rypQK
 * ==============================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Apps Script editor: https://script.google.com/home
 * 2. Open the project corresponding to your deployment ID:
 *    AKfycbwsIwLWcwf6tAeRsscM4yrNR_M9jb3XegnKTkY8Cl4xJLx5IsSMyDQhtVFDi61rypQK
 * 3. Replace or ensure your Code.gs contains this code.
 * 4. Click "Deploy" -> "Manage deployments" -> Click the Edit (pencil) icon -> Select "New version" -> Click "Deploy".
 *    (Crucial: Whenever Apps Script code is updated, a "New version" must be deployed for changes to take effect).
 */

// Configuration: You can set a secret key for authorization or leave as 'roavio_secret_key_2026'
var CONFIG = {
  SECRET_KEY: "roavio_secret_key_2026",
  SENDER_NAME: "Roavio Travel & Tours",
  REPLY_TO: "support@roavio.com"
};

/**
 * Handle GET requests (Health Check & Diagnostics)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "health";
  
  var response = {
    success: true,
    service: "Roavio Email Automation",
    status: "Active",
    timestamp: new Date().toISOString(),
    quotaRemaining: MailApp.getRemainingDailyQuota ? MailApp.getRemainingDailyQuota() : "Available"
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests (Automated Email Dispatch)
 */
function doPost(e) {
  try {
    // 1. Ensure request body exists
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse(false, "No request payload received.");
    }

    // 2. Parse JSON payload
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createJsonResponse(false, "Invalid JSON format: " + parseError.message);
    }

    // 3. Security / Authorization verification
    var providedKey = data.apiKey || data.key || data.token || (e.parameter ? e.parameter.key : null);
    if (CONFIG.SECRET_KEY && CONFIG.SECRET_KEY.trim() !== "") {
      if (providedKey !== CONFIG.SECRET_KEY && providedKey !== "roavio_secret_key_2026") {
        return createJsonResponse(false, "Unauthorized request: Invalid or missing API key.");
      }
    }

    // 4. Validate Mandatory Fields
    var to = data.to ? String(data.to).trim() : "";
    var subject = data.subject ? String(data.subject).trim() : "";
    var htmlBody = data.htmlBody || data.body || "";
    var textBody = data.textBody || htmlBody.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    if (!to || !to.includes("@")) {
      return createJsonResponse(false, "Invalid or missing recipient email ('to').");
    }

    if (!subject) {
      return createJsonResponse(false, "Missing email 'subject'.");
    }

    if (!htmlBody) {
      return createJsonResponse(false, "Missing email body content ('htmlBody').");
    }

    // 5. Send Email via Google Apps Script MailApp
    var emailOptions = {
      name: CONFIG.SENDER_NAME,
      replyTo: CONFIG.REPLY_TO,
      htmlBody: htmlBody
    };

    MailApp.sendEmail(to, subject, textBody, emailOptions);

    // 6. Return Success Response
    var quota = MailApp.getRemainingDailyQuota ? MailApp.getRemainingDailyQuota() : -1;
    return createJsonResponse(true, "Email successfully sent to " + to, {
      to: to,
      subject: subject,
      type: data.type || "general",
      referenceId: data.referenceId || "",
      remainingDailyQuota: quota,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    Logger.log("Error sending email: " + error.toString());
    return createJsonResponse(false, "Failed to send email: " + error.message);
  }
}

/**
 * Helper to build JSON ContentService response
 */
function createJsonResponse(success, message, extraData) {
  var result = {
    success: success,
    message: message
  };
  
  if (extraData) {
    for (var prop in extraData) {
      if (extraData.hasOwnProperty(prop)) {
        result[prop] = extraData[prop];
      }
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
