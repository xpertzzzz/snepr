import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ShieldCheck, Zap, Users, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_marketing/about")({
  head: () => ({
    title: "About Us | Snepr",
    meta: [
      {
        name: "description",
        content:
          "Snepr is on a mission to eliminate waiting rooms. Live salon chair telemetry, digital queues, and 0% commission on haircuts in Bhubaneswar, Odisha.",
      },
      { name: "theme-color", content: "#f7f3ed" },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5eee6] border border-[#e8dcd0] text-[11px] font-bold uppercase tracking-[1.6px] text-[#8c4d27]">
          <Sparkles className="w-3.5 h-3.5 text-[#8c4d27]" />
          Our Story & Mission
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#211914] tracking-tight leading-[1.08] font-['Manrope']">
          Eliminating waiting rooms forever.
        </h1>
        <p className="text-base sm:text-lg text-[#81736a] leading-relaxed">
          Nobody likes waiting. Whether sitting in a noisy, crowded salon lobby or driving across town only to discover a line out the door, the traditional salon walk-in experience is broken.
        </p>
      </div>

      {/* Main Content Paper */}
      <div className="bg-[#fffdfa] border border-[#e9dfd5] rounded-3xl p-8 sm:p-12 shadow-sm space-y-10 text-[#6e625a] leading-relaxed text-sm sm:text-base">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#211914] font-['Manrope'] tracking-tight">
            Built for Bhubaneswar. Built for Everyone.
          </h2>
          <p>
            Snepr was founded in Bhubaneswar, Odisha with one simple commitment: to give people their time back. We provide live chair telemetry so customers can see exact wait times from home, save a place in line digitally, and walk straight into the barber chair right when their stylist is ready.
          </p>
          <p>
            No guessing. No awkward waiting chairs. No wasted weekends.
          </p>
        </section>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-[#f7f3ed] border border-[#e9dfd5] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fffdfa] border border-[#e9dfd5] flex items-center justify-center text-[#8c4d27]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#211914] font-['Manrope']">Live Telemetry</h3>
            <p className="text-xs text-[#81736a] leading-relaxed">
              Real-time chair updates directly from salon stylists. Check before you travel.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#f7f3ed] border border-[#e9dfd5] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fffdfa] border border-[#e9dfd5] flex items-center justify-center text-[#8c4d27]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#211914] font-['Manrope']">0% Commission</h3>
            <p className="text-xs text-[#81736a] leading-relaxed">
              We never take a cut of haircut earnings. Salons keep 100% of their service revenue.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#f7f3ed] border border-[#e9dfd5] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fffdfa] border border-[#e9dfd5] flex items-center justify-center text-[#8c4d27]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#211914] font-['Manrope']">No App Required</h3>
            <p className="text-xs text-[#81736a] leading-relaxed">
              Instant access in any modern mobile browser. Zero friction for everyday people.
            </p>
          </div>
        </div>

        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold text-[#211914] font-['Manrope'] tracking-tight">
            A Fair Model for Barbers & Salons
          </h2>
          <p>
            For salon owners and barbers, walk-ins are the lifeblood of business. But unpredictable rushes cause crowded rooms, stressed staff, and lost customers who walk away from long lines.
          </p>
          <p>
            SalonOS gives barbers a clean, 1-tap queue counter on any phone or tablet. It distributes crowds evenly throughout the day, turns chaotic lobbies into predictable schedules, and connects local salons directly with verified customers across Patia, KIIT Road, Saheed Nagar, and Jaydev Vihar.
          </p>
        </section>

        {/* CTA Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#211914] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold font-['Manrope']">Ready to see live wait times?</h3>
            <p className="text-xs text-[#c2b5ab]">Explore verified salons and open chairs in your area right now.</p>
          </div>
          <Link
            to="/live"
            className="px-6 py-3 rounded-full bg-[#8c4d27] hover:bg-[#6f3c1d] text-white text-xs font-bold transition-all whitespace-nowrap shadow-sm"
          >
            Live Queues ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
