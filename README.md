# 📦 ParcelSwift — Parcel Management System

A full-stack web application for end-to-end parcel booking, real-time tracking, payment processing, delivery scheduling, cancellation, and customer feedback management.

Built with **Angular 18** frontend, **Java Spring Boot 3** backend, and **JSON file storage** (no SQL database setup required).

---

## 📑 Table of Contents

- [Features Overview](#-features-overview)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Quick Start Guide](#-quick-start-guide)
  - [1. Convert Excel Sheets to TXT](#1-convert-excel-sheets-to-txt)
  - [2. Start Java Spring Boot Backend](#2-start-java-spring-boot-backend)
  - [3. Start Angular 18 Frontend](#3-start-angular-18-frontend)
  - [4. (Optional) Run Automated API Tests](#4-optional-run-automated-api-tests)
- [Default Login Credentials](#-default-login-credentials)
- [Role-Based Features](#-role-based-features)
  - [Customer Role](#customer-role)
  - [Officer / Admin Role](#officer--admin-role)
- [Service Cost Calculation Formula](#-service-cost-calculation-formula)
- [REST API Reference](#-rest-api-reference)
- [License](#-license)

---

## 🌟 Features Overview

- **Two Dedicated Portals**: Customer Portal & Officer/Admin Portal with role-based routing and auth guards.
- **Self-Service Registration**: Auto-generated Customer IDs (`CUS00001`), password strength validation (SHA-256 encryption), and green acknowledgment confirmation.
- **Smart Cost Engine**: Dynamic parcel delivery calculation based on weight, delivery type, packing preference, admin fee, and taxes.
- **Secure Card Payment**: 16-digit card validation, expiry check, CVV check, modal confirmation, and instant receipt generation.
- **Parcel Tracking**: Visual step-by-step shipment timeline for parcel tracking.
- **Delivery Lifecycle**: `New` ➔ `Scheduled` ➔ `PickedUp` ➔ `Assigned` ➔ `Booked` ➔ `InTransit` ➔ `Delivered` (or `Cancelled`).
- **Data Export & Pagination**: 10-item pagination with `.xls` and `.pdf` export options for booking records.
- **Soft Cancellation**: Enforces business rules (cannot cancel *In Transit* or *Delivered* items; officer cancellations initiate 5-day refunds).
- **Customer Reviews**: 1-to-5 star rating and feedback system for delivered shipments.
- **Help & Support**: Dedicated support channel details, ticketing form, and FAQs.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | Angular 18 (Standalone) | Modern Dark Glassmorphism UI, Responsive CSS, Reactive/Template Forms |
| **Backend** | Java Spring Boot 3.3.2 | RESTful API, SHA-256 Security, Jackson JSON Serialization |
| **Persistence** | JSON File Storage | File-based data storage in `backend/data/` (Zero DB configuration needed) |
| **CLI Script** | Python 3 + OpenPyXL | Automatic Excel sheet extractor (`Sprint_2.xlsx` ➔ `.txt`) |

---

## 📋 Prerequisites

Before running the application, make sure you have the following installed:

1. **Java JDK 17 or higher** (JDK 17, 21, or 25 supported)
   ```bash
   java -version
   ```
2. **Node.js 18+ and npm**
   ```bash
   node -v
   npm -v
   ```
3. **Python 3.8+**
   ```bash
   python --version
   ```

---

## 📁 Project Structure

```
final pro/
├── Sprint_2.xlsx               # Source project specification spreadsheet
├── convert_xlsx_to_txt.py      # Python script to convert all xlsx sheets to txt
├── test_backend_api.py         # Automated integration test suite for REST endpoints
├── txt_output/                 # Generated text files from Excel
│   ├── Feature_list.txt
│   ├── User_Story.txt
│   └── Annexure.txt
├── backend/                    # Java Spring Boot 3 Application
│   ├── pom.xml
│   ├── data/                   # JSON storage directory
│   │   ├── users.json
│   │   ├── bookings.json
│   │   ├── payments.json
│   │   └── feedback.json
│   └── src/main/java/com/parcel/
│       ├── ParcelManagementApplication.java
│       ├── config/WebConfig.java          # CORS Configuration
│       ├── controller/                    # Auth, Booking, Payment, Feedback Controllers
│       ├── model/                         # User, Booking, Payment, Feedback Models
│       └── service/                       # Business Logic & JSON Storage Services
└── frontend/                   # Angular 18 Single Page Application
    ├── package.json
    ├── angular.json
    └── src/
        ├── index.html
        ├── styles.css                     # Global Dark Glassmorphism Design System
        └── app/
            ├── app.routes.ts              # Route definitions & guards
            ├── models/models.ts           # TypeScript interfaces
            ├── services/                  # ApiService & AuthService
            ├── guards/auth.guard.ts       # Role-based route protection
            └── components/                # 17 Feature components (Customer & Officer)
```

---

## 🚀 Quick Start Guide

### 1. Convert Excel Sheets to TXT
Run the Python conversion script to extract the requirements from `Sprint_2.xlsx`:
```bash
python convert_xlsx_to_txt.py
```
*Extracted text files will be stored in the `txt_output/` folder.*

---

### 2. Start Java Spring Boot Backend
Open a terminal in the project directory:

```bash
cd backend
```

**Run using the included portable Maven:**
- **On Windows (PowerShell / CMD):**
  ```powershell
  & ".\maven\apache-maven-3.9.8\bin\mvn.cmd" spring-boot:run
  ```
- **Or if Maven (`mvn`) is installed globally:**
  ```bash
  mvn spring-boot:run
  ```

*Backend server will start on: **`http://localhost:8080`***

---

### 3. Start Angular 18 Frontend
Open a new terminal window:

```bash
cd frontend
npm install
npx ng serve --port 4200
```

*Open your browser and navigate to: **`http://localhost:4200`***

---

### 4. (Optional) Run Automated API Tests
To verify all 13 backend endpoints, cost calculations, status flows, and validation rules:

```bash
python test_backend_api.py
```

---

## 🔑 Default Login Credentials

### 1. Officer / Admin Account
- **Customer ID**: `OFC00001`
- **Password**: `Admin@123`
- **Role**: `OFFICER`

### 2. Sample Customer Account
- **Customer ID**: `CUS00001`
- **Password**: `Password@123`
- **Role**: `CUSTOMER`

*(You can also self-register a new customer account directly from the **Register** page).*

---

## 👥 Role-Based Features

### Customer Role
1. **Self-Registration (`/register`)**: Captures full personal details, validates passwords, and issues auto-generated unique Customer IDs (`CUS00001`, etc.).
2. **Login (`/login`)**: Secure authentication redirecting to the Customer Dashboard.
3. **Dashboard (`/customer/home`)**: Overview with quick action tiles and recent bookings table.
4. **Book a Parcel (`/customer/booking`)**: Sender & receiver forms, live cost estimator, and booking acknowledgment.
5. **Payment (`/customer/payment/:id`)**: Credit/Debit card form with format checks, expiry validation, CVV check, modal review, and receipt download.
6. **Invoice View (`/customer/invoice/:id`)**: Printable/downloadable invoice with complete breakdown.
7. **Parcel Tracking (`/customer/tracking`)**: Search by Booking ID with real-time status timeline.
8. **Previous Bookings (`/customer/bookings`)**: Booking history in descending date order, status/ID/date filters, 10-item pagination, and `.xls`/`.pdf` export.
9. **Soft Cancellation (`/customer/cancel`)**: Cancel booked parcels with instant status updates.
10. **Feedback (`/customer/feedback`)**: Submit 1-5 star ratings and reviews for delivered shipments.
11. **Contact Support (`/customer/support`)**: Support channels, ticketing form, and FAQs.

### Officer / Admin Role
1. **Officer Dashboard (`/officer/home`)**: Live statistics (Total Bookings, In Transit, Delivered, New).
2. **Book for Customer (`/officer/booking`)**: Create bookings on behalf of any customer with a ₹50 administrative fee (sets initial status to `Assigned` for in-office payment).
3. **Global Tracking (`/officer/tracking`)**: Search and view sender and receiver information for any booking across the system.
4. **Delivery Status Management (`/officer/delivery-status`)**: Update status between `New`, `Scheduled`, `PickedUp`, `Assigned`, `Booked`, `InTransit`, `Delivered`, and `Cancelled`.
5. **Pickup & Drop-off Scheduling (`/officer/pickup-schedule`)**: Update parcel pickup and drop-off timestamps.
6. **View All Bookings (`/officer/bookings`)**: Comprehensive booking management with multi-criteria filters, pagination, export capability, and direct feedback viewing.
7. **Officer Cancellation (`/officer/cancel`)**: Cancel bookings with automated 5-day customer refund messaging (restricted for *Delivered* or *In Transit* parcels).
8. **Feedback Overview (`/officer/feedback`)**: View all customer ratings and reviews across all delivered orders.

---

## 💰 Service Cost Calculation Formula

The application computes service costs according to the following formula:

$$\text{Customer Cost} = (\text{Base Rate} + \text{Weight Charge} + \text{Delivery Charge} + \text{Packing Charge}) \times (1 + \text{Tax Rate})$$

$$\text{Officer Cost} = (\text{Base Rate} + \text{Weight Charge} + \text{Delivery Charge} + \text{Packing Charge} + \text{Admin Fee}) \times (1 + \text{Tax Rate})$$

### Parameter Breakdown:
- **Base Rate**: ₹50.00 (Fixed starting cost)
- **Weight Charge**: ₹0.02 × parcel weight in grams
- **Delivery Charges**:
  - Standard Delivery: ₹30.00
  - Express Delivery: ₹80.00
  - Same-Day Delivery: ₹150.00
- **Packing Charges**:
  - Basic Packing: ₹10.00
  - Premium Packing: ₹30.00
- **Admin Fee** (Officer bookings only): ₹50.00
- **Tax Rate**: 5% (`0.05`)

#### Example Calculation:
For a 2000g parcel with Express Delivery and Premium Packing booked by a customer:
$$\text{Cost} = (50 + (0.02 \times 2000) + 80 + 30) \times 1.05 = (50 + 40 + 80 + 30) \times 1.05 = 200 \times 1.05 = \mathbf{₹210.00}$$

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new customer
- `POST /api/auth/login` — Authenticate user (Customer or Officer)
- `GET /api/auth/user/{customerId}` — Get user details
- `GET /api/auth/customers` — Get list of registered customers

### Bookings (`/api/bookings`)
- `POST /api/bookings/customer` — Create customer booking
- `POST /api/bookings/officer` — Create officer booking on behalf of customer
- `GET /api/bookings/{bookingId}` — Get single booking details
- `GET /api/bookings/customer/{customerId}` — Get all bookings for a specific customer
- `GET /api/bookings/all` — Get all system bookings
- `PUT /api/bookings/{bookingId}/status` — Update parcel delivery status
- `PUT /api/bookings/{bookingId}/schedule` — Update pickup and drop-off times
- `PUT /api/bookings/{bookingId}/cancel` — Soft-cancel a booking
- `POST /api/bookings/calculate-cost` — Calculate cost breakdown

### Payments (`/api/payments`)
- `POST /api/payments` — Process payment for a booking
- `GET /api/payments/{bookingId}` — Get payment record by booking ID

### Feedback (`/api/feedback`)
- `POST /api/feedback` — Submit feedback for a delivered booking
- `GET /api/feedback/all` — Get all customer feedback
- `GET /api/feedback/booking/{bookingId}` — Get feedback for a specific booking

---

## 📄 License

This project is created for educational and demonstration purposes. All rights reserved.
