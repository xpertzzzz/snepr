import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef } from "react";
import { REAL_SALONS_DATA, RealSalon } from "@/lib/real-salons";
import {
  HeroScissorStrand,
  SeamScissorDivider,
  FinalVerticalStrandCut,
} from "@/components/animations/ScissorCutAnimation";
import "@/styles/snepr-final.css";

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

/* ─── DEMO SERVICES ─── */
const DEMO_SERVICES = [
  { n: "Haircut", m: 25, p: 150 },
  { n: "Beard trim", m: 15, p: 80 },
  { n: "Haircut + Beard", m: 40, p: 200 },
  { n: "Facial", m: 35, p: 350 },
];

/* ─── AI STUDIO HAIRSTYLES ─── */
const HAIRSTYLES = [
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

/* ─── SALONOS 6-STEP WORKFLOW DATA ─── */
const SALONOS_FLOW: Array<[string, string, number, string, Array<[string, string, number]>]> = [
  [
    "Customer joins",
    "A customer picks a service on Snepr and joins the queue for a chair.",
    3,
    "A06",
    [["A05", "Chair 1 · In service", 0], ["A06", "Next", 0], ["A07", "Just joined", 1]],
  ],
  [
    "Token appears",
    "The salon desk shows the new token with its service and estimated duration.",
    3,
    "A06",
    [["A05", "Chair 1 · In service", 0], ["A06", "Next", 0], ["A07", "Token created · waiting", 1]],
  ],
  [
    "Barber calls next",
    "The barber taps Call Next and the token moves to their chair.",
    2,
    "A07",
    [["A05", "Chair 1 · Finishing", 0], ["A06", "Chair 2 · Called", 1], ["A07", "Next", 0]],
  ],
  [
    "Customer notified",
    "The customer is alerted that their turn is close. Channels depend on what is enabled.",
    2,
    "A07",
    [["A05", "Chair 1 · Finishing", 0], ["A06", "Chair 2 · In service", 0], ["A07", "Notified · turn is close", 1]],
  ],
  [
    "Service completes",
    "The barber marks the service done and the chair becomes free.",
    1,
    "A07",
    [["A05", "Done", 0], ["A06", "Done · chair free", 1], ["A07", "Next", 0]],
  ],
  [
    "Review and points",
    "An eligible completed customer can review and earn Snepr Points under the stated rules.",
    1,
    "A07",
    [["A05", "Done", 0], ["A06", "Eligible to review", 1], ["A07", "Next", 0]],
  ],
];

/* ─── FAQ KNOWLEDGE BASE ─── */
const FAQ_DATA: Record<string, [string, string][]> = {
  Customers: [
    ["Do I need to download an app?", "No. Snepr works in the browser. A native app also exists if you prefer it."],
    ["How do I join a live queue?", "Open a salon, choose a service and join. TBC: exact steps and limits."],
    ["How are wait times calculated?", "TBC: fill from the real estimation logic. They are estimates and can change."],
    ["Can I cancel my token?", "TBC: cancellation rules."],
    ["How do I redeem Snepr Points?", "As a service discount, up to 20% of the bill under the proposed rules. TBC: redemption flow."],
  ],
  "Salon owners": [
    ["How do salon owners update queues?", "From the SalonOS desk with Call Next and chair controls. TBC: final workflow."],
    ["Can one salon manage multiple chairs?", "Yes. Intermediate covers up to three chairs and Pro is unlimited."],
    ["How quickly can a salon start?", "TBC: onboarding time."],
    ["What happens if a salon closes?", "TBC: closure behaviour."],
  ],
  Pricing: [
    ["Are there monthly commissions?", "No percentage is deducted from service revenue under the stated plans. You pay the monthly subscription."],
    ["How does Snepr make money?", "From salon subscriptions. Customers use it free."],
  ],
  "AI Studio": [
    ["What can AI Studio do?", "It is a concept today. Claims go live only when each capability is built."],
  ],
};

export function SneprLandingPageExact() {
  const navigate = useNavigate();

  /* ─── SCROLL REVEAL OBSERVER ─── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal, .step").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ─── HEADER SCROLL STICKY CLASS ─── */
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsHeaderScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── GEOLOCATION STATE ─── */
  const [locationLabel, setLocationLabel] = useState("Set your area to see salons");
  const [selectedArea, setSelectedArea] = useState("Patia, Bhubaneswar");

  const handleGeo = () => {
    if (!navigator.geolocation) {
      setLocationLabel("Location unsupported. Pick an area below.");
      return;
    }
    setLocationLabel("Finding you...");
    navigator.geolocation.getCurrentPosition(
      () => setLocationLabel("Location detected. Distances will show here."),
      () => setLocationLabel("Permission denied. Select an area manually."),
      { timeout: 8000 }
    );
  };

  /* ─── SALONS LIST (SAMPLE DATA ENRICHED WITH REAL HUBS) ─── */
  const [salonFilter, setSalonFilter] = useState("all");
  const [isSkelLoading, setIsSkelLoading] = useState(false);

  // Default sample salons from spec
  const SAMPLE_SALONS = useMemo(
    () => [
      { n: "The Scissors Edge", a: "Saheed Nagar", t: "Unisex", r: 4.8, w: 5, c: "2 of 3 chairs free", q: 1 },
      { n: "Urban Look Salon", a: "Jaydev Vihar", t: "Men's", r: 4.6, w: 10, c: "1 of 2 chairs free", q: 3 },
      { n: "Style Studio by Jawed Habib", a: "Patia", t: "Premium", r: 4.7, w: 15, c: "All chairs busy", q: 5 },
      { n: "Lakmé Salon", a: "Patia", t: "Unisex", r: 4.9, w: 0, c: "2 chairs free", q: 0 },
      { n: "NVN Unisex Salon", a: "Patia", t: "Unisex", r: 4.6, w: 5, c: "1 chair free", q: 2 },
      { n: "Green Trends Salon", a: "Patia", t: "Unisex", r: 4.7, w: 12, c: "1 chair free", q: 4 },
    ],
    []
  );

  const filteredSalons = useMemo(() => {
    let list = [...SAMPLE_SALONS];
    if (salonFilter === "short") list.sort((a, b) => a.w - b.w);
    else if (salonFilter === "now") list = list.filter((s) => s.w <= 10);
    else if (salonFilter === "rated") list.sort((a, b) => b.r - a.r);
    else if (salonFilter !== "all") list = list.filter((s) => s.t === salonFilter);
    return list;
  }, [SAMPLE_SALONS, salonFilter]);

  const shortestWaitSalon = useMemo(() => {
    return [...SAMPLE_SALONS].sort((a, b) => a.w - b.w)[0];
  }, [SAMPLE_SALONS]);

  const col = (w: number) => (w <= 5 ? "var(--green)" : w <= 10 ? "var(--amber)" : "var(--red)");

  const handleFilterChange = (f: string) => {
    setSalonFilter(f);
    setIsSkelLoading(true);
    setTimeout(() => setIsSkelLoading(false), 220);
  };

  /* ─── DEMO TOKEN GENERATOR ─── */
  const [demoTab, setDemoTab] = useState<"c" | "s">("c");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(0);
  const [generatedToken, setGeneratedToken] = useState<any>(null);

  const handleGenerateToken = () => {
    if (selectedServiceIndex === null) return;
    const s = DEMO_SERVICES[selectedServiceIndex];
    const ahead = 3;
    setGeneratedToken({
      tok: "A07",
      pos: ahead + 1,
      ahead,
      est: ahead * 20,
      serviceName: s.n,
      price: s.p,
    });
  };

  /* ─── SALONOS DESK STATE ─── */
  const [deskChairs, setDeskChairs] = useState<{ t: string | null }[]>([
    { t: "A04" },
    { t: null },
    { t: "A05" },
  ]);
  const [deskQueue, setDeskQueue] = useState<string[]>(["A06", "A07", "A08"]);
  const [nextWalkId, setNextWalkId] = useState(9);

  const handleCallNext = () => {
    let idx = deskChairs.findIndex((c) => !c.t);
    if (idx < 0) idx = 0;
    const nextTok = deskQueue.length > 0 ? deskQueue[0] : null;
    const newQueue = deskQueue.length > 0 ? deskQueue.slice(1) : [];
    const newChairs = [...deskChairs];
    newChairs[idx] = { t: nextTok };
    setDeskChairs(newChairs);
    setDeskQueue(newQueue);
  };

  const handleAddWalkIn = () => {
    setDeskQueue((prev) => [...prev, `A0${nextWalkId}`]);
    setNextWalkId((n) => n + 1);
  };

  /* ─── AI HAIR STUDIO CONCEPT ─── */
  const [activeHairstyleIndex, setActiveHairstyleIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);

  /* ─── SALONOS FLOW ─── */
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const currentFlow = SALONOS_FLOW[activeFlowIndex];

  /* ─── SNEPR POINTS & WALLET ─── */
  const [pointsRate, setPointsRate] = useState(0);
  const [walletAmt, setWalletAmt] = useState(0);
  const [reviewNote, setReviewNote] = useState("Choose any rating. You earn 10 points either way.");

  const handleSubmitReview = () => {
    if (!pointsRate) {
      setReviewNote("Choose a rating first.");
      return;
    }
    setWalletAmt((prev) => prev + 10);
    setReviewNote(`${pointsRate} star review submitted. +10 points, same as any rating.`);
    setPointsRate(0);
  };

  /* ─── ECONOMICS CALCULATOR ─── */
  const [cDailyCustomers, setCDailyCustomers] = useState(35);
  const [cTicket, setCTicket] = useState(350);
  const [cDays, setCDays] = useState(26);
  const [cCommRate, setCCommRate] = useState(25);
  const [cPlanCost, setCPlanCost] = useState(400);

  const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
  const calcRev = cDailyCustomers * cTicket * cDays;
  const calcComm = Math.round((calcRev * cCommRate) / 100);
  const calcDiff = calcComm - cPlanCost;

  /* ─── FAQ TABS & EXPANSION ─── */
  const [faqTab, setFaqTab] = useState<string>("Customers");
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({});

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="snepr-landing-page">
      {/* ─── 1. FIXED HEADER ─── */}
      <header id="hd" className={isHeaderScrolled ? "s" : ""}>
        <div className="wrap nav">
          <Link to="/" className="flex items-center" aria-label="Snepr home">
            <img src="/snepr-logo-transparent.png" alt="Snepr" className="h-9 w-auto object-contain hover:opacity-90 transition-opacity" />
          </Link>
          <nav className="links" aria-label="Main">
            <Link to="/live">Live Queues</Link>
            <a href="#ai">AI Studio</a>
            <a href="#how">How it works</a>
            <Link to="/salons">For Salons</Link>
            <Link to="/pricing">Pricing</Link>
          </nav>
          <div className="nav-r">
            <Link className="si" to="/login">
              Sign in
            </Link>
            <Link className="btn btn-dark" to="/live">
              Find a Salon
            </Link>
            <button
              className="burger"
              id="burger"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Menu */}
      <div className={`mmenu ${mobileMenuOpen ? "open" : ""}`} id="mm">
        <button
          className="mclose"
          id="mc"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>
        <Link to="/live" onClick={() => setMobileMenuOpen(false)}>
          Live Queues
        </Link>
        <a href="#ai" onClick={() => setMobileMenuOpen(false)}>
          AI Studio
        </a>
        <a href="#how" onClick={() => setMobileMenuOpen(false)}>
          How it works
        </a>
        <Link to="/salons" onClick={() => setMobileMenuOpen(false)}>
          For Salons
        </Link>
        <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
          Pricing
        </Link>
        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
          Sign in
        </Link>
      </div>

      <main id="top">
        {/* ─── 2. HERO: PINNED STICKY 230VH DESKTOP CONTAINER WITH SCISSOR STRAND ─── */}
        <div className="hero-scroll-wrapper">
          <div className="hero-sticky-stage">
            <section className="hero">
              <div className="wrap">
                <div>
                  <span className="pill reveal">
                    <i className="dot" />
                    Live salon discovery · Bhubaneswar
                  </span>
                  <h1 className="reveal" style={{ "--d": "0.08s" } as any}>
                    Never wait in line
                    <br />
                    at a salon <em>again.</em>
                  </h1>
                  <p className="lead reveal" style={{ "--d": "0.16s" } as any}>
                    Check live chair wait times from home. Save your place remotely and arrive when your barber is ready. Know before you go.
                  </p>
                  <div className="acts reveal" style={{ "--d": "0.24s" } as any}>
                    <Link className="btn btn-dark" to="/live">
                      Find a salon near you
                    </Link>
                    <Link className="btn btn-out" to="/live">
                      Live queues
                    </Link>
                    <Link className="own" to="/salons">
                      For salon owners ↗
                    </Link>
                  </div>
                  <div className="loc reveal" style={{ "--d": "0.32s" } as any}>
                    <span id="hl">{locationLabel}</span>
                    <button id="g1" onClick={handleGeo}>
                      Use my location
                    </button>
                  </div>
                </div>

                <div className="panel reveal" style={{ "--d": "0.15s" } as any} aria-label="Sample live salon preview">
                  <div className="ptop">
                    ⌕ Salons near you, right now <span className="live">● LIVE</span>
                  </div>
                  <div id="hlist">
                    {SAMPLE_SALONS.slice(0, 3).map((s) => (
                      <div key={s.n} className="srow">
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
                    <b id="hfast">
                      {shortestWaitSalon.w} min · {shortestWaitSalon.n}
                    </b>
                  </div>
                  <div className="badge">SAMPLE PREVIEW DATA</div>
                </div>
              </div>

              {/* Scissor cutting SVG strand running across bottom of pinned hero */}
              <HeroScissorStrand />
            </section>
          </div>
        </div>

        {/* ─── SEAM SCISSOR DIVIDER 1 ─── */}
        <SeamScissorDivider label="CUT THE LINE · LIVE CHAIR WAIT TIMES" />

        {/* ─── 3. DISCOVER SECTION ─── */}
        <section className="section discover" id="discover">
          <div className="wrap">
            <div className="head reveal">
              <div>
                <div className="kicker">Live salon discovery</div>
                <h2>Salons near you, right now.</h2>
                <p className="sub" id="areaLine">
                  Showing salons for {selectedArea}.
                </p>
              </div>
              <div className="locbar">
                <select
                  id="area"
                  aria-label="Select area"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                >
                  <option value="Patia, Bhubaneswar">Patia, Bhubaneswar</option>
                  <option value="Saheed Nagar, Bhubaneswar">Saheed Nagar, Bhubaneswar</option>
                  <option value="Jaydev Vihar, Bhubaneswar">Jaydev Vihar, Bhubaneswar</option>
                  <option value="Chandrasekharpur, Bhubaneswar">Chandrasekharpur, Bhubaneswar</option>
                </select>
                <button className="pr" id="g2" onClick={handleGeo}>
                  Use my location
                </button>
              </div>
            </div>

            <div className="filters" id="filters" role="group" aria-label="Filters">
              {[
                { key: "all", label: "All salons" },
                { key: "short", label: "Shortest wait" },
                { key: "now", label: "Available now" },
                { key: "rated", label: "Top rated" },
                { key: "Men's", label: "Men's" },
                { key: "Unisex", label: "Unisex" },
                { key: "Premium", label: "Premium" },
              ].map((f) => (
                <button
                  key={f.key}
                  className="chip"
                  aria-pressed={salonFilter === f.key}
                  onClick={() => handleFilterChange(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid3" id="salons">
              {isSkelLoading ? (
                <>
                  <div className="skel" />
                  <div className="skel" />
                  <div className="skel" />
                </>
              ) : filteredSalons.length > 0 ? (
                filteredSalons.map((s) => (
                  <article key={s.n} className="card">
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
                      <Link className="btn btn-dark" to="/live">
                        Join queue
                      </Link>
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
              SAMPLE DATA. In production this comes from the nearby salon API, with real distances from coordinates and a last updated time on each card.
            </p>
          </div>
        </section>

        {/* ─── 4. DEMO SECTION ─── */}
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
                    left: demoTab === "c" ? "5px" : "145px",
                    width: demoTab === "c" ? "135px" : "135px",
                  }}
                />
                <button
                  role="tab"
                  id="tC"
                  aria-selected={demoTab === "c"}
                  onClick={() => setDemoTab("c")}
                >
                  Customer view
                </button>
                <button
                  role="tab"
                  id="tS"
                  aria-selected={demoTab === "s"}
                  onClick={() => setDemoTab("s")}
                >
                  SalonOS desk
                </button>
              </div>
              <div className="dtitle" id="dT">
                {demoTab === "c" ? "The customer side" : "The barber desk"}
              </div>
              <p id="dD">
                {demoTab === "c"
                  ? "Pick a service, see its duration and price, then generate a demo token with queue position and estimated wait."
                  : "Call the next customer, watch chairs update and add walk in tokens. All simulated."}
              </p>
            </div>

            <div className="screen reveal" style={{ "--d": "0.1s" } as any}>
              {demoTab === "c" ? (
                <div id="vC">
                  <div className="sh">
                    <strong>snepr</strong>
                    <span>● DEMO · SAMPLE SALON</span>
                  </div>
                  <div id="svcs">
                    {DEMO_SERVICES.map((s, idx) => (
                      <button
                        key={s.n}
                        className="svc"
                        aria-pressed={selectedServiceIndex === idx}
                        onClick={() => setSelectedServiceIndex(idx)}
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
                    id="gen"
                    style={{ width: "100%" }}
                    onClick={handleGenerateToken}
                  >
                    Generate demo token
                  </button>
                  {generatedToken && (
                    <div id="tout">
                      <div className="tok">
                        <div className="note" style={{ color: "#c9b8aa" }}>
                          DEMO TOKEN
                        </div>
                        <div className="tk">{generatedToken.tok}</div>
                        <div style={{ fontSize: "0.85rem" }}>
                          Position {generatedToken.pos} · {generatedToken.ahead} ahead
                        </div>
                        <div style={{ color: "#f0c28f", fontSize: "0.85rem" }}>
                          Est. wait about {generatedToken.est} min
                        </div>
                        <div className="note" style={{ color: "#c9b8aa", marginTop: "6px" }}>
                          {generatedToken.serviceName} · ₹{generatedToken.price} · simulated
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div id="vS">
                  <div className="sh">
                    <strong>SalonOS</strong>
                    <span>● DESK PREVIEW · DEMO DATA</span>
                  </div>
                  <div className="chairs" id="chairs">
                    {deskChairs.map((c, i) => (
                      <div key={i} className={`chair ${c.t ? "busy" : ""}`}>
                        <small>CHAIR {i + 1}</small>
                        <b>{c.t || "Free"}</b>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "16px", fontWeight: 700, fontSize: "0.8rem" }}>
                    Waiting
                  </div>
                  <div className="qrow" id="qrow">
                    {deskQueue.length ? (
                      deskQueue.map((t) => (
                        <span key={t} className="qt">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="note">Queue empty</span>
                    )}
                  </div>
                  <button className="btn btn-brown" id="next" onClick={handleCallNext}>
                    Call next
                  </button>{" "}
                  <button className="btn btn-out" id="walk" onClick={handleAddWalkIn}>
                    Add walk in token
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── 5. HOW IT WORKS ─── */}
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
                    <span>Sample Salon A</span>
                    <b>5 min</b>
                  </div>
                  <div className="r">
                    <span>Sample Salon B</span>
                    <b>12 min</b>
                  </div>
                </div>
              </article>
              <article className="step reveal" style={{ "--d": "0.12s" } as any}>
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
              <article className="step reveal" style={{ "--d": "0.24s" } as any}>
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

        {/* ─── SEAM SCISSOR DIVIDER 2 ─── */}
        <SeamScissorDivider label="AI HAIR STUDIO · CONCEPT CATALOGUE" />

        {/* ─── 6. AI STUDIO CONCEPT ─── */}
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
              <Link className="btn btn-dark" to="/live/studio">
                Join the AI Studio waitlist
              </Link>
            </div>

            <div className="studio reveal" style={{ "--d": "0.1s" } as any}>
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
                  style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                >
                  <rect width="240" height="280" fill="#EADFCB" />
                  <ellipse cx="120" cy="140" rx="52" ry="66" fill="#D9AE86" />
                  <rect x="100" y="190" width="40" height="60" fill="#D9AE86" />
                  <path d="M10 280 Q120 200 230 280Z" fill="#6E3A1C" />
                  <path id="hair" fill="#241810" d={HAIRSTYLES[activeHairstyleIndex].d} />
                </svg>
                <div className="bar" id="bar" style={{ left: `${sliderPos}%` }} />
              </div>

              <input
                type="range"
                id="sl"
                min="0"
                max="100"
                value={sliderPos}
                aria-label="Before and after"
                onChange={(e) => setSliderPos(Number(e.target.value))}
              />

              <div className="sty" id="sty">
                {HAIRSTYLES.map((h, i) => (
                  <button
                    key={h.n}
                    className="chip"
                    aria-pressed={activeHairstyleIndex === i}
                    onClick={() => setActiveHairstyleIndex(i)}
                  >
                    {h.n}
                  </button>
                ))}
              </div>
              <div className="note" id="sinfo">
                CONCEPT ILLUSTRATION · {HAIRSTYLES[activeHairstyleIndex].n.toUpperCase()}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7. SALONOS OVERVIEW ─── */}
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
                    key={f[0]}
                    className="fs"
                    role="tab"
                    aria-selected={activeFlowIndex === i}
                    onClick={() => setActiveFlowIndex(i)}
                  >
                    <small>0{i + 1}</small>
                    {f[0]}
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

            <div className="dash reveal" style={{ "--d": "0.1s" } as any}>
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
                  <b id="dq">{currentFlow[2]}</b>
                </div>
                <div className="dsi">
                  <small>Next token</small>
                  <b id="dn">{currentFlow[3]}</b>
                </div>
              </div>
              <div id="dl">
                {currentFlow[4].map((l) => (
                  <div key={l[0]} className={`ql ${l[2] ? "hl" : ""}`}>
                    <b>#{l[0]}</b>
                    <span>{l[1]}</span>
                  </div>
                ))}
              </div>
              <div className="dnote" id="dnote">
                {currentFlow[1]}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 8. SNEPR POINTS & VERIFIED REVIEWS ─── */}
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
                PROPOSED MODEL. Verification and redemption scope to be confirmed against the backend before launch.
              </p>
            </div>

            <div className="wallet reveal" style={{ "--d": "0.1s" } as any}>
              <small>DEMO WALLET</small>
              <div className="amt" id="amt">
                ₹{walletAmt}
              </div>
              <div style={{ color: "#e5c9b2", fontSize: "0.8rem" }}>in Snepr Points</div>
              <div className="stars" id="stars" role="group" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    data-n={star}
                    className={star <= pointsRate ? "on" : ""}
                    aria-label={`${star} star`}
                    onClick={() => setPointsRate(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button className="btn" id="rev" onClick={handleSubmitReview}>
                Submit demo review
              </button>
              <p id="rn">{reviewNote}</p>
            </div>
          </div>
        </section>

        {/* ─── SEAM SCISSOR DIVIDER 3 ─── */}
        <SeamScissorDivider label="TRANSPARENT PRICING · NO COMMISSIONS" />

        {/* ─── 9. PRICING ─── */}
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
                <Link className="btn btn-out" to="/partner/register">
                  Start with Base
                </Link>
              </article>

              <article className="pc f reveal" style={{ "--d": "0.1s" } as any}>
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
                <Link className="btn" to="/partner/register">
                  Choose Intermediate
                </Link>
              </article>

              <article className="pc reveal" style={{ "--d": "0.2s" } as any}>
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
                <Link className="btn btn-out" to="/partner/register">
                  Go Pro
                </Link>
              </article>
            </div>
            <p className="note" style={{ marginTop: "22px" }}>
              Feature lists must match backend entitlements before launch.
            </p>
          </div>
        </section>

        {/* ─── 10. SALON ECONOMICS CALCULATOR ─── */}
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
                    Average daily customers <output id="o1">{cDailyCustomers}</output>
                  </label>
                  <input
                    id="c1"
                    type="range"
                    min="5"
                    max="120"
                    value={cDailyCustomers}
                    onChange={(e) => setCDailyCustomers(Number(e.target.value))}
                  />
                </div>
                <div className="ctl">
                  <label htmlFor="c2">
                    Average service ticket <output id="o2">{inr(cTicket)}</output>
                  </label>
                  <input
                    id="c2"
                    type="range"
                    min="50"
                    max="1500"
                    step="10"
                    value={cTicket}
                    onChange={(e) => setCTicket(Number(e.target.value))}
                  />
                </div>
                <div className="ctl">
                  <label htmlFor="c3">
                    Working days per month <output id="o3">{cDays}</output>
                  </label>
                  <input
                    id="c3"
                    type="range"
                    min="10"
                    max="31"
                    value={cDays}
                    onChange={(e) => setCDays(Number(e.target.value))}
                  />
                </div>
                <div className="ctl">
                  <label htmlFor="c4">
                    Comparison commission rate <output id="o4">{cCommRate}%</output>
                  </label>
                  <input
                    id="c4"
                    type="range"
                    min="5"
                    max="40"
                    value={cCommRate}
                    onChange={(e) => setCCommRate(Number(e.target.value))}
                  />
                </div>
                <div className="ctl">
                  <label htmlFor="c5">Snepr plan</label>
                  <select
                    id="c5"
                    value={cPlanCost}
                    onChange={(e) => setCPlanCost(Number(e.target.value))}
                  >
                    <option value="199">Base · ₹199</option>
                    <option value="400">Intermediate · ₹400</option>
                    <option value="449">Pro · ₹449</option>
                  </select>
                </div>
              </div>

              <div className="res">
                <div className="rr">
                  <span>Estimated monthly revenue</span>
                  <b id="rv">{inr(calcRev)}</b>
                </div>
                <div className="rr">
                  <span>Modelled commission</span>
                  <b id="rc">{inr(calcComm)}</b>
                </div>
                <div className="rr">
                  <span>Snepr subscription</span>
                  <b id="rs">{inr(cPlanCost)}</b>
                </div>
                <div className="big">
                  <small>MODELLED DIFFERENCE PER MONTH</small>
                  <strong id="rd">{inr(calcDiff)}</strong>
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

        {/* ─── 11. COMPARE SECTION ─── */}
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

        {/* ─── 12. FAQ ─── */}
        <section className="section faq" id="faq">
          <div className="wrap fl">
            <div className="reveal">
              <div className="kicker">Help</div>
              <h2>Good to know.</h2>
              <p className="sub">Answers marked TBC need your real product rules before launch.</p>
            </div>
            <div className="reveal" style={{ "--d": "0.1s" } as any}>
              <div className="ft" id="ft">
                {Object.keys(FAQ_DATA).map((category) => (
                  <button
                    key={category}
                    className="chip"
                    aria-pressed={faqTab === category}
                    onClick={() => {
                      setFaqTab(category);
                      setOpenFaqIndices({});
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div id="fb">
                {FAQ_DATA[faqTab].map((q, idx) => (
                  <div key={q[0]} className={`fi ${openFaqIndices[idx] ? "open" : ""}`}>
                    <button
                      className="fq"
                      aria-expanded={Boolean(openFaqIndices[idx])}
                      onClick={() => toggleFaq(idx)}
                    >
                      {q[0]}
                      <span>{openFaqIndices[idx] ? "×" : "+"}</span>
                    </button>
                    <div className="fa">
                      <div>
                        <p>{q[1]}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 13. CTA & FINAL SCISSOR CUT VERTICAL ANIMATION ─── */}
        <section className="cta">
          <div className="wrap">
            <div className="reveal">
              <h2>Know before you go.</h2>
              <p>Customers can find a salon and check the queue. Owners can list, claim or explore SalonOS.</p>
              <div className="acts">
                <Link className="btn" to="/live">
                  Find a salon near you
                </Link>
                <Link className="btn o" to="/partner/register">
                  Register your salon
                </Link>
                <Link className="btn o" to="/partner/claim">
                  Claim your salon
                </Link>
              </div>
            </div>
            <div className="app reveal" style={{ "--d": "0.1s" } as any}>
              <b>Snepr app</b>
              <p>A native app with the same live queues. Store links appear once configured.</p>
              <Link className="btn" to="/live">
                Get the app
              </Link>{" "}
              <a href="#top" style={{ fontSize: "0.78rem", fontWeight: 700, marginLeft: "10px", textDecoration: "underline" }}>
                Continue on web
              </a>
            </div>
          </div>
        </section>

        {/* Final Scene Vertical Strand Cut & Big Wordmark Reveal */}
        <FinalVerticalStrandCut />
      </main>

      {/* ─── 14. FOOTER ─── */}
      <footer>
        <div className="wrap">
          <div className="fg">
            <div>
              <a href="#top" className="inline-block" aria-label="Snepr home">
                <img src="/snepr-logo-white-transparent.png" alt="Snepr" className="h-8 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity" />
              </a>
              <p className="bp">Live salon queues and wait times. Know before you go.</p>
            </div>
            <div>
              <h5>CUSTOMERS</h5>
              <ul>
                <li>
                  <Link to="/live">Live queues</Link>
                </li>
                <li>
                  <a href="#demo">Join queue</a>
                </li>
                <li>
                  <a href="#ai">AI Studio</a>
                </li>
                <li>
                  <Link to="/live/activity">My bookings</Link>
                </li>
                <li>
                  <a href="#points">Snepr Points</a>
                </li>
              </ul>
            </div>
            <div>
              <h5>SALON OWNERS</h5>
              <ul>
                <li>
                  <Link to="/partner/register">List your salon</Link>
                </li>
                <li>
                  <Link to="/partner/claim">Claim your salon</Link>
                </li>
                <li>
                  <Link to="/salon-os">SalonOS</Link>
                </li>
                <li>
                  <Link to="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link to="/partner-terms">Partner terms</Link>
                </li>
                <li>
                  <Link to="/salon-os">Partner dashboard</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5>COMPANY</h5>
              <ul>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/help">Help center</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5>LEGAL</h5>
              <ul>
                <li>
                  <Link to="/privacy-policy">Privacy policy</Link>
                </li>
                <li>
                  <Link to="/terms-of-service">Terms of service</Link>
                </li>
              </ul>
              <h5 style={{ marginTop: "22px" }}>SOCIAL</h5>
              <ul>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="fb">
            <span>© {new Date().getFullYear()} Snepr Technologies Inc. · Bhubaneswar</span>
            <span>Made in Bhubaneswar</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Fixed Bar */}
      <div className="bnav">
        <Link to="/live">Find a salon</Link>
        <a href="#demo">Demo</a>
        <Link to="/pricing">Pricing</Link>
      </div>
    </div>
  );
}

export default SneprLandingPageExact;
