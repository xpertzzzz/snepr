# SNEPR Platform — Refactoring Progress Tracker

**Repository:** `https://github.com/xpertzzzz/snepr.git`  
**Target Architecture:** Monorepo (Next.js/Vite Web + NestJS API + BullMQ Worker + Prisma/Supabase PostgreSQL + Redis)  

---

## Progress Overview

| Phase | Description | Status | Completion |
| :--- | :--- | :---: | :---: |
| **Phase 1** | Codebase Audit & Technical Specifications | **COMPLETED** | 100% |
| **Phase 2** | Monorepo Workspace Foundation & Shared Packages | **COMPLETED** | 100% |
| **Phase 3** | Database Architecture (Prisma, PostGIS, Memberships) | **COMPLETED** | 100% |
| **Phase 4** | NestJS Core API & Business Modules | **COMPLETED** | 100% |
| **Phase 5** | Frontend Experiences, Layout Separation & 3 UI Specs | **COMPLETED** | 100% |
| **Phase 6** | Realtime Socket.IO Gateway & BullMQ Workers | **COMPLETED** | 100% |
| **Phase 7** | External Integrations (Razorpay, MapLibre, Cloudflare R2) | **COMPLETED** | 100% |
| **Phase 8** | Testing, Verification & Production Deployment | **COMPLETED** | 100% |

---

## Detailed Task Checklist

### Phase 1: Codebase Audit & Technical Specifications
- [x] Full repository inspection (dependencies, schema, routes, components).
- [x] Create `docs/ARCHITECTURE_AUDIT.md`.
- [x] Create `docs/TECHNICAL_DECISIONS.md`.
- [x] Create `docs/REFACTORING_PLAN.md`.
- [x] Create `docs/REFACTORING_PROGRESS.md`.

### Phase 2: Monorepo Foundation & Shared Packages
- [x] Initialize `pnpm-workspace.yaml` and `turbo.json`.
- [x] Setup `packages/shared-types` (universal DTOs, enums, interfaces, compiled dist).
- [x] Setup `packages/validation` (Zod schemas for auth, salons, queues, claims, staff invites).
- [x] Setup `packages/config` (shared TypeScript configs: `tsconfig.base.json`, `tsconfig.node.json`).
- [x] Setup `docker-compose.yml` for local PostgreSQL 16 (PostGIS enabled) + Redis 7.

### Phase 3: Database & PostGIS Architecture
- [x] Initialize `packages/database` with Prisma ORM (`schema.prisma`).
- [x] Consolidate schema with PostGIS geography columns, spatial indexes, and relational integrity.
- [x] Implement `salon_members` table and multi-role salon RBAC model.
- [x] Port seed script with 13 verified Bhubaneswar salon leads, demo accounts, and coordinates.

### Phase 4: NestJS Core API
- [x] Initialize NestJS application in `apps/api` with Swagger at `/api/docs`.
- [x] Configure global validation pipe, logging interceptor, and exception filters.
- [x] Configure Swagger / OpenAPI documentation.
- [x] Implement `AuthModule` (Supabase JWT verification guard & demo credentials).
- [x] Implement `MembershipsModule` (Salon-scoped RBAC & staff invitations).
- [x] Implement `SalonsModule` (Discovery, PostGIS queries, registrations, claims).
- [x] Implement `ChairsModule` (Real-time chair statuses & telemetry).
- [x] Implement `QueueModule` (Transactional tokens, `queue_events` audit trail, call next, complete).
- [x] Implement `SubscriptionsModule` (₹199, ₹400, ₹449 flat SaaS plans).
- [x] Implement `AdminModule` (KYC approvals, salon verification, metrics).

### Phase 5: Frontend Experiences, Layout Separation & 3 UI Specs
- [x] Structure application with clear separation: customer (`/live`), salon owner (`/salon-os`), staff (`/staff`), admin (`/admin`).
- [x] Preserve exact editorial brand system (Cream `#F7F3ED`, Paper `#FFFDF9`, Ink `#211912`, Brown `#70472F`, Gold `#C69A5C`, scissor cut animations).
- [x] Customer Experience (`app-customer ui.html`):
  - Area switcher chips for Bhubaneswar localities (Patia, KIIT Road, Saheed Nagar, etc.)
  - 5-stage live queue progress indicator (Ticket Confirmed, In Queue, Head to Salon, In Chair, Completed)
  - Interactive GPS route map card with ETA & turn-by-turn prompt
  - `LiquidBottomNav` physics-based draggable navigation
- [x] SalonOS Owner Experience (`app-owner-snepros ui.html`):
  - Exactly 4 navigation tabs: `Overview`, `Staff`, `Analytics`, `Profile & Support`
  - Zero Appointments tab; zero floating help centre bubble
  - 4 Stat cards, live chair grid with status dots (busy, free, off), live queue table
  - Staff management grid with invite modal
  - Analytics charts: daily customers served bar chart, peak hour bars, top services breakdown
  - 3 Flat SaaS tiers (₹199, ₹400, ₹449) and integrated Help Centre support ticket form
- [x] Staff Desk Experience (`app-staff ui .html`):
  - Exactly 4 navigation tabs/actions: `My Queue`, `Scan`, `Walk in`, `Profile`
  - Zero QR generator for staff (scanner only)
  - Now Serving hero card with dark brown gradient and action buttons
  - QR ticket scanner modal with code verification
  - Counter walk-in customer intake form
- [x] 1-Click Demo Accounts Bar on `/login` for all 4 roles.

### Phase 6: Realtime & Background Workers
- [x] Implement Socket.IO gateway (`apps/api/src/realtime/queue.gateway.ts`) broadcasting `queue:token_joined`, `queue:token_called`, `chair:status_changed`.
- [x] Setup `apps/worker` with BullMQ and Redis connection.
- [x] Implement asynchronous notification processor for SMS, WhatsApp, and email alerts.

### Phase 7: External Integrations
- [x] Implement Razorpay order creation and HMAC webhook verification (`apps/api/src/integrations/razorpay.service.ts`).
- [x] Implement MapLibre GL JS / Leaflet vector GPS maps for salon discovery & routing.
- [x] Implement Cloudflare R2 pre-signed image upload integration (`apps/api/src/integrations/r2-storage.service.ts`).

### Phase 8: Testing & Production Deployment
- [x] Run production build (`npm run build`) with 0 errors.
- [x] Configure GitHub Actions CI/CD workflow (`.github/workflows/ci.yml`).
- [x] Author comprehensive production operations and deployment manual (`docs/DEPLOYMENT_GUIDE.md`).
