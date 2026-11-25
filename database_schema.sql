CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 130),
    gender VARCHAR(20) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "patientId" UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax >= 0),
    "totalAmount" NUMERIC(10, 2) NOT NULL CHECK ("totalAmount" >= 0),
    "paymentStatus" VARCHAR(30) NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "billId" UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    "razorpayOrderId" VARCHAR(100) NOT NULL,
    "razorpayPaymentId" VARCHAR(100),
    "razorpaySignature" VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    "paymentStatus" VARCHAR(30) NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_patients_gender ON patients(gender);
CREATE INDEX IF NOT EXISTS idx_bills_patient_id ON bills("patientId");
CREATE INDEX IF NOT EXISTS idx_payments_bill_id ON payments("billId");
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments("razorpayOrderId");
