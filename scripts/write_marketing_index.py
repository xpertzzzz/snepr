import sys
sys.stdout.reconfigure(encoding='utf-8')

react_code = '''import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import "@/styles/snepr-final.css";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    title: "sn≡pr — Know Before You Go",
    meta: [
      {
        name: "description",
        content:
          "Check live chair wait times from home. Save your place remotely and arrive when your barber is ready. Know before you go.",
      },
      { name: "theme-color", content: "#f5f1e9" },
    ],
  }),
  component: SneprLandingPage,
});

interface SalonItem {
  name: string;
  area: string;
  type: "Men's" | "Unisex" | "Premium";
  rating: number;
  free: string;
  queue: number;
  wait: number;
  letter: string;
}

const INITIAL_SALONS: SalonItem[] = [
  { name: 'The Scissors Edge', area: 'Saheed Nagar', type: 'Unisex', rating: 4.8, free: '2 of 3 chairs free', queue: 1, wait: 5, letter: 'T' },
  { name: 'Urban Look Salon', area: 'Jaydev Vihar', type: "Men's", rating: 4.6, free: '1 of 2 chairs free', queue: 3, wait: 10, letter: 'U' },
  { name: 'Style Studio by Jawed Habib', area: 'Patia', type: 'Premium', rating: 4.7, free: 'All chairs busy', queue: 5, wait: 15, letter: 'S' },
  { name: 'Lakmé Salon', area: 'Patia', type: 'Unisex', rating: 4.9, free: '2 chairs free', queue: 0, wait: 0, letter: 'L' },
  { name: 'NVN Unisex Salon', area: 'Patia', type: 'Unisex', rating: 4.6, free: '1 chair free', queue: 2, wait: 5, letter: 'N' },
  { name: 'Green Trends Salon', area: 'Patia', type: 'Unisex', rating: 4.7, free: '1 chair free', queue: 4, wait: 12, letter: 'G' }
];

function money(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function SneprLandingPage() {
  // Mobile nav state
  const [navOpen, setNavOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });
  const toastTimeoutRef = useRef<number | null>(null);

  const notify = (msg: string) => {
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    setToast({ msg, show: true });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Salons filter state
  const [currentFilter, setCurrentFilter] = useState('All');
  const [selectedArea, setSelectedArea] = useState('Patia, Bhubaneswar');
  const [locating, setLocating] = useState(false);

  // Phone demo tabs & token
  const [demoTab, setDemoTab] = useState<'customer' | 'desk'>('customer');
  const [tokenGenerated, setTokenGenerated] = useState(false);

  // Economics Calculator state
  const [customers, setCustomers] = useState(35);
  const [ticket, setTicket] = useState(350);
  const [days, setDays] = useState(26);
  const [rate, setRate] = useState(25);

  const revenue = customers * ticket * days;
  const commission = (revenue * rate) / 100;
  const saving = commission - 400;

  // Filter salons
  const filteredSalons = () => {
    let list = [...INITIAL_SALONS];
    if (currentFilter === 'Shortest') {
      list.sort((a, b) => a.wait - b.wait);
    } else if (currentFilter === 'Top') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (currentFilter === 'Available') {
      list = list.filter(s => s.wait === 0 || !s.free.includes('All'));
    } else if (["Men's", "Unisex", "Premium"].includes(currentFilter)) {
      list = list.filter(s => s.type === currentFilter);
    }
    return list;
  };

  // Handle location
  const handleLocate = () => {
    if (!navigator.geolocation) {
      notify('Location is not available in this browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        notify('Location permission received. Nearby results need the live salon service.');
        setLocating(false);
      },
      () => {
        notify('Location unavailable. Choose your area instead.');
        setLocating(false);
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
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  // Scissor animation on scroll
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

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const len = path.getTotalLength();
      cut.style.strokeDasharray = String(len);
      cut.style.strokeDashoffset = '0';
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

      const stage = scene.querySelector('.cut-stage');
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
      progressBar.style.height = p * 100 + '%';
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

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    frame();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      {/* ─── HERO HEADER ─── */}
      <header className="hero" id="top">
        <div className="hero-head">
          <a className="brand" href="#top" aria-label="Snepr home">
            <img src="/snepr-logo-transparent.png" alt="sn≡pr" />
          </a>
          <nav className={`hero-nav ${navOpen ? 'open' : ''}`} id="navlinks">
            <a href="#discover" onClick={() => setNavOpen(false)}>Explore</a>
            <a href="#discover" onClick={() => setNavOpen(false)}>Live Queues</a>
            <a href="#ai" onClick={() => setNavOpen(false)}>AI Studio</a>
            <a href="#how" onClick={() => setNavOpen(false)}>How it works</a>
            <a href="#salons" onClick={() => setNavOpen(false)}>For Salons</a>
            <a href="#pricing" onClick={() => setNavOpen(false)}>Pricing</a>
          </nav>
          <div className="head-actions">
            <a className="btn" href="/login">Sign in</a>
            <a className="btn fill" href="#discover">Find a Salon ↗</a>
            <button className="menu" id="menu" aria-label="Open navigation" onClick={() => setNavOpen(!navOpen)}>
              ☰
            </button>
          </div>
        </div>

        <div className="hero-main">
          <div className="hero-content">
            <div className="eyebrow">Live salon discovery · Bhubaneswar</div>
            <h1>
              Never wait in line<br />
              <span>at a salon again.</span>
            </h1>
            <p className="hero-desc">
              Check live chair wait times from home. Save your place remotely and arrive when your barber is ready. Know before you go.
            </p>
            <div className="hero-ctas">
              <a className="btn fill" href="#discover">Find a salon near you ↗</a>
              <a className="btn" href="#discover">Explore live queues</a>
            </div>
            <a className="owner-link" href="#salons">For salon owners ↗</a>
          </div>
        </div>

        <div className="hero-art"></div>

        <div className="hero-bottom wrap">
          <span>sn≡pr · Bhubaneswar</span>
          <span className="scrollline">Scroll to explore</span>
          <span>Know before you go</span>
        </div>
      </header>

      {/* ─── SCISSOR STRAND SCENE ─── */}
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
            <svg className="hair-svg" viewBox="0 0 1000 590" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
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
                  <path className="scissor-metal" d="M68 94 Q105 62 171 12 Q183 4 187 15 Q190 24 178 31 L80 108" />
                </g>
                <g className="blade-b" id="bladeB" ref={bladeBRef}>
                  <circle className="scissor-metal" cx="48" cy="39" r="28" />
                  <circle className="scissor-dark" cx="48" cy="39" r="19" />
                  <path className="scissor-metal" d="M68 56 Q105 88 171 138 Q183 146 187 135 Q190 126 178 119 L80 42" />
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

      {/* ─── MAIN CONTENT ─── */}
      <main>
        {/* Intro strip */}
        <section className="intro-strip">
          <div className="wrap">
            <div className="eyebrow" style={{ color: '#d4a17b' }}>Live salon discovery</div>
            <h2>
              Salons near you,<br />
              <em>right now.</em>
            </h2>
            <p>Showing salons for Patia, Bhubaneswar. Check chair availability and wait estimates before you leave.</p>
          </div>
        </section>

        {/* Discover & Live Grid */}
        <section className="section" id="discover">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">⌕ &nbsp; Salons near you, right now</div>
                <h2>Find your <em>salon.</em></h2>
              </div>
              <div className="live-label">● LIVE QUEUE PREVIEW</div>
            </div>

            <div className="area-bar">
              <select
                className="area-select"
                id="area"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option>Patia, Bhubaneswar</option>
                <option>Saheed Nagar, Bhubaneswar</option>
                <option>Jaydev Vihar, Bhubaneswar</option>
                <option>Chandrasekharpur, Bhubaneswar</option>
                <option>KIIT Square, Bhubaneswar</option>
              </select>
              <button className="btn" id="locate" onClick={handleLocate}>
                {locating ? 'Locating…' : 'Use my location'}
              </button>
              <span className="live-label">● SAMPLE PREVIEW DATA</span>
            </div>

            <div className="filters" id="filters">
              {['All', 'Shortest', 'Available', 'Top', "Men's", 'Unisex', 'Premium'].map((f) => (
                <button
                  key={f}
                  className={`filter ${currentFilter === f ? 'active' : ''}`}
                  onClick={() => setCurrentFilter(f)}
                >
                  {f === 'All'
                    ? 'All salons'
                    : f === 'Shortest'
                    ? 'Shortest wait'
                    : f === 'Available'
                    ? 'Available now'
                    : f === 'Top'
                    ? 'Top rated'
                    : f}
                </button>
              ))}
            </div>

            <div className="salon-grid" id="salonGrid">
              {filteredSalons().map((s) => (
                <article className="salon" key={s.name}>
                  <div className="salon-top">
                    <div className="avatar flex items-center justify-center relative">
                      <span className="font-bold">{s.letter}</span>
                      <img
                        src="/snepr-logo-square-transparent.png"
                        alt="Verified"
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
                      <strong>{s.free.startsWith('All') ? '0' : s.free.split(' ')[0]}</strong>
                      <span>Chairs free</span>
                    </div>
                    <div>
                      <strong>{s.queue}</strong>
                      <span>In queue</span>
                    </div>
                    <div>
                      <strong>{s.wait} min</strong>
                      <span>Wait</span>
                    </div>
                  </div>
                  <div className="salon-foot">
                    <small>{s.free}</small>
                    <button
                      className="join"
                      data-salon={s.name}
                      onClick={() =>
                        notify('Demo preview only. Queue joining will be connected to the live service.')
                      }
                    >
                      Join queue ↗
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <p className="sample-note">
              SAMPLE DATA. In production, salon availability, distances and update times come from verified salon records and the live queue service.
            </p>
          </div>
        </section>

        {/* Live Simulator Preview */}
        <section className="section" style={{ paddingTop: '15px' }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">A closer look</div>
                <h2>
                  See the queue.<br />
                  <em>Feel in control.</em>
                </h2>
              </div>
              <p>Switch between the customer view and the salon desk. This preview does not create a real queue entry.</p>
            </div>

            <div className="demo reveal">
              <div className="tabs">
                <button
                  className={`tab ${demoTab === 'customer' ? 'active' : ''}`}
                  onClick={() => setDemoTab('customer')}
                >
                  Customer view
                </button>
                <button
                  className={`tab ${demoTab === 'desk' ? 'active' : ''}`}
                  onClick={() => setDemoTab('desk')}
                >
                  SalonOS desk
                </button>
              </div>

              <div className="demo-layout">
                <div className="demo-copy" id="demoCopy">
                  {demoTab === 'customer' ? (
                    <>
                      <div className="eyebrow">The customer side</div>
                      <h3>Choose your service. Know your place.</h3>
                      <p>
                        Pick a service, see its duration and price, then generate a demo token with queue position and estimated wait.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="eyebrow">The salon desk</div>
                      <h3>One view of the working day.</h3>
                      <p>
                        See active chairs, waiting customers and the next token in this illustrative SalonOS preview.
                      </p>
                    </>
                  )}
                </div>

                {/* Customer phone */}
                <div
                  className="phone"
                  id="customerDemo"
                  style={{ display: demoTab === 'customer' ? 'block' : 'none' }}
                >
                  <div className="phone-head">
                    <span className="flex items-center gap-1.5">
                      <img src="/snepr-logo-square-transparent.png" alt="Snepr" className="w-4 h-4 rounded-sm object-contain" />
                      <b>sn≡pr</b>
                    </span>
                    <span>● DEMO · SAMPLE SALON</span>
                  </div>
                  <div className="service">
                    <span>Haircut<small>25 min</small></span>
                    <b>₹150</b>
                  </div>
                  <div className="service">
                    <span>Beard trim<small>15 min</small></span>
                    <b>₹80</b>
                  </div>
                  <div className="service">
                    <span>Haircut + Beard<small>40 min</small></span>
                    <b>₹200</b>
                  </div>
                  <div className="service">
                    <span>Facial<small>35 min</small></span>
                    <b>₹350</b>
                  </div>
                  <button
                    className="btn fill"
                    style={{ width: '100%', marginTop: '18px' }}
                    id="tokenBtn"
                    onClick={() => {
                      setTokenGenerated(true);
                      notify('Demo token #A07 generated successfully!');
                    }}
                  >
                    {tokenGenerated ? 'Demo token generated' : 'Generate demo token'}
                  </button>
                  <div className={`demo-token ${tokenGenerated ? 'show' : ''}`} id="token">
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
                        <img src="/snepr-logo-square.png" alt="Token" className="w-3.5 h-3.5 rounded-full" />
                        Verified Digital Token
                      </span>
                      <span>Patia Studio</span>
                    </div>
                  </div>
                </div>

                {/* Desk phone */}
                <div
                  className="phone"
                  id="deskDemo"
                  style={{
                    display: demoTab === 'desk' ? 'block' : 'none',
                    background: '#24211d',
                    color: '#f5f1e9',
                  }}
                >
                  <div className="phone-head" style={{ borderColor: '#ffffff22' }}>
                    <span className="flex items-center gap-1.5">
                      <img src="/snepr-logo-square-transparent.png" alt="SalonOS" className="w-4 h-4 rounded-sm object-contain" />
                      <b>SalonOS · Overview</b>
                    </span>
                    <span style={{ color: '#d4a17b' }}>● DEMO DATA</span>
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
                  <p style={{ fontSize: '10px', color: '#b8afa3', lineHeight: 1.7, margin: '17px 0 0' }}>
                    A customer picks a service on Snepr and joins the queue for a chair.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
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
              <p>Three simple steps to make your salon visit easier.</p>
            </div>
            <div className="steps">
              <article className="step reveal">
                <span className="n">01</span>
                <h3>Check the wait</h3>
                <p>See live availability and wait estimates before you travel.</p>
              </article>
              <article className="step reveal delay">
                <span className="n">02</span>
                <h3>Save your chair</h3>
                <p>Select a service and join the digital queue from your phone.</p>
              </article>
              <article className="step reveal delay2">
                <span className="n">03</span>
                <h3>Walk straight in</h3>
                <p>Follow your token and arrive when your turn is close.</p>
              </article>
            </div>
          </div>
        </section>

        {/* AI Hair Studio */}
        <section className="ai-band" id="ai">
          <div className="wrap ai-layout">
            <div className="ai-copy reveal">
              <div className="eyebrow" style={{ color: '#d4a17b' }}>AI Hair Studio · Concept</div>
              <h2>
                Try the look<br />
                before the <em>cut.</em>
              </h2>
              <p>Explore hairstyles and prepare a clearer conversation with your barber.</p>
              <ul className="ai-list">
                <li>Hairstyle discovery and personalised suggestions</li>
                <li>Share a preferred style with your barber</li>
                <li>Connect styles to salon services and pricing</li>
              </ul>
              <a className="btn" href="#contact" style={{ borderColor: '#d4a17b', color: '#f5f1e9' }}>
                Join the AI Studio waitlist ↗
              </a>
              <p style={{ fontSize: '10px', color: '#8f877d', marginTop: '18px' }}>
                Illustrated concept only, not a real AI render. Capabilities are described only once they ship.
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

        {/* For Salon Owners · SalonOS */}
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
              <p>A salon operations system, separate from the free customer product. Follow one customer through a working day.</p>
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
                <b>Digital queue</b>Automatic tokens
              </div>
              <div className="owner-feature">
                <b>Chair availability</b>Service and staff assignment
              </div>
              <div className="owner-feature">
                <b>Customer history</b>Reviews and points
              </div>
              <div className="owner-feature">
                <b>Salon insights</b>Analytics and multi branch support
              </div>
            </div>
            <div className="owner-dashboard reveal">
              <div className="dash-top">
                <span className="flex items-center gap-2">
                  <img src="/snepr-logo-square-transparent.png" alt="SalonOS" className="w-5 h-5 rounded-sm object-contain" />
                  <b>SalonOS · Overview</b>
                </span>
                <span style={{ color: '#d4a17b' }}>● DEMO DATA</span>
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
            <p className="sample-note">
              Dashed or future capabilities are shown only if built in the backend. This is a visual product preview.
            </p>
          </div>
        </section>

        {/* Verified Reviews & Snepr Points */}
        <section className="section" id="points" style={{ paddingTop: '20px' }}>
          <div className="wrap">
            <div className="points reveal">
              <div>
                <div className="eyebrow">Verified reviews · Snepr Points</div>
                <h2>
                  Reviews you can trust.<br />
                  <em>Points you can spend.</em>
                </h2>
                <p>Rewards are tied to verified completed visits, not the rating a customer leaves.</p>
                <div className="wallet">
                  <img src="/snepr-logo-square.png" alt="Snepr Coin" className="w-7 h-7 mx-auto mb-1 rounded-full shadow-sm" />
                  <small style={{ fontSize: '9px', letterSpacing: '.15em', color: '#8b8176' }}>DEMO WALLET</small>
                  <br />
                  <strong>₹0</strong>
                  <div className="stars">★★★★★</div>
                  <button
                    className="btn fill"
                    id="reviewBtn"
                    onClick={() => notify('Demo only. Verified review submission is not connected yet.')}
                  >
                    Submit demo review
                  </button>
                  <p id="reviewMsg" style={{ margin: '12px 0 0', fontSize: '10px' }}>
                    Choose any rating. You earn 10 points either way.
                  </p>
                </div>
              </div>

              <div className="point-rules">
                <div className="rule">
                  <b>01</b>
                  <span>Only verified, completed customers can review.</span>
                </div>
                <div className="rule">
                  <b>02</b>
                  <span>Each eligible review earns 10 Snepr Points. 1 point = ₹1.</span>
                </div>
                <div className="rule">
                  <b>03</b>
                  <span>Points can be redeemed as a service discount, up to 20% of the bill.</span>
                </div>
                <div className="rule">
                  <b>04</b>
                  <span>The reward does not depend on the rating. One star earns the same as five.</span>
                </div>
                <p className="sample-note">
                  PROPOSED MODEL. Verification and redemption scope to be confirmed against the backend before launch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Economics Calculator */}
        <section className="section" id="pricing">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">SalonOS plans</div>
                <h2>
                  Simple pricing.<br />
                  <em>No haircut commissions.</em>
                </h2>
              </div>
              <p>Monthly plans. An annual option appears only once billing supports it.</p>
            </div>

            <div className="pricing">
              <article className="plan reveal">
                <div className="plan-tag">Base · 1 chair</div>
                <h3>Single barber</h3>
                <p>For independent barbers and single chair studios.</p>
                <div className="plan-price">₹199 <small>/ month</small></div>
                <ul>
                  <li>One active stylist chair</li>
                  <li>Real time chair countdown</li>
                  <li>Digital queue</li>
                  <li>QR standee</li>
                  <li>Basic customer alerts</li>
                  <li>Verified reviews</li>
                </ul>
                <a className="btn" href="#contact">Start with Base ↗</a>
              </article>

              <article className="plan popular reveal delay">
                <div className="plan-tag">Most popular · Up to 3 chairs</div>
                <h3>Intermediate</h3>
                <p>For growing neighbourhood salons.</p>
                <div className="plan-price">₹400 <small>/ month</small></div>
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
                <a className="btn" href="#contact">Choose Intermediate ↗</a>
              </article>

              <article className="plan reveal delay2">
                <div className="plan-tag">Pro · Unlimited chairs</div>
                <h3>Pro</h3>
                <p>For larger salons and multi chair operations.</p>
                <div className="plan-price">₹449 <small>/ month</small></div>
                <ul>
                  <li>Everything in Intermediate</li>
                  <li>Advanced AI Studio integration</li>
                  <li>Advanced analytics</li>
                  <li>Stylist performance</li>
                  <li>Revenue reporting</li>
                  <li>Featured Explore placement</li>
                  <li>Priority support</li>
                </ul>
                <a className="btn" href="#contact">Go Pro ↗</a>
              </article>
            </div>

            <p className="sample-note">Feature lists must match backend entitlements before launch.</p>

            {/* Economics Calculator */}
            <div className="calc reveal">
              <h3>Salon economics</h3>
              <p>See what commission based platforms could cost your salon.</p>

              <div className="calc-grid">
                <div className="field">
                  <label>
                    Average daily customers <b id="custVal">{customers}</b>
                  </label>
                  <input
                    id="customers"
                    type="range"
                    min="5"
                    max="100"
                    value={customers}
                    onChange={(e) => setCustomers(Number(e.target.value))}
                  />
                </div>
                <div className="field">
                  <label>
                    Average service ticket <b id="ticketVal">{money(ticket)}</b>
                  </label>
                  <input
                    id="ticket"
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={ticket}
                    onChange={(e) => setTicket(Number(e.target.value))}
                  />
                </div>
                <div className="field">
                  <label>
                    Working days per month <b id="daysVal">{days}</b>
                  </label>
                  <input
                    id="days"
                    type="range"
                    min="10"
                    max="31"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="field" style={{ marginTop: '24px' }}>
                <label>
                  Comparison commission rate <b id="rateVal">{rate}%</b>
                </label>
                <input
                  id="rate"
                  type="range"
                  min="5"
                  max="35"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
              </div>

              <div className="result">
                <div>
                  <small>Estimated monthly revenue</small>
                  <strong id="revenue">{money(revenue)}</strong>
                </div>
                <div>
                  <small>Modelled commission</small>
                  <strong id="commission">{money(commission)}</strong>
                </div>
                <div>
                  <small>Modelled difference</small>
                  <strong id="saving">{money(saving)}</strong>
                </div>
              </div>

              <p style={{ margin: '14px 0 0' }}>
                Illustrative model, not a guarantee of additional profit. Revenue = customers × ticket × days. Difference = modelled commission less subscription.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="reveal">
              <table className="compare">
                <thead>
                  <tr>
                    <th>Salon economics</th>
                    <th>Commission based platforms</th>
                    <th>Snepr SalonOS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Pricing</td>
                    <td>Percentage of bookings</td>
                    <td>Fixed monthly subscription</td>
                  </tr>
                  <tr>
                    <td>Service revenue</td>
                    <td>Commission varies</td>
                    <td>No percentage deducted under stated plans</td>
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
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq" style={{ paddingTop: '30px' }}>
          <div className="wrap faq">
            <div className="reveal">
              <div className="eyebrow">Help</div>
              <h2>
                Good to<br />
                <em>know.</em>
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.8 }}>
                Answers marked TBC need your real product rules before launch.
              </p>
            </div>
            <div className="faq-list reveal delay">
              <details>
                <summary>Do I need to download an app?</summary>
                <p>No. Customers can use Snepr in a browser. A native app can be offered when available.</p>
              </details>
              <details>
                <summary>How do I join a live queue?</summary>
                <p>Choose a salon and service, then join the digital queue where that salon has enabled queue joining.</p>
              </details>
              <details>
                <summary>How are wait times calculated?</summary>
                <p>Wait estimates should use the salon's active chairs, queue position and service duration. Actual wait can change as the salon operates.</p>
              </details>
              <details>
                <summary>Can I cancel my token?</summary>
                <p>Cancellation rules depend on the salon's configured queue policy. Confirm the final policy before launch.</p>
              </details>
              <details>
                <summary>How do I redeem Snepr Points?</summary>
                <p>Eligible points can be applied as a service discount under the proposed redemption rules. Final redemption flow is subject to backend support.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta" id="contact">
          <div className="wrap">
            <div className="eyebrow">Know before you go</div>
            <h2>
              Your time is worth<br />
              <em>more than a wait.</em>
            </h2>
            <p>Find a salon and check the queue. Owners can list, claim or explore SalonOS.</p>
            <div className="final-actions">
              <a className="btn fill" href="#discover">Find a salon near you ↗</a>
              <a className="btn" href="#salons">Register your salon</a>
              <a className="btn" href="#salons">Claim your salon</a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer id="footer">
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <img src="/snepr-logo-transparent.png" alt="sn≡pr" />
              <p>
                Live salon queues and wait times.<br />
                Know before you go.
              </p>
            </div>
            <div className="foot-col">
              <b>Customers</b>
              <a href="#discover">Explore salons</a>
              <a href="#discover">Live queues</a>
              <a href="#how">Join queue</a>
              <a href="#ai">AI Studio</a>
              <a href="#points">Snepr Points</a>
            </div>
            <div className="foot-col">
              <b>Salon owners</b>
              <a href="#salons">List your salon</a>
              <a href="#salons">Claim your salon</a>
              <a href="#salons">SalonOS</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Partner dashboard</a>
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
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Snepr Technologies Inc. · Bhubaneswar</span>
            <span>Made in Bhubaneswar</span>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''}`} id="toast" role="status" aria-live="polite">
        {toast.msg}
      </div>
    </>
  );
}
'''

with open('src/routes/_marketing/index.tsx', 'w', encoding='utf-8') as f:
    f.write(react_code)

print("Generated src/routes/_marketing/index.tsx successfully! Length:", len(react_code))
