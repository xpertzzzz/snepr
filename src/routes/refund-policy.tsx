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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex flex-col justify-between">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 space-y-6 w-full">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7A4B29] bg-[#F5EEE7] px-3 py-1 rounded-full">
            Transparent Billing
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#1B1410] mt-3">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-[#786B60] mt-1">Last updated: November 2026 · Bhubaneswar, Odisha</p>
        </div>

        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-[#786B60] leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="text-base font-bold font-serif text-[#1B1410]">1. SalonOS Software Subscriptions</h2>
            <p>
              SalonOS software subscriptions (₹199, ₹400, ₹449/month) can be canceled at any time from your account settings. Subscriptions remain active until the end of the current billing cycle with no automatic surprise renewal fees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold font-serif text-[#1B1410]">2. 14-Day Onboarding Guarantee</h2>
            <p>
              If a new salon partner is unsatisfied with SalonOS within the first 14 days of activation, a full 100% refund of the first month's subscription fee will be issued upon written request to <a href="mailto:support@snepr.in" className="text-[#7A4B29] font-semibold underline">support@snepr.in</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold font-serif text-[#1B1410]">3. Customer Haircut Payments</h2>
            <p>
              Snepr does not process or collect haircut payments on behalf of salons. All haircut, grooming, and beauty service transactions happen directly between the customer and the salon at the physical counter. Any disputes regarding service quality must be handled directly with the salon.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default RefundPolicyPage;

