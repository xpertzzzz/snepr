import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HelpCircle, Mail, MessageSquare, Phone, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    title: "Help Center | Snepr",
    meta: [
      { name: "description", content: "Frequently asked questions and support for Snepr customers and salon partners." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: HelpCenterPage,
});

export function HelpCenterPage() {
  const faqs = [
    {
      q: "How does the live queue work?",
      a: "Salons update chair statuses in SalonOS. You can see real-time waiting times from home, select your service, and join the queue remotely so you walk in right when your chair is ready.",
    },
    {
      q: "Do I need to enable GPS on my phone?",
      a: "No! Snepr uses manual locality selection (such as Patia, KIIT Road, Jaydev Vihar, Saheed Nagar) and never forces background location tracking.",
    },
    {
      q: "Does Snepr take a cut of my haircut price?",
      a: "Never. Snepr has a strict 0% commission policy. Salons pay a transparent flat monthly subscription (₹199, ₹400, or ₹449), and customers pay the salon directly.",
    },
    {
      q: "How can I register my salon?",
      a: "Go to your profile or click 'For Salons', fill out the 5-step registration wizard, and our Bhubaneswar verification team will approve your SalonOS access within 24–48 hours.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1410]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A4B29] bg-[#F5EEE7] px-3 py-1 rounded-full">
            Support & Knowledgebase
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#1B1410]">
            How can we help you?
          </h1>
          <p className="text-xs sm:text-sm text-[#786B60]">
            Find answers to common questions about live salon queues, tokens, and SalonOS.
          </p>
        </div>

        <div className="bg-[#FFFDFA] border border-[#E9E1D7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-serif text-[#1B1410] border-b border-[#E9E1D7] pb-3">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#FAF7F2]/50 border border-[#E9E1D7]/70 space-y-1.5">
                <h3 className="text-sm font-bold text-[#1B1410]">{f.q}</h3>
                <p className="text-xs text-[#786B60] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#1B1410] text-[#FFFDFA] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-xl font-bold font-serif text-white">Still have questions?</h3>
            <p className="text-xs text-[#DED4CA] mt-1">Our Bhubaneswar support desk is available daily from 9 AM to 8 PM.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-[#7A4B29] hover:bg-[#60391F] text-white text-xs font-bold transition-colors shrink-0"
          >
            Contact Support ↗
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HelpCenterPage;

