import React, { useEffect, useRef, useState } from "react";

/**
 * ─── HERO SCISSOR STRAND ANIMATION ───
 * Pinned desktop 230vh container. Scissors track SVG path on scroll.
 * Clipped left group falls, rotates and fades as scissors cut.
 * Blades idle open/close at scroll 0.
 * On mobile (<900px or <620px), unpinned progress from viewport.
 */
export function HeroScissorStrand() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const scissorsRef = useRef<SVGGElement>(null);
  const cutHairRef = useRef<SVGGElement>(null);
  const upperBladeRef = useRef<SVGPathElement>(null);
  const lowerBladeRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    let rafId: number;

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        const path = pathRef.current;
        const scissors = scissorsRef.current;
        const cutHair = cutHairRef.current;
        if (!container || !path || !scissors) return;

        const rect = container.getBoundingClientRect();
        const winH = window.innerHeight;
        const winW = window.innerWidth;
        const isMobile = winW < 900 || winH < 620;

        let progress = 0;
        if (isMobile) {
          // Progress from strand position in viewport
          const top = rect.top;
          const total = winH + rect.height;
          progress = Math.max(0, Math.min(1, (winH - top) / total));
        } else {
          // Progress from pinned scroll inside 230vh wrapper
          const scrollDistance = rect.height - winH;
          const currentScroll = -rect.top;
          progress = Math.max(0, Math.min(1, currentScroll / scrollDistance));
        }

        const len = path.getTotalLength();
        const dist = progress * len;
        const p1 = path.getPointAtLength(dist);
        const p2 = path.getPointAtLength(Math.min(len, dist + 2));
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

        // Position scissors
        scissors.setAttribute(
          "transform",
          `translate(${p1.x}, ${p1.y}) rotate(${angle})`
        );

        // Blade snipping angle based on scroll delta or idle
        if (progress > 0.01 && upperBladeRef.current && lowerBladeRef.current) {
          const snipCycle = Math.sin(progress * 60) * 16;
          upperBladeRef.current.setAttribute("transform", `rotate(${-snipCycle}, 0, 0)`);
          lowerBladeRef.current.setAttribute("transform", `rotate(${snipCycle}, 0, 0)`);
        }

        // Left hair falling / fading
        if (cutHairRef.current) {
          const fallDist = progress * 65;
          const rotateDeg = progress * 14;
          const opacity = Math.max(0, 1 - progress * 1.3);
          cutHairRef.current.setAttribute(
            "transform",
            `translate(0, ${fallDist}) rotate(${rotateDeg}, ${p1.x / 2}, ${p1.y})`
          );
          cutHairRef.current.style.opacity = `${opacity}`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-strand-viewport pointer-events-none absolute inset-x-0 bottom-0 h-48 overflow-visible z-10"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 1200 180"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id="hero-hair-clip-right">
            <rect x="0" y="0" width="1200" height="180" />
          </clipPath>
          <style>{`
            @keyframes hero-blade-idle-upper {
              0%, 100% { transform: rotate(-14deg); }
              50% { transform: rotate(5deg); }
            }
            @keyframes hero-blade-idle-lower {
              0%, 100% { transform: rotate(14deg); }
              50% { transform: rotate(-5deg); }
            }
            .hero-idle-upper {
              transform-origin: 0px 0px;
              animation: hero-blade-idle-upper 1.4s ease-in-out infinite;
            }
            .hero-idle-lower {
              transform-origin: 0px 0px;
              animation: hero-blade-idle-lower 1.4s ease-in-out infinite;
            }
          `}</style>
        </defs>

        {/* Falling cut hair group on the left */}
        <g ref={cutHairRef}>
          <path
            d="M 0 90 Q 300 150, 600 80 T 1200 110"
            stroke="#8c4d27"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 0 94 Q 300 154, 600 84 T 1200 114"
            stroke="#6f3c1d"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 0 86 Q 300 146, 600 76 T 1200 106"
            stroke="#a6653f"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* Master Strand Path (Traced by scissors) */}
        <path
          ref={pathRef}
          d="M 0 90 Q 300 150, 600 80 T 1200 110"
          stroke="#8c4d27"
          strokeWidth="3.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* Strand remaining lines (5 brown paths) */}
        <path
          d="M 0 94 Q 300 154, 600 84 T 1200 114"
          stroke="#6f3c1d"
          strokeWidth="2.5"
          strokeDasharray="5 5"
          opacity="0.35"
        />
        <path
          d="M 0 86 Q 300 146, 600 76 T 1200 106"
          stroke="#a6653f"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.3"
        />
        <path
          d="M 0 98 Q 300 158, 600 88 T 1200 118"
          stroke="#5a3118"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.25"
        />
        <path
          d="M 0 82 Q 300 142, 600 72 T 1200 102"
          stroke="#b97c55"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.25"
        />

        {/* Scissors following strand */}
        <g ref={scissorsRef} transform="translate(0, 90)">
          {/* Upper Blade */}
          <path
            ref={upperBladeRef}
            className="hero-idle-upper"
            d="M 0 0 L 38 -9 C 40 -9, 41 -8, 40 -7 L 0 3 Z"
            fill="#8c4d27"
            stroke="#6f3c1d"
            strokeWidth="1.5"
          />
          {/* Lower Blade */}
          <path
            ref={lowerBladeRef}
            className="hero-idle-lower"
            d="M 0 0 L 38 9 C 40 9, 41 8, 40 7 L 0 -3 Z"
            fill="#8c4d27"
            stroke="#6f3c1d"
            strokeWidth="1.5"
          />
          {/* Handles */}
          <circle cx="-16" cy="-14" r="9" stroke="#8c4d27" strokeWidth="2.5" fill="none" />
          <line x1="-8" y1="-8" x2="0" y2="0" stroke="#8c4d27" strokeWidth="2.5" />
          <circle cx="-16" cy="14" r="9" stroke="#8c4d27" strokeWidth="2.5" fill="none" />
          <line x1="-8" y1="8" x2="0" y2="0" stroke="#8c4d27" strokeWidth="2.5" />
          {/* Pivot */}
          <circle cx="0" cy="0" r="3.5" fill="#211914" />
          <circle cx="0" cy="0" r="1.5" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}

