import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react";
import {
  SalonRow,
  StatusDot,
  type QueueStatus,
} from "@/components/snepr/QueueCard";
import { getSalons } from "@/backend/functions/salons";

import { InteractivePhoneSimulator } from "@/components/snepr/InteractivePhoneSimulator";
import { PillarsSection } from "@/components/snepr/PillarsSection";
import { PricingSection } from "@/components/snepr/PricingSection";
import { FaqSection } from "@/components/snepr/FaqSection";
import { AiStudioShowcase } from "@/components/snepr/AiStudioShowcase";
import { Tilt3D } from "@/components/ui/Tilt3D";
import { ScrollCardReveal, AnimatedNumber } from "@/components/ui/ScrollCardReveal";
import { ParallaxOrbs, ScrollProgressBar } from "@/components/ui/ParallaxLayer";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    meta: [
      { title: "Live Salon Queues Near You | Snepr" },
      {
        name: "description",
        content:
          "Live salon queues and wait times. Join from your phone and walk straight in. Free for customers.",
      },
      { rel: "canonical", href: "https://snepr.in" },
    ],
  }),
  component: SneprLanding,
});

/* ------------------------------ Hero ------------------------------ */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 sm:pt-16 md:pt-20">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-14">
        <div className="rise-in">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8E1D7] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#6E6159] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-pulse" />
            <span>Live Salons Active in Bhubaneswar (Patia &amp; Saheed Nagar)</span>
          </div>

          <h1 className="font-display text-[44px] font-bold leading-[1.02] tracking-tight text-[#1B1410] sm:text-[60px] md:text-[68px]">
            Never wait in line
            <br />
            at a salon again.
          </h1>

          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#6E6159] sm:text-[18px]">
            Check live chair wait times from home. Tap once to save your chair, and walk in right when your barber is ready. Always 100% free for customers.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link 
              to="/live" 
              className="shimmer-hover inline-flex h-14 items-center gap-2 rounded-2xl bg-[#1B1410] px-7 text-[15.5px] font-bold text-white shadow-md hover:bg-[#8A4C24] hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              <MapPin className="h-5 w-5" />
              Find a salon near you
            </Link>
            
            <a
              href="#simulator"
              className="inline-flex h-14 items-center gap-2 rounded-2xl border border-[#E8E1D7] bg-white px-6 text-[15px] font-semibold text-[#1B1410] hover:bg-[#F5EFEB] transition-all shadow-xs"
            >
              Try live demo
            </a>

            <a
              href="#pricing"
              className="inline-flex h-14 items-center gap-2 rounded-2xl border border-transparent bg-transparent px-4 text-[14.5px] font-semibold text-[#8A4C24] hover:text-[#5C3217] transition-all"
            >
              For salon owners &rarr;
            </a>
          </div>

          <div className="mt-10 flex items-center gap-7 text-[13px] text-[#6E6159]">
            <div>
              <div className="font-mono-tabular text-[22px] font-bold text-[#1B1410]">
                Rs. 0
              </div>
              <div className="text-[12px]">Free for customers</div>
            </div>
            <div className="h-8 w-px bg-[#E8E1D7]" />
            <div>
              <div className="font-mono-tabular text-[22px] font-bold text-[#1B1410]">
                &lt; 60s
              </div>
              <div className="text-[12px]">To save your chair</div>
            </div>
            <div className="h-8 w-px bg-[#E8E1D7]" />
            <div>
              <div className="font-mono-tabular text-[22px] font-bold text-[#1B1410]">
                4.8 / 5
              </div>
              <div className="text-[12px]">32k honest reviews</div>
            </div>
          </div>
        </div>

        <ScrollCardReveal delay={0.15} direction="right"><HeroQueueCard /></ScrollCardReveal>
      </div>
    </section>
  );
}

