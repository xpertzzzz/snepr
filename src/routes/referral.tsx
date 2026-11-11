import { createFileRoute } from "@tanstack/react-router";
import { ReferralHub } from "@/components/referral/ReferralHub";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/referral")({
  head: () => ({
    title: "Invite Friends & Salons | Snepr",
    meta: [
      {
        name: "description",
        content: "Share your Snepr referral link to invite friends or salons and earn rewards on completed visits.",
      },
    ],
  }),
  component: ReferralPage,
});

function ReferralPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 py-10">
        <ReferralHub />
      </main>
      <Footer />
    </div>
  );
}

