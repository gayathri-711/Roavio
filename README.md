# ROAVIO – India Travel Discovery, Planning & Booking Platform

Roavio is a modern, full-stack travel platform for discovering Indian destinations, planning multi-city itineraries, and booking Flights, Trains, Express Buses, and Monument Passes with automated mobile e-ticket delivery.

---

## 🌟 Key Features

* **Discover India**: Curated directory of 175+ destinations across all 36 Indian States and Union Territories with filters, weather insights, and heritage highlights.
* **Smart Journey Planner**: Interactive itinerary builder with distance computation, travel mode comparison, and downloadable day-wise itineraries.
* **Transport Reservations**: Simulated booking workflows for Flights (Air India, IndiGo), Trains (IRCTC Vande Bharat, Rajdhani), and Luxury Sleeper Buses.
* **Automatic Mobile Ticket Delivery**:
  * **Native PDF E-Ticket**: ISO-compliant `%PDF-1.4` vector e-ticket with passenger details, PNR, and embedded cryptographic QR validation code.
  * **Email Dispatch**: Automated email ticket delivery with attached binary PDF via **Resend API**.
  * **SMS Dispatch**: 6-digit cryptographic verification OTP and transactional booking SMS integration via **MSG91** and **Fast2SMS**.
  * **WhatsApp Integration**: Ticket confirmation summary with secure verification links and direct WhatsApp dispatch.
* **My Trips & Tickets**: User dashboard with tabs for confirmed tickets, saved places, planned journeys, and instant PDF download/preview.
* **Dedicated Admin Management Portal**: Control dashboard at `/admin` for destinations, users, reservations, reports, and notification logs.

---

## 🚀 Tech Stack

* **Frontend**: React 18, Vite, React Router v6, Lucide React icons, Framer Motion
* **Backend**: Node.js, Express / Native HTTP Router, RESTful APIs
* **Security & Auth**: Salted SHA-256 cryptographic OTP hashing, 5-minute expiry, rate-limiting
* **Gateways & APIs**:
  * **MSG91 / Fast2SMS** – SMS & OTP Gateway
  * **Resend** – Transactional Email with PDF Attachments
  * **Meta WhatsApp Business Cloud API** – WhatsApp E-Tickets
* **PDF Engine**: Native PDF-1.4 binary engine with embedded vector QR codes

---

## 🛠️ Getting Started

### 1. Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/gayathri-711/Roavio.git
cd Roavio

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and configure your API keys:
```bash
cp .env.example .env
```

Key environment variables:
```env
PORT=5173
JWT_SECRET=your_jwt_secret_here

# Resend Email API
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=Roavio Travel <onboarding@resend.dev>

# MSG91 SMS Gateway
SMS_PROVIDER=msg91
SMS_API_KEY=your_msg91_authkey_here
SMS_SENDER_ID=SMSIND
SMS_TEMPLATE_ID=your_msg91_template_id_here
```

### 4. Running the Platform
```bash
# Build frontend
npm run build

# Start the full-stack server
node server.js
```
Open **http://localhost:5173** in your browser.

---

## 🧪 Testing

Run the automated test suites:
```bash
# Comprehensive E2E test suite (PDF, OTP, WhatsApp, Email)
node server/test_e2e_fixes.js

# Mobile ticket & notification regression suite
node server/test_mobile_tickets.js
```

---

## 📄 License
This project is open-source under the MIT License.
