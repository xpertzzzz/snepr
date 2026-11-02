import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Check the live queue",
      desc: "Open Snepr on your phone. See live chair availability, number of customers in queue, and exact estimated wait times across top salons in Bhubaneswar before stepping out.",
      icon: "🔍",
    },
    {
      num: "02",
      title: "Save your place remotely",
      desc: "Pick your salon and select your haircut, beard grooming, or spa services. Join the digital queue with one tap and receive your live token without standing in line.",
      icon: "📱",
    },
    {
      num: "03",
      title: "Follow live 5 stage progress",
      desc: "Watch your token move in real time from Joined to Waiting, Your Turn, and In Chair. Arrive at the salon right as your assigned stylist and chair become ready.",
      icon: "⏱️",
    },
    {
      num: "04",
      title: "Walk straight in and earn points",
      desc: "Show your digital token at reception and step straight into the chair. After your completed service, leave a verified review to earn Snepr Points for discounts.",
      icon: "✂️",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#2b211a] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-[1220px] mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-[11px] font-bold tracking-[0.18em] text-[#80543a] uppercase bg-[#80543a]/10 px-4 py-1 rounded-full mb-4">
            Simple by design
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1b17] leading-[1.05]">
            From your couch to the <span className="font-serif italic text-[#80543a]">barber chair.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#5c4f44] leading-relaxed">
            Snepr transforms the traditional salon visit. Check live waiting times, take your place remotely, and say goodbye to crowded waiting rooms forever.
          </p>
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-[#eee4d8] rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-serif italic text-3xl font-bold text-[#80543a]">{step.num}</span>
                <span className="text-3xl">{step.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1d1b17] mb-3">{step.title}</h3>
              <p className="text-[#4a3e35] leading-relaxed text-base">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="bg-[#fffdfa] border border-[#eee4d8] rounded-3xl p-8 sm:p-12 shadow-sm mb-20">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1d1b17]">The Snepr Difference</h2>
            <p className="mt-2 text-[#6b5e52]">Traditional salon waiting versus live digital queue management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#f9f5f0] p-6 rounded-2xl border border-red-200/50">
              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                <span>✕</span> Traditional Walk-In
              </h4>
              <ul className="space-y-2.5 text-sm text-[#5c4f44]">
                <li>• Travel to salon without knowing if chairs are free</li>
                <li>• Wait 30 to 60 minutes in crowded reception seating</li>
                <li>• Unpredictable turns with no timing transparency</li>
                <li>• Forced app downloads or inflexible rigid booking slots</li>
              </ul>
            </div>
            <div className="bg-[#f2f7f3] p-6 rounded-2xl border border-green-200/60">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <span>✓</span> With Snepr Live Queue
              </h4>
              <ul className="space-y-2.5 text-sm text-[#3d4b41]">
                <li>• Check live chair availability from home</li>
                <li>• Join the digital queue remotely from your smartphone</li>
                <li>• Relax at home or office until your token is called</li>
                <li>• Walk in and sit straight down in the barber chair</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#1c1917] text-[#f5f1e9] rounded-3xl p-10 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to skip the waiting line?</h2>
          <p className="text-base text-[#c4bcb1] max-w-xl mx-auto mb-8">
            Explore verified salons in Bhubaneswar and check live queues right now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="px-8 py-3.5 rounded-full bg-[#f5f1e9] text-[#1d1b17] font-bold text-sm hover:bg-white transition-all shadow-md"
            >
              Find a Salon Near You ↗
            </Link>
            <Link
              to="/salonos"
              className="px-8 py-3.5 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              Salon Owners: Learn About SalonOS
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

