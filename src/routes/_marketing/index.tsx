import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  BHUBANESWAR_AREAS,
  REAL_SALONS_DATA,
  RealSalon,
} from "@/lib/real-salons";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    title: "Snepr | Know before you go · Live Salon Queues in Bhubaneswar",
    meta: [
      {
        name: "description",
        content:
          "Check live salon wait times and chair availability across Bhubaneswar. Reserve your chair remotely and walk straight in. 0% haircut commissions for salons.",
      },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: SneprLandingPage,
});

const FAQ_DATA: Record<string, [string, string][]> = {
  Customers: [
    [
      "Do I pay anything extra to join the queue or book?",
      "No. Snepr is 100% free for customers. You pay the salon's standard service price directly at the salon or online without any markup or hidden booking fees.",
    ],
    [
      "How do live queues work?",
      "Salons update their active chair status in real time. When you take a token on Snepr, you receive an estimated wait time and live queue position. You only need to arrive a few minutes before your turn.",
    ],
    [
      "How do Snepr Points work?",
      "Whenever you complete a service at a partner salon and leave a verified review, you earn 10 Snepr Points. 1 point = ₹1. You can redeem points for up to 20% off your next salon bill.",
    ],
    [
      "Can I choose a specific barber?",
      "Yes! When viewing a salon profile, you can view the active barbers, their specialties, and their current chair availability before queuing.",
    ],
  ],
  "Salon Owners": [
    [
      "Do you charge commissions on haircuts or services?",
      "Never. Snepr operates on a flat, transparent subscription model (₹199/mo for Base, ₹400/mo for Intermediate, ₹449/mo for Pro). We take 0% cut from your hard-earned haircut revenue.",
    ],
    [
      "Can I manage walk-in customers alongside online tokens?",
      "Yes. SalonOS has a built-in walk-in manager. When a customer walks in without an appointment, simply add them from your desk in one tap and SalonOS dynamically syncs the queue across all screens.",
    ],
    [
      "What hardware do I need to run SalonOS?",
      "Any standard tablet, smartphone, or laptop with a web browser. No proprietary POS hardware or expensive terminals required.",
    ],
    [
      "How quickly can my Bhubaneswar salon get listed?",
      "Partner registration takes less than 5 minutes. Once your salon details and chair count are submitted, our local Bhubaneswar verification team approves your listing within 24 hours.",
    ],
  ],
  "AI Studio": [
    [
      "What is the AI Hair Studio?",
      "It is an interactive grooming lookbook and style consultation tool. You can explore curated men's haircuts, beard fades, and hair textures to show your barber exactly what you want.",
    ],
    [
      "Can I share references with my stylist before arriving?",
      "Yes. When joining the queue or booking a service, you can attach your selected AI Studio style reference directly to your ticket.",
    ],
  ],
};

