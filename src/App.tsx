import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import { Route as MarketingLayout } from "./routes/_marketing";

// Marketing & Public Routes
import { Route as LandingPage } from "./routes/_marketing/index";
import { Route as PricingPage } from "./routes/_marketing/pricing";
import { Route as AboutPage } from "./routes/_marketing/about";
import { Route as FaqPage } from "./routes/_marketing/faq";
import { Route as ContactPage } from "./routes/_marketing/contact";
import { Route as PrivacyPage } from "./routes/_marketing/privacy";
import { Route as PrivacyPolicyPage } from "./routes/_marketing/privacy-policy";
import { Route as TermsPage } from "./routes/_marketing/terms-of-service";
import { Route as DeleteAccountPage } from "./routes/_marketing/delete-account";
import { HowItWorksPage } from "./routes/how-it-works";
import { SalonOSProductPage } from "./routes/salonos";
import { ForSalonsPage } from "./routes/salons";
import { HelpCenterPage } from "./routes/help";
import { RefundPolicyPage } from "./routes/refund-policy";
import { PartnerTermsPage } from "./routes/partner-terms";

// Error Pages
import { ErrorPageRoute } from "./routes/error";
import { ErrorPage } from "./components/ErrorPage";

// Live Customer Discovery & App Routes
import { Route as LiveExplorePage } from "./routes/live/index";
import { Route as StudioPage } from "./routes/live/studio";
import { Route as QueuePage } from "./routes/live/queue";
import { CustomerDashboardPage } from "./routes/dashboard";
import { Route as ActivityPage } from "./routes/live/activity";
import { Route as CheckoutPage } from "./routes/live/checkout";
import { Route as ProfilePage } from "./routes/live/profile";
import { Route as SalonDetailPage } from "./routes/live/salon.$id";
import { SneprPointsPage } from "./routes/points";

// Partner Onboarding & Workflows
import { SalonRegistrationWizard } from "./routes/partner/register";
import { ClaimSalonInternalPage } from "./routes/partner/claim";
import { PartnerApplicationStatusPage } from "./routes/partner/application";

// SalonOS Dashboard & Auth
import { Route as LoginPage } from "./routes/login";
import { SalonOSPage } from "./routes/salon-os/index";
import { StaffDeskPage } from "./routes/staff/index";

// Admin Console (Private /ankom/)
import { AdminConsole } from "./routes/ankom/index";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ─── 1. MARKETING LAYOUT & PUBLIC ROUTES ─── */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/terms-of-service" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />
          </Route>

          {/* Dedicated Public Routes */}
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/salonos" element={<SalonOSProductPage />} />
          <Route path="/salons" element={<ForSalonsPage />} />
          <Route path="/for-salons" element={<ForSalonsPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/refund" element={<RefundPolicyPage />} />
          <Route path="/partner-terms" element={<PartnerTermsPage />} />

          {/* ─── 2. SINGLE AUTHENTICATION FOR ALL ROLES ─── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/salon/login" element={<LoginPage />} />

          {/* ─── 3. PUBLIC DISCOVERY & LIVE QUEUES ─── */}
          <Route path="/explore" element={<LiveExplorePage />} />
          <Route path="/live" element={<LiveExplorePage />} />
          <Route path="/live-queues" element={<LiveExplorePage />} />
          <Route path="/salons/:citySlug/:areaSlug" element={<LiveExplorePage />} />

          {/* Dynamic Salon Profile (By Slug or ID) */}
          <Route path="/salon/:slug" element={<SalonDetailPage />} />
          <Route path="/salon/:id" element={<SalonDetailPage />} />
          <Route path="/live/salon/:id" element={<SalonDetailPage />} />

          {/* AI Hair Studio */}
          <Route path="/ai-studio" element={<StudioPage />} />
          <Route path="/live/aistudio" element={<StudioPage />} />
          <Route path="/live/studio" element={<StudioPage />} />

          {/* Persistent Customer Queue Tracking (By Token or ID) */}
          <Route path="/queue/:token" element={<QueuePage />} />
          <Route path="/queue/:id" element={<QueuePage />} />
          <Route path="/live/queue" element={<QueuePage />} />
          <Route path="/my-queue" element={<QueuePage />} />

          {/* ─── 4. CUSTOMER DASHBOARD & REWARDS ─── */}
          <Route path="/dashboard" element={<CustomerDashboardPage />} />
          <Route path="/live/activity" element={<ActivityPage />} />
          <Route path="/my-bookings" element={<CustomerDashboardPage />} />
          <Route path="/live/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/live/profile" element={<ProfilePage />} />
          <Route path="/points" element={<SneprPointsPage />} />
          <Route path="/my-points" element={<SneprPointsPage />} />
          <Route path="/saved-salons" element={<CustomerDashboardPage />} />

          {/* Mobile Continuity Redirect */}
          <Route path="/app" element={<Navigate to="/live" replace />} />
          <Route path="/app/*" element={<Navigate to="/live" replace />} />

          {/* ─── 5. PARTNER REGISTRATION & ONBOARDING ─── */}
          <Route path="/register-salon" element={<SalonRegistrationWizard />} />
          <Route path="/partner/register" element={<SalonRegistrationWizard />} />
          <Route path="/partner/claim" element={<ClaimSalonInternalPage />} />
          <Route path="/claim" element={<ClaimSalonInternalPage />} />
          <Route path="/claim-salon" element={<ClaimSalonInternalPage />} />
          <Route path="/partner/application" element={<PartnerApplicationStatusPage />} />

          {/* ─── 6. SALONOS OWNER ROUTES ─── */}
          <Route path="/salonos/dashboard" element={<SalonOSPage initialTab="overview" />} />
          <Route path="/salonos/queue" element={<SalonOSPage initialTab="queue" />} />
          <Route path="/salonos/chairs" element={<SalonOSPage initialTab="chairs" />} />
          <Route path="/salonos/services" element={<SalonOSPage initialTab="services" />} />
          <Route path="/salonos/customers" element={<SalonOSPage initialTab="customers" />} />
          <Route path="/salonos/analytics" element={<SalonOSPage initialTab="analytics" />} />
          <Route path="/salonos/settings" element={<SalonOSPage initialTab="settings" />} />
          <Route path="/salon-os" element={<SalonOSPage />} />
          <Route path="/salon-os/*" element={<SalonOSPage />} />
          <Route path="/salon/dashboard" element={<SalonOSPage initialTab="overview" />} />
          <Route path="/salon/queue" element={<SalonOSPage initialTab="queue" />} />

          {/* ─── 7. STAFF DASHBOARD ─── */}
          <Route path="/staff/dashboard" element={<StaffDeskPage />} />
          <Route path="/staff" element={<StaffDeskPage />} />
          <Route path="/staff/*" element={<StaffDeskPage />} />

          {/* ─── 8. PRIVATE ADMIN DASHBOARD (/ankom/) ─── */}
          <Route path="/ankom" element={<AdminConsole />} />
          <Route path="/ankom/*" element={<AdminConsole />} />

          {/* ─── 9. ERROR & 404 ROUTES ─── */}
          <Route path="/error" element={<ErrorPageRoute />} />
          <Route path="/404" element={<ErrorPage code="404" message="We couldn't find the page you were looking for." />} />
          <Route path="*" element={<ErrorPage code="404" message="The page you are looking for does not exist or has been moved." />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}

export default App;
