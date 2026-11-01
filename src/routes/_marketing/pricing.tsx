import { createFileRoute } from "@tanstack/react-router";
import { PricingSection } from "@/components/snepr/PricingSection";
import { FaqSection } from "@/components/snepr/FaqSection";

export const Route = createFileRoute("/_marketing/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & SalonOS Plans | Snepr" },
      {
        name: "description",
        content:
          "Simple flat SaaS pricing for salons. Starting at Rs. 199/month. Zero haircut commissions. Keep 100% of your earnings.",
      },
      { rel: "canonical", href: "https://snepr.in/pricing" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <PricingSection />
      <FaqSection />
    </div>
  );
}

