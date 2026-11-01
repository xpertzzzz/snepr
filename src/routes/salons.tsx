import { createFileRoute, Link } from "@tanstack/react-router";
import { SneprWordmark } from "@/components/SneprWordmark";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Store, CheckCircle2, Scissors, Armchair, Clock,
  ArrowRight, ShieldCheck, Zap
} from "lucide-react";

export const Route = createFileRoute("/salons")({
  head: () => ({
    title: "For Salons — SalonOS | Snepr",
    meta: [
      {
        name: "description",
        content: "Bring your salon onto Snepr. Run digital queues, manage barber chairs, and eliminate waiting room crowding with 0% commission on haircuts.",
      },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: ForSalonsPage,
});

export function ForSalonsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F5EEE7] text-[11px] font-bold uppercase tracking-widest text-[#7A4B29]">
            SalonOS Desk for Salon Owners
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-[#1B1410] leading-tight">
            Your salon. Your chairs. Under control.
          </h1>
          <p className="text-sm sm:text-base text-[#786B60] leading-relaxed">
            A salon operations system with live chair wait times, automatic walk-in tokens, and 0% commission on haircuts in Bhubaneswar.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/partner/register"
              className="px-7 py-3.5 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Register Your Salon</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/partner/claim"
              className="px-6 py-3.5 rounded-xl border border-[#E9E1D7] bg-[#FFFDFA] hover:bg-white text-[#1B1410] text-xs font-bold transition-colors"
            >
              Claim Listed Salon
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E9E1D7] flex items-center justify-center text-[#7A4B29]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif text-[#1B1410]">Digital Live Queue</h3>
            <p className="text-xs text-[#786B60] leading-relaxed">
              Customers can check chair wait times from home and join remotely. Issue physical walk-in tokens with one tap.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E9E1D7] flex items-center justify-center text-[#7A4B29]">
              <Armchair className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif text-[#1B1410]">Chair-Level Status</h3>
            <p className="text-xs text-[#786B60] leading-relaxed">
              Know exactly which station is occupied, finishing, or available. Predict customer turn time with precision.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFDFA] border border-[#E9E1D7] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E9E1D7] flex items-center justify-center text-[#267447]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif text-[#1B1410]">0% Haircut Commissions</h3>
            <p className="text-xs text-[#786B60] leading-relaxed">
              You keep 100% of your earnings. Snepr charges transparent, flat monthly plans starting from ₹199/month.
            </p>
          </div>
        </div>

        {/* Authoritative Pricing */}
        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A4B29]">
              Authoritative Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1B1410]">
              Simple pricing. No haircut commissions.
            </h2>
            <p className="text-xs text-[#786B60]">
              Flat monthly software plans. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-6 rounded-2xl border border-[#E9E1D7] bg-[#FAF7F2]/50 space-y-3">
              <span className="text-[10px] font-bold text-[#786B60] uppercase">BASE · 1 CHAIR</span>
              <h4 className="text-lg font-bold font-serif text-[#1B1410]">Single Barber</h4>
              <div className="text-3xl font-bold font-serif text-[#1B1410]">₹199<small className="text-xs font-normal"> / month</small></div>
              <ul className="text-xs text-[#786B60] space-y-2 pt-2 border-t border-[#E9E1D7]">
                <li>✓ 1 Active Stylist Chair</li>
                <li>✓ Real-time countdown</li>
                <li>✓ Digital & walk-in queue</li>
                <li>✓ 0% commission on services</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border-2 border-[#7A4B29] bg-white relative shadow-sm space-y-3">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white bg-[#7A4B29] px-2.5 py-0.5 rounded-full absolute -top-3 right-4">
                MOST POPULAR
              </span>
              <span className="text-[10px] font-bold text-[#7A4B29] uppercase">INTERMEDIATE · UP TO 3 CHAIRS</span>
              <h4 className="text-lg font-bold font-serif text-[#1B1410]">Neighborhood Salon</h4>
              <div className="text-3xl font-bold font-serif text-[#1B1410]">₹400<small className="text-xs font-normal"> / month</small></div>
              <ul className="text-xs text-[#786B60] space-y-2 pt-2 border-t border-[#E9E1D7]">
                <li>✓ Up to 3 Stylist Chairs</li>
                <li>✓ Priority neighborhood discovery</li>
                <li>✓ Full SalonOS desk</li>
                <li>✓ 0% commission on services</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-[#E9E1D7] bg-[#FAF7F2]/50 space-y-3">
              <span className="text-[10px] font-bold text-[#786B60] uppercase">PRO · UNLIMITED CHAIRS</span>
              <h4 className="text-lg font-bold font-serif text-[#1B1410]">Pro Studio</h4>
              <div className="text-3xl font-bold font-serif text-[#1B1410]">₹449<small className="text-xs font-normal"> / month</small></div>
              <ul className="text-xs text-[#786B60] space-y-2 pt-2 border-t border-[#E9E1D7]">
                <li>✓ Unlimited Stylist Chairs</li>
                <li>✓ Verified Salon Badge</li>
                <li>✓ Priority Support & Setup</li>
                <li>✓ 0% commission on services</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ForSalonsPage;

