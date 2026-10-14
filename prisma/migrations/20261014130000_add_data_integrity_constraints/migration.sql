-- ==========================================================
-- Data Integrity Constraints & Performance Indexes
-- Project: SALON-WOW
-- Purpose: Prevent invalid data and speed up common queries
-- Reference: Proposal Section 6.1.2 - Accuracy & Reliability
-- ==========================================================

-- --------------------------------------------------------
-- 1. CHECK CONSTRAINTS (prevent bad data at the DB level)
-- Using DROP IF EXISTS to make this safe to re-run
-- --------------------------------------------------------

-- Service price and duration must be positive
ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_price_positive";
ALTER TABLE "services" ADD CONSTRAINT "services_price_positive" CHECK (price >= 0);

ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_duration_positive";
ALTER TABLE "services" ADD CONSTRAINT "services_duration_positive" CHECK (duration > 0);

-- Offer discount must not be negative
-- (value can be percentage OR fixed amount, so no upper limit)
ALTER TABLE "offers" DROP CONSTRAINT IF EXISTS "offers_discount_non_negative";
ALTER TABLE "offers" ADD CONSTRAINT "offers_discount_non_negative" CHECK (discount >= 0);

-- Time ranges must be valid (end after start)
ALTER TABLE "working_hours" DROP CONSTRAINT IF EXISTS "working_hours_time_valid";
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_time_valid" CHECK (closing_time > opening_time);

ALTER TABLE "breaks" DROP CONSTRAINT IF EXISTS "breaks_time_valid";
ALTER TABLE "breaks" ADD CONSTRAINT "breaks_time_valid" CHECK (end_time > start_time);

ALTER TABLE "time_slots" DROP CONSTRAINT IF EXISTS "time_slots_time_valid";
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_time_valid" CHECK (end_time > start_time);

-- Appointment status must be one of the allowed values (matches current data)
ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "appointments_status_valid";
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_status_valid"
  CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED', 'NO_SHOW'));

-- Loyalty points can never go negative
ALTER TABLE "loyalty" DROP CONSTRAINT IF EXISTS "loyalty_points_non_negative";
ALTER TABLE "loyalty" ADD CONSTRAINT "loyalty_points_non_negative" CHECK (points >= 0);

-- --------------------------------------------------------
-- 2. PERFORMANCE INDEXES
-- --------------------------------------------------------

CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" (email);
CREATE INDEX IF NOT EXISTS "idx_appointments_customer" ON "appointments" (customer_id);
CREATE INDEX IF NOT EXISTS "idx_appointments_stylist" ON "appointments" (stylist_id);
CREATE INDEX IF NOT EXISTS "idx_appointments_date" ON "appointments" (date);
CREATE INDEX IF NOT EXISTS "idx_time_slots_stylist_date" ON "time_slots" (stylist_id, date);
CREATE INDEX IF NOT EXISTS "idx_services_status" ON "services" (status);
CREATE INDEX IF NOT EXISTS "idx_offers_status" ON "offers" (status);
CREATE INDEX IF NOT EXISTS "idx_notifications_user" ON "notifications" (user_id);