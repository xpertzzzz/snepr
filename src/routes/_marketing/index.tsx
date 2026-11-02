import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import "@/styles/snepr-final.css";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    title: "sn≡pr | Best Salons in Bhubaneswar | Live Salon Queue and Waiting Times",
    meta: [
      {
        name: "description",
        content:
          "Discover salons across Bhubaneswar, check live chair availability and estimated waiting times, and join the queue before you arrive. Know before you go.",
      },
      {
        name: "keywords",
        content:
          "Salons in Bhubaneswar, Best salons in Bhubaneswar, Salon near me, Live salon queue, Salon waiting time, Barber shops in Bhubaneswar, Haircut Bhubaneswar, SalonOS",
      },
      { property: "og:title", content: "sn≡pr | Best Salons in Bhubaneswar | Live Salon Queue and Waiting Times" },
      {
        property: "og:description",
        content:
          "Discover salons across Bhubaneswar, check live chair availability and estimated waiting times, and join the queue before you arrive. Know before you go.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://snepr.com/" },
      { property: "og:locale", content: "en_IN" },
      { name: "theme-color", content: "#f5f1e9" },
    ],
  }),
  component: SneprLandingPage,
});

interface SalonItem {
  id: string;
  name: string;
  area: string;
  locality: string;
  type: "Men's" | "Unisex" | "Premium";
  rating: number;
  reviewCount: number;
  address: string;
  freeChairsText: string;
  freeChairsCount: number;
  queueCount: number;
  waitTimeMins: number;
  letter: string;
  isVerified: boolean;
  services: string[];
}

const BHUBANESWAR_SALONS: SalonItem[] = [
  {
    id: "scissors-edge",
    name: "The Scissors Edge",
    area: "Saheed Nagar",
    locality: "Saheed Nagar",
    type: "Unisex",
    rating: 4.8,
    reviewCount: 142,
    address: "Plot 124, Janpath Road, Saheed Nagar, Bhubaneswar",
    freeChairsText: "2 of 3 chairs free",
    freeChairsCount: 2,
    queueCount: 1,
    waitTimeMins: 5,
    letter: "T",
    isVerified: true,
    services: ["Haircut", "Beard Trim", "Hair Spa", "Facial"],
  },
  {
    id: "urban-look",
    name: "Urban Look Salon",
    area: "Jaydev Vihar",
    locality: "Jaydev Vihar",
    type: "Men's",
    rating: 4.6,
    reviewCount: 98,
    address: "Near Pal Heights, Jaydev Vihar, Bhubaneswar",
    freeChairsText: "1 of 2 chairs free",
    freeChairsCount: 1,
    queueCount: 3,
    waitTimeMins: 10,
    letter: "U",
    isVerified: true,
    services: ["Barber Cut", "Beard Styling", "Head Massage"],
  },
  {
    id: "style-studio",
    name: "Style Studio by Jawed Habib",
    area: "Patia",
    locality: "Patia",
    type: "Premium",
    rating: 4.7,
    reviewCount: 215,
    address: "Near KIIT Square, Patia, Bhubaneswar",
    freeChairsText: "All chairs busy",
    freeChairsCount: 0,
    queueCount: 5,
    waitTimeMins: 15,
    letter: "S",
    isVerified: true,
    services: ["Designer Cut", "Global Color", "Keratin", "Beard Grooming"],
  },
  {
    id: "lakme-patia",
    name: "Lakmé Salon",
    area: "Patia",
    locality: "Patia",
    type: "Unisex",
    rating: 4.9,
    reviewCount: 310,
    address: "District Center, Chandrasekharpur, Patia, Bhubaneswar",
    freeChairsText: "2 chairs free",
    freeChairsCount: 2,
    queueCount: 0,
    waitTimeMins: 0,
    letter: "L",
    isVerified: true,
    services: ["Precision Haircut", "Bridal", "Facials", "Styling"],
  },
  {
    id: "nvn-salon",
    name: "NVN Unisex Salon",
    area: "Patia",
    locality: "Patia",
    type: "Unisex",
    rating: 4.6,
    reviewCount: 84,
    address: "Infocity Road, Patia, Bhubaneswar",
    freeChairsText: "1 chair free",
    freeChairsCount: 1,
    queueCount: 2,
    waitTimeMins: 5,
    letter: "N",
    isVerified: true,
    services: ["Haircut", "Beard Grooming", "Cleanup"],
  },
  {
    id: "green-trends",
    name: "Green Trends Salon",
    area: "Chandrasekharpur",
    locality: "Chandrasekharpur",
    type: "Unisex",
    rating: 4.7,
    reviewCount: 167,
    address: "Damana Square, Chandrasekharpur, Bhubaneswar",
    freeChairsText: "1 chair free",
    freeChairsCount: 1,
    queueCount: 4,
    waitTimeMins: 12,
    letter: "G",
    isVerified: true,
    services: ["Organic Hair Spa", "Haircut", "Beard Spa"],
  },
  {
    id: "royale-barber",
    name: "Royale Barber Club",
    area: "KIIT Square",
    locality: "KIIT Square",
    type: "Men's",
    rating: 4.8,
    reviewCount: 112,
    address: "Opposite Campus 3, KIIT Square, Bhubaneswar",
    freeChairsText: "3 of 4 chairs free",
    freeChairsCount: 3,
    queueCount: 1,
    waitTimeMins: 4,
    letter: "R",
    isVerified: true,
    services: ["Fade and Taper", "Hot Towel Shave", "Beard Oil Spa"],
  },
  {
    id: "ozone-studio",
    name: "Ozone Studio and Spa",
    area: "Nayapalli",
    locality: "Nayapalli",
    type: "Premium",
    rating: 4.7,
    reviewCount: 139,
    address: "Near IRC Village, Nayapalli, Bhubaneswar",
    freeChairsText: "2 chairs free",
    freeChairsCount: 2,
    queueCount: 2,
    waitTimeMins: 8,
    letter: "O",
    isVerified: true,
    services: ["Men Grooming", "Hair Therapy", "Detox Facial"],
  },
];

