import React, { useEffect, useState } from "react";

export function ParallaxOrbs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Orb 1: Warm Cognac / Amber Top Right */}
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#8A4C24]/10 via-[#C8993E]/8 to-transparent blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(0, ${scrollY * 0.08}px, 0) rotate(${scrollY * 0.02}deg)`,
        }}
      />

      {/* Orb 2: Soft Creamy Emerald Mid Left */}
      <div
        className="absolute top-[40%] -left-48 w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-[#2E7D4F]/8 via-[#8A4C24]/5 to-transparent blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.05}px, 0)`,
        }}
      />

      {/* Orb 3: Gold Warm Halo Bottom Right */}
      <div
        className="absolute top-[75%] -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#C8993E]/10 via-[#F7EFE9] to-transparent blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(0, ${scrollY * 0.04}px, 0)`,
        }}
      />
    </div>
  );
}

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const currentProgress = (window.scrollY / scrollHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#8A4C24] via-[#C8993E] to-[#8A4C24] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(200,153,62,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

