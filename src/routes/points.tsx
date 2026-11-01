import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SneprWordmark } from "@/components/SneprWordmark";
import { Award, Gift, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/points")({
  head: () => ({
    title: "Snepr Points & Rewards | Snepr",
    meta: [
      { name: "description", content: "Earn loyalty points on every salon visit in Bhubaneswar. Redeem for haircut discounts and services." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: SneprPointsPage,
});

export function SneprPointsPage() {
  const [points] = useState(150);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410]">
      {/* Header */}
      <header className="border-b border-[#E9E1D7] bg-[#FAF7F2] sticky top-0 z-20">
        <div className="max-w-[760px] h-16 mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="Snepr home">
            <SneprWordmark height={30} color="#1B1410" />
          </Link>
          <Link to="/profile" className="text-xs font-semibold text-[#7A4B29] hover:underline">
            My Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Points Balance Card */}
        <div className="bg-[#1B1410] text-[#FFFDFA] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#C8993E]">
              Snepr Loyalty Rewards
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-1">
              {points} Points Available
            </h1>
            <p className="text-xs sm:text-sm text-[#DED4CA] mt-2 max-w-md">
              Earn 10 points on every completed salon visit and 15 points for verified barber reviews.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#FFFDFA]">
              <span>Value: ₹{Math.round(points * 0.5)} discount</span>
            </div>
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold font-serif text-[#1B1410]">
            How to Earn Snepr Points
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E9E1D7] space-y-1">
              <strong className="block text-sm text-[#7A4B29] font-serif">+10 Points</strong>
              <div className="font-bold text-[#1B1410]">Completed Queue Visit</div>
              <p className="text-[#786B60] text-[11px]">Automatically credited when your barber marks your service completed.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E9E1D7] space-y-1">
              <strong className="block text-sm text-[#C8993E] font-serif">+15 Points</strong>
              <div className="font-bold text-[#1B1410]">Verified Review</div>
              <p className="text-[#786B60] text-[11px]">Leave authentic feedback on wait times and barber precision.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E9E1D7] space-y-1">
              <strong className="block text-sm text-[#267447] font-serif">+25 Points</strong>
              <div className="font-bold text-[#1B1410]">Refer a Friend</div>
              <p className="text-[#786B60] text-[11px]">When your friend completes their first haircut in Bhubaneswar.</p>
            </div>
          </div>
        </div>

        {/* Redeem Rewards */}
        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold font-serif text-[#1B1410]">
            Redeem at Partner Salons
          </h2>
          <div className="divide-y divide-[#E9E1D7] text-xs">
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <strong className="block text-sm text-[#1B1410]">₹50 Off Any Haircut</strong>
                <span className="text-[#786B60]">Valid at all verified Bhubaneswar partner salons</span>
              </div>
              <button
                disabled={points < 100}
                className="px-4 py-2 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F] disabled:opacity-40"
              >
                100 Points
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div>
                <strong className="block text-sm text-[#1B1410]">Complimentary Beard Styling</strong>
                <span className="text-[#786B60]">With any haircut service booking</span>
              </div>
              <button
                disabled={points < 200}
                className="px-4 py-2 rounded-xl bg-[#7A4B29] text-white text-xs font-bold hover:bg-[#60391F] disabled:opacity-40"
              >
                200 Points
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SneprPointsPage;