/**
 * ─── SEAM SCISSOR DIVIDER ───
 * Travels across color seams and eats the dashed line.
 */
export function SeamScissorDivider({ label = "" }: { label?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scissorRef = useRef<HTMLDivElement>(null);
  const cutLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = containerRef.current;
        const scissor = scissorRef.current;
        const cutLine = cutLineRef.current;
        if (!el || !scissor || !cutLine) return;

        const rect = el.getBoundingClientRect();
        const winH = window.innerHeight;
        // Progress based on element scrolling across middle of screen
        const progress = Math.max(
          0,
          Math.min(1, (winH - rect.top) / (winH * 0.8))
        );

        const pct = progress * 100;
        scissor.style.left = `${pct}%`;
        cutLine.style.width = `${pct}%`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-14 overflow-hidden select-none my-2 pointer-events-none"
      aria-hidden="true"
    >
      {/* Background Dashed Line (waiting to be eaten) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-[#d8c8b9]" />

      {/* Foreground Eaten Line */}
      <div
        ref={cutLineRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#8c4d27]"
        style={{ width: "0%" }}
      />

      {/* Optional center tag */}
      {label && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f7f3ed] px-4 text-[10px] uppercase tracking-[2px] font-extrabold text-[#8c4d27]">
          {label}
        </span>
      )}

      {/* Traveling Scissors */}
      <div
        ref={scissorRef}
        className="absolute top-1/2 -translate-y-1/2 -mt-3.5 -ml-4 z-20 flex items-center"
        style={{ left: "0%" }}
      >
        <svg
          className="w-7 h-7 drop-shadow-sm"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g style={{ transformOrigin: "32px 32px", animation: "hero-blade-idle-lower 0.5s infinite" }}>
            <path d="M32 32 L56 26 C57 26 58 27 57 28 L32 34" stroke="#8c4d27" strokeWidth="2.5" fill="#f7f3ed" />
            <circle cx="16" cy="44" r="8" stroke="#8c4d27" strokeWidth="2.5" fill="none" />
            <path d="M22 38 L32 32" stroke="#8c4d27" strokeWidth="2.5" />
          </g>
          <g style={{ transformOrigin: "32px 32px", animation: "hero-blade-idle-upper 0.5s infinite" }}>
            <path d="M32 32 L56 38 C57 38 58 37 57 36 L32 30" stroke="#8c4d27" strokeWidth="2.5" fill="#f7f3ed" />
            <circle cx="16" cy="20" r="8" stroke="#8c4d27" strokeWidth="2.5" fill="none" />
            <path d="M22 26 L32 32" stroke="#8c4d27" strokeWidth="2.5" />
          </g>
          <circle cx="32" cy="32" r="3" fill="#211914" />
        </svg>
      </div>
    </div>
  );
}

