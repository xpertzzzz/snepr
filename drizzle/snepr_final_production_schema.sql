-- ==============================================================================
-- SNEPR SALONTECH PLATFORM — FINAL PRODUCTION DATABASE SCHEMA (POSTGRESQL)
-- Reference: SNEPR Complete Product, AI Studio & Subscription Strategy Report
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. CITIES (Operational Footprint) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "cities" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 2. USERS (Roles: super_admin, sub_admin, salon_owner, staff, customer) ───
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'customer', -- super_admin | sub_admin | salon_owner | staff | customer
    "city_id" INTEGER REFERENCES "cities"("id") ON DELETE SET NULL,
    "salon_id" INTEGER,
    "parent_id" INTEGER,
    "suspended_at" TIMESTAMP,
    "suspend_reason" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 3. SALONS (Core Partner Profiles) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "salons" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city_id" INTEGER REFERENCES "cities"("id") ON DELETE SET NULL,
    "phone" TEXT,
    "email" TEXT,
    "category" TEXT, -- Unisex, Men's Grooming, Beauty Parlour, Luxury
    "rating" TEXT DEFAULT '4.8',
    "review_count" INTEGER DEFAULT 0,
    "owner_id" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
    "approval_status" TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected | suspended
    "approved_by_id" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
    "approved_at" TIMESTAMP,
    "rejection_reason" TEXT,
    "kyc_verified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'closed', -- open | closed
    "opening_hours" JSONB,
    "location" TEXT,
    "amenities" JSONB,
    "latitude" DECIMAL(10, 7),
    "longitude" DECIMAL(10, 7),
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add deferred foreign key for user's salon_id
ALTER TABLE "users" 
    DROP CONSTRAINT IF EXISTS "fk_users_salon_id",
    ADD CONSTRAINT "fk_users_salon_id" FOREIGN KEY ("salon_id") REFERENCES "salons"("id") ON DELETE SET NULL;

-- ─── 4. STAFF & BARBERS (Pillar 2: Public Barber Reputation) ──────────────────
CREATE TABLE IF NOT EXISTS "staff" (
    "id" SERIAL PRIMARY KEY,
    "salon_id" INTEGER NOT NULL REFERENCES "salons"("id") ON DELETE CASCADE,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "role" TEXT NOT NULL DEFAULT 'barber', -- manager | barber
    "specialty" TEXT, -- e.g. "Fade, Texture Crop & Beard Sculpt"
    "rating" TEXT DEFAULT '4.8',
    "review_count" INTEGER DEFAULT 0,
    "working_hours" JSONB,
    "break_mode" BOOLEAN NOT NULL DEFAULT false,
    "leave_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 5. SERVICES (Menu & Pricing) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "services" (
    "id" SERIAL PRIMARY KEY,
    "salon_id" INTEGER NOT NULL REFERENCES "salons"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL, -- in paise (e.g., 25000 = ₹250)
    "duration_mins" INTEGER NOT NULL DEFAULT 30,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "discount_percent" INTEGER DEFAULT 0
);