export function SneprLandingPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });
  const toastTimeoutRef = useRef<number | null>(null);

  const notify = (msg: string) => {
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    setToast({ msg, show: true });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3400);
  };

  // ─── Discovery Controls ───
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("All Localities");
  const [currentFilter, setCurrentFilter] = useState("All");
  const [locating, setLocating] = useState(false);

  // ─── Selected Salon & Live Token Simulation State ───
  const [selectedSalon, setSelectedSalon] = useState<SalonItem>(BHUBANESWAR_SALONS[0]);
  const [demoTab, setDemoTab] = useState<"customer" | "desk">("customer");

  // Dynamic Customer Token Journey State
  // stage: 1=Joined, 2=Waiting, 3=Your Turn / Barber Calling, 4=In Chair, 5=Completed
  const [customerJourneyStage, setCustomerJourneyStage] = useState<number>(2);
  const [tokenCode, setTokenCode] = useState<string>("A07");
  const [tokenAhead, setTokenAhead] = useState<number>(2);
  const [tokenWait, setTokenWait] = useState<number>(12);
  const [assignedChair, setAssignedChair] = useState<string>("Chair 02");

  // Dynamic SalonOS Desk State
  const [deskChair2Status, setDeskChair2Status] = useState<"ready" | "serving">("ready");
  const [deskChair2Client, setDeskChair2Client] = useState<string>("Ready for next customer");
  const [deskNextToken, setDeskNextToken] = useState<string>("A07");
  const [deskServedCount, setDeskServedCount] = useState<number>(28);

  // ─── AI Studio Waitlist State ───
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // ─── Rewards Calculator State ───
  const [calcSpend, setCalcSpend] = useState(400);

  // Filter salons logic
  const displayedSalons = useMemo(() => {
    let list = [...BHUBANESWAR_SALONS];

    if (selectedLocality !== "All Localities") {
      list = list.filter(
        (s) =>
          s.locality.toLowerCase() === selectedLocality.toLowerCase() ||
          s.area.toLowerCase() === selectedLocality.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.area.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          s.services.some((srv) => srv.toLowerCase().includes(q))
      );
    }

    if (currentFilter === "Shortest") {
      list.sort((a, b) => a.waitTimeMins - b.waitTimeMins);
    } else if (currentFilter === "Top") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (currentFilter === "Available") {
      list = list.filter((s) => s.waitTimeMins === 0 || s.freeChairsCount > 0);
    } else if (["Men's", "Unisex", "Premium"].includes(currentFilter)) {
      list = list.filter((s) => s.type === currentFilter);
    }

    return list;
  }, [searchQuery, selectedLocality, currentFilter]);

  // Geolocation Handler
  const handleLocate = () => {
    if (!navigator.geolocation) {
      notify("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setSelectedLocality("Patia");
        setLocating(false);
        notify("GPS location identified. Showing closest verified salons in Patia, Bhubaneswar.");
      },
      () => {
        setLocating(false);
        notify("Location access denied. Please choose your neighborhood from the selector.");
      },
      { timeout: 7000 }
    );
  };

  // Join Queue action: updates selected salon & opens customer demo
  const handleJoinQueue = (salon: SalonItem) => {
    setSelectedSalon(salon);
    const newCode = salon.letter + "0" + (salon.queueCount + 1);
    setTokenCode(newCode);
    setTokenAhead(salon.queueCount);
    setTokenWait(salon.waitTimeMins || 5);
    setCustomerJourneyStage(2);
    setDemoTab("customer");
    notify(`Joined queue at ${salon.name}! Generated token #${newCode}. See live token card below.`);

    const demoSection = document.getElementById("demoSection");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Generate New Demo Token
  const handleGenerateNewToken = () => {
    const letters = ["A", "B", "C", "S"];
    const rndLetter = letters[Math.floor(Math.random() * letters.length)];
    const rndNum = Math.floor(Math.random() * 9) + 1;
    const newCode = `${rndLetter}0${rndNum}`;
    const newAhead = Math.floor(Math.random() * 3) + 1;
    const newWait = newAhead * 6;

    setTokenCode(newCode);
    setTokenAhead(newAhead);
    setTokenWait(newWait);
    setCustomerJourneyStage(2);
    notify(`New token #${newCode} created for ${selectedSalon.name}. Estimated wait is ${newWait} minutes.`);
  };

  // Simulate Barber Call: advances journey
  const handleSimulateBarberCall = () => {
    if (customerJourneyStage === 2) {
      setCustomerJourneyStage(3); // Your turn / Barber calling
      notify(`Stylist at ${assignedChair} is calling Token #${tokenCode}! Demo alert: In production, customer receives instant SMS and WhatsApp notice.`);
    } else if (customerJourneyStage === 3) {
      setCustomerJourneyStage(4); // In chair
      notify(`Token #${tokenCode} is seated in ${assignedChair}. Service in progress.`);
    } else {
      setCustomerJourneyStage(2);
      notify(`Reset demo journey to Waiting for Token #${tokenCode}.`);
    }
  };

  // SalonOS Desk: Call Next Token
  const handleDeskCallNextToken = () => {
    if (deskChair2Status === "ready") {
      setDeskChair2Status("serving");
      setDeskChair2Client(`Prakash Jena serving #${deskNextToken}`);
      setDeskServedCount((prev) => prev + 1);
      setCustomerJourneyStage(3); // Syncs customer view!
      notify(`Chair 02 called Token #${deskNextToken}! Customer phone notified to step in.`);
      setDeskNextToken("A08");
    } else {
      setDeskChair2Status("ready");
      setDeskChair2Client("Ready for next customer");
      notify("Chair 02 completed service. Chair is now open for next customer.");
    }
  };

  // Scissor Animation on Scroll (Exact physics preserved)
  const cutSceneRef = useRef<HTMLElement>(null);
  const hairPathRef = useRef<SVGPathElement>(null);
  const scissorRigRef = useRef<HTMLDivElement>(null);
  const bladeARef = useRef<SVGGElement>(null);
  const bladeBRef = useRef<SVGGElement>(null);
  const cutHairRef = useRef<SVGPathElement>(null);
  const looseHairRef = useRef<SVGPathElement>(null);
  const cutProgressRef = useRef<HTMLElement>(null);
  const cutCopyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = cutSceneRef.current;
    const path = hairPathRef.current;
    const rig = scissorRigRef.current;
    const a = bladeARef.current;
    const b = bladeBRef.current;
    const cut = cutHairRef.current;
    const loose = looseHairRef.current;
    const progressBar = cutProgressRef.current;
    const copy = cutCopyRef.current;

    if (!scene || !path || !rig || !a || !b || !cut || !loose || !progressBar || !copy) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const len = path.getTotalLength();
      cut.style.strokeDasharray = String(len);
      cut.style.strokeDashoffset = "0";
      return;
    }

    const length = path.getTotalLength();
    cut.style.strokeDasharray = String(length);
    cut.style.strokeDashoffset = String(length);

    let scheduled = false;

    function frame() {
      if (!scene || !path || !rig || !a || !b || !cut || !loose || !progressBar || !copy) return;
      const rect = scene.getBoundingClientRect();
      const travel = scene.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      const p = Math.max(0, Math.min(1, -rect.top / travel));
      const travelP = Math.max(0, Math.min(1, (p - 0.08) / 0.76));
      const point = path.getPointAtLength(length * travelP);
      const ahead = path.getPointAtLength(Math.min(length, length * travelP + 2));
      const angle = (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;

      const stage = scene.querySelector(".cut-stage");
      if (stage) {
        const box = stage.getBoundingClientRect();
        const scaleX = box.width / 1000;
        const scaleY = box.height / 590;
        const x = point.x * scaleX - 95;
        const y = point.y * scaleY - 75;
        rig.style.transform = `translate(${x}px,${y}px) rotate(${angle}deg)`;
      }

      const cutStart = Math.max(0, Math.min(length, length * (travelP - 0.035)));
      cut.style.strokeDashoffset = String(length - cutStart);

      const snip = Math.max(0, Math.min(1, (p - 0.48) / 0.18));
      const open = 1 - snip;
      a.style.transform = `rotate(${-24 * open}deg)`;
      b.style.transform = `rotate(${24 * open}deg)`;

      loose.style.opacity = String(Math.max(0, (p - 0.66) * 2.5));
      progressBar.style.height = p * 100 + "%";
      copy.style.opacity = String(Math.max(0.25, 1 - Math.max(0, p - 0.7) * 2.5));
      copy.style.transform = `translateY(${Math.max(0, p - 0.55) * -24}px)`;

      scheduled = false;
    }

    function update() {
      if (!scheduled) {
        window.requestAnimationFrame(frame);
        scheduled = true;
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    frame();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {/* ─── 1. NAVIGATION HEADER ─── */}
      <header className="hero" id="top">
        <div className="hero-head">
          <a className="brand" href="#top" aria-label="Snepr home">
            <img src="/snepr-logo-transparent.png" alt="Snepr" />
          </a>
          <nav className={`hero-nav ${navOpen ? "open" : ""}`} id="navlinks">
            <a href="/explore" onClick={() => setNavOpen(false)}>
              Explore
            </a>
            <a href="/live" onClick={() => setNavOpen(false)}>
              Live Queues
            </a>
            <a href="/#how-it-works" onClick={() => setNavOpen(false)}>
              How it works
            </a>
            <a href="/ai-studio" onClick={() => setNavOpen(false)}>
              AI Studio
            </a>
            <a href="/salonos" onClick={() => setNavOpen(false)}>
              For Salons
            </a>
            <a href="/pricing" onClick={() => setNavOpen(false)}>
              Pricing
            </a>
          </nav>
          <div className="head-actions">
            <a className="btn" href="/login">
              Sign in
            </a>
            <a className="btn fill" href="/explore">
              Find a Salon ↗
            </a>
            <button
              className="menu"
              id="menu"
              aria-label="Open navigation"
              onClick={() => setNavOpen(!navOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* ─── 2. HERO SECTION ─── */}
        <div className="hero-main">
          <div className="hero-content">
            <div className="eyebrow" style={{ letterSpacing: "0.15em", color: "#80543a", fontWeight: 700 }}>
              Live Salon Discovery | Bhubaneswar
            </div>
            <h1>
              Never wait in line<br />
              <span>at a salon again.</span>
            </h1>
            <p className="hero-desc">
              Discover salons across Bhubaneswar, check live chair availability and estimated waiting times, and join the queue before you arrive. Know before you go.
            </p>
            <div className="hero-ctas">
              <a className="btn fill" href="/explore">
                Find a salon near you
              </a>
              <a className="btn" href="/live">
                Explore live queues
              </a>
            </div>
            <a className="owner-link" href="/salonos" style={{ marginTop: "18px" }}>
              For salon owners | SalonOS ↗
            </a>
          </div>
        </div>

        <div className="hero-art"></div>
      </header>

      {/* ─── 3. SCISSOR ANIMATION (Preserved Exactly) ─── */}
      <section
        className="cut-scene"
        id="cutScene"
        ref={cutSceneRef}
        aria-label="A pair of scissors follows a curved strand of hair and cuts it as you scroll"
      >
        <div className="cut-sticky">
          <div className="cut-backdrop"></div>
          <div className="cut-label">A little precision. A lot less waiting.</div>
          <div className="cut-stage">
            <svg
              className="hair-svg"
              viewBox="0 0 1000 590"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hairGradient" x1="0" x2="1" y1="0" y2="1">
                  <stop stopColor="#e5c6a7" />
                  <stop offset="0.48" stopColor="#a77a58" />
                  <stop offset="1" stopColor="#5d4030" />
                </linearGradient>
              </defs>
              <path
                id="hairPath"
                ref={hairPathRef}
                className="hair-line"
                stroke="url(#hairGradient)"
                d="M80 470 C210 450 235 155 430 185 S650 470 790 350 S850 120 940 115"
              />
              <path
                className="hair-line thin"
                d="M80 458 C205 438 246 168 430 197 S650 481 790 362 S852 133 940 128"
              />
              <path
                className="hair-line thin"
                d="M82 482 C220 465 225 140 425 173 S648 454 780 337 S846 108 936 101"
              />
              <path
                id="cutHair"
                ref={cutHairRef}
                className="hair-cut"
                d="M80 470 C210 450 235 155 430 185 S650 470 790 350 S850 120 940 115"
              />
              <path
                id="looseHair"
                ref={looseHairRef}
                d="M80 470 C210 450 235 155 430 185 S650 470 790 350 S850 120 940 115"
                fill="none"
                stroke="#e6c7a7"
                strokeWidth="9"
                strokeLinecap="round"
                opacity="0"
              />
            </svg>

            <div className="scissor-rig" id="scissorRig" ref={scissorRigRef} aria-hidden="true">
              <svg viewBox="0 0 190 150">
                <g className="blade-a" id="bladeA" ref={bladeARef}>
                  <circle className="scissor-metal" cx="48" cy="111" r="28" />
                  <circle className="scissor-dark" cx="48" cy="111" r="19" />
                  <path
                    className="scissor-metal"
                    d="M68 94 Q105 62 171 12 Q183 4 187 15 Q190 24 178 31 L80 108"
                  />
                </g>
                <g className="blade-b" id="bladeB" ref={bladeBRef}>
                  <circle className="scissor-metal" cx="48" cy="39" r="28" />
                  <circle className="scissor-dark" cx="48" cy="39" r="19" />
                  <path
                    className="scissor-metal"
                    d="M68 56 Q105 88 171 138 Q183 146 187 135 Q190 126 178 119 L80 42"
                  />
                </g>
                <circle cx="79" cy="76" r="7" fill="#c58d65" stroke="#f1e4d5" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="cut-copy" id="cutCopy" ref={cutCopyRef}>
            <div className="cut-kicker">Scroll to see the craft</div>
            <h2>
              One smooth motion.<br />
              <em>A clean cut.</em>
            </h2>
            <p>
              A small detail can change the whole look. Keep scrolling and watch the scissors trace the curve, close through the strand and leave a clean finish.
            </p>
          </div>

          <div className="cut-progress">
            <i id="cutProgress" ref={cutProgressRef}></i>
          </div>
        </div>
      </section>

      {/* ─── 4. CORE FEATURE: SALON DISCOVERY & LIVE QUEUES ─── */}
      <main>
        <section className="section" id="discover">
          <div className="wrap">
            <div className="section-head">
              <div>
                <h2>
                  Find your salon. <em>Know the wait.</em>
                </h2>
                <p style={{ marginTop: "8px", maxWidth: "680px" }}>
                  Explore verified salons across Bhubaneswar. Check real time chair availability and join digital queues before stepping out.
                </p>
              </div>
            </div>

            {/* Combined Search & Location Controls Bar */}
            <div className="area-bar">
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search salons, barber shops, or services in Bhubaneswar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search salons or services in Bhubaneswar"
                />
              </div>

              <select
                className="area-select"
                id="area"
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                aria-label="Select Bhubaneswar locality"
              >
                <option value="All Localities">All Localities | Bhubaneswar</option>
                <option value="Patia">Patia, Bhubaneswar</option>
                <option value="Saheed Nagar">Saheed Nagar, Bhubaneswar</option>
                <option value="Jaydev Vihar">Jaydev Vihar, Bhubaneswar</option>
                <option value="KIIT Square">KIIT Square, Bhubaneswar</option>
                <option value="Chandrasekharpur">Chandrasekharpur, Bhubaneswar</option>
                <option value="Nayapalli">Nayapalli, Bhubaneswar</option>
              </select>

              <button className="btn" id="locate" onClick={handleLocate}>
                {locating ? "Locating…" : "Use my location"}
              </button>
            </div>

            {/* Filter Pills */}
            <div className="filters" id="filters">
              {["All", "Shortest", "Available", "Top", "Men's", "Unisex", "Premium"].map((f) => (
                <button
                  key={f}
                  className={`filter ${currentFilter === f ? "active" : ""}`}
                  onClick={() => setCurrentFilter(f)}
                >
                  {f === "All"
                    ? "All salons"
                    : f === "Shortest"
                    ? "Shortest wait"
                    : f === "Available"
                    ? "Available now"
                    : f === "Top"
                    ? "Top rated"
                    : f}
                </button>
              ))}
            </div>

            {/* Live Salon Grid */}
            <div className="salon-grid" id="salonGrid">
              {displayedSalons.length > 0 ? (
                displayedSalons.map((s) => (
                  <article className="salon" key={s.id}>
                    <div className="salon-top">
                      <div className="avatar flex items-center justify-center relative">
                        <span className="font-bold text-lg">{s.letter}</span>
                        <img
                          src="/snepr-logo-square-transparent.png"
                          alt="Verified Snepr Salon"
                          className="w-4 h-4 absolute -bottom-1 -right-1 rounded-full bg-[#1d1b17]/10"
                        />
                      </div>
                      <span className="open" style={{ fontWeight: 700 }}>● Open</span>
                    </div>
                    <h3><a href={`/salon/${s.id}`} style={{ color: "inherit", textDecoration: "none" }}>{s.name}</a></h3>
                    <div className="salon-meta">
                      {s.area} · {s.type} · ★ {s.rating.toFixed(1)} ({s.reviewCount})
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b5e52", marginBottom: "12px" }}>
                      {s.address}
                    </div>
                    <div className="salon-stats">
                      <div>
                        <strong>{s.freeChairsCount}</strong>
                        <span>Chairs free</span>
                      </div>
                      <div>
                        <strong>{s.queueCount}</strong>
                        <span>In queue</span>
                      </div>
                      <div>
                        <strong>{s.waitTimeMins} min</strong>
                        <span>Wait time</span>
                      </div>
                    </div>
                    <div className="salon-foot">
                      <small style={{ fontSize: "12px", fontWeight: 600, color: "#6b5e52" }}>
                        {s.freeChairsText}
                      </small>
                      <button
                        className="join"
                        data-salon={s.name}
                        onClick={() => handleJoinQueue(s)}
                      >
                        Join queue ↗
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", gridColumn: "1 / -1", color: "var(--muted)" }}>
                  <p style={{ fontSize: "16px", color: "#4a3e35" }}>
                    No salons match your search criteria in {selectedLocality}.
                  </p>
                  <button
                    className="btn"
                    style={{ marginTop: "14px" }}
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLocality("All Localities");
                      setCurrentFilter("All");
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            {/* ─── 5. INTERACTIVE DEMO SIMULATOR ─── */}
            <div className="demo" id="demoSection" style={{ marginTop: "50px" }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "99px", background: "rgba(112, 71, 47, 0.1)", color: "#70472f", letterSpacing: "0.1em" }}>
                  INTERACTIVE DEMO PREVIEW
                </span>
              </div>

              <div className="tabs">
                <button
                  className={`tab ${demoTab === "customer" ? "active" : ""}`}
                  onClick={() => setDemoTab("customer")}
                >
                  Customer view (Mobile App)
                </button>
                <button
                  className={`tab ${demoTab === "desk" ? "active" : ""}`}
                  onClick={() => setDemoTab("desk")}
                >
                  SalonOS desk (Owner System)
                </button>
              </div>

              <div className="demo-layout" style={{ alignItems: "center" }}>
                <div className="demo-copy" id="demoCopy">
                  {demoTab === "customer" ? (
                    <>
                      <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                        Customer Experience | Live Token
                      </div>
                      <h3 style={{ fontSize: "32px", lineHeight: "1.1", margin: "14px 0" }}>
                        Choose your service.<br />
                        Know your place.
                      </h3>
                      <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#3d322a" }}>
                        Preview how customers follow their live token. Track your place in queue, monitor people ahead, and step in right as your barber calls your turn.
                      </p>
                      <div style={{ marginTop: "22px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <button
                          className="btn fill"
                          onClick={handleGenerateNewToken}
                        >
                          Generate New Demo Token ↗
                        </button>
                        <button
                          className="btn"
                          onClick={handleSimulateBarberCall}
                        >
                          {customerJourneyStage === 2
                            ? "Simulate Barber Call"
                            : customerJourneyStage === 3
                            ? "Simulate Seated in Chair"
                            : "Reset Journey to Waiting"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                        SalonOS Desk | Operations Preview
                      </div>
                      <h3 style={{ fontSize: "32px", lineHeight: "1.1", margin: "14px 0" }}>
                        One unified view of<br />
                        the entire working day.
                      </h3>
                      <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#3d322a" }}>
                        Barbers monitor chairs in real time, see waiting clients, and call the next token with one click. Eliminates waiting room overcrowding.
                      </p>
                      <div style={{ marginTop: "22px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <button
                          className="btn fill"
                          onClick={handleDeskCallNextToken}
                        >
                          {deskChair2Status === "ready" ? `Call Next Token #${deskNextToken} ↗` : "Complete Chair 02 Service"}
                        </button>
                        <a className="btn" href="/pricing">
                          Explore SalonOS Plans
                        </a>
                      </div>
                    </>
                  )}
                </div>

                {/* ─── REAL MOBILE DEVICE FRAME ─── */}
                <div className="mobile-device-frame">
                  <div className="mobile-device-notch">
                    <div style={{ width: "40px", height: "4px", background: "#333", borderRadius: "99px" }}></div>
                  </div>

                  {/* ─── CUSTOMER APP SCREEN ─── */}
                  {demoTab === "customer" && (
                    <div className="mobile-device-screen" style={{ padding: "20px 18px" }}>
                      {/* Top Status Bar */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: 700, color: "#70472f", marginBottom: "14px", paddingTop: "4px" }}>
                        <span>9:41</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>5G</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Header in App */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #eee4d8" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img src="/snepr-logo-square-transparent.png" alt="Snepr" style={{ width: "24px", height: "24px" }} />
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#2b211a", lineHeight: 1 }}>{selectedSalon.name}</div>
                            <small style={{ fontSize: "10px", color: "#8b7d70" }}>{selectedSalon.area}, Bhubaneswar</small>
                          </div>
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", background: "#e8efe9", color: "#4c805e", borderRadius: "99px" }}>
                          ● Demo Queue
                        </span>
                      </div>

                      {/* Token Hero Card */}
                      <div style={{ marginTop: "14px", padding: "16px", borderRadius: "20px", background: "linear-gradient(145deg, #fff7ee, #f5ebd9)", border: "1px solid #ebd9c2", textAlign: "center", boxShadow: "0 8px 20px rgba(112, 71, 47, 0.08)" }}>
                        <span style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#80543a", fontWeight: 800, textTransform: "uppercase" }}>
                          Your Live Token
                        </span>
                        <div style={{ fontSize: "40px", fontWeight: 900, color: "#2b211a", letterSpacing: "-0.04em", margin: "4px 0" }}>
                          #{tokenCode}
                        </div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: customerJourneyStage >= 3 ? "#70472f" : "#4c805e", background: "#ffffff", padding: "4px 12px", borderRadius: "99px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: customerJourneyStage >= 3 ? "#c69a5c" : "#4c805e" }}></span>
                          {customerJourneyStage === 2
                            ? "Waiting for chair"
                            : customerJourneyStage === 3
                            ? "Barber calling token!"
                            : customerJourneyStage === 4
                            ? "In service at chair"
                            : "Service completed"}
                        </div>
                      </div>

                      {/* 5-Stage Live Queue Journey */}
                      <div className="mob-journey">
                        <div className={`mob-stage ${customerJourneyStage >= 1 ? "done" : ""}`}>
                          <i>✓</i>
                          <span>Joined</span>
                        </div>
                        <div className={`mob-stage ${customerJourneyStage === 2 ? "active" : customerJourneyStage > 2 ? "done" : ""}`}>
                          <i>{customerJourneyStage > 2 ? "✓" : "2"}</i>
                          <span>Waiting</span>
                        </div>
                        <div className={`mob-stage ${customerJourneyStage === 3 ? "active" : customerJourneyStage > 3 ? "done" : ""}`}>
                          <i>{customerJourneyStage > 3 ? "✓" : "3"}</i>
                          <span>Turn</span>
                        </div>
                        <div className={`mob-stage ${customerJourneyStage === 4 ? "active" : customerJourneyStage > 4 ? "done" : ""}`}>
                          <i>{customerJourneyStage > 4 ? "✓" : "4"}</i>
                          <span>In chair</span>
                        </div>
                        <div className={`mob-stage ${customerJourneyStage === 5 ? "done" : ""}`}>
                          <i>5</i>
                          <span>Done</span>
                        </div>
                      </div>

                      {/* 3 Live Metric Chips */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", margin: "10px 0" }}>
                        <div style={{ background: "#ffffff", border: "1px solid #eee4d8", padding: "10px 8px", borderRadius: "14px", textAlign: "center" }}>
                          <span style={{ fontSize: "10px", color: "#8b7d70", display: "block" }}>Ahead of you</span>
                          <strong style={{ fontSize: "15px", color: "#2b211a" }}>
                            {customerJourneyStage >= 3 ? 0 : tokenAhead} clients
                          </strong>
                        </div>
                        <div style={{ background: "#ffffff", border: "1px solid #eee4d8", padding: "10px 8px", borderRadius: "14px", textAlign: "center" }}>
                          <span style={{ fontSize: "10px", color: "#8b7d70", display: "block" }}>Est. wait</span>
                          <strong style={{ fontSize: "15px", color: "#80543a" }}>
                            {customerJourneyStage >= 3 ? "0 min" : `${tokenWait} min`}
                          </strong>
                        </div>
                        <div style={{ background: "#ffffff", border: "1px solid #eee4d8", padding: "10px 8px", borderRadius: "14px", textAlign: "center" }}>
                          <span style={{ fontSize: "10px", color: "#8b7d70", display: "block" }}>Assigned</span>
                          <strong style={{ fontSize: "15px", color: "#2b211a" }}>{assignedChair}</strong>
                        </div>
                      </div>

                      {/* Service Breakdown */}
                      <div style={{ background: "#ffffff", border: "1px solid #eee4d8", padding: "12px", borderRadius: "16px", marginTop: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#2b211a" }}>Haircut and Grooming</div>
                            <small style={{ fontSize: "11px", color: "#8b7d70" }}>Stylist: Rahul Sharma · 30 min</small>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: "#80543a" }}>₹200</span>
                        </div>
                      </div>

                      {/* Bottom In-App Action */}
                      <div style={{ marginTop: "auto", paddingTop: "14px" }}>
                        <button
                          style={{ width: "100%", padding: "12px", borderRadius: "14px", background: "#70472f", color: "#fff", fontWeight: 700, fontSize: "12px", border: "none", cursor: "pointer" }}
                          onClick={() => notify(`Token #${tokenCode} is verified. Show to your stylist when called.`)}
                        >
                          Show Token at Reception
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─── SALONOS DESK SCREEN ─── */}
                  {demoTab === "desk" && (
                    <div className="mobile-device-screen dark" style={{ padding: "20px 18px" }}>
                      {/* Top Status Bar */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: 700, color: "#c69a5c", marginBottom: "14px", paddingTop: "4px" }}>
                        <span>9:41</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>● Desk Demo</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Header in Desk */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img src="/snepr-logo-square-transparent.png" alt="SalonOS" style={{ width: "24px", height: "24px" }} />
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>SalonOS Desk</div>
                            <small style={{ fontSize: "10px", color: "#aaa" }}>{selectedSalon.name} | Saheed Nagar</small>
                          </div>
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", background: "rgba(198, 154, 92, 0.2)", color: "#c69a5c", borderRadius: "99px" }}>
                          3 Chairs
                        </span>
                      </div>

                      {/* 3 Active Chairs in SalonOS Desk */}
                      <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {/* Chair 1 */}
                        <div style={{ background: "#25211e", border: "1px solid rgba(255,255,255,0.08)", padding: "10px 12px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 800, color: "#fff" }}>Chair 01</span>
                              <span style={{ fontSize: "9px", color: "#4c805e", fontWeight: 700 }}>● SERVING</span>
                            </div>
                            <div style={{ fontSize: "11px", color: "#bbb", marginTop: "2px" }}>Rahul S. serving #S104</div>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#c69a5c" }}>14m in</span>
                        </div>

                        {/* Chair 2 */}
                        <div style={{ background: deskChair2Status === "ready" ? "#2e2720" : "#25211e", border: deskChair2Status === "ready" ? "1px solid #c69a5c" : "1px solid rgba(255,255,255,0.08)", padding: "10px 12px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 800, color: "#fff" }}>Chair 02</span>
                              <span style={{ fontSize: "9px", color: deskChair2Status === "ready" ? "#c69a5c" : "#4c805e", fontWeight: 700 }}>
                                {deskChair2Status === "ready" ? "● READY" : "● SERVING"}
                              </span>
                            </div>
                            <div style={{ fontSize: "11px", color: "#ddd", marginTop: "2px" }}>{deskChair2Client}</div>
                          </div>
                          <button
                            style={{ background: "#c69a5c", color: "#191715", border: "none", padding: "5px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: 800, cursor: "pointer" }}
                            onClick={handleDeskCallNextToken}
                          >
                            {deskChair2Status === "ready" ? `Call #${deskNextToken}` : "Complete"}
                          </button>
                        </div>

                        {/* Chair 3 */}
                        <div style={{ background: "#25211e", border: "1px solid rgba(255,255,255,0.08)", padding: "10px 12px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 800, color: "#fff" }}>Chair 03</span>
                              <span style={{ fontSize: "9px", color: "#4c805e", fontWeight: 700 }}>● SERVING</span>
                            </div>
                            <div style={{ fontSize: "11px", color: "#bbb", marginTop: "2px" }}>Amit S. serving #S103</div>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#c69a5c" }}>8m in</span>
                        </div>
                      </div>

                      {/* Live Queue Next Customers */}
                      <div style={{ marginTop: "14px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>
                          Queue Stream
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", padding: "6px 8px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                            <span>#{deskNextToken} · Next in line</span>
                            <span style={{ color: "#c69a5c", fontWeight: 700 }}>Ready</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", padding: "6px 8px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                            <span>#A09 · Rohan Dash</span>
                            <span style={{ color: "#aaa" }}>8 min wait</span>
                          </div>
                        </div>
                      </div>

                      {/* Desk Daily Summary Footer */}
                      <div style={{ marginTop: "auto", paddingTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <div>
                          <small style={{ fontSize: "9px", color: "#888" }}>Served Today</small>
                          <div style={{ fontSize: "13px", fontWeight: 800, color: "#fff" }}>{deskServedCount} clients</div>
                        </div>
                        <div>
                          <small style={{ fontSize: "9px", color: "#888" }}>Commissions Deducted</small>
                          <div style={{ fontSize: "13px", fontWeight: 800, color: "#4c805e" }}>₹0 (Zero)</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. HOW IT WORKS ─── */}
        <section className="section" id="how-it-works">
          <div className="wrap">
            <div className="section-head">
              <div>
                <h2>
                  From your couch<br />
                  to the <em>barber chair.</em>
                </h2>
              </div>
              <p>Three straightforward steps to make your salon visit in Bhubaneswar completely wait free.</p>
            </div>
            <div className="steps">
              <article className="step">
                <span className="n">01</span>
                <h3>Check the wait</h3>
                <p>View live chair availability and estimated waiting times across Bhubaneswar before traveling.</p>
              </article>
              <article className="step">
                <span className="n">02</span>
                <h3>Save your place</h3>
                <p>Select your service and join the digital queue directly from your phone.</p>
              </article>
              <article className="step">
                <span className="n">03</span>
                <h3>Walk straight in</h3>
                <p>Follow your live token and arrive right as your barber chair opens.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ─── 7. AI HAIR STUDIO (Positioned as Upcoming Feature) ─── */}
        <section className="ai-band" id="ai">
          <div className="wrap ai-layout">
            <div className="ai-copy">
              <div className="eyebrow" style={{ color: "#d4a17b", fontWeight: 700 }}>
                Coming Soon | Concept Preview
              </div>
              <h2>
                Try the look<br />
                before the <em>cut.</em>
              </h2>
              <p>Explore hairstyles tailored to your face shape and share clear visual references with your barber.</p>
              <ul className="ai-list" style={{ fontSize: "15px", lineHeight: "1.8", color: "#f7f3ed" }}>
                <li>Hairstyle discovery and personalized suggestions</li>
                <li>Share a preferred reference directly with your stylist</li>
                <li>Connect virtual styles to salon services and transparent pricing</li>
              </ul>

              {/* Functional Waitlist Registration */}
              {!waitlistSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (waitlistEmail.trim() && waitlistEmail.includes("@")) {
                      setWaitlistSubmitted(true);
                      notify("You have been added to the AI Studio waitlist! We will alert you when beta launches in Bhubaneswar.");
                    } else {
                      notify("Please enter a valid email address.");
                    }
                  }}
                  style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap", maxWidth: "420px" }}
                >
                  <input
                    type="email"
                    placeholder="Enter email for early access..."
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    style={{ flex: 1, minWidth: "220px", padding: "10px 16px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: "13px" }}
                    aria-label="Email for AI waitlist"
                  />
                  <button type="submit" className="btn fill" style={{ background: "#d4a17b", color: "#1d1b17", border: "none" }}>
                    Join Waitlist ↗
                  </button>
                </form>
              ) : (
                <div style={{ marginTop: "20px", padding: "12px 18px", borderRadius: "14px", background: "rgba(198, 154, 92, 0.2)", color: "#f7f3ed", fontSize: "14px", fontWeight: 600 }}>
                  ✓ You are on the AI Studio waitlist! We will notify you upon launch in Bhubaneswar.
                </div>
              )}
            </div>
            <div className="style-orbit">
              <div className="style-disc flex items-center justify-center p-6 text-center">
                <img
                  src="/snepr-logo.png"
                  alt="Snepr AI Studio"
                  className="w-28 h-auto opacity-80 drop-shadow"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 8. FOR SALON OWNERS | SALONOS ─── */}
        <section className="owner" id="salons">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                  For salon owners | SalonOS
                </div>
                <h2>
                  Your salon, your chairs,<br />
                  <em>your customers.</em>
                </h2>
              </div>
              <p>A modern salon operations platform designed for barbers and salon owners across Bhubaneswar. Zero commission fees.</p>
            </div>

            <div className="owner-flow">
              <span>01 Customer joins</span>
              <i>→</i>
              <span>02 Token appears</span>
              <i>→</i>
              <span>03 Barber calls next</span>
              <i>→</i>
              <span>04 Customer notified</span>
              <i>→</i>
              <span>05 Service completes</span>
              <i>→</i>
              <span>06 Review and points</span>
            </div>

            <div className="owner-grid">
              <div className="owner-feature">
                <b>Digital queue</b>Automatic tokens and live chair routing
              </div>
              <div className="owner-feature">
                <b>Chair availability</b>Service timing and staff assignment
              </div>
              <div className="owner-feature">
                <b>Customer history</b>Direct customer retention and loyalty
              </div>
              <div className="owner-feature">
                <b>Salon insights</b>Peak hour analytics and multi branch support
              </div>
            </div>

            {/* SalonOS Demo Cockpit */}
            <div className="owner-dashboard" style={{ background: "#1c1917", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.12)", padding: "28px", color: "#f5f1e9", boxShadow: "0 28px 70px rgba(0,0,0,0.35)" }}>
              <div className="dash-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "18px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                <span className="flex items-center gap-3">
                  <img
                    src="/snepr-logo-square-transparent.png"
                    alt="SalonOS"
                    className="w-7 h-7 rounded-md object-contain bg-white/10 p-1"
                  />
                  <div>
                    <b style={{ fontSize: "16px", color: "#fff" }}>SalonOS Operations Cockpit</b>
                    <div style={{ fontSize: "12px", color: "#a89f91" }}>Demo Preview | Interactive Salon Management System</div>
                  </div>
                </span>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "5px 12px", borderRadius: "99px", background: "rgba(198, 154, 92, 0.2)", color: "#d4a17b" }}>
                  ● 3 CHAIRS ACTIVE
                </span>
              </div>

              {/* 3 Active Chairs in Salon */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", margin: "20px 0" }}>
                <div style={{ background: "#26221f", border: "1px solid rgba(255,255,255,0.08)", padding: "16px", borderRadius: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "14px", color: "#fff" }}>Chair 01</strong>
                    <span style={{ fontSize: "11px", color: "#4c805e", fontWeight: 700 }}>● SERVING</span>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8dfd5" }}>Stylist: Rahul Sharma</div>
                  <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>Client: #S104 (Fade and Beard)</div>
                  <div style={{ fontSize: "11px", color: "#d4a17b", fontWeight: 700, marginTop: "8px" }}>14 min elapsed | 11 min left</div>
                </div>

                <div style={{ background: "#2c251f", border: "1px solid #c69a5c", padding: "16px", borderRadius: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "14px", color: "#fff" }}>Chair 02</strong>
                    <span style={{ fontSize: "11px", color: "#c69a5c", fontWeight: 700 }}>● READY TO CALL</span>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>Stylist: Prakash Jena</div>
                  <div style={{ fontSize: "12px", color: "#ddd", marginTop: "4px" }}>Available for next client</div>
                  <button
                    className="btn fill"
                    style={{ width: "100%", marginTop: "10px", padding: "8px", fontSize: "11px" }}
                    onClick={() => notify("Calling customer to Chair 02. In production, automated SMS and WhatsApp alerts are dispatched.")}
                  >
                    Call Next Token ↗
                  </button>
                </div>

                <div style={{ background: "#26221f", border: "1px solid rgba(255,255,255,0.08)", padding: "16px", borderRadius: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "14px", color: "#fff" }}>Chair 03</strong>
                    <span style={{ fontSize: "11px", color: "#4c805e", fontWeight: 700 }}>● SERVING</span>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8dfd5" }}>Stylist: Amit Swain</div>
                  <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>Client: #S103 (Hair Spa)</div>
                  <div style={{ fontSize: "11px", color: "#d4a17b", fontWeight: 700, marginTop: "8px" }}>8 min elapsed | 17 min left</div>
                </div>
              </div>

              {/* Desk Key Performance Metrics */}
              <div className="metrics" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "18px" }}>
                <div className="metric">
                  <small style={{ fontSize: "11px", color: "#aaa" }}>Active Stylists</small>
                  <strong style={{ fontSize: "22px", color: "#fff" }}>3</strong>
                </div>
                <div className="metric">
                  <small style={{ fontSize: "11px", color: "#aaa" }}>Waiting in Queue</small>
                  <strong style={{ fontSize: "22px", color: "#d4a17b" }}>3</strong>
                </div>
                <div className="metric">
                  <small style={{ fontSize: "11px", color: "#aaa" }}>Commission Deducted</small>
                  <strong style={{ fontSize: "22px", color: "#4c805e" }}>₹0 (0%)</strong>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <a className="btn fill" href="/pricing" style={{ padding: "14px 32px", fontSize: "14px" }}>
                View SalonOS Plans and Pricing (Starting at ₹199 per month) ↗
              </a>
            </div>
          </div>
        </section>

        {/* ─── 9. SNEPR POINTS & VERIFIED REVIEWS ─── */}
        <section className="section" id="points" style={{ paddingTop: "20px" }}>
          <div className="wrap">
            <div className="points">
              <div>
                <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                  Verified reviews | Snepr Points
                </div>
                <h2>
                  Reviews you can trust,<br />
                  <em>points you can spend.</em>
                </h2>
                <p>Rewards in Bhubaneswar are tied directly to verified completed visits, never manipulated ratings.</p>

                {/* Clear Rewards Illustration */}
                <div style={{ background: "#fff", border: "1px solid #ebd9c2", borderRadius: "20px", padding: "20px", marginTop: "20px", boxShadow: "0 8px 24px rgba(112, 71, 47, 0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <img src="/snepr-logo-square.png" alt="Snepr Points" style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
                    <div>
                      <strong style={{ fontSize: "14px", color: "#2b211a" }}>Points Rewards Example</strong>
                      <div style={{ fontSize: "12px", color: "#8b7d70" }}>1 Point = ₹1 Service Discount</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", color: "#4a3e35", lineHeight: "1.6" }}>
                    Spent <b>₹{calcSpend}</b> on your haircut → Earn <b>10 Snepr Points</b> upon verified visit completion → Redeem up to <b>20%</b> discount on your next visit!
                  </div>
                  <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
                    {[200, 400, 800].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setCalcSpend(amt)}
                        style={{ padding: "6px 12px", borderRadius: "99px", border: calcSpend === amt ? "1px solid #70472f" : "1px solid #eee4d8", background: calcSpend === amt ? "#70472f" : "#fff", color: calcSpend === amt ? "#fff" : "#2b211a", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                      >
                        Bill ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="point-rules">
                <div className="rule">
                  <b>01</b>
                  <span>Only customers with completed digital visits can generate verified reviews.</span>
                </div>
                <div className="rule">
                  <b>02</b>
                  <span>Each eligible review earns 10 Snepr Points. 1 point equals ₹1 discount.</span>
                </div>
                <div className="rule">
                  <b>03</b>
                  <span>Redeem points toward future haircuts or grooming services up to 20% of your bill.</span>
                </div>
                <div className="rule">
                  <b>04</b>
                  <span>Rewards are never influenced by star rating. Honest feedback is always honored.</span>
                </div>
                <p className="sample-note" style={{ marginTop: "16px" }}>
                  VERIFIED FIDELITY. Loyalty discount redemption is honored at participating partner salons in Bhubaneswar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 10. FAQ ACCORDION ─── */}
        <section className="section" id="faq" style={{ paddingTop: "30px" }}>
          <div className="wrap faq">
            <div>
              <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                Help and FAQ
              </div>
              <h2>
                Good to<br />
                <em>know.</em>
              </h2>
              <p style={{ fontSize: "14px", color: "#4a3e35", lineHeight: 1.8, marginTop: "8px" }}>
                Answers to common questions about salon discovery, live queues, and SalonOS in Bhubaneswar.
              </p>
            </div>
            <div className="faq-list">
              <details>
                <summary>Do I need to download an app to join a queue?</summary>
                <p>
                  No app download is required. Customers can discover salons, check chair wait times, and join live queues directly in any mobile or desktop web browser.
                </p>
              </details>
              <details>
                <summary>How are live salon waiting times calculated?</summary>
                <p>
                  Waiting estimates combine the salon active stylist chairs, each customer specific service duration, and real time chair departures tracked on the barber SalonOS desk.
                </p>
              </details>
              <details>
                <summary>Which areas of Bhubaneswar does Snepr cover?</summary>
                <p>
                  Snepr covers popular neighborhoods across Bhubaneswar including Patia, Saheed Nagar, Jaydev Vihar, KIIT Square, Chandrasekharpur, Nayapalli, and Khandagiri.
                </p>
              </details>
              <details>
                <summary>How can salon owners list their salon on Snepr?</summary>
                <p>
                  Salon owners can visit our dedicated <a href="/pricing" style={{ color: "var(--brown)", fontWeight: 700 }}>SalonOS Pricing page</a> to register their salon, select a monthly plan, and receive an official digital QR standee with zero haircut commissions.
                </p>
              </details>
              <details>
                <summary>How do I redeem Snepr Points for discounts?</summary>
                <p>
                  When you arrive at the salon for your appointment, simply present your token. Points earned from previous verified visits apply directly toward your bill up to 20 percent.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* ─── 11. FINAL CALL TO ACTION ─── */}
        <section className="final-cta" id="contact">
          <div className="wrap">
            <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
              Know before you go
            </div>
            <h2>
              Your time is worth<br />
              <em>more than a wait.</em>
            </h2>
            <p>
              Discover top salons in Bhubaneswar and join live queues from anywhere. Salon owners can modernize operations with SalonOS.
            </p>
            <div className="final-actions">
              <a className="btn fill" href="#discover">
                Find a salon near you ↗
              </a>
              <a className="btn" href="/pricing">
                Register your salon ↗
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── 12. CLEAN FOOTER ─── */}
      <footer id="footer">
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <img
                src="/snepr-logo-transparent.png"
                alt="Snepr"
                className="foot-brand-logo"
              />
              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#d0c8be", maxWidth: "240px" }}>
                Live salon queues and waiting times in Bhubaneswar.<br />
                Know before you go.
              </p>
              {/* Instagram Button */}
              <div style={{ marginTop: "18px" }}>
                <a
                  href="https://www.instagram.com/sneprofficial/"
                  target="_blank"
                  rel="noreferrer"
                  className="foot-instagram-btn"
                  aria-label="Follow Snepr on Instagram"
                >
                  <svg
                    style={{ width: "18px", height: "18px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Follow @sneprofficial</span>
                </a>
              </div>
            </div>

            <div className="foot-col">
              <b>Customers</b>
              <a href="#discover">Explore salons</a>
              <a href="#discover">Live queues</a>
              <a href="#how">How it works</a>
              <a href="#ai">AI Studio</a>
              <a href="#points">Snepr Points</a>
            </div>

            <div className="foot-col">
              <b>Salon owners</b>
              <a href="/pricing">SalonOS</a>
              <a href="/pricing">Plans and pricing</a>
              <a href="/login">Salon desk login</a>
              <a href="/pricing">Register a salon</a>
            </div>

            <div className="foot-col">
              <b>Company</b>
              <a href="#top">About Snepr</a>
              <a href="/contact">Contact</a>
              <a href="/help">Help center</a>
            </div>

            <div className="foot-col">
              <b>Legal</b>
              <a href="/privacy-policy">Privacy policy</a>
              <a href="/partner-terms">Terms of service</a>
              <div style={{ marginTop: "12px" }}>
                <a
                  href="https://www.instagram.com/sneprofficial/"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  style={{ color: "#d4a17b", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span style={{ fontSize: "12px" }}>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          <div className="foot-bottom">
            <span>© 2026 Snepr | Bhubaneswar, Odisha</span>
            <span>Made in Bhubaneswar</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <div
        className={`toast ${toast.show ? "show" : ""}`}
        id="toast"
        role="status"
        aria-live="polite"
      >
        {toast.msg}
      </div>
    </>
  );
}
