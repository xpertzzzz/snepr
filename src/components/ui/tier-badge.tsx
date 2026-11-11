import React from "react";
import { SubscriptionTierId, SNEPR_PLANS } from "@/config/subscriptions";
import { Crown, Sparkles, ShieldCheck, Lock } from "lucide-react";

interface TierBadgeProps {
  tier: SubscriptionTierId | string | undefined | null;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function TierBadge({
  tier = "base",
  size = "md",
  showIcon = true,
  className = "",
}: TierBadgeProps) {
  const normalizedTier: SubscriptionTierId =
    tier === "pro" ? "pro" : tier === "intermediate" ? "intermediate" : "base";

  const plan = SNEPR_PLANS[normalizedTier];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2 font-semibold",
  };

  const tierStyles = {
    base: "bg-[#F5EFE6] text-[#7A4B29] border-[#DDD2C4]",
    intermediate: "bg-[#EEF4F8] text-[#2C5282] border-[#C8D9E6]",
    pro: "bg-gradient-to-r from-[#211F1B] to-[#38312B] text-[#D4A17B] border-[#52463D] shadow-xs",
  };

  const icons = {
    base: <ShieldCheck className="w-3 h-3 text-[#7A4B29]" />,
    intermediate: <Sparkles className="w-3 h-3 text-[#2C5282]" />,
    pro: <Crown className="w-3 h-3 text-[#D4A17B]" />,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${sizeClasses[size]} ${tierStyles[normalizedTier]} ${className}`}
    >
      {showIcon && icons[normalizedTier]}
      <span>{plan.name}</span>
    </span>
  );
}

export function TierLockedFeature({
  featureName,
  requiredTier = "intermediate",
  onUpgradeClick,
}: {
  featureName: string;
  requiredTier?: "intermediate" | "pro";
  onUpgradeClick?: () => void;
}) {
  const planName = requiredTier === "pro" ? "Pro (₹449/mo)" : "Intermediate (₹400/mo)";

  return (
    <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] border border-[#E8E1D7] rounded-2xl text-xs text-[#786D65]">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#EAE2D7] flex items-center justify-center text-[#7A4B29]">
          <Lock className="w-3.5 h-3.5" />
        </div>
        <span>
          <strong className="text-[#1C1613] font-semibold">{featureName}</strong> is unlocked on the {planName} plan.
        </span>
      </div>

      {onUpgradeClick && (
        <button
          onClick={onUpgradeClick}
          type="button"
          className="text-[#7A4B29] hover:text-[#5A3319] font-semibold underline text-xs cursor-pointer ml-3 shrink-0"
        >
          Upgrade plan
        </button>
      )}
    </div>
  );
}

