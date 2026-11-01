import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

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
  component: SneprLandingPage,
});

/* ─── SALON SAMPLE DATA ─── */
interface SalonItem {
  n: string;
  a: string;
  t: string;
  r: number;
  w: number;
  c: string;
  q: number;
}

const SAMPLE_SALONS: SalonItem[] = [
  {
    n: "The Scissors Edge",
    a: "Saheed Nagar",
    t: "Unisex",
    r: 4.8,
    w: 5,
    c: "2 of 3 chairs free",
    q: 1,
  },
  {
    n: "Urban Look Salon",
    a: "Jaydev Vihar",
    t: "Men's",
    r: 4.6,
    w: 10,
    c: "1 of 2 chairs free",
    q: 3,
  },
  {
    n: "Style Studio by Jawed Habib",
    a: "Patia",
    t: "Premium",
    r: 4.7,
    w: 15,
    c: "All chairs busy",
    q: 5,
  },
];

const col = (w: number) =>
  w <= 5 ? "var(--green)" : w <= 10 ? "var(--amber)" : "var(--red)";

/* ─── DEMO SERVICES ─── */
const DEMO_SERVICES = [
  { n: "Haircut", m: 25, p: 150 },
  { n: "Beard trim", m: 15, p: 80 },
  { n: "Haircut + Beard", m: 40, p: 200 },
  { n: "Facial", m: 35, p: 350 },
];

/* ─── AI HAIRSTYLES ─── */
const AI_HAIRSTYLES = [
  {
    n: "Textured crop",
    d: "M70 120 Q72 60 120 58 Q168 60 170 120 Q150 92 120 92 Q90 92 70 120Z",
  },
  {
    n: "Quiff",
    d: "M66 130 Q60 50 130 40 Q184 40 174 128 Q150 80 118 84 Q90 86 66 130Z",
  },
  {
    n: "Long layers",
    d: "M62 190 Q46 52 120 52 Q194 52 178 190 L166 190 Q168 100 120 92 Q72 100 74 190Z",
  },
];

/* ─── SALONOS WORKFLOW STAGES ─── */
const SALONOS_FLOW = [
  {
    title: "Customer joins",
    desc: "A customer picks a service on Snepr and joins the queue for a chair.",
    waiting: 3,
    next: "A06",
    chairs: [
      { tok: "A05", label: "Chair 1 · In service", hl: false },
      { tok: "A06", label: "Next", hl: false },
      { tok: "A07", label: "Just joined", hl: true },
    ],
  },
  {
    title: "Token appears",
    desc: "The salon desk shows the new token with its service and estimated duration.",
    waiting: 3,
    next: "A06",
    chairs: [
      { tok: "A05", label: "Chair 1 · In service", hl: false },
      { tok: "A06", label: "Next", hl: false },
      { tok: "A07", label: "Token created · waiting", hl: true },
    ],
  },
  {
    title: "Barber calls next",
    desc: "The barber taps Call Next and the token moves to their chair.",
    waiting: 2,
    next: "A07",
    chairs: [
      { tok: "A05", label: "Chair 1 · Finishing", hl: false },
      { tok: "A06", label: "Chair 2 · Called", hl: true },
      { tok: "A07", label: "Next", hl: false },
    ],
  },
  {
    title: "Customer notified",
    desc: "The customer is alerted that their turn is close. Channels depend on what is enabled.",
    waiting: 2,
    next: "A07",
    chairs: [
      { tok: "A05", label: "Chair 1 · Finishing", hl: false },
      { tok: "A06", label: "Chair 2 · In service", hl: false },
      { tok: "A07", label: "Notified · turn is close", hl: true },
    ],
  },
  {
    title: "Service completes",
    desc: "The barber marks the service done and the chair becomes free.",
    waiting: 1,
    next: "A07",
    chairs: [
      { tok: "A05", label: "Done", hl: false },
      { tok: "A06", label: "Done · chair free", hl: true },
      { tok: "A07", label: "Next", hl: false },
    ],
  },
  {
    title: "Review and points",
    desc: "An eligible completed customer can review and earn Snepr Points under the stated rules.",
    waiting: 1,
    next: "A07",
    chairs: [
      { tok: "A05", label: "Done", hl: false },
      { tok: "A06", label: "Eligible to review", hl: true },
      { tok: "A07", label: "Next", hl: false },
    ],
  },
];

