import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  BHUBANESWAR_AREAS,
  REAL_SALONS_DATA,
  RealSalon,
} from "@/lib/real-salons";
import { ScissorCutAnimation } from "@/components/animations/ScissorCutAnimation";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    title: "Snepr | Know before you go",
    meta: [
      {
        name: "description",
        content:
          "Check live salon wait times, save your chair and walk straight in. SalonOS for salons, with no haircut commissions.",
      },
      { name: "theme-color", content: "#f7f3ed" },
    ],
  }),
  component: SneprLandingPageExact,
});

/* ─── SAMPLE / REAL SERVICE OPTIONS FOR DEMO ─── */
const DEMO_SERVICES = [
  { name: "Haircut", minutes: 25, price: 150 },
  { name: "Beard trim", minutes: 15, price: 80 },
  { name: "Haircut + Beard", minutes: 40, price: 200 },
  { name: "Facial", minutes: 35, price: 350 },
];

/* ─── AI STUDIO HAIRSTYLES ─── */
const HAIRSTYLES = [
  {
    name: "Textured crop",
    path: "M70 120 Q72 60 120 58 Q168 60 170 120 Q150 92 120 92 Q90 92 70 120Z",
  },
  {
    name: "Quiff",
    path: "M66 130 Q60 50 130 40 Q184 40 174 128 Q150 80 118 84 Q90 86 66 130Z",
  },
  {
    name: "Long layers",
    path: "M62 190 Q46 52 120 52 Q194 52 178 190 L166 190 Q168 100 120 92 Q72 100 74 190Z",
  },
];

/* ─── SALONOS 6-STEP WORKFLOW DATA ─── */
const SALONOS_FLOW: Array<{
  title: string;
  desc: string;
  waiting: number;
  next: string;
  lines: Array<{ token: string; label: string; highlight: boolean }>;
}> = [
  {
    title: "Customer joins",
    desc: "A customer picks a service on Snepr and joins the queue for a chair.",
    waiting: 3,
    next: "A06",
    lines: [
      { token: "A05", label: "Chair 1 · In service", highlight: false },
      { token: "A06", label: "Next", highlight: false },
      { token: "A07", label: "Just joined", highlight: true },
    ],
  },
  {
    title: "Token appears",
    desc: "The salon desk shows the new token with its service and estimated duration.",
    waiting: 3,
    next: "A06",
    lines: [
      { token: "A05", label: "Chair 1 · In service", highlight: false },
      { token: "A06", label: "Next", highlight: false },
      { token: "A07", label: "Token created · waiting", highlight: true },
    ],
  },
  {
    title: "Barber calls next",
    desc: "The barber taps Call Next and the token moves to their chair.",
    waiting: 2,
    next: "A07",
    lines: [
      { token: "A05", label: "Chair 1 · Finishing", highlight: false },
      { token: "A06", label: "Chair 2 · Called", highlight: true },
      { token: "A07", label: "Next", highlight: false },
    ],
  },
  {
    title: "Customer notified",
    desc: "The customer is alerted that their turn is close. Channels depend on what is enabled.",
    waiting: 2,
    next: "A07",
    lines: [
      { token: "A05", label: "Chair 1 · Finishing", highlight: false },
      { token: "A06", label: "Chair 2 · In service", highlight: false },
      { token: "A07", label: "Notified · turn is close", highlight: true },
    ],
  },
  {
    title: "Service completes",
    desc: "The barber marks the service done and the chair becomes free.",
    waiting: 1,
    next: "A07",
    lines: [
      { token: "A05", label: "Done", highlight: false },
      { token: "A06", label: "Done · chair free", highlight: true },
      { token: "A07", label: "Next", highlight: false },
    ],
  },
  {
    title: "Review and points",
    desc: "An eligible completed customer can review and earn Snepr Points under the stated rules.",
    waiting: 1,
    next: "A07",
    lines: [
      { token: "A05", label: "Done", highlight: false },
      { token: "A06", label: "Eligible to review", highlight: true },
      { token: "A07", label: "Next", highlight: false },
    ],
  },
];

