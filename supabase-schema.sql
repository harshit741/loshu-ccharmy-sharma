-- ============================================================
-- CcharmyShah — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Orders table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name         TEXT NOT NULL,
  customer_email        TEXT NOT NULL,
  customer_phone        TEXT,
  package_id            TEXT NOT NULL,
  package_name          TEXT NOT NULL,
  amount                INTEGER NOT NULL,       -- stored in full rupees for app display
  currency              TEXT NOT NULL DEFAULT 'INR',
  status                TEXT NOT NULL DEFAULT 'created'
                        CHECK (status IN ('created', 'authorized', 'paid', 'failed', 'refunded')),
  razorpay_order_id     TEXT,
  razorpay_payment_id   TEXT,
  razorpay_signature    TEXT,
  numerology_dob        TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Enquiries table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lo Shu calculator table
CREATE TABLE IF NOT EXISTS public."LoshuCalculator" (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name      TEXT NOT NULL,
  dob            TEXT NOT NULL,
  mobile_number  TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LoshuCalculator" ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT orders (needed for client-side booking)
CREATE POLICY "Allow insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Allow order updates only for matching email (or use service role key for server-side)
CREATE POLICY "Allow update own order" ON public.orders
  FOR UPDATE USING (true);  -- Tighten this in production if using auth

-- Allow selecting own order by id (for success page)
CREATE POLICY "Allow select order by id" ON public.orders
  FOR SELECT USING (true);

-- Allow anyone to submit enquiries
CREATE POLICY "Allow insert enquiries" ON public.enquiries
  FOR INSERT WITH CHECK (true);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS orders_email_idx    ON public.orders (customer_email);
CREATE INDEX IF NOT EXISTS orders_status_idx   ON public.orders (status);
CREATE INDEX IF NOT EXISTS enquiries_email_idx ON public.enquiries (email);
CREATE INDEX IF NOT EXISTS loshu_calculator_mobile_idx ON public."LoshuCalculator" (mobile_number);

-- Existing deployments: align the order status constraint with the Razorpay lifecycle
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('created', 'authorized', 'paid', 'failed', 'refunded'));

-- ============================================================
-- NOTES:
-- 1. For production, tighten RLS policies using Supabase Auth
-- 2. Use the Supabase service role key (server-side only) for
--    admin operations like listing all orders
-- 3. The `amount` column stores full rupees (not paise) in this
--    implementation — adjust per your Razorpay setup
-- ============================================================
