# SNEPR Platform — Architecture Audit & Technical Assessment

**Audit Date:** November 2026  
**Auditor:** Principal Software Architect & Full-Stack Security Engineer  
**Repository:** `https://github.com/xpertzzzz/snepr.git`  
**Production Domain:** `https://snepr.in`  
**Target City:** Bhubaneswar, Odisha, India  

---

## 1. Executive Summary

Snepr (`sn≡pr`) is an intelligent salon chair queue orchestration platform, digital waitlist, and hairstyle discovery ecosystem tailored for India's salon industry, launching initially in Bhubaneswar, Odisha.

This comprehensive architectural audit evaluates the current codebase against the production target:
- A standardized **modular monolith monorepo** (`apps/web`, `apps/api`, `apps/worker`, `packages/*`).
- **Next.js frontend** preserving the exact editorial brand aesthetics (Ivory `#FAF7F2`, Espresso `#1B1410`, Cognac Brown `#8C4D27`, Manrope & DM Sans typography).
- **NestJS backend API** with modular architecture, Swagger/OpenAPI docs, Socket.IO realtime server, and Supabase JWT authentication guards.
- **Supabase-managed PostgreSQL** with PostGIS geospatial indexes, Prisma ORM, and membership-based RBAC (`salon_members`).
- **Redis & BullMQ** for background tasks, rate limiting, and notification dispatch.
- **Production integrations** for Razorpay (0% haircut commission SaaS subscriptions: ₹199, ₹400, ₹449), MapLibre GL JS, Cloudflare R2 object storage, and Brevo/Resend email OTPs.

---

## 2. Directory Structure & Current Inventory

```
snepr/
├── android/                         # Capacitor Android native project
├── app/                             # React Native / Expo application (separate codebase)
│   ├── app/                         # Expo Router screens (tabs: index, queue, studio, profile)
│   ├── components/                  # Mobile-specific React Native UI components
│   ├── index.android.bundle         # Compiled Android bundle (4.2 MB)
│   └── test-bundle.js               # Development bundle dump
├── drizzle/                         # Drizzle ORM migrations & SQL dump
│   ├── 0000_neat_starfox.sql
│   └── snepr_final_production_schema.sql
├── public/                          # Static assets, logos, PWA manifests, 404.html
│   ├── 404.html                     # Custom 404 with interactive memory game
│   └── snepr-logo.png               # Crisp vector/transparent logo assets
├── src/                             # Core Web Application (SPA via Vite)
│   ├── backend/
│   │   ├── db/                      # Drizzle schema (25 tables) & seed scripts
│   │   │   ├── schema.ts            # Drizzle table definitions
│   │   │   └── seed-real.ts         # 13 verified Bhubaneswar salon leads
│   │   ├── functions/               # TanStack Start server functions (auth, queues, salons, admin)
│   │   ├── email.ts                 # Brevo SMTP mailer implementation
│   │   ├── mobile-api.ts            # Express server (OTP, Google Auth, mock endpoints)
│   │   ├── otp.ts                   # 6-digit OTP generation and verification
│   │   └── salon-os.ts              # Wait time estimation & walk-in business logic
│   ├── components/
│   │   ├── layout/                  # Navbar, Footer, DockNavbar
│   │   ├── salon/                   # SalonOSWorkspace (overview, queue, chairs, staff)
│   │   ├── ui/                      # shadcn/ui Radix primitives
│   │   └── SneprWordmark.tsx        # Vector wordmark component
│   ├── config/                      # Firebase config (client-side Google OAuth)
│   ├── lib/
│   │   ├── buffer-shim.ts           # Browser-safe Buffer polyfill
│   │   ├── db-shim.ts               # Browser shim for Drizzle DB
│   │   ├── query-compat.tsx         # TanStack Query compatibility wrapper
│   │   ├── real-salons.ts           # Curated dataset of 13 Bhubaneswar salons
│   │   ├── router-compat.tsx        # React Router DOM v7 wrapper for createFileRoute
│   │   └── start-compat.ts          # Server function shim for browser SPA
│   ├── routes/                      # Route modules (Marketing, Live, Partner, SalonOS, Admin)
│   │   ├── _marketing/              # Landing (/), Pricing, About, Contact, FAQ, Legal
│   │   ├── live/                    # Discovery (/live), Salon Details, Queue Token, Studio
│   │   ├── partner/                 # Salon registration wizard & claim flows
│   │   ├── salon-os/                # SalonOS workspace container
│   │   ├── admin/                   # Admin console (salon approval, user management)
│   │   └── login.tsx                # Split-screen Google OAuth & Email OTP signin
│   ├── styles/
│   │   ├── live-page.css            # Live discovery layout & cards styling
│   │   └── snepr-final.css          # Global editorial CSS with scissor animations
│   ├── App.tsx                      # React Router DOM route registry
│   ├── main.tsx                     # React 19 root bootstrap
│   └── styles.css                   # Global Tailwind CSS v4 entrypoint
├── index.html                       # HTML shell with Buffer polyfill & Google Fonts
├── vite.config.ts                   # Vite 8 config with browser alias shims
└── package.json                     # Monolithic dependencies (Capacitor + Express + Drizzle + React 19)
```