/* ─── FAQ KNOWLEDGE BASE ─── */
const FAQ_GROUPS: Record<string, [string, string][]> = {
  Customers: [
    [
      "Do I need to download an app?",
      "No. Snepr works in the browser. A native app also exists if you prefer it.",
    ],
    [
      "How do I join a live queue?",
      "Open a salon, choose a service and join. You get a real-time token and live countdown.",
    ],
    [
      "How are wait times calculated?",
      "Salons update their active chairs in real time. We calculate estimated wait times based on chair turnover and live tokens ahead.",
    ],
    [
      "Can I cancel my token?",
      "Yes, you can cancel your token at any time directly from the queue screen.",
    ],
    [
      "How do I redeem Snepr Points?",
      "As a service discount, up to 20% of the bill under the proposed rules at any verified partner salon.",
    ],
  ],
  "Salon owners": [
    [
      "How do salon owners update queues?",
      "From the SalonOS desk with Call Next and chair controls. It takes one tap per haircut.",
    ],
    [
      "Can one salon manage multiple chairs?",
      "Yes. Intermediate covers up to three chairs and Pro covers unlimited chairs.",
    ],
    [
      "How quickly can a salon start?",
      "Onboarding takes less than 5 minutes. No specialized hardware is required—just any tablet, phone or laptop.",
    ],
    [
      "What happens if a salon closes?",
      "Salons can toggle queue status to paused or closed anytime to stop new tokens from being issued.",
    ],
  ],
  Pricing: [
    [
      "Are there monthly commissions?",
      "No percentage is deducted from service revenue under the stated plans. You only pay the flat monthly subscription.",
    ],
    [
      "How does Snepr make money?",
      "From salon subscriptions. Customers use the discovery and queue platform 100% free.",
    ],
  ],
  "AI Studio": [
    [
      "What can AI Studio do?",
      "Explore hairstyles, preview haircut cuts, and show your barber exactly what you want before the scissors touch your hair.",
    ],
  ],
};

