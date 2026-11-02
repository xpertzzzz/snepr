import React from "react";

type Props = {
  className?: string;
  color?: string;
  height?: number;
};

/**
 * Official Snepr Wordmark Logo Component.
 * Uses high-resolution Snepr logo with transparent background (2143x734).
 * Automatically switches to white transparent logo for dark backgrounds.
 */
export function SneprWordmark({ className = "", color = "currentColor", height = 32 }: Props) {
  const isWhite =
    color === "#FFFFFF" ||
    color === "#ffffff" ||
    color === "white" ||
    color === "#fff";

  const src = isWhite
    ? "/snepr-logo-white-transparent.png"
    : "/snepr-logo-transparent.png";

  const width = Math.round(height * (2143 / 734));

  return (
    <img
      src={src}
      alt="Snepr"
      width={width}
      height={height}
      style={{ height: `${height}px`, width: "auto", display: "inline-block" }}
      className={`object-contain select-none ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}

export default SneprWordmark;
