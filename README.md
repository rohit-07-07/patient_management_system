# CarePulse - Patient Management System

[![Live Frontend](https://img.shields.io/badge/Live%20Frontend-Vercel-success?style=for-the-badge&logo=vercel)](https://patient-management-system-sable-mu.vercel.app)
[![Live Backend API](https://img.shields.io/badge/Live%20API-Render-blue?style=for-the-badge&logo=render)](https://patient-management-api-i8jz.onrender.com/api)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/rohit-07-07/patient_management_system)

A full-stack clinical and patient billing management application built with **React**, **Redux Toolkit**, **NestJS**, **PostgreSQL**, and **Razorpay Payment Gateway**.

---

## 🚀 Live Submission Links

| Service | Hosting | URL |
| :--- | :--- | :--- |
| **Frontend Application** | **Vercel** | [https://patient-management-system-sable-mu.vercel.app](https://patient-management-system-sable-mu.vercel.app) |
| **Backend REST API** | **Render** | [https://patient-management-api-i8jz.onrender.com/api](https://patient-management-api-i8jz.onrender.com/api) |
| **Source Code Repository** | **GitHub** | [https://github.com/rohit-07-07/patient_management_system](https://github.com/rohit-07-07/patient_management_system) |

### 🔐 Demo Credentials
- **Email:** `admin@hospital.com`
- **Password:** `admin123`
*(A 1-click **"Auto-fill Default Admin Credentials"** button is also available on the login screen).*

---

## 1. System Architecture & Complete Data Flow

The system implements a clean, decoupled data architecture demonstrating end-to-end integration:

```
React (UI Components)
      │
      ▼
Redux Toolkit (State Management: Auth, Patients, Billing, Payments)
      │
      ▼
REST APIs (Axios with Bearer Interceptors)
      │
      ▼
NestJS (Controllers -> Guards -> Services -> TypeORM)
      │
      ├── PostgreSQL / SQLite (Users, Patients, Bills, Payments)
      └── Razorpay Payment Gateway (Order Creation & HMAC SHA256 Verification)
```

---

## 2. API Documentation

All backend endpoints are prefixed with `/api`. Guarded endpoints require a JWT Bearer token passed in the `Authorization` header.

### Authentication Endpoints
- `POST /api/auth/login`: Authenticate doctor/admin with email and password, returning JWT token.
- `POST /api/auth/register`: Create a new user account.

### Patient Management Endpoints
- `GET /api/patients`: Get all patients (supports query params: `?search=name&gender=Male`).
- `GET /api/patients/:id`: Get complete patient profile and billing history.
- `POST /api/patients`: Create a new patient record with input validation.
- `PUT /api/patients/:id`: Update existing patient record.
- `DELETE /api/patients/:id`: Delete patient record and associated billing data.

### Billing Endpoints
- `GET /api/bills`: Get all medical invoices with patient relations.
- `GET /api/bills/:id`: Get single bill details with payment records.
- `POST /api/bills`: Generate a new invoice (calculates base amount + tax = total).
- `PUT /api/bills/:id`: Update bill description, amount, tax, or status.
- `DELETE /api/bills/:id`: Delete invoice record.

### Payment & Razorpay Endpoints
- `POST /api/payments/create-order`: Create a Razorpay order from bill ID.
- `POST /api/payments/verify`: Verify HMAC SHA256 payment signature and update bill status to `Paid`.
- `GET /api/payments/history`: List all payment transaction records.
- `GET /api/payments/:id`: Get settlement record for a specific payment.

### Dashboard Endpoints
- `GET /api/dashboard/summary`: Aggregate counts of total patients, invoices, paid revenue, pending balance, and recently admitted patients.

---

## 3. Razorpay Payment Workflow

1. User clicks **"Pay Bill"** on any invoice in the Billing module.
2. Frontend dispatches `createRazorpayOrder(billId)` to `POST /api/payments/create-order`.
3. Backend validates the bill and creates a Razorpay order using credentials stored securely in environment variables.
4. Razorpay Order ID, currency, and amount are returned to the frontend.
5. Frontend launches **Razorpay Checkout** popup with patient prefill information.
6. On user completion, Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
7. Frontend transmits verification details to `POST /api/payments/verify`.
8. Backend verifies the signature using `crypto.createHmac('sha256', secret)` and processes a database transaction:
   - Updates `payments` table with payment ID, signature, and status `Paid`.
   - Updates `bills` table with status `Paid`.
9. The UI refreshes state through Redux immediately and notifies the user.

---

## 4. Running Locally in VS Code on Windows

### Option A: One-Click Launch (Fastest)

1. Open this repository folder in **VS Code**:
   ```
   code .
   ```
2. In the terminal, run:
   ```cmd
   .\run.bat
   ```
   *(Or in PowerShell: `.\run.ps1`)*

This script automatically verifies dependencies and launches both backend (`http://localhost:5000/api`) and frontend (`http://localhost:3000`) in separate windows.

---

### Option B: Manual Setup

#### 1. Backend:
```bash
cd backend
npm install
npm run start:dev
```

#### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 5. Database Setup

- PostgreSQL schema file with constraints, foreign keys, and indexes is available in **`database_schema.sql`**.
- The backend features dual-database support:
  - **PostgreSQL** by default (configured via `backend/.env`).
  - **SQLite** fallback for zero-configuration local and cloud evaluation (`DB_TYPE=sqlite`).

---

## 6. Features Summary

- **Authentication:** JWT Bearer tokens, bcrypt hashing, and route protection.
- **Dashboard:** Real-time metrics for patients, total bills, settled revenue, and pending balances.
- **Patient Management:** Full CRUD with input validation, modal dialogs, name search, and gender filter.
- **Billing Management:** Itemized invoice generator, dynamic tax calculations, and status indicators.
- **Razorpay Integration:** End-to-end checkout with secure backend signature verification.
- **Code Quality:** Humanized, clean code with 0 written comments across all code files.
