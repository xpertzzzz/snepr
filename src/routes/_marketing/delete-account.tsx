import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/delete-account")({
  component: DeleteAccountPage,
  head: () => ({
    meta: [
      { title: "Account Deletion | Snepr" },
      { name: "description", content: "Request deletion of your Snepr account and associated data." }
    ],
  }),
});

function DeleteAccountPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16 w-full">
      <div className="mb-10">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8c4d27] bg-[#f2e6dc] px-3 py-1 rounded-full">
          Data Governance
        </span>
        <h1 className="mt-3 mb-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#211914] font-serif">
          Account & Data Deletion
        </h1>
        <p className="text-xs text-[#81736a]">Last Updated: November 2026 · Snepr Technologies, Bhubaneswar, India</p>
      </div>

      <div className="rounded-3xl border border-[#e9dfd5] bg-[#fffdfa] p-6 sm:p-10 space-y-8 text-sm text-[#81736a] leading-relaxed shadow-xs">
        <p className="text-base text-[#211914] font-medium leading-relaxed">
          At Snepr, we value your sovereignty over your personal data. If you choose to stop using Snepr services, you can request immediate and permanent erasure of your account and personal records.
        </p>

        <section className="bg-[#f7f3ed] p-6 sm:p-8 rounded-2xl border border-[#e9dfd5] space-y-3">
          <h2 className="text-base font-bold font-serif text-[#211914]">
            How to Request Account Deletion
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[#81736a]">
            <li>
              <strong>Instant In-App Deletion:</strong> Log into Snepr, navigate to <strong>Profile → Account Settings → Delete Account</strong>, and confirm your request.
            </li>
            <li>
              <strong>Direct Email Request:</strong> Send an email from your registered email address to{" "}
              <a href="mailto:support@snepr.in" className="text-[#8c4d27] font-semibold underline">
                support@snepr.in
              </a>{" "}
              with the subject line <strong>"Account Deletion Request"</strong>. Include your registered mobile number or email.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">What happens when your account is deleted?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your personal profile credentials (name, phone number, email address, password hash) are permanently removed from all production databases.</li>
            <li>Any active queue positions, appointment tokens, or saved salon lists are automatically cancelled and discarded.</li>
            <li>If you are a salon partner, your salon desk access will be revoked and queued telemetry unlinked.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-serif text-[#211914]">Processing Time</h2>
          <p>
            In-app deletion is executed immediately. Email deletion requests are verified and completed within <strong>24 to 48 hours</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