/* ─── FAQ QUESTIONS ─── */
const FAQ_DATA: Record<string, [string, string][]> = {
  Customers: [
    [
      "Do I need to download an app?",
      "No. Snepr works directly in the browser. A native app also exists if you prefer it.",
    ],
    [
      "How do I join a live queue?",
      "Open a salon, choose a service and join. You get a live token with real-time countdown.",
    ],
    [
      "How are wait times calculated?",
      "Wait times are calculated dynamically based on active chair status and current queue length.",
    ],
    [
      "Can I cancel my token?",
      "Yes, you can cancel your token anytime from the digital pass with a single tap.",
    ],
    [
      "How do I redeem Snepr Points?",
      "As a direct service discount, up to 20% of the bill under our loyalty model. 1 Point = ₹1.",
    ],
  ],
  "Salon owners": [
    [
      "How do salon owners update queues?",
      "From the SalonOS desk with Call Next, chair toggles, and manual walk-in entry buttons.",
    ],
    [
      "Can one salon manage multiple chairs?",
      "Yes. Intermediate covers up to three chairs and Pro covers unlimited chairs.",
    ],
    [
      "How quickly can a salon start?",
      "A salon can onboard and begin issuing digital tokens in under 5 minutes.",
    ],
    [
      "What happens if a salon closes?",
      "The queue automatically pauses and informs waiting customers of reopening hours.",
    ],
  ],
  Pricing: [
    [
      "Are there monthly commissions?",
      "No percentage is deducted from service revenue under the stated plans. You pay a transparent fixed monthly subscription.",
    ],
    [
      "How does Snepr make money?",
      "From transparent salon software subscriptions. Customers use the service 100% free.",
    ],
  ],
  "AI Studio": [
    [
      "What can AI Studio do?",
      "It lets you preview curated hairstyles, explore cuts before sitting in the chair, and share the exact reference with your stylist.",
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

  /* ─── LOCATION DETECTION STATE ─── */
  const [locText, setLocText] = useState("Set your area to see salons");
  const [selectedArea, setSelectedArea] = useState("Patia, Bhubaneswar");

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocText("Location unsupported. Pick an area below.");
      return;
    }
    setLocText("Finding you...");
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocText("Location detected. Distances will show here.");
      },
      () => {
        setLocText("Permission denied. Select an area manually.");
      },
      { timeout: 8000 }
    );
  };

  /* ─── SALON FILTERS & SKELETON LOADER ─── */
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredSalons, setFilteredSalons] = useState<SalonItem[]>(SAMPLE_SALONS);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  useEffect(() => {
    setIsFilterLoading(true);
    const timer = setTimeout(() => {
      let list = [...SAMPLE_SALONS];
      if (activeFilter === "short") {
        list.sort((a, b) => a.w - b.w);
      } else if (activeFilter === "now") {
        list = list.filter((s) => s.w <= 10);
      } else if (activeFilter === "rated") {
        list.sort((a, b) => b.r - a.r);
      } else if (activeFilter !== "all") {
        list = list.filter((s) => s.t === activeFilter);
      }
      setFilteredSalons(list);
      setIsFilterLoading(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [activeFilter]);

  /* ─── DEMO SECTION STATE ─── */
  const [demoTab, setDemoTab] = useState<"c" | "s">("c");
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [demoTokenGenerated, setDemoTokenGenerated] = useState(false);

  // SalonOS Desk Demo state
  const [deskChairs, setDeskChairs] = useState<({ tok: string | null })[]>([
    { tok: "A04" },
    { tok: "Free" },
    { tok: "A05" },
  ]);
  const [deskQueue, setDeskQueue] = useState<string[]>(["A06", "A07", "A08"]);
  const nextTokenNum = useRef(9);

  const handleCallNext = () => {
    if (deskQueue.length === 0) return;
    const nextToken = deskQueue[0];
    setDeskQueue((prev) => prev.slice(1));
    setDeskChairs((prev) => {
      const freeIdx = prev.findIndex((c) => c.tok === "Free" || !c.tok);
      const targetIdx = freeIdx >= 0 ? freeIdx : 0;
      return prev.map((c, i) => (i === targetIdx ? { tok: nextToken } : c));
    });
  };

  const handleAddWalkIn = () => {
    const token = `A${String(nextTokenNum.current++).padStart(2, "0")}`;
    setDeskQueue((prev) => [...prev, token]);
  };

  /* ─── AI STUDIO STATE ─── */
  const [selectedHairstyle, setSelectedHairstyle] = useState(0);
  const [splitSlider, setSplitSlider] = useState(50);

  /* ─── SALONOS FLOW STATE ─── */
  const [flowIndex, setFlowIndex] = useState(0);

  /* ─── DEMO WALLET & REVIEWS STATE ─── */
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [walletPoints, setWalletPoints] = useState(0);
  const [reviewNote, setReviewNote] = useState(
    "Choose any rating. You earn 10 points either way."
  );

  const handleSubmitReview = () => {
    if (!userRating) {
      setReviewNote("Choose a rating first.");
      return;
    }
    setWalletPoints((prev) => prev + 10);
    setReviewNote(
      `${userRating} star review submitted. +10 points, same as any rating.`
    );
    setUserRating(0);
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

  const shortestWaitSalon = [...SAMPLE_SALONS].sort((a, b) => a.w - b.w)[0];

  return (
    <main id="top" className="snepr-body">
      {/* ─── HERO SECTION ─── */}
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
              Check live chair wait times from home. Save your place remotely and
              arrive when your barber is ready. Know before you go.
            </p>
            <div className="acts reveal" style={{ ["--d" as any]: ".24s" }}>
              <a className="btn btn-dark" href="#discover">
                Find a salon near you
              </a>
              <a className="btn btn-out" href="#discover">
                Explore live queues
              </a>
              <a className="own" href="#salonos">
                For salon owners ↗
              </a>
            </div>
            <div className="loc reveal" style={{ ["--d" as any]: ".32s" }}>
              <span>{locText}</span>
              <button onClick={detectLocation}>Use my location</button>
            </div>
          </div>

          <div
            className="panel reveal"
            style={{ ["--d" as any]: ".15s" }}
            aria-label="Sample live salon preview"
          >
            <div className="ptop">
              ⌕ Salons near you, right now{" "}
              <span className="live">● LIVE</span>
            </div>
            <div>
              {SAMPLE_SALONS.map((s) => (
                <div className="srow" key={s.n}>
                  <div className="av">{s.n[0]}</div>
                  <div>
                    <div className="sn">{s.n}</div>
                    <div className="sm">
                      {s.a} · {s.t} · ★ {s.r}
                    </div>
                  </div>
                  <div className="w" style={{ color: col(s.w) }}>
                    {s.w} min<small>WAIT</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="fast">
              <span>Shortest listed wait</span>
              <b>
                {shortestWaitSalon.w} min · {shortestWaitSalon.n}
              </b>
            </div>
            <div className="badge">SAMPLE PREVIEW DATA</div>
          </div>
        </div>
      </section>

      {/* ─── DISCOVER & LIVE QUEUES SECTION ─── */}
      <section className="section discover" id="discover">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Live salon discovery</div>
              <h2 className="snepr-h2">Salons near you, right now.</h2>
              <p className="sub">Showing sample salons for {selectedArea}.</p>
            </div>
            <div className="locbar">
              <select
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  setLocText(e.target.value);
                }}
                aria-label="Select area"
              >
                <option value="Patia, Bhubaneswar">Patia, Bhubaneswar</option>
                <option value="Saheed Nagar, Bhubaneswar">
                  Saheed Nagar, Bhubaneswar
                </option>
                <option value="Jaydev Vihar, Bhubaneswar">
                  Jaydev Vihar, Bhubaneswar
                </option>
              </select>
              <button className="pr" onClick={detectLocation}>
                Use my location
              </button>
            </div>
          </div>

          <div className="filters" role="group" aria-label="Filters">
            {[
              { id: "all", label: "All salons" },
              { id: "short", label: "Shortest wait" },
              { id: "now", label: "Available now" },
              { id: "rated", label: "Top rated" },
              { id: "Men's", label: "Men's" },
              { id: "Unisex", label: "Unisex" },
              { id: "Premium", label: "Premium" },
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

          <div className="grid3">
            {isFilterLoading ? (
              <>
                <div className="skel" />
                <div className="skel" />
                <div className="skel" />
              </>
            ) : filteredSalons.length > 0 ? (
              filteredSalons.map((s) => (
                <article className="card" key={s.n}>
                  <div className="ct">
                    <div className="mark">{s.n[0]}</div>
                    <span className="st">
                      <i className="dot" style={{ marginRight: "5px" }} />
                      Open
                    </span>
                  </div>
                  <h3>{s.n}</h3>
                  <div className="meta">
                    <span>{s.a}</span>
                    <span>{s.t}</span>
                    <span>★ {s.r}</span>
                  </div>
                  <div className="meta">
                    <span>{s.c}</span>
                    <span>{s.q} in queue</span>
                  </div>
                  <div className="cb">
                    <div className="bw" style={{ color: col(s.w) }}>
                      {s.w}
                      <small> min wait</small>
                    </div>
                    <a className="btn btn-dark" href="#demo">
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
            SAMPLE DATA. In production this comes from the nearby salon API, with
            real distances from coordinates and a last updated time on each card.
          </p>
        </div>
      </section>

      {/* ─── INTERACTIVE DEMO (CUSTOMER & SALONOS) ─── */}
      <section className="section demo" id="demo">
        <div className="wrap dl">
          <div className="reveal">
            <div className="kicker">A closer look</div>
            <h2 className="snepr-h2" style={{ color: "#fff" }}>
              See the queue. Feel in control.
            </h2>
            <p className="sub">
              Switch between the customer view and the salon desk. Nothing here
              creates a real queue entry.
            </p>

            <div className="tabs" role="tablist">
              <span
                className="knob"
                style={{
                  left: demoTab === "c" ? "5px" : "135px",
                  width: demoTab === "c" ? "124px" : "130px",
                }}
              />
              <button
                role="tab"
                aria-selected={demoTab === "c"}
                onClick={() => setDemoTab("c")}
              >
                Customer view
              </button>
              <button
                role="tab"
                aria-selected={demoTab === "s"}
                onClick={() => setDemoTab("s")}
              >
                SalonOS desk
              </button>
            </div>

            <div className="dtitle">
              {demoTab === "c" ? "The customer side" : "The barber desk"}
            </div>
            <p style={{ color: "#c2b5ab" }}>
              {demoTab === "c"
                ? "Pick a service, see its duration and price, then generate a demo token with queue position and estimated wait."
                : "Call the next customer, watch chairs update and add walk in tokens. All simulated."}
            </p>
          </div>

          <div className="screen reveal" style={{ ["--d" as any]: ".1s" }}>
            {demoTab === "c" ? (
              <div>
                <div className="sh">
                  <strong>snepr</strong>
                  <span>● DEMO · SAMPLE SALON</span>
                </div>
                <div>
                  {DEMO_SERVICES.map((s, idx) => (
                    <button
                      key={s.n}
                      className="svc"
                      aria-pressed={selectedService === idx}
                      onClick={() => {
                        setSelectedService(idx);
                        setDemoTokenGenerated(false);
                      }}
                    >
                      <span>
                        {s.n}
                        <small>{s.m} min</small>
                      </span>
                      <b>₹{s.p}</b>
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-brown"
                  style={{ width: "100%", marginTop: "12px" }}
                  onClick={() => setDemoTokenGenerated(true)}
                >
                  Generate demo token
                </button>

                {demoTokenGenerated && selectedService !== null ? (
                  <div className="tok">
                    <div className="note" style={{ color: "#c9b8aa" }}>
                      DEMO TOKEN
                    </div>
                    <div className="tk">A07</div>
                    <div style={{ fontSize: ".85rem" }}>
                      Position 4 · 3 ahead
                    </div>
                    <div style={{ color: "#f0c28f", fontSize: ".85rem" }}>
                      Est. wait about {3 * 20} min
                    </div>
                    <div
                      className="note"
                      style={{ color: "#c9b8aa", marginTop: "6px" }}
                    >
                      {DEMO_SERVICES[selectedService].n} · ₹
                      {DEMO_SERVICES[selectedService].p} · simulated
                    </div>
                  </div>
                ) : demoTokenGenerated && selectedService === null ? (
                  <div
                    className="note"
                    style={{ marginTop: "12px", textAlign: "center" }}
                  >
                    Select a service first.
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                <div className="sh">
                  <strong>SalonOS</strong>
                  <span>● DESK PREVIEW · DEMO DATA</span>
                </div>
                <div className="chairs">
                  {deskChairs.map((c, i) => (
                    <div
                      key={i}
                      className={`chair ${c.tok && c.tok !== "Free" ? "busy" : ""}`}
                    >
                      <small>CHAIR {i + 1}</small>
                      <b>{c.tok || "Free"}</b>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: "16px",
                    fontWeight: 700,
                    fontSize: ".8rem",
                  }}
                >
                  Waiting
                </div>
                <div className="qrow">
                  {deskQueue.length > 0 ? (
                    deskQueue.map((t) => (
                      <span className="qt" key={t}>
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="note">Queue empty</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button className="btn btn-brown" onClick={handleCallNext}>
                    Call next
                  </button>
                  <button className="btn btn-out" onClick={handleAddWalkIn}>
                    Add walk in token
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section className="section how" id="how">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Simple by design</div>
              <h2 className="snepr-h2">From your couch to the barber chair.</h2>
            </div>
          </div>
          <div className="stp">
            <article className="step reveal">
              <div className="n">01</div>
              <h3 className="snepr-h3">Check the wait</h3>
              <p>See live availability and wait estimates before you travel.</p>
              <div className="mini">
                <div className="r">
                  <span>Sample Salon A</span>
                  <b>5 min</b>
                </div>
                <div className="r">
                  <span>Sample Salon B</span>
                  <b>12 min</b>
                </div>
              </div>
            </article>

            <article className="step reveal" style={{ ["--d" as any]: ".12s" }}>
              <div className="n">02</div>
              <h3 className="snepr-h3">Save your chair</h3>
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
              <h3 className="snepr-h3">Walk straight in</h3>
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

      {/* ─── AI STUDIO CONCEPT SECTION ─── */}
      <section className="section ai" id="ai">
        <div className="wrap al">
          <div className="reveal">
            <div className="kicker">AI Hair Studio · Concept</div>
            <h2 className="snepr-h2">Try the look before the cut.</h2>
            <p className="sub">
              Explore hairstyles and prepare a clearer conversation with your
              barber.
            </p>
            <ul className="pts">
              <li>Hairstyle discovery and personalised suggestions</li>
              <li>Share a preferred style with your barber</li>
              <li>Connect styles to salon services and pricing</li>
            </ul>
            <p className="note" style={{ marginBottom: "20px" }}>
              Illustrated concept only, not a real AI render. Capabilities are
              described only once they ship.
            </p>
            <a className="btn btn-dark" href="#top">
              Join the AI Studio waitlist
            </a>
          </div>

          <div className="studio reveal" style={{ ["--d" as any]: ".1s" }}>
            <div className="cmp">
              {/* Base Head SVG */}
              <svg viewBox="0 0 240 280">
                <rect width="240" height="280" fill="#EADFCB" />
                <ellipse cx="120" cy="140" rx="52" ry="66" fill="#D9AE86" />
                <rect x="100" y="190" width="40" height="60" fill="#D9AE86" />
                <path d="M10 280 Q120 200 230 280Z" fill="#6E3A1C" />
              </svg>
              {/* Styled Hair Overlay with Slider Clip */}
              <svg
                viewBox="0 0 240 280"
                style={{ clipPath: `inset(0 0 0 ${splitSlider}%)` }}
              >
                <rect width="240" height="280" fill="#EADFCB" />
                <ellipse cx="120" cy="140" rx="52" ry="66" fill="#D9AE86" />
                <rect x="100" y="190" width="40" height="60" fill="#D9AE86" />
                <path d="M10 280 Q120 200 230 280Z" fill="#6E3A1C" />
                <path d={AI_HAIRSTYLES[selectedHairstyle].d} fill="#241810" />
              </svg>
              <div className="bar" style={{ left: `${splitSlider}%` }} />
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={splitSlider}
              onChange={(e) => setSplitSlider(Number(e.target.value))}
              aria-label="Before and after"
            />

            <div className="sty">
              {AI_HAIRSTYLES.map((h, i) => (
                <button
                  key={h.n}
                  className={`chip ${selectedHairstyle === i ? "active" : ""}`}
                  aria-pressed={selectedHairstyle === i}
                  onClick={() => setSelectedHairstyle(i)}
                >
                  {h.n}
                </button>
              ))}
            </div>

            <div className="note">
              CONCEPT ILLUSTRATION ·{" "}
              {AI_HAIRSTYLES[selectedHairstyle].n.toUpperCase()}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SALONOS FOR SALON OWNERS ─── */}
      <section className="section os" id="salonos">
        <div className="wrap ol">
          <div className="reveal">
            <div className="kicker">For salon owners · SalonOS</div>
            <h2 className="snepr-h2">
              Your salon. Your chairs. Your customers. Under control.
            </h2>
            <p className="sub">
              A salon operations system, separate from the free customer
              product. Follow one customer through a working day.
            </p>

            <div className="flow" role="tablist">
              {SALONOS_FLOW.map((f, i) => (
                <button
                  key={f.title}
                  className="fs"
                  role="tab"
                  aria-selected={flowIndex === i}
                  onClick={() => setFlowIndex(i)}
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
              Dashed items are shown only if built in the backend.
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
                <b>{SALONOS_FLOW[flowIndex].waiting}</b>
              </div>
              <div className="dsi">
                <small>Next token</small>
                <b>{SALONOS_FLOW[flowIndex].next}</b>
              </div>
            </div>
            <div>
              {SALONOS_FLOW[flowIndex].chairs.map((l) => (
                <div key={l.tok} className={`ql ${l.hl ? "hl" : ""}`}>
                  <b>#{l.tok}</b>
                  <span>{l.label}</span>
                </div>
              ))}
            </div>
            <div className="dnote">{SALONOS_FLOW[flowIndex].desc}</div>
          </div>
        </div>
      </section>

      {/* ─── POINTS & REVIEWS ─── */}
      <section className="section loy" id="points">
        <div className="wrap ll">
          <div className="reveal">
            <div className="kicker">Verified reviews · Snepr Points</div>
            <h2 className="snepr-h2">Reviews you can trust. Points you can spend.</h2>
            <ul className="rules">
              <li>
                <b>01</b>Only verified, completed customers can review.
              </li>
              <li>
                <b>02</b>Each eligible review earns 10 Snepr Points. 1 point = ₹1.
              </li>
              <li>
                <b>03</b>Points can be redeemed as a service discount, up to 20%
                of the bill.
              </li>
              <li>
                <b>04</b>The reward does not depend on the rating. One star earns
                the same as five.
              </li>
            </ul>
            <p className="note" style={{ marginTop: "14px" }}>
              PROPOSED MODEL. Verification and redemption scope to be confirmed
              against the backend before launch.
            </p>
          </div>

          <div className="wallet reveal" style={{ ["--d" as any]: ".1s" }}>
            <small>DEMO WALLET</small>
            <div className="amt">₹{walletPoints}</div>
            <div style={{ color: "#e5c9b2", fontSize: ".8rem" }}>
              in Snepr Points
            </div>
            <div className="stars" role="group" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={
                    (hoverRating || userRating) >= star ? "on" : ""
                  }
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setUserRating(star)}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
            </div>
            <button className="btn" onClick={handleSubmitReview}>
              Submit demo review
            </button>
            <p>{reviewNote}</p>
          </div>
        </div>
      </section>

      {/* ─── PRICING PLANS ─── */}
      <section className="section pricing" id="pricing">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">SalonOS plans</div>
              <h2 className="snepr-h2">Simple pricing. No haircut commissions.</h2>
              <p className="sub">
                Monthly plans. An annual option appears only once billing
                supports it.
              </p>
            </div>
          </div>
          <div className="pg">
            <article className="pc reveal">
              <div className="pl">BASE · 1 CHAIR</div>
              <h3 className="snepr-h3">Single barber</h3>
              <p className="pd">
                For independent barbers and single chair studios.
              </p>
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
              <a className="btn btn-out" href="/claim">
                Start with Base
              </a>
            </article>

            <article className="pc f reveal" style={{ ["--d" as any]: ".1s" }}>
              <div className="pl">MOST POPULAR · UP TO 3 CHAIRS</div>
              <h3 className="snepr-h3">Intermediate</h3>
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
              <a className="btn" href="/claim">
                Choose Intermediate
              </a>
            </article>

            <article className="pc reveal" style={{ ["--d" as any]: ".2s" }}>
              <div className="pl">PRO · UNLIMITED CHAIRS</div>
              <h3 className="snepr-h3">Pro</h3>
              <p className="pd">
                For larger salons and multi chair operations.
              </p>
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
              <a className="btn btn-out" href="/claim">
                Go Pro
              </a>
            </article>
          </div>
          <p className="note" style={{ marginTop: "22px" }}>
            Feature lists must match backend entitlements before launch.
          </p>
        </div>
      </section>

      {/* ─── SALON ECONOMICS CALCULATOR ─── */}
      <section className="section calc" id="calc">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Salon economics</div>
              <h2 className="snepr-h2">
                See what commission based platforms could cost your salon.
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
                  Average service ticket{" "}
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
                  Comparison commission rate <output>{commRate}%</output>
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
                <b>₹{monthlyRev.toLocaleString("en-IN")}</b>
              </div>
              <div className="rr">
                <span>Modelled commission</span>
                <b>₹{modelledCommission.toLocaleString("en-IN")}</b>
              </div>
              <div className="rr">
                <span>Snepr subscription</span>
                <b>₹{sneprPlanPrice.toLocaleString("en-IN")}</b>
              </div>
              <div className="big">
                <small>MODELLED DIFFERENCE PER MONTH</small>
                <strong>₹{modelledSavings.toLocaleString("en-IN")}</strong>
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

      {/* ─── DIFFERENTIATION COMPARISON ─── */}
      <section className="section cmpS">
        <div className="wrap">
          <div className="head reveal">
            <div>
              <div className="kicker">Differentiation</div>
              <h2 className="snepr-h2">A different model for independent salons.</h2>
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

      {/* ─── FAQ ACCORDION SECTION ─── */}
      <section className="section faq" id="faq">
        <div className="wrap fl">
          <div className="reveal">
            <div className="kicker">Help</div>
            <h2 className="snepr-h2">Good to know.</h2>
            <p className="sub">
              Answers marked TBC need your real product rules before launch.
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

      {/* ─── BOTTOM CALL TO ACTION ─── */}
      <section className="cta">
        <div className="wrap">
          <div className="reveal">
            <h2 className="snepr-h2">Know before you go.</h2>
            <p>
              Customers can find a salon and check the queue. Owners can list,
              claim or explore SalonOS.
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
            <p>
              A native app with the same live queues. Download for Android or
              continue in browser.
            </p>
            <a className="btn" href="/Snepr-release.apk" download>
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

      {/* ─── MOBILE STICKY BOTTOM NAV ─── */}
      <div className="bnav">
        <a href="#discover">Find a salon</a>
        <a href="#demo">Demo</a>
        <a href="#pricing">Pricing</a>
      </div>
    </main>
  );
}

export default SneprLandingPage;
