import React from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Scissors, ArrowRight, CheckCircle2 } from "lucide-react";
import { Tilt3D } from "@/components/ui/Tilt3D";
import { ScrollCardReveal } from "@/components/ui/ScrollCardReveal";

export function AiStudioShowcase() {
  const trendingCuts = [
    {
      name: "Low Taper Fade",
      price: "Rs. 350",
      time: "25 min",
      match: "Best for Oval & Square face",
      tags: ["Modern Fade", "Clean Edge"],
    },
    {
      name: "Textured French Crop",
      price: "Rs. 250",
      time: "20 min",
      match: "Best for Angular & Round face",
      tags: ["Low Maintenance", "Youth Favorite"],
    },
    {
      name: "Modern Pompadour",
      price: "Rs. 400",
      time: "35 min",
      match: "Best for Square & Diamond face",
      tags: ["Executive", "High Volume"],
    },
    {
      name: "Classic Gentleman Taper",
      price: "Rs. 200",
      time: "15 min",
      match: "Universal Face Fit",
      tags: ["Formal", "Subtle"],
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 bg-[#FAF7F2] text-[#2C2420] relative">
      <div className="mx-auto max-w-6xl">
        <ScrollCardReveal delay={0.05} direction="up" className="rounded-[40px]">
          <div className="rounded-[40px] border border-[#ECD9BE] bg-white p-8 shadow-sm sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              {/* Left Info */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF3E1] border border-[#F0DCAB] px-3.5 py-1 text-[12px] font-bold text-[#705217] shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Hair Studio</span>
                </div>
                <h2 className="mt-4 font-display text-[32px] font-bold tracking-tight text-[#1B1410] sm:text-[44px] leading-tight">
                  Try any haircut on your face before the scissors touch your hair.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[#6E6159]">
                  Never worry about a bad haircut again. Pick from 50+ trending styles, see how they fit your face shape in realistic 3D, and show the exact photo to your barber.
                </p>

                <div className="mt-6 space-y-2.5 text-[14px] text-[#6E6159]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1C5434]" />
                    <span>50+ trending fades, crops, and classic tapers</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1C5434]" />
                    <span>Show your barber the exact cut so you get what you want</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1C5434]" />
                    <span>See real service prices in Rs. with zero hidden fees</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/live/studio"
                    className="shimmer-hover inline-flex h-13 items-center gap-2 rounded-2xl bg-[#1B1410] px-6 text-[15px] font-bold text-white shadow-sm transition-all hover:bg-[#8A4C24] hover:scale-[1.02]"
                  >
                    <span>Launch AI Studio</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/live"
                    className="inline-flex h-13 items-center rounded-2xl border border-[#E8E1D7] bg-[#FAF7F2] px-5 text-[14px] font-semibold text-[#1B1410] transition-all hover:bg-[#F5EFEB]"
                  >
                    Live Queues
                  </Link>
                </div>
              </div>

              {/* Right Trending Grid with 3D Tilt & Staggered Scroll Reveal */}
              <div className="grid gap-3.5 sm:grid-cols-2">
                {trendingCuts.map((cut, idx) => (
                  <ScrollCardReveal
                    key={cut.name}
                    delay={0.1 + idx * 0.12}
                    direction={idx % 2 === 0 ? "left" : "right"}
                    className="rounded-[24px]"
                  >
                    <Tilt3D maxAngle={6} scale={1.03} glare={true} className="rounded-[24px]">
                      <div
                        className="h-full rounded-[24px] border border-[#E8E1D7] bg-[#FAF7F2] p-5 transition-all hover:border-[#8A4C24] hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-display text-[16px] font-bold text-[#1B1410]">
                              {cut.name}
                            </h3>
                            <div className="text-[12px] font-semibold text-[#8A4C24] mt-0.5">
                              {cut.price} • {cut.time}
                            </div>
                          </div>
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#8A4C24] border border-[#E8E1D7] shadow-sm">
                            <Scissors className="h-3.5 w-3.5" />
                          </span>
                        </div>

                        <div className="mt-3 text-[12px] text-[#6E6159]">
                          {cut.match}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {cut.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-medium text-[#6E6159] border border-[#E8E1D7]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Tilt3D>
                  </ScrollCardReveal>
                ))}
              </div>
            </div>
          </div>
        </ScrollCardReveal>
      </div>
    </section>
  );
}
