import React, { useRef, useEffect, useState } from "react";

export interface NavTabItem {
  id: string;
  label: string;
  icon: string;
  badge?: number | string;
}

interface LiquidBottomNavProps {
  tabs: NavTabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function LiquidBottomNav({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: LiquidBottomNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const [glassStyle, setGlassStyle] = useState<{
    width: number;
    height: number;
    left: number;
  }>({ width: 0, height: 0, left: 0 });
  const [isReady, setIsReady] = useState(false);

  // Position the liquid glass pill over the active button
  const syncGlass = (animate = true) => {
    if (!navRef.current) return;
    const buttons = navRef.current.querySelectorAll<HTMLButtonElement>("button[data-tab]");
    const activeIdx = tabs.findIndex((t) => t.id === activeTab);
    const activeButton = buttons[activeIdx];

    if (activeButton && activeButton.offsetWidth > 0) {
      setGlassStyle({
        width: activeButton.offsetWidth,
        height: activeButton.offsetHeight,
        left: activeButton.offsetLeft,
      });
      setIsReady(true);
    }
  };

  useEffect(() => {
    syncGlass(false);
    const handleResize = () => syncGlass(false);
    window.addEventListener("resize", handleResize);

    // Initial settle
    const t = setTimeout(() => syncGlass(false), 60);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t);
    };
  }, [activeTab, tabs]);

  // Touch / Drag slide interaction
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !navRef.current) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX.current;

    // Fluid drag feedback on glass pill
    if (glassRef.current) {
      glassRef.current.style.transform = `translate3d(${glassStyle.left + deltaX * 0.4}px, 0, 0)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current || !navRef.current) return;
    isDragging.current = false;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX.current;

    // Detect swipe left / right
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (deltaX > 40 && currentIndex > 0) {
      onTabChange(tabs[currentIndex - 1].id);
    } else if (deltaX < -40 && currentIndex < tabs.length - 1) {
      onTabChange(tabs[currentIndex + 1].id);
    } else {
      syncGlass(true);
    }
  };

  return (
    <nav
      ref={navRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Liquid bottom navigation"
      className={`fixed bottom-3 left-4 right-4 z-50 flex items-center justify-between rounded-[22px] border border-[#ECD9BE]/50 bg-[#211812]/95 p-1.5 backdrop-blur-xl shadow-[0_16px_36px_rgba(33,24,18,0.35)] transition-all select-none sm:hidden ${className}`}
    >
      {/* Liquid Gold Capsule Indicator */}
      <div
        ref={glassRef}
        className={`pointer-events-none absolute top-1.5 bottom-1.5 rounded-[18px] bg-gradient-to-r from-[#8A4C24] to-[#A05C2E] shadow-[0_4px_16px_rgba(138,76,36,0.5)] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: `${glassStyle.width}px`,
          transform: `translate3d(${glassStyle.left}px, 0, 0)`,
        }}
      />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            data-tab={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative z-10 flex flex-1 flex-col items-center justify-center py-2 px-1 text-center transition-all border-0 bg-transparent cursor-pointer ${
              isActive ? "text-[#FFFDF9] font-bold scale-[1.02]" : "text-[#D9CBC0] hover:text-white"
            }`}
          >
            <span className="text-[18px] leading-none mb-1">{tab.icon}</span>
            <span className="text-[10px] tracking-tight whitespace-nowrap">{tab.label}</span>
            {tab.badge && (
              <span className="absolute top-1.5 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#E0523D] text-[9px] font-extrabold text-white shadow-xs">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

