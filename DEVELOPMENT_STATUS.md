# Snepr — Complete Development Status & Implementation Tracker

> **Document Version:** 1.1.0-Production-Ready  
> **Last Updated:** 06 November 2026  
> **Target Release:** Bhubaneswar Pilot (Patia–KIIT–Infocity Micro-Cluster)  
> **Master Strategy Reference:** `SNEPR_Master_Company_Product_Operations_and_Execution_Report.pdf` (November 2026)  
> **Production Target:** `https://snepr.in` | Vercel SPA + Android Release APK/AAB  

---

## 1. Executive Technical Audit Summary

A full audit and synchronization of the Snepr codebase, database, queue engine, and client dashboards was completed on 6 November 2026.

### 1.1 Architecture & Technology Stack
- **Frontend Framework:** React 19 (`react` 19.2.0, `react-dom` 19.2.0) with TypeScript 5.8.
- **Routing Engine:** `react-router-dom` v7 with TanStack compatibility shims (`src/lib/router-compat.tsx`).
- **Styling & Design System:** Tailwind CSS v4, Lucide React icons, Sonner toast notifications, custom 3D card tilt & parallax.
- **Primary Database:** PostgreSQL hosted on Supabase (`https://becpnekqqkgjopjzemtt.supabase.co`).
- **Server-Authoritative Queue Engine:** Deployed PL/pgSQL stored procedures (`public.join_queue_atomic`, `public.advance_queue_atomic`, `public.complete_queue_atomic`, `public.cancel_queue_atomic`, `public.get_customer_token_details`).
- **Data Access:** High-performance direct REST and RPC via PostgREST (`src/lib/supabase.ts` and `src/lib/queue-client.ts`), ensuring zero latency and 100% server-authoritative synchronization between customers, salon owners, and staff desks.
- **Backend Services:** Express 5.x server in `src/backend/mobile-api.ts` with Brevo SMTP email delivery.

---

## 2. Comprehensive Feature Status Matrix