export function SneprLandingPage() {
  /* ─── REVEAL ON SCROLL OBSERVER ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal, .step").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ─── LOCALITY STATE (BHUBANESWAR LAUNCH) ─── */
  const [selectedAreaId, setSelectedAreaId] = useState<number>(1); // Patia default
  const selectedArea = BHUBANESWAR_AREAS.find((a) => a.id === selectedAreaId) || BHUBANESWAR_AREAS[0];

  /* ─── SALON FILTERS ─── */
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredSalons, setFilteredSalons] = useState<RealSalon[]>([]);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  useEffect(() => {
    setIsFilterLoading(true);
    const timer = setTimeout(() => {
      let list = REAL_SALONS_DATA.filter((s) => s.areaId === selectedAreaId);
      if (activeFilter === "short") {
        list.sort((a, b) => a.waitTime - b.waitTime);
      } else if (activeFilter === "now") {
        list = list.filter((s) => s.availableChairs > 0 || s.waitTime === 0);
      } else if (activeFilter === "rated") {
        list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      } else if (activeFilter === "Men's") {
        list = list.filter((s) => s.category.toLowerCase().includes("men"));
      } else if (activeFilter === "Unisex") {
        list = list.filter((s) => s.category.toLowerCase().includes("unisex"));
      } else if (activeFilter === "Premium") {
        list = list.filter((s) => s.category.toLowerCase().includes("luxury") || s.category.toLowerCase().includes("unisex"));
      }
      setFilteredSalons(list);
      setIsFilterLoading(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [selectedAreaId, activeFilter]);

  /* ─── AI STUDIO LOOKBOOK ─── */
  const [selectedHairstyle, setSelectedHairstyle] = useState(0);
  const hairstyles = [
    { name: "Textured Crop Fade", tag: "Popular for Men", desc: "Short textured top with a clean low skin fade on sides." },
    { name: "Modern Quiff", tag: "Classic Professional", desc: "Voluminous swept-back front with defined scissor-cut sides." },
    { name: "Beard Sculpt & Razor Fade", tag: "Sharp Grooming", desc: "Angular cheek lines, blended sideburns and hot-towel finish." },
    { name: "Layered Texture Cut", tag: "Versatile", desc: "Medium-length flow with soft layered ends and effortless movement." },
  ];

  /* ─── WALLET & LOYALTY DEMO ─── */
  const [walletPoints, setWalletPoints] = useState(30);
  const [reviewed, setReviewed] = useState(false);

  const handleSimulateReview = () => {
    if (!reviewed) {
      setWalletPoints((prev) => prev + 10);
      setReviewed(true);
    }
  };

  /* ─── SALON ECONOMICS CALCULATOR ─── */
  const [dailyCust, setDailyCust] = useState(35);
  const [avgTicket, setAvgTicket] = useState(350);
  const [workDays, setWorkDays] = useState(26);
  const [commRate, setCommRate] = useState(25);
  const [sneprPlanPrice, setSneprPlanPrice] = useState(400);

  const monthlyRev = dailyCust * avgTicket * workDays;
  const modelledCommission = Math.round((monthlyRev * commRate) / 100);
  const modelledSavings = modelledCommission - sneprPlanPrice;

  /* ─── FAQ STATE ─── */
  const [faqCategory, setFaqCategory] = useState("Customers");
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const currentAreaSalons = REAL_SALONS_DATA.filter((s) => s.areaId === selectedAreaId);
  const heroHighlightSalon = currentAreaSalons[0] || REAL_SALONS_DATA[0];

  return (
    <main id="top" className="snepr-body">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="pill reveal">
              <i className="dot" />
              Initial Launch · Bhubaneswar, Odisha
            </span>
            <h1 className="reveal" style={{ ["--d" as any]: ".08s" }}>
              Skip the waiting room.
              <br />
              Track salon chairs <em>in real time.</em>
            </h1>
            <p className="lead reveal" style={{ ["--d" as any]: ".16s" }}>
              Check live chair wait times across Bhubaneswar. Save your place remotely and arrive when your barber is ready. Know before you go.
            </p>
            <div className="acts reveal" style={{ ["--d" as any]: ".24s" }}>
              <a className="btn btn-dark" href="/live">
                See Live Queues
              </a>
              <a className="btn btn-out" href="#discover">
                Explore Salons
              </a>
              <a className="own" href="/login">
                Salon Partner Login ↗
              </a>
            </div>

            {/* Locality Selector Pill in Hero */}
            <div className="loc reveal" style={{ ["--d" as any]: ".32s" }}>
              <span className="font-semibold text-xs text-[#1B1410]">
                Exploring: <b>{selectedArea.name}, Bhubaneswar</b>
              </span>
              <select
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-[#7A4B29] cursor-pointer outline-none border-b border-[#7A4B29]/30 hover:border-[#7A4B29]"
                aria-label="Choose Locality"
              >
                {BHUBANESWAR_AREAS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hero Live Queue Preview Card */}
          <div
            className="panel reveal"
            style={{ ["--d" as any]: ".15s" }}
            aria-label="Live salon preview"
          >
            <div className="ptop">
              <span>● LIVE CHAIR STATUS</span>
              <span className="live">{selectedArea.name}</span>
            </div>
            <div>
              {currentAreaSalons.slice(0, 3).map((s) => (
                <div className="srow" key={s.id}>
                  <div className="av">{s.name[0]}</div>
                  <div>
                    <div className="sn">{s.name}</div>
                    <div className="sm">
                      {s.areaName} · {s.category} · ★ {s.rating}
                    </div>
                  </div>
                  <div
                    className="w"
                    style={{
                      color:
                        s.waitTime <= 5
                          ? "var(--green)"
                          : s.waitTime <= 15
                          ? "var(--amber)"
                          : "var(--red)",
                    }}
                  >
                    {s.waitTime} min<small>{s.availableChairs > 0 ? "FREE CHAIR" : "WAIT"}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="fast">
              <span>Fastest available in {selectedArea.name}</span>
              <b>
                {heroHighlightSalon.waitTime} min wait · {heroHighlightSalon.name}
              </b>
            </div>
            <div className="badge font-bold tracking-wider text-[10px]">
              VERIFIED BHUBANESWAR QUEUE DATA
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. SALON DISCOVERY SECTION ─── */}
      <section className="section discover" id="discover">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Locality-Based Discovery</div>
              <h2 className="snepr-h2">Verified salons in {selectedArea.name}.</h2>
              <p className="sub">
                Select your neighborhood to browse real salons and live chair status. No GPS permissions needed.
              </p>
            </div>

            {/* Bhubaneswar Locality Dropdown */}
            <div className="locbar">
              <label htmlFor="localitySelect" className="text-xs font-bold text-[#6B5E55] mr-2">
                Locality:
              </label>
              <select
                id="localitySelect"
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(Number(e.target.value))}
                aria-label="Select Bhubaneswar Locality"
              >
                {BHUBANESWAR_AREAS.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}, Bhubaneswar
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="filters" role="group" aria-label="Filters">
            {[
              { id: "all", label: "All in " + selectedArea.name },
              { id: "short", label: "Shortest wait" },
              { id: "now", label: "Available chairs now" },
              { id: "rated", label: "Top rated" },
              { id: "Men's", label: "Men's Grooming" },
              { id: "Unisex", label: "Unisex Salons" },
              { id: "Premium", label: "Luxury Studios" },
            ].map((f) => (
              <button
                key={f.id}
                className={`chip ${activeFilter === f.id ? "active" : ""}`}
                aria-pressed={activeFilter === f.id}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Salon Grid */}
          <div className="grid3">
            {isFilterLoading ? (
              <>
                <div className="skel" />
                <div className="skel" />
                <div className="skel" />
              </>
            ) : filteredSalons.length > 0 ? (
              filteredSalons.map((s) => (
                <article className="card" key={s.id}>
                  <div className="ct">
                    <div className="mark">{s.name[0]}</div>
                    <span className="st">
                      <i className="dot" style={{ marginRight: "5px" }} />
                      {s.operationalStatus === "active" ? "Open Now" : "Paused"}
                    </span>
                  </div>
                  <h3>{s.name}</h3>
                  <div className="meta">
                    <span>{s.areaName}, Bhubaneswar</span>
                    <span>{s.category}</span>
                    <span>★ {s.rating} ({s.reviewCount})</span>
                  </div>
                  <div className="meta">
                    <span className="font-bold text-[#2E7D4F]">
                      {s.availableChairs} of {s.totalChairs} chairs free
                    </span>
                    <span>{s.waitingCount} in live queue</span>
                  </div>
                  <div className="cb">
                    <div
                      className="bw"
                      style={{
                        color:
                          s.waitTime <= 5
                            ? "var(--green)"
                            : s.waitTime <= 15
                            ? "var(--amber)"
                            : "var(--red)",
                      }}
                    >
                      {s.waitTime}
                      <small> min wait</small>
                    </div>
                    <a className="btn btn-dark" href={`/live/salon/${s.id}`}>
                      Join Queue
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty">
                No salons currently match this filter in {selectedArea.name}. Try selecting another filter or neighborhood above.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── 3. LIVE QUEUE EXPERIENCE SECTION ─── */}
      <section className="section queue-exp" id="live-experience" style={{ background: "#FAF7F2" }}>
        <div className="wrap">
          <div className="head reveal text-center max-w-2xl mx-auto mb-12">
            <div className="kicker">Real-Time Transparency</div>
            <h2 className="snepr-h2">Traditional Waiting vs. The Snepr Way</h2>
            <p className="sub">
              Never waste an hour seated on a crowded salon sofa reading old magazines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
            {/* Traditional Card */}
            <div className="p-8 rounded-3xl bg-[#EFE9E0]/60 border border-[#E8E1D7] flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#DC2626]/10 text-[#DC2626] text-xs font-bold uppercase tracking-wider mb-4">
                  The Old Way (Unpredictable)
                </span>
                <h3 className="text-xl font-bold text-[#1B1410] mb-3">
                  Wasting 45 to 60 Minutes in the Salon
                </h3>
                <ul className="space-y-3 text-sm text-[#6B5E55]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#DC2626] font-bold">✕</span>
                    Travel to the salon hoping chairs are free, only to find a 4-person line.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#DC2626] font-bold">✕</span>
                    Stuck waiting on a sofa without knowing who is next or when your barber finishes.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#DC2626] font-bold">✕</span>
                    Risk losing your unofficial spot if you step out for a coffee.
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E8E1D7] flex items-center justify-between text-xs text-[#8F8177]">
                <span>Avg. Wasted Waiting Time</span>
                <span className="font-bold text-[#DC2626] text-sm">45–60 Mins</span>
              </div>
            </div>

            {/* Snepr Way Card */}
            <div className="p-8 rounded-3xl bg-white border border-[#7A4B29]/30 shadow-lg flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#2E7D4F]/10 text-[#2E7D4F] text-xs font-bold uppercase tracking-wider mb-4">
                  The Snepr Way (Punctual)
                </span>
                <h3 className="text-xl font-bold text-[#1B1410] mb-3">
                  Arrive When Your Chair is Ready
                </h3>
                <ul className="space-y-3 text-sm text-[#6B5E55]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#2E7D4F] font-bold">✓</span>
                    Check real-time chair availability from your home, hostel, or office.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2E7D4F] font-bold">✓</span>
                    Secure a live digital token with dynamic countdown alerts.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2E7D4F] font-bold">✓</span>
                    Walk straight in when your token is called and take your seat immediately.
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E8E1D7] flex items-center justify-between text-xs text-[#8F8177]">
                <span>Time Spent Sitting in Salon</span>
                <span className="font-bold text-[#2E7D4F] text-sm">0 Mins</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS SECTION ─── */}
      <section className="section how" id="how">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Simple By Design</div>
              <h2 className="snepr-h2">From your couch to the barber chair in 4 steps.</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <article className="step reveal p-6 rounded-2xl bg-white border border-[#E8E1D7]">
              <div className="text-xs font-black text-[#7A4B29] mb-2 uppercase tracking-wider">01 · Pick Locality</div>
              <h3 className="text-base font-bold text-[#1B1410] mb-1">Choose Neighborhood</h3>
              <p className="text-xs text-[#6B5E55]">Select your locality in Bhubaneswar to see active, open neighborhood salons.</p>
            </article>

            <article className="step reveal p-6 rounded-2xl bg-white border border-[#E8E1D7]" style={{ ["--d" as any]: ".1s" }}>
              <div className="text-xs font-black text-[#7A4B29] mb-2 uppercase tracking-wider">02 · Check Chairs</div>
              <h3 className="text-base font-bold text-[#1B1410] mb-1">Inspect Live Queue</h3>
              <p className="text-xs text-[#6B5E55]">See which chairs are occupied, finishing, or open right now, plus live wait times.</p>
            </article>

            <article className="step reveal p-6 rounded-2xl bg-white border border-[#E8E1D7]" style={{ ["--d" as any]: ".2s" }}>
              <div className="text-xs font-black text-[#7A4B29] mb-2 uppercase tracking-wider">03 · Secure Token</div>
              <h3 className="text-base font-bold text-[#1B1410] mb-1">Join Queue or Book</h3>
              <p className="text-xs text-[#6B5E55]">Tap to take a digital token or book a slot with your preferred stylist.</p>
            </article>

            <article className="step reveal p-6 rounded-2xl bg-white border border-[#E8E1D7]" style={{ ["--d" as any]: ".3s" }}>
              <div className="text-xs font-black text-[#7A4B29] mb-2 uppercase tracking-wider">04 · Walk Straight In</div>
              <h3 className="text-base font-bold text-[#1B1410] mb-1">Zero Wait Seating</h3>
              <p className="text-xs text-[#6B5E55]">Arrive just-in-time when called. Show your token number and sit straight in the chair.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 5. AI STUDIO LOOKBOOK SECTION ─── */}
      <section className="section ai" id="ai">
        <div className="wrap al">
          <div className="reveal">
            <div className="kicker">AI Grooming Lookbook</div>
            <h2 className="snepr-h2">Try the look before the cut.</h2>
            <p className="sub">
              Explore curated haircuts, fades, and beard profiles. Show your stylist exactly what you want with 100% clarity.
            </p>
            <ul className="pts">
              <li>Curated modern fades, crops, quiffs, and beard shapes</li>
              <li>Texture preview & hair density suggestions</li>
              <li>Share exact reference cards with your Bhubaneswar stylist</li>
            </ul>
            <a className="btn btn-dark" href="/live/studio" style={{ marginTop: "16px" }}>
              Explore Full AI Lookbook
            </a>
          </div>

          <div className="studio reveal p-6 rounded-3xl bg-white border border-[#E8E1D7] shadow-sm" style={{ ["--d" as any]: ".1s" }}>
            <div className="mb-4">
              <span className="text-[10px] font-extrabold text-[#7A4B29] uppercase tracking-wider">
                {hairstyles[selectedHairstyle].tag}
              </span>
              <h3 className="text-lg font-bold text-[#1B1410] mt-0.5">
                {hairstyles[selectedHairstyle].name}
              </h3>
              <p className="text-xs text-[#6B5E55] mt-1">
                {hairstyles[selectedHairstyle].desc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {hairstyles.map((h, i) => (
                <button
                  key={h.name}
                  onClick={() => setSelectedHairstyle(i)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs font-bold ${
                    selectedHairstyle === i
                      ? "bg-[#7A4B29] text-white border-[#7A4B29]"
                      : "bg-[#FAF7F2] text-[#1B1410] border-[#E8E1D7] hover:border-[#7A4B29]"
                  }`}
                >
                  <div className="truncate">{h.name}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedHairstyle === i ? "text-white/80" : "text-[#8F8177]"}`}>
                    {h.tag}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E1D7] flex items-center justify-between text-xs">
              <span className="text-[#6B5E55]">Stylist compatibility:</span>
              <span className="font-bold text-[#2E7D4F]">All verified Bhubaneswar barbers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. SNEPR POINTS / CUSTOMER LOYALTY SECTION ─── */}
      <section className="section loy" id="points">
        <div className="wrap ll">
          <div className="reveal">
            <div className="kicker">Verified Reviews · Snepr Points</div>
            <h2 className="snepr-h2">Reviews you can trust. Points you can spend.</h2>
            <p className="sub mb-6">
              Zero fake reviews, zero marketing gimmicks. Real rewards for real customers.
            </p>
            <ul className="rules">
              <li>
                <b>01</b>Only customers with verified completed appointments can review.
              </li>
              <li>
                <b>02</b>Each verified review earns 10 Snepr Points. 1 Point = ₹1.
              </li>
              <li>
                <b>03</b>Redeem points for up to 20% off your salon service bill.
              </li>
              <li>
                <b>04</b>Points are awarded regardless of star rating (honest feedback is valued equally).
              </li>
            </ul>
          </div>

          <div className="wallet reveal" style={{ ["--d" as any]: ".1s" }}>
            <small>YOUR SNEPR WALLET</small>
            <div className="amt">₹{walletPoints}</div>
            <div style={{ color: "#E5C9B2", fontSize: ".8rem" }}>
              Available Snepr Points (1 Pt = ₹1)
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-white/80 mb-3">
                {reviewed
                  ? "✓ Review verified! +10 Points added to your wallet."
                  : "Try it: Tap to verify a completed haircut review:"}
              </p>
              <button
                type="button"
                onClick={handleSimulateReview}
                disabled={reviewed}
                className="w-full py-2.5 rounded-xl bg-[#C8993E] hover:bg-[#b08432] text-[#1B1410] font-black text-xs uppercase tracking-wider transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {reviewed ? "Review Submitted (+10 Pts)" : "Submit Verified Review (+10 Pts)"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. SALONOS OVERVIEW SECTION ─── */}
      <section className="section os" id="salonos">
        <div className="wrap ol">
          <div className="reveal">
            <div className="kicker">For Salon Owners · SalonOS</div>
            <h2 className="snepr-h2">
              The Operating System for modern barbers & salons.
            </h2>
            <p className="sub">
              Manage chairs, queue tokens, walk-ins, and staff shifts in one intuitive portal. Built specifically for Indian neighborhood salons.
            </p>

            <div className="caps">
              <span className="cap">Live Chair Management</span>
              <span className="cap">Automated Token Queue</span>
              <span className="cap">Walk-in Customer Desk</span>
              <span className="cap">Staff Shifts & Commissions</span>
              <span className="cap">0% Haircut Commissions</span>
              <span className="cap">WhatsApp Alerts</span>
              <span className="cap">QR Standee Included</span>
            </div>

            <div className="mt-8">
              <a className="btn btn-dark" href="/claim">
                Register Your Salon
              </a>
            </div>
          </div>

          <div className="dash reveal" style={{ ["--d" as any]: ".1s" }}>
            <div className="dt">
              <strong>SalonOS Desk · Patia Partner</strong>
              <span>● LIVE CHAIR MONITOR</span>
            </div>
            <div className="ds">
              <div className="dsi">
                <small>Active chairs</small>
                <b>4</b>
              </div>
              <div className="dsi">
                <small>In Queue</small>
                <b>2</b>
              </div>
              <div className="dsi">
                <small>Next Token</small>
                <b>#A-104</b>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="ql">
                <b>Chair 1</b>
                <span>Sameer Mohanty · In Service (#A-102 · Haircut)</span>
              </div>
              <div className="ql hl">
                <b>Chair 2</b>
                <span>Rahul Sen · Available Now (Walk-in Ready)</span>
              </div>
              <div className="ql">
                <b>Chair 3</b>
                <span>Bikash Rout · Finishing (#A-103 · 3 mins left)</span>
              </div>
            </div>
            <div className="dnote">
              Live updates automatically synchronize with customers' mobile browsers.
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. AUTHORITATIVE PRICING SECTION ─── */}
      <section className="section pricing" id="pricing">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Authoritative Subscriptions</div>
              <h2 className="snepr-h2">Transparent pricing. 0% haircut commissions.</h2>
              <p className="sub">
                Flat monthly software subscriptions. Keep 100% of your service earnings.
              </p>
            </div>
          </div>
          <div className="pg">
            {/* Base Plan */}
            <article className="pc reveal">
              <div className="pl">BASE · 1 CHAIR</div>
              <h3 className="snepr-h3">Single Stylist</h3>
              <p className="pd">
                For independent barbers, single-chair studios, and solo groomers.
              </p>
              <div className="price">
                ₹199<small> / month</small>
              </div>
              <ul>
                <li>1 active stylist chair</li>
                <li>Digital queue & token counter</li>
                <li>Real-time chair countdown</li>
                <li>QR counter standee for walk-ins</li>
                <li>Verified customer reviews</li>
                <li>0% haircut commissions</li>
              </ul>
              <a className="btn btn-out" href="/claim">
                Start with Base
              </a>
            </article>

            {/* Intermediate Plan (Most Popular) */}
            <article className="pc f reveal" style={{ ["--d" as any]: ".1s" }}>
              <div className="pl">MOST POPULAR · UP TO 3 CHAIRS</div>
              <h3 className="snepr-h3">Intermediate</h3>
              <p className="pd">For growing neighborhood salons & grooming parlours.</p>
              <div className="price">
                ₹400<small> / month</small>
              </div>
              <ul>
                <li>Everything in Base</li>
                <li>Up to 3 active chairs</li>
                <li>Multi-barber queue routing</li>
                <li>Staff logins & individual shifts</li>
                <li>WhatsApp token notifications</li>
                <li>Snepr Points loyalty listing</li>
                <li>0% haircut commissions</li>
              </ul>
              <a className="btn" href="/claim">
                Choose Intermediate
              </a>
            </article>

            {/* Pro Plan */}
            <article className="pc reveal" style={{ ["--d" as any]: ".2s" }}>
              <div className="pl">PRO · UNLIMITED CHAIRS</div>
              <h3 className="snepr-h3">Pro Unlimited</h3>
              <p className="pd">
                For multi-chair unisex studios and high-volume salon chains.
              </p>
              <div className="price">
                ₹449<small> / month</small>
              </div>
              <ul>
                <li>Everything in Intermediate</li>
                <li>Unlimited chairs & staff members</li>
                <li>Advanced SalonOS analytics & export</li>
                <li>Featured placement in Locality Explore</li>
                <li>AI Studio lookbook integration</li>
                <li>Priority 24/7 dedicated partner support</li>
                <li>0% haircut commissions</li>
              </ul>
              <a className="btn btn-out" href="/claim">
                Go Pro Unlimited
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 9. SALON ECONOMICS CALCULATOR ─── */}
      <section className="section calc" id="calc">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Salon Economics Calculator</div>
              <h2 className="snepr-h2">
                Calculate your monthly savings vs. 20–30% aggregators.
              </h2>
            </div>
          </div>
          <div className="cb2 reveal">
            <div>
              <div className="ctl">
                <label htmlFor="c1">
                  Average daily customers <output>{dailyCust}</output>
                </label>
                <input
                  id="c1"
                  type="range"
                  min="5"
                  max="120"
                  value={dailyCust}
                  onChange={(e) => setDailyCust(Number(e.target.value))}
                />
              </div>

              <div className="ctl">
                <label htmlFor="c2">
                  Average ticket price{" "}
                  <output>₹{avgTicket.toLocaleString("en-IN")}</output>
                </label>
                <input
                  id="c2"
                  type="range"
                  min="50"
                  max="1500"
                  step="10"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                />
              </div>

              <div className="ctl">
                <label htmlFor="c3">
                  Working days per month <output>{workDays}</output>
                </label>
                <input
                  id="c3"
                  type="range"
                  min="10"
                  max="31"
                  value={workDays}
                  onChange={(e) => setWorkDays(Number(e.target.value))}
                />
              </div>

              <div className="ctl">
                <label htmlFor="c4">
                  Aggregator commission cut <output>{commRate}%</output>
                </label>
                <input
                  id="c4"
                  type="range"
                  min="10"
                  max="35"
                  value={commRate}
                  onChange={(e) => setCommRate(Number(e.target.value))}
                />
              </div>

              <div className="ctl">
                <label htmlFor="c5">Snepr monthly plan</label>
                <select
                  id="c5"
                  value={sneprPlanPrice}
                  onChange={(e) => setSneprPlanPrice(Number(e.target.value))}
                >
                  <option value={199}>Base Plan · ₹199/mo</option>
                  <option value={400}>Intermediate Plan · ₹400/mo</option>
                  <option value={449}>Pro Unlimited · ₹449/mo</option>
                </select>
              </div>
            </div>

            <div className="res">
              <div className="rr">
                <span>Estimated Monthly Revenue</span>
                <b>₹{monthlyRev.toLocaleString("en-IN")}</b>
              </div>
              <div className="rr">
                <span>Aggregator Cut ({commRate}%)</span>
                <b className="text-[#DC2626]">₹{modelledCommission.toLocaleString("en-IN")}</b>
              </div>
              <div className="rr">
                <span>Snepr Flat Subscription</span>
                <b className="text-[#2E7D4F]">₹{sneprPlanPrice.toLocaleString("en-IN")}</b>
              </div>
              <div className="big">
                <small>YOUR MONTHLY SAVINGS WITH SNEPR</small>
                <strong>₹{modelledSavings.toLocaleString("en-IN")}</strong>
              </div>
              <div className="fm">
                Formula: revenue = customers × ticket × days
                <br />
                commission = revenue × rate
                <br />
                savings = commission − subscription
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10. FAQ & PARTNER CALL TO ACTION ─── */}
      <section className="section faq" id="faq">
        <div className="wrap fl">
          <div className="reveal">
            <div className="kicker">Frequently Asked Questions</div>
            <h2 className="snepr-h2">Everything you need to know.</h2>
            <p className="sub">
              Clear answers for Bhubaneswar customers and salon partners.
            </p>
          </div>
          <div className="reveal" style={{ ["--d" as any]: ".1s" }}>
            <div className="ft">
              {Object.keys(FAQ_DATA).map((cat) => (
                <button
                  key={cat}
                  className={`chip ${faqCategory === cat ? "active" : ""}`}
                  aria-pressed={faqCategory === cat}
                  onClick={() => {
                    setFaqCategory(cat);
                    setOpenFaqIndices({ 0: true });
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div>
              {FAQ_DATA[faqCategory].map((item, idx) => {
                const isOpen = !!openFaqIndices[idx];
                return (
                  <div
                    key={item[0]}
                    className={`fi ${isOpen ? "open" : ""}`}
                  >
                    <button
                      className="fq"
                      aria-expanded={isOpen}
                      onClick={() => toggleFaq(idx)}
                    >
                      {item[0]}
                      <span>+</span>
                    </button>
                    <div className="fa">
                      <div>
                        <p>{item[1]}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 11. BOTTOM CTA ─── */}
      <section className="cta">
        <div className="wrap">
          <div className="reveal">
            <h2 className="snepr-h2">Know before you go.</h2>
            <p>
              Join Bhubaneswar customers skipping the salon wait. Salon owners can claim their chair listing today.
            </p>
            <div className="acts">
              <a className="btn" href="/live">
                Explore Live Salons
              </a>
              <a className="btn o" href="/claim">
                Register Your Salon
              </a>
              <a className="btn o" href="/claim">
                Claim Existing Listing
              </a>
            </div>
          </div>
          <div className="app reveal" style={{ ["--d" as any]: ".1s" }}>
            <b>Snepr Android App</b>
            <p>
              Fast native Android client with live queue tracking, chair notifications, and instant re-booking.
            </p>
            <a className="btn" href="/Snepr-v1.0.4.aab" download>
              Download App (.aab)
            </a>{" "}
            <a
              href="#top"
              style={{
                fontSize: ".78rem",
                fontWeight: 700,
                marginLeft: "10px",
                textDecoration: "underline",
              }}
            >
              Back to top
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Nav */}
      <div className="bnav">
        <a href="#discover">Find Salon</a>
        <a href="/live">Live Queues</a>
        <a href="#pricing">Pricing</a>
      </div>
    </main>
  );
}

export default SneprLandingPage;
