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

// Admin Console
import { AdminConsole } from "./routes/admin/index";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ─── MARKETING LAYOUT & PAGES ─── */}
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

          {/* Dedicated Marketing Pages */}
          <Route path="/salons" element={<ForSalonsPage />} />
          <Route path="/for-salons" element={<ForSalonsPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/refund" element={<RefundPolicyPage />} />
          <Route path="/partner-terms" element={<PartnerTermsPage />} />

          {/* ─── ERROR ROUTE ─── */}
          <Route path="/error" element={<ErrorPageRoute />} />
          <Route path="/404" element={<ErrorPage code="404" message="We couldn't find the page you were looking for." />} />

          {/* ─── AUTHENTICATION (Split-screen Google & Email OTP) ─── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/salon/login" element={<LoginPage />} />

          {/* ─── CUSTOMER LIVE DISCOVERY & CHAIR QUEUES ─── */}
          <Route path="/live" element={<LiveExplorePage />} />
          <Route path="/explore" element={<LiveExplorePage />} />
          <Route path="/live-queues" element={<LiveExplorePage />} />
          <Route path="/salons/:citySlug/:areaSlug" element={<LiveExplorePage />} />
          <Route path="/salon/:id" element={<SalonDetailPage />} />
          <Route path="/live/salon/:id" element={<SalonDetailPage />} />

          {/* AI Hair Studio */}
          <Route path="/live/aistudio" element={<StudioPage />} />
          <Route path="/live/studio" element={<StudioPage />} />
          <Route path="/ai-studio" element={<StudioPage />} />

          {/* Customer Queue & Tokens */}
          <Route path="/live/queue" element={<QueuePage />} />
          <Route path="/queue/:id" element={<QueuePage />} />
          <Route path="/my-queue" element={<QueuePage />} />
          <Route path="/live/activity" element={<ActivityPage />} />
          <Route path="/my-bookings" element={<ActivityPage />} />
          <Route path="/dashboard" element={<ActivityPage />} />
          <Route path="/live/checkout" element={<CheckoutPage />} />

          {/* Customer Profile & Rewards */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/live/profile" element={<ProfilePage />} />
          <Route path="/points" element={<SneprPointsPage />} />
          <Route path="/my-points" element={<SneprPointsPage />} />
          <Route path="/saved-salons" element={<LiveExplorePage />} />

          {/* Mobile Continuity Redirect */}
          <Route path="/app/*" element={<Navigate to="/live" replace />} />

          {/* ─── PARTNER ONBOARDING & REGISTRATION ─── */}
          <Route path="/partner/register" element={<SalonRegistrationWizard />} />
          <Route path="/register-salon" element={<SalonRegistrationWizard />} />
          <Route path="/partner/claim" element={<ClaimSalonInternalPage />} />
          <Route path="/claim" element={<ClaimSalonInternalPage />} />
          <Route path="/claim-salon" element={<ClaimSalonInternalPage />} />
          <Route path="/partner/application" element={<PartnerApplicationStatusPage />} />

          {/* ─── SALONOS: SALON OWNER DASHBOARD ─── */}
          <Route path="/salon-os" element={<SalonOSPage />} />
          <Route path="/salon-os/*" element={<SalonOSPage />} />
          <Route path="/salon" element={<SalonOSPage />} />
          <Route path="/salon/*" element={<SalonOSPage />} />

          {/* ─── ADMIN DASHBOARD ─── */}
          <Route path="/admin" element={<AdminConsole />} />
          <Route path="/admin/*" element={<AdminConsole />} />

          {/* Fallback 404 with Custom Barber Memory Game */}
          <Route path="*" element={<ErrorPage code="404" message="The page you are looking for does not exist or has been moved." />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}

export default App;
