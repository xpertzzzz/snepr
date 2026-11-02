import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/partner-terms")({
  head: () => ({
    title: "Partner Terms & Conditions | Snepr",
    meta: [
      { name: "description", content: "Terms of service for Snepr salon partners and SalonOS users." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: PartnerTermsPage,
});

export function PartnerTermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410] flex flex-col justify-between">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 space-y-6 w-full">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7A4B29] bg-[#F5EEE7] px-3 py-1 rounded-full">
            Legal Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#1B1410] mt-3">
            Partner Terms & Conditions
          </h1>
          <p className="text-xs text-[#786B60] mt-1">Effective November 2026 · Snepr Technologies, Bhubaneswar, Odisha</p>
        </div>

        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-[#786B60] leading-relaxed shadow-xs">
          <section className="space-y-2">
            <h2 className="text-base font-bold font-serif text-[#1B1410]">1. Salon Partner Agreement</h2>
            <p>
              By registering or claiming a salon on Snepr, you warrant that you are the authorized owner, operator, or designated representative of the business located in Bhubaneswar, Odisha.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold font-serif text-[#1B1410]">2. Accurate Queue & Wait Time Operations</h2>
            <p>
              Partners agree to keep chair statuses, opening hours, and queue entries reasonably up to date on SalonOS to provide an honest, accurate wait experience for customers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold font-serif text-[#1B1410]">3. 0% Commission & Flat Fee Guarantee</h2>
            <p>
              Snepr commits to 0% commission on all salon haircut and beauty services. Software access is billed on flat monthly plans (₹199, ₹400, ₹449). Pricing adjustments, if any, will be communicated 60 days in advance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold font-serif text-[#1B1410]">4. Staff & Multi-Barber Accounts</h2>
            <p>
              Depending on the active subscription tier, partners may provision individual stylist chair logins. Each stylist is responsible for maintaining their active service queue and notifying clients of delays or breaks.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PartnerTermsPage;

