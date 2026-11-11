import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { BHUBANESWAR_AREAS } from "@/lib/real-salons";

interface CustomerOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: any) => void;
}

export function CustomerOnboardingModal({
  open,
  onOpenChange,
  onComplete,
}: CustomerOnboardingModalProps) {
  const [name, setName] = useState("");
  const [preferredArea, setPreferredArea] = useState("Saheed Nagar");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const styleOptions = [
    "Classic Taper Fade",
    "Textured Crop",
    "Buzz Cut & Lineup",
    "Pompadour",
    "Beard Sculpt & Fade",
    "Clean Shave",
  ];

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleSubmit = () => {
    const profile = {
      name: name.trim() || "Customer",
      preferredArea,
      favoriteStyles: selectedStyles,
      onboardingComplete: true,
    };

    try {
      localStorage.setItem("snepr_customer_profile", JSON.stringify(profile));
    } catch {}

    onComplete(profile);
    onOpenChange(false);
    toast.success("Profile preferences saved! You're ready to explore salons.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#FAF7F2] border border-[#E8E1D7] rounded-3xl p-6 sm:p-7 shadow-2xl">
        <DialogHeader className="text-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] border border-[#E8DFD3] mx-auto flex items-center justify-center text-[#7A4B29] mb-2 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-[#1C1613]">
            Welcome to Snepr
          </DialogTitle>
          <DialogDescription className="text-xs text-[#786D65]">
            Set up your grooming profile to get personalized wait-time estimates and salon recommendations in Bhubaneswar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div>
            <label className="text-xs font-medium text-[#4A3F35] block mb-1">
              Your Name (for queue tickets)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D5CABB] rounded-xl outline-none focus:border-[#7A4B29]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#4A3F35] block mb-1">
              Primary Bhubaneswar Neighborhood
            </label>
            <select
              value={preferredArea}
              onChange={(e) => setPreferredArea(e.target.value)}
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
            <label className="text-xs font-medium text-[#4A3F35] block mb-1.5">
              Grooming Preferences (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {styleOptions.map((style) => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#1C1613] text-white border-[#1C1613]"
                        : "bg-white text-[#4A3F35] border-[#D5CABB] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                    {style}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-[#F2ECE3] flex items-center justify-between">
          <button
            type="button"
            onClick={handleSubmit}
            className="text-xs text-[#786D65] hover:text-[#1C1613] underline cursor-pointer"
          >
            Skip for now
          </button>

          <Button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-[#1C1613] hover:bg-[#3D2E24] text-white text-xs font-semibold px-5 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            Save & Explore Salons
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

