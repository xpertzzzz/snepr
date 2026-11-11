import React, { useState } from "react";
import {
  Gift,
  Share2,
  Copy,
  Check,
  Users,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ReferralHub() {
  const [copiedCustomer, setCopiedCustomer] = useState(false);
  const [copiedSalon, setCopiedSalon] = useState(false);

  const customerCode = "SNEPR-7X9K";
  const customerLink = `https://snepr.in/join?ref=${customerCode}`;
  const salonLink = `https://snepr.in/partner/register?aff=${customerCode}`;

  const copyToClipboard = (text: string, isCustomer: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCustomer) {
      setCopiedCustomer(true);
      setTimeout(() => setCopiedCustomer(false), 2000);
    } else {
      setCopiedSalon(true);
      setTimeout(() => setCopiedSalon(false), 2000);
    }
    toast.success("Referral link copied to clipboard!");
  };

  const shareOnWhatsApp = (text: string, url: string) => {
    const shareText = encodeURIComponent(`${text}\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFEAE2] text-[#7A4B29]">
          <Gift className="w-3.5 h-3.5" />
          Snepr Community Rewards
        </span>
        <h1 className="text-3xl font-extrabold text-[#1C1613]">
          Invite Friends & Salons
        </h1>
        <p className="text-xs sm:text-sm text-[#786D65] leading-relaxed">
          Share Snepr with your friends to skip the waiting room together, or invite local barbers to get them on digital queues.
        </p>
      </div>

      {/* 2 Cards: Customer Referral vs Salon Partner Referral */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Customer Referral Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EEE7DC] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F5EFE6] text-[#7A4B29] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1613]">
                  Invite Friends & Family
                </h3>
                <span className="text-xs text-[#786D65]">
                  Give friends 50 Snepr Points on their first visit
                </span>
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D7] space-y-3 mb-5">
              <div className="flex justify-between items-center text-xs text-[#786D65]">
                <span>Your Referral Code</span>
                <span className="font-mono font-bold text-[#1C1613] text-sm bg-white px-2 py-0.5 rounded-md border border-[#DDD3C5]">
                  {customerCode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={customerLink}
                  className="w-full text-xs bg-white border border-[#D5CABB] rounded-xl px-3 py-2 text-[#4A3F35] outline-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(customerLink, true)}
                  className="rounded-xl border-[#D5CABB] text-xs h-9 px-3 shrink-0 cursor-pointer"
                >
                  {copiedCustomer ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={() =>
                shareOnWhatsApp(
                  "Check live salon queues in Bhubaneswar and skip the waiting room on Snepr! Use my invite code:",
                  customerLink
                )
              }
              className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share on WhatsApp
            </Button>
          </div>
        </div>

        {/* 2. Salon Partner Referral Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EEE7DC] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF4F8] text-[#2C5282] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1613]">
                  Refer a Salon or Barber
                </h3>
                <span className="text-xs text-[#786D65]">
                  Help salons save hours with zero commission queues
                </span>
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D7] space-y-3 mb-5">
              <div className="flex justify-between items-center text-xs text-[#786D65]">
                <span>Salon Partner Link</span>
                <span className="text-[11px] font-semibold text-[#2C5282]">
                  0% Commission
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={salonLink}
                  className="w-full text-xs bg-white border border-[#D5CABB] rounded-xl px-3 py-2 text-[#4A3F35] outline-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(salonLink, false)}
                  className="rounded-xl border-[#D5CABB] text-xs h-9 px-3 shrink-0 cursor-pointer"
                >
                  {copiedSalon ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={() =>
                shareOnWhatsApp(
                  "Hey, check out Snepr SalonOS — digital queue management and live chair booking for Bhubaneswar salons from ₹199/mo with 0% commissions:",
                  salonLink
                )
              }
              className="w-full rounded-full bg-[#1C1613] hover:bg-[#3D2E24] text-white text-xs font-semibold py-2.5 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              Invite Salon Owner
            </Button>
          </div>
        </div>
      </div>

      {/* Program Disclaimer */}
      <div className="bg-[#FAF7F2] border border-[#E8E1D7] rounded-2xl p-4 text-xs text-[#786D65] flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#7A4B29] shrink-0" />
        <span>
          <strong>Referral Program Policy:</strong> Referral rewards and points are credited automatically upon verified first haircut completion. Anti-fraud checks apply.
        </span>
      </div>
    </div>
  );
}

