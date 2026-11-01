import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I need to download an app to take a queue token?",
      a: "No. You can join any salon queue right in your mobile phone browser at snepr.in or by scanning the QR standee at the salon entrance. It works instantly without forcing an app download or account setup.",
    },
    {
      q: "How does the Rs. 10 review reward work?",
      a: "After your haircut is verified at the counter, you can leave a quick review. You receive 10 Snepr Points (= Rs. 10 discount on your next visit) whether you rate 1 star or 5 stars. Businesses cannot delete reviews or pay to hide bad feedback.",
    },
    {
      q: "How are wait times calculated so accurately?",
      a: "Other apps make blunt 30-minute guesses. Snepr tracks actual chair service times. If Chair 1 is finishing a quick 10-minute beard trim and Chair 2 has a 45-minute hair spa, Snepr directs you to the chair that will actually be free first.",
    },
    {
      q: "How do I redeem my Snepr Points?",
      a: "1 Snepr Point = Rs. 1. Once you reach 100 points, you can redeem them for up to 20% off your bill at any partner salon.",
    },
    {
      q: "Why do salons prefer Snepr over typical booking apps?",
      a: "Aggregator apps take a massive 20% to 30% cut from every haircut—costing busy salons Rs. 25,000 to Rs. 40,000 every month in commissions. Snepr charges a flat subscription starting at Rs. 199/month, so barbers keep 100% of their earnings.",
    },
    {
      q: "How quickly can a salon owner get started?",
      a: "In under 5 minutes. Register your salon, set up your chairs, and immediately print your personalized QR counter standee.",
    },
  ];

  return (
    <section id="faq" className="px-4 py-16 sm:px-6 sm:py-24 bg-white text-[#2C2420]">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F5EFEB] border border-[#E8E1D7] px-3.5 py-1.5 text-[12px] font-bold text-[#6E6159] shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Clear Answers</span>
          </div>
          <h2 className="mt-4 font-display text-[34px] font-bold tracking-tight text-[#1B1410] sm:text-[44px] leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-[16px] text-[#6E6159]">
            Everything you need to know about live salon queues, points, and pricing.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-[24px] border border-[#E8E1D7] bg-[#FAF7F2] transition-all hover:border-[#8A4C24]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors"
                >
                  <span className="font-display text-[17px] font-bold text-[#1B1410] pr-4">
                    {faq.q}
                  </span>
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white border border-[#E8E1D7] text-[#1B1410] transition-transform duration-200 ${
                    isOpen ? "rotate-180 bg-[#1B1410] text-white border-[#1B1410]" : ""
                  }`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-[14.5px] leading-relaxed text-[#6E6159] border-t border-[#E8E1D7]/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
