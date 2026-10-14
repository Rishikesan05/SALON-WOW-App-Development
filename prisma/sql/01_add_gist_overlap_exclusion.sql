-- ==============================================================================
-- Custom SQL Migration: Add Overlapping Appointment Exclusion Constraint
-- ==============================================================================
-- Enables btree_gist extension and enforces that no stylist can have overlapping
-- appointment time intervals while status is PENDING or CONFIRMED.
-- ==============================================================================

-- 1. Enable btree_gist extension for PostgreSQL (needed for combining scalar int and tsrange)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Drop existing constraint if it exists (idempotent)
ALTER TABLE "appointments" 
DROP CONSTRAINT IF EXISTS "no_overlapping_stylist_appointments";

-- 3. Add EXCLUDE USING gist constraint on appointments
ALTER TABLE "appointments"
ADD CONSTRAINT "no_overlapping_stylist_appointments"
EXCLUDE USING gist (
  stylist_id WITH =,
  tsrange("time", end_time) WITH &&
)
WHERE (status IN ('PENDING', 'CONFIRMED', 'Pending', 'Confirmed') AND end_time IS NOT NULL);
