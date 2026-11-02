import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import "@/styles/snepr-final.css";

export const Route = createFileRoute("/_marketing/pricing")({
  head: () => ({
    title: "SalonOS Pricing & Plans | Snepr",
    meta: [
      {
        name: "description",
        content:
          "Simple flat SaaS pricing for salons in Bhubaneswar. Starting at ₹199/month. Zero haircut commissions. Keep 100% of your service earnings.",
      },
      { name: "theme-color", content: "#f7f3ed" },
    ],
  }),
  component: PricingPageStrict,
});

const PRICING_FAQS = [
  {
    q: "Are there any monthly commissions or hidden fees on haircuts?",
    a: "No percentage is deducted from your haircut or grooming service revenue under any stated plan. You only pay the transparent, flat monthly subscription fee.",
  },
  {
    q: "How does Snepr make money if customers don't pay commissions?",
    a: "Snepr is a pure software-as-a-service (SaaS) platform funded by affordable salon software subscriptions. Customers use the live wait times and virtual queues 100% free.",
  },
  {
    q: "Can I manage multiple barber chairs with one salon subscription?",
    a: "Yes. The Base plan covers a single barber chair, the Intermediate plan covers up to 3 chairs with individual staff logins, and the Pro plan covers unlimited chairs.",
  },
  {
    q: "How quickly can my salon start taking queue tokens?",
    a: "Onboarding takes less than 5 minutes. You don't need any specialized hardware—just any smartphone, tablet, or laptop at your front desk or styling mirror.",
  },
  {
    q: "Can I pause or cancel my subscription anytime?",
    a: "Yes. There are no lock-in contracts. You can pause, upgrade, or cancel your subscription directly from your SalonOS dashboard anytime.",
  },
];

