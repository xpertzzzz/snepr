# SNEPR Platform — Technical Decisions & Architecture Standards

**Version:** 3.0.0-Production  
**Status:** Approved Architectural Blueprint  
**Target Environment:** Vercel (Next.js Web) + Railway (NestJS API & Worker) + Supabase (PostgreSQL & Auth) + Upstash/Managed Redis  

---

## 1. Monorepo Architecture: pnpm Workspaces & Turborepo

### Decision
Structure the repository as a clean monorepo managed with **pnpm workspaces** and orchestrated by **Turborepo**:
```
snepr/
├── apps/
│   ├── web/        # Next.js 15+ frontend (public, customer, salon, staff, admin)
│   ├── api/        # NestJS 11+ REST API & Socket.IO realtime server
│   └── worker/     # Node.js + BullMQ background task processor
├── packages/
│   ├── database/   # Prisma schema, client, migrations, PostGIS helpers
│   ├── shared-types/# Universal TypeScript interfaces, enums, DTOs
│   ├── validation/ # Zod schemas shared between frontend and backend
│   ├── ui/         # Reusable brand design tokens, icons, and components
│   └── config/     # Shared ESLint, Prettier, and TypeScript configs
├── infrastructure/
│   ├── docker/     # Dockerfiles & docker-compose.yml for local dev
│   └── scripts/    # Database seeding, deployment hooks
├── docs/           # Architecture specs, audit reports, runbooks
└── pnpm-workspace.yaml
```

### Rationale
- Decouples client presentation from server-only native modules (`prisma`, `nodemailer`, `ioredis`, `bullmq`), eliminating Vite browser polyfill issues permanently.
- Shares TypeScript types, Zod schemas, and validation contracts between frontend forms and NestJS DTOs without code duplication.
- Allows independent horizontal scaling: Next.js on Vercel edge/serverless, NestJS API on persistent Node.js servers (Railway), and workers scaling based on queue depth.

---

## 2. Authentication & Authorization: Supabase Auth + Membership RBAC

### Decision
Adopt **Supabase Auth** for identity management, combined with **backend JWT signature verification** and **membership-based RBAC**.

```
                ┌───────────────────────────────┐
                │         Supabase Auth         │
                │  (Email OTP, Google OAuth)    │
                └──────────────┬────────────────┘
                               │ JWT Access Token
                               ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                     NestJS Backend Guard                    │
 │ 1. Verify Supabase JWT (issuer, audience, signature)         │
 │ 2. Extract Supabase user UUID                               │
 │ 3. Load user memberships from `salon_members` table          │
 └─────────────────────────────┬───────────────────────────────┘
                               │ Context: { user, memberships }
                               ▼
        ┌──────────────────────┴──────────────────────┐
        │                                             │
        ▼                                             ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│       CUSTOMER Role          │       │      SALON_MEMBER Role       │
│ • Own profile & tokens       │       │ • Salon-scoped operations    │
│ • Joined queue telemetry     │       │ • OWNER / STAFF permissions  │
└──────────────────────────────┘       └──────────────────────────────┘
```

### User Roles & Membership Rules
1. **Never trust frontend roles:** Frontend-stored roles in `localStorage` or JWT claims are treated solely as UI hints. NestJS enforces authorization on every protected route.
2. **Multi-Membership Paradigm:** A single user account (`users.id`) can be:
   - A customer booking at any salon.
   - An owner of Salon A.
   - A staff barber at Salon B.
   - An administrator.
3. **Database Entities:**
   - `users`: Core profile (`id` UUID, `email`, `phone`, `name`, `is_active`, `created_at`).
   - `salon_members`: Association table (`user_id`, `salon_id`, `role` [OWNER | STAFF | MANAGER], `status` [ACTIVE | INVITED | SUSPENDED]).
   - `salon_claims`: Ownership claim requests pending admin KYC approval.
   - `staff_invites`: Cryptographically hashed invitation tokens with expiry.

---

## 3. Database Architecture: PostgreSQL + Prisma ORM + PostGIS