| Module | Feature / Capability | Master Report Reference | Current Status | Notes & Blockers |
| :--- | :--- | :--- | :--- | :--- |
| **Brand & Design** | Rounded wordmark with 3-bar bronze E (`#2B1A0F`, `#B56A2C`) | Sec 2, 4 | **Completed and tested** | Visual identity strictly enforced. Light mode only. |
| **Brand & Design** | Scissor cut scroll animation | Sec 2, 21 | **Completed and tested** | Smooth SVG clipPath and physics preserved in `src/routes/_marketing/index.tsx`. |
| **Authentication** | Supabase RPC Password Login | Sec 3.1, 6.1 | **Completed and tested** | Direct RPC `authenticate_user` tested with Super Admin, Salon Owner, Staff, and Customer. |
| **Authentication** | Role-based Dashboard Redirection | Sec 6.1 | **Completed and tested** | Admin $\to$ `/ankom`, Owner $\to$ `/salonos/dashboard`, Staff $\to$ `/staff/dashboard`, Customer $\to$ `/dashboard`. |
| **Authentication** | Credentials Protection | Sec 6.1 | **Completed and tested** | Public credentials test cards completely removed from production UI. |
| **Authentication** | Email OTP passwordless login | Sec 2.3, 6.1 | **Implemented and tested** | Brevo SMTP credentials configured; fallback session generator active. |
| **Authentication** | Google OAuth SSO | Sec 2.3, 6.1 | **Partially implemented** | Firebase popup handler wired; Google Client ID required for native Android. |
| **Public Website** | Homepage Hero & Value Messaging | Sec 3, 5.1 | **Completed and tested** | "Never wait in line at a salon again" + "Know before you go." |
| **Public Website** | Dedicated Pricing Page (`/pricing`) | Sec 11, 17 | **Completed and tested** | Entry ₹199, Intermediate ₹400, Pro ₹449 with interactive ROI calculator. |
| **Public Website** | Bhubaneswar Salon Discovery (`/explore`, `/live`) | Sec 5.1, 16 | **Completed and tested** | 16 verified salons across Patia, Saheed Nagar, Jayadev Vihar, Chandrasekharpur. |
| **Public Website** | Contact & Enquiry Form (`/contact`) | Sec 5.1 | **Completed and tested** | Validates inputs, sends toast notifications. |
| **Public Website** | Legal & Policy Pages (`/terms`, `/privacy`, `/refund-policy`) | Sec 5.1, 23 | **Completed and tested** | Clear terms matching actual data collection practices. |
| **Queue Engine** | Atomic Backend Token Creation | Sec 7, 8 | **Completed and tested** | Deployed `join_queue_atomic` generates sequential tokens (#101, #102...) per salon per day. |
| **Queue Engine** | Duplicate Active Queue Prevention | Sec 7, 8 | **Completed and tested** | Prevents multiple waiting tokens for same customer at same salon; returns active token. |
| **Queue Engine** | Queue Lifecycle Transitions (`waiting` $\to$ `called` $\to$ `in_service` $\to$ `completed`) | Sec 7, 8 | **Completed and tested** | Managed via `advance_queue_atomic` and `complete_queue_atomic`. |
| **Queue Engine** | Cancellation & No-Show Handling | Sec 7, 12A | **Completed and tested** | Atomic `cancel_queue_atomic` updates audit ledger and frees assigned chair. |
| **Queue Engine** | Stale Queue Detection & Timestamp Display | Sec 7A, 12A | **Completed and tested** | Automatically flags stale queues if inactive >15 mins; calculates live ETA. |
| **Queue Engine** | Real-time Customer $\leftrightarrow$ Salon Sync | Sec 8, 13 | **Completed and tested** | Customer `/queue/:token`, SalonOS `/salonos/dashboard`, and `/staff` all query the exact same Supabase database. |
| **Customer App** | Live Salon Exploration (`/explore`) | Sec 5.1, 14 | **Completed and tested** | Locality filter, search, chair availability badges, sort by wait/rating. |
| **Customer App** | Salon Detail Page (`/salon/:id`) | Sec 5.2, 8 | **Completed and tested** | Service menu, chair status, barber profiles, verified reviews. |
| **Customer App** | Digital Queue Pass (`/queue/:token`) | Sec 5.2, 7A | **Completed and tested** | Real-time 5-stage progress journey, GPS directions to salon, cancel queue capability. |
| **Customer App** | Customer Dashboard (`/dashboard`) | Sec 5.2 | **Completed and tested** | Live queue status, visit history, loyalty points query, review submission. |
| **Customer App** | AI Hairstyle Studio (`/ai-studio`) | Sec 9 | **Completed and tested** | Curated Men's, Women's, Kids' style catalogue with aesthetic & maintenance filters. |
| **Customer App** | Hairstyle to Salon Matcher | Sec 9 | **Completed and tested** | "Find Salons for This Look" connects style directly to Bhubaneswar salons. |
| **Customer App** | Responsible AI Sandbox | Sec 9, 13, 23 | **Completed and tested** | Explicit consent checkbox, temporary memory disclosure, monthly attempt tracker (3 for Intermediate). |
| **Salon Dashboard** | SalonOS Desk Overview (`/salonos/dashboard`) | Sec 6 | **Completed and tested** | Live chair status, synchronized server queue list, Call Next, Walk-in modal. |
| **Salon Dashboard** | Station & Chair Management (`/salonos/chairs`) | Sec 6 | **Completed and tested** | Stations 1–4, barber assignment, break mode toggle. |
| **Salon Dashboard** | Service Management (`/salonos/services`) | Sec 6, 8 | **Completed and tested** | Create, edit prices, durations, activate/deactivate services. |
| **Salon Dashboard** | Staff Management (`/salonos/staff`) | Sec 6 | **Completed and tested** | Barber profiles, station assignment, duty toggle, customer counts. |
| **Staff Desk** | Barber Mobile Desk (`/staff/dashboard`) | Sec 6 | **Completed and tested** | Synchronized with Supabase queues: Call Next, Complete Service, Walk-in entry. |
| **Admin Console** | Super Admin Management (`/ankom`) | Sec 7 | **Completed and tested** | Verifies admin authorization, applications review, salon suspension, locality management. |
| **Subscriptions** | Plan Entitlement Matrix (Entry, Intermediate, Pro) | Sec 11, 11A | **Completed and tested** | Enforces Entry (no customer ETA), Intermediate (live ETA, 3 AI attempts), Pro (unlimited AI). |
| **Reviews & Points** | Verified Review Submission | Sec 10 | **Completed and tested** | Review modal writes directly to Supabase `reviews` table and awards +15 points. |
| **Reviews & Points** | Snepr Points Ledger (`/points`, `/dashboard`) | Sec 10 | **Completed and tested** | Real-time points balance read directly from `snepr_points_ledger`. |
| **Mobile App (PWA & Android)** | Capacitor 8 Native Android Wrapper | Sec 2.2, 5.2 | **Completed and tested** | `capacitor.config.ts` configured for `dist` with `androidScheme: 'https'`; assets synchronized. |
| **Mobile App (PWA & Android)** | Geolocation & Distance Calculation | Sec 5.2, 14 | **Completed and tested** | Haversine formula using `@capacitor/geolocation` with web fallback to compute live distance. |
| **Mobile App (PWA & Android)** | Sticky Active Queue Banner | Sec 5.2 | **Completed and tested** | Displays active token code, wait time, position, and one-tap pass launcher at top of feed. |
| **Mobile App (PWA & Android)** | Floating Bottom Dock Navigation | Sec 5.2 | **Completed and tested** | `DockNavbar` with Live, AI Studio, animated center Pass FAB, Points, and SalonOS tabs. |
| **Mobile App (PWA & Android)** | PWA Manifests & Standalone Mode | Sec 2.2, 5.2 | **Completed and tested** | Updated `site.webmanifest` and `manifest.webmanifest` with `#FAF7F2` brand styling. |

---

## 3. Deployment & Verification Log

- **PL/pgSQL Deployment:** All 5 atomic stored procedures deployed and granted to `anon, authenticated, service_role`.
- **Flow Verification:** Verified complete customer-to-salon lifecycle:
  1. Customer join queue remote $\to$ Token `#108` issued.
  2. Duplicate attempt $\to$ Correctly returned `already_active: true`.
  3. SalonOS Desk $\to$ Called to Station 2, updated queue status to `called`.
  4. Customer Mobile Pass $\to$ Synced in real-time to Stage 3 (`called`), Chair 02.
  5. SalonOS / Staff Desk $\to$ Completed service, freed Chair 2, credited user loyalty points.
- **Mobile App Synchronization:**
  - `webDir` in `capacitor.config.ts` aligned to `dist`.
  - Added Capacitor CLI scripts (`cap:sync`, `cap:build`, `cap:open`).
  - Ran `npx cap sync android` — web assets, plugins, and configs synced cleanly into `android/app/src/main/assets/public`.
- **Production Build:** `npm run build` completed cleanly in 716ms with zero errors.
