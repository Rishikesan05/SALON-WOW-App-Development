-- ==============================================================================
-- Data-Safe Backfill: Appointment Services & Timing Migration
-- ==============================================================================
-- To be executed safely AFTER the schema migration has applied the new tables.
-- 1. Populates appointment_services from legacy appointments.service_id
-- 2. Calculates and populates appointments.end_time and total_price
-- ==============================================================================

-- 1. Create one appointment_services row per existing appointment from its service_id
INSERT INTO "appointment_services" (
  "appointment_id",
  "service_id",
  "service_name",
  "duration_mins",
  "unit_price"
)
SELECT 
  a.appointment_id,
  s.service_id,
  s.service_name,
  s.duration AS duration_mins,
  s.price AS unit_price
FROM "appointments" a
JOIN "services" s ON a.service_id = s.service_id
WHERE NOT EXISTS (
  SELECT 1 FROM "appointment_services" aps 
  WHERE aps.appointment_id = a.appointment_id 
    AND aps.service_id = a.service_id
);

-- 2. Set appointments.end_time = time + service duration, and total_price = service price
UPDATE "appointments" a
SET 
  end_time = a."time" + (s.duration || ' minutes')::interval,
  total_price = s.price
FROM "services" s
WHERE a.service_id = s.service_id
  AND (a.end_time IS NULL OR a.total_price IS NULL);
