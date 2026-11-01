import React, { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollCardRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // seconds
  direction?: "up" | "left" | "right" | "scale";
  threshold?: number;
}

export function ScrollCardReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.12,
}: ScrollCardRevealProps) {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold]);

  const dirClass =
    direction === "left"
      ? "card-reveal-left"
      : direction === "right"
      ? "card-reveal-right"
      : direction === "scale"
      ? "card-reveal-scale"
      : "card-reveal-up";

  return (
    <div
      ref={domRef}
      className={`card-reveal ${dirClass} ${isVisible ? "in" : ""} ${className}`}
      style={{ "--delay": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function AnimatedNumber({
  target,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const domRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
            observer.disconnect();

            const startTime = performance.now();
            const updateCount = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(ease * target));
              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                setCount(target);
              }
            };
            requestAnimationFrame(updateCount);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration, started]);

  return (
    <span ref={domRef}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

