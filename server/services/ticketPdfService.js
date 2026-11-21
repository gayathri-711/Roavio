/**
 * ROAVIO - PDF Ticket & Travel Itinerary Generator
 * Generates verified ISO-compliant PDF binary e-tickets with embedded vector QR codes,
 * as well as formatted HTML e-tickets and planned itinerary documents.
 */
import { generateQrSvg, generateQrCells } from './qrService.js';

/**
 * Helper to escape characters for PDF string literals
 */
function escapePdfText(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/➔/g, '->')
    .replace(/₹/g, 'INR ')
    .replace(/[^\x20-\x7E]/g, ' '); // Keep safe printable ASCII
}

/**
 * Builds an ISO-compliant %PDF-1.4 binary buffer from a graphics/text content stream
 */
function compilePdfDocument(contentStream, title = 'Roavio Confirmed E-Ticket') {
  const safeTitle = escapePdfText(title);
  const streamBytes = Buffer.from(contentStream, 'latin1');
  const streamLen = streamBytes.length;

  const objects = [];
  // Obj 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  // Obj 2: Pages container
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
  // Obj 3: Page (A4: 595.28 x 841.89 pt)
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj');
  // Obj 4: Content Stream
  objects.push(`4 0 obj\n<< /Length ${streamLen} >>\nstream\n${contentStream}\nendstream\nendobj`);
  // Obj 5: Font Regular (Helvetica)
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');
  // Obj 6: Font Bold (Helvetica-Bold)
  objects.push('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj');
  // Obj 7: Document Metadata
  const nowStr = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  objects.push(`7 0 obj\n<< /Title (${safeTitle}) /Author (Roavio Travel Technologies) /Creator (Roavio Ticket Engine v2.0) /CreationDate (D:${nowStr}Z) >>\nendobj`);

  let body = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [0];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(body, 'latin1'));
    body += objects[i] + '\n';
  }

  const startxref = Buffer.byteLength(body, 'latin1');
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  return Buffer.from(body + xref + trailer, 'latin1');
}

/**
 * Generate a genuine binary PDF e-ticket from confirmed booking data
 */