export function SneprLandingPageExact() {
  /* ─── SCROLL REVEAL OBSERVER ─── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal, .step").forEach((el) => {
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  /* ─── LOCATION SELECTION ─── */
  const [selectedArea, setSelectedArea] = useState("Patia, Bhubaneswar");
  const [locationLabel, setLocationLabel] = useState("Patia, Bhubaneswar");

  const handleUseLocation = () => {
    setLocationLabel("Detecting location...");
    if (!navigator.geolocation) {
      setLocationLabel("Location unsupported. Pick an area below.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationLabel("Location detected: Patia, Bhubaneswar");
        setSelectedArea("Patia, Bhubaneswar");
      },
      () => {
        setLocationLabel("Permission denied. Select an area manually.");
      },
      { timeout: 8000 }
    );
  };

  /* ─── SALON FILTER & DATA ─── */
  const [filter, setFilter] = useState("all");
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Derive salons for the selected area
  const areaSalons = useMemo(() => {
    const isChandrasekharpur = selectedArea.toLowerCase().includes("chandrasekharpur");
    const isJayadev = selectedArea.toLowerCase().includes("jaydev") || selectedArea.toLowerCase().includes("jayadev");
    const isGajapati = selectedArea.toLowerCase().includes("gajapati");

    if (isChandrasekharpur) {
      return REAL_SALONS_DATA.filter((s) => s.areaId === 2);
    }
    if (isJayadev) {
      return REAL_SALONS_DATA.filter((s) => s.areaId === 3);
    }
    if (isGajapati) {
      return REAL_SALONS_DATA.filter((s) => s.areaId === 4);
    }
    // Default: Patia (Area 1)
    return REAL_SALONS_DATA.filter((s) => s.areaId === 1);
  }, [selectedArea]);

  const filteredSalons = useMemo(() => {
    let list = [...areaSalons];
    if (filter === "short") {
      list.sort((a, b) => a.waitTime - b.waitTime);
    } else if (filter === "now") {
      list = list.filter((s) => s.waitTime <= 10 || s.availableChairs > 0);
    } else if (filter === "rated") {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (filter === "Men's") {
      list = list.filter((s) => s.category.toLowerCase().includes("men") || s.category.toLowerCase().includes("barber"));
    } else if (filter === "Unisex") {
      list = list.filter((s) => s.category.toLowerCase().includes("unisex"));
    } else if (filter === "Premium") {
      list = list.filter((s) => s.category.toLowerCase().includes("luxury") || Number(s.rating) >= 4.8);
    }
    return list;
  }, [areaSalons, filter]);

  const handleFilterClick = (f: string) => {
    setFilter(f);
    setIsFilterLoading(true);
    setTimeout(() => setIsFilterLoading(false), 200);
  };

  const fastestSalon = useMemo(() => {
    const sorted = [...areaSalons].sort((a, b) => a.waitTime - b.waitTime);
    return sorted[0] || areaSalons[0] || REAL_SALONS_DATA[0];
  }, [areaSalons]);

  /* ─── INTERACTIVE DEMO (CUSTOMER VIEW VS SALONOS DESK) ─── */
  const [activeDemoTab, setActiveDemoTab] = useState<"c" | "s">("c");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(0);
  const [generatedToken, setGeneratedToken] = useState<any>(null);

  // SalonOS Desk Simulation State
  const [deskChairs, setDeskChairs] = useState<Array<{ id: number; token: string | null }>>([
    { id: 1, token: "A04" },
    { id: 2, token: null },
    { id: 3, token: "A05" },
  ]);
  const [deskQueue, setDeskQueue] = useState<string[]>(["A06", "A07", "A08"]);
  const [nextNumber, setNextNumber] = useState(9);

  const handleGenerateToken = () => {
    if (selectedServiceIndex === null) return;
    const s = DEMO_SERVICES[selectedServiceIndex];
    const ahead = 3;
    setGeneratedToken({
      token: "A07",
      position: ahead + 1,
      ahead,
      estWait: ahead * 20,
      serviceName: s.name,
      price: s.price,
    });
  };

  const handleDeskCallNext = () => {
    setDeskChairs((prev) => {
      const freeIdx = prev.findIndex((c) => !c.token);
      const targetIdx = freeIdx >= 0 ? freeIdx : 0;
      const nextTok = deskQueue.length > 0 ? deskQueue[0] : null;

      if (deskQueue.length > 0) {
        setDeskQueue((q) => q.slice(1));
      }

      return prev.map((c, i) => (i === targetIdx ? { ...c, token: nextTok } : c));
    });
  };

  const handleDeskAddWalkIn = () => {
    const newTok = "A" + String(nextNumber).padStart(2, "0");
    setNextNumber((n) => n + 1);
    setDeskQueue((q) => [...q, newTok]);
  };

  /* ─── AI HAIR STUDIO INTERACTIVE SLIDER ─── */
  const [selectedHairstyleIndex, setSelectedHairstyleIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  /* ─── SALONOS 6-STEP WORKFLOW STATE ─── */
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);
  const currentFlow = SALONOS_FLOW[currentFlowIndex];

  /* ─── SNEPR POINTS & LOYALTY DEMO ─── */
  const [userRating, setUserRating] = useState(0);
  const [pointsWallet, setPointsWallet] = useState(0);
  const [reviewNote, setReviewNote] = useState("Choose any rating. You earn 10 points either way.");

  const handleSubmitReview = () => {
    if (!userRating) {
      setReviewNote("Choose a rating first.");
      return;
    }
    setPointsWallet((p) => p + 10);
    setReviewNote(`${userRating} star review submitted. +10 points earned!`);
    setUserRating(0);
  };

  /* ─── SALON ECONOMICS CALCULATOR ─── */
  const [dailyCust, setDailyCust] = useState(35);
  const [avgTicket, setAvgTicket] = useState(350);
  const [workDays, setWorkDays] = useState(26);
  const [commRate, setCommRate] = useState(25);
  const [sneprPlanPrice, setSneprPlanPrice] = useState(400);

  const calcMonthlyRevenue = dailyCust * avgTicket * workDays;
  const calcModelledCommission = Math.round((calcMonthlyRevenue * commRate) / 100);
  const calcSavings = calcModelledCommission - sneprPlanPrice;

  /* ─── FAQ ACCORDION STATE ─── */
  const [activeFaqTab, setActiveFaqTab] = useState("Customers");
  const [openFaqItems, setOpenFaqItems] = useState<Record<number, boolean>>({ 0: true });

  const toggleFaq = (idx: number) => {
    setOpenFaqItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getWaitColor = (w: number) => {
    if (w <= 5) return "var(--green)";
    if (w <= 10) return "var(--amber)";
    return "var(--red)";
  };

  return (
    <main id="top">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="pill reveal">
              <i className="dot" />
              Live salon discovery · Bhubaneswar
            </span>
            <h1 className="reveal" style={{ ["--d" as any]: ".08s" }}>
              Never wait in line
              <br />
              at a salon <em>again.</em>
            </h1>
            <p className="lead reveal" style={{ ["--d" as any]: ".16s" }}>
              Check live chair wait times from home. Save your place remotely and arrive when your barber is ready. Know before you go.
            </p>
            <div className="acts reveal" style={{ ["--d" as any]: ".24s" }}>
              <a className="btn btn-dark" href="#discover">
                Find a salon near you
              </a>
              <a className="btn btn-out" href="/live">
                Explore live queues
              </a>
              <a className="own" href="#salonos">
                For salon owners ↗
              </a>
            </div>
            <div className="loc reveal" style={{ ["--d" as any]: ".32s" }}>
              <span id="hl">{locationLabel}</span>
              <button id="g1" onClick={handleUseLocation}>
                Use my location
              </button>
            </div>
          </div>

          {/* Right Live Preview Panel */}
          <div className="panel reveal" style={{ ["--d" as any]: ".15s" }} aria-label="Sample live salon preview">
            <div className="ptop">
              ⌕ Salons near you, right now <span className="live">● LIVE</span>
            </div>
            <div id="hlist">
              {areaSalons.slice(0, 3).map((s) => (
                <div className="srow" key={s.id}>
                  <div className="av">{s.name[0]}</div>
                  <div>
                    <div className="sn">{s.name}</div>
                    <div className="sm">
                      {s.areaName} · {s.category} · ★ {s.rating}
                    </div>
                  </div>
                  <div className="w" style={{ color: getWaitColor(s.waitTime) }}>
                    {s.waitTime} min
                    <small>WAIT</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="fast">
              <span>Shortest listed wait</span>
              <b id="hfast">
                {fastestSalon.waitTime} min · {fastestSalon.name}
              </b>
            </div>
            <div className="badge">VERIFIED BHUBANESWAR PREVIEW</div>
          </div>
        </div>
      </section>

      {/* ─── SCISSOR CUT PERFORATION TRANSITION ─── */}
      <div className="wrap my-2">
        <ScissorCutAnimation cuttingText="LIVE QUEUEING & REAL-TIME CHAIR UPDATES" />
      </div>

      {/* ─── 2. DISCOVER SECTION ─── */}
      <section className="section discover" id="discover">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Live salon discovery</div>
              <h2>Salons near you, right now.</h2>
              <p className="sub" id="areaLine">
                Showing verified salons for {selectedArea}.
              </p>
            </div>
            <div className="locbar">
              <select
                id="area"
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  setLocationLabel(e.target.value);
                }}
                aria-label="Select area"
              >
                <option value="Patia, Bhubaneswar">Patia, Bhubaneswar</option>
                <option value="Chandrasekharpur, Bhubaneswar">Chandrasekharpur, Bhubaneswar</option>
                <option value="Jaydev Vihar, Bhubaneswar">Jaydev Vihar, Bhubaneswar</option>
                <option value="Gajapati Nagar, Bhubaneswar">Gajapati Nagar, Bhubaneswar</option>
              </select>
              <button className="pr cursor-pointer" id="g2" onClick={handleUseLocation}>
                Use my location
              </button>
            </div>
          </div>

          <div className="filters" id="filters" role="group" aria-label="Filters">
            {[
              { id: "all", label: "All salons" },
              { id: "short", label: "Shortest wait" },
              { id: "now", label: "Available now" },
              { id: "rated", label: "Top rated" },
              { id: "Men's", label: "Men's" },
              { id: "Unisex", label: "Unisex" },
              { id: "Premium", label: "Premium" },
            ].map((btn) => (
              <button
                key={btn.id}
                className="chip cursor-pointer"
                aria-pressed={filter === btn.id}
                onClick={() => handleFilterClick(btn.id)}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid3" id="salons">
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
                      Open
                    </span>
                  </div>
                  <h3>{s.name}</h3>
                  <div className="meta">
                    <span>{s.areaName}</span>
                    <span>{s.category}</span>
                    <span>★ {s.rating}</span>
                  </div>
                  <div className="meta">
                    <span>{s.availableChairs} of {s.totalChairs} chairs free</span>
                    <span>{s.waitingCount} in queue</span>
                  </div>
                  <div className="cb">
                    <div className="bw" style={{ color: getWaitColor(s.waitTime) }}>
                      {s.waitTime}
                      <small> min wait</small>
                    </div>
                    <a className="btn btn-dark" href={`/live/salon/${s.id}`}>
                      Join queue
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty">
                No salons match this filter right now. Try another filter or area.
              </div>
            )}
          </div>
          <p className="note" style={{ marginTop: "20px" }}>
            VERIFIED LEADS DATA. Connects to live chair counters, queue positions, and booking APIs across Bhubaneswar.
          </p>
        </div>
      </section>

      {/* ─── 3. DEMO SECTION ─── */}
      <section className="section demo" id="demo">
        <div className="wrap dl">
          <div className="reveal">
            <div className="kicker">A closer look</div>
            <h2 style={{ color: "#fff" }}>See the queue. Feel in control.</h2>
            <p className="sub">
              Switch between the customer view and the salon desk. Nothing here creates a real queue entry.
            </p>
            <div className="tabs" role="tablist">
              <span
                className="knob"
                id="knob"
                style={{
                  left: activeDemoTab === "c" ? "4px" : "calc(50% + 2px)",
                  width: "calc(50% - 6px)",
                }}
              />
              <button
                role="tab"
                id="tC"
                aria-selected={activeDemoTab === "c"}
                onClick={() => setActiveDemoTab("c")}
              >
                Customer view
              </button>
              <button
                role="tab"
                id="tS"
                aria-selected={activeDemoTab === "s"}
                onClick={() => setActiveDemoTab("s")}
              >
                SalonOS desk
              </button>
            </div>
            <div className="dtitle" id="dT">
              {activeDemoTab === "c" ? "The customer side" : "The barber desk"}
            </div>
            <p id="dD">
              {activeDemoTab === "c"
                ? "Pick a service, see its duration and price, then generate a demo token with queue position and estimated wait."
                : "Call the next customer, watch chairs update and add walk in tokens. All simulated."}
            </p>
          </div>

          <div className="screen reveal" style={{ ["--d" as any]: ".1s" }}>
            {/* Customer View */}
            <div id="vC" className={activeDemoTab === "c" ? "" : "hidden"}>
              <div className="sh">
                <strong>snepr</strong>
                <span>● DEMO · SAMPLE SALON</span>
              </div>
              <div id="svcs">
                {DEMO_SERVICES.map((s, idx) => (
                  <button
                    key={s.name}
                    className="svc cursor-pointer"
                    aria-pressed={selectedServiceIndex === idx}
                    onClick={() => setSelectedServiceIndex(idx)}
                  >
                    <span>
                      {s.name}
                      <small>{s.minutes} min</small>
                    </span>
                    <b>₹{s.price}</b>
                  </button>
                ))}
              </div>
              <button className="btn btn-brown cursor-pointer" id="gen" style={{ width: "100%" }} onClick={handleGenerateToken}>
                Generate demo token
              </button>
              <div id="tout">
                {generatedToken && (
                  <div className="tok">
                    {/* Perforated Scissor Cut Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 10px", opacity: 0.75 }}>
                      <span style={{ fontSize: "14px", transform: "scaleX(-1)", display: "inline-block" }}>✂</span>
                      <span style={{ flex: 1, borderTop: "1px dashed rgba(240, 194, 143, 0.6)", margin: "0 8px" }} />
                      <span style={{ fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#f0c28f" }}>SNIP TICKET</span>
                    </div>
                    <div className="note" style={{ color: "#c9b8aa" }}>DEMO TOKEN</div>
                    <div className="tk">{generatedToken.token}</div>
                    <div style={{ fontSize: ".85rem" }}>
                      Position {generatedToken.position} · {generatedToken.ahead} ahead
                    </div>
                    <div style={{ color: "#f0c28f", fontSize: ".85rem" }}>
                      Est. wait about {generatedToken.estWait} min
                    </div>
                    <div className="note" style={{ color: "#c9b8aa", marginTop: "6px" }}>
                      {generatedToken.serviceName} · ₹{generatedToken.price} · simulated
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SalonOS Desk View */}
            <div id="vS" className={activeDemoTab === "s" ? "" : "hidden"}>
              <div className="sh">
                <strong>SalonOS</strong>
                <span>● DESK PREVIEW · DEMO DATA</span>
              </div>
              <div className="chairs" id="chairs">
                {deskChairs.map((c, i) => (
                  <div key={c.id} className={`chair ${c.token ? "busy" : ""}`}>
                    <small>CHAIR {i + 1}</small>
                    <b>{c.token || "Free"}</b>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "16px", fontWeight: 700, fontSize: ".8rem" }}>
                Waiting
              </div>
              <div className="qrow" id="qrow">
                {deskQueue.length > 0 ? (
                  deskQueue.map((t) => (
                    <span key={t} className="qt">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="note">Queue empty</span>
                )}
              </div>
              <button className="btn btn-brown cursor-pointer" id="next" onClick={handleDeskCallNext}>
                Call next
              </button>{" "}
              <button className="btn btn-out cursor-pointer" id="walk" onClick={handleDeskAddWalkIn}>
                Add walk in token
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS SECTION ─── */}
      <section className="section how" id="how">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Simple by design</div>
              <h2>From your couch to the barber chair.</h2>
            </div>
          </div>
          <div className="stp">
            <article className="step reveal">
              <div className="n">01</div>
              <h3>Check the wait</h3>
              <p>See live availability and wait estimates before you travel.</p>
              <div className="mini">
                <div className="r">
                  <span>Lakmé Salon</span>
                  <b>10 min</b>
                </div>
                <div className="r">
                  <span>NVN Unisex</span>
                  <b>0 min</b>
                </div>
              </div>
            </article>

            <article className="step reveal" style={{ ["--d" as any]: ".12s" }}>
              <div className="n">02</div>
              <h3>Save your chair</h3>
              <p>Select a service and join the digital queue from your phone.</p>
              <div className="mini">
                <div className="r">
                  <span>Haircut · 25 min</span>
                  <b>Join queue</b>
                </div>
              </div>
            </article>

            <article className="step reveal" style={{ ["--d" as any]: ".24s" }}>
              <div className="n">03</div>
              <h3>Walk straight in</h3>
              <p>Follow your token and arrive when your turn is close.</p>
              <div className="mini">
                <div className="r">
                  <span>Your token</span>
                  <b>A07</b>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─── SCISSOR CUT PERFORATION TRANSITION ─── */}
      <div className="wrap my-2">
        <ScissorCutAnimation cuttingText="TRY THE LOOK BEFORE THE CUT" />
      </div>

      {/* ─── 5. AI HAIR STUDIO SECTION ─── */}
      <section className="section ai" id="ai">
        <div className="wrap al">
          <div className="reveal">
            <div className="kicker">AI Hair Studio · Concept</div>
            <h2>Try the look before the cut.</h2>
            <p className="sub">
              Explore hairstyles and prepare a clearer conversation with your barber.
            </p>
            <ul className="pts">
              <li>Hairstyle discovery and personalised suggestions</li>
              <li>Share a preferred style with your barber</li>
              <li>Connect styles to salon services and pricing</li>
            </ul>
            <p className="note" style={{ marginBottom: "20px" }}>
              Illustrated concept only, not a real AI render. Capabilities are described only once they ship.
            </p>
            <a className="btn btn-dark" href="/live/studio">
              Explore AI Studio Lookbook
            </a>
          </div>

          <div className="studio reveal" style={{ ["--d" as any]: ".1s" }}>
            <div className="cmp">
              <svg viewBox="0 0 240 280">
                <rect width="240" height="280" fill="#EADFCB" />
                <ellipse cx="120" cy="140" rx="52" ry="66" fill="#D9AE86" />
                <rect x="100" y="190" width="40" height="60" fill="#D9AE86" />
                <path d="M10 280 Q120 200 230 280Z" fill="#6E3A1C" />
              </svg>
              <svg
                viewBox="0 0 240 280"
                id="aft"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
              >
                <rect width="240" height="280" fill="#EADFCB" />
                <ellipse cx="120" cy="140" rx="52" ry="66" fill="#D9AE86" />
                <rect x="100" y="190" width="40" height="60" fill="#D9AE86" />
                <path d="M10 280 Q120 200 230 280Z" fill="#6E3A1C" />
                <path id="hair" fill="#241810" d={HAIRSTYLES[selectedHairstyleIndex].path} />
              </svg>
              <div className="bar" id="bar" style={{ left: `${sliderPosition}%` }} />
            </div>

            <input
              type="range"
              id="sl"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Before and after"
            />
            <div className="sty" id="sty">
              {HAIRSTYLES.map((h, i) => (
                <button
                  key={h.name}
                  className="chip cursor-pointer"
                  aria-pressed={selectedHairstyleIndex === i}
                  onClick={() => setSelectedHairstyleIndex(i)}
                >
                  {h.name}
                </button>
              ))}
            </div>
            <div className="note" id="sinfo">
              CONCEPT ILLUSTRATION · {HAIRSTYLES[selectedHairstyleIndex].name.toUpperCase()}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. SALONOS SECTION ─── */}
      <section className="section os" id="salonos">
        <div className="wrap ol">
          <div className="reveal">
            <div className="kicker">For salon owners · SalonOS</div>
            <h2>Your salon. Your chairs. Your customers. Under control.</h2>
            <p className="sub">
              A salon operations system, separate from the free customer product. Follow one customer through a working day.
            </p>
            <div className="flow" id="flow" role="tablist">
              {SALONOS_FLOW.map((f, i) => (
                <button
                  key={f.title}
                  className="fs cursor-pointer"
                  role="tab"
                  aria-selected={currentFlowIndex === i}
                  onClick={() => setCurrentFlowIndex(i)}
                >
                  <small>0{i + 1}</small>
                  {f.title}
                </button>
              ))}
            </div>
            <div className="caps">
              <span className="cap">Digital queue</span>
              <span className="cap">Automatic tokens</span>
              <span className="cap">Chair availability</span>
              <span className="cap">Service menu</span>
              <span className="cap">Staff logins</span>
              <span className="cap later">Reassignment</span>
              <span className="cap later">Customer history</span>
              <span className="cap later">Analytics</span>
              <span className="cap later">Multi branch</span>
              <span className="cap later">Appointments</span>
            </div>
            <p className="note" style={{ marginTop: "10px" }}>
              Dashed items are enabled based on selected SalonOS plan.
            </p>
          </div>

          <div className="dash reveal" style={{ ["--d" as any]: ".1s" }}>
            <div className="dt">
              <strong>SalonOS · Overview</strong>
              <span>● DEMO DATA</span>
            </div>
            <div className="ds">
              <div className="dsi">
                <small>Active chairs</small>
                <b>3</b>
              </div>
              <div className="dsi">
                <small>Waiting</small>
                <b id="dq">{currentFlow.waiting}</b>
              </div>
              <div className="dsi">
                <small>Next token</small>
                <b id="dn">{currentFlow.next}</b>
              </div>
            </div>
            <div id="dl">
              {currentFlow.lines.map((l) => (
                <div key={l.token} className={`ql ${l.highlight ? "hl" : ""}`}>
                  <b>#{l.token}</b>
                  <span>{l.label}</span>
                </div>
              ))}
            </div>
            <div className="dnote" id="dnote">
              {currentFlow.desc}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. REVIEWS & POINTS SECTION ─── */}
      <section className="section loy" id="points">
        <div className="wrap ll">
          <div className="reveal">
            <div className="kicker">Verified reviews · Snepr Points</div>
            <h2>Reviews you can trust. Points you can spend.</h2>
            <ul className="rules">
              <li>
                <b>01</b>Only verified, completed customers can review.
              </li>
              <li>
                <b>02</b>Each eligible review earns 10 Snepr Points. 1 point = ₹1.
              </li>
              <li>
                <b>03</b>Points can be redeemed as a service discount, up to 20% of the bill.
              </li>
              <li>
                <b>04</b>The reward does not depend on the rating. One star earns the same as five.
              </li>
            </ul>
            <p className="note" style={{ marginTop: "14px" }}>
              PROPOSED MODEL. Verification and redemption scope synced against salon billing before checkout.
            </p>
          </div>

          <div className="wallet reveal" style={{ ["--d" as any]: ".1s" }}>
            <small>DEMO WALLET</small>
            <div className="amt" id="amt">
              ₹{pointsWallet}
            </div>
            <div style={{ color: "#e5c9b2", fontSize: ".8rem" }}>in Snepr Points</div>
            <div className="stars" id="stars" role="group" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className={`cursor-pointer ${userRating >= num ? "on" : ""}`}
                  onClick={() => setUserRating(num)}
                  aria-label={`${num} star`}
                >
                  ★
                </button>
              ))}
            </div>
            <button className="btn cursor-pointer" id="rev" onClick={handleSubmitReview}>
              Submit demo review
            </button>
            <p id="rn">{reviewNote}</p>
          </div>
        </div>
      </section>

      {/* ─── 8. PRICING SECTION ─── */}
      <section className="section pricing" id="pricing">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">SalonOS plans</div>
              <h2>Simple pricing. No haircut commissions.</h2>
              <p className="sub">
                Monthly plans. An annual option appears only once billing supports it.
              </p>
            </div>
          </div>

          <div className="pg">
            {/* Base Plan */}
            <article className="pc reveal">
              <div className="pl">BASE · 1 CHAIR</div>
              <h3>Single barber</h3>
              <p className="pd">For independent barbers and single chair studios.</p>
              <div className="price">
                ₹199<small> / month</small>
              </div>
              <ul>
                <li>One active stylist chair</li>
                <li>Real time chair countdown</li>
                <li>Digital queue</li>
                <li>QR standee</li>
                <li>Basic customer alerts</li>
                <li>Verified reviews</li>
              </ul>
              <a className="btn btn-out" href="/login">
                Start with Base
              </a>
            </article>

            {/* Intermediate Plan (Featured) */}
            <article className="pc f reveal" style={{ ["--d" as any]: ".1s" }}>
              <div className="pl">MOST POPULAR · UP TO 3 CHAIRS</div>
              <h3>Intermediate</h3>
              <p className="pd">For growing neighbourhood salons.</p>
              <div className="price">
                ₹400<small> / month</small>
              </div>
              <ul>
                <li>Everything in Base</li>
                <li>Multiple staff logins</li>
                <li>Multi barber queue routing</li>
                <li>WhatsApp notifications</li>
                <li>Snepr Points loyalty listing</li>
                <li>Peak hour analytics</li>
                <li>Wait duration tracking</li>
                <li>Zero commission on service revenue</li>
              </ul>
              <a className="btn" href="/login">
                Choose Intermediate
              </a>
            </article>

            {/* Pro Plan */}
            <article className="pc reveal" style={{ ["--d" as any]: ".2s" }}>
              <div className="pl">PRO · UNLIMITED CHAIRS</div>
              <h3>Pro</h3>
              <p className="pd">For larger salons and multi chair operations.</p>
              <div className="price">
                ₹449<small> / month</small>
              </div>
              <ul>
                <li>Everything in Intermediate</li>
                <li>Advanced AI Studio integration</li>
                <li>Advanced analytics</li>
                <li>Stylist performance</li>
                <li>Revenue reporting</li>
                <li>Featured Explore placement</li>
                <li>Priority support</li>
              </ul>
              <a className="btn btn-out" href="/login">
                Go Pro
              </a>
            </article>
          </div>
          <p className="note" style={{ marginTop: "22px" }}>
            Feature lists reflect active SalonOS permissions for registered partners.
          </p>
        </div>
      </section>

      {/* ─── 9. SALON ECONOMICS CALCULATOR ─── */}
      <section className="section calc" id="calc">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Salon economics</div>
              <h2>See what commission based platforms could cost your salon.</h2>
            </div>
          </div>
          <div className="cb2 reveal">
            <div>
              <div className="ctl">
                <label htmlFor="c1">
                  Average daily customers <output id="o1">{dailyCust}</output>
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
                  Average service ticket <output id="o2">₹{avgTicket.toLocaleString("en-IN")}</output>
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
                  Working days per month <output id="o3">{workDays}</output>
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
                  Comparison commission rate <output id="o4">{commRate}%</output>
                </label>
                <input
                  id="c4"
                  type="range"
                  min="5"
                  max="40"
                  value={commRate}
                  onChange={(e) => setCommRate(Number(e.target.value))}
                />
              </div>

              <div className="ctl">
                <label htmlFor="c5">Snepr plan</label>
                <select
                  id="c5"
                  value={sneprPlanPrice}
                  onChange={(e) => setSneprPlanPrice(Number(e.target.value))}
                >
                  <option value={199}>Base · ₹199</option>
                  <option value={400}>Intermediate · ₹400</option>
                  <option value={449}>Pro · ₹449</option>
                </select>
              </div>
            </div>

            <div className="res">
              <div className="rr">
                <span>Estimated monthly revenue</span>
                <b id="rv">₹{calcMonthlyRevenue.toLocaleString("en-IN")}</b>
              </div>
              <div className="rr">
                <span>Modelled commission</span>
                <b id="rc">₹{calcModelledCommission.toLocaleString("en-IN")}</b>
              </div>
              <div className="rr">
                <span>Snepr subscription</span>
                <b id="rs">₹{sneprPlanPrice.toLocaleString("en-IN")}</b>
              </div>
              <div className="big">
                <small>MODELLED DIFFERENCE PER MONTH</small>
                <strong id="rd">₹{calcSavings.toLocaleString("en-IN")}</strong>
              </div>
              <div className="fm">
                revenue = customers × ticket × days
                <br />
                commission = revenue × rate
                <br />
                difference = commission − subscription
                <br />
                Illustrative model, not a guarantee of additional profit.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10. DIFFERENTIATION COMPARISON TABLE ─── */}
      <section className="section cmpS">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Differentiation</div>
              <h2>A different model for independent salons.</h2>
            </div>
          </div>
          <table className="reveal">
            <thead>
              <tr>
                <th />
                <th>Commission based platforms</th>
                <th>Snepr SalonOS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pricing</td>
                <td>Often a percentage of bookings</td>
                <td>Fixed monthly subscription</td>
              </tr>
              <tr>
                <td>Service revenue</td>
                <td>Commission varies by platform</td>
                <td>No percentage deducted under the stated plans</td>
              </tr>
              <tr>
                <td>Customer relationship</td>
                <td>Varies by platform</td>
                <td>Direct between salon and customer</td>
              </tr>
              <tr>
                <td>Queue visibility</td>
                <td>Often appointment focused</td>
                <td>Chair level live queue</td>
              </tr>
              <tr>
                <td>Customer access</td>
                <td>Frequently app based</td>
                <td>Browser based, no download needed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 11. FAQ SECTION ─── */}
      <section className="section faq" id="faq">
        <div className="wrap fl">
          <div className="reveal">
            <div className="kicker">Help</div>
            <h2>Good to know.</h2>
            <p className="sub">
              Quick answers about how Snepr works for customers and salons.
            </p>
          </div>

          <div className="reveal" style={{ ["--d" as any]: ".1s" }}>
            <div className="ft" id="ft">
              {Object.keys(FAQ_GROUPS).map((tab) => (
                <button
                  key={tab}
                  className="chip cursor-pointer"
                  aria-pressed={activeFaqTab === tab}
                  onClick={() => {
                    setActiveFaqTab(tab);
                    setOpenFaqItems({ 0: true });
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div id="fb">
              {FAQ_GROUPS[activeFaqTab].map((item, idx) => (
                <div key={item[0]} className={`fi ${openFaqItems[idx] ? "open" : ""}`}>
                  <button
                    className="fq cursor-pointer"
                    aria-expanded={openFaqItems[idx] || false}
                    onClick={() => toggleFaq(idx)}
                  >
                    {item[0]}
                    <span>{openFaqItems[idx] ? "−" : "+"}</span>
                  </button>
                  <div className="fa">
                    <div>
                      <p>{item[1]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 12. CTA BANNER ─── */}
      <section className="cta">
        <div className="wrap">
          <div className="reveal">
            <h2>Know before you go.</h2>
            <p>
              Customers can find a salon and check the queue. Owners can list, claim or explore SalonOS.
            </p>
            <div className="acts">
              <a className="btn" href="#discover">
                Find a salon near you
              </a>
              <a className="btn o" href="/claim">
                Register your salon
              </a>
              <a className="btn o" href="/claim">
                Claim your salon
              </a>
            </div>
          </div>
          <div className="app reveal" style={{ ["--d" as any]: ".1s" }}>
            <b>Snepr app</b>
            <p>A native app with the same live queues. Available on Android and web.</p>
            <a className="btn" href="/live">
              Get the app
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
              Continue on web
            </a>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM FLOATING NAV (MOBILE) ─── */}
      <div className="bnav">
        <a href="#discover">Find a salon</a>
        <a href="#demo">Demo</a>
        <a href="#pricing">Pricing</a>
      </div>
    </main>
  );
}

export default SneprLandingPageExact;