---

## 3. Component & Subsystem Audit

### 3.1 Frontend Web Application
- **Framework:** React 19 + Vite 8. React Router DOM v7 is mapped via `@tanstack/react-router` alias in `src/lib/router-compat.tsx`.
- **UI Design System:**
  - Preserves the bespoke editorial palette: Warm Cream (`#F7F3ED`), Card Paper (`#FFFDFA`), Espresso Ink (`#211914`), Terracotta Brown (`#8C4D27`), Warm Gold (`#C8993E`), and Line Border (`#E9DFD5`).
  - Typography: Fraunces / Playfair Display (editorial headings), Manrope (functional headings), DM Sans (body copy).
  - Custom SVG interactive scissor cut animations along dashed seams.
- **Route Experiences:**
  1. **Customer Public:** Landing page, Pricing (3 flat SaaS tiers: ₹199, ₹400, ₹449 with economics calculator), About, Contact, FAQ, Help Center, Points loyalty page, Legal (Terms, Privacy, Partner Terms, Refund Policy, Delete Account).
  2. **Customer Live App:** `/live` (locality filtering across Patia, KIIT Road, Chandrasekharpur, Jaydev Vihar, Saheed Nagar, Nayapalli, Rasulgarh, Khandagiri), `/salon/:id` (live chair telemetry, queue join modal), `/live/queue` (live countdown ticket), `/live/studio` (AI hairstyle catalogue), `/profile` (loyalty points & session).
  3. **SalonOS (Salon Workspace):** Comprehensive desk managing chairs (Station 1, Station 2, etc.), walk-in customer ticketing, dynamic wait estimation, staff break toggle, and daily operational summaries.
  4. **Admin Dashboard:** Central console for verifying salon registration applications, approving KYC, managing city localities, and inspecting user accounts.
- **Architectural Issues Identified:**
  - The client bundle was previously importing server libraries (`drizzle-orm`, `postgres`, `nodemailer`), necessitating artificial shims (`db-shim.ts`, `postgres-shim.ts`, `empty-shim.ts`).
  - State persistence for salon applications and active tickets currently defaults to browser `localStorage` (`snepr_admin_applications`, `snepr_session`, `snepr_active_queue`) when server calls fail.
  - No unified SSR/SSG strategy (Vite SPA instead of target Next.js framework).

### 3.2 Backend Services & APIs
- **Current Implementation:** Dual fragmented backends:
  1. An Express server in `src/backend/mobile-api.ts` providing email OTP and Google OAuth endpoints.
  2. TanStack Start server functions in `src/backend/functions/` (`auth.ts`, `queues.ts`, `salons.ts`, `admin.ts`, `otp.ts`, `points.ts`, `reviews.ts`, `studio.ts`).
- **Architectural Issues Identified:**
  - Server functions fail silently in the browser client and return mock data or write to `localStorage`.
  - No Swagger / OpenAPI documentation.
  - No NestJS modular architecture.
  - No Socket.IO server running for push telemetry (frontend relies on 5s–10s polling).
  - No Redis cache or BullMQ background workers.

### 3.3 Database & Data Modeling
- **ORM:** Drizzle ORM configured with `postgres` client against Neon / Supabase PostgreSQL.
- **Schema Entities (25 Tables):**
  - Location hierarchy: `cities`, `areas`.
  - Users & salons: `users`, `salons`, `staff`, `chairs`, `branches`, `salonSettings`, `calendarExceptions`.
  - Queue operations: `queues`, `queueEvents`, `bookings`, `services`.
  - Business & loyalty: `settlements`, `coupons`, `notifications`, `reviews`, `sneprPointsLedger`, `salonMedia`, `waitlist`, `emailLogs`, `inventory`, `attendance`, `payroll`, `subscriptions`, `invoices`, `marketingCampaigns`, `emailOtps`.
- **Architectural Issues Identified:**
  - **Single Role Anti-Pattern:** Roles are stored as a single `users.role` enum (`super_admin`, `sub_admin`, `salon_owner`, `staff`, `customer`). A user who is both a customer and a salon owner cannot be represented cleanly without duplicating user records or switching roles.
  - **Missing Membership Model:** Needs `salon_members` table (`user_id`, `salon_id`, `role`, `membership_status`) to support multi-salon ownership and staff invitations.
  - **Missing PostGIS:** Salon locations use `latitude` and `longitude` decimal columns without PostGIS `geography(Point, 4326)` columns or spatial GiST indexes.
  - **Inconsistent Primary Keys:** Schema uses integer serial IDs while modern Supabase Auth uses UUIDs (`auth.users.id`).