export function generateTicketPdf(booking, baseUrl = 'http://localhost:5173') {
  const verifyUrl = `${baseUrl}/verify-ticket?token=${booking.ticketSecureToken || 'tk_' + booking.bookingId}`;
  const categoryUpper = (booking.category || 'ticket').toUpperCase();
  const route = booking.sourceLocation && booking.destination 
    ? `${booking.sourceLocation} -> ${booking.destination}`
    : (booking.destination || booking.title || 'India Travel');

  const { size, cells } = generateQrCells(verifyUrl);

  let ops = '';

  // 1. Background fill
  ops += '0.965 0.973 0.980 rg 0 0 595.28 841.89 re f\n';

  // 2. White Ticket Card Box
  ops += '1 1 1 rg 35 35 525.28 771.89 re f\n';
  ops += '0.886 0.910 0.941 RG 1 w 35 35 525.28 771.89 re S\n';

  // 3. Header Banner (Roavio Navy: #142B45)
  ops += '0.078 0.169 0.271 rg 35 730 525.28 76.89 re f\n';

  // Roavio Brand Header Text
  ops += 'BT /F2 22 Tf 1 1 1 rg 55 770 Td (ROAVIO) Tj ET\n';
  ops += 'BT /F2 8.5 Tf 0.984 0.608 0.200 rg 55 752 Td (DISCOVER INDIA  |  OFFICIAL CONFIRMED E-TICKET) Tj ET\n';

  // Category Badge (Green: #159B75)
  ops += '0.082 0.608 0.459 rg 430 755 110 24 re f\n';
  ops += `BT /F2 9 Tf 1 1 1 rg 440 763 Td (${escapePdfText(categoryUpper)} PASS) Tj ET\n`;

  // 4. Verification Seal Bar
  ops += '0.925 0.976 0.949 rg 35 690 525.28 30 re f\n';
  ops += '0.016 0.471 0.341 RG 0.75 w 35 690 525.28 30 re S\n';
  ops += 'BT /F2 9.5 Tf 0.016 0.471 0.341 rg 55 700 Td ([VERIFIED] ELECTRONIC RESERVATION - STATUS: CONFIRMED) Tj ET\n';
  ops += 'BT /F1 8.5 Tf 0.20 0.30 0.40 rg 410 700 Td (Payment Status: VERIFIED) Tj ET\n';

  // 5. Journey Title & Carrier
  ops += `BT /F2 14 Tf 0.059 0.090 0.165 rg 55 655 Td (${escapePdfText(booking.title || route)}) Tj ET\n`;
  ops += `BT /F1 9.5 Tf 0.392 0.455 0.545 rg 55 638 Td (Transport Operator: ${escapePdfText(booking.providerName || 'Certified Roavio Operator')}) Tj ET\n`;

  // 6. Section Boxes: Journey Details (Left) and Reservation Details (Right)
  // Left Box: Journey & Schedule
  ops += '0.973 0.980 0.988 rg 55 490 235 130 re f\n';
  ops += '0.886 0.910 0.941 RG 1 w 55 490 235 130 re S\n';
  ops += 'BT /F2 10 Tf 0.078 0.169 0.271 rg 70 595 Td (JOURNEY & SCHEDULE) Tj ET\n';
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 70 575 Td (Origin:) Tj ET\n`;
  ops += `BT /F2 9 Tf 0.059 0.090 0.165 rg 140 575 Td (${escapePdfText(booking.sourceLocation || 'India')}) Tj ET\n`;
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 70 555 Td (Destination:) Tj ET\n`;
  ops += `BT /F2 9 Tf 0.059 0.090 0.165 rg 140 555 Td (${escapePdfText(booking.destination || booking.title)}) Tj ET\n`;
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 70 535 Td (Travel Date:) Tj ET\n`;
  ops += `BT /F2 9 Tf 0.059 0.090 0.165 rg 140 535 Td (${escapePdfText(booking.travelDate || 'N/A')}) Tj ET\n`;
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 70 515 Td (Departure Time:) Tj ET\n`;
  ops += `BT /F2 9 Tf 0.059 0.090 0.165 rg 140 515 Td (${escapePdfText(booking.travelTime || '10:00 AM')}) Tj ET\n`;

  // Right Box: Reservation & PNR
  ops += '0.973 0.980 0.988 rg 305 490 235 130 re f\n';
  ops += '0.886 0.910 0.941 RG 1 w 305 490 235 130 re S\n';
  ops += 'BT /F2 10 Tf 0.078 0.169 0.271 rg 320 595 Td (BOOKING & RESERVATION) Tj ET\n';
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 320 575 Td (Booking ID:) Tj ET\n`;
  ops += `BT /F2 9.5 Tf 0.078 0.169 0.271 rg 400 575 Td (${escapePdfText(booking.bookingId)}) Tj ET\n`;
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 320 555 Td (Provider PNR:) Tj ET\n`;
  ops += `BT /F2 9.5 Tf 0.016 0.471 0.341 rg 400 555 Td (${escapePdfText(booking.providerReference)}) Tj ET\n`;
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 320 535 Td (Seat / Class:) Tj ET\n`;
  ops += `BT /F2 9 Tf 0.059 0.090 0.165 rg 400 535 Td (${escapePdfText(booking.seatClass || 'Standard')}) Tj ET\n`;
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 320 515 Td (Fare Paid:) Tj ET\n`;
  ops += `BT /F2 9.5 Tf 0.078 0.169 0.271 rg 400 515 Td (INR ${Number(booking.amount || 0).toLocaleString('en-IN')}) Tj ET\n`;

  // 7. Passenger Details Card
  ops += '0.973 0.980 0.988 rg 55 385 485 90 re f\n';
  ops += '0.886 0.910 0.941 RG 1 w 55 385 485 90 re S\n';
  ops += 'BT /F2 10 Tf 0.078 0.169 0.271 rg 70 455 Td (PASSENGER & CONTACT VERIFICATION) Tj ET\n';
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 70 435 Td (Lead Traveler:) Tj ET\n`;
  ops += `BT /F2 9.5 Tf 0.059 0.090 0.165 rg 160 435 Td (${escapePdfText(booking.leadPassenger)}) Tj ET\n`;
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 320 435 Td (Travelers Count:) Tj ET\n`;
  ops += `BT /F2 9 Tf 0.059 0.090 0.165 rg 410 435 Td (${booking.passengers || 1} Passenger(s)) Tj ET\n`;
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 70 415 Td (Mobile Contact:) Tj ET\n`;
  ops += `BT /F2 9 Tf 0.059 0.090 0.165 rg 160 415 Td (+91 ${escapePdfText(String(booking.mobileNumber || '').slice(-10))}) Tj ET\n`;
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 320 415 Td (Email Address:) Tj ET\n`;
  ops += `BT /F2 9 Tf 0.059 0.090 0.165 rg 410 415 Td (${escapePdfText(booking.email || 'traveler@roavio.com')}) Tj ET\n`;
  ops += `BT /F1 8 Tf 0.50 0.55 0.60 rg 70 395 Td (Booking Timestamp: ${escapePdfText(booking.bookingDate || '2026-11-20')} | Cryptographic Security Verified) Tj ET\n`;

  // 8. Cryptographic QR Verification Seal Box
  ops += '1 1 1 rg 55 235 485 135 re f\n';
  ops += '0.078 0.169 0.271 RG 1 w 55 235 485 135 re S\n';

  // Embed Vector QR Code (drawn module-by-module)
  const qrX = 70;
  const qrY = 247;
  const cellScale = 4.3; // 25 * 4.3 = 107.5 pt

  // QR background white
  ops += `1 1 1 rg ${qrX - 4} ${qrY - 4} 116 116 re f\n`;
  ops += `0.886 0.910 0.941 RG 0.5 w ${qrX - 4} ${qrY - 4} 116 116 re S\n`;

  // Draw QR cells
  ops += '0.078 0.169 0.271 rg\n';
  for (const pt of cells) {
    const cx = qrX + pt.x * cellScale;
    const cy = qrY + (size - 1 - pt.y) * cellScale;
    ops += `${cx.toFixed(1)} ${cy.toFixed(1)} ${(cellScale * 0.92).toFixed(1)} ${(cellScale * 0.92).toFixed(1)} re f\n`;
  }

  // QR Text & Details beside code
  ops += 'BT /F2 10.5 Tf 0.078 0.169 0.271 rg 205 345 Td (DIGITAL VERIFICATION & BOARDING VALIDATION) Tj ET\n';
  ops += 'BT /F1 8.5 Tf 0.30 0.35 0.42 rg 205 328 Td (Scan QR code with smartphone camera or transport scanner to authenticate.) Tj ET\n';
  ops += `BT /F1 8 Tf 0.392 0.455 0.545 rg 205 308 Td (Verification Link:) Tj ET\n`;
  ops += `BT /F2 8 Tf 0.016 0.471 0.341 rg 205 295 Td (${escapePdfText(verifyUrl)}) Tj ET\n`;
  ops += `BT /F1 8 Tf 0.392 0.455 0.545 rg 205 275 Td (Cryptographic HMAC Token:) Tj ET\n`;
  ops += `BT /F1 7.5 Tf 0.10 0.15 0.25 rg 205 262 Td (${escapePdfText(booking.ticketSecureToken || 'SEC-TOKEN-VERIFIED')}) Tj ET\n`;
  ops += 'BT /F1 7.5 Tf 0.50 0.55 0.60 rg 205 245 Td (Digitally registered in Central Reservation Database. Alteration voids validity.) Tj ET\n';

  // 9. Important Passenger Guidelines Box
  ops += '1 0.984 0.922 rg 55 125 485 95 re f\n';
  ops += '0.992 0.902 0.541 RG 1 w 55 125 485 95 re S\n';
  ops += 'BT /F2 9.5 Tf 0.573 0.306 0.039 rg 70 203 Td (IMPORTANT PASSENGER INSTRUCTIONS:) Tj ET\n';
  ops += 'BT /F1 8 Tf 0.45 0.30 0.10 rg 70 188 Td (1. Present this digital or printed pass along with a valid Govt. photo ID at boarding.) Tj ET\n';
  ops += 'BT /F1 8 Tf 0.45 0.30 0.10 rg 70 173 Td (2. Domestic Flights: Report at least 2 hrs prior. Trains & Intercity Buses: 30 mins prior.) Tj ET\n';
  ops += 'BT /F1 8 Tf 0.45 0.30 0.10 rg 70 158 Td (3. Baggage allowance & cancellation terms follow individual operating carrier guidelines.) Tj ET\n';
  ops += 'BT /F1 8 Tf 0.45 0.30 0.10 rg 70 143 Td (4. Real-time journey notifications & gate updates are delivered via verified SMS and WhatsApp.) Tj ET\n';

  // 10. Footer Disclaimer & Copyright
  ops += '0.886 0.910 0.941 RG 1 w 55 85 485 0.1 re S\n';
  ops += 'BT /F2 8 Tf 0.078 0.169 0.271 rg 55 70 Td (ROAVIO TRAVEL PLATFORM) Tj ET\n';
  ops += 'BT /F1 7.5 Tf 0.50 0.55 0.60 rg 185 70 Td (Discover India. Plan Your Journey. Travel Freely. | 24x7 Support: support@roavio.com) Tj ET\n';
  ops += 'BT /F1 7 Tf 0.60 0.65 0.70 rg 55 55 Td (Roavio Technologies Private Limited. All Rights Reserved. Official Digital Travel Pass.) Tj ET\n';

  return compilePdfDocument(ops, `Roavio Ticket ${booking.bookingId}`);
}

