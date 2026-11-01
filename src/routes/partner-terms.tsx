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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <h1 className="text-3xl font-bold font-serif text-[#1B1410]">Partner Terms & Conditions</h1>
        <p className="text-xs text-[#786B60]">Effective November 2026 · Snepr Technologies, Bhubaneswar</p>

        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-[#786B60] leading-relaxed">
          <h2 className="text-sm font-bold text-[#1B1410] uppercase">1. Salon Partner Agreement</h2>
          <p>
            By registering or claiming a salon on Snepr, you warrant that you are the authorized owner, operator, or designated representative of the business located in Bhubaneswar, Odisha.
          </p>

          <h2 className="text-sm font-bold text-[#1B1410] uppercase">2. Accurate Queue & Wait Time Operations</h2>
          <p>
            Partners agree to keep chair statuses, opening hours, and queue entries reasonably up to date on SalonOS to provide an honest, accurate wait experience for customers.
          </p>

          <h2 className="text-sm font-bold text-[#1B1410] uppercase">3. 0% Commission & Flat Fee Guarantee</h2>
          <p>
            Snepr commits to 0% commission on all salon haircut and beauty services. Software access is billed on flat monthly plans (₹199, ₹400, ₹449). Pricing adjustments, if any, will be communicated 60 days in advance.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PartnerTermsPage;