function HeroQueueCard() {
  const [salons, setSalons] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSalons({ data: {} });
        if (data && Array.isArray(data)) {
          const sorted = [...data].sort((a: any, b: any) => (a.waitTime || 0) - (b.waitTime || 0));
          setSalons(sorted.slice(0, 3));
        }
      } catch (e) {
        console.error("Error loading hero salons", e);
      }
    }
    load();
  }, []);

  const topSalon = salons[0] || { name: "The Scissors Edge", waitTime: 5 };

  return (
    <div className="rise-in relative mx-auto w-full max-w-md">
      {/* 3D Ambient glowing blob */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[44px] bg-gradient-to-tr from-[#8A4C24]/15 via-[#C8993E]/20 to-[#2E7D4F]/10 blur-2xl animate-pulse-soft transition-all"
      />
      
      <Tilt3D maxAngle={6} scale={1.02} glare={true} className="rounded-[32px]">
        <Link to="/live" className="block group cursor-pointer hover:no-underline rounded-[32px]">
          <div className="rounded-[32px] border border-[#E8E1D7] bg-white p-5 sm:p-6 shadow-md hover:shadow-xl hover:border-[#8A4C24]/40 transition-all">
            {/* Search Header */}
            <div className="flex items-center gap-2 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D7]/70 px-4 py-3 group-hover:bg-[#F7EFE9]/60 transition-all">
              <Search className="h-4 w-4 text-[#6E6159] group-hover:text-[#8A4C24] transition-colors" />
              <span className="text-[14px] text-[#6E6159] group-hover:text-[#1B1410] font-medium">Salons near you right now</span>
              <span className="ml-auto rounded-full bg-[#EBF7EE] text-[#1C5434] border border-[#BBE1C8] px-2.5 py-0.5 text-[11px] font-bold">
                LIVE
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {salons.length > 0 ? (
                salons.map((s, idx) => (
                  <SalonRow
                    key={s.id || idx}
                    initial={s.name ? s.name[0] : "S"}
                    name={s.name}
                    meta={`${s.category || 'Salon'} · ${s.rating || '4.8'} Rating`}
                    wait={`${s.waitTime || 5} min`}
                    status={s.queueStatus || "available"}
                    tint={idx === 0 ? "bg-[#F7EFE9]" : idx === 1 ? "bg-[#FAF3E1]" : "bg-[#F5EFEB]"}
                  />
                ))
              ) : (
                <>
                  <SalonRow
                    initial="T"
                    name="The Scissors Edge"
                    meta="Saheed Nagar · Unisex · 4.8 Rating"
                    wait="5 min"
                    status="available"
                    tint="bg-[#F7EFE9]"
                  />
                  <SalonRow
                    initial="U"
                    name="Urban Look Salon"
                    meta="Jaydev Vihar · Men's · 4.6 Rating"
                    wait="10 min"
                    status="finishing"
                    tint="bg-[#FAF3E1]"
                  />
                  <SalonRow
                    initial="S"
                    name="Style Studio by Jawed Habib"
                    meta="Patia · Premium · 4.7 Rating"
                    wait="15 min"
                    status="busy"
                    tint="bg-[#F5EFEB]"
                  />
                </>
              )}
            </div>

            {/* Fastest Chair Callout */}
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#1B1410] px-4 py-3.5 group-hover:bg-[#8A4C24] transition-all">
              <div className="text-[13px] font-medium text-white/80">
                Shortest wait right now
              </div>
              <div className="font-mono-tabular text-[15px] font-bold text-white transition-all">
                {topSalon.waitTime || 5} min · {topSalon.name}
              </div>
            </div>
          </div>

          {/* Floating Live Badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1B1410] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
            <span>Updated Just Now</span>
          </div>
        </Link>
      </Tilt3D>
    </div>
  );
}

/* --------------------------- How it works --------------------------- */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Check the wait",
      copy: "Open Snepr to see live minutes for every barber chair before leaving your house.",
      preview: <MiniSeeWait />,
    },
    {
      n: "02",
      title: "Tap to save your chair",
      copy: "Pick your stylist and take your digital ticket. Your spot is locked in instantly.",
      preview: <MiniJoin />,
    },
    {
      n: "03",
      title: "Walk straight in",
      copy: "We ping you 10 minutes before your turn. Arrive and step right into the chair.",
      preview: <MiniWalkIn />,
    },
  ];
  return (
    <section id="how" className="px-4 py-16 sm:px-6 sm:py-24 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F7EFE9] border border-[#ECD9BE] px-3 py-1 text-[12px] font-bold text-[#8A4C24]">
            Three Simple Steps
          </div>
          <h2 className="font-display text-[34px] font-bold leading-[1.05] tracking-tight text-[#1B1410] sm:text-[48px]">
            From your couch to the barber chair.
          </h2>
          <p className="mt-3 text-[16px] text-[#6E6159]">
            Save up to 45 minutes every time you need a haircut.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, idx) => (
            <ScrollCardReveal
              key={s.n}
              delay={idx * 0.14}
              direction={idx === 0 ? "left" : idx === 1 ? "up" : "right"}
              className="rounded-3xl"
            >
              <Tilt3D maxAngle={5} scale={1.02} glare={true} className="rounded-3xl">
              <div
                className="group h-full flex flex-col justify-between rounded-3xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 shadow-sm sm:p-7 transition-all hover:border-[#8A4C24] hover:shadow-lg"
              >
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono-tabular text-[13px] font-bold text-[#8A4C24]">
                      {s.n}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#8A4C24]" />
                  </div>
                  <div className="mb-5 overflow-hidden rounded-2xl bg-white border border-[#E8E1D7]/70 p-4 shadow-xs">
                    {s.preview}
                  </div>
                  <h3 className="text-[20px] font-bold text-[#1B1410]">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#6E6159]">
                    {s.copy}
                  </p>
                </div>
              </div>
            </Tilt3D>
            </ScrollCardReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniSeeWait() {
  return (
    <div className="space-y-2">
      {[
        { name: "Chair 1 (Rajesh)", w: "5 min", s: "available" as QueueStatus },
        { name: "Chair 2 (Aman)", w: "12 min", s: "finishing" as QueueStatus },
        { name: "Chair 3 (Sameer)", w: "25 min", s: "busy" as QueueStatus },
      ].map((r) => (
        <div
          key={r.name}
          className="flex items-center justify-between rounded-xl bg-[#FAF7F2] px-3 py-2 text-xs"
        >
          <div className="flex items-center gap-2">
            <StatusDot status={r.s} />
            <span className="font-semibold text-[#1B1410]">{r.name}</span>
          </div>
          <span className="font-mono-tabular font-bold text-[#1B1410]">
            {r.w}
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniJoin() {
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="rounded-xl bg-[#FAF7F2] p-3 text-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6159]">
          Your Confirmed Token
        </div>
        <div className="mt-1 font-mono-tabular text-[24px] font-bold text-[#1B1410]">
          #B-15
        </div>
        <div className="text-[11px] text-[#2E7D4F] font-semibold mt-0.5">
          2 people ahead of you
        </div>
      </div>
      <div className="flex w-full items-center justify-center rounded-xl bg-[#1B1410] py-2.5 text-[12.5px] font-bold text-white shadow-xs">
        Token Active
      </div>
    </div>
  );
}

function MiniWalkIn() {
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="rounded-xl bg-[#EBF7EE] border border-[#BBE1C8] p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1C5434]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1C5434] animate-pulse" />
          You're Up Next
        </div>
        <div className="mt-1 font-mono-tabular text-[22px] font-bold text-[#1B1410]">
          Chair 1 · Ready
        </div>
      </div>
      <div className="rounded-xl bg-[#FAF7F2] p-2 text-center text-[12px] text-[#6E6159]">
        Time saved: <span className="font-bold text-[#1B1410]">35 minutes</span>
      </div>
    </div>
  );
}

/* ---------------------- Get Snepr CTA ---------------------- */
function GetSnepr() {
  return (
    <section id="get" className="px-4 py-16 sm:px-6 sm:py-24 bg-[#FAF7F2]">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-[38px] font-bold leading-[1.05] tracking-tight text-[#1B1410] sm:text-[56px]">
          Ready to skip the wait?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-[#6E6159]">
          Free for all customers. No signup needed. Join live queues across top salons right now.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/live"
            className="shimmer-hover inline-flex h-14 items-center gap-2 rounded-2xl bg-[#1B1410] px-8 text-[16px] font-bold text-white shadow-md hover:bg-[#8A4C24] hover:scale-[1.02] transition-all"
          >
            Find a salon near you
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#pricing"
            className="inline-flex h-14 items-center rounded-2xl border border-[#E8E1D7] bg-white px-7 text-[15px] font-semibold text-[#1B1410] hover:bg-[#F5EFEB] transition-all"
          >
            I own a salon
          </a>
        </div>

        <p className="mt-5 text-[13px] text-[#9C9089]">
          Works on any phone · Instant browser access · Zero downloads required
        </p>
      </div>
    </section>
  );
}

/* ---------------------- Sticky mobile CTA ---------------------- */
function StickyMobileCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E8E1D7] bg-white/95 px-4 pb-3 pt-3 backdrop-blur md:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
    >
      <Link to="/live" className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#1B1410] py-3.5 text-[15px] font-bold text-white shadow-md active:scale-95 transition">
        <MapPin className="h-5 w-5" />
        Find a salon near you
      </Link>
    </div>
  );
}

/* ---------------------- Page ---------------------- */
function SneprLanding() {
  return (
    <div className="min-h-screen bg-background text-ink relative overflow-hidden">
      <ScrollProgressBar />
      <ParallaxOrbs />
      <main>
        <Hero />
        <ScrollCardReveal delay={0.1} direction="up"><InteractivePhoneSimulator /></ScrollCardReveal>
        <HowItWorks />
        <AiStudioShowcase />
        <PillarsSection />
        <PricingSection />
        <FaqSection />
        <GetSnepr />
      </main>
      <StickyMobileCTA />
    </div>
  );
}
