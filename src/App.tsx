import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import { Route as MarketingLayout } from "./routes/_marketing";

// Marketing routes
import { Route as LandingPage } from "./routes/_marketing/index";
import { Route as PricingPage } from "./routes/_marketing/pricing";
import { Route as AboutPage } from "./routes/_marketing/about";
import { Route as FaqPage } from "./routes/_marketing/faq";
import { Route as ContactPage } from "./routes/_marketing/contact";
import { Route as ClaimPage } from "./routes/_marketing/claim";
import { Route as PrivacyPage } from "./routes/_marketing/privacy";
import { Route as PrivacyPolicyPage } from "./routes/_marketing/privacy-policy";
import { Route as TermsPage } from "./routes/_marketing/terms-of-service";
import { Route as DeleteAccountPage } from "./routes/_marketing/delete-account";

// Live salon app routes
import { Route as LiveExplorePage } from "./routes/live/index";
import { Route as StudioPage } from "./routes/live/studio";
import { Route as QueuePage } from "./routes/live/queue";
import { Route as ActivityPage } from "./routes/live/activity";
import { Route as CheckoutPage } from "./routes/live/checkout";
import { Route as ProfilePage } from "./routes/live/profile";
import { Route as SalonDetailPage } from "./routes/live/salon.$id";

// Salon OS Dashboard & Login
import { Route as LoginPage } from "./routes/login";
import { Route as SalonDashboard } from "./routes/salon/index";

const queryClient = new QueryClient();

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-7xl font-bold text-[#1B1410]">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-[#1B1410]">Page not found</h2>
        <p className="mt-2 text-sm text-[#6E6159]">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#1B1410] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2C2420] transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Marketing Layout & Pages */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/claim" element={<ClaimPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsPage />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />
          </Route>

          {/* Live App Routes */}
          <Route path="/live" element={<LiveExplorePage />} />
          <Route path="/live/studio" element={<StudioPage />} />
          <Route path="/live/queue" element={<QueuePage />} />
          <Route path="/live/activity" element={<ActivityPage />} />
          <Route path="/live/checkout" element={<CheckoutPage />} />
          <Route path="/live/profile" element={<ProfilePage />} />
          <Route path="/live/salon/:id" element={<SalonDetailPage />} />

          {/* Alias /app to /live for mobile web continuity */}
          <Route path="/app/*" element={<Navigate to="/live" replace />} />

          {/* SalonOS & Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/salon" element={<SalonDashboard />} />
          <Route path="/salon/*" element={<SalonDashboard />} />

          {/* Fallback 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}

export default App;

