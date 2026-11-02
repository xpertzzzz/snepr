import { Link } from "@tanstack/react-router";
import { Compass, Sparkles, Ticket, Award, Store } from "lucide-react";
import { useState, useEffect } from "react";

interface DockNavbarProps {
  activeTab: "explore" | "studio" | "pass" | "points" | "salonos";
}

export function DockNavbar({ activeTab }: DockNavbarProps) {
  const [hasActiveToken, setHasActiveToken] = useState(false);

  useEffect(() => {
    try {
      const activeQueue = localStorage.getItem("snepr_active_queue");
      if (activeQueue) {
        setHasActiveToken(true);
      }
    } catch {}
  }, []);

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-28px)] max-w-[420px] h-[64px] rounded-full bg-[#1B1410]/95 backdrop-blur-xl border border-white/12 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.5)] flex items-center justify-around px-3 z-50 select-none"
      aria-label="Mobile Dock Navigation"
    >
      {/* 1. EXPLORE */}
      <Link
        to="/live"
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === "explore"
            ? "text-[#C8993E] scale-105"
            : "text-[#FAF7F2]/60 hover:text-[#FAF7F2]"
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">Live</span>
      </Link>

      {/* 2. AI STUDIO */}
      <Link
        to="/live/studio"
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === "studio"
            ? "text-[#C8993E] scale-105"
            : "text-[#FAF7F2]/60 hover:text-[#FAF7F2]"
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">AI Studio</span>
      </Link>

      {/* 3. DIGITAL PASS (CENTER FAB) */}
      <Link
        to="/live/queue"
        className="relative -top-3.5 flex flex-col items-center group cursor-pointer"
        aria-label="Digital Pass"
      >
        <div
          className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-white border-2 border-[#FAF7F2] shadow-[0_8px_20px_rgba(138,76,36,0.5)] transition-transform duration-200 group-hover:scale-108 ${
            activeTab === "pass"
              ? "bg-gradient-to-tr from-[#8A4C24] via-[#C8993E] to-[#FAF3E1] ring-2 ring-[#C8993E]/40"
              : "bg-gradient-to-tr from-[#2C1D16] to-[#8A4C24]"
          }`}
        >
          <Ticket className="w-6 h-6 rotate-45" />
          {hasActiveToken && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D4F] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2E7D4F] border-2 border-[#1B1410]" />
            </span>
          )}
        </div>
        <span
          className={`text-[9.5px] font-bold tracking-tight mt-0.5 ${
            activeTab === "pass" ? "text-[#C8993E]" : "text-[#FAF7F2]/75"
          }`}
        >
          Pass
        </span>
      </Link>

      {/* 4. POINTS & LOYALTY */}
      <Link
        to="/live/activity"
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === "points"
            ? "text-[#C8993E] scale-105"
            : "text-[#FAF7F2]/60 hover:text-[#FAF7F2]"
        }`}
      >
        <Award className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">Points</span>
      </Link>

      {/* 5. SALON OS */}
      <Link
        to="/salon"
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === "salonos"
            ? "text-[#C8993E] scale-105"
            : "text-[#FAF7F2]/60 hover:text-[#FAF7F2]"
        }`}
      >
        <Store className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">SalonOS</span>
      </Link>
    </nav>
  );
}

