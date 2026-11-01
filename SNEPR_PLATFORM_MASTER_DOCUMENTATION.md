# Snepr Platform • Master Architecture, Workflows & System Specifications

> **Version:** 2.4.0-Production  
> **Target Audience:** Technical Architects, AI Agents (Claude / Antigravity), Full-Stack Engineers, Product Managers  
> **Repository:** `https://github.com/xpertzzzz/snepr.git`  
> **Production Domain:** `https://snepr.in`  
> **Deployment Target:** Vercel (Web SPA & Landing) + Android Native Release APK/AAB  

---

## 1. Executive Overview & Brand Context

### 1.1 The Problem
In traditional salons and barbershops, walk-in customers waste 30 to 90 minutes sitting in cramped, unhygienic waiting rooms with zero visibility into chair wait times. Meanwhile, salon owners struggle with unpredictable crowd spikes, lost revenue from frustrated walk-outs, and manual, paper-based queue management.

### 1.2 The Snepr Solution
**Snepr** (`sn≡pr`) is an intelligent salon queue orchestration platform and hairstyle discovery ecosystem. It eliminates the waiting room entirely:
- **For Customers:** Discover nearby salons in real-time, view live chair wait times, join the queue remotely from anywhere, receive live countdown notifications, test virtual haircuts in the AI Hairstyle Studio, and walk straight into the chair when it is their turn.
- **For Salon Owners & Barbers (SalonOS):** A unified digital queue board to manage walk-ins, track barber productivity, toggle break modes, trigger automated SMS/Email alerts, and retain customers with automated loyalty rewards.
- **Target Geography:** Launched initially for **Bhubaneswar, Odisha, India** (flagship clusters in Patia, KIIT Road, Saheed Nagar, Jayadev Vihar, and Chandrasekharpur), architected for rapid multi-city pan-India scale.

### 1.3 Brand Identity & Visual Language
- **Brand Wordmark:** Pure lowercase `sn≡pr` with a distinctive stylized triple horizontal bar `≡` representing live queue layers, hair shears, and digital precision.
- **Color Palette:**
  - **Background Primary:** Warm Latte / Champagne Cream (`#FAF7F2`)
  - **Card Surface:** Pure White (`#FFFFFF`) with subtle warm sand border (`#E8E1D7`)
  - **Text / Ink:** Deep Roasted Espresso (`#1B1410` and `#2C2420`)
  - **Subtext / Muted:** Warm Taupe (`#6E6159`)
  - **Primary Accent:** Rich Amber Gold (`#C8993E`) & Heritage Terracotta (`#7A4B29`)
  - **Status Available:** Forest Green (`#2E7D4F` / `#22C55E`)
  - **Status Busy:** Crimson Red (`#DC2626`)
  - **Status Finishing:** Warm Amber (`#D97706`)
- **Theme Directive:** **Light Mode Only**. Pure, high-end salon editorial look. All harsh dark-mode fills, dark backgrounds, and AI-generated neon gradients are prohibited.

---

## 2. Complete Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                             SNEPR PLATFORM                             │
├──────────────────────────────────┬─────────────────────────────────────┤
│      CUSTOMER WEB & SALON OS     │         NATIVE MOBILE APP           │
│  • React 19 + TypeScript         │  • React Native / Expo              │
│  • Vite 8 (Rolldown Engine)      │  • Capacitor 8 (Android Release)    │
│  • React Router DOM v7           │  • Native Geolocation (GPS)         │
│  • Tailwind CSS v4               │  • Camera API (Hairstyle Preview)   │
│  • Sonner (Toast notifications)  │  • Snepr Light Theme Design System  │
│  • Lucide React Icons            │  • Release Keystore & Signed AAB    │
├──────────────────────────────────┴─────────────────────────────────────┤
│                    BACKEND & MICROSERVICES (Node.js)                   │
│  • Express 5.x REST API Engine                                         │
│  • Brevo SMTP (Email OTP Passwordless Authentication)                  │
│  • Google Auth Library (OAuth2 Verification)                           │
│  • JWT (JSON Web Tokens) with 30-day session caching                   │
│  • Drizzle ORM (Type-safe schema & migration toolkit)                  │
│  • PostgreSQL (Relational persistence layer)                           │
│  • Vercel Deployment Configuration (`vercel.json`)                     │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Web Frontend
- **Framework:** React 19 (`react`, `react-dom`) with TypeScript 5.8.
- **Build Tool:** Vite 8.x with `@vitejs/plugin-react` and `@tailwindcss/vite`.
- **Routing:** `react-router-dom` v7 with zero-dependency native compatibility layer (`src/lib/router-compat.tsx`).
- **State & Data Fetching:** `@tanstack/react-query` lightweight compat layer (`src/lib/query-compat.tsx`) supporting `useQuery`, `useMutation`, and cache invalidation.
- **UI Components & Styling:**
  - Tailwind CSS v4 with custom utility tokens.
  - Radix UI Primitives (`@radix-ui/react-dialog`, `tabs`, `accordion`, `dropdown-menu`, `progress`, etc.).
  - Lucide React for consistent icons.
  - Custom 3D Card Tilt (`src/components/ui/Tilt3D.tsx`) with dynamic spring physics.
  - Scroll Card Reveal (`src/components/ui/ScrollCardReveal.tsx`) with Intersection Observer triggers.
  - Interactive Parallax layers (`src/components/ui/ParallaxLayer.tsx`).

