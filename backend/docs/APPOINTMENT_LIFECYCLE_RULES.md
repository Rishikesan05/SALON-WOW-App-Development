# WOW Salon - Appointment Lifecycle & Backend Business Rules

This document specifies the core backend service rules implemented in the NestJS backend for WOW Salon. These rules govern appointment scheduling, concurrency, loyalty points, pricing integrity, stylist assignment, and background tasks.

---

## 1. Cancellation & Rescheduling Rules
- **Minimum Notice Window**: Appointments can only be cancelled or rescheduled if `appointment.time - now() >= salon_settings.reschedule_min_minutes` (default: 60 minutes).
- **Rescheduled Status & Audit**: A rescheduled booking returns to `PENDING` status, sets `rescheduled_from_id` pointing to the original appointment ID, and captures audit details (`cancelled_at`, `cancellation_reason`).

## 2. Dynamic Stylist Auto-Assignment (`stylist_type = 'ANY'`)
When a customer selects `stylist_type = 'ANY'`, the server dynamically picks an eligible stylist matching all of the following conditions:
1. **Status**: Stylist is `Active`.
2. **Gender Alignment**: Stylist gender matches the customer/service gender criteria.
3. **Service Capability**: Stylist is linked to **ALL** selected services via `stylist_services`.
4. **Working Hours**: The target time window falls entirely within the stylist's (or salon-wide) `working_hours`.
5. **No Conflicts**: Stylist is not scheduled for a `break`, on an `unavailable_date`, or having an overlapping booking.

## 3. Server-Side Pricing & Duration Authority
- **Zero-Trust Client Pricing**: The server strictly re-calculates total duration, unit prices, and offer discounts on the backend.
- Prices are derived from `services.price` and `offers.discount` / `offers.discount_type`.
- Client-submitted totals or unit prices are never persisted directly without verification.

## 4. Pending Booking Slot Hold & Release
- A booking created with `PENDING` status holds the selected time slot.
- If not approved within `salon_settings.pending_hold_minutes` (default: 30 minutes), or upon explicit rejection/cancellation, the slot hold is released immediately.

## 5. Loyalty Points Transaction Integrity
- WOW points are awarded **only** when an appointment transitions to `COMPLETED` status.
- Calculation uses `salon_settings.points_per_100_lkr` (default: 10 points per 100 LKR spent).
- Handled inside a single atomic database transaction:
  1. Increment `loyalty.points` for the customer.
  2. Create a `loyalty_transactions` record (`type = 'EARNED'`, `points = +N`, `appointment_id = ...`).
- Enforced by `@unique([appointment_id, type])` to prevent duplicate rewards.

## 6. Stylist-Specific Availability Architecture
- Slot availability is strictly computed per stylist (`stylist_id`).
- A `time_slot` or time window must never be marked as globally booked across the salon when other qualified stylists remain available.

## 7. Automated Cleanup of AI Hairstyle Recommendations
- Daily scheduled cron job deletes expired records from `hairstyle_recommendations` where `expires_at <= now()`.
- Cleans up associated stored image files referenced by `image_path` from storage.

## 8. Event-Driven Notification Triggers
Notifications (`notifications` table) are automatically dispatched for the following appointment lifecycle events:
- **Submit**: Customer creates a new booking request.
- **Approve**: Admin or stylist confirms the appointment.
- **Reject**: Admin or stylist rejects the pending booking.
- **Cancel**: Appointment is cancelled by customer or admin.
- **Reschedule**: Booking is rescheduled to a new time slot.
- **Points Earned**: Loyalty points are awarded upon appointment completion.
