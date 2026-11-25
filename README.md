# CarePulse - Patient Management System

Full-stack clinical and patient billing management application built with **React**, **Redux Toolkit**, **NestJS**, **PostgreSQL**, and **Razorpay Payment Gateway**.

---

## 1. System Architecture & Data Flow

The application implements a decoupled, scalable full-stack flow:

```
React (UI Components)
      │
      ▼
Redux Toolkit (State Management: Auth, Patients, Billing, Payments)
      │
      ▼
REST API (Axios with Bearer Interceptors)
      │
      ▼
NestJS (Controllers -> Guards -> Services -> TypeORM)
      │
      ├── PostgreSQL (Users, Patients, Bills, Payments)
      └── Razorpay Payment Gateway (Order creation & HMAC Signature Verification)
```

---

## 2. Quick Start for Windows Users in VS Code

### Method A: One-Click Runner (Fastest)

1. Open this repository folder in **VS Code**:
   ```
   code .
   ```
2. Open the built-in terminal (`Ctrl + \``) and run:
   ```powershell
   .\run.bat
   ```
   *Or with PowerShell:*
   ```powershell
   .\run.ps1
   ```
   This automatically installs missing dependencies and launches both backend and frontend servers in separate windows.

---

### Method B: Manual Steps (Terminal)

#### Step 1: Start Backend
```bash
cd backend
npm install
npm run start:dev
```
*Backend runs on `http://localhost:5000/api`*

#### Step 2: Start Frontend
Open a new terminal tab in VS Code:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 3. Database Configuration

By default, the backend connects to **PostgreSQL**.

### PostgreSQL Setup
1. Create a database named `patient_management` in PostgreSQL:
   ```sql
   CREATE DATABASE patient_management;
   ```
2. Check `backend/.env`:
   ```env
   PORT=5000
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=patient_management
   JWT_SECRET=supersecretjwtkey_healthcare_secure_2025
   JWT_EXPIRES_IN=24h
   RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
   RAZORPAY_KEY_SECRET=s9x3W5f1U9r1hQ3zV9w8x7y6
   ```
   TypeORM automatically creates and synchronizes all tables on startup.
   *(The raw schema with constraints is also available in `database_schema.sql`)*

### Instant SQLite Fallback (No PostgreSQL install required)
If testing on a machine without a running PostgreSQL instance, change one line in `backend/.env`:
```env
DB_TYPE=sqlite
```
The application will instantly run using a local zero-setup SQLite database!

---

## 4. Default Login Credentials

- **Email:** `admin@hospital.com`
- **Password:** `admin123`
*(A quick "Auto-fill Default Admin Credentials" button is available directly on the login screen).*

---

## 5. Razorpay Payment Gateway Flow

1. User clicks **"Pay Bill"** on any pending invoice.
2. The frontend dispatches `createRazorpayOrder(billId)` to `POST /api/payments/create-order`.
3. NestJS verifies the bill and creates a Razorpay order securely using the backend secret key.
4. Razorpay Checkout opens with patient prefill information and amount.
5. On successful transaction, Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
6. Frontend sends credentials to `POST /api/payments/verify`.
7. NestJS verifies HMAC SHA256 signature using `RAZORPAY_KEY_SECRET`.
8. PostgreSQL database updates `bills.paymentStatus = 'Paid'` and registers record in `payments` table.
9. UI reflects immediate update and displays settlement receipt details.

---

## 6. Features Implemented

- **Authentication:** JWT tokens, hashed passwords (bcrypt), protected route guards.
- **Dashboard:** Real-time counts of patients, total bills, paid balance, pending balance, and latest patient admissions.
- **Patient Management:** Create, Read, Update, Delete with confirmation modal, Search by Name, and Filter by Gender.
- **Billing Management:** Itemized service descriptions, dynamic base amount + tax calculation, status badges.
- **Razorpay Payments:** Order initialization, standard checkout modal, signature verification, and transaction history.
- **Error Handling:** Validation pipes, HTTP exception filters, duplicate email guards, and descriptive UI error notifications.