### Decision
Consolidate the existing 25 Drizzle tables into a unified **Prisma schema** targeting Supabase PostgreSQL with the **PostGIS extension** enabled.

### Key Schema Entities
- `users`: Universal identity linked to Supabase Auth.
- `salons`: Physical salon entity with `geography(Point, 4326)` coordinates, verification status, and operating hours.
- `branches`: Multi-chair branch locations for Pro plan tiers.
- `salon_members`: User-to-salon role mapping.
- `chairs`: Real-time chair telemetry (`AVAILABLE`, `OCCUPIED`, `FINISHING`, `BREAK`, `OFFLINE`).
- `services`: Salon menu with pricing (in paise / ₹) and duration estimates.
- `queue_entries`: Active and historical queue tickets with unique token sequence.
- `queue_events`: Immutable audit trail for all queue transitions (`WAITING` → `CALLED` → `SERVING` → `COMPLETED` / `CANCELLED` / `NO_SHOW`).
- `subscriptions`: Razorpay SaaS subscription records (Base ₹199, Intermediate ₹400, Pro ₹449).
- `payments`: Transaction ledger with webhook verification status.
- `reviews`: Verified customer feedback and ratings.
- `points_transactions`: Loyalty points ledger.
- `support_tickets`: Customer and partner dispute tickets.

### Spatial Query Standard
Salon location searches will execute PostGIS parameterized queries:
```sql
SELECT id, name, address, ST_Distance(
  location, 
  ST_SetSRID(ST_MakePoint($user_lng, $user_lat), 4326)::geography
) / 1000 AS distance_km
FROM salons
WHERE verification_status = 'VERIFIED'
  AND ST_DWithin(location, ST_SetSRID(ST_MakePoint($user_lng, $user_lat), 4326)::geography, $radius_meters)
ORDER BY distance_km ASC;
```

---

## 4. Realtime Queue Engine: Atomic Transitions + Socket.IO

### Decision
1. **PostgreSQL as Source of Truth:** Never store queue state purely in Redis or memory. All token assignments and chair transitions occur inside database transactions:
   ```typescript
   await prisma.$transaction(async (tx) => {
     // Lock salon row or queue sequence
     // Compute next sequential token
     // Insert queue_entry & queue_event
   });
   ```
2. **Socket.IO Broadcast Rooms:**
   - Room `salon:{salonId}`: Broadcasts chair changes, queue countdowns, and walk-in arrivals to salon staff and connected customer apps.
   - Room `user:{userId}`: Delivers private "Your chair is ready!" push telemetry.

---

## 5. Payments & Subscriptions: 0% Commission Flat SaaS (Razorpay)

### Decision
- **Strict 0% Haircut Commission:** Customer haircut and grooming services are paid directly at the salon counter. Snepr never takes a percentage cut.
- **Razorpay Subscriptions for Salons:**
  - **Base Plan (₹199 / month):** 1 stylist chair, countdown queue, counter QR standee, customer alerts.
  - **Intermediate Plan (₹400 / month):** Up to 3 chairs, multi-barber routing, SMS/WhatsApp arrival alerts, wait duration analytics.
  - **Pro Plan (₹449 / month):** Unlimited chairs & barbers, full AI Hairstyle Studio integration, advanced chair turnover metrics, priority WhatsApp support.
- **Webhook Security:** NestJS verifies `x-razorpay-signature` using HMAC SHA256 before updating subscription status. Webhook events are processed idempotently using unique event IDs.

---

## 6. AI Hairstyle Studio: Isolated Module + Cloudflare R2

### Decision
- Keep AI Studio completely decoupled as a self-contained NestJS module (`apps/api/src/ai-studio/`).
- Style inspiration catalogue served from optimized vector thumbnails.
- Customer reference photos uploaded directly to **Cloudflare R2** via pre-signed S3-compatible URLs (credentials never touch frontend).
- External AI generative API calls run asynchronously via BullMQ background jobs with timeout and failure fallbacks.

