import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserPoints } from "../../backend/functions/points";
import { submitVerifiedReview } from "../../backend/functions/reviews";
import {
  Sparkles, Award, Star, Clock, CheckCircle2, ChevronLeft, MapPin,
  MessageSquare, ArrowRight, X, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DockNavbar } from "@/components/layout/DockNavbar";

export const Route = createFileRoute("/live/activity")({
  head: () => ({
    meta: [
      { title: "My Activity & Snepr Points | Snepr" },
      { name: "description", content: "View past salon visits, verified review rewards, and live Snepr points balance." },
    ],
  }),
  component: AppActivity,
});

function AppActivity() {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<any>(null);

  // Review modal state
  const [reviewModalVisit, setReviewModalVisit] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snepr_session");
      if (stored) setSession(JSON.parse(stored));
    } catch {}
  }, []);

  const userId = session?.id || 1;

  const { data: pointsData, isLoading: loadingPoints } = useQuery({
    queryKey: ["user-points", userId],
    queryFn: () => getUserPoints({ data: { userId } }),
  });

  const reviewMutation = useMutation({
    mutationFn: () =>
      submitVerifiedReview({
        data: {
          customerId: userId,
          salonId: reviewModalVisit?.salonId || 1,
          queueId: reviewModalVisit?.queueId || 101,
          rating: reviewRating,
          comment: reviewComment,
        },
      }),
    onSuccess: (res) => {
      toast.success("Verified review submitted! Earned +10 Snepr Points");
      queryClient.invalidateQueries({ queryKey: ["user-points"] });
      setReviewModalVisit(null);
      setReviewComment("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit review.");
    },
  });

  const pastVisits = [
    {
      id: 1,
      salonId: 1,
      queueId: 101,
      salonName: "The Scissors Edge",
      address: "Saheed Nagar, Bhubaneswar",
      service: "Signature Haircut & Style",
      date: "Oct 28, 2026",
      priceRs: 250,
      status: "completed",
      hasReviewed: false,
    },
    {
      id: 2,
      salonId: 2,
      queueId: 102,
      salonName: "Urban Look Salon",
      address: "Jaydev Vihar, Bhubaneswar",
      service: "Beard Trim & Clean-up",
      date: "Oct 15, 2026",
      priceRs: 150,
      status: "completed",
      hasReviewed: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-2 text-ink font-sans pb-24">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/live"
            className="w-9 h-9 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-ink transition-colors active:scale-95 border border-border/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-bold text-ink font-display">My Activity &amp; Wallet</h1>
        </div>

        <Link to="/live" className="text-xs font-bold text-primary hover:underline">
          Live Queues
        </Link>
      </header>

      <main className="max-w-2xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* ─── SNEPR POINTS WALLET (PILLAR 2: FAIR REWARDS) ─── */}
        <div className="bg-gradient-to-br from-[#2A1D15] via-[#1A1714] to-[#1A1714] border border-[#7A4B29]/40 rounded-3xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D4A373]/20 text-[#D4A373] border border-[#D4A373]/30 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Snepr Points Wallet
            </span>
            <span className="text-xs text-[#8E867E]">Standard Platform Ledger</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black font-display text-white tracking-tight">
              {loadingPoints ? "…" : pointsData?.balance || 35}
            </span>
            <span className="text-base font-bold text-[#D4A373]">Points Balance</span>
          </div>

          <p className="text-xs text-[#A69F96] leading-relaxed">
            Points are earned automatically: <span className="text-white font-bold">+5 Points</span> for every completed visit and{" "}
            <span className="text-white font-bold">+10 Points</span> for every verified review (1–5★ rewarded equally).
          </p>

          <div className="pt-2 border-t border-[#7A4B29]/30 flex items-center justify-between text-xs text-[#D4A373]">
            <span>100 Points = ₹50 Salon Credit</span>
            <span className="font-semibold text-white/80">Zero Expiry</span>
          </div>
        </div>

        {/* ─── PAST VISITS & REVIEW TRIGGER ─── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              Past Queue Visits
            </h2>
            <span className="text-[11px] text-ink-soft">Verified on backend</span>
          </div>

          <div className="space-y-3">
            {pastVisits.map((visit) => (
              <div
                key={visit.id}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-ink">{visit.salonName}</h3>
                    <p className="text-[11px] text-ink-soft flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>{visit.address}</span>
                    </p>
                    <p className="text-xs text-ink font-medium mt-1">
                      {visit.service} • {visit.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-ink">₹{visit.priceRs}</span>
                    <span className="block text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mt-1">
                      Completed (+5 pts)
                    </span>
                  </div>
                </div>

                {/* Review Action */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  {visit.hasReviewed ? (
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Review Submitted (+10 pts)</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setReviewModalVisit(visit)}
                      className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Write Verified Review (+10 pts)</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ─── VERIFIED REVIEW SUBMISSION MODAL ─── */}
      {reviewModalVisit && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-ink">Verified Salon Review</h3>
                <p className="text-xs text-ink-soft">{reviewModalVisit.salonName}</p>
              </div>
              <button
                onClick={() => setReviewModalVisit(null)}
                className="w-8 h-8 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center text-ink-soft hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fair Rating Notice (Section 9) */}
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-[11px] text-ink-soft">
              <span className="font-bold text-primary block mb-0.5">Snepr Trust Guarantee</span>
              Your honest feedback helps the community. You earn the full <span className="font-bold text-ink">+10 points</span> regardless of whether you give 1 star or 5 stars!
            </div>

            {/* Star Selector */}
            <div className="text-center space-y-1.5 py-2">
              <p className="font-bold text-ink text-sm">Select Your Experience Rating</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={cn(
                        "w-8 h-8",
                        star <= reviewRating ? "fill-amber-500 text-amber-500" : "text-border"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How was the haircut pace, chair hygiene, and barber service? (Optional)"
              className="w-full bg-surface-2 border border-border rounded-xl p-3 text-xs text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary"
            />

            <button
              disabled={reviewMutation.isPending}
              onClick={() => reviewMutation.mutate()}
              className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 text-primary-foreground font-bold text-xs rounded-xl transition-all shadow-md"
            >
              {reviewMutation.isPending ? "Submitting Review…" : "Submit Review & Claim +10 Points"}
            </button>
          </div>
        </div>
      )}
      {/* Dock-styled bottom navigation */}
      <div className="h-24" />
      <DockNavbar activeTab="points" />
    </div>
  );
}