/**
 * ─── FINAL BROWN SECTION VERTICAL CUT ───
 * Vertical strand hangs, scissors arrive from left and cuts it.
 * Lower piece falls away, large Snepr wordmark fades in.
 */
export function FinalVerticalStrandCut() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scissorRef = useRef<SVGGElement>(null);
  const bottomStrandRef = useRef<SVGLineElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = containerRef.current;
        const scissor = scissorRef.current;
        const bottomStrand = bottomStrandRef.current;
        const wordmark = wordmarkRef.current;
        if (!el || !scissor || !bottomStrand || !wordmark) return;

        const rect = el.getBoundingClientRect();
        const winH = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (winH - rect.top) / (winH * 0.9)));

        // Scissors approach from left (x: -120 to 140)
        const scissorX = -120 + progress * 260;
        scissor.setAttribute("transform", `translate(${scissorX}, 70)`);

        // If cut occurred (progress > 0.6)
        if (progress > 0.55) {
          const cutProg = (progress - 0.55) / 0.45;
          const fallY = cutProg * 90;
          const rotate = cutProg * 25;
          const opacity = Math.max(0, 1 - cutProg * 1.5);
          bottomStrand.setAttribute(
            "transform",
            `translate(0, ${fallY}) rotate(${rotate}, 150, 70)`
          );
          bottomStrand.style.opacity = `${opacity}`;

          // Wordmark reveals
          wordmark.style.opacity = `${Math.min(1, cutProg * 1.6)}`;
          wordmark.style.transform = `scale(${0.9 + cutProg * 0.1})`;
        } else {
          bottomStrand.setAttribute("transform", "translate(0, 0)");
          bottomStrand.style.opacity = "1";
          wordmark.style.opacity = "0";
          wordmark.style.transform = "scale(0.9)";
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full py-16 flex flex-col items-center justify-center bg-[#8c4d27] text-white overflow-hidden select-none"
    >
      <div className="relative w-72 h-44 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 150">
          {/* Top Hanging Strand - Solid stroke color as required */}
          <line x1="150" y1="0" x2="150" y2="70" stroke="#f7f3ed" strokeWidth="3.5" strokeLinecap="round" />

          {/* Bottom Cut Strand */}
          <line
            ref={bottomStrandRef}
            x1="150"
            y1="70"
            x2="150"
            y2="140"
            stroke="#f7f3ed"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Arriving Scissors from Left */}
          <g ref={scissorRef} transform="translate(-120, 70)">
            <path d="M 0 0 L 36 -8 C 37 -8 38 -7 37 -6 L 0 2" stroke="#fff" strokeWidth="2.5" fill="#8c4d27" />
            <circle cx="-16" cy="-12" r="8" stroke="#fff" strokeWidth="2.5" fill="none" />
            <path d="M 0 0 L 36 8 C 37 8 38 7 37 6 L 0 -2" stroke="#fff" strokeWidth="2.5" fill="#8c4d27" />
            <circle cx="-16" cy="12" r="8" stroke="#fff" strokeWidth="2.5" fill="none" />
            <circle cx="0" cy="0" r="3" fill="#211914" />
          </g>
        </svg>
      </div>

      {/* Big Revealing Snepr Wordmark */}
      <div
        ref={wordmarkRef}
        className="text-center transition-all duration-300 opacity-0"
        style={{ transform: "scale(0.9)" }}
      >
        <div className="font-['Manrope'] text-6xl md:text-8xl font-extrabold tracking-[-0.08em] text-[#fffdfa]">
          sn<span className="text-[#f0c28f]">≡</span>pr
        </div>
        <p className="mt-3 text-sm text-[#f5eee6] tracking-widest uppercase font-semibold">
          Know before you go
        </p>
      </div>
    </div>
  );
}

export default HeroScissorStrand;