### 2.2 Native Mobile Application
- **Directory:** `/app` (React Native Expo source) and `/android` (Android Studio native wrapper).
- **Core Plugins:**
  - `@capacitor/core` & `@capacitor/android` v8.4.2.
  - `@capacitor/geolocation` v8.2.0 for real-time customer distance computation.
  - `@capacitor/splash-screen` v8.0.2 with zero-delay auto-hide.
- **Icons & Branding:** Full adaptive mipmap icon set (`mipmap-mdpi` through `mipmap-xxxhdpi`) featuring the clean `sn≡pr` brand icon without placeholder letters or borders.
- **Artifacts:**
  - Debug APK: `public/Snepr-release.apk`
  - Signed Release Android App Bundle: `public/Snepr-v1.0.4.aab` (Keystore alias `snepr-release`, RSA 2048-bit).

### 2.3 Backend Microservices
- **API Server:** `src/backend/mobile-api.ts` running Express 5.
- **Email Delivery:** Brevo (formerly Sendinblue) SMTP relay via `nodemailer` for instant 6-digit OTP delivery.
- **Authentication:**
  - Passwordless Email OTP: `Phone -> Name -> Email -> 6-Digit Code -> JWT`.
  - Google OAuth2 Single Sign-On (Token ID verification).
  - Salon Owner / Staff credentials via `bcryptjs` (salt rounds: 12).
- **Database & Persistence:** PostgreSQL with Drizzle ORM (`drizzle-orm`, `drizzle-kit`).

---

## 3. Database Schema & Architecture

The database is built on PostgreSQL with Drizzle ORM. Schemas are defined in `src/backend/db/schema.ts`.

