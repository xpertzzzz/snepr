import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SNEPR_PLANS, SubscriptionTierId, formatINR } from "@/config/subscriptions";
import { Check, ShieldCheck, Sparkles, Crown, Zap } from "lucide-react";
import { toast } from "sonner";

interface SubscriptionUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanId?: SubscriptionTierId | string;
  onSelectPlan?: (planId: SubscriptionTierId) => void;
}

export function SubscriptionUpgradeModal({
  open,
  onOpenChange,
  currentPlanId = "base",
  onSelectPlan,
}: SubscriptionUpgradeModalProps) {
  const handleSelect = (planId: SubscriptionTierId) => {
    if (planId === currentPlanId) return;
    if (onSelectPlan) {
      onSelectPlan(planId);
      onOpenChange(false);
    } else {
      toast.success(`Selected ${SNEPR_PLANS[planId].name} plan (${formatINR(SNEPR_PLANS[planId].priceINR)}/month). Redirecting to billing...`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#FAF7F2] border border-[#E8E1D7] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center max-w-xl mx-auto mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFEAE2] text-[#7A4B29] mx-auto mb-2">
            <Zap className="w-3.5 h-3.5" />
            Transparent Software Subscriptions • 0% Commission
          </span>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-[#1C1613]">
            Upgrade Your SalonOS Workspace
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-[#786D65] mt-1.5">
            Switch plans anytime. Keep 100% of haircut earnings. Customer queue joining is always 100% free on all plans.
          </DialogDescription>
        </DialogHeader>

        {/* 3 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {(["base", "intermediate", "pro"] as SubscriptionTierId[]).map((tierId) => {
            const plan = SNEPR_PLANS[tierId];
            const isCurrent = currentPlanId === tierId;
            const isPopular = tierId === "intermediate";

            return (
              <div
                key={tierId}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all ${
                  isPopular
                    ? "bg-[#1C1613] text-white border-2 border-[#D4A17B] shadow-xl relative"
                    : "bg-white text-[#1C1613] border border-[#E8E1D7] shadow-xs"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A17B] text-[#1C1613] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isPopular
                          ? "bg-[#2C241F] text-[#D4A17B]"
                          : "bg-[#F5EFE6] text-[#7A4B29]"
                      }`}
                    >
                      {plan.name}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isPopular ? "text-[#D8CEBF]" : "text-[#786D65]"
                      }`}
                    >
                      {plan.maxChairs === "unlimited" ? "Unlimited Chairs" : `${plan.maxChairs} Chair${plan.maxChairs > 1 ? "s" : ""}`}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-extrabold font-sans">
                      {formatINR(plan.priceINR)}
                    </span>
                    <span
                      className={`text-xs ${
                        isPopular ? "text-[#A89C8F]" : "text-[#786D65]"
                      }`}
                    >
                      {" "}/month
                    </span>
                    <p
                      className={`text-xs mt-2 leading-relaxed ${
                        isPopular ? "text-[#D8CEBF]" : "text-[#6B6056]"
                      }`}
                    >
                      {plan.tagline}
                    </p>
                  </div>

                  <div
                    className={`space-y-2.5 pt-4 border-t ${
                      isPopular ? "border-[#382F28]" : "border-[#F0EAE2]"
                    } mb-6`}
                  >
                    {plan.highlightedPerks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Check
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isPopular ? "text-[#D4A17B]" : "text-emerald-600"
                          }`}
                        />
                        <span
                          className={isPopular ? "text-[#EFEAE2]" : "text-[#3D332B]"}
                        >
                          {perk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {isCurrent ? (
                    <Button
                      disabled
                      className="w-full rounded-full bg-[#E5DDCF] text-[#6E6358] text-xs font-semibold cursor-not-allowed"
                    >
                      Current Active Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSelect(tierId)}
                      className={`w-full rounded-full text-xs font-bold py-2.5 transition-all shadow-sm cursor-pointer ${
                        isPopular
                          ? "bg-[#D4A17B] hover:bg-[#E5B58F] text-[#1C1613]"
                          : "bg-[#1C1613] hover:bg-[#3D2E24] text-white"
                      }`}
                    >
                      Upgrade to {plan.name}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Customer Queue Guarantee Banner */}
        <div className="bg-[#EFE7DC] border border-[#DDD3C5] rounded-2xl p-4 text-center text-xs text-[#4A3F35] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#7A4B29]" />
          <span>
            <strong>Zero Customer Fees Guarantee:</strong> Customers searching salons, checking live chair wait times, and taking digital tokens are always 100% free.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

