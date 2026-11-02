import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, X, Sparkles, Zap, ShieldCheck, TrendingUp, Calculator, ArrowRight, HelpCircle } from "lucide-react";
import { Tilt3D } from "@/components/ui/Tilt3D";
import { ScrollCardReveal } from "@/components/ui/ScrollCardReveal";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  
  // Interactive ROI Calculator State
  const [dailyClients, setDailyClients] = useState(35);
  const [ticketSize, setTicketSize] = useState(350);

  // Calculations
  const monthlyRevenue = dailyClients * ticketSize * 30;
  const commissionLoss = Math.round(monthlyRevenue * 0.25); // 25% predatory commission
  const sneprCost = billingCycle === "monthly" ? 400 : 340;
  const netMonthlySavings = commissionLoss - sneprCost;
  const netAnnualSavings = netMonthlySavings * 12;

  return (
    <section id="pricing" className="px-4 pt-10 pb-20 sm:px-6 sm:pt-14 sm:pb-28 bg-[#FAF7F2] text-[#2C2420] relative overflow-hidden">
      <div className="mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F7EFE9] border border-[#ECD9BE] px-3.5 py-1.5 text-[12px] font-bold text-[#8A4C24] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SalonOS Subscription Plans</span>
          </div>
          <h2 className="mt-4 font-display text-[36px] font-bold tracking-tight text-[#1B1410] sm:text-[50px] leading-[1.05]">
            Simple, Flat Pricing for Salons
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[#6E6159] sm:text-[17px]">
            No 20% to 30% predatory marketplace commissions on your haircuts. Keep 100% of your earnings with transparent, predictable flat SaaS.
          </p>

          {/* Billing Switcher */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8E1D7",
              borderRadius: "9999px",
              padding: "6px 8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              marginTop: "28px",
            }}
          >
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              style={{
                backgroundColor: billingCycle === "monthly" ? "#1B1410" : "transparent",
                color: billingCycle === "monthly" ? "#FFFFFF" : "#6E6159",
                padding: "8px 20px",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "13.5px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: billingCycle === "annual" ? "#8A4C24" : "transparent",
                color: billingCycle === "annual" ? "#FFFFFF" : "#6E6159",
                padding: "8px 18px",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "13.5px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span>Annual Billing</span>
              <span
                style={{
                  backgroundColor: billingCycle === "annual" ? "rgba(255,255,255,0.22)" : "#FAF3E1",
                  color: billingCycle === "annual" ? "#FFFFFF" : "#705217",
                  padding: "3px 8px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                Save 15%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid with 3D Tilt */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:items-stretch">
          {/* TIER 1: BASE PLAN */}
          <ScrollCardReveal delay={0.08} direction="left" className="flex flex-col h-full rounded-[32px]">
          <Tilt3D maxAngle={5} scale={1.02} glare={true} className="flex flex-col h-full rounded-[32px]">
            <div className="flex flex-col h-full justify-between rounded-[32px] border border-[#E8E1D7] bg-white p-7 shadow-sm transition-all hover:shadow-md sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold uppercase tracking-wider text-[#6E6159]">
                    Base Plan
                  </span>
                  <span className="rounded-full bg-[#F5EFEB] px-2.5 py-1 text-[11px] font-bold text-[#6E6159]">
                    Single Barber
                  </span>
                </div>
                <h3 className="mt-2 text-[22px] font-bold text-[#1B1410]">Barbershop Starter</h3>
                <p className="mt-1 text-[13.5px] text-[#6E6159]">
                  Single-chair barbershops & independent local groomers.
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-[44px] font-bold tracking-tight text-[#1B1410]">
                    {billingCycle === "monthly" ? "Rs. 199" : "Rs. 169"}
                  </span>
                  <span className="text-[14px] font-semibold text-[#6E6159]">/month</span>
                </div>
                <div className="text-[11.5px] text-[#9C9089]">
                  {billingCycle === "annual" ? "Billed annually (Rs. 2,028/yr)" : "Billed monthly, cancel anytime"}
                </div>

                <div className="my-6 h-px bg-[#E8E1D7]" />

                <div className="text-[12px] font-bold uppercase tracking-wider text-[#1B1410] mb-3">
                  Everything Included:
                </div>
                <ul className="space-y-3 text-[13.5px] text-[#6E6159]">
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EBF7EE] text-[#1C5434]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span><b>1 Active Stylist Chair</b> live telemetry</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EBF7EE] text-[#1C5434]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Real-time chair countdown queue</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EBF7EE] text-[#1C5434]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Printable counter table QR standee</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EBF7EE] text-[#1C5434]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Basic SMS customer arrival alerts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EBF7EE] text-[#1C5434]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Verified customer reviews & feedback</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EBF7EE] text-[#1C5434]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span><b>100% Free</b> for all your customers</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/claim"
                  className="shimmer-hover flex h-12 w-full items-center justify-center rounded-2xl border border-[#E8E1D7] bg-[#FAF7F2] text-[14px] font-bold text-[#1B1410] transition-all hover:bg-[#F5EFEB] hover:border-[#8A4C24]"
                >
                  Get Started with Base
                </Link>
              </div>
            </div>
          </Tilt3D>
          </ScrollCardReveal>

          {/* TIER 2: INTERMEDIATE PLAN (FEATURED / MOST POPULAR) */}
          <ScrollCardReveal delay={0.22} direction="scale" className="flex flex-col h-full rounded-[36px]">
          <Tilt3D maxAngle={5} scale={1.025} glare={true} className="flex flex-col h-full rounded-[36px]">
            <div className="relative flex flex-col h-full justify-between rounded-[36px] border-2 border-[#8A4C24] bg-white p-7 pt-10 shadow-xl sm:p-8 sm:pt-11">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 rounded-full bg-[#8A4C24] px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md whitespace-nowrap">
                Most Popular
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold uppercase tracking-wider text-[#8A4C24]">
                    Intermediate
                  </span>
                  <span className="rounded-full bg-[#F7EFE9] px-2.5 py-1 text-[11px] font-bold text-[#8A4C24]">
                    Up to 3 Chairs
                  </span>
                </div>
                <h3 className="mt-2 text-[22px] font-bold text-[#1B1410]">High-Traffic Salon</h3>
                <p className="mt-1 text-[13.5px] text-[#6E6159]">
                  Neighborhood grooming parlors, unisex salons & busy studios.
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-[44px] font-bold tracking-tight text-[#8A4C24]">
                    {billingCycle === "monthly" ? "Rs. 400" : "Rs. 340"}
                  </span>
                  <span className="text-[14px] font-semibold text-[#6E6159]">/month</span>
                </div>
                <div className="text-[11.5px] text-[#8A4C24]">
                  {billingCycle === "annual" ? "Billed annually (Rs. 4,080/yr) · Save Rs. 720" : "Billed monthly, cancel anytime"}
                </div>

                <div className="my-6 h-px bg-[#ECD9BE]" />

                <div className="text-[12px] font-bold uppercase tracking-wider text-[#1B1410] mb-3">
                  Everything in Base, plus:
                </div>
                <ul className="space-y-3 text-[13.5px] text-[#6E6159]">
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F7EFE9] text-[#8A4C24]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span><b>Up to 3 Chairs & Staff Logins</b> with individual queues</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F7EFE9] text-[#8A4C24]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Multi-barber queue routing & fast reassignment</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F7EFE9] text-[#8A4C24]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Automated WhatsApp customer delay & call-in alerts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F7EFE9] text-[#8A4C24]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span><b>Snepr Points Loyalty Network</b> member listing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F7EFE9] text-[#8A4C24]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Peak-hour chair analytics & wait duration tracking</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F7EFE9] text-[#8A4C24]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span><b>0% Cut</b> — Keep every single rupee of client revenue</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/claim"
                  className="shimmer-hover flex h-12 w-full items-center justify-center rounded-2xl bg-[#8A4C24] text-[14px] font-bold text-white shadow-md transition-all hover:bg-[#6E3C1D] hover:scale-[1.02]"
                >
                  Choose Intermediate
                </Link>
              </div>
            </div>
          </Tilt3D>
          </ScrollCardReveal>

          {/* TIER 3: PRO PLAN */}
          <ScrollCardReveal delay={0.36} direction="right" className="flex flex-col h-full rounded-[32px]">
          <Tilt3D maxAngle={5} scale={1.02} glare={true} className="flex flex-col h-full rounded-[32px]">
            <div className="flex flex-col h-full justify-between rounded-[32px] border border-[#E8E1D7] bg-white p-7 shadow-sm transition-all hover:shadow-md sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold uppercase tracking-wider text-[#6E6159]">
                    Pro Plan
                  </span>
                  <span className="rounded-full bg-[#FAF3E1] px-2.5 py-1 text-[11px] font-bold text-[#705217]">
                    Unlimited
                  </span>
                </div>
                <h3 className="mt-2 text-[22px] font-bold text-[#1B1410]">Luxury Grooming Lounge</h3>
                <p className="mt-1 text-[13.5px] text-[#6E6159]">
                  Multi-chair luxury grooming chains, ateliers & hair studios.
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-[44px] font-bold tracking-tight text-[#1B1410]">
                    {billingCycle === "monthly" ? "Rs. 449" : "Rs. 380"}
                  </span>
                  <span className="text-[14px] font-semibold text-[#6E6159]">/month</span>
                </div>
                <div className="text-[11.5px] text-[#9C9089]">
                  {billingCycle === "annual" ? "Billed annually (Rs. 4,560/yr) · Save Rs. 828" : "Billed monthly, cancel anytime"}
                </div>

                <div className="my-6 h-px bg-[#E8E1D7]" />

                <div className="text-[12px] font-bold uppercase tracking-wider text-[#1B1410] mb-3">
                  Everything in Intermediate, plus:
                </div>
                <ul className="space-y-3 text-[13.5px] text-[#6E6159]">
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#FAF3E1] text-[#705217]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span><b>Unlimited Chairs & Barbers</b> with master admin dashboard</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#FAF3E1] text-[#705217]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Full AI Snepr Studio integration for hairstyle previews</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#FAF3E1] text-[#705217]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Advanced chair turnover, stylist performance & revenue metrics</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#FAF3E1] text-[#705217]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span><b>Featured Placement</b> on the city "Explore" directory</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#FAF3E1] text-[#705217]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Priority 24/7 dedicated WhatsApp support desk</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/claim"
                  className="shimmer-hover flex h-12 w-full items-center justify-center rounded-2xl border border-[#E8E1D7] bg-[#FAF7F2] text-[14px] font-bold text-[#1B1410] transition-all hover:bg-[#F5EFEB] hover:border-[#8A4C24]"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </Tilt3D>
          </ScrollCardReveal>
        </div>

        {/* ─── INTERACTIVE COMMISSION ROI CALCULATOR ─── */}
        <div className="mt-20 pt-10 border-t border-[#ECD9BE]/60">
          <Tilt3D maxAngle={3} scale={1.01} glare={false} className="rounded-[40px]">
            <div className="rounded-[40px] border border-[#ECD9BE] bg-[#FFFFFF] p-8 shadow-md sm:p-12">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF7EE] px-3.5 py-1 text-[12px] font-bold text-[#1C5434]">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Transparent Economics Calculator</span>
                  </div>
                  <h3 className="mt-3 font-display text-[30px] font-bold tracking-tight text-[#1B1410] sm:text-[40px] leading-tight">
                    How Much Are Aggregators Really Taking From You?
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#6E6159]">
                    Traditional booking apps extract 20% to 30% from every haircut ticket. See how much money stays in your salon bank account when you switch to Snepr's flat SaaS model.
                  </p>

                  {/* Sliders */}
                  <div className="mt-8 space-y-6">
                    <div>
                      <div className="flex justify-between text-[14px] font-bold text-[#1B1410]">
                        <span>Average Daily Customers</span>
                        <span className="text-[#8A4C24] font-mono">{dailyClients} clients/day</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={dailyClients}
                        onChange={(e) => setDailyClients(Number(e.target.value))}
                        className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#E8E1D7] accent-[#8A4C24]"
                      />
                      <div className="mt-1 flex justify-between text-[11px] text-[#9C9089]">
                        <span>10 clients</span>
                        <span>50 clients</span>
                        <span>100 clients</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[14px] font-bold text-[#1B1410]">
                        <span>Average Haircut / Service Ticket</span>
                        <span className="text-[#8A4C24] font-mono">Rs. {ticketSize}</span>
                      </div>
                      <input
                        type="range"
                        min="150"
                        max="1000"
                        step="50"
                        value={ticketSize}
                        onChange={(e) => setTicketSize(Number(e.target.value))}
                        className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#E8E1D7] accent-[#8A4C24]"
                      />
                      <div className="mt-1 flex justify-between text-[11px] text-[#9C9089]">
                        <span>Rs. 150 (Basic Trim)</span>
                        <span>Rs. 500 (Grooming Combo)</span>
                        <span>Rs. 1,000 (Luxury Spa)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Savings Display Box */}
                <div className="rounded-[32px] border border-[#ECD9BE] bg-[#FAF7F2] p-6 sm:p-8">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-[#6E6159]">
                    Monthly Financial Impact
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-[13.5px]">
                      <span className="text-[#6E6159]">Estimated Monthly Revenue:</span>
                      <span className="font-bold font-mono text-[#1B1410]">Rs. {monthlyRevenue.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[13.5px]">
                      <span className="text-[#B43A2A]">25% Aggregator Commission Cut:</span>
                      <span className="font-bold font-mono text-[#B43A2A]">- Rs. {commissionLoss.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[13.5px]">
                      <span className="text-[#1C5434]">Snepr Flat Subscription:</span>
                      <span className="font-bold font-mono text-[#1C5434]">- Rs. {sneprCost}</span>
                    </div>
                  </div>

                  <div className="my-5 h-px bg-[#E8E1D7]" />

                  <div className="rounded-2xl bg-[#EBF7EE] border border-[#BBE1C8] p-5 text-center transition-all hover:scale-[1.01]">
                    <div className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#1C5434]">
                      You Keep in Your Salon With Snepr
                    </div>
                    <div className="mt-1.5 font-display text-[36px] font-extrabold text-[#1C5434]">
                      + Rs. {netMonthlySavings.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[12px] font-semibold text-[#1C5434]/80">
                      That is Rs. {netAnnualSavings.toLocaleString("en-IN")} extra profit saved per year!
                    </div>
                  </div>

                  <div className="mt-5">
                    <Link
                      to="/claim"
                      className="shimmer-hover flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1B1410] text-[14px] font-bold text-white transition-all hover:bg-[#8A4C24]"
                    >
                      <span>Claim Your Salon Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Tilt3D>
        </div>

        {/* ─── PREDATORY APPS VS SNEPR COMPARISON TABLE ─── */}
        <div className="mt-16 overflow-hidden rounded-[32px] border border-[#E8E1D7] bg-white shadow-sm transition-all hover:shadow-md">
          <div className="p-6 sm:p-8 border-b border-[#E8E1D7]">
            <h3 className="font-display text-[24px] font-bold text-[#1B1410]">
              Predatory Commission Apps vs Snepr SalonOS
            </h3>
            <p className="mt-1 text-[14px] text-[#6E6159]">
              Built strictly on the principles laid out in the Snepr Product Strategy Report.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8E1D7]">
                  <th className="py-4 px-6 font-bold text-[#1B1410]">Core Dimension</th>
                  <th className="py-4 px-6 font-bold text-[#B43A2A]">20-30% Commission Apps</th>
                  <th className="py-4 px-6 font-bold text-[#1C5434]">Snepr SalonOS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D7]">
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#1B1410]">Haircut Cut / Commission</td>
                  <td className="py-4 px-6 text-[#B43A2A] font-semibold">20% to 30% per client ticket</td>
                  <td className="py-4 px-6 text-[#1C5434] font-bold">0% (Keep 100% of your earnings)</td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#1B1410]">Monthly Cost</td>
                  <td className="py-4 px-6 text-[#6E6159]">Hidden deductions & lead fees</td>
                  <td className="py-4 px-6 text-[#1C5434] font-bold">Flat Rs. 199 to Rs. 449 / month</td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#1B1410]">Client Relationship</td>
                  <td className="py-4 px-6 text-[#6E6159]">Aggregator owns client numbers</td>
                  <td className="py-4 px-6 text-[#1C5434] font-bold">Direct salon-to-client relationship</td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#1B1410]">Review Authenticity</td>
                  <td className="py-4 px-6 text-[#6E6159]">Paid sponsored rankings & fake stars</td>
                  <td className="py-4 px-6 text-[#1C5434] font-bold">Verified QR reviews (+10 Points reward)</td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#1B1410]">Queue Accuracy</td>
                  <td className="py-4 px-6 text-[#6E6159]">Fixed 30-min blunt booking guesses</td>
                  <td className="py-4 px-6 text-[#1C5434] font-bold">Dynamic chair-level live duration telemetry</td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#1B1410]">Customer App Friction</td>
                  <td className="py-4 px-6 text-[#6E6159]">Forced heavy app download & OTP login</td>
                  <td className="py-4 px-6 text-[#1C5434] font-bold">Instant browser QR pass + optional native app</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