export function PricingPageStrict() {
  /* ─── ECONOMICS CALCULATOR STATE ─── */
  const [dailyCustomers, setDailyCustomers] = useState(35);
  const [ticketSize, setTicketSize] = useState(350);
  const [workingDays, setWorkingDays] = useState(26);
  const [commissionRate, setCommissionRate] = useState(25);
  const [selectedPlanCost, setSelectedPlanCost] = useState(400);

  const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
  const estimatedRevenue = dailyCustomers * ticketSize * workingDays;
  const modeledCommission = Math.round((estimatedRevenue * commissionRate) / 100);
  const modeledDifference = modeledCommission - selectedPlanCost;

  /* ─── FAQ ACCORDION STATE ─── */
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({ 0: true });
  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="snepr-landing-page bg-[#f7f3ed] text-[#211914] min-h-screen">
      {/* ─── 1. PLANS HEADER & GRID ─── */}
      <section className="section pricing !pt-10 sm:!pt-14" id="pricing">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="kicker">SalonOS plans</div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#211914] leading-[1.08]">
                Simple pricing. No haircut commissions.
              </h1>
              <p className="sub mt-2 text-[#81736a] text-base sm:text-lg">
                Monthly plans. An annual option appears only once billing supports it. Keep 100% of your earnings.
              </p>
            </div>
          </div>

          <div className="pg">
            {/* BASE PLAN */}
            <article className="pc">
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
                <li>QR standee for counter</li>
                <li>Basic customer alerts</li>
                <li>Verified reviews</li>
              </ul>
              <Link className="btn btn-out" to="/partner/register">
                Start with Base
              </Link>
            </article>

            {/* INTERMEDIATE PLAN (MOST POPULAR) */}
            <article className="pc f">
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

            {/* PRO PLAN */}
            <article className="pc">
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
            Feature lists match backend entitlements. No setup fees or hardware lock-in required.
          </p>
        </div>
      </section>

      {/* ─── 2. SALON ECONOMICS CALCULATOR ─── */}
      <section className="section calc !py-16" id="calc">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="kicker">Salon economics</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#211914]">
                See what commission based platforms could cost your salon.
              </h2>
            </div>
          </div>
          <div className="cb2">
            <div>
              <div className="ctl">
                <label htmlFor="c1">
                  Average daily customers <output id="o1">{dailyCustomers}</output>
                </label>
                <input
                  id="c1"
                  type="range"
                  min="5"
                  max="120"
                  value={dailyCustomers}
                  onChange={(e) => setDailyCustomers(Number(e.target.value))}
                />
              </div>

              <div className="ctl">
                <label htmlFor="c2">
                  Average service ticket <output id="o2">{inr(ticketSize)}</output>
                </label>
                <input
                  id="c2"
                  type="range"
                  min="50"
                  max="1500"
                  step="10"
                  value={ticketSize}
                  onChange={(e) => setTicketSize(Number(e.target.value))}
                />
              </div>

              <div className="ctl">
                <label htmlFor="c3">
                  Working days per month <output id="o3">{workingDays}</output>
                </label>
                <input
                  id="c3"
                  type="range"
                  min="10"
                  max="31"
                  value={workingDays}
                  onChange={(e) => setWorkingDays(Number(e.target.value))}
                />
              </div>

              <div className="ctl">
                <label htmlFor="c4">
                  Comparison commission rate <output id="o4">{commissionRate}%</output>
                </label>
                <input
                  id="c4"
                  type="range"
                  min="5"
                  max="40"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                />
              </div>

              <div className="ctl">
                <label htmlFor="c5">Snepr plan</label>
                <select
                  id="c5"
                  value={selectedPlanCost}
                  onChange={(e) => setSelectedPlanCost(Number(e.target.value))}
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
                <b id="rv">{inr(estimatedRevenue)}</b>
              </div>
              <div className="rr">
                <span>Modelled commission ({commissionRate}%)</span>
                <b id="rc" className="text-red-300">
                  {inr(modeledCommission)}
                </b>
              </div>
              <div className="rr">
                <span>Snepr flat subscription</span>
                <b id="rs" className="text-emerald-300">
                  {inr(selectedPlanCost)}
                </b>
              </div>

              <div className="big">
                <small>MODELLED DIFFERENCE PER MONTH</small>
                <strong id="rd">{inr(modeledDifference)}</strong>
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

      {/* ─── 3. DIFFERENTIATION COMPARISON TABLE ─── */}
      <section className="section cmpS !py-16">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="kicker">Differentiation</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#211914]">
                A different model for independent salons.
              </h2>
            </div>
          </div>
          <table>
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
                <td>Often a percentage of bookings (20% – 30%)</td>
                <td>Fixed monthly subscription (from ₹199)</td>
              </tr>
              <tr>
                <td>Service revenue</td>
                <td>Commission deducted on every haircut</td>
                <td>No percentage deducted under stated plans</td>
              </tr>
              <tr>
                <td>Customer relationship</td>
                <td>Intermediated by marketplace platform</td>
                <td>Direct between salon and customer</td>
              </tr>
              <tr>
                <td>Queue visibility</td>
                <td>Often static slot appointments only</td>
                <td>Live chair countdown & real-time digital queue</td>
              </tr>
              <tr>
                <td>Customer access</td>
                <td>Requires customer app download</td>
                <td>Instant browser-based access, no app needed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 4. FAQ ─── */}
      <section className="section faq !py-16" id="faq">
        <div className="wrap fl">
          <div>
            <div className="kicker">Help</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#211914]">
              Good to know.
            </h2>
            <p className="sub">
              Everything you need to know about our flat pricing and billing commitments.
            </p>
          </div>
          <div>
            <div id="fb">
              {PRICING_FAQS.map((q, idx) => (
                <div key={q.q} className={`fi ${openFaq[idx] ? "open" : ""}`}>
                  <button
                    className="fq"
                    aria-expanded={Boolean(openFaq[idx])}
                    onClick={() => toggleFaq(idx)}
                  >
                    {q.q}
                    <span>{openFaq[idx] ? "×" : "+"}</span>
                  </button>
                  <div className="fa">
                    <div>
                      <p>{q.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. BOTTOM CTA ─── */}
      <section className="cta !py-16">
        <div className="wrap">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to take control of your chairs?
            </h2>
            <p className="text-[#ead8ca] mt-2 mb-6">
              Join leading barbershops and salons in Bhubaneswar. Onboard in under 5 minutes.
            </p>
            <div className="acts">
              <Link className="btn" to="/partner/register">
                Register your salon
              </Link>
              <Link className="btn o" to="/partner/claim">
                Claim your salon
              </Link>
              <Link className="btn o" to="/live">
                View Live Queues
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PricingPageStrict;