-- ─── 6. QUEUES (Pillar 1: Trustworthy Live Queue Engine) ──────────────────────
CREATE TABLE IF NOT EXISTS "queues" (
    "id" SERIAL PRIMARY KEY,
    "salon_id" INTEGER NOT NULL REFERENCES "salons"("id") ON DELETE CASCADE,
    "customer_id" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
    "service_id" INTEGER REFERENCES "services"("id") ON DELETE SET NULL,
    "staff_id" INTEGER REFERENCES "staff"("id") ON DELETE SET NULL,
    "token_number" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting', -- waiting | in-progress | completed | cancelled | skipped
    "estimated_wait_mins" INTEGER DEFAULT 15,
    "called_at" TIMESTAMP,
    "completed_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 7. REVIEWS (Pillar 2: Verified Visit Reviews & Anti-Bribery) ─────────────
CREATE TABLE IF NOT EXISTS "reviews" (
    "id" SERIAL PRIMARY KEY,
    "salon_id" INTEGER NOT NULL REFERENCES "salons"("id") ON DELETE CASCADE,
    "customer_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "staff_id" INTEGER REFERENCES "staff"("id") ON DELETE SET NULL,
    "booking_id" INTEGER,
    "rating" INTEGER NOT NULL, -- 1 to 5 stars
    "comment" TEXT,
    "owner_reply" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT true, -- strictly verified by completed queue visit
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 8. SNEPR POINTS LEDGER (Strategy Report Section 10) ──────────────────────
-- Strict Platform Rules:
-- +5 Points on Completed Salon Service (Token marked Done)
-- +10 Points on Verified Review (Same reward for 1 to 5 stars to prevent bribery)
CREATE TABLE IF NOT EXISTS "snepr_points_ledger" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "salon_id" INTEGER REFERENCES "salons"("id") ON DELETE SET NULL,
    "queue_id" INTEGER REFERENCES "queues"("id") ON DELETE SET NULL,
    "review_id" INTEGER REFERENCES "reviews"("id") ON DELETE SET NULL,
    "points" INTEGER NOT NULL, -- positive for credits (+5, +10), negative for redemptions (-50)
    "event_type" TEXT NOT NULL, -- completed_service | verified_review | redemption | reversal
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 9. SUBSCRIPTIONS (SaaS Tier Engine: ₹199 / ₹400 / ₹449) ──────────────────
CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" SERIAL PRIMARY KEY,
    "salon_id" INTEGER NOT NULL REFERENCES "salons"("id") ON DELETE CASCADE,
    "plan_tier" TEXT NOT NULL DEFAULT 'base', -- base (₹199) | intermediate (₹400) | pro (₹449)
    "status" TEXT NOT NULL DEFAULT 'active', -- active | trial | cancelled | past_due
    "billing_cycle" TEXT NOT NULL DEFAULT 'monthly',
    "price" INTEGER NOT NULL DEFAULT 19900, -- paise (19900, 40000, 44900)
    "ai_quota_remaining" INTEGER NOT NULL DEFAULT 50,
    "next_billing_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 10. INVOICES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "invoices" (
    "id" SERIAL PRIMARY KEY,
    "salon_id" INTEGER NOT NULL REFERENCES "salons"("id") ON DELETE CASCADE,
    "invoice_number" TEXT NOT NULL UNIQUE,
    "amount" INTEGER NOT NULL, -- paise
    "pdf_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'paid', -- paid | pending | failed
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 11. SALON SETTINGS (Dynamic Wait Time & Operations) ──────────────────────
CREATE TABLE IF NOT EXISTS "salon_settings" (
    "id" SERIAL PRIMARY KEY,
    "salon_id" INTEGER NOT NULL UNIQUE REFERENCES "salons"("id") ON DELETE CASCADE,
    "auto_assign_staff" BOOLEAN NOT NULL DEFAULT true,
    "default_wait_time_buffer" INTEGER NOT NULL DEFAULT 5, -- minutes
    "max_queue_length" INTEGER NOT NULL DEFAULT 30,
    "cancellation_fee_percent" INTEGER NOT NULL DEFAULT 0,
    "allow_walkins" BOOLEAN NOT NULL DEFAULT true,
    "notify_proximity_mins" INTEGER NOT NULL DEFAULT 10,
    "is_queue_paused" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 12. MULTI-BRANCH (Pro Tier Capability) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS "branches" (
    "id" SERIAL PRIMARY KEY,
    "parent_salon_id" INTEGER NOT NULL REFERENCES "salons"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "city_id" INTEGER REFERENCES "cities"("id") ON DELETE SET NULL,
    "address" TEXT,
    "phone" TEXT,
    "revenue" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 13. MARKETING & RETENTION CAMPAIGNS (Intermediate / Pro) ─────────────────
CREATE TABLE IF NOT EXISTS "marketing_campaigns" (
    "id" SERIAL PRIMARY KEY,
    "salon_id" INTEGER NOT NULL REFERENCES "salons"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL, -- sms | whatsapp | push | referral | loyalty
    "audience" TEXT NOT NULL DEFAULT 'all',
    "content" TEXT NOT NULL,
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "conversion_rate" TEXT NOT NULL DEFAULT '0%',
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 14. COUPONS & REWARDS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "coupons" (
    "id" SERIAL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "discount_type" TEXT NOT NULL, -- flat | percent
    "value" INTEGER NOT NULL,
    "min_order_value" INTEGER DEFAULT 0,
    "max_uses" INTEGER,
    "used_count" INTEGER DEFAULT 0,
    "city_id" INTEGER REFERENCES "cities"("id") ON DELETE SET NULL,
    "created_by_id" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
    "expires_at" TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 15. EMAIL OTP & VERIFICATION ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "email_otps" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 16. WAITLIST ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "waitlist" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- HIGH-PERFORMANCE INDEXES (Sub-millisecond Queue Polling & Discovery)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS "idx_queues_salon_status" ON "queues" ("salon_id", "status");
CREATE INDEX IF NOT EXISTS "idx_queues_customer" ON "queues" ("customer_id");
CREATE INDEX IF NOT EXISTS "idx_reviews_salon" ON "reviews" ("salon_id", "is_flagged");
CREATE INDEX IF NOT EXISTS "idx_reviews_staff" ON "reviews" ("staff_id");
CREATE INDEX IF NOT EXISTS "idx_points_user" ON "snepr_points_ledger" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_salons_city_status" ON "salons" ("city_id", "status", "approval_status");
CREATE INDEX IF NOT EXISTS "idx_services_salon" ON "services" ("salon_id", "is_active");

