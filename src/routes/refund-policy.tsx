import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    title: "Refund Policy | Snepr",
    meta: [
      { name: "description", content: "Snepr refund and cancellation policy for salon software subscriptions." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: RefundPolicyPage,
});

export function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <h1 className="text-3xl font-bold font-serif text-[#1B1410]">Refund Policy</h1>
        <p className="text-xs text-[#786B60]">Last updated: November 2026 · Bhubaneswar, Odisha</p>

        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-[#786B60] leading-relaxed">
          <h2 className="text-sm font-bold text-[#1B1410] uppercase">1. Software Subscriptions</h2>
          <p>
            SalonOS software subscriptions (₹199, ₹400, ₹449/month) can be canceled at any time from your account settings. Subscriptions remain active until the end of the current billing cycle.
          </p>

          <h2 className="text-sm font-bold text-[#1B1410] uppercase">2. 14-Day Onboarding Guarantee</h2>
          <p>
            If a new salon partner is unsatisfied with SalonOS within the first 14 days of activation, a full refund of the first month's subscription fee will be issued upon request to support@snepr.in.
          </p>

          <h2 className="text-sm font-bold text-[#1B1410] uppercase">3. Customer Haircut Payments</h2>
          <p>
            Snepr does not process or collect haircut payments on behalf of salons. All service transactions happen directly between the customer and the salon. Any disputes regarding service quality must be handled directly with the salon.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default RefundPolicyPage;
