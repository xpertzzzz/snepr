import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function SalonOSProductPage() {
  const features = [
    {
      title: "Digital Queue System",
      desc: "Automatically routes walk-in customers and remote mobile arrivals to open chairs. No crowded waiting rooms or chaotic paper registers.",
      icon: "⚡",
    },
    {
      title: "Real Time Chair Tracking",
      desc: "Barbers update chair status with one click: Serving, Ready, or Break. Live countdown keeps customers informed before they leave home.",
      icon: "💺",
    },
    {
      title: "Custom Reception QR Standee",
      desc: "Every partner salon receives a branded tabletop QR standee. Clients simply scan with their phone camera to join the digital queue without downloading an app.",
      icon: "📱",
    },
    {
      title: "Zero Haircut Commissions",
      desc: "Keep 100% of your earnings. Simple flat SaaS subscriptions from ₹199 per month. We never deduct 15% to 25% commissions from your service revenue.",
      icon: "💰",
    },
    {
      title: "Automated Customer Alerts",
      desc: "Clients receive instant alerts when their turn is approaching, reducing no-shows and keeping chairs running smoothly throughout peak hours.",
      icon: "🔔",
    },
    {
      title: "Salon Insights & Analytics",
      desc: "Track peak operating hours, average customer turnaround, stylist productivity, and verified client loyalty from one intuitive desk overview.",
      icon: "📊",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#2b211a] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-[1220px] mx-auto px-6 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-[11px] font-bold tracking-[0.18em] text-[#80543a] uppercase bg-[#80543a]/10 px-4 py-1 rounded-full mb-4">
            SalonOS for Salon Owners | Bhubaneswar
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1b17] leading-[1.05]">
            Your salon, your chairs, <span className="font-serif italic text-[#80543a]">your customers.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#5c4f44] leading-relaxed">
            The all-in-one salon operations software built for barbers and salon owners across Bhubaneswar. Eliminate reception chaos, boost daily chair turns, and never pay a percentage of your haircut revenue.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/pricing"
              className="px-8 py-3.5 rounded-full bg-[#1d1b17] text-[#f5f1e9] font-bold text-sm hover:bg-[#3d322a] transition-all shadow-md"
            >
              View SalonOS Plans (From ₹199/mo) ↗
            </Link>
            <Link
              to="/register-salon"
              className="px-8 py-3.5 rounded-full border border-[#1d1b17] text-[#1d1b17] font-bold text-sm hover:bg-[#1d1b17] hover:text-[#f5f1e9] transition-all"
            >
              Register Your Salon
            </Link>
          </div>
        </div>

        {/* 6 Core Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-white border border-[#eee4d8] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="text-3xl mb-4">{feat.icon}</div>
              <h3 className="text-xl font-bold text-[#1d1b17] mb-2">{feat.title}</h3>
              <p className="text-sm text-[#5c4f44] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* 6 Step Operational Flow */}
        <div className="bg-[#fffdfa] border border-[#eee4d8] rounded-3xl p-8 sm:p-12 shadow-sm mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-[#1d1b17]">The SalonOS Working Day</h2>
            <p className="mt-2 text-[#6b5e52]">How a customer flows effortlessly through your salon</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { num: "01", text: "Customer joins queue" },
              { num: "02", text: "Token appears on desk" },
              { num: "03", text: "Barber calls next" },
              { num: "04", text: "Customer alerted" },
              { num: "05", text: "Service completed" },
              { num: "06", text: "Points & verified review" },
            ].map((step) => (
              <div key={step.num} className="bg-[#f7f3ed] p-5 rounded-2xl border border-[#eee4d8]">
                <div className="font-serif italic text-xl font-bold text-[#80543a] mb-2">{step.num}</div>
                <div className="text-xs font-semibold text-[#2b211a]">{step.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="bg-[#1c1917] text-[#f5f1e9] rounded-3xl p-10 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start modernizing your salon today</h2>
          <p className="text-base text-[#c4bcb1] max-w-xl mx-auto mb-8">
            Setup takes less than 10 minutes. Zero commission fees guaranteed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register-salon"
              className="px-8 py-3.5 rounded-full bg-[#f5f1e9] text-[#1d1b17] font-bold text-sm hover:bg-white transition-all shadow-md"
            >
              Register Your Salon Now ↗
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3.5 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              Compare SalonOS Plans
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
