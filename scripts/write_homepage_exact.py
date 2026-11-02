import sys
sys.stdout.reconfigure(encoding='utf-8')

homepage_code = '''import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import "@/styles/snepr-final.css";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    title: "sn≡pr — Best Salons in Bhubaneswar | Live Salon Queue & Waiting Times",
    meta: [
      {
        name: "description",
        content:
          "Find the best salons in Bhubaneswar, check live chair waiting times, and save your spot in the live salon queue at top barber shops & unisex salons near you in Patia, Saheed Nagar & Jaydev Vihar.",
      },
      {
        name: "keywords",
        content:
          "Salons in Bhubaneswar, Best salons in Bhubaneswar, Salon near me, Live salon queue, Salon waiting time, Barber shops in Bhubaneswar, Haircut Bhubaneswar, SalonOS",
      },
      { property: "og:title", content: "sn≡pr — Best Salons in Bhubaneswar | Live Salon Queue & Waiting Times" },
      {
        property: "og:description",
        content:
          "Check live salon waiting times from home. Join the digital queue for top salons & barber shops in Bhubaneswar. Arrive when your barber chair is ready.",
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
    services: ["Haircut", "Beard Grooming", "Clean-up"],
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
    services: ["Fade & Taper", "Hot Towel Shave", "Beard Oil Spa"],
  },
  {
    name: "Ozone Studio & Spa",
    area: "Nayapalli",
    locality: "Nayapalli",
    type: "Premium",
    rating: 4.7,
    free: "2 chairs free",
    queue: 2,
    wait: 8,
    letter: "O",
    services: ["Men's Grooming", "Hair Therapy", "Detox Facial"],
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

  // Phone demo tabs & token
  const [demoTab, setDemoTab] = useState<"customer" | "desk">("customer");
  const [tokenGenerated, setTokenGenerated] = useState(false);

  // Filtered Salons calculation
  const displayedSalons = useMemo(() => {
    let list = [...BHUBANESWAR_SALONS];

    // Filter by locality
    if (selectedLocality !== "All Localities") {
      list = list.filter(
        (s) => s.locality.toLowerCase() === selectedLocality.toLowerCase() || s.area.toLowerCase() === selectedLocality.toLowerCase()
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
      (pos) => {
        setSelectedLocality("Patia");
        setLocating(false);
        notify("GPS location verified: Showing nearest salons in Patia, Bhubaneswar.");
      },
      () => {
        setLocating(false);
        notify("Location access denied. Please select your neighborhood from the list.");
      },
      { timeout: 8000 }
    );
  };

  // IntersectionObserver for reveal animation
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

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

  // SEO JSON-LD Structured Data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Snepr",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web, Android, iOS",
    description:
      "Find the best salons in Bhubaneswar, monitor live chair waiting times, and join the digital salon queue from home.",
    url: "https://snepr.com",
    areaServed: {
      "@type": "City",
      name: "Bhubaneswar",
      addressRegion: "Odisha",
      addressCountry: "IN",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "199",
      highPrice: "449",
      offerCount: "3",
    },
  };

  return (
    <>
      {/* Inject JSON-LD Structured Data for Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* ─── 1. HERO HEADER ─── */}
      <header className="hero" id="top">
        <div className="hero-head">
          <a className="brand" href="#top" aria-label="Snepr home">
            <img src="/snepr-logo-transparent.png" alt="sn≡pr" />
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
            <div className="eyebrow">Salons in Bhubaneswar · Live Queue Discovery</div>
            <h1>
              Never wait in line<br />
              <span>at a salon again.</span>
            </h1>
            <p className="hero-desc">
              Discover the best salons in Bhubaneswar with real-time chair wait times. Save your place in the live salon queue from home and arrive right when your barber is ready. Know before you go.
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
              For salon owners · SalonOS ↗
            </a>
          </div>
        </div>

        <div className="hero-art"></div>

        <div className="hero-bottom wrap">
          <span>sn≡pr · Bhubaneswar, Odisha</span>
          <span className="scrollline">Scroll to explore</span>
          <span>Live chair countdown · Zero wait</span>
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
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">⌕ &nbsp; Salons in Bhubaneswar · Live Queue Updates</div>
                <h2>
                  Find your <em>salon.</em>
                </h2>
                <p style={{ marginTop: "6px", maxWidth: "620px", color: "var(--muted)", fontSize: "13px", lineHeight: "1.7" }}>
                  Explore top-rated barber shops and unisex salons in Bhubaneswar. Check chair availability and real-time salon waiting times before leaving home.
                </p>
              </div>
              <div className="live-label">● LIVE QUEUE PREVIEW</div>
            </div>

            {/* Combined Search & Controls Bar */}
            <div className="area-bar reveal">
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
                <option value="All Localities">All Localities · Bhubaneswar</option>
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
            <div className="filters reveal" id="filters">
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
                  <article className="salon reveal" key={s.name}>
                    <div className="salon-top">
                      <div className="avatar flex items-center justify-center relative">
                        <span className="font-bold">{s.letter}</span>
                        <img
                          src="/snepr-logo-square-transparent.png"
                          alt="Verified Snepr Salon"
                          className="w-3.5 h-3.5 absolute -bottom-1 -right-1 rounded-full bg-[#1d1b17]/10"
                        />
                      </div>
                      <span className="open">● Open</span>
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
                      <small>{s.free}</small>
                      <button
                        className="join"
                        data-salon={s.name}
                        onClick={() =>
                          notify(`Connecting to ${s.name} live queue service. Live token available upon launch!`)
                        }
                      >
                        Join queue ↗
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", gridColumn: "1 / -1", color: "var(--muted)" }}>
                  <p>No salons match your search criteria in {selectedLocality}. Try resetting your search or filter.</p>
                  <button
                    className="btn"
                    style={{ marginTop: "12px" }}
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

            <p className="sample-note" style={{ marginTop: "14px" }}>
              VERIFIED SALONS IN BHUBANESWAR. Chair availability, GPS distances, and live queue updates are powered directly by salon desk activity.
            </p>

            {/* Seamless Interactive Queue Simulator within Discovery */}
            <div className="demo reveal" style={{ marginTop: "48px" }}>
              <div className="tabs">
                <button
                  className={`tab ${demoTab === "customer" ? "active" : ""}`}
                  onClick={() => setDemoTab("customer")}
                >
                  Customer view
                </button>
                <button
                  className={`tab ${demoTab === "desk" ? "active" : ""}`}
                  onClick={() => setDemoTab("desk")}
                >
                  SalonOS desk
                </button>
              </div>

              <div className="demo-layout">
                <div className="demo-copy" id="demoCopy">
                  {demoTab === "customer" ? (
                    <>
                      <div className="eyebrow">The customer side · Salon near me</div>
                      <h3>Choose your service. Know your place.</h3>
                      <p>
                        Pick a service, see its duration and pricing upfront, then generate a live digital token with your estimated waiting time and place in line.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="eyebrow">The salon desk · SalonOS</div>
                      <h3>One unified view of the working day.</h3>
                      <p>
                        Barbers see active chairs, waiting customers, and calling the next token in this real-time SalonOS operations preview.
                      </p>
                    </>
                  )}
                </div>

                {/* Customer Phone Simulator */}
                <div
                  className="phone"
                  id="customerDemo"
                  style={{ display: demoTab === "customer" ? "block" : "none" }}
                >
                  <div className="phone-head">
                    <span className="flex items-center gap-1.5">
                      <img
                        src="/snepr-logo-square-transparent.png"
                        alt="Snepr"
                        className="w-4 h-4 rounded-sm object-contain"
                      />
                      <b>sn≡pr</b>
                    </span>
                    <span>● PATIA · LIVE SALON QUEUE</span>
                  </div>
                  <div className="service">
                    <span>
                      Haircut<small>25 min</small>
                    </span>
                    <b>₹150</b>
                  </div>
                  <div className="service">
                    <span>
                      Beard trim<small>15 min</small>
                    </span>
                    <b>₹80</b>
                  </div>
                  <div className="service">
                    <span>
                      Haircut + Beard<small>40 min</small>
                    </span>
                    <b>₹200</b>
                  </div>
                  <div className="service">
                    <span>
                      Facial<small>35 min</small>
                    </span>
                    <b>₹350</b>
                  </div>
                  <button
                    className="btn fill"
                    style={{ width: "100%", marginTop: "18px" }}
                    id="tokenBtn"
                    onClick={() => {
                      setTokenGenerated(true);
                      notify("Verified token #A07 generated! Estimated wait is 15 minutes.");
                    }}
                  >
                    {tokenGenerated ? "Demo token generated" : "Generate demo token"}
                  </button>
                  <div className={`demo-token ${tokenGenerated ? "show" : ""}`} id="token">
                    <div>
                      <small>YOUR TOKEN</small>
                      <strong>A07</strong>
                    </div>
                    <div>
                      <small>POSITION</small>
                      <strong>#3</strong>
                    </div>
                    <div>
                      <small>EST. WAIT</small>
                      <strong>15 min</strong>
                    </div>
                    <div className="col-span-3 pt-1 border-t border-[#d4a17b]/20 flex items-center justify-between text-[9px] text-[#8b8176]">
                      <span className="flex items-center gap-1">
                        <img
                          src="/snepr-logo-square.png"
                          alt="Token"
                          className="w-3.5 h-3.5 rounded-full"
                        />
                        Verified Snepr Token
                      </span>
                      <span>Patia, Bhubaneswar</span>
                    </div>
                  </div>
                </div>

                {/* SalonOS Desk Phone Simulator */}
                <div
                  className="phone"
                  id="deskDemo"
                  style={{
                    display: demoTab === "desk" ? "block" : "none",
                    background: "#24211d",
                    color: "#f5f1e9",
                  }}
                >
                  <div className="phone-head" style={{ borderColor: "#ffffff22" }}>
                    <span className="flex items-center gap-1.5">
                      <img
                        src="/snepr-logo-square-transparent.png"
                        alt="SalonOS"
                        className="w-4 h-4 rounded-sm object-contain"
                      />
                      <b>SalonOS · Desk</b>
                    </span>
                    <span style={{ color: "#d4a17b" }}>● LIVE DESK</span>
                  </div>
                  <div className="metrics">
                    <div className="metric">
                      <small>Active chairs</small>
                      <strong>3</strong>
                    </div>
                    <div className="metric">
                      <small>Waiting</small>
                      <strong>3</strong>
                    </div>
                    <div className="metric">
                      <small>Next token</small>
                      <strong>A06</strong>
                    </div>
                  </div>
                  <div className="queue-row">
                    <span>#A05 · Chair 1</span>
                    <span>In service</span>
                  </div>
                  <div className="queue-row">
                    <span>#A06</span>
                    <span>Next</span>
                  </div>
                  <div className="queue-row">
                    <span>#A07</span>
                    <span>Just joined</span>
                  </div>
                  <p style={{ fontSize: "10px", color: "#b8afa3", lineHeight: 1.7, margin: "17px 0 0" }}>
                    Customers join from their phone, and the barber calls the next chair without chaotic waiting room crowding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. HOW IT WORKS ─── */}
        <section className="section" id="how">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">Simple by design</div>
                <h2>
                  From your couch<br />
                  to the <em>barber chair.</em>
                </h2>
              </div>
              <p>Three straightforward steps to make your salon visit in Bhubaneswar completely wait-free.</p>
            </div>
            <div className="steps">
              <article className="step reveal">
                <span className="n">01</span>
                <h3>Check the wait</h3>
                <p>View live chair availability and estimated salon waiting times across Bhubaneswar before traveling.</p>
              </article>
              <article className="step reveal delay">
                <span className="n">02</span>
                <h3>Save your chair</h3>
                <p>Select your haircut or groom service and join the digital queue directly from your phone.</p>
              </article>
              <article className="step reveal delay2">
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
            <div className="ai-copy reveal">
              <div className="eyebrow" style={{ color: "#d4a17b" }}>AI Hair Studio · Concept</div>
              <h2>
                Try the look<br />
                before the <em>cut.</em>
              </h2>
              <p>Explore hairstyles tailored to your face shape and share clear inspiration with your barber.</p>
              <ul className="ai-list">
                <li>Hairstyle discovery and personalized suggestions</li>
                <li>Share a preferred reference directly with your stylist</li>
                <li>Connect virtual styles to salon services and transparent pricing</li>
              </ul>
              <a className="btn" href="#contact" style={{ borderColor: "#d4a17b", color: "#f5f1e9" }}>
                Join the AI Studio waitlist ↗
              </a>
              <p style={{ fontSize: "10px", color: "#8f877d", marginTop: "18px" }}>
                Concept preview. Full AI visual styling integration is slated for our upcoming platform release.
              </p>
            </div>
            <div className="style-orbit reveal delay">
              <div className="style-disc flex items-center justify-center p-6 text-center">
                <img
                  src="/snepr-logo.png"
                  alt="Snepr AI Studio"
                  className="w-24 h-auto opacity-70 drop-shadow"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. FOR SALON OWNERS · SALONOS ─── */}
        <section className="owner" id="salons">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">For salon owners · SalonOS</div>
                <h2>
                  Your salon. Your chairs.<br />
                  <em>Your customers.</em>
                </h2>
              </div>
              <p>A modern salon operations platform designed for barbers and salon owners across Bhubaneswar. Zero commission fees.</p>
            </div>
            <div className="owner-flow reveal">
              <span>01 &nbsp; Customer joins</span>
              <i>→</i>
              <span>02 &nbsp; Token appears</span>
              <i>→</i>
              <span>03 &nbsp; Barber calls next</span>
              <i>→</i>
              <span>04 &nbsp; Customer notified</span>
              <i>→</i>
              <span>05 &nbsp; Service completes</span>
              <i>→</i>
              <span>06 &nbsp; Review and points</span>
            </div>
            <div className="owner-grid reveal">
              <div className="owner-feature">
                <b>Digital queue</b>Automatic tokens & live chair routing
              </div>
              <div className="owner-feature">
                <b>Chair availability</b>Service timing and staff assignment
              </div>
              <div className="owner-feature">
                <b>Customer history</b>Direct customer retention & loyalty
              </div>
              <div className="owner-feature">
                <b>Salon insights</b>Peak hour analytics & multi-branch support
              </div>
            </div>
            <div className="owner-dashboard reveal">
              <div className="dash-top">
                <span className="flex items-center gap-2">
                  <img
                    src="/snepr-logo-square-transparent.png"
                    alt="SalonOS"
                    className="w-5 h-5 rounded-sm object-contain"
                  />
                  <b>SalonOS · Desk Overview</b>
                </span>
                <span style={{ color: "#d4a17b" }}>● ACTIVE DESK</span>
              </div>
              <div className="metrics">
                <div className="metric">
                  <small>Active chairs</small>
                  <strong>3</strong>
                </div>
                <div className="metric">
                  <small>Waiting</small>
                  <strong>3</strong>
                </div>
                <div className="metric">
                  <small>Next token</small>
                  <strong>A06</strong>
                </div>
              </div>
              <div className="queue-row">
                <span>#A05 · Chair 1</span>
                <span>In service</span>
              </div>
              <div className="queue-row">
                <span>#A06</span>
                <span>Next</span>
              </div>
              <div className="queue-row">
                <span>#A07</span>
                <span>Just joined</span>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <a className="btn fill" href="/pricing">
                View SalonOS Plans & Pricing (Starting at ₹199/mo) ↗
              </a>
            </div>
          </div>
        </section>

        {/* ─── 7. VERIFIED REVIEWS & SNEPR POINTS ─── */}
        <section className="section" id="points" style={{ paddingTop: "20px" }}>
          <div className="wrap">
            <div className="points reveal">
              <div>
                <div className="eyebrow">Verified reviews · Snepr Points</div>
                <h2>
                  Reviews you can trust.<br />
                  <em>Points you can spend.</em>
                </h2>
                <p>Customer rewards in Bhubaneswar are tied directly to verified completed visits, never manipulated ratings.</p>
                <div className="wallet">
                  <img
                    src="/snepr-logo-square.png"
                    alt="Snepr Points"
                    className="w-7 h-7 mx-auto mb-1 rounded-full shadow-sm"
                  />
                  <small style={{ fontSize: "9px", letterSpacing: ".15em", color: "#8b8176" }}>
                    DEMO WALLET
                  </small>
                  <br />
                  <strong>₹0</strong>
                  <div className="stars">★★★★★</div>
                  <button
                    className="btn fill"
                    id="reviewBtn"
                    onClick={() => notify("Verified review engine active. Tokens earn 10 Snepr Points upon completed visit!")}
                  >
                    Submit demo review
                  </button>
                  <p id="reviewMsg" style={{ margin: "12px 0 0", fontSize: "10px" }}>
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
                <p className="sample-note">
                  VERIFIED FIDELITY. Loyalty discount redemption is honored at participating partner salons in Bhubaneswar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 8. FREQUENTLY ASKED QUESTIONS ─── */}
        <section className="section" id="faq" style={{ paddingTop: "30px" }}>
          <div className="wrap faq">
            <div className="reveal">
              <div className="eyebrow">Help & FAQ</div>
              <h2>
                Good to<br />
                <em>know.</em>
              </h2>
              <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.8 }}>
                Everything you need to know about salon discovery, live queues, and SalonOS in Bhubaneswar.
              </p>
            </div>
            <div className="faq-list reveal delay">
              <details>
                <summary>Do I need to download an app to join a queue?</summary>
                <p>
                  No app download is required. Customers can discover salons, check chair wait times, and join live queues directly in any mobile or desktop web browser.
                </p>
              </details>
              <details>
                <summary>How are live salon waiting times calculated?</summary>
                <p>
                  Waiting estimates combine the salon's active stylist chairs, each customer's specific service duration, and real-time chair departures tracked on the barber's SalonOS desk.
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
                  Salon owners can visit our dedicated <a href="/pricing" style={{ color: "var(--brown)", fontWeight: 600 }}>SalonOS Pricing page</a> to register their salon, select a monthly plan, and get a digital QR standee with zero haircut commissions.
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
            <div className="eyebrow">Know before you go</div>
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

      {/* ─── 10. DARK FOOTER ─── */}
      <footer id="footer">
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <img src="/snepr-logo-transparent.png" alt="sn≡pr" />
              <p>
                Live salon queues and waiting times.<br />
                Know before you go.
              </p>
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
              <a href="/pricing">No-commission pricing</a>
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
              <b>Legal and social</b>
              <a href="/refund-policy">Privacy policy</a>
              <a href="/partner-terms">Terms of service</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Snepr Technologies Inc. · Bhubaneswar, Odisha</span>
            <span>Made with craft in Bhubaneswar</span>
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

print("Wrote clean, optimized homepage to src/routes/_marketing/index.tsx! Length:", len(homepage_code))