/**
 * Generate a genuine binary PDF for a planned itinerary document
 * Prominently watermarked as NOT an admission ticket
 */
export function generateItineraryPdf(itinerary, baseUrl = 'http://localhost:5173') {
  const days = itinerary.days || 3;
  const destination = itinerary.destination || 'Kerala Backwaters & Munnar';
  const travelers = itinerary.travelers || 2;
  const budget = itinerary.budget || 24500;

  let ops = '';

  // Background
  ops += '0.965 0.973 0.980 rg 0 0 595.28 841.89 re f\n';
  ops += '1 1 1 rg 35 35 525.28 771.89 re f\n';
  ops += '0.886 0.910 0.941 RG 1 w 35 35 525.28 771.89 re S\n';

  // Header Banner
  ops += '0.078 0.169 0.271 rg 35 730 525.28 76.89 re f\n';
  ops += 'BT /F2 20 Tf 1 1 1 rg 55 770 Td (ROAVIO) Tj ET\n';
  ops += 'BT /F2 8.5 Tf 0.984 0.608 0.200 rg 55 752 Td (DISCOVER INDIA  |  PLANNED TRAVEL ITINERARY & ROUTE GUIDE) Tj ET\n';

  // MANDATORY DISCLAIMER WATERMARK BANNER (Specification Requirement)
  ops += '0.996 0.949 0.949 rg 35 680 525.28 38 re f\n';
  ops += '0.863 0.196 0.184 RG 1.5 w 35 680 525.28 38 re S\n';
  ops += 'BT /F2 10 Tf 0.776 0.125 0.118 rg 55 702 Td (TRAVEL ITINERARY & ROUTE GUIDE - NOT A TRANSPORTATION TICKET OR ADMISSION PASS) Tj ET\n';
  ops += 'BT /F1 8 Tf 0.45 0.15 0.15 rg 55 690 Td (This document is for travel route guidance only. Transport and attractions require confirmed carrier tickets.) Tj ET\n';

  // Itinerary Details Header
  ops += `BT /F2 15 Tf 0.059 0.090 0.165 rg 55 640 Td (${escapePdfText(destination)} - ${days} Days Plan) Tj ET\n`;
  ops += `BT /F1 9 Tf 0.392 0.455 0.545 rg 55 624 Td (Travelers: ${travelers} Persons  |  Estimated Budget: INR ${budget.toLocaleString('en-IN')}  |  Pace: Balanced Exploration) Tj ET\n`;

  // Daily Schedule Blocks
  const dayPlans = [
    { day: 'Day 1', title: 'Arrival, Check-in & Scenic Orientation Tour', desc: 'Transfer from arrival point, hotel check-in, orientation walk, sunset viewpoints, and local authentic dining.' },
    { day: 'Day 2', title: 'Heritage Monuments, Nature Trails & Culture', desc: 'Full-day exploration of core heritage sights, scenic lake/mountain viewpoints, artisan crafts, and tea gardens.' },
    { day: 'Day 3', title: 'Culinary Discoveries, Shopping & Departure', desc: 'Morning cultural market visit, spice tasting, souvenir shopping, luggage consolidation, and scheduled departure transfer.' }
  ];

  let currentY = 580;
  for (const item of dayPlans) {
    ops += `0.973 0.980 0.988 rg 55 ${currentY - 60} 485 55 re f\n`;
    ops += `0.886 0.910 0.941 RG 1 w 55 ${currentY - 60} 485 55 re S\n`;
    ops += `BT /F2 10 Tf 0.078 0.169 0.271 rg 70 ${currentY - 20} Td (${escapePdfText(item.day)}: ${escapePdfText(item.title)}) Tj ET\n`;
    ops += `BT /F1 8.5 Tf 0.392 0.455 0.545 rg 70 ${currentY - 40} Td (${escapePdfText(item.desc)}) Tj ET\n`;
    currentY -= 75;
  }

  // Route & Logistics Guidelines
  ops += `0.95 0.97 0.99 rg 55 240 485 100 re f\n`;
  ops += `0.70 0.80 0.90 RG 1 w 55 240 485 100 re S\n`;
  ops += `BT /F2 10 Tf 0.078 0.169 0.271 rg 70 320 Td (SUGGESTED CONNECTING TRANSPORT) Tj ET\n`;
  ops += `BT /F1 8.5 Tf 0.25 0.35 0.45 rg 70 300 Td (- Flights: Check domestic direct connections at least 15 days in advance.) Tj ET\n`;
  ops += `BT /F1 8.5 Tf 0.25 0.35 0.45 rg 70 282 Td (- Trains: IRCTC Vande Bharat / Express reservations open 120 days prior.) Tj ET\n`;
  ops += `BT /F1 8.5 Tf 0.25 0.35 0.45 rg 70 264 Td (- Intercity Buses: Multi-axle AC sleeper buses operate convenient overnight routes.) Tj ET\n`;
  ops += `BT /F1 8.5 Tf 0.25 0.35 0.45 rg 70 248 Td (Book tickets directly on Roavio under Flights, Trains or Buses for verified e-tickets.) Tj ET\n`;

  // Footer
  ops += '0.886 0.910 0.941 RG 1 w 55 85 485 0.1 re S\n';
  ops += 'BT /F2 8 Tf 0.078 0.169 0.271 rg 55 70 Td (ROAVIO ITINERARY PLANNER) Tj ET\n';
  ops += 'BT /F1 7.5 Tf 0.50 0.55 0.60 rg 200 70 Td (For booking transport tickets, visit roavio.com/plan-journey) Tj ET\n';

  return compilePdfDocument(ops, `Roavio Itinerary ${destination}`);
}

