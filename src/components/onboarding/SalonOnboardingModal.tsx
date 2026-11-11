import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SNEPR_PLANS, SubscriptionTierId, formatINR } from "@/config/subscriptions";
import { BHUBANESWAR_AREAS } from "@/lib/real-salons";
import {
  validateSalonName,
  validatePhone,
  validateBusinessHours,
  validateServicePrice,
} from "@/lib/validation";
import {
  Building2,
  Clock,
  Scissors,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface SalonOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: any) => void;
}

export function SalonOnboardingModal({
  open,
  onOpenChange,
  onComplete,
}: SalonOnboardingModalProps) {
  const [step, setStep] = useState(1);

  // Form State with draft persistence
  const [formData, setFormData] = useState({
    businessName: "",
    area: "Saheed Nagar",
    address: "",
    phone: "",
    openTime: "09:00",
    closeTime: "21:00",
    haircutPrice: "200",
    haircutDuration: "30",
    beardPrice: "100",
    beardDuration: "20",
    chairCount: 2,
    selectedPlan: "intermediate" as SubscriptionTierId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load saved draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem("snepr_salon_onboarding_draft");
      if (draft) {
        setFormData((prev) => ({ ...prev, ...JSON.parse(draft) }));
      }
    } catch {}
  }, []);

  const saveDraft = () => {
    try {
      localStorage.setItem("snepr_salon_onboarding_draft", JSON.stringify(formData));
      toast.success("Onboarding draft saved. You can resume anytime.");
    } catch {}
  };

  const handleNext = () => {
    setErrors({});

    if (step === 1) {
      const nameVal = validateSalonName(formData.businessName);
      if (!nameVal.isValid) {
        setErrors((prev) => ({ ...prev, businessName: nameVal.error! }));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const phoneVal = validatePhone(formData.phone);
      if (!phoneVal.isValid) {
        setErrors((prev) => ({ ...prev, phone: phoneVal.error! }));
        return;
      }
      const hoursVal = validateBusinessHours(formData.openTime, formData.closeTime);
      if (!hoursVal.isValid) {
        setErrors((prev) => ({ ...prev, hours: hoursVal.error! }));
        return;
      }
      setStep(3);
    } else if (step === 3) {
      const priceVal = validateServicePrice(formData.haircutPrice);
      if (!priceVal.isValid) {
        setErrors((prev) => ({ ...prev, haircutPrice: priceVal.error! }));
        return;
      }
      setStep(4);
    } else if (step === 4) {
      // Completed!
      try {
        localStorage.removeItem("snepr_salon_onboarding_draft");
      } catch {}
      onComplete(formData);
      onOpenChange(false);
      toast.success("Salon onboarding completed! Your digital queue desk is ready.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-[#FAF7F2] border border-[#E8E1D7] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#7A4B29] bg-[#EFE7DC] px-2.5 py-0.5 rounded-full">
              Step {step} of 4
            </span>
            <button
              type="button"
              onClick={saveDraft}
              className="text-xs text-[#786D65] hover:text-[#1C1613] inline-flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3 h-3" /> Save draft
            </button>
          </div>

          <DialogTitle className="text-xl font-bold text-[#1C1613]">
            {step === 1 && "Salon Profile & Location"}
            {step === 2 && "Hours & Contact Details"}
            {step === 3 && "Core Services & Pricing"}
            {step === 4 && "Chairs & Subscription Plan"}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#786D65]">
            {step === 1 && "Enter your salon business name and primary neighborhood."}
            {step === 2 && "Configure walk-in operating hours and customer contact phone."}
            {step === 3 && "Set starting service charges and estimated service durations."}
            {step === 4 && "Select chair capacity and choose your monthly software plan."}
          </DialogDescription>

          {/* Progress Bar */}
          <div className="w-full bg-[#E8E1D7] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#7A4B29] h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </DialogHeader>

        {/* Step 1: Business Details */}
        {step === 1 && (
          <div className="space-y-4 my-4">
            <div>
              <label className="text-xs font-medium text-[#4A3F35] block mb-1">
                Salon Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Royal Fade Lounge"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D5CABB] rounded-xl outline-none focus:border-[#7A4B29]"
              />
              {errors.businessName && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.businessName}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-[#4A3F35] block mb-1">
                Locality / Area in Bhubaneswar *
              </label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D5CABB] rounded-xl outline-none focus:border-[#7A4B29]"
              >
                {BHUBANESWAR_AREAS.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#4A3F35] block mb-1">
                Full Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Plot/Shop number, Landmark..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D5CABB] rounded-xl outline-none focus:border-[#7A4B29]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Hours & Phone */}
        {step === 2 && (
          <div className="space-y-4 my-4">
            <div>
              <label className="text-xs font-medium text-[#4A3F35] block mb-1">
                Primary Contact Number * (10-digit Mobile)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D5CABB] rounded-xl outline-none focus:border-[#7A4B29]"
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#4A3F35] block mb-1">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={formData.openTime}
                  onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D5CABB] rounded-xl outline-none focus:border-[#7A4B29]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#4A3F35] block mb-1">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={formData.closeTime}
                  onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D5CABB] rounded-xl outline-none focus:border-[#7A4B29]"
                />
              </div>
            </div>
            {errors.hours && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.hours}</p>
            )}
          </div>
        )}

        {/* Step 3: Services */}
        {step === 3 && (
          <div className="space-y-4 my-4">
            <div className="p-3 bg-white rounded-2xl border border-[#EEE7DC] space-y-2">
              <span className="text-xs font-bold text-[#1C1613]">Standard Haircut</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#786D65] block">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.haircutPrice}
                    onChange={(e) => setFormData({ ...formData, haircutPrice: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D5CABB] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#786D65] block">Duration (mins)</label>
                  <input
                    type="number"
                    value={formData.haircutDuration}
                    onChange={(e) => setFormData({ ...formData, haircutDuration: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D5CABB] rounded-lg"
                  />
                </div>
              </div>
              {errors.haircutPrice && (
                <p className="text-[11px] text-rose-600">{errors.haircutPrice}</p>
              )}
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#EEE7DC] space-y-2">
              <span className="text-xs font-bold text-[#1C1613]">Beard Trim & Sculpt</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#786D65] block">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.beardPrice}
                    onChange={(e) => setFormData({ ...formData, beardPrice: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D5CABB] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#786D65] block">Duration (mins)</label>
                  <input
                    type="number"
                    value={formData.beardDuration}
                    onChange={(e) => setFormData({ ...formData, beardDuration: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-[#D5CABB] rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Chairs & Plan */}
        {step === 4 && (
          <div className="space-y-4 my-4">
            <div>
              <label className="text-xs font-medium text-[#4A3F35] block mb-1">
                Active Barber Chairs / Stations
              </label>
              <select
                value={formData.chairCount}
                onChange={(e) =>
                  setFormData({ ...formData, chairCount: parseInt(e.target.value, 10) })
                }
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D5CABB] rounded-xl outline-none focus:border-[#7A4B29]"
              >
                <option value={1}>1 Station (Solo barber)</option>
                <option value={2}>2 Stations</option>
                <option value={3}>3 Stations</option>
                <option value={4}>4+ Stations (Studio Master)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#4A3F35] block mb-2">
                Choose Subscription Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["base", "intermediate", "pro"] as SubscriptionTierId[]).map((pId) => {
                  const plan = SNEPR_PLANS[pId];
                  const isSelected = formData.selectedPlan === pId;
                  return (
                    <button
                      key={pId}
                      type="button"
                      onClick={() => setFormData({ ...formData, selectedPlan: pId })}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#1C1613] text-white border-[#7A4B29] shadow-md"
                          : "bg-white text-[#1C1613] border-[#E8E1D7] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div className="font-bold text-xs">{plan.name}</div>
                      <div className="text-sm font-extrabold mt-1">{formatINR(plan.priceINR)}</div>
                      <div className="text-[10px] opacity-75 mt-0.5">/month</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center pt-4 border-t border-[#F2ECE3]">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-full border-[#D8CEBF] text-xs inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            size="sm"
            onClick={handleNext}
            className="rounded-full bg-[#1C1613] hover:bg-[#3D2E24] text-white text-xs font-semibold px-5 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {step === 4 ? "Complete Setup & Launch" : "Continue"}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

