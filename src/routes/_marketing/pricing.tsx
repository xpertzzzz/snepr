import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import "@/styles/snepr-final.css";

export const Route = createFileRoute("/_marketing/pricing")({
  head: () => ({
    title: "SalonOS Pricing and Plans | Snepr | Zero Haircut Commission SaaS for Salons",
    meta: [
      {
        name: "description",
        content:
          "Predictable flat monthly SaaS pricing for barbers and salon owners in Bhubaneswar. Starting at ₹199 per month. Zero haircut commissions, live chair queue management, and customer loyalty.",
      },
      {
        name: "keywords",
        content:
          "Salon software Bhubaneswar, SalonOS pricing, Barber queue management, Salon SaaS, Zero commission salon app, Bhubaneswar salon management",
      },
      { property: "og:title", content: "SalonOS Pricing and Plans | Snepr | Flat Monthly Subscriptions" },
      {
        property: "og:description",
        content:
          "Keep 100% of your haircut and salon revenue. Flat monthly plans for salons in Bhubaneswar starting at ₹199 per month.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://snepr.com/pricing" },
      { property: "og:locale", content: "en_IN" },
      { name: "theme-color", content: "#f5f1e9" },
    ],
  }),
  component: SneprPricingPage,
});

function money(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function SneprPricingPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });
  const toastTimeoutRef = useRef<number | null>(null);

  const notify = (msg: string) => {
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    setToast({ msg, show: true });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  // Economics Calculator state
  const [customers, setCustomers] = useState(35);
  const [ticket, setTicket] = useState(350);
  const [days, setDays] = useState(26);
  const [rate, setRate] = useState(25);

  const revenue = customers * ticket * days;
  const commission = (revenue * rate) / 100;
  const saving = commission - 400;

  return (
    <>
      {/* ─── PRICING HEADER ─── */}
      <header className="hero" style={{ minHeight: "auto", paddingBottom: "70px", borderRadius: "0 0 5% 5%" }}>
        <div className="hero-head">
          <a className="brand" href="/" aria-label="Snepr home">
            <img src="/snepr-logo-transparent.png" alt="Snepr" />
          </a>
          <nav className={`hero-nav ${navOpen ? "open" : ""}`} id="navlinks">
            <a href="/" onClick={() => setNavOpen(false)}>
              Home
            </a>
            <a href="/#discover" onClick={() => setNavOpen(false)}>
              Explore Salons
            </a>
            <a href="/#how" onClick={() => setNavOpen(false)}>
              How it works
            </a>
            <a href="/#ai" onClick={() => setNavOpen(false)}>
              AI Studio
            </a>
            <a href="/pricing" style={{ color: "var(--brown)", fontWeight: 700 }} onClick={() => setNavOpen(false)}>
              Pricing
            </a>
          </nav>
          <div className="head-actions">
            <a className="btn" href="/login">
              Sign in
            </a>
            <a className="btn fill" href="#plans">
              Choose a Plan ↗
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

        <div className="hero-main" style={{ padding: "40px 20px 20px" }}>
          <div className="hero-content">
            <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700, letterSpacing: "0.15em" }}>
              SalonOS Pricing | Bhubaneswar
            </div>
            <h1 style={{ fontSize: "clamp(48px, 8vw, 92px)", lineHeight: 0.95 }}>
              Predictable pricing.<br />
              <span>Zero haircut commissions.</span>
            </h1>
            <p className="hero-desc" style={{ fontSize: "18px", lineHeight: "1.7", color: "#3d322a", fontWeight: 500 }}>
              Keep 100% of your service earnings. Transparent monthly software subscriptions designed for single barbers, neighborhood salons, and multi chair studios across Bhubaneswar.
            </p>
            <div className="hero-ctas">
              <a className="btn fill" href="#plans">
                View monthly plans ↗
              </a>
              <a className="btn" href="#calc">
                Calculate savings calculator
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ─── PRICING PLANS SECTION ─── */}
      <main>
        <section className="section" id="plans" style={{ paddingTop: "60px" }}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                  SalonOS Monthly Plans
                </div>
                <h2>
                  Simple pricing.<br />
                  <em>No haircut commissions.</em>
                </h2>
              </div>
              <p style={{ fontSize: "16px", color: "#4a3e35", fontWeight: 500 }}>
                Flat monthly software subscription. Never pay a percentage of your clients bills or haircuts.
              </p>
            </div>

            {/* Zero Customer Fees Guarantee Banner */}
            <div style={{
              background: "#efe7dc",
              border: "1px solid #ddd3c5",
              borderRadius: "16px",
              padding: "16px 22px",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "13px",
              color: "#3d322a",
              lineHeight: 1.5
            }}>
              <span style={{ fontSize: "20px" }}>🛡️</span>
              <div>
                <strong style={{ color: "#1c1613" }}>Customer Queue Access is 100% Free on All Plans:</strong> Customers browsing Bhubaneswar salons, viewing live chair availability, tracking wait times, and receiving turn alerts are never charged.
              </div>
            </div>

            <div className="pricing">
              {/* Base Plan */}
              <article className="plan">
                <div className="plan-tag">Base | 1 chair</div>
                <h3>Single barber</h3>
                <p style={{ fontSize: "14px", color: "#4a3e35", lineHeight: "1.6" }}>
                  For independent barbers and single chair studios.
                </p>
                <div className="plan-price" style={{ fontSize: "38px" }}>
                  ₹199 <small style={{ fontSize: "14px" }}>/ month</small>
                </div>
                <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#2b211a" }}>
                  <li>One active stylist chair</li>
                  <li>Live chair countdown</li>
                  <li>Digital queue and token routing</li>
                  <li>Official QR code standee</li>
                  <li>Basic customer SMS alerts</li>
                  <li>Verified customer reviews</li>
                  <li>Zero commissions deducted</li>
                </ul>
                <button
                  className="btn"
                  onClick={() => notify("Base plan registration opened. Please sign in or register your salon.")}
                >
                  Start with Base ↗
                </button>
              </article>

              {/* Intermediate Plan (Most popular) */}
              <article className="plan popular">
                <div className="plan-tag" style={{ color: "#e8b896", fontWeight: 800 }}>Most popular | Up to 3 chairs</div>
                <h3 style={{ color: "#ffffff" }}>Intermediate</h3>
                <p style={{ fontSize: "14px", color: "#e8dfd5", lineHeight: "1.6" }}>
                  For growing neighbourhood salons in Bhubaneswar.
                </p>
                <div className="plan-price" style={{ fontSize: "38px", color: "#ffffff" }}>
                  ₹400 <small style={{ fontSize: "14px", color: "#d0c8be" }}>/ month</small>
                </div>
                <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#f5eee6" }}>
                  <li>Everything in Base plan</li>
                  <li>Multiple staff and barber logins</li>
                  <li>Multi barber queue routing</li>
                  <li>WhatsApp queue status notifications</li>
                  <li>Snepr Points loyalty listing</li>
                  <li>Peak hour traffic analytics</li>
                  <li>Wait duration tracking</li>
                  <li>Zero commission on service revenue</li>
                </ul>
                <button
                  className="btn fill"
                  style={{ backgroundColor: "#c8993e", color: "#1B1410", borderColor: "#c8993e", fontWeight: 700 }}
                  onClick={() => notify("Intermediate plan selected. Redirecting to partner registration...")}
                >
                  Choose Intermediate ↗
                </button>
              </article>

              {/* Pro Plan */}
              <article className="plan">
                <div className="plan-tag">Pro | Unlimited chairs</div>
                <h3>Pro</h3>
                <p style={{ fontSize: "14px", color: "#4a3e35", lineHeight: "1.6" }}>
                  For larger salons and multi chair operations.
                </p>
                <div className="plan-price" style={{ fontSize: "38px" }}>
                  ₹449 <small style={{ fontSize: "14px" }}>/ month</small>
                </div>
                <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#2b211a" }}>
                  <li>Everything in Intermediate</li>
                  <li>Advanced AI Studio integration</li>
                  <li>Stylist performance and revenue reporting</li>
                  <li>Multi branch salon support</li>
                  <li>Featured placement in Explore discovery</li>
                  <li>Dedicated account manager</li>
                  <li>24/7 priority partner support</li>
                </ul>
                <button
                  className="btn"
                  onClick={() => notify("Pro plan selected. Our Bhubaneswar partner team will connect with you.")}
                >
                  Go Pro ↗
                </button>
              </article>
            </div>

            <p className="sample-note" style={{ marginTop: "20px" }}>
              ALL PLANS INCLUDE: Free digital onboarding, custom QR standee, verified review badge, and zero haircut commission guarantees.
            </p>

            {/* ─── CUSTOMER AI STUDIO TOKEN WALLET PACK ─── */}
            <div style={{
              background: "#1c1613",
              color: "#ffffff",
              borderRadius: "28px",
              padding: "36px 32px",
              marginTop: "48px",
              border: "1px solid #382f28",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "28px",
              alignItems: "center"
            }}>
              <div>
                <span style={{
                  background: "#2c241f",
                  color: "#d4a17b",
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  padding: "4px 12px",
                  borderRadius: "99px",
                  display: "inline-block",
                  marginBottom: "12px"
                }}>
                  Customer AI Studio Pack
                </span>
                <h3 style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff", margin: "0 0 10px 0" }}>
                  ₹17 for 11,000 Studio Tokens
                </h3>
                <p style={{ fontSize: "14px", color: "#d8cebf", lineHeight: 1.7, margin: 0, maxWidth: "480px" }}>
                  Generate high-fidelity virtual hairstyle and beard trims with identity preservation. Tokens never expire and independently unlock full Pro-quality AI previews regardless of the salon plan.
                </p>
              </div>

              <div style={{
                background: "#28201a",
                border: "1px solid #45372d",
                borderRadius: "20px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#e8dfd5" }}>
                  <span>Cost per style preview:</span>
                  <strong style={{ color: "#d4a17b" }}>1,000 tokens (~₹1.50)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#e8dfd5" }}>
                  <span>AI Engine Tier:</span>
                  <strong style={{ color: "#d4a17b" }}>Pro Ultra-Res (No Downscaling)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#e8dfd5" }}>
                  <span>Double-charge guarantee:</span>
                  <strong style={{ color: "#68d391" }}>Never double-charged</strong>
                </div>

                <a
                  href="/live/studio"
                  style={{
                    display: "inline-block",
                    textAlign: "center",
                    background: "#d4a17b",
                    color: "#1c1613",
                    fontWeight: 700,
                    fontSize: "13px",
                    padding: "12px 20px",
                    borderRadius: "99px",
                    textDecoration: "none",
                    marginTop: "6px"
                  }}
                >
                  Open Snepr AI Studio ↗
                </a>
              </div>
            </div>

            {/* ─── SALON ECONOMICS CALCULATOR ─── */}
            <div className="calc" id="calc" style={{ marginTop: "60px" }}>
              <div className="eyebrow" style={{ color: "#80543a", fontWeight: 800 }}>
                Interactive ROI Calculator
              </div>
              <h3 style={{ color: "#1d1b17" }}>Salon economics</h3>
              <p style={{ fontSize: "16px", color: "#4a3e35" }}>
                Compare what 15 to 25 percent aggregator commission platforms cost you versus flat Snepr SalonOS.
              </p>

              <div className="calc-grid">
                <div className="field">
                  <label style={{ fontSize: "14px", fontWeight: 700, color: "#211812" }}>
                    Average daily customers <b id="custVal" style={{ color: "#80543a" }}>{customers}</b>
                  </label>
                  <input
                    id="customers"
                    type="range"
                    min="5"
                    max="100"
                    value={customers}
                    onChange={(e) => setCustomers(Number(e.target.value))}
                    aria-label="Average daily customers"
                  />
                </div>
                <div className="field">
                  <label style={{ fontSize: "14px", fontWeight: 700, color: "#211812" }}>
                    Average service ticket <b id="ticketVal" style={{ color: "#80543a" }}>{money(ticket)}</b>
                  </label>
                  <input
                    id="ticket"
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={ticket}
                    onChange={(e) => setTicket(Number(e.target.value))}
                    aria-label="Average service ticket"
                  />
                </div>
                <div className="field">
                  <label style={{ fontSize: "14px", fontWeight: 700, color: "#211812" }}>
                    Working days per month <b id="daysVal" style={{ color: "#80543a" }}>{days}</b>
                  </label>
                  <input
                    id="days"
                    type="range"
                    min="10"
                    max="31"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    aria-label="Working days per month"
                  />
                </div>
              </div>

              <div className="field" style={{ marginTop: "24px" }}>
                <label style={{ fontSize: "14px", fontWeight: 700, color: "#211812" }}>
                  Comparison commission rate <b id="rateVal" style={{ color: "#80543a" }}>{rate}%</b>
                </label>
                <input
                  id="rate"
                  type="range"
                  min="5"
                  max="35"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  aria-label="Comparison commission rate"
                />
              </div>

              <div className="result" style={{ background: "#1c1917", color: "#ffffff", padding: "24px", borderRadius: "20px" }}>
                <div>
                  <small style={{ fontSize: "12px", color: "#d0c8be", fontWeight: 700 }}>Estimated monthly revenue</small>
                  <strong id="revenue" style={{ fontSize: "28px", color: "#ffffff" }}>{money(revenue)}</strong>
                </div>
                <div>
                  <small style={{ fontSize: "12px", color: "#fca5a5", fontWeight: 700 }}>Modelled commission loss</small>
                  <strong id="commission" style={{ fontSize: "28px", color: "#f87171" }}>
                    {money(commission)}
                  </strong>
                </div>
                <div>
                  <small style={{ fontSize: "12px", color: "#86efac", fontWeight: 700 }}>Modelled difference retained</small>
                  <strong id="saving" style={{ fontSize: "28px", color: "#4ade80" }}>
                    {money(saving)}
                  </strong>
                </div>
              </div>

              <p style={{ margin: "16px 0 0", fontSize: "13px", color: "#5c4f44", fontWeight: 500 }}>
                Illustrative model based on your inputs. Monthly revenue = daily clients × ticket × days. Difference = commission lost on aggregator platforms minus Snepr flat subscription (₹400 per month).
              </p>
            </div>

            {/* ─── SIDE BY SIDE COMPARISON TABLE ─── */}
            <div style={{ marginTop: "60px" }}>
              <div className="section-head" style={{ marginBottom: "24px" }}>
                <div>
                  <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                    Direct Comparison
                  </div>
                  <h2>
                    Why salons choose <em>SalonOS.</em>
                  </h2>
                </div>
              </div>

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
                    <td>Pricing model</td>
                    <td>15% to 25% of every booking</td>
                    <td>Fixed monthly subscription (from ₹199 per month)</td>
                  </tr>
                  <tr>
                    <td>Service revenue</td>
                    <td>Commission deducted from each cut</td>
                    <td>Keep 100% of all cash, UPI, and card payments</td>
                  </tr>
                  <tr>
                    <td>Customer relationship</td>
                    <td>Customer data owned by platform</td>
                    <td>Direct relationship between salon and client</td>
                  </tr>
                  <tr>
                    <td>Queue visibility</td>
                    <td>Rigid appointment slots or walk in chaos</td>
                    <td>Chair level live queue and live countdown</td>
                  </tr>
                  <tr>
                    <td>Client accessibility</td>
                    <td>Mandatory app download required</td>
                    <td>Instant browser access, no download needed</td>
                  </tr>
                  <tr>
                    <td>Setup and standees</td>
                    <td>Generic listing</td>
                    <td>Custom QR standee for walk in self check in</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ─── PRICING FAQ ─── */}
            <div className="faq-list" style={{ marginTop: "60px" }}>
              <div className="section-head" style={{ marginBottom: "20px" }}>
                <div>
                  <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
                    Owner FAQ
                  </div>
                  <h2>Questions about <em>plans and billing.</em></h2>
                </div>
              </div>

              <details>
                <summary>Is there really zero commission on haircuts?</summary>
                <p>
                  Yes. Snepr SalonOS operates on a pure SaaS subscription. Whether you do 10 haircuts a day or 100 haircuts a day, Snepr never takes a single rupee from your service earnings.
                </p>
              </details>

              <details>
                <summary>Can I switch between Base, Intermediate, and Pro?</summary>
                <p>
                  Yes, you can upgrade or downgrade your plan at any time based on seasonal chair requirements or expansion.
                </p>
              </details>

              <details>
                <summary>Do I need special hardware to run SalonOS?</summary>
                <p>
                  No special POS hardware is required. SalonOS runs smoothly on any smartphone, tablet, laptop, or desktop computer via your web browser.
                </p>
              </details>

              <details>
                <summary>How does the physical QR code standee work?</summary>
                <p>
                  We provide a custom tabletop QR standee for your reception desk. Walk in customers scan the QR code to take their digital token without crowding the waiting area.
                </p>
              </details>

              <details>
                <summary>Can I test SalonOS before committing?</summary>
                <p>
                  Yes. We offer a 14 day risk free preview for salons in Bhubaneswar. Our local team assists with staff training and standee setup.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="final-cta" style={{ marginTop: "60px" }}>
          <div className="wrap">
            <div className="eyebrow" style={{ color: "#80543a", fontWeight: 700 }}>
              Zero commission | Total control
            </div>
            <h2>
              Ready to modernize<br />
              <em>your salon operations?</em>
            </h2>
            <p>
              Join top barber shops and premium salons in Bhubaneswar using SalonOS. Setup takes less than 10 minutes.
            </p>
            <div className="final-actions">
              <a
                className="btn fill"
                href="/login"
                onClick={() => notify("Opening partner onboarding...")}
              >
                Register your salon ↗
              </a>
              <a className="btn" href="/#discover">
                Explore live customer experience
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── LUXURY DARK FOOTER WITH REAL LOGO & INSTAGRAM ─── */}
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
              {/* Real Instagram Button with Official SVG Icon */}
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
              <a href="/#discover">Explore salons</a>
              <a href="/#discover">Live queues</a>
              <a href="/#how">How it works</a>
              <a href="/#ai">AI Studio</a>
              <a href="/#points">Snepr Points</a>
            </div>

            <div className="foot-col">
              <b>Salon owners</b>
              <a href="/pricing">SalonOS plans</a>
              <a href="/pricing">Zero commission pricing</a>
              <a href="#calc">Economics calculator</a>
              <a href="/login">Salon desk login</a>
            </div>

            <div className="foot-col">
              <b>Company</b>
              <a href="/">About Snepr</a>
              <a href="/#contact">Contact</a>
              <a href="/#faq">Help center</a>
            </div>

            <div className="foot-col">
              <b>Legal and socials</b>
              <a href="/refund-policy">Privacy policy</a>
              <a href="/partner-terms">Terms of service</a>
              <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
                <a
                  href="https://www.instagram.com/sneprofficial/"
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
            <span>© 2026 Snepr | Bhubaneswar, Odisha</span>
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
