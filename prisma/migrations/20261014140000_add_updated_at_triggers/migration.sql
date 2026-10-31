-- ==========================================================
-- Auto-update updated_at triggers + targeted performance indexes
-- Project: SALON-WOW
-- Reference: Proposal Section 6.1.2 - Performance & Reliability
-- ==========================================================

-- --------------------------------------------------------
-- PART 1: Auto-update updated_at triggers
-- --------------------------------------------------------
-- Whenever a row is UPDATEd, PostgreSQL will automatically
-- refresh the updated_at column. This prevents stale timestamps
-- even when data is changed directly through SQL or the
-- Supabase dashboard (bypassing Prisma).

-- Reusable trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users table
DROP TRIGGER IF EXISTS trg_users_updated_at ON "users";
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON "users"
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Appointments table
DROP TRIGGER IF EXISTS trg_appointments_updated_at ON "appointments";
CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON "appointments"
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Stylists table
DROP TRIGGER IF EXISTS trg_stylists_updated_at ON "stylists";
CREATE TRIGGER trg_stylists_updated_at
  BEFORE UPDATE ON "stylists"
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- --------------------------------------------------------
-- PART 2: Targeted performance indexes
-- --------------------------------------------------------
-- Note: Prisma already creates indexes on foreign keys automatically,
-- so we only add composite indexes that improve common query patterns
-- that Prisma does NOT cover.

-- Fetch a user's notifications newest first (used in notification list UI)
CREATE INDEX IF NOT EXISTS "idx_notifications_user_recent"
  ON "notifications" (user_id, created_at DESC);

-- Recent bookings view for admin dashboard (newest appointments first)
CREATE INDEX IF NOT EXISTS "idx_appointments_created_recent"
  ON "appointments" (created_date DESC);

-- Check for active offers in a date range (offer banner on home screen)
CREATE INDEX IF NOT EXISTS "idx_offers_status_dates"
  ON "offers" (status, start_date, end_date);

-- Check if a specific date is unavailable before generating slots
CREATE INDEX IF NOT EXISTS "idx_unavailable_dates_date"
  ON "unavailable_dates" (date);

-- Booking validation: find a customer's recent appointments quickly
CREATE INDEX IF NOT EXISTS "idx_appointments_customer_recent"
  ON "appointments" (customer_id, created_date DESC);