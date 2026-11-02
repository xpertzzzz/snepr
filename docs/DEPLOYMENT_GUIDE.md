# SNEPR Production Deployment & Operations Manual

This document details the production deployment, infrastructure architecture, environment variables, and verification procedures for the Snepr platform.

---

## 1. Monorepo Architecture Overview

```
snepr/
├── apps/
│   ├── api/            # NestJS Modular Monolith API (Swagger at /api/docs)
│   └── worker/         # BullMQ Background Workers (Redis)
├── packages/
│   ├── config/         # Shared TypeScript base configs
│   ├── database/       # Prisma ORM schema (PostGIS geography + spatial indexes)
│   ├── shared-types/   # Universal TypeScript DTOs, Enums, Models
│   └── validation/     # Universal Zod schemas
└── src/                # Vite + React + TanStack Router Web Application
```

---

## 2. Infrastructure & Cloud Providers

1. **Web Frontend:** Vercel (Edge CDN, Automated deployments on `main`)
2. **API & Realtime Gateway:** Railway / AWS ECS / Render (Node.js 20 with WebSockets support)
3. **Primary Database:** Neon Serverless PostgreSQL with PostGIS extension
4. **Background Queue & Cache:** Upstash Redis / AWS ElastiCache
5. **Authentication:** Supabase Auth + Brevo / Resend OTP Email Gateway + Google OAuth
6. **Object Storage:** Cloudflare R2 / AWS S3 for customer hairstyle uploads and salon media
7. **Payments:** Razorpay Payment Gateway (SaaS Flat subscriptions with HMAC webhook signature verification)

---

## 3. Environment Variables Reference

### Core Web & Shared Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
VITE_API_URL=https://api.snepr.in
```

### Core API (`apps/api`)
```env
PORT=4000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@neon.tech/snepr?sslmode=require
REDIS_URL=rediss://default:token@upstash.io:6379
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=snepr-media
```

---

## 4. Database Setup & Seeding

1. Apply migrations:
```bash
npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma
```

2. Seed initial 13 verified Bhubaneswar salon leads and demo accounts:
```bash
npx ts-node packages/database/src/seed.ts
```

---

## 5. 1-Click Demo Accounts

All 4 roles are configured for testing and validation on `/login`:
- **Customer:** `customer@snepr.demo` (Auto-routes to `/live`)
- **Salon Owner:** `owner@snepr.demo` (Auto-routes to `/salon-os`)
- **Barber Staff:** `staff@snepr.demo` (Auto-routes to `/staff`)
- **Super Administrator:** `admin@snepr.demo` (Auto-routes to `/admin`)
- **Universal Demo Password:** `SneprDemo@2026`