### 3.1 Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ SALONS : owns
    USERS ||--o{ QUEUES : joins
    USERS ||--o{ BOOKINGS : reserves
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ POINTS_LEDGER : earns
    CITIES ||--o{ SALONS : contains
    SALONS ||--o{ SERVICES : offers
    SALONS ||--o{ STAFF : employs
    SALONS ||--o{ QUEUES : serves
    SALONS ||--o{ BOOKINGS : fulfills
    SALONS ||--o{ REVIEWS : receives
    SERVICES ||--o{ QUEUES : specifies
    STAFF ||--o{ QUEUES : assigned_to

    USERS {
        serial id PK
        varchar username UK
        varchar password
        varchar name
        varchar phone
        varchar role "customer | salon_owner | staff | super_admin | sub_admin"
        timestamp suspended_at
        timestamp created_at
    }

    CITIES {
        serial id PK
        varchar name
        varchar state
        boolean is_active
    }

    SALONS {
        serial id PK
        varchar name
        varchar slug UK
        text address
        integer city_id FK
        numeric latitude
        numeric longitude
        integer owner_id FK
        integer active_chairs
        integer queue_capacity
        numeric rating
        integer review_count
        boolean is_verified
        varchar phone
        varchar opening_time
        varchar closing_time
        text image_url
    }

    SERVICES {
        serial id PK
        integer salon_id FK
        varchar name
        varchar category "haircut | beard | styling | spa | facial | combo"
        integer duration_minutes
        numeric price
        integer points_reward
        boolean is_active
    }

    STAFF {
        serial id PK
        integer salon_id FK
        integer user_id FK
        varchar role "master_barber | senior_stylist | junior_stylist"
        integer chair_number
        boolean break_mode
        boolean is_available
    }

    QUEUES {
        serial id PK
        integer salon_id FK
        integer customer_id FK
        integer service_id FK
        integer staff_id FK
        integer token_number
        varchar status "waiting | in_service | completed | cancelled | no_show"
        timestamp estimated_start_time
        timestamp service_started_at
        timestamp completed_at
        integer wait_time_minutes
        timestamp created_at
    }

    POINTS_LEDGER {
        serial id PK
        integer user_id FK
        integer points_delta
        varchar transaction_type "earned_queue | redeemed_discount | signup_bonus"
        text description
        timestamp created_at
    }

    STUDIO_LOOKS {
        serial id PK
        varchar title
        varchar gender "men | women | kids"
        varchar hair_length "short | medium | long"
        varchar category "fade | pompadour | buzz | wolf | crop | layered"
        text description
        text image_url
        text recommended_face_shapes
        integer base_price_est
    }
```

### 3.2 Key Table Specifications

| Table Name | Primary Purpose | Key Fields & Constraints |
| :--- | :--- | :--- |
| `users` | User credentials, roles, profile info | `id`, `username` (email), `role`, `phone`, `name`, `suspended_at` |
| `salons` | Partner salons & walk-in locations | `id`, `name`, `latitude`, `longitude`, `active_chairs`, `is_verified` |
| `services` | Menu items, prices & service durations | `id`, `salon_id`, `name`, `duration_minutes`, `price`, `points_reward` |
| `staff` | Barbers & stylists assigned to chairs | `id`, `salon_id`, `chair_number`, `break_mode`, `is_available` |
| `queues` | Live remote queue tokens & chair states | `id`, `token_number`, `status`, `estimated_start_time`, `created_at` |
| `points_ledger` | Loyalty points history & reward tracking | `id`, `user_id`, `points_delta`, `transaction_type` |
| `studio_looks` | Hairstyle catalog for discovery & AI try-on | `id`, `title`, `gender`, `hair_length`, `recommended_face_shapes` |

---

## 4. End-to-End User Workflows

### 4.1 Customer Remote Queue Journey

```mermaid
sequenceDiagram
    autonumber
    actor Customer as 👤 Customer (App/Web)
    participant Client as 📱 Snepr UI
    participant API as ⚡ Snepr API
    participant Brevo as 📧 Brevo SMTP
    participant DB as 🗄️ PostgreSQL
    actor Barber as 💈 Barber / Salon Owner

    Note over Customer,Client: Step 1: Onboarding & Auth
    Customer->>Client: Enters Phone, Name & Email
    Client->>API: POST /api/auth/send-otp { email }
    API->>Brevo: Send 6-digit OTP email
    Brevo-->>Customer: Delivers verification email
    Customer->>Client: Enters 6-digit OTP
    Client->>API: POST /api/auth/verify-otp { email, code, phone, name }
    API->>DB: Upsert customer record
    API-->>Client: Returns JWT Token & Session

    Note over Customer,Client: Step 2: Discovery & Selection
    Customer->>Client: Opens Home Screen (GPS auto-locates in Bhubaneswar)
    Client->>API: GET /api/salons?lat=20.3533&lng=85.8266
    API->>DB: Query salons + calculate Haversine distance + live wait times
    API-->>Client: Return salons sorted by proximity / shortest wait
    Customer->>Client: Selects Salon & Desired Service (e.g., Fade + Beard Trim)

    Note over Customer,Barber: Step 3: Remote Queue Booking
    Customer->>Client: Taps "Join Live Queue"
    Client->>API: POST /api/queue/join { salonId, serviceId }
    API->>DB: Generate Token #05 (Status: waiting, waitTime: 25 mins)
    API-->>Client: Return live digital ticket details
    Client-->>Customer: Display Digital Pass with live countdown & directions

    Note over Barber,Customer: Step 4: Salon Execution
    Barber->>API: SalonOS: Taps "Call Token #05"
    API->>DB: Update Queue Status -> "in_service"
    API-->>Client: Push notification: "Your chair is ready! Walk in now"
    Customer->>Barber: Walks in, shows Token #05, sits in chair
    Barber->>API: SalonOS: Taps "Complete Service & Bill"
    API->>DB: Update Queue Status -> "completed"
    API->>DB: Award +50 Snepr Points to Customer
    Client-->>Customer: Receipt & Rate Your Barber prompt
```

### 4.2 Salon Owner & Barber Operational Workflow (SalonOS)
1. **Login Portal (`/login`):** Salon owner or barber logs in using their credentials.
2. **Chair Board (`/salon`):**
   - View real-time chairs in layout (e.g., Chair 1: Rohit [Active], Chair 2: Amit [On 15m Break], Chair 3: Deepak [Available]).
   - **Call Next Button:** Instantly advances the digital queue and sends a ready notification to the customer.
   - **Walk-in Entry Button:** Allows reception to enter physical walk-ins (generates a printed or SMS digital token so they sync into the live countdown).
   - **Break Mode Toggle:** Tap break icon to pause chair assignment. The system automatically recalculates wait times for downstream customers.
   - **Daily Stats Ribbon:** Live tracker showing total served today, average chair turnaround time, and projected daily revenue.

---

## 5. UI/UX Screen Design Specifications

### 5.1 Website (`/`)
- **Header / Navbar:**
  - Expanded 82px height (`h-20`).
  - Transparent pure `sn≡pr` wordmark logo (`clamp(48px, 5.5vw, 62px)`).
  - Clean light cream glassmorphism (`rgba(250, 247, 242, 0.85)`).
  - Navigation links: **Salons**, **AI Studio**, **Pricing**, **For Salons (Claim)**.
  - Action buttons: "Open Web App" and "SalonOS Login".
- **Hero Section:**
  - Headline: "Never wait in line at a salon again."
  - Bhubaneswar active badge: `Live Salons Active in Bhubaneswar (Patia & Saheed Nagar)`.
  - 3D interactive simulator displaying an interactive phone mockup with live queue animations.
- **Scroll Card Reveal & Parallax:**
  - Feature cards animate into view with smooth vertical transforms (`translateY(0) opacity(1)`).
  - Subtle floating ambient warm orbs responding to scroll velocity.
- **AI Studio Showcase:**
  - Interactive hairstyle carousel with filters for **Men**, **Women**, and **Kids**.
  - Side-by-side virtual preview simulation with hair length and face shape guidance.
- **Bhubaneswar Live Salons Directory:**
  - Dynamic cards showing real salons (e.g. *Toni&Guy Patia*, *Habibs Saheed Nagar*, *Looks Salon KIIT Square*).
  - Status dots: Green (Available), Amber (Finishing Up), Red (Busy).
- **Pricing Section:**
  - **Free for Customers:** ₹0 forever (unlimited remote queues, loyalty points, AI studio preview).
  - **Salon Starter:** ₹999/month (up to 3 chairs, live queue board, SMS alerts).
  - **Salon Pro:** ₹2,499/month (unlimited chairs, multi-barber sync, AI hairstyle matching, analytics).
- **Footer:** Full site index, support email (`support@snepr.in`), terms, privacy policy, and Play Store download CTA.

### 5.2 Mobile Application (Native & Web App)
- **Design Aesthetic:** Light cream `#FAF7F2` canvas, pure white card containers, warm charcoal text `#1B1410`, golden amber `#C8993E` accents.
- **Top Location Header:**
  - Exact GPS location badge (`📍 Patia, Bhubaneswar`).
  - Snepr points coin icon showing accumulated points (`🪙 150 pts`).
- **Live Search & Category Dock:**
  - Instant search input with filter chips: `All`, `Haircut`, `Beard Trim`, `Styling`, `Spa`.
- **Active Token Banner (Sticky):**
  - Appears whenever a customer has a live token.
  - Displays: Token number (`#04`), chair number, remaining wait time, and a one-tap "Directions" button.
- **Salon Cards:**
  - High-res salon storefront image.
  - Verified badge with star rating (`4.8 ★ (120+ reviews)`).
  - Live distance badge calculated via Haversine GPS formula (`1.2 km away`).
  - One-tap "Join Queue" button with live estimated wait time (`15 mins`).
- **Curved Bottom Navigation Dock:**
  - Floating pill dock with rounded corners.
  - 4 core tabs:
    1. **Explore:** Live nearby salon feed.
    2. **AI Studio:** Hairstyle discovery & camera try-on.
    3. **My Queue:** Active token and booking history.
    4. **SalonOS:** Switch to owner/barber management mode.

---

## 6. API Reference

All endpoints accept and return `application/json`. Authenticated routes require an `Authorization: Bearer <JWT>` header.

### 6.1 Authentication Endpoints

#### `POST /api/auth/send-otp`
Sends a 6-digit verification code to the customer's email via Brevo SMTP.
```json
// Request
{
  "email": "customer@gmail.com"
}

// Response (200 OK)
{
  "success": true,
  "message": "Verification code sent to customer@gmail.com"
}
```

#### `POST /api/auth/verify-otp`
Verifies the 6-digit code and creates or logs in the customer.
```json
// Request
{
  "phone": "+919876543210",
  "name": "Ankit Kumar",
  "email": "customer@gmail.com",
  "code": "482910"
}

// Response (200 OK)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 14,
    "username": "customer@gmail.com",
    "name": "Ankit Kumar",
    "phone": "+919876543210",
    "role": "customer"
  }
}
```

#### `POST /api/auth/login`
Staff and Salon Owner login using username/password.
```json
// Request
{
  "username": "snepr@2026",
  "password": "your_secure_password"
}

// Response (200 OK)
{
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": 1,
    "username": "snepr@2026",
    "role": "super_admin"
  }
}
```

### 6.2 Salon & Queue Endpoints

#### `GET /api/salons`
Fetches all active salons with real-time queue status, distance, and wait times.
- **Query Params:** `lat` (float), `lng` (float), `radius` (km, default 50), `sort` (`distance` | `wait` | `rating`).
```json
// Response (200 OK)
[
  {
    "id": 1,
    "name": "Toni&Guy Essentials",
    "slug": "toni-and-guy-patia",
    "address": "KIIT Road, Patia, Bhubaneswar",
    "latitude": 20.3533,
    "longitude": 85.8266,
    "rating": "4.9",
    "reviewCount": 84,
    "queueStatus": "available",
    "waitTime": 0,
    "waitingCount": 0,
    "distanceKm": 0.8,
    "formattedDistance": "800 m away",
    "isVerified": true
  }
]
```

#### `POST /api/queue/join`
Adds a customer to the live queue.
```json
// Request
{
  "salonId": 1,
  "serviceId": 3,
  "staffId": null
}

// Response (200 OK)
{
  "success": true,
  "queueId": 42,
  "tokenNumber": 4,
  "estimatedWaitMinutes": 15,
  "status": "waiting"
}
```

#### `POST /api/queue/status`
Updates queue status (SalonOS only).
```json
// Request
{
  "queueId": 42,
  "status": "in_service" // "waiting" | "in_service" | "completed" | "cancelled" | "no_show"
}

// Response (200 OK)
{
  "success": true,
  "queueId": 42,
  "newStatus": "in_service"
}
```

---

## 7. Deployment & Environment Setup

### 7.1 Vercel Deployment Configuration (`vercel.json`)
The web application is structured as a standard single-page application (SPA) outputting to `/dist`:
```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 7.2 Environment Variables (`.env`)
```env
# Database Connection (Neon / Supabase / AWS RDS)
DATABASE_URL="postgres://username:password@hostname:5432/snepr_prod?sslmode=require"

# JWT Authentication
JWT_SECRET="snepr_jwt_secret_key_production_2026"

# Brevo SMTP Configuration (Email OTP)
BREVO_SMTP_HOST="smtp-relay.brevo.com"
BREVO_SMTP_PORT=587
BREVO_SMTP_USER="your_brevo_smtp_login@smtp-brevo.com"
BREVO_SMTP_KEY="your_brevo_master_api_smtp_key"
BREVO_FROM_EMAIL="verify@snepr.in"
BREVO_FROM_NAME="Snepr Verification"

# Google OAuth2 (Optional for SSO)
GOOGLE_CLIENT_ID="your_google_oauth_client_id.apps.googleusercontent.com"
```

### 7.3 Android Native Build Commands
To compile and build a new native release APK or AAB:
```bash
# 1. Build Vite frontend web assets
npm run build

# 2. Sync web build into Capacitor Android project
npx cap sync android

# 3. Assemble Release APK
cd android
./gradlew assembleRelease

# 4. Assemble Play Store App Bundle (.aab)
./gradlew bundleRelease
```

---

## 8. Handoff Notes for Claude

When delegating future frontend or backend enhancements to Claude:
1. **Always maintain the light theme:** Do not inject dark mode backgrounds (`#0F172A`, `#18181B`, etc.) into user-facing customer screens. Use `#FAF7F2` for backgrounds, `#FFFFFF` for cards, and `#1B1410` for high-contrast typography.
2. **Logo integrity:** Never surround the `sn≡pr` logo with rounded borders, heavy borders, or boxed card backgrounds. The logo is a pure wordmark.
3. **Routing conventions:** The project runs on standard `react-router-dom` v7 via `@tanstack/react-router` zero-dependency shims in `src/lib/router-compat.tsx`. Do not re-install `@tanstack/react-start` or Nitro plugins.
4. **Database interactions:** Any backend endpoint updates should be added directly to `src/backend/mobile-api.ts` and use type-safe queries from `src/backend/db/schema.ts`.