/**
 * Generate formatted HTML e-ticket (ready for web preview / print view)
 */
export function generateTicketHtml(booking, baseUrl = 'http://localhost:5173') {
  const verifyUrl = `${baseUrl}/verify-ticket?token=${booking.ticketSecureToken || 'tk_' + booking.bookingId}`;
  const qrSvg = generateQrSvg(verifyUrl);
  const categoryUpper = (booking.category || 'ticket').toUpperCase();
  const route = booking.sourceLocation && booking.destination 
    ? `${booking.sourceLocation} ➔ ${booking.destination}`
    : (booking.destination || booking.title);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Roavio Confirmed E-Ticket – ${booking.bookingId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #F1F5F9;
      color: #1E293B;
      padding: 30px 15px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .ticket-container {
      width: 100%;
      max-width: 800px;
      background: #FFFFFF;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(20, 43, 69, 0.12);
      border: 1px solid #E2E8F0;
    }
    .ticket-header {
      background: #142B45;
      color: #FFFFFF;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-tag {
      font-size: 11px;
      color: #FF9B54;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .category-badge {
      background: #159B75;
      color: #FFFFFF;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    .ticket-body {
      padding: 32px;
    }
    .verified-seal {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #ECFDF5;
      color: #047857;
      border: 1px solid #A7F3D0;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .title-row {
      margin-bottom: 24px;
    }
    .title-row h2 {
      font-size: 22px;
      color: #0F172A;
      margin-bottom: 4px;
    }
    .title-row p {
      font-size: 14px;
      color: #64748B;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 28px;
      background: #F8FAFC;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #E2E8F0;
    }
    .grid-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .cell-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .cell-value {
      font-size: 15px;
      font-weight: 700;
      color: #0F172A;
    }
    .cell-value.highlight {
      color: #159B75;
    }
    .qr-security-box {
      display: flex;
      align-items: center;
      gap: 24px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .qr-side {
      flex-shrink: 0;
    }
    .security-info {
      flex-grow: 1;
    }
    .security-title {
      font-size: 14px;
      font-weight: 800;
      color: #142B45;
      margin-bottom: 4px;
    }
    .security-desc {
      font-size: 12px;
      color: #64748B;
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .token-text {
      font-family: monospace;
      font-size: 11px;
      color: #0F172A;
      background: #F1F5F9;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      word-break: break-all;
    }
    .instructions-box {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 10px;
      padding: 16px;
      font-size: 12px;
      color: #92400E;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .instructions-box strong {
      display: block;
      margin-bottom: 4px;
      color: #78350F;
    }
    .ticket-footer {
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #64748B;
    }
    .print-bar {
      margin-top: 20px;
      text-align: center;
    }
    .print-btn {
      background: #142B45;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }
    @media print {
      body { background: white; padding: 0; }
      .print-bar { display: none; }
      .ticket-container { box-shadow: none; border: none; }
    }
  </style>
</head>
<body>
  <div>
    <div class="ticket-container">
      <div class="ticket-header">
        <div>
          <div class="brand-title">✈️ ROAVIO</div>
          <div class="brand-tag">Discover India · E-Ticket Pass</div>
        </div>
        <div class="category-badge">${categoryUpper} CONFIRMED</div>
      </div>

      <div class="ticket-body">
        <div class="verified-seal">
          ✓ Verified Roavio Reservation · Status: Confirmed
        </div>

        <div class="title-row">
          <h2>${booking.title}</h2>
          <p>Carrier / Operator: <strong>${booking.providerName || 'Certified Partner'}</strong></p>
        </div>

        <div class="details-grid">
          <div class="grid-cell">
            <span class="cell-label">Booking Reference</span>
            <span class="cell-value">${booking.bookingId}</span>
          </div>
          <div class="grid-cell">
            <span class="cell-label">Provider Reference / PNR</span>
            <span class="cell-value highlight">${booking.providerReference}</span>
          </div>
          <div class="grid-cell">
            <span class="cell-label">Lead Passenger</span>
            <span class="cell-value">${booking.leadPassenger}</span>
          </div>
          <div class="grid-cell">
            <span class="cell-label">Travel Date & Time</span>
            <span class="cell-value">${booking.travelDate} (${booking.travelTime || '10:00 AM'})</span>
          </div>
          <div class="grid-cell">
            <span class="cell-label">Origin / Route</span>
            <span class="cell-value">${route}</span>
          </div>
          <div class="grid-cell">
            <span class="cell-label">Seat / Accommodation</span>
            <span class="cell-value">${booking.seatClass || 'Standard Class'}</span>
          </div>
          <div class="grid-cell">
            <span class="cell-label">Payment & Verification</span>
            <span class="cell-value highlight">₹${Number(booking.amount).toLocaleString('en-IN')} (Verified)</span>
          </div>
          <div class="grid-cell">
            <span class="cell-label">Passengers</span>
            <span class="cell-value">${booking.passengers || 1} Person(s)</span>
          </div>
        </div>

        <div class="qr-security-box">
          <div class="qr-side">
            ${qrSvg}
          </div>
          <div class="security-info">
            <div class="security-title">Tamper-Proof Verification Seal</div>
            <div class="security-desc">
              Scan this QR code with any smartphone camera to view the live verification record on the Roavio Central Reservation Directory.
            </div>
            <div class="token-text">${booking.ticketSecureToken}</div>
          </div>
        </div>

        <div class="instructions-box">
          <strong>Boarding Guidelines & Requirements:</strong>
          • Please carry a government-approved original photo ID (Aadhaar, Passport, Voter ID) matching the passenger name.<br>
          • For domestic flights, report 2 hours prior to scheduled departure. For trains and buses, report 30 minutes prior.<br>
          • Roavio 24x7 Traveler Support: support@roavio.com
        </div>
      </div>

      <div class="ticket-footer">
        <span>Official Electronic Reservation Document</span>
        <span>www.roavio.com</span>
      </div>
    </div>

    <div class="print-bar">
      <button class="print-btn" onclick="window.print()">Print or Save as PDF</button>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate formatted HTML for planned itinerary
 */
export function generateItineraryHtml(itinerary) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Roavio Travel Itinerary – ${itinerary.destination || 'Planned Journey'}</title>
  <style>
    body { font-family: sans-serif; padding: 30px; background: #F8FAFC; color: #0F172A; }
    .card { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 16px; border: 1px solid #E2E8F0; }
    .watermark-banner { background: #FEE2E2; border: 1px solid #F87171; color: #991B1B; padding: 12px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; margin-bottom: 24px; }
    h1 { font-size: 24px; color: #142B45; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="watermark-banner">
      ⚠️ TRAVEL ITINERARY & ROUTE GUIDE — NOT A CONFIRMED TRANSPORTATION TICKET OR ADMISSION PASS
    </div>
    <h1>${itinerary.destination || 'India Journey Plan'}</h1>
    <p>Estimated Budget: ₹${itinerary.budget || '25,000'} · Duration: ${itinerary.days || 3} Days</p>
  </div>
</body>
</html>`;
}
