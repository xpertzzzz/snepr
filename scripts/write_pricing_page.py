import sys
sys.stdout.reconfigure(encoding='utf-8')

pricing_code = '''import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import "@/styles/snepr-final.css";

export const Route = createFileRoute("/_marketing/pricing")({
  head: () => ({
    title: "SalonOS Pricing & Plans — Snepr | Zero Haircut Commission SaaS for Salons",
    meta: [
      {
        name: "description",
        content:
          "Predictable flat monthly SaaS pricing for barbers and salon owners in Bhubaneswar. Starting at ₹199/month. Zero haircut commissions, live chair queue management, and customer loyalty.",
      },
      {
        name: "keywords",
        content:
          "Salon software Bhubaneswar, SalonOS pricing, Barber queue management, Salon SaaS, No commission salon app, Bhubaneswar salon management",
      },
      { property: "og:title", content: "SalonOS Pricing & Plans — Snepr | Flat Monthly Subscriptions" },
      {
        property: "og:description",
        content:
          "Keep 100% of your haircut and salon revenue. Flat monthly plans for salons in Bhubaneswar starting at ₹199/mo.",
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

  // Reveal animation on scroll
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

  return (
    <>
      {/* ─── PRICING HEADER ─── */}
      <header className="hero" style={{ minHeight: "auto", paddingBottom: "70px", borderRadius: "0 0 5% 5%" }}>
        <div className="hero-head">
          <a className="brand" href="/" aria-label="Snepr home">
            <img src="/snepr-logo-transparent.png" alt="sn≡pr" />
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
            <div className="eyebrow">SalonOS Pricing · Bhubaneswar</div>
            <h1 style={{ fontSize: "clamp(48px, 8vw, 92px)", lineHeight: 0.95 }}>
              Predictable pricing.<br />
              <span>Zero haircut commissions.</span>
            </h1>
            <p className="hero-desc">
              Keep 100% of your service earnings. Transparent monthly software subscriptions designed for single barbers, neighborhood salons, and multi-chair studios across Bhubaneswar.
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
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">SalonOS Monthly Plans</div>
                <h2>
                  Simple pricing.<br />
                  <em>No haircut commissions.</em>
                </h2>
              </div>
              <p>
                Flat monthly software subscription. Never pay a percentage of your clients' bills or haircuts.
              </p>
            </div>

            <div className="pricing">
              {/* Base Plan */}
              <article className="plan reveal">
                <div className="plan-tag">Base · 1 chair</div>
                <h3>Single barber</h3>
                <p>For independent barbers and single chair studios.</p>
                <div className="plan-price">
                  ₹199 <small>/ month</small>
                </div>
                <ul>
                  <li>One active stylist chair</li>
                  <li>Real-time chair countdown</li>
                  <li>Digital queue & token routing</li>
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
              <article className="plan popular reveal delay">
                <div className="plan-tag">Most popular · Up to 3 chairs</div>
                <h3>Intermediate</h3>
                <p>For growing neighbourhood salons in Bhubaneswar.</p>
                <div className="plan-price">
                  ₹400 <small>/ month</small>
                </div>
                <ul>
                  <li>Everything in Base plan</li>
                  <li>Multiple staff & barber logins</li>
                  <li>Multi-barber queue routing</li>
                  <li>WhatsApp queue status notifications</li>
                  <li>Snepr Points loyalty listing</li>
                  <li>Peak hour traffic analytics</li>
                  <li>Wait duration tracking</li>
                  <li>Zero commission on service revenue</li>
                </ul>
                <button
                  className="btn fill"
                  onClick={() => notify("Intermediate plan selected. Redirecting to partner registration...")}
                >
                  Choose Intermediate ↗
                </button>
              </article>

              {/* Pro Plan */}
              <article className="plan reveal delay2">
                <div className="plan-tag">Pro · Unlimited chairs</div>
                <h3>Pro</h3>
                <p>For larger salons and multi-chair operations.</p>
                <div className="plan-price">
                  ₹449 <small>/ month</small>
                </div>
                <ul>
                  <li>Everything in Intermediate</li>
                  <li>Advanced AI Studio integration</li>
                  <li>Stylist performance & revenue reporting</li>
                  <li>Multi-branch salon support</li>
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

            <p className="sample-note" style={{ marginTop: "16px" }}>
              ALL PLANS INCLUDE: Free digital onboarding, custom QR standee, verified review badge, and zero haircut commission guarantees.
            </p>

            {/* ─── SALON ECONOMICS CALCULATOR ─── */}
            <div className="calc reveal" id="calc" style={{ marginTop: "60px" }}>
              <div className="eyebrow" style={{ color: "#d4a17b" }}>Interactive ROI Calculator</div>
              <h3>Salon economics</h3>
              <p>Compare what 15-25% aggregator commission platforms cost you versus flat Snepr SalonOS.</p>

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
                    aria-label="Average daily customers"
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
                    aria-label="Average service ticket"
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
                    aria-label="Working days per month"
                  />
                </div>
              </div>

              <div className="field" style={{ marginTop: "24px" }}>
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
                  aria-label="Comparison commission rate"
                />
              </div>

              <div className="result">
                <div>
                  <small>Estimated monthly revenue</small>
                  <strong id="revenue">{money(revenue)}</strong>
                </div>
                <div>
                  <small>Modelled commission</small>
                  <strong id="commission" style={{ color: "#b95d52" }}>
                    {money(commission)}
                  </strong>
                </div>
                <div>
                  <small>Modelled difference</small>
                  <strong id="saving" style={{ color: "#4f8b68" }}>
                    {money(saving)}
                  </strong>
                </div>
              </div>

              <p style={{ margin: "14px 0 0" }}>
                Illustrative model based on your inputs. Monthly revenue = daily clients × ticket × days. Difference = commission lost on aggregator platforms minus Snepr flat subscription (₹400/mo).
              </p>
            </div>

            {/* ─── SIDE-BY-SIDE COMPARISON TABLE ─── */}
            <div className="reveal" style={{ marginTop: "60px" }}>
              <div className="section-head" style={{ marginBottom: "24px" }}>
                <div>
                  <div className="eyebrow">Direct Comparison</div>
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
                    <td>Fixed monthly subscription (from ₹199/mo)</td>
                  </tr>
                  <tr>
                    <td>Service revenue</td>
                    <td>Commission deducted from each cut</td>
                    <td>Keep 100% of all cash, UPI & card payments</td>
                  </tr>
                  <tr>
                    <td>Customer relationship</td>
                    <td>Customer data owned by platform</td>
                    <td>Direct relationship between salon and client</td>
                  </tr>
                  <tr>
                    <td>Queue visibility</td>
                    <td>Rigid appointment slots or walk-in chaos</td>
                    <td>Chair-level live queue & real-time countdown</td>
                  </tr>
                  <tr>
                    <td>Client accessibility</td>
                    <td>Mandatory app download required</td>
                    <td>Instant browser access, no download needed</td>
                  </tr>
                  <tr>
                    <td>Setup & standees</td>
                    <td>Generic listing</td>
                    <td>Custom QR standee for walk-in self check-in</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ─── PRICING FAQ ─── */}
            <div className="faq-list reveal delay" style={{ marginTop: "60px" }}>
              <div className="section-head" style={{ marginBottom: "20px" }}>
                <div>
                  <div className="eyebrow">Owner FAQ</div>
                  <h2>Questions about <em>plans & billing.</em></h2>
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
                  We provide a custom tabletop QR standee for your reception desk. Walk-in customers scan the QR code to take their digital token without crowding the waiting area.
                </p>
              </details>

              <details>
                <summary>Can I test SalonOS before committing?</summary>
                <p>
                  Yes! We offer a 14-day risk-free preview for salons in Bhubaneswar. Our local team assists with staff training and standee setup.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="final-cta" style={{ marginTop: "60px" }}>
          <div className="wrap">
            <div className="eyebrow">Zero commission · Total control</div>
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

      {/* ─── FOOTER ─── */}
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
              <a href="/#discover">Explore salons</a>
              <a href="/#discover">Live queues</a>
              <a href="/#how">How it works</a>
              <a href="/#ai">AI Studio</a>
              <a href="/#points">Snepr Points</a>
            </div>
            <div className="foot-col">
              <b>Salon owners</b>
              <a href="/pricing">SalonOS plans</a>
              <a href="/pricing">No-commission pricing</a>
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

with open('src/routes/_marketing/pricing.tsx', 'w', encoding='utf-8') as f:
    f.write(pricing_code)

print("Wrote dedicated pricing page to src/routes/_marketing/pricing.tsx! Length:", len(pricing_code))
