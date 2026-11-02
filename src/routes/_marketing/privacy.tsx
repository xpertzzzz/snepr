import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy | Snepr" },
      { name: "description", content: "Privacy Policy for Snepr app and salon services." }
    ],
  }),
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16 w-full">
      <div className="mb-10">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8c4d27] bg-[#f2e6dc] px-3 py-1 rounded-full">
          Data Protection
        </span>
        <h1 className="mt-3 mb-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#211914] font-serif">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#81736a]">Last Updated: November 2026 · Snepr Technologies, Bhubaneswar, India</p>
      </div>

      <div className="rounded-3xl border border-[#e9dfd5] bg-[#fffdfa] p-6 sm:p-10 space-y-8 text-sm text-[#81736a] leading-relaxed shadow-xs">
        <p className="text-base text-[#211914] font-medium leading-relaxed">
          At Snepr, your privacy and data security are our highest priorities. This Privacy Policy details the transparent policies and procedures governing the collection, use, and disclosure of your personal data when using the Snepr ecosystem.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">1. Information We Collect</h2>
          <p>We collect only the minimum necessary information to facilitate seamless salon waitlist and chair operations:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authentication Data:</strong> Name, verified email address, or phone number used for login and queue confirmation alerts.</li>
            <li><strong>Locality Preferences:</strong> Chosen neighborhood (e.g. Patia, KIIT Road, Jaydev Vihar) for discovering relevant salons. We never require continuous background GPS tracking.</li>
            <li><strong>Queue Telemetry:</strong> Queue tokens joined, services chosen, and arrival check-ins for estimating chair wait times.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">2. How Your Information Is Used</h2>
          <p>
            Your information is used strictly to power live queue operations: sending arrival alerts, displaying your token position, and providing anonymized chair analytics to salon operators. We never sell your personal contact information to third-party advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">3. Data Deletion & Control</h2>
          <p>
            You have full control over your data. You may request complete erasure of your profile and history anytime via the{" "}
            <a href="/delete-account" className="text-[#8c4d27] font-semibold underline">
              Account Deletion Page
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">4. Contact Data Privacy Officer</h2>
          <p>
            Questions or concerns regarding your privacy? Contact our Bhubaneswar privacy desk at:
            <br />
            Email: <a href="mailto:support@snepr.in" className="text-[#8c4d27] font-semibold underline">support@snepr.in</a>
          </p>
        </section>
      </div>
    </div>
  );
}