### 3.4 Authentication & Authorization
- **Current Flow:**
  - Client-side Firebase Google Auth (`signInWithPopup`).
  - Server-side Brevo SMTP 6-digit OTP verification (`/api/auth/send-otp`, `/api/auth/verify-otp`).
  - JWT creation using `jsonwebtoken` with 30-day expiry.
  - Client stores session JSON in `localStorage.getItem("snepr_session")`.
- **Security Vulnerabilities Identified:**
  - Client-side role trust: Protected UI tabs inspect `session.role` from `localStorage` which can be modified in browser devtools.
  - Lack of server-side JWT verification guards on sensitive operations.
  - Direct password hashing in custom table instead of delegating identity management to Supabase Auth.

### 3.5 Realtime, Queues & Background Workers
- **Current Flow:** No WebSocket or SSE server. Frontend polling intervals (`refetchInterval: 5000` / `10000`).
- **Gaps:** Absence of BullMQ for handling asynchronous emails, push notifications, queue expiration checks, and daily analytics rollups.

### 3.6 Payments & Subscriptions
- **Current Flow:** Pricing tiers modeled in UI and schema (`subscriptions`, `invoices`), but Razorpay order creation, signature verification, and webhook handling are not yet wired to live payment gateways.

### 3.7 Maps & Geolocation
- **Current Flow:** Static Haversine formula calculation in `src/lib/distance.ts` using hardcoded salon coordinates from `src/lib/real-salons.ts`.
- **Gaps:** MapLibre GL JS vector maps are not integrated into `/live` discovery.

---

## 4. Retain, Refactor, Remove, and Add Matrix

| Category | Item | Action | Justification |
| :--- | :--- | :--- | :--- |
| **UI / Styling** | `snepr-final.css`, `live-page.css`, Scissor animations | **RETAIN & PORT** | Bespoke design system, fonts, colors, and layout requested by user. Must be preserved exactly. |
| **UI Components** | `SalonOSWorkspace`, `AdminConsole`, `RegisterWizard`, `LivePageStrict` | **REFACTOR** | Retain complete UX, visual styling, and forms; replace `localStorage` state with typed TanStack Query hooks hitting NestJS API. |
| **Database Schema** | 25 Drizzle tables in `src/backend/db/schema.ts` | **REFACTOR -> PRISMA** | Consolidate into standardized Prisma schema with PostGIS, membership-based authorization (`salon_members`), and UUID user mapping. |
| **Backend Logic** | Wait time algorithm (`salon-os.ts`), OTP verification, Seed data | **REFACTOR -> NESTJS** | Port into NestJS modules (`queue`, `auth`, `salons`, `memberships`). |
| **Root HTML Dumps** | `carrybird_website.html`, `app-customer ui.html`, `app-owner-snepros ui.html`, etc. | **MOVE TO ARCHIVE** | Keep in `docs/archive/` or reference folders without cluttering root. |
| **Client Shims** | `src/lib/db-shim.ts`, `postgres-shim.ts`, `empty-shim.ts`, `start-compat.ts` | **REMOVE** | Rendered obsolete once backend logic runs exclusively in NestJS API. |
| **Architecture** | Monolithic mixed repo | **REFACTOR -> MONOREPO** | Reorganize into `apps/web` (Next.js), `apps/api` (NestJS), `apps/worker` (BullMQ), and `packages/*`. |
| **Auth** | Custom bcrypt/Firebase mix | **REFACTOR -> SUPABASE AUTH** | Standardize identity with Supabase Auth + NestJS JWT verification guard + membership RBAC. |
| **Realtime** | 5s HTTP polling | **ADD -> SOCKET.IO** | Bi-directional WebSocket rooms per salon for instant queue updates. |
| **Payments** | Hardcoded checkout | **ADD -> RAZORPAY MODULE** | Server-side Razorpay order creation, signature verification, and webhook idempotency. |
| **Maps** | Haversine helper | **ADD -> MAPLIBRE + POSTGIS** | Interactive vector map and PostGIS `ST_DWithin` spatial queries. |

---

## 5. Potential Breaking Changes & Migration Risks

1. **Session & Auth Transition:** Existing local storage sessions (`snepr_session`) must be migrated smoothly to Supabase Auth tokens without logging out active users abruptly.
2. **Database Primary Keys:** Transitioning `users.id` from `serial` integer to Supabase `UUID` requires careful foreign key mapping on `salons`, `staff`, `queues`, and `bookings`.
3. **Route Continuity:** All public URLs (`/`, `/pricing`, `/about`, `/live`, `/salon/:id`, `/live/queue`, `/partner/register`, `/salon-os`, `/admin`) must maintain exact paths and SEO metadata.
4. **Mobile App Decoupling:** The Expo React Native application in `app/` and Capacitor setup must target the new centralized NestJS API endpoints (`/api/v1/*`).

