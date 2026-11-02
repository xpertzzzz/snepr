import sys
sys.stdout.reconfigure(encoding='utf-8')

homepage_code = '''import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import "@/styles/snepr-final.css";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    title: "sn≡pr | Best Salons in Bhubaneswar | Live Salon Queue and Waiting Times",
    meta: [
      {
        name: "description",
        content:
          "Find the best salons in Bhubaneswar, check live chair waiting times, and save your spot in the live salon queue at top barber shops and unisex salons near you in Patia, Saheed Nagar, and Jaydev Vihar.",
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
          "Check live salon waiting times from home. Join the digital queue for top salons and barber shops in Bhubaneswar. Arrive when your barber chair is ready.",
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
  name: string;
  area: string;
  locality: string;
  type: "Men's" | "Unisex" | "Premium";
  rating: number;
  free: string;
  queue: number;
  wait: number;
  letter: string;
  services: string[];
}

const BHUBANESWAR_SALONS: SalonItem[] = [
  {
    name: "The Scissors Edge",
    area: "Saheed Nagar",
    locality: "Saheed Nagar",
    type: "Unisex",
    rating: 4.8,
    free: "2 of 3 chairs free",
    queue: 1,
    wait: 5,
    letter: "T",
    services: ["Haircut", "Beard Trim", "Hair Spa", "Facial"],
  },
  {
    name: "Urban Look Salon",
    area: "Jaydev Vihar",
    locality: "Jaydev Vihar",
    type: "Men's",
    rating: 4.6,
    free: "1 of 2 chairs free",
    queue: 3,
    wait: 10,
    letter: "U",
    services: ["Barber Cut", "Beard Styling", "Head Massage"],
  },
  {
    name: "Style Studio by Jawed Habib",
    area: "Patia",
    locality: "Patia",
    type: "Premium",
    rating: 4.7,
    free: "All chairs busy",
    queue: 5,
    wait: 15,
    letter: "S",
    services: ["Designer Cut", "Global Color", "Keratin", "Beard Grooming"],
  },
  {
    name: "Lakmé Salon",
    area: "Patia",
    locality: "Patia",
    type: "Unisex",
    rating: 4.9,
    free: "2 chairs free",
    queue: 0,
    wait: 0,
    letter: "L",
    services: ["Precision Haircut", "Bridal", "Facials", "Styling"],
  },
  {
    name: "NVN Unisex Salon",
    area: "Patia",
    locality: "Patia",
    type: "Unisex",
    rating: 4.6,
    free: "1 chair free",
    queue: 2,
    wait: 5,
    letter: "N",
    services: ["Haircut", "Beard Grooming", "Cleanup"],
  },
  {
    name: "Green Trends Salon",
    area: "Chandrasekharpur",
    locality: "Chandrasekharpur",
    type: "Unisex",
    rating: 4.7,
    free: "1 chair free",
    queue: 4,
    wait: 12,
    letter: "G",
    services: ["Organic Hair Spa", "Haircut", "Beard Spa"],
  },
  {
    name: "Royale Barber Club",
    area: "KIIT Square",
    locality: "KIIT Square",
    type: "Men's",
    rating: 4.8,
    free: "3 of 4 chairs free",
    queue: 1,
    wait: 4,
    letter: "R",
    services: ["Fade and Taper", "Hot Towel Shave", "Beard Oil Spa"],
  },
  {
    name: "Ozone Studio and Spa",
    area: "Nayapalli",
    locality: "Nayapalli",
    type: "Premium",
    rating: 4.7,
    free: "2 chairs free",
    queue: 2,
    wait: 8,
    letter: "O",
    services: ["Men Grooming", "Hair Therapy", "Detox Facial"],
  },
];

export function SneprLandingPage() {
  // Mobile nav state
  const [navOpen, setNavOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });
  const toastTimeoutRef = useRef<number | null>(null);

  const notify = (msg: string) => {
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    setToast({ msg, show: true });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  // Combined Discovery Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("All Localities");
  const [currentFilter, setCurrentFilter] = useState("All");
  const [locating, setLocating] = useState(false);

  // Phone demo tabs & tokens
  const [demoTab, setDemoTab] = useState<"customer" | "desk">("customer");
  const [tokenCode, setTokenCode] = useState("A07");
  const [tokenPosition, setTokenPosition] = useState(2);
  const [tokenWait, setTokenWait] = useState(12);

  // Filtered Salons calculation
  const displayedSalons = useMemo(() => {
    let list = [...BHUBANESWAR_SALONS];

    // Filter by locality
    if (selectedLocality !== "All Localities") {
      list = list.filter(
        (s) =>
          s.locality.toLowerCase() === selectedLocality.toLowerCase() ||
          s.area.toLowerCase() === selectedLocality.toLowerCase()
      );
    }

    // Filter by search query
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

    // Filter pills
    if (currentFilter === "Shortest") {
      list.sort((a, b) => a.wait - b.wait);
    } else if (currentFilter === "Top") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (currentFilter === "Available") {
      list = list.filter((s) => s.wait === 0 || !s.free.includes("All chairs busy"));
    } else if (["Men's", "Unisex", "Premium"].includes(currentFilter)) {
      list = list.filter((s) => s.type === currentFilter);
    }

    return list;
  }, [searchQuery, selectedLocality, currentFilter]);

  // Geolocation handler
  const handleLocate = () => {
    if (!navigator.geolocation) {
      notify("Location service is unavailable on your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setSelectedLocality("Patia");
        setLocating(false);
        notify("GPS location verified. Showing nearest salons in Patia, Bhubaneswar.");
      },
      () => {
        setLocating(false);
        notify("Location access denied. Please select your neighborhood from the list.");
      },
      { timeout: 8000 }
    );
  };

  // Scissor animation on scroll (Original exact motion math)
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
      {/* ─── 1. HERO HEADER ─── */}
      <header className="hero" id="top">
        <div className="hero-head">
          <a className="brand" href="#top" aria-label="Snepr home">
            <img src="/snepr-logo-transparent.png" alt="Snepr" />
          </a>
          <nav className={`hero-nav ${navOpen ? "open" : ""}`} id="navlinks">
            <a href="#discover" onClick={() => setNavOpen(false)}>
              Explore
            </a>
            <a href="#discover" onClick={() => setNavOpen(false)}>
              Live Queues
            </a>
            <a href="#how" onClick={() => setNavOpen(false)}>
              How it works
            </a>
            <a href="#ai" onClick={() => setNavOpen(false)}>
              AI Studio
            </a>
            <a href="#salons" onClick={() => setNavOpen(false)}>
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
            <a className="btn fill" href="#discover">
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

        <div className="hero-main">
          <div className="hero-content">
            <div className="eyebrow" style={{ letterSpacing: "0.15em", color: "#80543a", fontWeight: 700 }}>
              Salons in Bhubaneswar | Live Queue Discovery
            </div>
            <h1>
              Never wait in line<br />
              <span>at a salon again.</span>
            </h1>
            <p className="hero-desc">
              Discover the best salons in Bhubaneswar with real time chair wait times. Save your place in the live salon queue from home and arrive right when your barber is ready. Know before you go.
            </p>
            <div className="hero-ctas">
              <a className="btn fill" href="#discover">
                Find a salon near you ↗
              </a>
              <a className="btn" href="#discover">
                Explore live queues
              </a>
            </div>
            <a className="owner-link" href="#salons">
              For salon owners | SalonOS ↗
            </a>
          </div>
        </div>

        <div className="hero-art"></div>

        <div className="hero-bottom wrap">
          <span>sn≡pr in Bhubaneswar, Odisha</span>
          <span className="scrollline">Scroll to explore</span>
          <span>Live chair countdown | Zero wait</span>
        </div>
      </header>

      {/* ─── 2. ORIGINAL SCISSOR STRAND CUT SCENE ─── */}
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

      {/* ─── 3. SINGLE COMBINED SALON DISCOVERY SECTION ─── */}
      <main>
        <section className="section" id="discover">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                  Salons in Bhubaneswar | Live Queue Updates
                </div>
                <h2>
                  Find your <em>salon.</em>
                </h2>
                <p style={{ marginTop: "8px", maxWidth: "640px" }}>
                  Explore top rated barber shops and unisex salons in Bhubaneswar. Check chair availability and real time salon waiting times before leaving home.
                </p>
              </div>
              <div className="live-label" style={{ fontWeight: 700 }}>● LIVE QUEUE PREVIEW</div>
            </div>

            {/* Combined Search & Controls Bar */}
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
                aria-label="Select Bhubaneswar neighborhood"
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
                  <article className="salon" key={s.name}>
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
                    <h3>{s.name}</h3>
                    <div className="salon-meta">
                      {s.area} · {s.type} · ★ {s.rating.toFixed(1)}
                    </div>
                    <div className="salon-stats">
                      <div>
                        <strong>{s.free.startsWith("All") ? "0" : s.free.split(" ")[0]}</strong>
                        <span>Chairs free</span>
                      </div>
                      <div>
                        <strong>{s.queue}</strong>
                        <span>In queue</span>
                      </div>
                      <div>
                        <strong>{s.wait} min</strong>
                        <span>Wait time</span>
                      </div>
                    </div>
                    <div className="salon-foot">
                      <small style={{ fontSize: "13px", fontWeight: 600, color: "#6b5e52" }}>{s.free}</small>
                      <button
                        className="join"
                        data-salon={s.name}
                        onClick={() => {
                          setDemoTab("customer");
                          setTokenCode("S105");
                          setTokenPosition(1);
                          setTokenWait(s.wait || 5);
                          notify(`Selected ${s.name}. Generated token S105 in Customer View below!`);
                        }}
                      >
                        Join queue ↗
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", gridColumn: "1 / -1", color: "var(--muted)" }}>
                  <p style={{ fontSize: "16px", color: "#4a3e35" }}>
                    No salons match your search criteria in {selectedLocality}. Try resetting your search or filter.
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

            <p className="sample-note" style={{ marginTop: "16px" }}>
              VERIFIED SALONS IN BHUBANESWAR. Chair availability, GPS distances, and live queue updates are powered directly by salon desk activity.
            </p>

            {/* ─── AUTHENTIC MOBILE APP SIMULATOR (From app-customer & app-owner-snepros) ─── */}
            <div className="demo" style={{ marginTop: "50px" }}>
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
                        Customer Experience | App Interface
                      </div>
                      <h3 style={{ fontSize: "32px", lineHeight: "1.1", margin: "14px 0" }}>
                        Choose your service.<br />
                        Know your place.
                      </h3>
                      <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#3d322a" }}>
                        Experience the exact Snepr Customer Mobile App. Track your place with a live 5 stage journey, see how many people are ahead, and get notified right when your stylist calls your token.
                      </p>
                      <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <button
                          className="btn fill"
                          onClick={() => {
                            const next = "A0" + (Math.floor(Math.random() * 8) + 1);
                            setTokenCode(next);
                            setTokenPosition(Math.floor(Math.random() * 3) + 1);
                            setTokenWait((Math.floor(Math.random() * 3) + 1) * 5);
                            notify(`Generated new verified live token #${next}`);
                          }}
                        >
                          Generate New Demo Token ↗
                        </button>
                        <button
                          className="btn"
                          onClick={() => notify("Notification sent: Your stylist is ready at Chair 02!")}
                        >
                          Simulate Barber Call
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                        Salon Desk Experience | SalonOS
                      </div>
                      <h3 style={{ fontSize: "32px", lineHeight: "1.1", margin: "14px 0" }}>
                        One unified view of<br />
                        the entire working day.
                      </h3>
                      <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#3d322a" }}>
                        Experience the exact SalonOS Owner Desk. Barbers monitor active chairs in real time, see who is waiting in line, and click one button to call the next token to an empty chair with zero waiting room chaos.
                      </p>
                      <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <a className="btn fill" href="/pricing">
                          Explore SalonOS Plans ↗
                        </a>
                        <button
                          className="btn"
                          onClick={() => notify("Chair 02 called Token #A07! Customer phone alerted.")}
                        >
                          Test Call Next Token
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* ─── REAL MOBILE DEVICE FRAME ─── */}
                <div className="mobile-device-frame">
                  <div className="mobile-device-notch">
                    <div style={{ width: "40px", height: "4px", background: "#333", borderRadius: "99px" }}></div>
                  </div>

                  {/* ─── A) CUSTOMER APP SCREEN (Exact app-customer ui.html fidelity) ─── */}
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
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#2b211a", lineHeight: 1 }}>The Scissors Edge</div>
                            <small style={{ fontSize: "10px", color: "#8b7d70" }}>Saheed Nagar, Bhubaneswar</small>
                          </div>
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", background: "#e8efe9", color: "#4c805e", borderRadius: "99px" }}>
                          ● Live Queue
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
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "#4c805e", background: "#ffffff", padding: "4px 12px", borderRadius: "99px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4c805e" }}></span>
                          Waiting for chair
                        </div>
                      </div>

                      {/* 5-Stage Live Queue Journey (From app-customer ui.html) */}
                      <div className="mob-journey">
                        <div className="mob-stage done">
                          <i>✓</i>
                          <span>Joined</span>
                        </div>
                        <div className="mob-stage active">
                          <i>2</i>
                          <span>Waiting</span>
                        </div>
                        <div className="mob-stage">
                          <i>3</i>
                          <span>Turn</span>
                        </div>
                        <div className="mob-stage">
                          <i>4</i>
                          <span>In chair</span>
                        </div>
                        <div className="mob-stage">
                          <i>5</i>
                          <span>Done</span>
                        </div>
                      </div>

                      {/* 3 Live Metric Chips */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", margin: "10px 0" }}>
                        <div style={{ background: "#ffffff", border: "1px solid #eee4d8", padding: "10px 8px", borderRadius: "14px", textAlign: "center" }}>
                          <span style={{ fontSize: "10px", color: "#8b7d70", display: "block" }}>Ahead of you</span>
                          <strong style={{ fontSize: "15px", color: "#2b211a" }}>{tokenPosition} clients</strong>
                        </div>
                        <div style={{ background: "#ffffff", border: "1px solid #eee4d8", padding: "10px 8px", borderRadius: "14px", textAlign: "center" }}>
                          <span style={{ fontSize: "10px", color: "#8b7d70", display: "block" }}>Est. wait</span>
                          <strong style={{ fontSize: "15px", color: "#80543a" }}>{tokenWait} min</strong>
                        </div>
                        <div style={{ background: "#ffffff", border: "1px solid #eee4d8", padding: "10px 8px", borderRadius: "14px", textAlign: "center" }}>
                          <span style={{ fontSize: "10px", color: "#8b7d70", display: "block" }}>Assigned</span>
                          <strong style={{ fontSize: "15px", color: "#2b211a" }}>Chair 02</strong>
                        </div>
                      </div>

                      {/* Service Breakdown */}
                      <div style={{ background: "#ffffff", border: "1px solid #eee4d8", padding: "12px", borderRadius: "16px", marginTop: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#2b211a" }}>Precision Haircut + Beard Grooming</div>
                            <small style={{ fontSize: "11px", color: "#8b7d70" }}>Stylist: Rahul Sharma · Est. 35 min</small>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: "#80543a" }}>₹220</span>
                        </div>
                      </div>

                      {/* Bottom In-App Action */}
                      <div style={{ marginTop: "auto", paddingTop: "14px" }}>
                        <button
                          style={{ width: "100%", padding: "12px", borderRadius: "14px", background: "#70472f", color: "#fff", fontWeight: 700, fontSize: "12px", border: "none", cursor: "pointer" }}
                          onClick={() => notify(`Token #${tokenCode} is active at The Scissors Edge. Arrive by 10:05 AM!`)}
                        >
                          Show Digital Token to Barber
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─── B) SALONOS DESK SCREEN (Exact app-owner-snepros ui.html fidelity) ─── */}
                  {demoTab === "desk" && (
                    <div className="mobile-device-screen dark" style={{ padding: "20px 18px" }}>
                      {/* Top Status Bar */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: 700, color: "#c69a5c", marginBottom: "14px", paddingTop: "4px" }}>
                        <span>9:41</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>● Desk Live</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Header in Desk */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img src="/snepr-logo-square-transparent.png" alt="SalonOS" style={{ width: "24px", height: "24px" }} />
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>SalonOS Desk</div>
                            <small style={{ fontSize: "10px", color: "#aaa" }}>The Scissors Edge | Saheed Nagar</small>
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
                            <div style={{ fontSize: "11px", color: "#bbb", marginTop: "2px" }}>Rahul S. → #S104 (Haircut)</div>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#c69a5c" }}>14m in</span>
                        </div>

                        {/* Chair 2 (Ready to Call) */}
                        <div style={{ background: "#2e2720", border: "1px solid #c69a5c", padding: "10px 12px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 800, color: "#fff" }}>Chair 02</span>
                              <span style={{ fontSize: "9px", color: "#c69a5c", fontWeight: 700 }}>● READY</span>
                            </div>
                            <div style={{ fontSize: "11px", color: "#ddd", marginTop: "2px" }}>Prakash K. available</div>
                          </div>
                          <button
                            style={{ background: "#c69a5c", color: "#191715", border: "none", padding: "5px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: 800, cursor: "pointer" }}
                            onClick={() => notify("Calling customer #A07 to Chair 02 via SMS and WhatsApp push!")}
                          >
                            Call #A07
                          </button>
                        </div>

                        {/* Chair 3 */}
                        <div style={{ background: "#25211e", border: "1px solid rgba(255,255,255,0.08)", padding: "10px 12px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 800, color: "#fff" }}>Chair 03</span>
                              <span style={{ fontSize: "9px", color: "#4c805e", fontWeight: 700 }}>● SERVING</span>
                            </div>
                            <div style={{ fontSize: "11px", color: "#bbb", marginTop: "2px" }}>Amit S. → #S103 (Beard Spa)</div>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#c69a5c" }}>8m in</span>
                        </div>
                      </div>

                      {/* Live Queue Next Customers */}
                      <div style={{ marginTop: "14px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>
                          Live Queue Stream
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", padding: "6px 8px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                            <span>#A07 · Priya K. (Unisex Cut)</span>
                            <span style={{ color: "#c69a5c", fontWeight: 700 }}>Next up</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", padding: "6px 8px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                            <span>#A08 · Rohan Dash (Beard)</span>
                            <span style={{ color: "#aaa" }}>8 min wait</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", padding: "6px 8px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                            <span>#A09 · Debasis M. (Haircut)</span>
                            <span style={{ color: "#aaa" }}>15 min wait</span>
                          </div>
                        </div>
                      </div>

                      {/* Desk Today Metrics Footer */}
                      <div style={{ marginTop: "auto", paddingTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <div>
                          <small style={{ fontSize: "9px", color: "#888" }}>Served Today</small>
                          <div style={{ fontSize: "13px", fontWeight: 800, color: "#fff" }}>28 clients</div>
                        </div>
                        <div>
                          <small style={{ fontSize: "9px", color: "#888" }}>Day Total</small>
                          <div style={{ fontSize: "13px", fontWeight: 800, color: "#c69a5c" }}>₹6,450</div>
                        </div>
                        <div>
                          <small style={{ fontSize: "9px", color: "#888" }}>Commission</small>
                          <div style={{ fontSize: "13px", fontWeight: 800, color: "#4c805e" }}>₹0 (0%)</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. HOW IT WORKS (High Visibility Text) ─── */}
        <section className="section" id="how">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                  Simple by design
                </div>
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
                <p>View live chair availability and estimated salon waiting times across Bhubaneswar before traveling.</p>
              </article>
              <article className="step">
                <span className="n">02</span>
                <h3>Save your chair</h3>
                <p>Select your haircut or groom service and join the digital queue directly from your phone.</p>
              </article>
              <article className="step">
                <span className="n">03</span>
                <h3>Walk straight in</h3>
                <p>Track your token live on Snepr and step in right as your barber chair opens.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ─── 5. AI HAIR STUDIO CONCEPT ─── */}
        <section className="ai-band" id="ai">
          <div className="wrap ai-layout">
            <div className="ai-copy">
              <div className="eyebrow" style={{ color: "#d4a17b", fontWeight: 700 }}>
                AI Hair Studio | Concept
              </div>
              <h2>
                Try the look<br />
                before the <em>cut.</em>
              </h2>
              <p>Explore hairstyles tailored to your face shape and share clear inspiration with your barber.</p>
              <ul className="ai-list" style={{ fontSize: "15px", lineHeight: "1.8", color: "#f7f3ed" }}>
                <li>Hairstyle discovery and personalized suggestions</li>
                <li>Share a preferred reference directly with your stylist</li>
                <li>Connect virtual styles to salon services and transparent pricing</li>
              </ul>
              <a className="btn" href="#contact" style={{ borderColor: "#d4a17b", color: "#f5f1e9", marginTop: "16px" }}>
                Join the AI Studio waitlist ↗
              </a>
              <p style={{ fontSize: "12px", color: "#c4bcb1", marginTop: "18px" }}>
                Concept preview. Full AI visual styling integration is slated for our upcoming platform release.
              </p>
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

        {/* ─── 6. PREMIUM SALONOS DASHBOARD SECTION ─── */}
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

            {/* Premium Full-Fidelity SalonOS Operations Cockpit */}
            <div className="owner-dashboard" style={{ background: "#1c1917", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.12)", padding: "28px", color: "#f5f1e9", boxShadow: "0 28px 70px rgba(0,0,0,0.35)" }}>
              <div className="dash-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "18px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                <span className="flex items-center gap-3">
                  <img
                    src="/snepr-logo-square-transparent.png"
                    alt="SalonOS"
                    className="w-7 h-7 rounded-md object-contain bg-white/10 p-1"
                  />
                  <div>
                    <b style={{ fontSize: "16px", color: "#fff" }}>The Scissors Edge | Flagship Salon</b>
                    <div style={{ fontSize: "12px", color: "#a89f91" }}>Saheed Nagar, Bhubaneswar · Live Desk Active</div>
                  </div>
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "5px 12px", borderRadius: "99px", background: "rgba(198, 154, 92, 0.2)", color: "#d4a17b" }}>
                    ● 3 CHAIRS IN OPERATION
                  </span>
                </div>
              </div>

              {/* 3 Active Chairs in Salon */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", margin: "20px 0" }}>
                <div style={{ background: "#26221f", border: "1px solid rgba(255,255,255,0.08)", padding: "16px", borderRadius: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "14px", color: "#fff" }}>Chair 01</strong>
                    <span style={{ fontSize: "11px", color: "#4c805e", fontWeight: 700 }}>● SERVING</span>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8dfd5" }}>Stylist: Rahul Sharma</div>
                  <div style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>Client: #S104 (Fade & Beard)</div>
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
                    onClick={() => notify("Calling customer #A07 to Chair 02 via SMS and WhatsApp push!")}
                  >
                    Call Next Token #A07 ↗
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
                  <small style={{ fontSize: "11px", color: "#aaa" }}>Clients Served Today</small>
                  <strong style={{ fontSize: "22px", color: "#fff" }}>28</strong>
                </div>
                <div className="metric">
                  <small style={{ fontSize: "11px", color: "#aaa" }}>Live Queue Waiting</small>
                  <strong style={{ fontSize: "22px", color: "#d4a17b" }}>3</strong>
                </div>
                <div className="metric">
                  <small style={{ fontSize: "11px", color: "#aaa" }}>Daily Service Revenue</small>
                  <strong style={{ fontSize: "22px", color: "#fff" }}>₹6,450</strong>
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

        {/* ─── 7. VERIFIED REVIEWS & SNEPR POINTS ─── */}
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
                <p>Customer rewards in Bhubaneswar are tied directly to verified completed visits, never manipulated ratings.</p>
                <div className="wallet">
                  <img
                    src="/snepr-logo-square.png"
                    alt="Snepr Points"
                    className="w-10 h-10 mx-auto mb-2 rounded-full shadow-md"
                  />
                  <small style={{ fontSize: "11px", letterSpacing: ".15em", color: "#6b5e52", fontWeight: 700 }}>
                    DEMO WALLET
                  </small>
                  <br />
                  <strong style={{ fontSize: "28px", color: "#1d1b17" }}>₹0</strong>
                  <div className="stars" style={{ fontSize: "18px", color: "#c69a5c", margin: "6px 0" }}>★★★★★</div>
                  <button
                    className="btn fill"
                    id="reviewBtn"
                    onClick={() => notify("Verified review engine active. Tokens earn 10 Snepr Points upon completed visit!")}
                  >
                    Submit demo review
                  </button>
                  <p id="reviewMsg" style={{ margin: "14px 0 0", fontSize: "12px", color: "#5c4f44", fontWeight: 500 }}>
                    Choose any rating. You earn 10 points either way.
                  </p>
                </div>
              </div>

              <div className="point-rules">
                <div className="rule">
                  <b>01</b>
                  <span>Only customers with completed digital tokens can leave verified reviews.</span>
                </div>
                <div className="rule">
                  <b>02</b>
                  <span>Each eligible review earns 10 Snepr Points. 1 point = ₹1 discount.</span>
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

        {/* ─── 8. FREQUENTLY ASKED QUESTIONS ─── */}
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
                Everything you need to know about salon discovery, live queues, and SalonOS in Bhubaneswar.
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
                  Salon owners can visit our dedicated <a href="/pricing" style={{ color: "var(--brown)", fontWeight: 700 }}>SalonOS Pricing page</a> to register their salon, select a monthly plan, and get a digital QR standee with zero haircut commissions.
                </p>
              </details>
              <details>
                <summary>How do I redeem Snepr Points for discounts?</summary>
                <p>
                  When you arrive at the salon for your appointment, simply present your token. Points earned from previous verified visits apply directly toward your bill.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* ─── 9. FINAL CALL TO ACTION ─── */}
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
              Find the best salons in Bhubaneswar and check live queues before stepping out. Salon owners can list, claim, or explore SalonOS.
            </p>
            <div className="final-actions">
              <a className="btn fill" href="#discover">
                Find a salon near you ↗
              </a>
              <a className="btn" href="/pricing">
                Register your salon
              </a>
              <a className="btn" href="/pricing">
                Explore SalonOS pricing
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── 10. LUXURY DARK FOOTER WITH REAL LOGO & INSTAGRAM ─── */}
      <footer id="footer">
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <img
                src="/snepr-logo-white-transparent.png"
                alt="Snepr"
                className="foot-brand-logo"
              />
              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#d0c8be", maxWidth: "240px" }}>
                Live salon queues and waiting times in Bhubaneswar.<br />
                Know before you go.
              </p>
              {/* Real Instagram Button with Official SVG Icon */}
              <div style={{ marginTop: "18px" }}>
                <a
                  href="https://www.instagram.com/snepr.app/"
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
                  <span>Follow @snepr.app</span>
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
              <a href="/pricing">SalonOS plans</a>
              <a href="/pricing">Zero commission pricing</a>
              <a href="/pricing#calc">Economics calculator</a>
              <a href="/login">Salon desk login</a>
              <a href="/pricing">Register a salon</a>
            </div>

            <div className="foot-col">
              <b>Company</b>
              <a href="#top">About Snepr</a>
              <a href="#contact">Contact</a>
              <a href="#faq">Help center</a>
            </div>

            <div className="foot-col">
              <b>Legal and socials</b>
              <a href="/refund-policy">Privacy policy</a>
              <a href="/partner-terms">Terms of service</a>
              <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
                <a
                  href="https://www.instagram.com/snepr.app/"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  style={{ color: "#d4a17b", display: "inline-block" }}
                >
                  <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Twitter"
                  style={{ color: "#d4a17b", display: "inline-block" }}
                >
                  <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn"
                  style={{ color: "#d4a17b", display: "inline-block" }}
                >
                  <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="foot-bottom">
            <span>© 2026 Snepr Technologies Inc. | Bhubaneswar, Odisha</span>
            <span>Crafted for Bhubaneswar</span>
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
'''

with open('src/routes/_marketing/index.tsx', 'w', encoding='utf-8') as f:
    f.write(homepage_code)

print("Generated enhanced homepage in src/routes/_marketing/index.tsx! Length:", len(homepage_code))
