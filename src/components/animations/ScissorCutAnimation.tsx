import React from "react";

interface ScissorCutAnimationProps {
  className?: string;
  cuttingText?: string;
  color?: string;
}

export function ScissorCutAnimation({
  className = "",
  cuttingText = "PRECISE HAIR CUTTING & LIVE QUEUEING",
  color = "#7a4b29",
}: ScissorCutAnimationProps) {
  return (
    <div className={`scissor-animation-container relative my-8 overflow-hidden select-none ${className}`}>
      <style>{`
        @keyframes scissor-snip-upper {
          0%, 100% {
            transform: rotate(-18deg);
          }
          50% {
            transform: rotate(6deg);
          }
        }
        @keyframes scissor-snip-lower {
          0%, 100% {
            transform: rotate(18deg);
          }
          50% {
            transform: rotate(-6deg);
          }
        }
        @keyframes scissor-glide {
          0% {
            left: -5%;
          }
          100% {
            left: 105%;
          }
        }
        @keyframes particle-drop {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.6);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translateY(22px) scale(0.2);
          }
        }
        .blade-upper {
          transform-origin: 32px 32px;
          animation: scissor-snip-upper 0.65s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .blade-lower {
          transform-origin: 32px 32px;
          animation: scissor-snip-lower 0.65s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .scissor-glider {
          animation: scissor-glide 8s linear infinite;
        }
      `}</style>

      {/* Perforated Cutting Line */}
      <div className="relative flex items-center justify-between w-full h-12">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-[#e9dfd5] z-0" />

        {/* Center label */}
        <span className="relative z-10 mx-auto px-4 bg-[#f7f3ed] text-[10px] uppercase tracking-[2.5px] font-extrabold text-[#8c4d27]">
          ✂ {cuttingText}
        </span>

        {/* Moving scissors along the dashed line */}
        <div className="scissor-glider absolute top-1/2 -translate-y-1/2 -mt-4 z-20 flex items-center pointer-events-none">
          <svg
            className="w-8 h-8 drop-shadow-sm"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Lower Blade */}
            <g className="blade-lower">
              <path
                d="M32 32 L56 26 C57 26 58 27 57 28 L32 34"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="#f7f3ed"
              />
              <circle cx="16" cy="44" r="8" stroke={color} strokeWidth="2.5" fill="none" />
              <path d="M22 38 L32 32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Upper Blade */}
            <g className="blade-upper">
              <path
                d="M32 32 L56 38 C57 38 58 37 57 36 L32 30"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="#f7f3ed"
              />
              <circle cx="16" cy="20" r="8" stroke={color} strokeWidth="2.5" fill="none" />
              <path d="M22 26 L32 32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Pivot Screw */}
            <circle cx="32" cy="32" r="3" fill="#211914" />
            <circle cx="32" cy="32" r="1" fill="#fff" />
          </svg>

          {/* Hair / fiber snip particles falling down */}
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#8c4d27] absolute left-6 top-5 opacity-0"
            style={{ animation: "particle-drop 0.65s linear infinite" }}
          />
          <span
            className="w-1 h-1 rounded-full bg-[#c58a25] absolute left-7 top-4 opacity-0"
            style={{ animation: "particle-drop 0.65s linear infinite 0.2s" }}
          />
        </div>
      </div>
    </div>
  );
}

export default ScissorCutAnimation;
