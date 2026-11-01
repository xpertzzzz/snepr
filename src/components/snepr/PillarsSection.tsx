import React from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Award, Sparkles, ArrowRight, Check } from "lucide-react";
import { Tilt3D } from "@/components/ui/Tilt3D";
import { ScrollCardReveal } from "@/components/ui/ScrollCardReveal";

export function PillarsSection() {
  const features = [
    {
      id: "verified",
      title: "100% Real Customers Only",
      desc: "You can only write a review after your haircut is scanned and completed at the salon counter. Zero bots, zero fake reviews, and zero paid promotion.",
      tag: "Pure Integrity",
      badgeBg: "bg-[#EBF7EE]",
      badgeColor: "text-[#1C5434]",
      badgeBorder: "border-[#BBE1C8]",
      icon: ShieldCheck,
      stat: "Zero Fake Reviews",
    },
    {
      id: "reward",
      title: "Rs. 10 Off on Every Review",
      desc: "Rate 1 star if the barber was running late, or 5 stars if your fade was flawless. You earn +10 Snepr Points (= Rs. 10) no matter your rating. Salons cannot delete critical feedback.",
      tag: "+10 Points Guaranteed",
      badgeBg: "bg-[#FAF3E1]",
      badgeColor: "text-[#705217]",
      badgeBorder: "border-[#F0DCAB]",
      icon: Award,
      stat: "1 Star or 5 Stars",
    },
    {
      id: "redeem",
      title: "Direct Bill Discounts",
      desc: "1 Snepr Point = Rs. 1 cash discount. Use your points at checkout across any partner salon in the city for up to 20% off your service bill.",
      tag: "1 Point = Rs. 1",
      badgeBg: "bg-[#F7EFE9]",
      badgeColor: "text-[#8A4C24]",
      badgeBorder: "border-[#ECD9BE]",
      icon: Sparkles,
      stat: "Instant Savings",
    },
  ];

  return (
    <section id="loyalty" className="px-4 py-16 sm:px-6 sm:py-24 bg-white text-[#2C2420] relative overflow-hidden">
      <div className="mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF3E1] border border-[#F0DCAB] px-3.5 py-1.5 text-[12px] font-bold text-[#705217] shadow-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Honest Loyalty Engine</span>
          </div>
          <h2 className="mt-4 font-display text-[34px] font-bold tracking-tight text-[#1B1410] sm:text-[46px] leading-[1.08]">
            Reviews you can trust. Points you can actually spend.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[#6E6159] sm:text-[17px]">
            Most booking apps let businesses hide bad ratings. Snepr rewards verified honesty: share your real experience and get direct cash discounts on future visits.
          </p>
        </div>

        {/* 3 Creative 3D Cards with On-Scroll Reveal */}
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            const dir = i === 0 ? "left" : i === 1 ? "up" : "right";
            return (
              <ScrollCardReveal
                key={f.id}
                delay={i * 0.15}
                direction={dir}
                className="flex flex-col h-full rounded-[32px]"
              >
                <Tilt3D maxAngle={6} scale={1.02} glare={true} className="flex flex-col h-full rounded-[32px]">
                  <div className="group flex flex-col h-full justify-between rounded-[32px] border border-[#E8E1D7] bg-[#FAF7F2] p-8 transition-all hover:border-[#8A4C24] hover:shadow-lg">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${f.badgeBg} ${f.badgeColor} ${f.badgeBorder}`}>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{f.tag}</span>
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#9C9089]">
                          {f.stat}
                        </span>
                      </div>

                      <h3 className="mt-6 font-display text-[21px] font-bold text-[#1B1410] leading-snug">
                        {f.title}
                      </h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-[#6E6159]">
                        {f.desc}
                      </p>
                    </div>

                    <div className="mt-8 pt-5 border-t border-[#E8E1D7] flex items-center justify-between text-[13px] font-bold text-[#1B1410]">
                      <span className="text-[#8A4C24]">Fair Reward Standard</span>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-white border border-[#E8E1D7] shadow-xs group-hover:scale-110 transition-transform text-[#8A4C24]">
                        <Check className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Tilt3D>
              </ScrollCardReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
