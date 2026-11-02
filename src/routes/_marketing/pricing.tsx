import { createFileRoute } from "@tanstack/react-router";
import { PricingSection } from "@/components/snepr/PricingSection";
import { FaqSection } from "@/components/snepr/FaqSection";

export const Route = createFileRoute("/_marketing/pricing")({
  head: () => ({
    title: "SalonOS Pricing & Plans | Snepr",
    meta: [
      {
        name: "description",
        content:
          "Simple flat SaaS pricing for salons in Bhubaneswar. Starting at Rs. 199/month. Zero haircut commissions. Keep 100% of your earnings.",
      },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: PricingPage,
});

export function PricingPage() {
  return (
    <div className="w-full bg-[#FAF7F2]">
      <PricingSection />
      <FaqSection />
    </div>
  );
}
