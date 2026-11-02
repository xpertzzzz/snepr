import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/terms-of-service")({
  component: TermsOfServicePage,
  head: () => ({
    meta: [{ title: "Terms of Service | Snepr" }],
  }),
});

function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16 w-full">
      <div className="mb-10">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8c4d27] bg-[#f2e6dc] px-3 py-1 rounded-full">
          Legal Agreement
        </span>
        <h1 className="mt-3 mb-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#211914] font-serif">
          Terms of Service
        </h1>
        <p className="text-xs text-[#81736a]">Last Updated: November 2026 · Snepr Technologies, Bhubaneswar, India</p>
      </div>

      <div className="rounded-3xl border border-[#e9dfd5] bg-[#fffdfa] p-6 sm:p-10 space-y-8 text-sm text-[#81736a] leading-relaxed shadow-xs">
        <p className="text-base text-[#211914] font-medium leading-relaxed">
          These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Snepr ("we," "us" or "our"), concerning your access to and use of the Snepr web and mobile applications.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Snepr, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access or use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">2. Description of Service</h2>
          <p>
            Snepr provides a digital queue orchestration and chair wait time discovery platform for salons and customers. Snepr connects customers with nearby salons in Bhubaneswar. We do not provide physical hair styling services and are not liable for service delivery at the individual salon. Estimated wait times are dynamic calculations based on reported salon telemetry.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">3. User Accounts & Fair Use</h2>
          <p>
            When registering an account via Google Authentication or Phone OTP, you agree to provide authentic and accurate details. Customers may only hold one active queue token per chair category at a time. Abuse or spamming of digital tokens may result in temporary account restrictions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">4. 0% Haircut Commission Commitment</h2>
          <p>
            Snepr never charges customers or salon partners a commission on haircut transactions. All haircuts and services are paid directly to the salon at the physical counter. Salon owners pay flat, transparent monthly software subscription fees for SalonOS.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">5. Contact Information</h2>
          <p>
            For questions regarding these Terms of Service, contact our Bhubaneswar legal desk at:
            <br />
            Email: <a href="mailto:support@snepr.in" className="text-[#8c4d27] font-semibold underline">support@snepr.in</a>
          </p>
        </section>
      </div>
    </div>
  );
}
